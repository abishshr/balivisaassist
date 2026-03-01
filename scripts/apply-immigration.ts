#!/usr/bin/env npx tsx
/**
 * Semi-automated immigration form filler for evisa.imigrasi.go.id
 *
 * Usage:
 *   npx tsx scripts/apply-immigration.ts <applicationId>
 *
 * Prerequisites:
 *   - .env.local with NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 *     IMMIGRATION_EMAIL, IMMIGRATION_PASSWORD
 *   - Playwright browsers installed: npx playwright install chromium
 *
 * Flow:
 *   1. Fetches application data from Supabase
 *   2. Opens a visible Chromium browser
 *   3. Logs in (admin solves reCAPTCHA via Playwright Inspector)
 *   4. Selects visa type through the multi-step selection wizard
 *   5. Uploads passport scan and photo (Step 1)
 *   6. Fills applicant details form (Step 2)
 *   7. Uploads supporting documents (Step 3)
 *   8. Stops before final submission for manual review
 */

import { chromium, type Page } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

// Load environment variables from .env.local
import * as dotenv from 'dotenv'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const IMMIGRATION_URL = 'https://evisa.imigrasi.go.id'
const IMMIGRATION_LOGIN_URL = `${IMMIGRATION_URL}/front/login`
const VISA_SELECTION_URL = `${IMMIGRATION_URL}/web/visa-selection`

const IMMIGRATION_EMAIL = process.env.IMMIGRATION_EMAIL || ''
const IMMIGRATION_PASSWORD = process.env.IMMIGRATION_PASSWORD || ''

// Mapping from our nationality values to the portal's country names
const NATIONALITY_MAP: Record<string, string> = {
  'USA': 'UNITED STATES OF AMERICA',
  'US': 'UNITED STATES OF AMERICA',
  'American': 'UNITED STATES OF AMERICA',
  'Australian': 'AUSTRALIA',
  'AU': 'AUSTRALIA',
  'British': 'UNITED KINGDOM - BRITISH CITIZEN',
  'UK': 'UNITED KINGDOM - BRITISH CITIZEN',
  'Canadian': 'CANADA',
  'CA': 'CANADA',
  'German': 'GERMANY',
  'DE': 'GERMANY',
  'French': 'FRANCE',
  'FR': 'FRANCE',
  'Dutch': 'NETHERLANDS',
  'NL': 'NETHERLANDS',
  'Japanese': 'JAPAN',
  'JP': 'JAPAN',
  'Chinese': 'CHINA',
  'CN': 'CHINA',
  'Indian': 'INDIA',
  'IN': 'INDIA',
  'Russian': 'RUSSIA',
  'RU': 'RUSSIA',
  'Brazilian': 'BRAZIL',
  'BR': 'BRAZIL',
  'South African': 'REPUBLIC OF SOUTH AFRICA',
  'ZA': 'REPUBLIC OF SOUTH AFRICA',
  'New Zealand': 'NEW ZEALAND',
  'NZ': 'NEW ZEALAND',
  'Singapore': 'SINGAPORE',
  'SG': 'SINGAPORE',
  'Malaysian': 'MALAYSIA',
  'MY': 'MALAYSIA',
  'Korean': 'REPUBLIC OF KOREA',
  'KR': 'REPUBLIC OF KOREA',
}

// Visa type selection mapping: service_id -> { purpose, subPurpose, visaType }
const VISA_SELECTION_MAP: Record<string, { purpose: string; subPurpose: string; visaType: string }> = {
  'd12-visa-2year': {
    purpose: 'Investment, Business, or Government',
    subPurpose: 'Investment',
    visaType: 'D12 - Pre-Investment Multiple Entry Visa (2 Years)',
  },
  'd12-visa-1year': {
    purpose: 'Investment, Business, or Government',
    subPurpose: 'Investment',
    visaType: 'D12 - Pre-Investment Multiple Entry Visa (1 Year)',
  },
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PreparedData {
  application: {
    id: string
    application_number: string
    service_id: string
    service_name: string
    status: string
  }
  customer: {
    first_name: string
    last_name: string
    nationality: string
    passport_number: string | null
    passport_expiry: string | null
    date_of_birth: string | null
    email: string | null
    place_of_birth: string | null
    phone_number: string | null
    indonesia_residence_type: string | null
    indonesia_address: string | null
    indonesia_postal_code: string | null
    indonesia_province: string | null
    indonesia_city: string | null
  }
  documents: Array<{
    type: string
    file_name: string
    mime_type: string
    base64: string
  }>
  passportScan: {
    file_name: string
    mime_type: string
    base64: string
  } | null
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function saveTempFile(doc: { file_name: string; base64: string }): string {
  const tmpDir = path.join(os.tmpdir(), 'bva-immigration')
  fs.mkdirSync(tmpDir, { recursive: true })
  const filePath = path.join(tmpDir, doc.file_name)
  fs.writeFileSync(filePath, Buffer.from(doc.base64, 'base64'))
  return filePath
}

function cleanupTempFiles() {
  const tmpDir = path.join(os.tmpdir(), 'bva-immigration')
  if (fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }
}

function log(message: string) {
  console.log(`[BVA] ${message}`)
}

function logStep(step: number, message: string) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`  Step ${step}: ${message}`)
  console.log(`${'='.repeat(60)}\n`)
}

/**
 * Select an option from a custom searchable combobox dropdown.
 * The portal uses custom dropdowns (not native <select>), so we click to open,
 * then type to filter, then click the matching option.
 */
async function selectComboboxOption(page: Page, comboboxName: string, optionText: string) {
  const combobox = page.getByRole('combobox', { name: comboboxName })
  await combobox.click()
  // Type to filter if there's a search input
  const searchbox = page.getByRole('searchbox')
  if (await searchbox.isVisible().catch(() => false)) {
    await searchbox.fill(optionText.substring(0, 10))
    await page.waitForTimeout(500)
  }
  await page.getByRole('option', { name: optionText, exact: true }).click()
  log(`  Selected: "${optionText}" from "${comboboxName}" dropdown`)
  await page.waitForTimeout(500)
}

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

async function fetchApplicationData(applicationId: string): Promise<PreparedData> {
  log(`Fetching data for application: ${applicationId}`)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local'
    )
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Fetch application with customer
  const { data: appData, error: appError } = await supabase
    .from('applications')
    .select(`*, customer:customers (*)`)
    .eq('id', applicationId)
    .single()

  if (appError || !appData) {
    throw new Error(`Application not found: ${appError?.message || 'No data'}`)
  }

  const application = appData as any
  const customer = application.customer

  // Fetch documents
  const { data: docsData, error: docsError } = await supabase
    .from('documents')
    .select('*')
    .eq('application_id', applicationId)
    .order('created_at', { ascending: false })

  if (docsError) {
    throw new Error(`Failed to fetch documents: ${docsError.message}`)
  }

  // Download each document
  const documents = []
  for (const doc of docsData || []) {
    const d = doc as any
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(d.file_path)

    if (downloadError || !fileData) {
      log(`Warning: Could not download ${d.file_name}: ${downloadError?.message}`)
      continue
    }

    const arrayBuffer = await fileData.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')

    documents.push({
      type: d.type,
      file_name: d.file_name,
      mime_type: d.mime_type,
      base64,
    })
  }

  // Download passport scan from customer record if available
  let passportScan = null
  if (customer.passport_scan_path) {
    log(`Downloading passport scan from: ${customer.passport_scan_path}`)
    const { data: scanData, error: scanError } = await supabase.storage
      .from('documents')
      .download(customer.passport_scan_path)

    if (scanData && !scanError) {
      const arrayBuffer = await scanData.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      const ext = customer.passport_scan_path.split('.').pop() || 'jpg'
      passportScan = {
        file_name: `passport-scan.${ext}`,
        mime_type: `image/${ext === 'png' ? 'png' : 'jpeg'}`,
        base64,
      }
      log('  Passport scan downloaded successfully')
    } else {
      log(`  Warning: Could not download passport scan: ${scanError?.message}`)
    }
  }

  log(`Fetched: ${customer.first_name} ${customer.last_name}, ${documents.length} documents${passportScan ? ', passport scan' : ''}`)

  return {
    application: {
      id: application.id,
      application_number: application.application_number,
      service_id: application.service_id,
      service_name: application.service_name,
      status: application.status,
    },
    customer: {
      first_name: customer.first_name,
      last_name: customer.last_name,
      nationality: customer.nationality,
      passport_number: customer.passport_number,
      passport_expiry: customer.passport_expiry,
      date_of_birth: customer.date_of_birth,
      email: customer.email,
      place_of_birth: customer.place_of_birth,
      phone_number: customer.phone_number,
      indonesia_residence_type: customer.indonesia_residence_type,
      indonesia_address: customer.indonesia_address,
      indonesia_postal_code: customer.indonesia_postal_code,
      indonesia_province: customer.indonesia_province,
      indonesia_city: customer.indonesia_city,
    },
    documents,
    passportScan,
  }
}

// ---------------------------------------------------------------------------
// Main automation flow
// ---------------------------------------------------------------------------

async function main() {
  const applicationId = process.argv[2]

  if (!applicationId) {
    console.error('Usage: npx tsx scripts/apply-immigration.ts <applicationId>')
    console.error('Example: npx tsx scripts/apply-immigration.ts 123e4567-e89b-12d3-a456-426614174000')
    process.exit(1)
  }

  // ── Fetch data ──────────────────────────────────────────────────────────
  logStep(1, 'Fetching application data')
  const data = await fetchApplicationData(applicationId)

  log(`Application: ${data.application.application_number} (${data.application.service_name})`)
  log(`Customer: ${data.customer.first_name} ${data.customer.last_name}`)
  log(`Nationality: ${data.customer.nationality}`)
  log(`Passport: ${data.customer.passport_number || 'N/A'}`)
  log(`Documents: ${data.documents.length} files`)

  // Resolve nationality to portal country name
  const portalCountry = NATIONALITY_MAP[data.customer.nationality] || data.customer.nationality.toUpperCase()
  log(`Portal country: ${portalCountry}`)

  // Resolve visa selection
  const visaSelection = VISA_SELECTION_MAP[data.application.service_id]
  if (!visaSelection) {
    throw new Error(`No visa selection mapping for service_id: ${data.application.service_id}. Supported: ${Object.keys(VISA_SELECTION_MAP).join(', ')}`)
  }

  // Save documents to temp files for upload
  const tempFiles: Record<string, string> = {}
  for (const doc of data.documents) {
    const filePath = saveTempFile(doc)
    tempFiles[doc.type] = filePath
    log(`  Saved temp file: ${doc.type} -> ${filePath}`)
  }

  // Save passport scan to temp file
  if (data.passportScan) {
    const filePath = saveTempFile(data.passportScan)
    tempFiles['passport_scan'] = filePath
    log(`  Saved temp file: passport_scan -> ${filePath}`)
  }

  // ── Launch browser ──────────────────────────────────────────────────────
  logStep(2, 'Launching browser')
  const browser = await chromium.launch({
    headless: false,
    slowMo: 100,
  })

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  })

  const page = await context.newPage()

  try {
    // ── Login ─────────────────────────────────────────────────────────────
    logStep(3, 'Logging in to immigration portal')
    await page.goto(IMMIGRATION_LOGIN_URL, { waitUntil: 'networkidle' })

    // Fill credentials
    if (IMMIGRATION_EMAIL) {
      await page.getByRole('textbox', { name: 'Email' }).fill(IMMIGRATION_EMAIL)
      log(`  Filled email: ${IMMIGRATION_EMAIL}`)
    }
    if (IMMIGRATION_PASSWORD) {
      await page.getByRole('textbox', { name: 'Password' }).fill(IMMIGRATION_PASSWORD)
      log('  Filled password: ****')
    }

    // Pause for admin to solve reCAPTCHA
    log('')
    log('>>> Please solve the reCAPTCHA in the browser window.')
    log('>>> Then click "Resume" in the Playwright Inspector to continue.')
    log('')
    await page.pause()

    // Click submit if still on login page
    if (page.url().includes('login')) {
      await page.getByRole('link', { name: 'Submit' }).click()
      await page.waitForURL((url) => !url.toString().includes('login'), { timeout: 30000 })
    }
    log('Login successful!')

    // ── Visa selection wizard ─────────────────────────────────────────────
    logStep(4, 'Selecting visa type')
    await page.goto(VISA_SELECTION_URL, { waitUntil: 'networkidle' })

    // 1. Select country/passport
    await selectComboboxOption(page, 'Select', portalCountry)

    // 2. Select purpose
    await selectComboboxOption(page, 'Choose the purpose of your visit', visaSelection.purpose)

    // 3. Select sub-purpose
    await selectComboboxOption(page, 'Choose the purpose of your visit', visaSelection.subPurpose)

    // 4. Select visa type
    await selectComboboxOption(page, 'Please select the type of visa', visaSelection.visaType)

    // 5. Click "Detail & Apply"
    await page.getByRole('button', { name: 'Detail & Apply' }).click()
    await page.waitForTimeout(1000)

    // 6. Click "Apply" in the detail modal
    await page.getByRole('link', { name: 'Apply' }).click()
    await page.waitForURL('**/step_1**', { timeout: 15000 })
    log('Navigated to application form Step 1')

    // ── Step 1: Upload passport scan + photo ──────────────────────────────
    logStep(5, 'Step 1 — Upload passport scan and photo')

    // Upload passport scan via hidden file input
    // Prefer passport_scan (from customer record), fall back to passport document
    const passportScanFile = tempFiles['passport_scan'] || tempFiles['passport']
    if (passportScanFile) {
      log('Uploading passport scan...')
      await page.locator('#passport-attachment').setInputFiles(passportScanFile)
      await page.waitForTimeout(3000) // Wait for MRZ scanner

      // Handle MRZ scanner result dialog
      // If scan succeeds, fields auto-populate. If it fails, dismiss the error.
      const invalidDialog = page.getByRole('button', { name: 'OK' })
      if (await invalidDialog.isVisible().catch(() => false)) {
        log('  MRZ scan returned invalid data — dismissing dialog')
        await invalidDialog.click()
        await page.waitForTimeout(500)
        // Close the scanner preview dialog if still open
        const reuploadBtn = page.getByRole('button', { name: 'Reupload' })
        if (await reuploadBtn.isVisible().catch(() => false)) {
          log('  Note: Passport MRZ could not be read. You may need to re-upload manually.')
        }
      } else {
        log('  MRZ scan processed passport data')
      }
    } else {
      log('  WARNING: No passport scan document found. Upload manually.')
    }

    // Upload photo via hidden file input
    if (tempFiles['passport_photo']) {
      log('Uploading passport photo...')
      await page.locator('#picture').setInputFiles(tempFiles['passport_photo'])
      await page.waitForTimeout(2000)
      log('  Photo uploaded')
    } else {
      log('  WARNING: No passport photo found. Upload manually.')
    }

    log('')
    log('>>> Verify passport scan and photo, then click "Resume" to continue.')
    await page.pause()

    // Click Next to go to Step 2
    await page.getByRole('button', { name: 'Next' }).click()
    await page.waitForURL('**/step_2**', { timeout: 15000 })
    log('Navigated to Step 2')

    // ── Step 2: Fill personal details + upload documents ──────────────────
    // NOTE: Step 2 combines personal details, address, documents, and contact
    // in a single page. MRZ auto-fills: full_name, gender, birthday,
    // passport_number, nationality, expired_date, release_place.
    logStep(6, 'Step 2 — Fill personal details & upload documents')

    // --- Personal Information ---
    // Full name, sex, DOB are auto-filled by MRZ. Fill what's missing.

    // Place of Birth (not auto-filled by MRZ)
    const birthPlace = page.locator('#birth_place')
    if (await birthPlace.isVisible().catch(() => false)) {
      const currentVal = await birthPlace.inputValue()
      if (!currentVal && data.customer.place_of_birth) {
        await birthPlace.fill(data.customer.place_of_birth.toUpperCase())
        log(`  Filled Place of Birth: ${data.customer.place_of_birth.toUpperCase()}`)
      } else if (!currentVal) {
        log('  Place of Birth is empty — verify manually')
      }
    }

    // Phone number
    const phoneField = page.locator('#mobile_phone')
    if (await phoneField.isVisible().catch(() => false)) {
      const currentVal = await phoneField.inputValue()
      if (!currentVal && data.customer.phone_number) {
        await phoneField.fill(data.customer.phone_number)
        log(`  Filled Phone: ${data.customer.phone_number}`)
      } else if (!currentVal) {
        log('  Phone number is empty — verify manually')
      }
    }

    // --- Residence Type ---
    if (data.customer.indonesia_residence_type) {
      try {
        await selectComboboxOption(page, 'Residence Type', data.customer.indonesia_residence_type)
        log(`  Selected Residence Type: ${data.customer.indonesia_residence_type}`)
      } catch {
        log(`  Could not auto-select Residence Type — verify manually`)
      }
    }

    // --- Address in Indonesia ---
    const addressField = page.locator('#address')
    if (await addressField.isVisible().catch(() => false)) {
      const currentVal = await addressField.inputValue()
      if (!currentVal && data.customer.indonesia_address) {
        await addressField.fill(data.customer.indonesia_address.toUpperCase())
        log(`  Filled Address: ${data.customer.indonesia_address.toUpperCase()}`)
      }
    }

    // Postal code
    const postalField = page.locator('#postal_code')
    if (await postalField.isVisible().catch(() => false)) {
      const currentVal = await postalField.inputValue()
      if (!currentVal && data.customer.indonesia_postal_code) {
        await postalField.fill(data.customer.indonesia_postal_code)
        log(`  Filled Postal Code: ${data.customer.indonesia_postal_code}`)
      }
    }

    // Province (try combobox, fallback to text input)
    if (data.customer.indonesia_province) {
      try {
        await selectComboboxOption(page, 'Province', data.customer.indonesia_province.toUpperCase())
        log(`  Selected Province: ${data.customer.indonesia_province.toUpperCase()}`)
      } catch {
        const provinceField = page.locator('#province_name')
        if (await provinceField.isVisible().catch(() => false)) {
          await provinceField.fill(data.customer.indonesia_province.toUpperCase())
          log(`  Filled Province (text): ${data.customer.indonesia_province.toUpperCase()}`)
        } else {
          log('  Could not auto-fill Province — verify manually')
        }
      }
    }

    // City (try combobox, fallback to text input)
    if (data.customer.indonesia_city) {
      try {
        await selectComboboxOption(page, 'City', data.customer.indonesia_city.toUpperCase())
        log(`  Selected City: ${data.customer.indonesia_city.toUpperCase()}`)
      } catch {
        const cityField = page.locator('#city_name')
        if (await cityField.isVisible().catch(() => false)) {
          await cityField.fill(data.customer.indonesia_city.toUpperCase())
          log(`  Filled City (text): ${data.customer.indonesia_city.toUpperCase()}`)
        } else {
          log('  Could not auto-fill City — verify manually')
        }
      }
    }

    // --- Email ---
    const emailField = page.locator('#email')
    if (await emailField.isVisible().catch(() => false)) {
      const currentVal = await emailField.inputValue()
      if (!currentVal && data.customer.email) {
        await emailField.fill(data.customer.email.toUpperCase())
        log(`  Filled email: ${data.customer.email}`)
      }
    }

    const emailConfirm = page.locator('#email_confirmation')
    if (await emailConfirm.isVisible().catch(() => false)) {
      const currentVal = await emailConfirm.inputValue()
      if (!currentVal && data.customer.email) {
        await emailConfirm.fill(data.customer.email)
        log(`  Filled email confirmation: ${data.customer.email}`)
      }
    }

    // --- Document Uploads (all on Step 2 page) ---
    // Main Documents:
    //   #attachment-livingexpenses  → Bank statement (PDF)
    //   #attachment-rekom           → Recommendation/invitation letter (PDF)
    // Support Documents:
    //   #support-D12_8              → Curriculum Vitae (PDF)
    //   #support-D12_9              → Travel Itinerary (PDF)

    const docUploadMap: Array<{ docType: string; inputId: string; label: string }> = [
      { docType: 'bank_statement', inputId: '#attachment-livingexpenses', label: 'Proof of Living Expenses' },
      { docType: 'invitation_letter', inputId: '#attachment-rekom', label: 'Recommendations Related Agencies' },
      { docType: 'sponsorship_letter', inputId: '#attachment-rekom', label: 'Recommendations (sponsor letter)' },
      { docType: 'cv', inputId: '#support-D12_8', label: 'Curriculum Vitae' },
      { docType: 'travel_itinerary', inputId: '#support-D12_9', label: 'Travel Itinerary' },
    ]

    for (const { docType, inputId, label } of docUploadMap) {
      if (tempFiles[docType]) {
        const input = page.locator(inputId)
        if (await input.count() > 0) {
          await input.setInputFiles(tempFiles[docType])
          await page.waitForTimeout(1000)
          log(`  Uploaded ${label}: ${tempFiles[docType]}`)
        } else {
          log(`  WARNING: Upload field ${inputId} not found for ${label}`)
        }
      }
    }

    log('')
    log('>>> Step 2 form is now visible with auto-filled fields.')
    log('>>> Please verify all fields, especially: Place of Birth, Phone, Address.')
    log('>>> Fill District, Village, and Immigration Office manually.')
    log('>>> Upload any remaining documents manually.')
    log('>>> Click "Resume" when ready to proceed.')
    await page.pause()

    // ── Final review ──────────────────────────────────────────────────────
    logStep(7, 'REVIEW — Do NOT submit yet')
    console.log('\n' + '!'.repeat(60))
    console.log('  FORM FILLING COMPLETE')
    console.log('  Please review all fields and documents carefully.')
    console.log('  The browser will remain open for your review.')
    console.log('  Close the browser window when done.')
    console.log('!' .repeat(60) + '\n')

    // Keep browser open until manually closed
    await page.waitForEvent('close', { timeout: 0 }).catch(() => {})

  } catch (error) {
    console.error('\nError during automation:', error)
    log('Pausing browser for manual inspection...')
    await page.pause()
  } finally {
    cleanupTempFiles()
    log('Temp files cleaned up.')
    await context.close()
    await browser.close()
    log('Browser closed. Done.')
  }
}

// Run
main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

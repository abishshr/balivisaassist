import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer'
import path from 'path'

const styles = StyleSheet.create({
  page: {
    paddingTop: 24,
    paddingBottom: 36,
    paddingHorizontal: 48,
    fontFamily: 'Helvetica',
    fontSize: 9,
    lineHeight: 1.5,
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#0F4C5C',
  },
  headerLogo: {
    width: 44,
    height: 44,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerBrand: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#0F4C5C',
    letterSpacing: 0.5,
  },
  headerBrandAccent: {
    color: '#E07A5F',
  },
  headerLegal: {
    fontSize: 7.5,
    color: '#555',
    marginTop: 1,
  },
  headerContact: {
    fontSize: 7,
    color: '#777',
    marginTop: 2,
  },
  title: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metaText: {
    fontSize: 9,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginTop: 10,
    marginBottom: 4,
  },
  paragraph: {
    marginBottom: 4,
    textAlign: 'justify',
    fontSize: 9,
  },
  infoTable: {
    marginBottom: 6,
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  infoLabel: {
    width: 130,
    fontSize: 9,
  },
  infoSeparator: {
    width: 12,
    fontSize: 9,
  },
  infoValue: {
    flex: 1,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 1,
    marginLeft: 12,
  },
  bullet: {
    width: 10,
    fontSize: 9,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  signatureBlock: {
    width: '45%',
  },
  signatureLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    marginTop: 40,
    marginBottom: 4,
  },
  signatureText: {
    fontSize: 9,
    color: '#333',
  },
  signatureImage: {
    width: 120,
    height: 74,
  },
})

export type AgreementLanguage = 'en' | 'id'

const t = {
  en: {
    title: 'SERVICE AGREEMENT',
    date: 'Date',
    preamble: 'This Service Agreement ("Agreement") is entered into by and between:',
    partyI: 'Party I — Service Provider',
    partyII: 'Party II — Client',
    companyName: 'Company Name',
    nib: 'NIB',
    address: 'Address',
    representedBy: 'Represented by',
    fullName: 'Full Name',
    nationality: 'Nationality',
    passport: 'Passport Number',
    whatsapp: 'WhatsApp',
    email: 'Email',
    article1Title: 'Article 1 — Scope of Service',
    article1Body: 'Party I agrees to provide the following service to Party II:',
    service: 'Service',
    description: 'Description',
    quotedPrice: 'Quoted Price',
    article2Title: 'Article 2 — Payment Terms',
    article2Body: 'Full payment is required before processing begins.',
    paymentMethods: 'Accepted payment methods:',
    cash: 'Cash',
    article3Title: 'Article 3 — Client Responsibilities',
    article3Body: 'Party II agrees to:',
    resp1: 'Provide accurate and complete documents as requested',
    resp2: 'Respond to requests for information in a timely manner',
    resp3: 'Ensure passport is valid for a minimum of 6 months',
    article4Title: 'Article 4 — No Guarantee',
    article4Body: 'Party I provides professional visa assistance services only. Final approval or rejection of any visa application is at the sole discretion of the Directorate General of Immigration of the Republic of Indonesia. Party I does not guarantee approval of any application.',
    article5Title: 'Article 5 — Refund Policy',
    article5Body: 'Refunds are handled on a case-by-case basis at the sole discretion of Party I. Government fees paid to immigration authorities are non-refundable under any circumstances.',
    article6Title: 'Article 6 — Governing Law',
    article6Body: 'This Agreement is governed by the laws of the Republic of Indonesia. Any disputes shall be resolved in the courts of Bali, Indonesia.',
    sigPartyI: 'Party I',
    sigPartyII: 'Party II',
    signature: 'Signature',
  },
  id: {
    title: 'PERJANJIAN LAYANAN',
    date: 'Tanggal',
    preamble: 'Perjanjian Layanan ini ("Perjanjian") ditandatangani oleh dan antara:',
    partyI: 'Pihak I — Penyedia Layanan',
    partyII: 'Pihak II — Klien',
    companyName: 'Nama Perusahaan',
    nib: 'NIB',
    address: 'Alamat',
    representedBy: 'Diwakili oleh',
    fullName: 'Nama Lengkap',
    nationality: 'Kewarganegaraan',
    passport: 'Nomor Paspor',
    whatsapp: 'WhatsApp',
    email: 'Email',
    article1Title: 'Pasal 1 — Ruang Lingkup Layanan',
    article1Body: 'Pihak I setuju untuk memberikan layanan berikut kepada Pihak II:',
    service: 'Layanan',
    description: 'Deskripsi',
    quotedPrice: 'Harga',
    article2Title: 'Pasal 2 — Ketentuan Pembayaran',
    article2Body: 'Pembayaran penuh diperlukan sebelum proses dimulai.',
    paymentMethods: 'Metode pembayaran yang diterima:',
    cash: 'Tunai',
    article3Title: 'Pasal 3 — Kewajiban Klien',
    article3Body: 'Pihak II setuju untuk:',
    resp1: 'Memberikan dokumen yang akurat dan lengkap sesuai permintaan',
    resp2: 'Menanggapi permintaan informasi secara tepat waktu',
    resp3: 'Memastikan paspor berlaku minimal 6 bulan',
    article4Title: 'Pasal 4 — Tanpa Jaminan',
    article4Body: 'Pihak I hanya memberikan layanan bantuan visa profesional. Persetujuan atau penolakan akhir atas setiap permohonan visa merupakan kewenangan Direktorat Jenderal Imigrasi Republik Indonesia. Pihak I tidak menjamin persetujuan permohonan apapun.',
    article5Title: 'Pasal 5 — Kebijakan Pengembalian Dana',
    article5Body: 'Pengembalian dana ditangani berdasarkan kasus per kasus atas kebijakan Pihak I. Biaya pemerintah yang dibayarkan kepada otoritas imigrasi tidak dapat dikembalikan dalam keadaan apapun.',
    article6Title: 'Pasal 6 — Hukum yang Berlaku',
    article6Body: 'Perjanjian ini diatur oleh hukum Republik Indonesia. Setiap perselisihan akan diselesaikan di pengadilan Bali, Indonesia.',
    sigPartyI: 'Pihak I',
    sigPartyII: 'Pihak II',
    signature: 'Tanda Tangan',
  },
}

export interface AgreementData {
  agreementNumber: string
  date: string
  customerName: string
  nationality: string
  passportNumber: string
  whatsappNumber: string
  email: string
  serviceName: string
  serviceDescription: string
  quotedPrice: string
  language: AgreementLanguage
}

export interface AgreementCompanyInfo {
  legalName: string
  nib: string
  npwp: string
  address: string
  banking: {
    bankName: string
    accountNumber: string
    accountHolder: string
  }
  director: {
    name: string
    title: string
    phone: string
    email: string
  }
}

interface ServiceAgreementProps {
  data: AgreementData
  company: AgreementCompanyInfo
}

export function ServiceAgreementDocument({ data, company }: ServiceAgreementProps) {
  const l = t[data.language]

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.content}>
          {/* Company Header */}
          <View style={styles.header}>
            <Image
              style={styles.headerLogo}
              src={path.join(process.cwd(), 'public/images/logo-1024.png')}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.headerBrand}>BaliVisa<Text style={styles.headerBrandAccent}>Assist</Text></Text>
              <Text style={styles.headerLegal}>PT {company.legalName} | NIB: {company.nib}</Text>
              <Text style={styles.headerContact}>
                {company.address} | info@balivisaassist.com
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>{l.title}</Text>

          {/* Meta */}
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>No: {data.agreementNumber}</Text>
            <Text style={styles.metaText}>{l.date}: {data.date}</Text>
          </View>

          {/* Preamble */}
          <Text style={styles.paragraph}>{l.preamble}</Text>

          {/* Party I */}
          <Text style={[styles.sectionTitle, { marginTop: 6 }]}>{l.partyI}</Text>
          <View style={styles.infoTable}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{l.companyName}</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>{company.legalName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{l.nib}</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>{company.nib}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{l.address}</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>{company.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{l.representedBy}</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>{company.director.name}, {company.director.title}</Text>
            </View>
          </View>

          {/* Party II */}
          <Text style={styles.sectionTitle}>{l.partyII}</Text>
          <View style={styles.infoTable}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{l.fullName}</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>{data.customerName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{l.nationality}</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>{data.nationality}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{l.passport}</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>{data.passportNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{l.whatsapp}</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>{data.whatsappNumber}</Text>
            </View>
            {data.email && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{l.email}</Text>
                <Text style={styles.infoSeparator}>:</Text>
                <Text style={styles.infoValue}>{data.email}</Text>
              </View>
            )}
          </View>

          {/* Article 1 */}
          <Text style={styles.sectionTitle}>{l.article1Title}</Text>
          <Text style={styles.paragraph}>{l.article1Body}</Text>
          <View style={styles.infoTable}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{l.service}</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>{data.serviceName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{l.description}</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>{data.serviceDescription}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{l.quotedPrice}</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>{data.quotedPrice}</Text>
            </View>
          </View>

          {/* Article 2 */}
          <Text style={styles.sectionTitle}>{l.article2Title}</Text>
          <Text style={styles.paragraph}>{l.article2Body}</Text>
          <Text style={[styles.paragraph, { marginTop: 2 }]}>{l.paymentMethods}</Text>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text style={styles.bulletText}>
              Bank Transfer — {company.banking.bankName}, Account: {company.banking.accountNumber}, Name: {company.banking.accountHolder}
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text style={styles.bulletText}>QRIS</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text style={styles.bulletText}>{l.cash}</Text>
          </View>

          {/* Article 3 */}
          <Text style={styles.sectionTitle}>{l.article3Title}</Text>
          <Text style={styles.paragraph}>{l.article3Body}</Text>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text style={styles.bulletText}>{l.resp1}</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text style={styles.bulletText}>{l.resp2}</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text style={styles.bulletText}>{l.resp3}</Text>
          </View>

          {/* Article 4 */}
          <Text style={styles.sectionTitle}>{l.article4Title}</Text>
          <Text style={styles.paragraph}>{l.article4Body}</Text>

          {/* Article 5 */}
          <Text style={styles.sectionTitle}>{l.article5Title}</Text>
          <Text style={styles.paragraph}>{l.article5Body}</Text>

          {/* Article 6 */}
          <Text style={styles.sectionTitle}>{l.article6Title}</Text>
          <Text style={styles.paragraph}>{l.article6Body}</Text>

          {/* Signature Block */}
          <View style={styles.signatureRow}>
            {/* Party I */}
            <View style={styles.signatureBlock}>
              <Text style={styles.signatureLabel}>{l.sigPartyI}</Text>
              <Text style={styles.signatureText}>{company.legalName}</Text>
              <Image
                style={styles.signatureImage}
                src={path.join(process.cwd(), 'public/images/signature-seal.png')}
              />
              <Text style={styles.signatureText}>{company.director.name}</Text>
              <Text style={styles.signatureText}>{company.director.title}</Text>
            </View>

            {/* Party II */}
            <View style={styles.signatureBlock}>
              <Text style={styles.signatureLabel}>{l.sigPartyII}</Text>
              <Text style={styles.signatureText}>{data.customerName}</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureText}>{l.signature}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

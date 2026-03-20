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
    paddingTop: 40,
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
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#0F4C5C',
  },
  headerLogo: {
    width: 48,
    height: 48,
    marginRight: 14,
  },
  headerInfo: {
    flex: 1,
  },
  headerBrand: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#0F4C5C',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  headerBrandAccent: {
    color: '#E07A5F',
  },
  headerLegal: {
    fontSize: 8,
    color: '#555',
    marginBottom: 3,
  },
  headerContact: {
    fontSize: 7.5,
    color: '#777',
  },
  title: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 14,
    marginTop: 2,
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
    title: 'SERVICE CONFIRMATION',
    date: 'Date',
    preamble: 'This document confirms the service arrangement between:',
    partyI: 'Service Provider',
    partyII: 'Client',
    companyName: 'Company Name',
    nib: 'NIB',
    address: 'Address',
    representedBy: 'Represented by',
    fullName: 'Full Name',
    nationality: 'Nationality',
    passport: 'Passport Number',
    whatsapp: 'WhatsApp',
    email: 'Email',
    article1Title: 'Service Details',
    article1Body: 'We will provide the following service:',
    service: 'Service',
    description: 'Description',
    quotedPrice: 'Service Fee',
    article2Title: 'Payment',
    article2Body: 'Payment is required before we begin processing your application.',
    paymentMethods: 'You can pay via:',
    cash: 'Cash (at our office)',
    article3Title: 'What We Need From You',
    article3Body: 'To process your application smoothly, please:',
    resp1: 'Provide accurate and complete documents when requested',
    resp2: 'Respond to any follow-up questions promptly',
    resp3: 'Ensure your passport is valid for at least 6 months',
    article4Title: 'Important Note',
    article4Body: 'We handle the full application process on your behalf, including document preparation and submission to immigration. Please note that the final decision on any visa application rests with Indonesian immigration authorities.',
    article5Title: 'Refunds',
    article5Body: 'If your application cannot proceed, we will discuss refund options with you. Please note that government fees paid to immigration cannot be refunded as they are collected by the government.',
    article6Title: 'Contact Us',
    article6Body: 'If you have any questions about your application, reach out to us anytime via WhatsApp or email. We are here to help throughout the process.',
    sigPartyI: 'BaliVisaAssist',
    sigPartyII: 'Client',
    signature: 'Signature',
  },
  id: {
    title: 'KONFIRMASI LAYANAN',
    date: 'Tanggal',
    preamble: 'Dokumen ini mengkonfirmasi pengaturan layanan antara:',
    partyI: 'Penyedia Layanan',
    partyII: 'Klien',
    companyName: 'Nama Perusahaan',
    nib: 'NIB',
    address: 'Alamat',
    representedBy: 'Diwakili oleh',
    fullName: 'Nama Lengkap',
    nationality: 'Kewarganegaraan',
    passport: 'Nomor Paspor',
    whatsapp: 'WhatsApp',
    email: 'Email',
    article1Title: 'Detail Layanan',
    article1Body: 'Kami akan menyediakan layanan berikut:',
    service: 'Layanan',
    description: 'Deskripsi',
    quotedPrice: 'Biaya Layanan',
    article2Title: 'Pembayaran',
    article2Body: 'Pembayaran diperlukan sebelum kami mulai memproses permohonan Anda.',
    paymentMethods: 'Anda dapat membayar melalui:',
    cash: 'Tunai (di kantor kami)',
    article3Title: 'Yang Kami Butuhkan Dari Anda',
    article3Body: 'Untuk memproses permohonan Anda dengan lancar, mohon:',
    resp1: 'Memberikan dokumen yang akurat dan lengkap saat diminta',
    resp2: 'Menanggapi pertanyaan lanjutan dengan segera',
    resp3: 'Memastikan paspor Anda berlaku minimal 6 bulan',
    article4Title: 'Catatan Penting',
    article4Body: 'Kami menangani seluruh proses permohonan atas nama Anda, termasuk persiapan dokumen dan pengajuan ke imigrasi. Perlu diketahui bahwa keputusan akhir atas permohonan visa ada pada otoritas imigrasi Indonesia.',
    article5Title: 'Pengembalian Dana',
    article5Body: 'Jika permohonan Anda tidak dapat diproses, kami akan mendiskusikan opsi pengembalian dana dengan Anda. Biaya pemerintah yang dibayarkan ke imigrasi tidak dapat dikembalikan karena dipungut oleh pemerintah.',
    article6Title: 'Hubungi Kami',
    article6Body: 'Jika Anda memiliki pertanyaan tentang permohonan Anda, hubungi kami kapan saja melalui WhatsApp atau email. Kami siap membantu sepanjang proses.',
    sigPartyI: 'BaliVisaAssist',
    sigPartyII: 'Klien',
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

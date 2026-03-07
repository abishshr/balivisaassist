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
    paddingTop: 36,
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
  title: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 1,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 9,
    textAlign: 'center',
    marginBottom: 12,
    color: '#555',
    fontFamily: 'Helvetica-Oblique',
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
  paragraphItalic: {
    marginBottom: 4,
    textAlign: 'justify',
    fontSize: 9,
    fontFamily: 'Helvetica-Oblique',
    color: '#444',
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
  bulletTextItalic: {
    flex: 1,
    fontSize: 9,
    fontFamily: 'Helvetica-Oblique',
    color: '#444',
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
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>Service Agreement</Text>
          <Text style={styles.subtitle}>Perjanjian Layanan</Text>

          {/* Meta */}
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>No: {data.agreementNumber}</Text>
            <Text style={styles.metaText}>Date / Tanggal: {data.date}</Text>
          </View>

          {/* Preamble */}
          <Text style={styles.paragraph}>
            This Service Agreement (&quot;Agreement&quot;) is entered into by and between:
          </Text>
          <Text style={styles.paragraphItalic}>
            Perjanjian Layanan ini ditandatangani oleh dan antara:
          </Text>

          {/* Party I */}
          <Text style={[styles.sectionTitle, { marginTop: 6 }]}>Party I / Pihak I — Service Provider</Text>
          <View style={styles.infoTable}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Company Name</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>{company.legalName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>NIB</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>{company.nib}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address / Alamat</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>{company.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Represented by</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>{company.director.name}, {company.director.title}</Text>
            </View>
          </View>

          {/* Party II */}
          <Text style={styles.sectionTitle}>Party II / Pihak II — Client</Text>
          <View style={styles.infoTable}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name / Nama</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>{data.customerName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nationality</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>{data.nationality}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Passport Number</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>{data.passportNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>WhatsApp</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>{data.whatsappNumber}</Text>
            </View>
            {data.email && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoSeparator}>:</Text>
                <Text style={styles.infoValue}>{data.email}</Text>
              </View>
            )}
          </View>

          {/* Article 1 */}
          <Text style={styles.sectionTitle}>Article 1 — Scope of Service / Ruang Lingkup Layanan</Text>
          <Text style={styles.paragraph}>
            Party I agrees to provide the following service to Party II:
          </Text>
          <Text style={styles.paragraphItalic}>
            Pihak I setuju untuk memberikan layanan berikut kepada Pihak II:
          </Text>
          <View style={styles.infoTable}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Service / Layanan</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>{data.serviceName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Description</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>{data.serviceDescription}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Quoted Price / Harga</Text>
              <Text style={styles.infoSeparator}>:</Text>
              <Text style={styles.infoValue}>{data.quotedPrice}</Text>
            </View>
          </View>

          {/* Article 2 */}
          <Text style={styles.sectionTitle}>Article 2 — Payment Terms / Ketentuan Pembayaran</Text>
          <Text style={styles.paragraph}>
            Full payment is required before processing begins. / Pembayaran penuh diperlukan sebelum proses dimulai.
          </Text>
          <Text style={[styles.paragraph, { marginTop: 2 }]}>Accepted payment methods / Metode pembayaran:</Text>
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
            <Text style={styles.bulletText}>Cash / Tunai</Text>
          </View>

          {/* Article 3 */}
          <Text style={styles.sectionTitle}>Article 3 — Client Responsibilities / Kewajiban Klien</Text>
          <Text style={styles.paragraph}>Party II agrees to: / Pihak II setuju untuk:</Text>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text style={styles.bulletText}>Provide accurate and complete documents as requested</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text style={styles.bulletTextItalic}>Memberikan dokumen yang akurat dan lengkap sesuai permintaan</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text style={styles.bulletText}>Respond to requests for information in a timely manner</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text style={styles.bulletTextItalic}>Menanggapi permintaan informasi secara tepat waktu</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text style={styles.bulletText}>Ensure passport is valid for a minimum of 6 months</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text style={styles.bulletTextItalic}>Memastikan paspor berlaku minimal 6 bulan</Text>
          </View>

          {/* Article 4 */}
          <Text style={styles.sectionTitle}>Article 4 — No Guarantee / Tanpa Jaminan</Text>
          <Text style={styles.paragraph}>
            Party I provides professional visa assistance services only. Final approval or rejection of any visa application is at the sole discretion of the Directorate General of Immigration of the Republic of Indonesia. Party I does not guarantee approval of any application.
          </Text>
          <Text style={styles.paragraphItalic}>
            Pihak I hanya memberikan layanan bantuan visa profesional. Persetujuan atau penolakan akhir atas setiap permohonan visa merupakan kewenangan Direktorat Jenderal Imigrasi Republik Indonesia. Pihak I tidak menjamin persetujuan permohonan apapun.
          </Text>

          {/* Article 5 */}
          <Text style={styles.sectionTitle}>Article 5 — Refund Policy / Kebijakan Pengembalian Dana</Text>
          <Text style={styles.paragraph}>
            Refunds are handled on a case-by-case basis at the sole discretion of Party I. Government fees paid to immigration authorities are non-refundable under any circumstances.
          </Text>
          <Text style={styles.paragraphItalic}>
            Pengembalian dana ditangani berdasarkan kasus per kasus atas kebijakan Pihak I. Biaya pemerintah yang dibayarkan kepada otoritas imigrasi tidak dapat dikembalikan dalam keadaan apapun.
          </Text>

          {/* Article 6 */}
          <Text style={styles.sectionTitle}>Article 6 — Governing Law / Hukum yang Berlaku</Text>
          <Text style={styles.paragraph}>
            This Agreement is governed by the laws of the Republic of Indonesia. Any disputes shall be resolved in the courts of Bali, Indonesia.
          </Text>
          <Text style={styles.paragraphItalic}>
            Perjanjian ini diatur oleh hukum Republik Indonesia. Setiap perselisihan akan diselesaikan di pengadilan Bali, Indonesia.
          </Text>

          {/* Signature Block */}
          <View style={styles.signatureRow}>
            {/* Party I */}
            <View style={styles.signatureBlock}>
              <Text style={styles.signatureLabel}>Party I / Pihak I</Text>
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
              <Text style={styles.signatureLabel}>Party II / Pihak II</Text>
              <Text style={styles.signatureText}>{data.customerName}</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureText}>Signature / Tanda Tangan</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

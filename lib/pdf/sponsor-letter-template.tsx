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
    paddingBottom: 40,
    paddingHorizontal: 50,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.45,
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
    borderBottomColor: '#0d9488',
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
    color: '#0d9488',
    letterSpacing: 0.5,
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
    marginBottom: 2,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 14,
    color: '#333',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  metaText: {
    fontSize: 10,
    color: '#333',
  },
  addressBlock: {
    marginTop: 10,
    marginBottom: 12,
  },
  addressLine: {
    fontSize: 10,
    color: '#333',
  },
  addressLineBold: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#333',
  },
  subjectLine: {
    marginBottom: 8,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  salutation: {
    marginBottom: 8,
    fontSize: 10,
  },
  paragraph: {
    marginBottom: 6,
    textAlign: 'justify',
    fontSize: 10,
  },
  infoTable: {
    marginBottom: 8,
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  infoLabel: {
    width: 150,
    fontSize: 10,
  },
  infoSeparator: {
    width: 12,
    fontSize: 10,
  },
  infoValue: {
    flex: 1,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 2,
    marginLeft: 15,
  },
  bullet: {
    width: 12,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
  },
  signatureBlock: {
    marginTop: 'auto' as any,
    paddingTop: 8,
  },
  signatureClosing: {
    fontSize: 10,
    marginBottom: 2,
  },
  signatureImage: {
    width: 140,
    height: 86,
  },
  signatureTitle: {
    fontSize: 10,
    color: '#333',
  },
  signatureContact: {
    fontSize: 10,
    color: '#555',
  },
})

export interface SponsorLetterData {
  letterNumber: string
  date: string
  applicantName: string
  nationality: string
  passportNumber: string
  dateOfBirth: string
  visaType: string
  purposes: string[]
}

export interface CompanyInfo {
  legalName: string
  nib: string
  npwp: string
  address: string
  director: {
    name: string
    title: string
    phone: string
    email: string
  }
}

interface SponsorLetterProps {
  data: SponsorLetterData
  company: CompanyInfo
}

export function SponsorLetterDocument({ data, company }: SponsorLetterProps) {
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
            <Text style={styles.headerBrand}>BaliVisaAssist</Text>
            <Text style={styles.headerLegal}>PT {company.legalName} | NIB: {company.nib}</Text>
            <Text style={styles.headerContact}>
              {company.address} | {company.director.email}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Recommendation &amp; Invitation Letter</Text>
        <Text style={styles.subtitle}>For {data.visaType}</Text>

        {/* Date and Reference */}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>Date: {data.date}</Text>
          <Text style={styles.metaText}>Reference No: {data.letterNumber}</Text>
        </View>

        {/* Addressee */}
        <View style={styles.addressBlock}>
          <Text style={styles.addressLineBold}>To: Directorate General of Immigration</Text>
          <Text style={styles.addressLine}>      Republic of Indonesia</Text>
          <Text style={styles.addressLine}>      Direktorat Jenderal Imigrasi</Text>
        </View>

        {/* Subject */}
        <Text style={styles.subjectLine}>
          Subject: Recommendation and Invitation for {data.visaType} Application
        </Text>

        {/* Salutation */}
        <Text style={styles.salutation}>Dear Sir/Madam,</Text>

        {/* Company confirmation */}
        <Text style={styles.paragraph}>
          We hereby confirm that:
        </Text>

        {/* Company Info Table */}
        <View style={styles.infoTable}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Company Name</Text>
            <Text style={styles.infoSeparator}>:</Text>
            <Text style={styles.infoValue}>CIPTA SOLUSI GLOBAL</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Business Reg (NIB)</Text>
            <Text style={styles.infoSeparator}>:</Text>
            <Text style={styles.infoValue}>{company.nib}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tax ID (NPWP)</Text>
            <Text style={styles.infoSeparator}>:</Text>
            <Text style={styles.infoValue}>{company.npwp}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Company Address</Text>
            <Text style={styles.infoSeparator}>:</Text>
            <Text style={styles.infoValue}>{company.address}</Text>
          </View>
        </View>

        {/* Invitation text */}
        <Text style={styles.paragraph}>
          Hereby invites and provides recommendation for:
        </Text>

        {/* Applicant Info Table */}
        <View style={styles.infoTable}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Applicant Name</Text>
            <Text style={styles.infoSeparator}>:</Text>
            <Text style={styles.infoValue}>{data.applicantName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Passport Number</Text>
            <Text style={styles.infoSeparator}>:</Text>
            <Text style={styles.infoValue}>{data.passportNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nationality</Text>
            <Text style={styles.infoSeparator}>:</Text>
            <Text style={styles.infoValue}>{data.nationality}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth</Text>
            <Text style={styles.infoSeparator}>:</Text>
            <Text style={styles.infoValue}>{data.dateOfBirth}</Text>
          </View>
        </View>

        {/* Purpose section */}
        <Text style={styles.paragraph}>
          The above-mentioned applicant intends to visit Indonesia under the {data.visaType} for the purpose of:
        </Text>

        {/* Purpose bullets */}
        <View style={{ marginBottom: 6 }}>
          {data.purposes.map((purpose, index) => (
            <View key={index} style={styles.bulletItem}>
              <Text style={styles.bullet}>{'\u2022'}</Text>
              <Text style={styles.bulletText}>{purpose}</Text>
            </View>
          ))}
        </View>

        {/* Declarations */}
        <Text style={styles.paragraph}>
          The applicant will not engage in employment, receive salary, conduct sales activities, or perform any income-generating work within Indonesia.
        </Text>

        <Text style={styles.paragraph}>
          We confirm that the relationship between our company and the applicant is strictly for business exploration and potential investment cooperation.
        </Text>

        <Text style={styles.paragraph}>
          Our company guarantees that the applicant will comply with all laws and regulations of the Republic of Indonesia and respect local customs and regulations during their stay. Should any additional information be required, please do not hesitate to contact us.
        </Text>

        {/* Signature Block */}
        <View style={styles.signatureBlock}>
          <Text style={styles.signatureClosing}>Sincerely,</Text>
          <Image
            style={styles.signatureImage}
            src={path.join(process.cwd(), 'public/images/signature-seal.png')}
          />
          <Text style={styles.signatureTitle}>{company.director.title}</Text>
          <Text style={styles.signatureContact}>{company.director.phone}</Text>
          <Text style={styles.signatureContact}>{company.director.email}</Text>
        </View>
        </View>
      </Page>
    </Document>
  )
}

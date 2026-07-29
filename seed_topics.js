const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'data', 'db.json');
let data = { users: [], chats: [], complaints: [], activities: [], topics: [], bookmarks: [] };

if (fs.existsSync(dbPath)) {
  try {
    data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  } catch(e) {
    console.error('Error reading db.json', e);
  }
}

if (!data.topics) data.topics = [];
if (!data.bookmarks) data.bookmarks = [];

const initialTopics = [
  {
    _id: "topic-1",
    title: "Data Protection & Privacy Rights",
    description: "Understanding compliance rules, personal data protection, and user rights under the Digital Personal Data Protection Act.",
    category: "Cyber & Tech Law",
    tags: ["CyberLaw", "Privacy", "DataProtection"],
    icon: "shield_lock",
    views: 1420,
    status: "published",
    updatedAt: "2026-07-20T10:00:00.000Z",
    content: {
      explanation: "The Digital Personal Data Protection (DPDP) Act establishes strict norms for data fiduciaries collecting and processing personal information of citizens in India. It guarantees right to data access, correction, and erasure.",
      laws: ["Digital Personal Data Protection Act, 2023", "Information Technology Act, 2000 (Section 43A, 66E)"],
      rights: [
        "Right to access summary of personal data being processed",
        "Right to correction and erasure of personal data",
        "Right to grievance redressal by Data Fiduciary and Data Protection Board",
        "Right to nominate another individual in case of death or incapacity"
      ],
      faqs: [
        { q: "Can companies sell my personal phone number without consent?", a: "No, explicitly selling personal data without valid consent attracts heavy penalties under DPDP Act." },
        { q: "Where can I report data breaches?", a: "You can file a complaint with the Data Protection Board of India and the CERT-In portal." }
      ],
      officialLinks: [
        { title: "MeitY DPDP Portal", url: "https://www.meity.gov.in" },
        { title: "CERT-In Cyber Incident Reporting", url: "https://www.cert-in.org.in" }
      ],
      relatedTopics: ["topic-2", "topic-4"]
    }
  },
  {
    _id: "topic-2",
    title: "Bhartiya Nyaya Sanhita (BNS)",
    description: "Key differences from the old IPC, updated provisions for criminal justice, zero FIR, and electronic reporting.",
    category: "Criminal Law",
    tags: ["BNS", "CriminalLaw", "ZeroFIR"],
    icon: "balance",
    views: 2150,
    status: "published",
    updatedAt: "2026-07-22T14:30:00.000Z",
    content: {
      explanation: "Bharatiya Nyaya Sanhita (BNS) replaced the Indian Penal Code (IPC) to modernize India's criminal justice system. It introduces mandatory forensics, Zero FIR capability across any police station, and strict timelines for trials.",
      laws: ["Bharatiya Nyaya Sanhita, 2023", "Bharatiya Nagarik Suraksha Sanhita, 2023", "Bharatiya Sakshya Adhiniyam, 2023"],
      rights: [
        "Right to file a Zero FIR at any police station regardless of jurisdiction",
        "Right to obtain a free copy of the FIR immediately",
        "Right to electronic service of summons and notices",
        "Mandatory recording of search and seizure procedures using audio-video means"
      ],
      faqs: [
        { q: "What is a Zero FIR?", a: "A Zero FIR allows you to register a complaint at any police station, which is later transferred to the appropriate jurisdictional station." },
        { q: "Are electronic statements admissible in court?", a: "Yes, electronic records have equal legal standing under Bharatiya Sakshya Adhiniyam." }
      ],
      officialLinks: [
        { title: "Ministry of Home Affairs BNS Portal", url: "https://www.mha.gov.in" },
        { title: "National Crime Records Bureau", url: "https://ncrb.gov.in" }
      ],
      relatedTopics: ["topic-1", "topic-3"]
    }
  },
  {
    _id: "topic-3",
    title: "Tenant Rights & Rental Disputes",
    description: "Protection against forced eviction, security deposit recovery, notice periods, and Model Tenancy Act guidelines.",
    category: "Housing & Real Estate",
    tags: ["TenantRights", "Housing", "RentAgreement"],
    icon: "home",
    views: 1890,
    status: "published",
    updatedAt: "2026-07-25T09:15:00.000Z",
    content: {
      explanation: "Tenant rights safeguard renters against arbitrary rent hikes, unlawful landlord intrusion, withholding of security deposits, and sudden evictions without statutory notice periods.",
      laws: ["Model Tenancy Act, 2021", "State Rent Control Acts"],
      rights: [
        "Right to a written, registered tenancy agreement",
        "Right to minimum 24-hour advance notice before landlord entry for inspection/repairs",
        "Right to refund of security deposit within agreed timeframe upon vacant possession",
        "Protection against disconnection of essential utility services (water/electricity) by landlord"
      ],
      faqs: [
        { q: "Can a landlord cut off electricity for delayed rent?", a: "No, cutting off basic amenities is illegal and punishable under Rent Control laws." },
        { q: "How much security deposit can a landlord ask?", a: "Under the Model Tenancy Act, residential deposit is capped at a maximum of 2 months' rent." }
      ],
      officialLinks: [
        { title: "Ministry of Housing and Urban Affairs", url: "https://mohua.gov.in" },
        { title: "State Rent Authority Portal", url: "https://nalsa.gov.in" }
      ],
      relatedTopics: ["topic-2", "topic-4"]
    }
  },
  {
    _id: "topic-4",
    title: "Startup India & Tax Exemptions",
    description: "DPIIT recognition benefits, Section 80-IAC tax holiday, angel tax relaxation, and fast-track patent applications.",
    category: "Corporate & Business Law",
    tags: ["StartupIndia", "GSTCompliance", "DPIIT"],
    icon: "rocket_launch",
    views: 1650,
    status: "published",
    updatedAt: "2026-07-26T11:45:00.000Z",
    content: {
      explanation: "The Startup India initiative offers government incentives including 3-year tax exemptions, self-certification for labor laws, easy winding up of companies, and fast-track patent filings for DPIIT-recognized entities.",
      laws: ["Income Tax Act, 1961 (Section 80-IAC, Section 56(2)(viib))", "Companies Act, 2013"],
      rights: [
        "Right to 100% tax deduction on profits for 3 consecutive financial years out of first 10 years",
        "Self-certification under 6 Labor Laws and 3 Environmental Laws for 3 to 5 years",
        "80% rebate on patent application fees and 50% rebate on trademark filings",
        "Access to Fund of Funds (FFS) and Credit Guarantee Scheme for Startups"
      ],
      faqs: [
        { q: "How do I register a startup with DPIIT?", a: "You can apply online via the Startup India portal with your incorporation certificate and pitch write-up." },
        { q: "Is GST registration mandatory for all startups?", a: "GST registration is mandatory if turnover exceeds ₹20 Lakhs (services) or ₹40 Lakhs (goods) or for interstate sales." }
      ],
      officialLinks: [
        { title: "Startup India Official Hub", url: "https://www.startupindia.gov.in" },
        { title: "DPIIT Recognition Portal", url: "https://dpiit.gov.in" }
      ],
      relatedTopics: ["topic-1", "topic-5"]
    }
  },
  {
    _id: "topic-5",
    title: "GST Compliance & Invoicing Guide",
    description: "Simplified GST filing, e-way bill generation, input tax credit (ITC) rules, and penalty waivers.",
    category: "Taxation & Finance",
    tags: ["GSTCompliance", "Taxation", "EInvoicing"],
    icon: "receipt_long",
    views: 1980,
    status: "published",
    updatedAt: "2026-07-28T16:20:00.000Z",
    content: {
      explanation: "Goods and Services Tax (GST) standardizes indirect taxation across India. Understanding Input Tax Credit (ITC), GSTR-1 & GSTR-3B monthly/quarterly filings, and e-invoicing ensures seamless business operations.",
      laws: ["Central Goods and Services Tax (CGST) Act, 2017", "Integrated Goods and Services Tax (IGST) Act, 2017"],
      rights: [
        "Right to claim Input Tax Credit on business purchases",
        "Right to opt for Composition Scheme for small businesses (turnover up to ₹1.5 Cr)",
        "Right to rectify filing errors through amendment returns",
        "Right to appeal against arbitrary tax assessment orders before GST Appellate Tribunal"
      ],
      faqs: [
        { q: "What is the penalty for late GST return filing?", a: "Late fee is ₹50 per day (₹20 per day for Nil returns) subject to statutory caps." },
        { q: "When is e-invoicing mandatory?", a: "E-invoicing is mandatory for businesses with aggregate turnover exceeding statutory thresholds (e.g. ₹5 Cr)." }
      ],
      officialLinks: [
        { title: "GST Portal Official", url: "https://www.gst.gov.in" },
        { title: "E-Way Bill System Portal", url: "https://ewaybillgst.gov.in" }
      ],
      relatedTopics: ["topic-4", "topic-1"]
    }
  }
];

if (data.topics.length === 0) {
  data.topics = initialTopics;
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log('Seeded initial topics into db.json successfully.');
} else {
  console.log('Topics already exist in db.json.');
}

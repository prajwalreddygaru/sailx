import type {
  RFQ,
  Quotation,
  Supplier,
  Order,
  Shipment,
  Conversation,
  Message,
  Notification,
  Sample,
  User
} from "./types";

export const currentUser: User = {
  id: "user_1",
  name: "Arjun Mehta",
  email: "arjun@kavyaimports.in",
  role: "BUYER",
  avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Arjun",
  company: "Kavya Imports Pvt. Ltd.",
  country: "India",
  phone: "+91 98765 43210",
  gst: "27AAAPL1234C1Z5",
  verified: true
};

export const rfqs: RFQ[] = [
  {
    id: "rfq_1",
    code: "RFQ-2026-0184",
    title: "Wireless Bluetooth Earbuds — Custom Branding",
    description:
      "Looking for high-quality TWS earbuds with custom logo printing and branded packaging. Need ANC and 24-hour battery life.",
    category: "Electronics",
    quantity: 5000,
    moq: 1000,
    budget: 45000,
    currency: "USD",
    deliveryTimeline: "60 days",
    status: "QUOTATIONS_RECEIVED",
    buyerId: "user_1",
    buyerName: "Arjun Mehta",
    buyerCompany: "Kavya Imports",
    agentId: "agent_1",
    agentName: "Li Wei",
    createdAt: "2026-05-12T08:30:00Z",
    updatedAt: "2026-05-22T14:00:00Z",
    attachments: 4,
    quotations: 6,
    priority: "HIGH",
    imageUrl:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800"
  },
  {
    id: "rfq_2",
    code: "RFQ-2026-0179",
    title: "Eco-Friendly Kraft Paper Boxes",
    description:
      "Custom-printed kraft boxes for a D2C cosmetics brand. FSC certified material required.",
    category: "Packaging",
    quantity: 25000,
    moq: 5000,
    budget: 18500,
    currency: "USD",
    deliveryTimeline: "45 days",
    status: "SAMPLE_STAGE",
    buyerId: "user_1",
    buyerName: "Arjun Mehta",
    buyerCompany: "Kavya Imports",
    agentId: "agent_2",
    agentName: "Chen Hua",
    createdAt: "2026-05-08T10:00:00Z",
    updatedAt: "2026-05-21T09:15:00Z",
    attachments: 7,
    quotations: 4,
    priority: "MEDIUM",
    imageUrl:
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800"
  },
  {
    id: "rfq_3",
    code: "RFQ-2026-0172",
    title: "Industrial CNC Spindle Motors",
    description:
      "5kW water-cooled spindle motors for metalworking machinery. Need CE and RoHS certifications.",
    category: "Machinery",
    quantity: 120,
    moq: 50,
    budget: 96000,
    currency: "USD",
    deliveryTimeline: "75 days",
    status: "PRODUCTION",
    buyerId: "user_1",
    buyerName: "Arjun Mehta",
    buyerCompany: "Kavya Imports",
    agentId: "agent_1",
    agentName: "Li Wei",
    createdAt: "2026-04-28T11:20:00Z",
    updatedAt: "2026-05-20T16:40:00Z",
    attachments: 9,
    quotations: 3,
    priority: "HIGH",
    imageUrl:
      "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800"
  },
  {
    id: "rfq_4",
    code: "RFQ-2026-0165",
    title: "Ceramic Home Decor Vases — Set",
    description:
      "Premium ceramic vases in 3 sizes, hand-glazed, for a boutique home brand.",
    category: "Home Decor",
    quantity: 3000,
    moq: 500,
    budget: 22500,
    currency: "USD",
    deliveryTimeline: "50 days",
    status: "SHIPPING",
    buyerId: "user_1",
    buyerName: "Arjun Mehta",
    buyerCompany: "Kavya Imports",
    agentId: "agent_3",
    agentName: "Zhang Mei",
    createdAt: "2026-04-15T07:00:00Z",
    updatedAt: "2026-05-19T12:00:00Z",
    attachments: 6,
    quotations: 5,
    priority: "MEDIUM",
    imageUrl:
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800"
  },
  {
    id: "rfq_5",
    code: "RFQ-2026-0158",
    title: "Smart LED Strip Lights — RGB+CCT",
    description:
      "WiFi-enabled smart LED strips compatible with Alexa, Google Home, Matter.",
    category: "Electronics",
    quantity: 8000,
    moq: 2000,
    budget: 32000,
    currency: "USD",
    deliveryTimeline: "55 days",
    status: "SOURCING",
    buyerId: "user_1",
    buyerName: "Arjun Mehta",
    buyerCompany: "Kavya Imports",
    agentId: "agent_1",
    agentName: "Li Wei",
    createdAt: "2026-05-01T09:30:00Z",
    updatedAt: "2026-05-23T11:00:00Z",
    attachments: 3,
    quotations: 2,
    priority: "LOW",
    imageUrl:
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=800"
  },
  {
    id: "rfq_6",
    code: "RFQ-2026-0151",
    title: "Stainless Steel Vacuum Bottles",
    description:
      "750ml double-wall insulated bottles with custom laser engraving.",
    category: "Accessories",
    quantity: 15000,
    moq: 3000,
    budget: 27000,
    currency: "USD",
    deliveryTimeline: "40 days",
    status: "DELIVERED",
    buyerId: "user_1",
    buyerName: "Arjun Mehta",
    buyerCompany: "Kavya Imports",
    agentId: "agent_2",
    agentName: "Chen Hua",
    createdAt: "2026-03-20T08:00:00Z",
    updatedAt: "2026-05-18T10:00:00Z",
    attachments: 5,
    quotations: 8,
    priority: "MEDIUM",
    imageUrl:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800"
  }
];

export const suppliers: Supplier[] = [
  {
    id: "sup_1",
    name: "Shenzhen AudioPeak Tech",
    factoryName: "AudioPeak Manufacturing Co., Ltd",
    country: "China",
    city: "Shenzhen, Guangdong",
    rating: 4.9,
    trustScore: 96,
    yearsActive: 12,
    totalOrders: 2840,
    certifications: ["CE", "FCC", "RoHS", "ISO 9001", "BSCI"],
    categories: ["Electronics", "Audio"],
    verified: true,
    exportLicense: "EXL-CN-2014-08742",
    imageUrl:
      "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=600",
    responseTime: "< 2 hours"
  },
  {
    id: "sup_2",
    name: "Guangzhou EcoPack Industries",
    factoryName: "EcoPack Paper Products Co.",
    country: "China",
    city: "Guangzhou, Guangdong",
    rating: 4.7,
    trustScore: 92,
    yearsActive: 18,
    totalOrders: 4120,
    certifications: ["FSC", "ISO 14001", "BRC", "Sedex"],
    categories: ["Packaging"],
    verified: true,
    exportLicense: "EXL-CN-2008-03114",
    imageUrl:
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600",
    responseTime: "< 4 hours"
  },
  {
    id: "sup_3",
    name: "Ningbo PrecisionWorks",
    factoryName: "PrecisionWorks Heavy Machinery",
    country: "China",
    city: "Ningbo, Zhejiang",
    rating: 4.8,
    trustScore: 94,
    yearsActive: 22,
    totalOrders: 1280,
    certifications: ["CE", "RoHS", "ISO 9001", "TÜV"],
    categories: ["Machinery", "Industrial"],
    verified: true,
    exportLicense: "EXL-CN-2003-00482",
    imageUrl:
      "https://images.unsplash.com/photo-1581092446327-9b52bd1570c2?w=600",
    responseTime: "< 6 hours"
  },
  {
    id: "sup_4",
    name: "Jingdezhen CeramArt Studio",
    factoryName: "CeramArt Heritage Workshop",
    country: "China",
    city: "Jingdezhen, Jiangxi",
    rating: 4.9,
    trustScore: 91,
    yearsActive: 15,
    totalOrders: 940,
    certifications: ["ISO 9001", "Sedex", "FDA"],
    categories: ["Home Decor", "Ceramics"],
    verified: true,
    exportLicense: "EXL-CN-2011-05920",
    imageUrl:
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600",
    responseTime: "< 3 hours"
  },
  {
    id: "sup_5",
    name: "Yiwu BrightLite Co.",
    factoryName: "BrightLite Lighting Manufacturing",
    country: "China",
    city: "Yiwu, Zhejiang",
    rating: 4.6,
    trustScore: 88,
    yearsActive: 9,
    totalOrders: 1620,
    certifications: ["CE", "FCC", "RoHS", "ETL"],
    categories: ["Electronics", "Lighting"],
    verified: true,
    exportLicense: "EXL-CN-2017-11280",
    imageUrl:
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=600",
    responseTime: "< 2 hours"
  }
];

export const quotations: Quotation[] = [
  {
    id: "q_1",
    rfqId: "rfq_1",
    rfqTitle: "Wireless Bluetooth Earbuds",
    supplierId: "sup_1",
    supplierName: "Shenzhen AudioPeak Tech",
    supplierCountry: "China",
    supplierRating: 4.9,
    agentId: "agent_1",
    agentName: "Li Wei",
    unitPrice: 8.4,
    moq: 1000,
    leadTime: "35 days",
    totalPrice: 42000,
    currency: "USD",
    certifications: ["CE", "FCC", "RoHS"],
    notes: "Includes branded retail packaging and 12-month warranty.",
    status: "PENDING",
    createdAt: "2026-05-18T10:00:00Z",
    validUntil: "2026-06-18T23:59:59Z"
  },
  {
    id: "q_2",
    rfqId: "rfq_1",
    rfqTitle: "Wireless Bluetooth Earbuds",
    supplierId: "sup_5",
    supplierName: "Yiwu BrightLite Co.",
    supplierCountry: "China",
    supplierRating: 4.6,
    agentId: "agent_1",
    agentName: "Li Wei",
    unitPrice: 7.6,
    moq: 2000,
    leadTime: "45 days",
    totalPrice: 38000,
    currency: "USD",
    certifications: ["CE", "RoHS"],
    notes: "Lower price tier; ANC chipset is generic alternative.",
    status: "PENDING",
    createdAt: "2026-05-19T08:30:00Z",
    validUntil: "2026-06-19T23:59:59Z"
  },
  {
    id: "q_3",
    rfqId: "rfq_1",
    rfqTitle: "Wireless Bluetooth Earbuds",
    supplierId: "sup_3",
    supplierName: "Ningbo PrecisionWorks",
    supplierCountry: "China",
    supplierRating: 4.8,
    agentId: "agent_1",
    agentName: "Li Wei",
    unitPrice: 9.1,
    moq: 1000,
    leadTime: "30 days",
    totalPrice: 45500,
    currency: "USD",
    certifications: ["CE", "FCC", "RoHS", "ISO 9001"],
    notes: "Premium tier with Qualcomm QCC3072 chipset and aptX.",
    status: "NEGOTIATING",
    createdAt: "2026-05-20T11:30:00Z",
    validUntil: "2026-06-20T23:59:59Z"
  }
];

export const orders: Order[] = [
  {
    id: "ord_1",
    code: "ORD-2026-0091",
    rfqId: "rfq_3",
    buyerId: "user_1",
    supplierName: "Ningbo PrecisionWorks",
    productTitle: "CNC Spindle Motors 5kW",
    quantity: 120,
    totalAmount: 89400,
    currency: "USD",
    status: "IN_PRODUCTION",
    shipmentStatus: "PREPARING",
    paymentStatus: "PARTIAL",
    createdAt: "2026-05-02T08:00:00Z",
    expectedDelivery: "2026-07-15T00:00:00Z",
    progress: 62
  },
  {
    id: "ord_2",
    code: "ORD-2026-0084",
    rfqId: "rfq_4",
    buyerId: "user_1",
    supplierName: "Jingdezhen CeramArt",
    productTitle: "Ceramic Vases — Set of 3",
    quantity: 3000,
    totalAmount: 21750,
    currency: "USD",
    status: "SHIPPED",
    shipmentStatus: "IN_TRANSIT",
    paymentStatus: "PAID",
    createdAt: "2026-04-22T08:00:00Z",
    expectedDelivery: "2026-06-04T00:00:00Z",
    progress: 78
  },
  {
    id: "ord_3",
    code: "ORD-2026-0072",
    rfqId: "rfq_6",
    buyerId: "user_1",
    supplierName: "Guangzhou EcoPack",
    productTitle: "Stainless Steel Vacuum Bottles 750ml",
    quantity: 15000,
    totalAmount: 26100,
    currency: "USD",
    status: "DELIVERED",
    shipmentStatus: "DELIVERED",
    paymentStatus: "PAID",
    createdAt: "2026-03-25T08:00:00Z",
    expectedDelivery: "2026-05-15T00:00:00Z",
    progress: 100
  }
];

export const shipments: Shipment[] = [
  {
    id: "sh_1",
    orderId: "ord_2",
    orderCode: "ORD-2026-0084",
    trackingNumber: "MAEU8847291003",
    carrier: "Maersk Line",
    origin: "Shanghai, China",
    destination: "Mumbai, India",
    status: "IN_TRANSIT",
    eta: "2026-06-04T00:00:00Z",
    containerType: "20ft GP",
    weight: "4,820 kg",
    events: [
      {
        id: "e1",
        status: "DELIVERED_TO_PORT",
        location: "Shanghai Port, China",
        timestamp: "2026-05-14T08:30:00Z",
        description: "Container delivered to origin port"
      },
      {
        id: "e2",
        status: "LOADED",
        location: "Shanghai Port, China",
        timestamp: "2026-05-15T14:20:00Z",
        description: "Loaded onto vessel MAERSK HALIFAX"
      },
      {
        id: "e3",
        status: "DEPARTED",
        location: "Shanghai Port, China",
        timestamp: "2026-05-16T22:00:00Z",
        description: "Vessel departed origin port"
      },
      {
        id: "e4",
        status: "IN_TRANSIT",
        location: "South China Sea",
        timestamp: "2026-05-21T10:00:00Z",
        description: "Vessel in transit"
      }
    ]
  },
  {
    id: "sh_2",
    orderId: "ord_1",
    orderCode: "ORD-2026-0091",
    trackingNumber: "COSU6638910022",
    carrier: "COSCO Shipping",
    origin: "Ningbo, China",
    destination: "Chennai, India",
    status: "PREPARING",
    eta: "2026-07-15T00:00:00Z",
    containerType: "40ft HC",
    weight: "12,400 kg",
    events: [
      {
        id: "e1",
        status: "BOOKED",
        location: "Ningbo, China",
        timestamp: "2026-05-19T08:00:00Z",
        description: "Shipment booking confirmed"
      }
    ]
  }
];

export const conversations: Conversation[] = [
  {
    id: "c1",
    participantName: "Li Wei",
    participantRole: "AGENT",
    participantAvatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Liwei",
    lastMessage: "I've shared 3 supplier quotations for the earbuds RFQ.",
    lastMessageAt: "2026-05-23T11:42:00Z",
    unread: 2,
    online: true,
    rfqCode: "RFQ-2026-0184"
  },
  {
    id: "c2",
    participantName: "Chen Hua",
    participantRole: "AGENT",
    participantAvatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Chen",
    lastMessage: "Sample dispatched via DHL — tracking: 8847291003",
    lastMessageAt: "2026-05-22T15:20:00Z",
    unread: 0,
    online: true,
    rfqCode: "RFQ-2026-0179"
  },
  {
    id: "c3",
    participantName: "Zhang Mei",
    participantRole: "AGENT",
    participantAvatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Zhang",
    lastMessage: "Container has cleared customs at Mumbai port.",
    lastMessageAt: "2026-05-22T09:05:00Z",
    unread: 0,
    online: false,
    rfqCode: "RFQ-2026-0165"
  },
  {
    id: "c4",
    participantName: "SailX Support",
    participantRole: "ADMIN",
    participantAvatar:
      "https://api.dicebear.com/7.x/notionists/svg?seed=Support",
    lastMessage: "Welcome to SailX! Let us know if you need help.",
    lastMessageAt: "2026-05-20T10:00:00Z",
    unread: 0,
    online: true
  }
];

export const messages: Message[] = [
  {
    id: "m1",
    conversationId: "c1",
    senderId: "agent_1",
    senderName: "Li Wei",
    content:
      "Hi Arjun, I've finalized the supplier shortlist for the TWS earbuds RFQ.",
    createdAt: "2026-05-23T11:30:00Z",
    read: true
  },
  {
    id: "m2",
    conversationId: "c1",
    senderId: "agent_1",
    senderName: "Li Wei",
    content:
      "Three top candidates: AudioPeak ($8.4/unit), BrightLite ($7.6), and PrecisionWorks ($9.1 — premium chipset).",
    createdAt: "2026-05-23T11:33:00Z",
    read: true
  },
  {
    id: "m3",
    conversationId: "c1",
    senderId: "user_1",
    senderName: "Arjun Mehta",
    content: "Great. Can you set up a call to walk through the certifications?",
    createdAt: "2026-05-23T11:38:00Z",
    read: true
  },
  {
    id: "m4",
    conversationId: "c1",
    senderId: "agent_1",
    senderName: "Li Wei",
    content: "Absolutely. Sending a Google Meet invite for tomorrow at 11 AM IST.",
    attachments: [
      { name: "Quotation_Summary.pdf", type: "pdf", url: "#" },
      { name: "Factory_Tour.mp4", type: "video", url: "#" }
    ],
    createdAt: "2026-05-23T11:42:00Z",
    read: false
  }
];

export const notifications: Notification[] = [
  {
    id: "n1",
    title: "New quotation received",
    message: "Shenzhen AudioPeak submitted a quotation for RFQ-2026-0184",
    type: "QUOTATION",
    read: false,
    createdAt: "2026-05-23T11:42:00Z",
    href: "/dashboard/buyer/quotations"
  },
  {
    id: "n2",
    title: "Sample shipped",
    message: "Sample for RFQ-2026-0179 dispatched via DHL Express",
    type: "SHIPMENT",
    read: false,
    createdAt: "2026-05-22T15:20:00Z",
    href: "/dashboard/buyer/samples"
  },
  {
    id: "n3",
    title: "Meeting reminder",
    message: "Sourcing call with Li Wei tomorrow at 11:00 AM IST",
    type: "MEETING",
    read: false,
    createdAt: "2026-05-23T09:00:00Z",
    href: "/dashboard/buyer/meetings"
  },
  {
    id: "n4",
    title: "Customs cleared",
    message: "Order ORD-2026-0084 has cleared customs at Mumbai port",
    type: "SHIPMENT",
    read: true,
    createdAt: "2026-05-22T09:05:00Z",
    href: "/dashboard/buyer/shipments"
  },
  {
    id: "n5",
    title: "RFQ status update",
    message: "RFQ-2026-0172 has moved to production stage",
    type: "RFQ",
    read: true,
    createdAt: "2026-05-20T16:40:00Z",
    href: "/dashboard/buyer/rfqs"
  }
];

export const samples: Sample[] = [
  {
    id: "smp_1",
    rfqId: "rfq_2",
    productTitle: "Eco-Friendly Kraft Boxes (Sample Set)",
    supplierName: "Guangzhou EcoPack",
    status: "DELIVERED",
    trackingNumber: "DHL8847291003",
    qualityScore: 92,
    requestedAt: "2026-05-12T08:00:00Z",
    receivedAt: "2026-05-21T14:00:00Z",
    notes: "Print quality is excellent. Material thickness on spec."
  },
  {
    id: "smp_2",
    rfqId: "rfq_1",
    productTitle: "TWS Earbuds Sample (3 variants)",
    supplierName: "Shenzhen AudioPeak",
    status: "SHIPPED",
    trackingNumber: "DHL8847312044",
    qualityScore: 0,
    requestedAt: "2026-05-21T10:30:00Z"
  },
  {
    id: "smp_3",
    rfqId: "rfq_5",
    productTitle: "Smart LED Strip Sample",
    supplierName: "Yiwu BrightLite",
    status: "REQUESTED",
    trackingNumber: "—",
    qualityScore: 0,
    requestedAt: "2026-05-23T09:15:00Z"
  }
];

export const procurementMetrics = {
  activeRFQs: 5,
  pendingQuotations: 12,
  activeShipments: 2,
  totalSpend: 286400,
  spendChange: 18.4,
  avgLeadTime: 47,
  leadTimeChange: -8.2,
  supplierRating: 4.78,
  onTimeDelivery: 94.2
};

export const spendByMonth = [
  { month: "Dec", spend: 38000, orders: 4 },
  { month: "Jan", spend: 52000, orders: 6 },
  { month: "Feb", spend: 41000, orders: 5 },
  { month: "Mar", spend: 67000, orders: 8 },
  { month: "Apr", spend: 58000, orders: 7 },
  { month: "May", spend: 86400, orders: 9 }
];

export const categorySpend = [
  { name: "Electronics", value: 124000, color: "#3b82f6" },
  { name: "Machinery", value: 89000, color: "#8b5cf6" },
  { name: "Packaging", value: 32000, color: "#10b981" },
  { name: "Home Decor", value: 26000, color: "#f59e0b" },
  { name: "Accessories", value: 15400, color: "#ef4444" }
];

export const productCategories = [
  {
    slug: "electronics",
    name: "Electronics",
    description:
      "Consumer electronics, audio, IoT devices, smart home, and components.",
    moqRange: "100 — 5,000 units",
    leadTime: "30 — 60 days",
    icon: "Cpu",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    suppliers: 1240
  },
  {
    slug: "packaging",
    name: "Packaging",
    description:
      "Sustainable kraft, custom rigid boxes, flexible packaging, labels, and inserts.",
    moqRange: "1,000 — 50,000 units",
    leadTime: "20 — 45 days",
    icon: "Package",
    image:
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800",
    suppliers: 880
  },
  {
    slug: "industrial",
    name: "Industrial Products",
    description:
      "Hardware, tools, fasteners, hydraulics, automation components.",
    moqRange: "50 — 2,000 units",
    leadTime: "30 — 75 days",
    icon: "Wrench",
    image:
      "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800",
    suppliers: 620
  },
  {
    slug: "machinery",
    name: "Machinery",
    description: "CNC, packaging machines, food processing, textile machinery.",
    moqRange: "1 — 50 units",
    leadTime: "60 — 120 days",
    icon: "Cog",
    image:
      "https://images.unsplash.com/photo-1581092446327-9b52bd1570c2?w=800",
    suppliers: 410
  },
  {
    slug: "home-decor",
    name: "Home Decor",
    description: "Ceramics, glassware, lighting, textiles, wall art, furniture.",
    moqRange: "200 — 5,000 units",
    leadTime: "30 — 60 days",
    icon: "Home",
    image:
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800",
    suppliers: 740
  },
  {
    slug: "accessories",
    name: "Accessories",
    description:
      "Fashion accessories, drinkware, bags, stationery, lifestyle goods.",
    moqRange: "500 — 10,000 units",
    leadTime: "25 — 50 days",
    icon: "Gem",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
    suppliers: 950
  }
];

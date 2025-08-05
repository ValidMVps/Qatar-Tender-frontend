import { v4 as uuidv4 } from "uuid"

export type UserRole = "admin" | "project_owner" | "service_provider"
export type UserStatus = "active" | "inactive" | "pending_verification"
export type KYCStatus = "pending" | "verified" | "rejected" | "resubmission_requested"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  memberSince: string
  lastLogin: string
  kycStatus?: KYCStatus
  kycDocuments?: {
    idType: string
    documentUrl: string
    submittedAt: string
  }[]
  tendersPosted?: number
  bidsPlaced?: number
}

export type TenderStatus = "open" | "closed" | "pending_approval" | "approved" | "rejected"

export interface Tender {
  id: string
  title: string
  description: string
  clientName: string
  budget: string
  deadline: string
  category: string
  location: string
  status: TenderStatus
  bidsCount: number
  attachments?: string[]
  postedAt: string
}

export type BidStatus = "Pending" | "Accepted" | "Rejected" | "Flagged"

export interface Bid {
  id: string
  tenderId: string
  tenderTitle: string
  providerName: string
  bidAmount: string
  status: BidStatus
  submittedAt: string
  bidDescription: string
  rejectionReason?: string
}

export interface KYCRequest {
  id: string
  userId: string
  userName: string
  idType: string
  documentUrl: string
  submittedAt: string
  status: KYCStatus
}

export type SupportTicketStatus = "open" | "pending" | "resolved" | "closed"

export interface SupportTicket {
  id: string
  subject: string
  description: string
  reportedBy: string
  status: SupportTicketStatus
  priority: "low" | "medium" | "high"
  createdAt: string
  assignedTo?: string
  resolutionNotes?: string
}

export const sampleUsers: User[] = [
  {
    id: uuidv4(),
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    memberSince: "2023-01-15T10:00:00Z",
    lastLogin: "2024-07-23T14:30:00Z",
    kycStatus: "verified",
    tendersPosted: 0,
    bidsPlaced: 0,
  },
  {
    id: uuidv4(),
    name: "Project Owner 1",
    email: "owner1@example.com",
    role: "project_owner",
    status: "active",
    memberSince: "2023-03-01T09:00:00Z",
    lastLogin: "2024-07-22T11:00:00Z",
    kycStatus: "verified",
    tendersPosted: 5,
    bidsPlaced: 0,
  },
  {
    id: uuidv4(),
    name: "Service Provider 1",
    email: "provider1@example.com",
    role: "service_provider",
    status: "active",
    memberSince: "2023-02-10T14:00:00Z",
    lastLogin: "2024-07-23T09:00:00Z",
    kycStatus: "verified",
    tendersPosted: 0,
    bidsPlaced: 12,
  },
  {
    id: uuidv4(),
    name: "Project Owner 2",
    email: "owner2@example.com",
    role: "project_owner",
    status: "pending_verification",
    memberSince: "2024-07-20T16:00:00Z",
    lastLogin: "2024-07-20T16:05:00Z",
    kycStatus: "pending",
    kycDocuments: [
      {
        idType: "Passport",
        documentUrl: "/placeholder.svg?height=200&width=300",
        submittedAt: "2024-07-20T16:02:00Z",
      },
    ],
    tendersPosted: 1,
    bidsPlaced: 0,
  },
  {
    id: uuidv4(),
    name: "Service Provider 2",
    email: "provider2@example.com",
    role: "service_provider",
    status: "inactive",
    memberSince: "2023-05-01T11:00:00Z",
    lastLogin: "2024-06-15T10:00:00Z",
    kycStatus: "rejected",
    kycDocuments: [
      {
        idType: "National ID",
        documentUrl: "/placeholder.svg?height=200&width=300",
        submittedAt: "2023-05-02T09:00:00Z",
      },
    ],
    tendersPosted: 0,
    bidsPlaced: 3,
  },
  {
    id: uuidv4(),
    name: "Individual User 1",
    email: "individual1@example.com",
    role: "project_owner", // Individual users are typically project owners
    status: "active",
    memberSince: "2024-01-01T08:00:00Z",
    lastLogin: "2024-07-21T13:00:00Z",
    kycStatus: "verified",
    tendersPosted: 2,
    bidsPlaced: 0,
  },
]

export const sampleTenders: Tender[] = [
  {
    id: uuidv4(),
    title: "Website Redesign for E-commerce Store",
    description:
      "We are looking for an experienced web development team to redesign our existing e-commerce website. The new design should be modern, user-friendly, and mobile-responsive. Key features include improved product catalog, secure checkout, and integration with our existing CRM.",
    clientName: "Tech Solutions Inc.",
    budget: "QR 25,000 - 40,000",
    deadline: "2024-09-30",
    category: "Web Development",
    location: "Doha, Qatar",
    status: "open",
    bidsCount: 5,
    attachments: ["/placeholder.svg?height=100&width=150"],
    postedAt: "2024-07-10T10:00:00Z",
  },
  {
    id: uuidv4(),
    title: "HVAC System Installation for New Office Building",
    description:
      "Installation of a complete HVAC system for a new 5-story office building. The project includes design, supply, installation, testing, and commissioning of all HVAC components. Experience with energy-efficient systems is a plus.",
    clientName: "Al-Futtaim Properties",
    budget: "QR 150,000 - 200,000",
    deadline: "2024-11-15",
    category: "Construction",
    location: "Lusail, Qatar",
    status: "pending_approval",
    bidsCount: 0,
    attachments: ["/placeholder.svg?height=100&width=150"],
    postedAt: "2024-07-22T14:00:00Z",
  },
  {
    id: uuidv4(),
    title: "Mobile App Development (iOS & Android)",
    description:
      "Development of a cross-platform mobile application for a new food delivery service. The app should include user registration, restaurant browsing, order placement, payment integration, and real-time tracking. Backend API development is also required.",
    clientName: "Foodie Express",
    budget: "QR 80,000 - 120,000",
    deadline: "2025-01-31",
    category: "Mobile Development",
    location: "Doha, Qatar",
    status: "open",
    bidsCount: 3,
    attachments: [],
    postedAt: "2024-07-05T09:00:00Z",
  },
  {
    id: uuidv4(),
    title: "Security System Upgrade for Residential Complex",
    description:
      "Upgrade of existing security systems in a large residential complex. This includes installation of new CCTV cameras, access control systems, and integration with a central monitoring station. Must comply with local security regulations.",
    clientName: "Qatar Living",
    budget: "QR 70,000 - 90,000",
    deadline: "2024-10-01",
    category: "Security Services",
    location: "Al Rayyan, Qatar",
    status: "approved", // Approved but not yet 'open' for bids, or could be 'open'
    bidsCount: 0,
    attachments: [],
    postedAt: "2024-07-18T11:00:00Z",
  },
  {
    id: uuidv4(),
    title: "Digital Marketing Campaign for New Product Launch",
    description:
      "We need a comprehensive digital marketing strategy and execution for our new tech gadget. This includes SEO, social media marketing, content creation, and paid advertising campaigns across various platforms.",
    clientName: "Innovate Q",
    budget: "QR 30,000 - 50,000",
    deadline: "2024-08-31",
    category: "Marketing",
    location: "Doha, Qatar",
    status: "closed",
    bidsCount: 8,
    attachments: [],
    postedAt: "2024-06-01T10:00:00Z",
  },
  {
    id: uuidv4(),
    title: "Interior Design for Luxury Villa",
    description:
      "Full interior design services for a high-end residential villa. Requires expertise in modern luxury aesthetics, material selection, and custom furniture design. Portfolio of similar projects is essential.",
    clientName: "Private Client",
    budget: "QR 100,000 - 180,000",
    deadline: "2025-03-01",
    category: "Interior Design",
    location: "The Pearl, Qatar",
    status: "pending_approval",
    bidsCount: 0,
    attachments: ["/placeholder.svg?height=100&width=150"],
    postedAt: "2024-07-23T08:00:00Z",
  },
  {
    id: uuidv4(),
    title: "Event Management for Corporate Gala",
    description:
      "Planning and execution of an annual corporate gala for 500 guests. Services include venue selection, catering, entertainment, logistics, and on-site management. Experience with large-scale corporate events is required.",
    clientName: "Qatar Business Forum",
    budget: "QR 60,000 - 80,000",
    deadline: "2024-12-10",
    category: "Event Management",
    location: "Doha, Qatar",
    status: "rejected",
    bidsCount: 0,
    attachments: [],
    postedAt: "2024-07-15T13:00:00Z",
  },
]

export const sampleBids: Bid[] = [
  {
    id: uuidv4(),
    tenderId: sampleTenders[0].id,
    tenderTitle: sampleTenders[0].title,
    providerName: "Web Solutions Co.",
    bidAmount: "QR 30,000",
    status: "Accepted",
    submittedAt: "2024-07-12T11:00:00Z",
    bidDescription:
      "Our team of expert web developers and designers will deliver a stunning, high-performance e-commerce website tailored to your brand. We focus on intuitive UX/UI and robust backend integration.",
  },
  {
    id: uuidv4(),
    tenderId: sampleTenders[0].id,
    tenderTitle: sampleTenders[0].title,
    providerName: "Creative Coders",
    bidAmount: "QR 28,000",
    status: "Pending",
    submittedAt: "2024-07-11T15:00:00Z",
    bidDescription:
      "We offer a complete redesign package, including responsive design, SEO optimization, and a custom content management system. Our portfolio includes several successful e-commerce projects.",
  },
  {
    id: uuidv4(),
    tenderId: sampleTenders[2].id,
    tenderTitle: sampleTenders[2].title,
    providerName: "App Innovators",
    bidAmount: "QR 95,000",
    status: "Pending",
    submittedAt: "2024-07-07T10:00:00Z",
    bidDescription:
      "Specializing in cross-platform mobile development, we guarantee a feature-rich and scalable food delivery app. Our proposal includes UI/UX design, development, testing, and post-launch support.",
  },
  {
    id: uuidv4(),
    tenderId: sampleTenders[4].id,
    tenderTitle: sampleTenders[4].title,
    providerName: "Digital Growth Agency",
    bidAmount: "QR 45,000",
    status: "Rejected",
    submittedAt: "2024-06-05T14:00:00Z",
    bidDescription:
      "Our agency provides data-driven digital marketing strategies. We will create a tailored campaign focusing on maximizing reach and conversion for your new product, utilizing a mix of paid and organic channels.",
    rejectionReason: "Budget exceeded client's maximum range.",
  },
  {
    id: uuidv4(),
    tenderId: sampleTenders[0].id,
    tenderTitle: sampleTenders[0].title,
    providerName: "Design & Code Studio",
    bidAmount: "QR 32,000",
    status: "Flagged",
    submittedAt: "2024-07-13T09:00:00Z",
    bidDescription:
      "We are a full-service digital agency offering bespoke web solutions. Our approach combines creative design with robust development to deliver a unique online presence. We have extensive experience in e-commerce platforms.",
  },
  {
    id: uuidv4(),
    tenderId: sampleTenders[2].id,
    tenderTitle: sampleTenders[2].title,
    providerName: "Mobile Solutions LLC",
    bidAmount: "QR 105,000",
    status: "Accepted",
    submittedAt: "2024-07-08T16:00:00Z",
    bidDescription:
      "Our team has a proven track record in developing high-quality mobile applications. We propose a comprehensive solution for your food delivery service, including advanced features like AI-powered recommendations and loyalty programs.",
  },
]

export const sampleKYCRequests: KYCRequest[] = [
  {
    id: uuidv4(),
    userId: sampleUsers[3].id,
    userName: sampleUsers[3].name,
    idType: "Passport",
    documentUrl: "/placeholder.svg?height=200&width=300",
    submittedAt: "2024-07-20T16:02:00Z",
    status: "pending",
  },
  {
    id: uuidv4(),
    userId: sampleUsers[4].id,
    userName: sampleUsers[4].name,
    idType: "National ID",
    documentUrl: "/placeholder.svg?height=200&width=300",
    submittedAt: "2023-05-02T09:00:00Z",
    status: "rejected",
  },
  {
    id: uuidv4(),
    userId: uuidv4(),
    userName: "New User A",
    idType: "Driving License",
    documentUrl: "/placeholder.svg?height=200&width=300",
    submittedAt: "2024-07-24T10:00:00Z",
    status: "pending",
  },
]

export const sampleSupportTickets: SupportTicket[] = [
  {
    id: uuidv4(),
    subject: "Unable to post new tender",
    description: "I am a project owner and I am unable to submit a new tender. The 'Submit' button is greyed out.",
    reportedBy: "Project Owner 1",
    status: "open",
    priority: "high",
    createdAt: "2024-07-23T10:00:00Z",
    assignedTo: "Admin User",
  },
  {
    id: uuidv4(),
    subject: "Inappropriate bid received",
    description: "A service provider submitted a bid with offensive language on my 'Website Redesign' tender.",
    reportedBy: "Project Owner 2",
    status: "pending",
    priority: "high",
    createdAt: "2024-07-22T15:30:00Z",
    assignedTo: "Admin User",
  },
  {
    id: uuidv4(),
    subject: "Account verification issue",
    description: "My KYC documents were rejected, but I'm not sure why. Can you provide more details?",
    reportedBy: "Service Provider 2",
    status: "resolved",
    priority: "medium",
    createdAt: "2024-07-19T09:00:00Z",
    assignedTo: "Admin User",
    resolutionNotes: "Contacted user, clarified document requirements, and guided them through resubmission.",
  },
  {
    id: uuidv4(),
    subject: "General inquiry about bid fees",
    description: "Can you explain how the bid fees are calculated and when they are charged?",
    reportedBy: "Service Provider 1",
    status: "closed",
    priority: "low",
    createdAt: "2024-07-18T11:00:00Z",
    assignedTo: "Admin User",
    resolutionNotes: "Provided link to FAQ and explained fee structure.",
  },
]

export const tenderCategories = [
  "Web Development",
  "Mobile Development",
  "Graphic Design",
  "Digital Marketing",
  "Content Writing",
  "Construction",
  "Consulting",
  "IT Services",
  "Event Management",
  "Security Services",
  "Interior Design",
]

export const bidFeeRevenueData = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 1500 },
  { month: "Mar", revenue: 1300 },
  { month: "Apr", revenue: 1800 },
  { month: "May", revenue: 2000 },
  { month: "Jun", revenue: 2500 },
  { month: "Jul", revenue: 2200 },
]

export const userGrowthData = [
  { month: "Jan", users: 10 },
  { month: "Feb", users: 15 },
  { month: "Mar", users: 22 },
  { month: "Apr", users: 30 },
  { month: "May", users: 45 },
  { month: "Jun", users: 60 },
  { month: "Jul", users: 75 },
]

export const tendersOverTimeData = [
  { month: "Jan", tenders: 3 },
  { month: "Feb", tenders: 5 },
  { month: "Mar", tenders: 8 },
  { month: "Apr", tenders: 12 },
  { month: "May", tenders: 10 },
  { month: "Jun", tenders: 15 },
  { month: "Jul", tenders: 13 },
]

export const bidsTrendData = [
  { month: "Jan", bids: 8 },
  { month: "Feb", bids: 12 },
  { month: "Mar", bids: 18 },
  { month: "Apr", bids: 25 },
  { month: "May", bids: 20 },
  { month: "Jun", bids: 30 },
  { month: "Jul", bids: 28 },
]

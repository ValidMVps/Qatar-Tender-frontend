"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AuthGuard } from "@/components/auth-guard";
import {
  Building2,
  ArrowLeft,
  DollarSign,
  MapPin,
  Calendar,
  MessageSquare,
  Award,
  Star,
  Send,
  Shield,
  CheckCircle,
  X,
  Clock,
  LockIcon,
  User,
  Briefcase,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProviderBadge } from "@/components/provider-badge"; // Assuming this component exists
import useTranslation from "@/lib/hooks/useTranslation";

// Sample data - this would come from API based on tender ID
const getTenderData = (id: string) => {
  const tenders = {
    "1": {
      id: 1,
      title: "Office Building Construction Project",
      description:
        "We are looking for a qualified contractor to handle this important construction project in West Bay. The project involves complete construction of a 5-story office building with modern amenities.",
      budget: "150,000",
      deadline: "2024-02-15",
      status: "active",
      category: "Construction",
      location: "West Bay, Doha",
      postedDate: "Jan 10, 2024",
      requirements: ["Verified Provider", "Sample Work Provided"],
      company: {
        name: "TechCorp Solutions",
        logo: "/placeholder-logo.png",
        location: "Doha, Qatar",
        verified: true,
        rating: 4.8,
        reviewsCount: 127,
        projectsCompleted: 45,
      },
      skills: ["Construction", "Project Management", "Architecture"],
      viewsCount: 320,
      attachments: [
        { name: "Building Plans.pdf", size: "5.2 MB" },
        { name: "Material Specifications.docx", size: "1.1 MB" },
      ],
    },
    "2": {
      id: 2,
      title: "Website Development and Design",
      description:
        "Modern responsive website needed for our consulting firm with Arabic and English support. Must include CMS, SEO optimization, and mobile-first design approach.",
      budget: "25,000",
      deadline: "2024-02-20",
      status: "pending_approval",
      category: "IT Services",
      location: "Doha, Qatar",
      postedDate: "Pending Admin Approval",
      requirements: ["Portfolio Required", "Arabic Language Support"],
      company: {
        name: "Digital Innovators",
        logo: "/placeholder-logo.png",
        location: "Doha, Qatar",
        verified: true,
        rating: 4.5,
        reviewsCount: 80,
        projectsCompleted: 30,
      },
      skills: ["React.js", "Node.js", "UI/UX Design", "SEO"],
      viewsCount: 180,
      attachments: [],
    },
    "7": {
      id: 7,
      title: "Security System Upgrade",
      description:
        "Upgrade existing security system with modern CCTV cameras, access control, and monitoring software for our corporate headquarters.",
      budget: "65,000",
      deadline: "2024-02-25",
      status: "pending_approval",
      category: "Security",
      location: "West Bay, Doha",
      postedDate: "Pending Admin Approval",
      requirements: ["Licensed Security Provider", "24/7 Support"],
      company: {
        name: "Secure Solutions",
        logo: "/placeholder-logo.png",
        location: "Doha, Qatar",
        verified: true,
        rating: 4.7,
        reviewsCount: 60,
        projectsCompleted: 25,
      },
      skills: ["CCTV", "Access Control", "Network Security"],
      viewsCount: 250,
      attachments: [],
    },
    "16": {
      id: 16,
      title: "Corporate Training Program Development",
      description:
        "Comprehensive corporate training program for 200+ employees covering leadership, digital skills, and compliance. Includes curriculum development, training materials, and delivery across multiple locations.",
      budget: "95,000",
      deadline: "2024-03-05",
      status: "active",
      category: "Training & Development",
      location: "Multiple Locations, Qatar",
      postedDate: "Jan 8, 2024",
      requirements: ["Training Certification", "Multi-location Capability"],
      company: {
        name: "Global Learning",
        logo: "/placeholder-logo.png",
        location: "Doha, Qatar",
        verified: true,
        rating: 4.9,
        reviewsCount: 150,
        projectsCompleted: 50,
      },
      skills: [
        "Curriculum Design",
        "Corporate Training",
        "Leadership Development",
      ],
      viewsCount: 400,
      attachments: [{ name: "Training Outline.pdf", size: "1.5 MB" }],
    },
  };
  return tenders[id as keyof typeof tenders] || tenders["1"];
};

const getBidsForTender = (tenderId: string) => {
  const bidsData = {
    "1": [
      {
        id: 1,
        providerName: "Qatar Construction Co.",
        providerRating: 4.8,
        providerBadge: "gold",
        isVerified: true,
        bidAmount: "145,000",
        bidSummary:
          "We have 15+ years of experience in commercial construction. Our team can complete this project within the specified timeline with high-quality materials.",
        submittedDate: "Jan 12, 2024",
        status: "pending",
        completedProjects: 28,
        onTimeDelivery: 95,
        bidderProfileId: "1", // Link to bidder profile
        platformRank: 5,
      },
      {
        id: 2,
        providerName: "Al-Rayyan Builders",
        providerRating: 4.6,
        providerBadge: "bronze",
        isVerified: false,
        bidAmount: "138,000",
        bidSummary:
          "Specialized in office building construction with modern techniques. We guarantee quality work and timely delivery.",
        submittedDate: "Jan 13, 2024",
        status: "pending",
        completedProjects: 15,
        onTimeDelivery: 88,
        bidderProfileId: "2", // Link to bidder profile
        platformRank: 12,
      },
      {
        id: 3,
        providerName: "Doha Elite Construction",
        providerRating: 4.9,
        providerBadge: "platinum",
        isVerified: true,
        bidAmount: "152,000",
        bidSummary:
          "Premium construction services with 20+ years of experience. We use only the finest materials and latest construction techniques.",
        submittedDate: "Jan 11, 2024",
        status: "awarded",
        completedProjects: 45,
        onTimeDelivery: 98,
        bidderProfileId: "3", // Link to bidder profile
        platformRank: 1,
      },
    ],
    "2": [
      {
        id: 4,
        providerName: "Qatar Digital Solutions",
        providerRating: 4.7,
        providerBadge: "gold",
        isVerified: true,
        bidAmount: "22,000",
        bidSummary:
          "Full-stack web development with Arabic/English support. We specialize in responsive design and modern CMS solutions.",
        submittedDate: "Jan 14, 2024",
        status: "pending",
        completedProjects: 32,
        onTimeDelivery: 92,
        bidderProfileId: "1", // Reusing profile for demo
        platformRank: 5,
      },
      {
        id: 5,
        providerName: "Doha Web Studio",
        providerRating: 4.4,
        providerBadge: "bronze",
        isVerified: false,
        bidAmount: "18,500",
        bidSummary:
          "Creative web design and development services. We focus on user experience and mobile-first approach.",
        submittedDate: "Jan 15, 2024",
        status: "pending",
        completedProjects: 12,
        onTimeDelivery: 85,
        bidderProfileId: "2", // Reusing profile for demo
        platformRank: 12,
      },
    ],
    "7": [
      {
        id: 7,
        providerName: "SecureGuard Qatar",
        providerRating: 4.9,
        providerBadge: "platinum",
        isVerified: true,
        bidAmount: "62,000",
        bidSummary:
          "Complete security system upgrade with latest CCTV technology, access control, and 24/7 monitoring services.",
        submittedDate: "Jan 17, 2024",
        status: "pending",
        completedProjects: 35,
        onTimeDelivery: 98,
        bidderProfileId: "3", // Reusing profile for demo
        platformRank: 1,
      },
      {
        id: 8,
        providerName: "Al-Ameen Security",
        providerRating: 4.5,
        providerBadge: "gold",
        isVerified: true,
        bidAmount: "58,500",
        bidSummary:
          "Licensed security provider with expertise in corporate security systems. Includes installation, training, and maintenance.",
        submittedDate: "Jan 18, 2024",
        status: "pending",
        completedProjects: 22,
        onTimeDelivery: 90,
        bidderProfileId: "1", // Reusing profile for demo
        platformRank: 5,
      },
    ],
    "16": [
      {
        id: 16,
        providerName: "Qatar Learning Solutions",
        providerRating: 4.9,
        providerBadge: "platinum",
        isVerified: true,
        bidAmount: "89,000",
        bidSummary:
          "Comprehensive training solutions with 10+ years experience. We specialize in corporate training programs with proven methodologies and certified trainers.",
        submittedDate: "Jan 9, 2024",
        status: "pending",
        completedProjects: 42,
        onTimeDelivery: 97,
        bidderProfileId: "3", // Reusing profile for demo
        platformRank: 1,
      },
      {
        id: 17,
        providerName: "Gulf Training Institute",
        providerRating: 4.7,
        providerBadge: "gold",
        isVerified: true,
        bidAmount: "92,500",
        bidSummary:
          "Professional training institute with expertise in leadership and digital skills training. We offer customized curriculum and multi-location delivery.",
        submittedDate: "Jan 10, 2024",
        status: "pending",
        completedProjects: 38,
        onTimeDelivery: 94,
        bidderProfileId: "1", // Reusing profile for demo
        platformRank: 5,
      },
      {
        id: 18,
        providerName: "Doha Corporate Academy",
        providerRating: 4.8,
        providerBadge: "gold",
        isVerified: true,
        bidAmount: "87,500",
        bidSummary:
          "Specialized in corporate training with focus on leadership development and compliance training. We have trained over 5000+ professionals across Qatar.",
        submittedDate: "Jan 11, 2024",
        status: "pending",
        completedProjects: 35,
        onTimeDelivery: 96,
        bidderProfileId: "2", // Reusing profile for demo
        platformRank: 12,
      },
      {
        id: 19,
        providerName: "Excellence Training Center",
        providerRating: 4.6,
        providerBadge: "bronze",
        isVerified: false,
        bidAmount: "85,000",
        bidSummary:
          "Training center with expertise in digital skills and professional development. We offer flexible scheduling and modern training facilities.",
        submittedDate: "Jan 12, 2024",
        status: "pending",
        completedProjects: 28,
        onTimeDelivery: 89,
        bidderProfileId: "3", // Reusing profile for demo
        platformRank: 1,
      },
    ],
  };
  return bidsData[tenderId as keyof typeof bidsData] || [];
};

const getQAForTender = (tenderId: string) => {
  const qaData = {
    "1": [
      {
        id: 1,
        question: "What type of foundation is required for this project?",
        answer:
          "The project requires a reinforced concrete foundation suitable for a 5-story structure. Detailed specifications will be provided to the selected contractor.",
        providerName: "Qatar Construction Co.",
        questionDate: "Jan 11, 2024",
        answerDate: "Jan 11, 2024",
      },
      {
        id: 2,
        question:
          "Are there any specific building materials that must be used?",
        answer: "",
        providerName: "Al-Rayyan Builders",
        questionDate: "Jan 12, 2024",
        answerDate: null,
      },
    ],
    "2": [
      {
        id: 3,
        question:
          "Do you require a custom CMS or would WordPress be acceptable?",
        answer: "",
        providerName: "Qatar Digital Solutions",
        questionDate: "Jan 14, 2024",
        answerDate: null,
      },
    ],
    "7": [
      {
        id: 4,
        question:
          "What is the total square footage of the area requiring security coverage?",
        answer: "",
        providerName: "SecureGuard Qatar",
        questionDate: "Jan 17, 2024",
        answerDate: null,
      },
    ],
    "16": [
      {
        id: 5,
        question:
          "What is the preferred training methodology - classroom, online, or hybrid?",
        answer:
          "We prefer a hybrid approach combining classroom sessions for leadership training and online modules for digital skills. This allows for better engagement and flexibility.",
        providerName: "Qatar Learning Solutions",
        questionDate: "Jan 9, 2024",
        answerDate: "Jan 10, 2024",
      },
      {
        id: 6,
        question:
          "Are there specific compliance standards we need to address in the training?",
        answer:
          "Yes, the training must cover Qatar Labor Law compliance, workplace safety regulations, and our internal code of conduct. We'll provide detailed compliance requirements to the selected provider.",
        providerName: "Gulf Training Institute",
        questionDate: "Jan 11, 2024",
        answerDate: "Jan 12, 2024",
      },
      {
        id: 7,
        question: "What is the expected duration for each training module?",
        answer:
          "Each module should be 2-3 hours long with breaks. Leadership modules can be full-day sessions (6-8 hours) while digital skills modules should be shorter (1-2 hours) for better retention.",
        providerName: "Doha Corporate Academy",
        questionDate: "Jan 13, 2024",
        answerDate: "Jan 14, 2024",
      },
      {
        id: 8,
        question: "Do you require post-training assessment and certification?",
        answer:
          "Yes, we require comprehensive assessments for all modules and official certificates upon completion. The certificates should be recognized and include our company branding.",
        providerName: "Excellence Training Center",
        questionDate: "Jan 14, 2024",
        answerDate: "Jan 15, 2024",
      },
      {
        id: 9,
        question:
          "What languages should the training materials be available in?",
        answer:
          "Training materials should be available in both English and Arabic. All trainers must be bilingual to accommodate our diverse workforce effectively.",
        providerName: "Qatar Learning Solutions",
        questionDate: "Jan 15, 2024",
        answerDate: "Jan 16, 2024",
      },
    ],
  };
  return qaData[tenderId as keyof typeof qaData] || [];
};

const chatMessages = [
  {
    id: 1,
    sender: "provider",
    message:
      "Thank you for awarding us this project. When can we schedule the initial site visit?",
    timestamp: "2:30 PM",
    senderName: "Doha Elite Construction",
  },
  {
    id: 2,
    sender: "poster",
    message:
      "Great! We can schedule it for tomorrow morning at 9 AM. Please bring your site engineer.",
    timestamp: "2:45 PM",
    senderName: "Ahmed Al-Mahmoud",
  },
  {
    id: 3,
    sender: "provider",
    message:
      "Perfect. Our site engineer will be there. Should we bring the initial material samples?",
    timestamp: "3:00 PM",
    senderName: "Doha Elite Construction",
  },
];

export default function TenderDetailPage() {
  const { t } = useTranslation();

  const params = useParams();
  const tenderId = params.id as string;
  const tenderData = getTenderData(tenderId);
  const initialBids = getBidsForTender(tenderId);
  const qaData = getQAForTender(tenderId);

  const [activeTab, setActiveTab] = useState("bids");
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [onTimeDelivery, setOnTimeDelivery] = useState(false);
  const [bids, setBids] = useState(initialBids);
  const [isSaved, setIsSaved] = useState(false); // Added for save functionality

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "platinum":
        return "bg-black text-white border-black";
      case "gold":
        return "bg-gray-800 text-white border-gray-800";
      case "bronze":
        return "bg-gray-600 text-white border-gray-600";
      default:
        return "bg-gray-200 text-gray-800 border-gray-200";
    }
  };

  const getBidStatusColor = (status: string) => {
    switch (status) {
      case "awarded":
        return "bg-black text-white border-black";
      case "rejected":
        return "bg-gray-600 text-white border-gray-600";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-black text-white border-black";
      case "pending_approval":
        return "bg-gray-600 text-white border-gray-600";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "draft":
        return "bg-gray-300 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "active";
      case "pending_approval":
        return "Pending Approval";
      case "closed":
        return "Closed";
      case "draft":
        return "Draft";
      default:
        return "Unknown";
    }
  };

  const maskSensitiveInfo = (text: string) => {
    text = text.replace(/https?:\/\/[^\s]+/g, "[LINK MASKED]");
    return text;
  };

  const handleAwardBid = (bidId: number) => {
    setBids((prevBids) =>
      prevBids.map((bid) => ({
        ...bid,
        status:
          bid.id === bidId
            ? "awarded"
            : bid.status === "awarded"
            ? "pending"
            : bid.status,
      }))
    );
  };

  const handleRejectBid = (bidId: number) => {
    setBids((prevBids) =>
      prevBids.map((bid) =>
        bid.id === bidId ? { ...bid, status: "rejected" } : bid
      )
    );
  };

  const handleSubmitRating = () => {
    console.log("Rating submitted:", { rating, onTimeDelivery });
    setShowRatingModal(false);
  };

  const awardedBid = bids.find((bid) => bid.status === "awarded");
  const hasAwardedBid = !!awardedBid;
  const isPendingApproval = tenderData.status === "pending_approval";

  return (
    <div className="container mx-auto px-0 py-8">
      <div className="">
        {/* Pending Approval Notice */}
        {isPendingApproval && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-gray-800">
                  Tender Pending Approval
                </h3>
                <p className="text-sm text-gray-700 mt-1">
                  This tender is currently under admin review. Bids and Q&A will
                  be available once the tender is active.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tender Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {tenderData.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Posted: {tenderData.postedDate}
                </span>
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {tenderData.location}
                </span>
                <span className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {tenderData.budget} QAR
                </span>
              </div>
            </div>
            <Badge className={`border ${getStatusColor(tenderData.status)}`}>
              {getStatusText(tenderData.status)}
            </Badge>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {tenderData.description}
          </p>
        </div>

        {/* Tabs - Only show if not pending approval */}
        {!isPendingApproval ? (
          <>
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("bids")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "bids"
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Bids ({bids.length})
                </button>
                <button
                  onClick={() => setActiveTab("qa")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "qa"
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Q&A ({qaData.length})
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "bids" && (
              <div className="space-y-6">
                {bids.length > 0 ? (
                  bids.map((bid) => (
                    <Popover key={bid.id}>
                      <PopoverTrigger asChild>
                        <Card className="border border-gray-200  cursor-pointer ">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                  <Building2 className="h-6 w-6 text-gray-600" />
                                </div>
                                <div>
                                  <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="font-semibold text-gray-900">
                                      {bid.providerName}
                                    </h3>

                                    {bid.status === "awarded" && (
                                      <Badge className="bg-black text-white border-black">
                                        AWARDED
                                      </Badge>
                                    )}
                                    {bid.status === "rejected" && (
                                      <Badge className="bg-gray-600 text-white border-gray-600">
                                        REJECTED
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span className="flex items-center">
                                      <Star className="h-4 w-4 mr-1 text-gray-400 fill-current" />
                                      {bid.providerRating}
                                    </span>
                                    <span>
                                      {bid.completedProjects} projects
                                    </span>
                                    <span>{bid.onTimeDelivery}% on-time</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">
                                  {bid.bidAmount} QAR
                                </div>
                                <div className="text-sm text-gray-500">
                                  Submitted: {bid.submittedDate}
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-4">
                              {maskSensitiveInfo(bid.bidSummary)}
                            </p>
                            <div className="flex items-center space-x-3">
                              {bid.status === "pending" && !hasAwardedBid && (
                                <>
                                  <Button
                                    onClick={() => handleAwardBid(bid.id)}
                                    size="sm"
                                    className="bg-black hover:bg-gray-800"
                                  >
                                    <Award className="h-4 w-4 mr-1" />
                                    Award Bid
                                  </Button>
                                  <Button
                                    onClick={() => handleRejectBid(bid.id)}
                                    variant="outline"
                                    size="sm"
                                    className="bg-transparent text-gray-600 border-gray-200 hover:bg-gray-50"
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    {t("reject")}
                                  </Button>
                                </>
                              )}
                              {bid.status === "pending" && hasAwardedBid && (
                                <div className="text-sm text-gray-500 italic">
                                  Bid cannot be awarded - another bid has
                                  already been selected
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {bid.providerName}
                            </h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Star className="h-3 w-3 mr-1 text-gray-400 fill-current" />
                                {bid.providerRating}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm text-gray-700 mb-4">
                          <p className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-gray-500" />
                            {bid.completedProjects} Projects Completed
                          </p>
                        </div>
                        <Link
                          href={`/dashboard/my-tenders/bidder-profile/${bid.bidderProfileId}`}
                          passHref
                        >
                          <Button
                            size="sm"
                            className="w-full cursor-pointer bg-black hover:bg-gray-800"
                          >
                            View Full Profile
                          </Button>
                        </Link>
                      </PopoverContent>
                    </Popover>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No bids yet
                    </h3>
                    <p className="text-gray-600">
                      Providers haven't submitted any bids for this tender yet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "qa" && (
              <div className="space-y-6">
                {qaData.length > 0 ? (
                  qaData.map((qa) => (
                    <Card key={qa.id} className="border border-gray-200">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <MessageSquare className="h-5 w-5 text-gray-600" />
                              <span className="font-medium text-gray-900">
                                {qa.providerName}
                              </span>
                              <span className="text-sm text-gray-500">
                                {qa.questionDate}
                              </span>
                            </div>
                            <p className="text-gray-700 pl-8">
                              {maskSensitiveInfo(qa.question)}
                            </p>
                          </div>
                          {qa.answer ? (
                            <div className="pl-8 border-l-2 border-gray-200">
                              <div className="flex items-center space-x-3 mb-2">
                                <span className="font-medium text-gray-700">
                                  Your Answer
                                </span>
                                <span className="text-sm text-gray-500">
                                  {qa.answerDate}
                                </span>
                              </div>
                              <p className="text-gray-700">
                                {maskSensitiveInfo(qa.answer)}
                              </p>
                            </div>
                          ) : (
                            <div className="pl-8">
                              <Textarea
                                placeholder="Type your answer..."
                                value={newAnswer}
                                onChange={(e) => setNewAnswer(e.target.value)}
                                className="mb-3"
                              />
                              <Button
                                size="sm"
                                className="bg-black hover:bg-gray-800"
                              >
                                <Send className="h-4 w-4 mr-1" />
                                {t("reply")}
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No questions yet
                    </h3>
                    <p className="text-gray-600">
                      Providers haven't asked any questions about this tender
                      yet.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          // Content for pending approval tenders
          <div className="space-y-6">
            <Card className="border border-gray-200 bg-gray-50">
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <LockIcon className="h-8 w-8 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    Content Locked
                  </h3>
                  <p className="text-gray-700 max-w-md mx-auto mb-4">
                    Bids and Q&A sections are hidden until your tender is active
                    by an administrator. This helps ensure quality and
                    compliance with platform guidelines.
                  </p>
                  <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending Admin Approval
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

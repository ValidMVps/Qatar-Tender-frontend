"use client";
import { useState, use, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Star,
  DollarSign,
  MapPin,
  Save,
  ArrowLeft,
  Calendar,
  User,
  Building,
  Mail,
  Clock,
  Tag,
  Image as ImageIcon,
  CreditCard,
  Shield,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ApplyTenderForm } from "@/components/apply-tender-form";
import useTranslation from "@/lib/hooks/useTranslation";
import { getTender } from "@/app/services/tenderService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createBid, getUserBids } from "@/app/services/BidService";
import QnaSection from "@/components/QnaSection";
import PageTransitionWrapper from "@/components/animations/PageTransitionWrapper";
import BiddingSection from "@/components/BiddingSection";
import { useAuth } from "@/context/AuthContext";

interface Tender {
  bidCount: string | number;
  _id: string;
  title: string;
  description: string;
  category: {
    _id: string;
    name: string;
    description: string;
  };
  location: string;
  estimatedBudget: number;
  deadline: string;
  status: string;
  contactEmail: string;
  image?: string;
  postedBy: {
    _id: string;
    email: string;
    userType: string;
    name?: string;
    isVerified?: boolean;
    rating?: number;
    profile: any;
    completedProjects?: number;
    showPublicProfile?: boolean; // 👈 ADD THIS
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}
interface Bid {
  _id: string;
  tender: {
    _id: string;
    title?: string;
    // other fields if needed
  };
  bidder: {
    _id: string;
    name: string;
  };
  amount: number;
  description: string;
  paymentStatus: "pending" | "completed" | "failed";
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}
interface QuestionAnswer {
  id: number;
  question: string;
  answer: string | null;
  askedTime: string;
}
// Updated interface for Next.js 15
interface PageProps {
  params: Promise<{ id: string }>;
}
// Multi-step form steps
enum BidStep {
  BID_DETAILS = 1,
  REVIEW = 2,
  PAYMENT = 3,
  CONFIRMATION = 4,
}
// Mock data for Q&A (will be replaced with real API later)
export default function TenderDetailsPage({ params }: PageProps) {
  // Use the 'use' hook to unwrap the Promise
  const { id } = use(params);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [tender, setTender] = useState<Tender | null>(null);
  const [userBid, setUserBid] = useState<Bid | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUserBid, setHasUserBid] = useState(false);
  const [canviewtenderifno, setcanviewtenderifno] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  const { profile } = useAuth();

  // Load tender details and check if user has already bid
  useEffect(() => {
    const loadTenderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        // load tender
        const tenderData = await getTender(id);
        if (tenderData.postedBy) {
          tenderData.postedBy.rating = 4.7;
          tenderData.postedBy.completedProjects = 23;
        }
        setTender(tenderData);
        // load user bids and check if one matches this tender id
        try {
          const userBids: Bid[] = (await getUserBids()) || [];
          // normalize comparison
          const existingBid =
            userBids.find((bid: Bid) => {
              const bidTenderId =
                typeof bid.tender === "string"
                  ? bid.tender
                  : String(bid.tender?._id);
              return String(bidTenderId) === String(id);
            }) || null;
          setUserBid(existingBid);
          setHasUserBid(!!existingBid);
        } catch (bidsError) {
          console.error("Error loading user bids:", bidsError);
          // optional: setHasUserBid(false)
        }
      } catch (err: any) {
        console.error("Error loading tender:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load tender"
        );
      } finally {
        setLoading(false);
      }
    };
    if (id) loadTenderDetails();
  }, [id]);
  useEffect(() => {
    if (!tender && !userBid) return;

    setcanviewtenderifno(
      (userBid &&
        (userBid.status === "accepted" ||
          userBid.paymentStatus === "completed")) ||
        tender?.postedBy?.profile.showPublicProfile === true
    );
  }, [userBid, tender]);
  const getCategoryName = (category: any) => {
    if (typeof category === "string") return category;
    if (category?.name) return category.name;
    if (category?.title) return category.title;
    return "General";
  };
  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case "individual":
        return "Individual Client";
      case "business":
        return "Business Client";
      case "organization":
        return "Organization";
      default:
        return "Client";
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return (
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className="h-3 w-3 fill-blue-500 text-blue-500"
          />
        ))}
        {hasHalfStar && (
          <Star className="h-3 w-3 fill-blue-500 text-blue-500 opacity-50" />
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );
    if (diffInHours < 1) return "Less than an hour ago";
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="container mx-auto py-8 lg:px-0">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
              <p className="text-gray-600 font-medium">
                Loading tender details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tender) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="container mx-auto py-8 lg:px-0">
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 max-w-md mx-auto border border-gray-100">
              <p className="text-red-500 font-medium mb-6 text-lg">
                {error || "Tender not found"}
              </p>
              <div onClick={() => router.back()}>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6 py-2 font-medium transition-all duration-300">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Tenders
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageTransitionWrapper>
      <TooltipProvider>
        <div className="min-h-screen">
          {" "}
          <div className="bg-white border-b border-gray-200">
            <div className="mx-auto px-4 sm:px-6 lg:px-14">
              <div className="flex items-center justify-between h-16">
                <div
                  onClick={() => router.back()}
                  className="flex items-center text-blue-500 hover:text-blue-600 font-medium transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Browse Tenders
                </div>
              </div>
            </div>
          </div>
          <div className="container mx-auto py-1 lg:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Tender Details */}
              <div className="lg:col-span-3">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl 5 overflow-hidden">
                  {/* Header Section */}
                  <div className="p-8 pb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>Posted {formatTimeAgo(tender.createdAt)}</span>
                        <span>•</span>
                        <span>Updated {formatTimeAgo(tender.updatedAt)}</span>
                      </div>
                      <div onClick={() => router.back()}>
                        <Button
                          variant="outline"
                          className="text-sm bg-white/60 border-gray-200/50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 rounded-xl transition-all duration-300"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Tenders
                        </Button>
                      </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                      {tender.title}
                    </h1>
                    {/* Client Information Card - Enhanced with rating */}
                    <div className="bg-blue-50/50 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {canviewtenderifno
                                ? tender.postedBy?.name ||
                                  tender.postedBy?.email ||
                                  "Client"
                                : "Anonymous Client"}
                            </h3>

                            {tender.postedBy?.isVerified &&
                              canviewtenderifno && (
                                <CheckCircle className="h-4 w-4 text-blue-500" />
                              )}
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="text-sm text-gray-600">
                              {getUserTypeLabel(tender.postedBy?.userType)}
                            </p>
                            {tender.postedBy?.rating && (
                              <div className="flex items-center gap-1">
                                {renderStars(tender.postedBy.rating)}
                                <span className="text-sm font-medium text-gray-700 ml-1">
                                  {tender.postedBy.rating}
                                </span>
                              </div>
                            )}
                            {tender.postedBy?.completedProjects && (
                              <span className="text-sm text-gray-600">
                                {tender.postedBy.completedProjects} projects
                                completed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {canviewtenderifno && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span>{tender.contactEmail}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Key Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      {/* Budget */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium text-green-700">
                            Budget
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-green-700">
                          ${tender.estimatedBudget?.toLocaleString()}
                        </p>
                      </div>
                      {/* Deadline */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">
                            Deadline
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-blue-700">
                          {formatDate(tender.deadline)}
                        </p>
                      </div>
                      {/* Location */}
                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border border-purple-100">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-5 w-5 text-purple-600" />
                          <span className="text-sm font-medium text-purple-700">
                            Location
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-purple-700">
                          {tender.location}
                        </p>
                      </div>
                      {/* Bids Placed */}
                      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-5 border border-yellow-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-5 w-5 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-700">
                            Bids Placed
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-yellow-700">
                          {tender?.bidCount}
                        </p>
                      </div>
                    </div>
                    {/* Status and Category */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      <Badge
                        className={`px-4 py-2 rounded-full font-medium text-sm ${
                          tender.status === "active"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        {tender.status === "active"
                          ? "🟢 Active"
                          : "⛔ " + tender.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 border-blue-200"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tender.category?.name}
                      </Badge>
                    </div>
                    {/* Tender Image */}
                    {tender.image && (
                      <div className="mb-6">
                        <img
                          src={tender.image}
                          alt={tender.title}
                          className="w-full h-64 object-cover rounded-xl border border-gray-200/50"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                  {/* Content Section */}
                  <div className="px-8 pb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Project Description
                    </h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap mb-6">
                        {tender.description}
                      </p>
                    </div>
                    {tender.category?.description && (
                      <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <h3 className="font-semibold text-gray-800 mb-2">
                          Category Details
                        </h3>
                        <p className="text-gray-600">
                          {tender.category.description}
                        </p>
                      </div>
                    )}
                    {/* Q&A Section */}
                    <QnaSection tenderid={tender._id} />
                  </div>
                </div>
              </div>
              {/* Apply to Bid Sidebar */}
              <div className="lg:col-span-1 mt-5">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 shadow-lg shadow-blue-500/5 sticky top-6">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Your Bid on this Project
                    </h2>
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Status:</span>
                        <Badge
                          className={`px-2 py-1 text-xs ${
                            tender.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {tender.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Deadline:</span>
                        <span className="font-medium text-gray-900">
                          {formatDate(tender.deadline)}
                        </span>
                      </div>
                      {userBid && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Your Bid:</span>
                          <span className="font-bold text-green-600">
                            ${userBid.amount.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                    {userBid ? (
                      // Show My Bids button if user has already bid
                      <div className="space-y-3">
                        <Button
                          onClick={() =>
                            router.push("/business-dashboard/bids")
                          }
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-medium transition-all duration-300 shadow-lg shadow-blue-500/25"
                        >
                          View My Bids
                        </Button>
                      </div>
                    ) : tender.status === "active" &&
                      new Date(tender.deadline) > new Date() ? (
                      // Show Submit Bid button if user hasn't bid and tender is active
                      <div className="space-y-3">
                        <Button
                          onClick={() => setShowApplyForm(true)}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-medium transition-all duration-300 shadow-lg shadow-blue-500/25"
                        >
                          Submit Your Bid
                        </Button>
                      </div>
                    ) : (
                      // Show inactive message
                      <div className="text-center py-6 bg-gray-50/50 rounded-xl">
                        <p className="text-gray-500 text-sm font-medium">
                          {tender.status !== "active"
                            ? "🚫 This tender is no longer active"
                            : "⏰ Bidding deadline has passed"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Multi-Step Bid Form Modal */}
          {showApplyForm && (
            <BiddingSection
              tenderId={tender._id}
              estimatedBudget={tender.estimatedBudget}
              onBidSubmitted={() => {
                setShowApplyForm(false);
                window.location.reload();
              }}
              onCancel={() => {
                setShowApplyForm(false);
              }}
            />
          )}
        </div>
      </TooltipProvider>
    </PageTransitionWrapper>
  );
}

"use client";
import { useState, useEffect, use } from "react"; // Removed unused 'use'
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
  ImageIcon,
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
import { useParams, useRouter } from "next/navigation";
import { createBid, getUserBids, deleteBid } from "@/app/services/BidService";
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
    completedTenders?: number;
    showPublicProfile?: boolean;
    isDocumentVerified?: any;
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
  };
  bidder: {
    _id: string;
    name: string;
  };
  amount: number;
  description: string;
  paymentStatus: "pending" | "completed" | "failed";
  status: "pending" | "accepted" | "rejected" | "under_review";
  createdAt: string;
}
interface QuestionAnswer {
  id: number;
  question: string;
  answer: string | null;
  askedTime: string;
}
interface PageProps {
  params: Promise<{ id: string }>;
}
enum BidStep {
  BID_DETAILS = 1,
  REVIEW = 2,
  PAYMENT = 3,
  CONFIRMATION = 4,
}

export default function TenderDetailsPage({ params }: PageProps) {
  const { id } = use(params); // Note: In Next.js 13+, params is not a Promise in client components
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [tender, setTender] = useState<Tender | null>(null);
  const [userBid, setUserBid] = useState<Bid | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUserBid, setHasUserBid] = useState(false);
  const [canviewtenderifno, setcanviewtenderifno] = useState(false);
  const [retryingPayment, setRetryingPayment] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  const { profile } = useAuth();

  // Load tender details and check user bids
  useEffect(() => {
    const loadTenderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const tenderData = await getTender(id);
        console.log(tenderData);
        setTender(tenderData);
        try {
          const userBids: Bid[] = (await getUserBids()) || [];
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
    if (!tender || !userBid) return;
    setcanviewtenderifno(
      userBid && ["accepted", "completed"].includes(userBid.status)
    );
  }, [userBid, tender]);

  // Handle retry payment
  const handleRetryPayment = async () => {
    if (!userBid) return;
    setRetryingPayment(true);
    try {
      // Delete the previous bid
      await deleteBid(userBid._id);
      // Create a new bid with the same data
      const response = await createBid({
        tender: id,
        amount: userBid.amount,
        description: userBid.description,
      });
      if (response.success && response.payment?.paymentUrl) {
        // Redirect to the new payment URL
        window.location.href = response.payment.paymentUrl;
      } else {
        throw new Error("Payment URL not received");
      }
    } catch (err: any) {
      console.error("Error retrying payment:", err);
      toast.error(err?.message || "Failed to retry payment");
    } finally {
      setRetryingPayment(false);
    }
  };

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
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
              <p className="text-gray-600 font-medium text-sm sm:text-base">
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
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 sm:py-16">
            <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md mx-auto border border-gray-100">
              <p className="text-red-500 font-medium mb-4 sm:mb-6 text-base sm:text-lg">
                {error || "Tender not found"}
              </p>
              <div onClick={() => router.back()}>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl px-4 py-2 sm:px-6 sm:py-2.5 font-medium text-sm sm:text-base transition-all duration-300">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t("back_to_tenders")}
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
        <div className="min-h-screen ">
          <div className="bg-white border-b border-gray-200">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-14 sm:h-16">
                <div
                  onClick={() => router.back()}
                  className="flex items-center text-blue-500 hover:text-blue-600 font-medium text-sm sm:text-base transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  {t("browse_tenders")}
                </div>
              </div>
            </div>
          </div>
          <div className=" mx-auto py-4 sm:py-6 px-0 sm:px-2 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="lg:col-span-3">
                <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl overflow-hidden">
                  <div className="p-6 sm:p-8 pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 flex-wrap">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Posted {formatTimeAgo(tender.createdAt)}</span>
                        <span>•</span>
                        <span>Updated {formatTimeAgo(tender.updatedAt)}</span>
                      </div>
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                      {tender.title}
                    </h1>
                    <div className="bg-blue-50/50 rounded-xl p-4 mb-6">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                              {canviewtenderifno
                                ? tender.postedBy?.name ||
                                  tender.postedBy?.profile.companyName ||
                                  tender.postedBy?.profile.fullName ||
                                  "Client"
                                : "Anonymous Client"}
                            </h3>
                            {tender.postedBy?.isDocumentVerified ? (
                              <div className="flex justify-center ms-3 font-medium items-center gap-2 text-green-500">
                                <CheckCircle className="h-3 w-3 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />{" "}
                                Verefied
                              </div>
                            ) : (
                              <div className="flex justify-center ms-3 font-medium items-center gap-2 text-red-500">
                                <AlertCircle className="h-3 w-3 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />{" "}
                                Not Verefied
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
                            <p className="text-xs sm:text-sm text-gray-600">
                              {getUserTypeLabel(tender.postedBy?.userType)}
                            </p>
                            {tender.postedBy?.profile && (
                              <>
                                {/* ✅ Rating */}
                                <div className="flex items-center gap-1">
                                  {tender.postedBy.profile.rating > 0 ? (
                                    <>
                                      {renderStars(
                                        tender.postedBy.profile.rating
                                      )}
                                      <span className="text-xs sm:text-sm font-medium text-gray-700 ml-1">
                                        {tender.postedBy.profile.rating.toFixed(
                                          1
                                        )}{" "}
                                        Rating
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-xs sm:text-sm text-gray-500">
                                      No ratings yet
                                    </span>
                                  )}
                                </div>

                                {/* ✅ Completed Tenders */}
                                <span className="text-xs sm:text-sm text-gray-600">
                                  {tender.postedBy.profile.completedTenders > 0
                                    ? `${tender.postedBy.profile.completedTenders} projects completed`
                                    : "No projects completed yet"}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3 text-xs sm:text-sm text-gray-600">
                        {canviewtenderifno && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="truncate">
                              {tender.contactEmail}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 sm:p-5 border border-green-100">
                        <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                          <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                          <span className="text-xs sm:text-sm font-medium text-green-700">
                            {t("budget")}
                          </span>
                        </div>
                        <p className="text-lg sm:text-2xl font-bold text-green-700">
                          ${tender.estimatedBudget?.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-5 border border-blue-100">
                        <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                          <span className="text-xs sm:text-sm font-medium text-blue-700">
                            {t("deadline")}
                          </span>
                        </div>
                        <p className="text-base sm:text-lg font-semibold text-blue-700">
                          {formatDate(tender.deadline)}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-3 sm:p-5 border border-purple-100">
                        <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                          <span className="text-xs sm:text-sm font-medium text-purple-700">
                            {t("location")}
                          </span>
                        </div>
                        <p className="text-base sm:text-lg font-semibold text-purple-700">
                          {tender.location}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-3 sm:p-5 border border-yellow-100">
                        <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                          <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                          <span className="text-xs sm:text-sm font-medium text-yellow-700">
                            {t("bids_placed")}
                          </span>
                        </div>
                        <p className="text-base sm:text-lg font-semibold text-yellow-700">
                          {tender?.bidCount}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
                      <Badge
                        className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full font-medium text-xs sm:text-sm ${
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
                        className="px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-blue-50 text-blue-700 border-blue-200 text-xs sm:text-sm"
                      >
                        <Tag className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                        {tender.category?.name}
                      </Badge>
                    </div>
                    {tender.image && (
                      <div className="mb-6">
                        <img
                          src={tender.image}
                          alt={tender.title}
                          className="w-full h-48 sm:h-64 object-cover rounded-xl border border-gray-200/50"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                      Project Description
                    </h2>
                    <div className="prose prose-sm sm:prose-base max-w-none">
                      <p className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-wrap mb-4 sm:mb-6">
                        {tender.description}
                      </p>
                    </div>
                    {tender.category?.description && (
                      <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-6">
                        <h3 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">
                          Category Details
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base">
                          {tender.category.description}
                        </p>
                      </div>
                    )}
                    <QnaSection tenderid={tender._id} />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1 mt-6 lg:mt-0">
                <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-100/50 shadow-lg shadow-blue-500/5 lg:sticky lg:top-6">
                  <div className="p-5 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                      Your Bid on this Project
                    </h2>
                    <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
                      <div className="flex justify-between items-center text-xs sm:text-sm">
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
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-gray-600">Deadline:</span>
                        <span className="font-medium text-gray-900">
                          {formatDate(tender.deadline)}
                        </span>
                      </div>
                      {userBid && (
                        <>
                          <div className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="text-gray-600">Your Bid:</span>
                            <span className="font-bold text-green-600">
                              ${userBid.amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="text-gray-600">Bid Status:</span>
                            <Badge
                              className={`px-2 py-1 text-xs ${
                                userBid.status === "under_review"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : userBid.status === "accepted"
                                  ? "bg-green-100 text-green-700"
                                  : userBid.status === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {userBid.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="text-gray-600">
                              Payment Status:
                            </span>
                            <Badge
                              className={`px-2 py-1 text-xs ${
                                userBid.paymentStatus === "failed"
                                  ? "bg-red-100 text-red-700"
                                  : userBid.paymentStatus === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {userBid.paymentStatus}
                            </Badge>
                          </div>
                        </>
                      )}
                    </div>
                    {userBid ? (
                      <div className="space-y-2 sm:space-y-3">
                        {userBid.status === "under_review" &&
                          (userBid.paymentStatus === "failed" ||
                            userBid.paymentStatus === "pending") && (
                            <Button
                              onClick={handleRetryPayment}
                              className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg sm:rounded-xl py-2.5 sm:py-3 font-medium text-sm sm:text-base transition-all duration-300 shadow-lg shadow-red-500/25"
                              disabled={retryingPayment}
                            >
                              {retryingPayment ? (
                                <div className="flex items-center justify-center">
                                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
                                  Retrying Payment...
                                </div>
                              ) : (
                                <>
                                  Retry Payment
                                  <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                                </>
                              )}
                            </Button>
                          )}
                        <Button
                          onClick={() =>
                            router.push("/business-dashboard/bids")
                          }
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl py-2.5 sm:py-3 font-medium text-sm sm:text-base transition-all duration-300 shadow-lg shadow-blue-500/25"
                        >
                          View My Bids
                        </Button>
                      </div>
                    ) : tender.status === "active" &&
                      new Date(tender.deadline) > new Date() ? (
                      <div className="space-y-2 sm:space-y-3">
                        <Button
                          onClick={() => setShowApplyForm(true)}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl py-2.5 sm:py-3 font-medium text-sm sm:text-base transition-all duration-300 shadow-lg shadow-blue-500/25"
                        >
                          Submit Your Bid
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-4 sm:py-6 bg-gray-50/50 rounded-xl">
                        <p className="text-gray-500 text-xs sm:text-sm font-medium">
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

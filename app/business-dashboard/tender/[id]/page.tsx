"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Phone,
  ExternalLink,
  Loader2,
  Trophy,
  AlertCircle,
  RefreshCw,
  AlertTriangle,
  Play,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import useTranslation from "@/lib/hooks/useTranslation";
import { getTender } from "@/app/services/tenderService";
import { getTenderBids, returnBidForRevision } from "@/app/services/BidService";
import {
  getQuestionsForTender,
  answerQuestion,
  Question,
} from "@/app/services/QnaService";
import { awardTender, updateTenderStatus } from "@/app/services/tenderService";
import { getStatusColor, getStatusText } from "@/utils/tenderStatus";
import { useAuth } from "@/context/AuthContext";
import { detectContactInfo } from "@/utils/validationcehck";
import PageTransitionWrapper from "@/components/animations/PageTransitionWrapper";
import { toast } from "sonner";

interface Tender {
  _id: string;
  title: string;
  closeReason: string;
  description: string;
  estimatedBudget: number;
  deadline: string;
  status:
    | "draft"
    | "active"
    | "pending_approval"
    | "closed"
    | "awarded"
    | "completed"
    | "rejected";
  category: { _id: string; name?: string; description: string };
  location: string;
  contactEmail: string;
  image: string;
  postedBy: { _id: string; email: string; userType: "individual" | "business" };
  createdAt: string;
  updatedAt: string;
  v: number;
}

interface Bid {
  _id: string;
  amount: number;
  bidder: {
    _id: string;
    email: string;
    userType: string;
    image?: {
      url?: string | null;
      filename?: string;
      contentType?:
        | "image/jpeg"
        | "image/jpg"
        | "image/png"
        | "image/gif"
        | "image/webp";
      size?: number;
      uploadedAt?: Date;
    };
    isVerified: boolean;
    profile: {
      fullName?: string;
      companyName?: string;
      rating?: number;
      ratingCount?: number;
      completedTenders?: number;
      anonymousBidding?: boolean;
      onTimeDelivery?: number;
      phone?: string;
      address?: string;
    };
  };
  description: string;
  paymentAmount: number;
  paymentId: string;
  paymentStatus: "paid" | "pending";
  status:
    | "submitted"
    | "accepted"
    | "rejected"
    | "under_review"
    | "completed"
    | "returned_for_revision";
  createdAt: string;
  updatedAt: string;
  v: number;
  tender: string;
  revisionDetails?: {
    requestedAt: string;
    reason: string;
    requestedBy: {
      _id: string;
    };
  };
  image?: {
    url: string;
    filename: string;
    contentType: string;
    size: number;
    uploadedAt: string;
  } | null;
}

export default function TenderDetailPage() {
  const { profile, user } = useAuth();
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const tenderId = params.id as string;
  const [tender, setTender] = useState<Tender | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"bids" | "qa" | "reviews">("bids");
  const [answerText, setAnswerText] = useState<{ [key: string]: string }>({});
  const [answerErrors, setAnswerErrors] = useState<{ [key: string]: string }>(
    {}
  );
  const [submittingAnswer, setSubmittingAnswer] = useState<{
    [key: string]: boolean;
  }>({});
  const [updatingBidStatus, setUpdatingBidStatus] = useState<{
    [key: string]: boolean;
  }>({});
  const [returnForRevision, setReturnForRevision] = useState<{
    open: boolean;
    bidId: string | null;
  }>({ open: false, bidId: null });
  const [revisionReason, setRevisionReason] = useState("");
  const [returningBid, setReturningBid] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [activating, setActivating] = useState(false);
  const [imageModal, setImageModal] = useState<{
    open: boolean;
    imageUrl: string | null;
    type?: "bid" | "tender";
  }>({ open: false, imageUrl: null, type: undefined });

  const validateAnswer = (
    text: string
  ): { valid: boolean; message?: string } => {
    if (!text.trim()) {
      return { valid: false, message: t("answer_cannot_be_empty") };
    }
    const detections = detectContactInfo(text);
    const highSeverity = detections.filter((d) => d.severity === "high");
    if (highSeverity.length > 0) {
      const type = highSeverity[0].type;
      return {
        valid: false,
        message: t(`answer_contains_contact_information_${type}`),
      };
    }
    return { valid: true };
  };

  const fetchTenderData = async () => {
    try {
      setLoading(true);
      setError(null);
      const tenderData = await getTender(tenderId);
      const bidsData = await getTenderBids(tenderId);
      const questionsData = await getQuestionsForTender(tenderId);
      setTender(tenderData);
      console.log(bidsData);
      setBids(bidsData);
      setQuestions(questionsData as unknown as Question[]);
    } catch (err: any) {
      console.error("Error fetching tender data:", err);
      setError(err.response?.data?.message || "Failed to load tender data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenderId) fetchTenderData();
  }, [tenderId]);

  const handleBidStatusUpdate = async (
    bidId: string,
    status: "accepted" | "rejected"
  ) => {
    if (status === "accepted") {
      try {
        setUpdatingBidStatus((prev) => ({ ...prev, [bidId]: true }));
        await awardTender(tenderId, bidId);
        setBids((prevBids) =>
          prevBids.map((bid) =>
            bid._id === bidId
              ? { ...bid, status: "accepted" }
              : { ...bid, status: "rejected" }
          )
        );
        setTender((prev) => (prev ? { ...prev, status: "awarded" } : null));
        toast.success("Tender awarded successfully!");
      } catch (err: any) {
        console.error("Error awarding tender:", err);
        const errorMessage =
          err.response?.data?.message ||
          "Failed to award tender. Please try again.";
        setError(errorMessage);
      } finally {
        setUpdatingBidStatus((prev) => ({ ...prev, [bidId]: false }));
      }
    } else {
      setReturnForRevision({ open: true, bidId });
    }
  };

  const handleReturnBidForRevision = async () => {
    if (!returnForRevision.bidId || !revisionReason.trim()) {
      alert("Please provide a reason for revision");
      return;
    }
    setReturningBid(true);
    try {
      const result = await returnBidForRevision(
        returnForRevision.bidId,
        revisionReason
      );
      if (result.success) {
        setBids((prevBids) =>
          prevBids.map((bid) =>
            bid._id === returnForRevision.bidId
              ? {
                  ...bid,
                  status: "returned_for_revision",
                  revisionDetails: {
                    requestedAt: new Date().toISOString(),
                    reason: revisionReason,
                    requestedBy: { _id: profile?._id || "" },
                  },
                }
              : bid
          )
        );
        setReturnForRevision({ open: false, bidId: null });
        setRevisionReason("");
        toast("Bid returned for revision successfully!");
      } else {
        throw new Error(result.error || "Failed to return bid for revision");
      }
    } catch (err: any) {
      console.error("Error returning bid for revision:", err);
      toast.error(err.message || "Failed to return bid for revision");
    } finally {
      setReturningBid(false);
    }
  };

  const handleAnswerQuestion = async (questionId: string) => {
    const answer = answerText[questionId];
    const validation = validateAnswer(answer);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }
    try {
      setSubmittingAnswer((prev) => ({ ...prev, [questionId]: true }));
      await answerQuestion(questionId, answer);
      fetchTenderData();
      setAnswerText((prev) => ({ ...prev, [questionId]: "" }));
      setAnswerErrors((prev) => ({ ...prev, [questionId]: "" }));
    } catch (err: any) {
      console.error("Error answering question:", err);
      setError(err.response?.data?.message || "Failed to submit answer");
    } finally {
      setSubmittingAnswer((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const handleMakeActive = async () => {
    if (!tenderId) return;
    setActivating(true);
    try {
      const updatedTender = await updateTenderStatus(tenderId, "active");
      setTender(updatedTender);
      toast.success(
        t("tender_published_successfully") || "Tender published successfully!"
      );
      setShowActivateModal(false);
    } catch (err: any) {
      console.error("Error activating tender:", err);
      toast.error(
        err.response?.data?.message ||
          t("failed_to_publish_tender") ||
          "Failed to publish tender"
      );
    } finally {
      setActivating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-QA", {
      style: "currency",
      currency: "QAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isTenderOwner = user?._id === tender?.postedBy?._id;
  const deadline = tender?.deadline ? new Date(tender.deadline) : null;
  const isDeadlinePassed = deadline ? deadline < new Date() : false;
  const canBeMadeActive = tender?.status === "draft" && !isDeadlinePassed;
  const awardedBid = bids.find((bid) => bid.status === "accepted");
  const hasAwardedBid = !!awardedBid;
  const isPendingApproval = tender?.status === "pending_approval";
  const isAwarded = tender?.status === "awarded";
  const isCompleted = tender?.status === "completed";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4 p-4">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium text-center">
            Loading tender details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="bg-white rounded-md shadow-none border border-gray-100 p-6 sm:p-8 text-center max-w-md w-full">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-medium transition-all text-sm sm:text-base"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="bg-white rounded-md shadow-none border border-gray-100 p-6 sm:p-8 text-center max-w-md w-full">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Tender Not Found
            </h3>
            <p className="text-gray-600 leading-relaxed">
              The requested tender does not exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (!isTenderOwner) {
    // Optional: Log attempt for security
    console.log(
      "Unauthorized access attempt to tender:",
      tender.postedBy._id,
      "by user:",
      user?._id
    );

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="bg-white rounded-md shadow-none border border-gray-100 p-6 sm:p-8 text-center max-w-md w-full">
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <LockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Access Restricted
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              You do not have permission to view this tender. Only the tender
              owner can access this page.
            </p>
            <Button
              onClick={() => router.push("/tenders")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-medium transition-all text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tenders
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <PageTransitionWrapper>
      <div className="min-h-screen">
        <div className="bg-white border-b border-gray-200">
          <div className="mx-auto px-4 sm:px-6 lg:px-14">
            <div className="flex items-center justify-between h-16">
              <div
                onClick={() => router.back()}
                className="flex items-center text-blue-500 hover:text-blue-600 font-medium transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                Tenders
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto px-4 sm:px-6 lg:px-14 py-6 sm:py-8">
          {isPendingApproval && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-md p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <div className="flex-shrink-0 mb-3 sm:mb-0">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
                <div className="ml-0 sm:ml-4">
                  <h3 className="text-amber-900 font-semibold text-sm sm:text-base">
                    Under Review
                  </h3>
                  <p className="text-amber-800 mt-1 leading-relaxed text-xs sm:text-sm">
                    This tender is currently being reviewed. Bids and Q&A will
                    be available once approved.
                  </p>
                </div>
              </div>
            </div>
          )}
          {tender.closeReason && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-900">
                    {t("tender_closed_reason")}
                  </p>
                  <p className="mt-1 text-sm text-red-700 whitespace-pre-wrap">
                    {tender.closeReason}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="bg-white rounded-md shadow-none border border-gray-100 p-6 sm:p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                      {tender.title}
                    </h1>
                    <Badge
                      className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium border ${
                        tender.status === "active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : tender.status === "awarded"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : tender.status === "completed"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : tender.status === "closed"
                          ? "bg-gray-50 text-gray-700 border-gray-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      {tender.status.charAt(0).toUpperCase() +
                        tender.status.slice(1)}
                    </Badge>
                  </div>
                  {tender.image && (
                    <Button
                      onClick={() =>
                        setImageModal({
                          open: true,
                          imageUrl: tender.image,
                          type: "tender",
                        })
                      }
                      className="bg-white text-blue-500 shadow-none border border-blue-500 rounded-md px-3 py-1.5 sm:px-4 sm:py-2 h-auto text-xs sm:text-sm font-medium flex items-center"
                    >
                      <ImageIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                      View Tender Image
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                      <Calendar className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Posted</p>
                      <p className="font-medium text-sm sm:text-base">
                        {formatDate(tender.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center mr-3">
                      <MapPin className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Location
                      </p>
                      <p className="font-medium text-sm sm:text-base">
                        {tender.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center mr-3">
                      <DollarSign className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Budget</p>
                      <p className="font-semibold text-emerald-600 text-sm sm:text-base">
                        {Number(tender.estimatedBudget) === 0
                          ? "Negotiable"
                          : formatCurrency(tender.estimatedBudget)}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-6 text-base sm:text-lg whitespace-pre-wrap break-words">
                  {tender.description}
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Trophy className="h-4 w-4 mr-2 text-purple-500" />
                    <span className="text-gray-500 mr-1">Category:</span>
                    <span className="font-medium text-gray-900">
                      {tender?.category?.name}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center text-gray-600 break-all">
                    <User className="h-4 w-4 mr-2 text-gray-400 shrink-0" />
                    <span className="text-gray-500 mr-1">Contact:</span>
                    <span className="font-medium text-gray-900 break-all">
                      {tender.contactEmail}
                    </span>
                  </div>
                </div>
              </div>

              {isAwarded && (
                <div className="mt-6 lg:mt-0 lg:ml-8">
                  <Button
                    onClick={() =>
                      router.push(
                        profile?.userType === "business"
                          ? `/business-dashboard/projects`
                          : "/dashboard/projects"
                      )
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 sm:px-6 sm:py-3 h-auto font-medium flex items-center text-sm sm:text-base"
                  >
                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                    Chat with Bidder
                  </Button>
                </div>
              )}
            </div>
          </div>

          {!isPendingApproval ? (
            <>
              <div className="bg-white rounded-md shadow-none border border-gray-100 mb-6">
                <div className="flex flex-wrap border-b border-gray-100">
                  <button
                    onClick={() => setActiveTab("bids")}
                    className={`flex-1 py-3 px-4 sm:py-4 sm:px-6 font-semibold text-center transition-all relative text-sm sm:text-base ${
                      activeTab === "bids"
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Bids ({bids.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("qa")}
                    className={`flex-1 py-3 px-4 sm:py-4 sm:px-6 font-semibold text-center transition-all relative text-sm sm:text-base ${
                      activeTab === "qa"
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Questions & Answers ({questions.length})
                  </button>
                  {hasAwardedBid && (
                    <button
                      onClick={() => setActiveTab("reviews")}
                      className={`flex-1 py-3 px-4 sm:py-4 sm:px-6 font-semibold text-center transition-all relative text-sm sm:text-base ${
                        activeTab === "reviews"
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Reviews
                    </button>
                  )}
                </div>
              </div>

              {activeTab === "bids" && (
                <div className="grid grid-cols-1 gap-6 mb-10">
                  {hasAwardedBid && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                        <p className="text-green-800 font-medium text-sm sm:text-base">
                          Tender awarded to{" "}
                          <span className="font-semibold">
                            {awardedBid.bidder.profile?.fullName ||
                              awardedBid.bidder.profile?.companyName ||
                              awardedBid.bidder.email.split("@")[0]}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  {bids.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {bids.map((bid) => (
                        <div
                          key={bid._id}
                          className="bg-white rounded-md shadow-none border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                                    {bid.bidder.profile?.anonymousBidding &&
                                    bid.status !== "accepted" &&
                                    bid.status !== "completed" ? (
                                      <>Anonymous</>
                                    ) : (
                                      <>
                                        {bid.bidder.profile?.fullName ||
                                          bid.bidder.profile?.companyName ||
                                          bid.bidder.email.split("@")[0]}
                                      </>
                                    )}
                                  </h3>
                                  {bid.bidder.isVerified && (
                                    <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                      <Shield className="h-3 w-3 mr-1" />
                                      Verified
                                    </div>
                                  )}
                                  {bid.status === "accepted" && (
                                    <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Awarded
                                    </div>
                                  )}
                                  {bid.status === "returned_for_revision" && (
                                    <div className="flex items-center bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                                      <RefreshCw className="h-3 w-3 mr-1" />
                                      Needs Revision
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-wrap items-center gap-4 mb-2 lg:mb-4">
                                  {(!bid.bidder.profile?.anonymousBidding ||
                                    bid.status === "accepted") &&
                                    bid.bidder.profile?.phone && (
                                      <div className="flex items-center text-sm text-gray-500">
                                        <Phone className="h-4 w-4 mr-2" />
                                        {bid.bidder.profile.phone}
                                      </div>
                                    )}
                                  {(!bid.bidder.profile?.anonymousBidding ||
                                    bid.status === "accepted") &&
                                    bid.bidder.profile?.address && (
                                      <div className="flex items-center text-sm text-gray-500">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        {bid.bidder.profile.address}
                                      </div>
                                    )}
                                </div>
                              </div>

                              <div className="text-center sm:text-left sm:ml-4 flex-shrink-0">
                                <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                                  {formatCurrency(bid.amount)}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500">
                                  {formatDate(bid.createdAt)}
                                </div>
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded-md p-3 sm:p-4 mb-4">
                              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                                {bid.description}
                              </p>
                            </div>

                            {bid.image?.url && (
                              <div className="mt-4">
                                <Button
                                  onClick={() =>
                                    setImageModal({
                                      open: true,
                                      imageUrl: bid.image?.url || null,
                                      type: "bid",
                                    })
                                  }
                                  className="bg-white text-blue-500 shadow-none border border-blue-500 rounded-md px-3 py-1.5 sm:px-4 sm:py-2 h-auto text-xs sm:text-sm font-medium flex items-center"
                                >
                                  <ImageIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                                  View Bid Image
                                </Button>
                              </div>
                            )}

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-100 gap-3">
                              <div>
                                {(!bid.bidder.profile?.anonymousBidding ||
                                  bid.status === "accepted" ||
                                  bid.status === "completed") && (
                                  <Link
                                    href={
                                      profile?.userType !== "business"
                                        ? `/dashboard/my-tenders/bidder-profile/${bid.bidder._id}`
                                        : `/business-dashboard/my-tenders/bidder-profile/${bid.bidder._id}`
                                    }
                                    className="flex items-center text-blue-500 hover:text-blue-600 font-medium text-xs sm:text-sm transition-colors"
                                  >
                                    View Profile
                                    <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1" />
                                  </Link>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {bid.status === "submitted" &&
                                  tender.status !== "rejected" &&
                                  !hasAwardedBid && (
                                    <div className="flex flex-wrap gap-2">
                                      <Button
                                        onClick={() =>
                                          handleBidStatusUpdate(
                                            bid._id,
                                            "accepted"
                                          )
                                        }
                                        disabled={updatingBidStatus[bid._id]}
                                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-3 py-2.5 sm:px-4 sm:py-2 h-auto text-xs sm:text-sm font-medium"
                                      >
                                        {updatingBidStatus[bid._id] ? (
                                          <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin mr-1.5 sm:mr-2" />
                                        ) : (
                                          <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                                        )}
                                        Accept Bid
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          handleBidStatusUpdate(
                                            bid._id,
                                            "rejected"
                                          )
                                        }
                                        className="bg-gray-50 text-gray-700 rounded-full px-3 py-2.5 sm:px-4 sm:py-2 h-auto text-xs sm:text-sm font-medium"
                                      >
                                        <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                                        Return for Revision
                                      </Button>
                                    </div>
                                  )}
                                {bid.status === "returned_for_revision" && (
                                  <span className="text-xs sm:text-sm text-gray-500 italic">
                                    Bid returned for revision
                                  </span>
                                )}
                                {hasAwardedBid && bid.status !== "accepted" && (
                                  <span className="text-xs sm:text-sm text-gray-500 italic">
                                    Another bid was accepted
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-md shadow-none border border-gray-100 p-8 sm:p-12 text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building2 className="h-7 w-7 sm:h-8 sm:w-8 text-gray-300" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        No Bids Received
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        No providers have submitted bids for this tender yet.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "qa" && (
                <div className="space-y-6">
                  {questions.length > 0 ? (
                    questions.map((question) => (
                      <div
                        key={question._id}
                        className="bg-white rounded-md shadow-none border border-gray-100 overflow-hidden"
                      >
                        <div className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start mb-6 gap-4">
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                              <MessageSquare className="h-5 w-5 text-blue-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                                  Anonymous
                                </span>
                                <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                  {formatDate(question.createdAt)}
                                </span>
                              </div>
                              <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                                {question.question}
                              </p>
                            </div>
                          </div>

                          {question.answer ? (
                            <div className="ml-0 sm:ml-14 bg-green-50 rounded-md p-3 sm:p-4 border-l-4 border-green-400">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="font-semibold text-green-800 text-sm sm:text-base">
                                  Your Response
                                </span>
                                <span className="text-xs sm:text-sm text-green-600">
                                  {formatDate(question.updatedAt)}
                                </span>
                              </div>
                              <p className="text-green-900 leading-relaxed text-sm sm:text-base">
                                {question.answer}
                              </p>
                            </div>
                          ) : (
                            <div className="ml-0 sm:ml-14">
                              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {t(
                                  "note_do_not_include_contact_information_in_your_answer"
                                )}
                              </p>
                              <Textarea
                                placeholder="Write your response..."
                                value={answerText[question._id] || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setAnswerText((prev) => ({
                                    ...prev,
                                    [question._id]: value,
                                  }));
                                  const validation = validateAnswer(value);
                                  setAnswerErrors((prev) => ({
                                    ...prev,
                                    [question._id]: validation.valid
                                      ? ""
                                      : validation.message ?? "",
                                  }));
                                }}
                                className={`rounded-md border-gray-200 focus:border-blue-500 focus:ring-blue-500 mb-2 min-h-[100px] resize-none text-sm ${
                                  answerErrors[question._id]
                                    ? "border-red-300 focus:border-red-500"
                                    : ""
                                }`}
                              />
                              {answerErrors[question._id] && (
                                <p className="text-red-500 text-xs mb-4 flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  {answerErrors[question._id]}
                                </p>
                              )}
                              <Button
                                onClick={() =>
                                  handleAnswerQuestion(question._id)
                                }
                                disabled={
                                  !answerText[question._id]?.trim() ||
                                  submittingAnswer[question._id] ||
                                  !!answerErrors[question._id]
                                }
                                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 h-auto font-medium text-sm"
                              >
                                {submittingAnswer[question._id] ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                                ) : (
                                  <Send className="h-3.5 w-3.5 mr-1.5" />
                                )}
                                Send Response
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-md shadow-none border border-gray-100 p-8 sm:p-12 text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="h-7 w-7 sm:h-8 sm:w-8 text-gray-300" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        No Questions Yet
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        No questions have been asked about this tender.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "reviews" && hasAwardedBid && (
                <div className="bg-white rounded-md shadow-none border border-gray-100 p-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
                    Reviews
                  </h2>
                  {isCompleted ? (
                    <div className="space-y-6">
                      <div className="border border-gray-200 rounded-md p-4 sm:p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">
                          Your Review
                        </h3>
                        <div className="flex items-center mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 fill-current"
                            />
                          ))}
                        </div>
                        <p className="text-gray-700 text-sm sm:text-base">
                          Great work! The project was completed on time and
                          exceeded expectations.
                        </p>
                      </div>
                      <div className="border border-gray-200 rounded-md p-4 sm:p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">
                          Bidder's Review
                        </h3>
                        <div className="flex items-center mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 fill-current"
                            />
                          ))}
                        </div>
                        <p className="text-gray-700 text-sm sm:text-base">
                          Professional client, clear requirements, and prompt
                          payments.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="h-7 w-7 sm:h-8 sm:w-8 text-blue-500" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        Reviews Not Available Yet
                      </h3>
                      <p className="text-gray-600 mb-6 text-sm sm:text-base">
                        Reviews will be available once the project is completed.
                      </p>
                      {isAwarded && (
                        <Button
                          onClick={() => router.push(`/dashboard/project`)}
                          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 h-auto font-medium text-sm sm:text-base"
                        >
                          <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                          Chat with Bidder
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-md shadow-none border border-gray-100 p-8 sm:p-12 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <LockIcon className="h-7 w-7 sm:h-8 sm:w-8 text-amber-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Content Under Review
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed max-w-md mx-auto text-sm sm:text-base">
                Bids and questions are hidden while this tender undergoes our
                approval process.
              </p>
              <div className="inline-flex items-center bg-amber-50 text-amber-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                Pending Approval
              </div>
            </div>
          )}
        </div>

        {returnForRevision.open && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-100/50 w-full max-w-md">
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Return Bid for Revision
                  </h2>
                  <button
                    onClick={() =>
                      setReturnForRevision({ open: false, bidId: null })
                    }
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  </button>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    Please provide a reason for returning this bid for revision.
                  </p>
                  <Textarea
                    placeholder="Enter your revision request..."
                    value={revisionReason}
                    onChange={(e) => setRevisionReason(e.target.value)}
                    className="min-h-[120px] sm:min-h-[150px] bg-white/80 backdrop-blur-sm border border-gray-200/50 text-sm"
                    autoFocus
                  />
                  <div className="flex items-start gap-2 text-xs text-gray-500 mt-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>
                      The bidder will be able to edit and resubmit their bid
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-end gap-2 sm:gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setReturnForRevision({ open: false, bidId: null })
                    }
                    className="bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-gray-50/80 transition-colors text-xs sm:text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleReturnBidForRevision}
                    disabled={returningBid || !revisionReason.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm"
                  >
                    {returningBid ? (
                      <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                    )}
                    Return for Revision
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {imageModal.open && imageModal.imageUrl && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-100/50 w-full max-w-3xl">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    {imageModal.type === "tender"
                      ? "Tender Image"
                      : "Bid Image"}
                  </h2>
                  <button
                    onClick={() =>
                      setImageModal({
                        open: false,
                        imageUrl: null,
                        type: undefined,
                      })
                    }
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  </button>
                </div>
                <div className="flex justify-center">
                  <img
                    src={imageModal.imageUrl}
                    alt={
                      imageModal.type === "tender"
                        ? tender.title
                        : "Bid supporting image"
                    }
                    className="rounded-md max-h-[70vh] w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransitionWrapper>
  );
}

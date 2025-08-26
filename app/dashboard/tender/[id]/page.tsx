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
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import useTranslation from "@/lib/hooks/useTranslation";

// Services
import { getTender } from "@/app/services/tenderService";
import { getTenderBids } from "@/app/services/BidService";
import {
  getQuestionsForTender,
  answerQuestion,
  Question,
} from "@/app/services/QnaService";
import { awardTender } from "@/app/services/tenderService";

// Utils
import { getStatusColor, getStatusText } from "@/utils/tenderStatus";
import { useAuth } from "@/context/AuthContext";
import { detectContactInfo } from "@/utils/validationcehck"; // Reuse same validation

// Interfaces
interface Tender {
  _id: string;
  title: string;
  description: string;
  estimatedBudget: number;
  deadline: string;
  status:
    | "active"
    | "pending_approval"
    | "closed"
    | "draft"
    | "awarded"
    | "completed";
  category: { _id: string; name: string; description: string };
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
    isVerified: boolean;
    profile: {
      fullName?: string;
      companyName?: string;
      rating?: number;
      ratingCount?: number;
      completedTenders?: number;
      onTimeDelivery?: number;
      phone?: string;
      address?: string;
    };
  };
  description: string;
  paymentAmount: number;
  paymentId: string;
  paymentStatus: "paid" | "pending";
  status: "submitted" | "accepted" | "rejected" | "under_review" | "completed";
  createdAt: string;
  updatedAt: string;
  v: number;
  tender: string;
}

export default function TenderDetailPage() {
  const { profile } = useAuth();
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

  // Validation function for answer content
  const validateAnswer = (
    text: string
  ): { valid: boolean; message?: string } => {
    if (!text.trim()) {
      return { valid: false, message: t("answer_cannot_be_empty") };
    }

    const detections = detectContactInfo(text);
    const highSeverity = detections.filter((d) => d.severity === "high");

    if (highSeverity.length > 0) {
      const type = highSeverity[0].type; // 'email', 'phone', 'url'
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
    if (status !== "accepted") return;

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

      alert("Tender awarded successfully!");
    } catch (err: any) {
      console.error("Error awarding tender:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to award tender. Please try again.";
      setError(errorMessage);
    } finally {
      setUpdatingBidStatus((prev) => ({ ...prev, [bidId]: false }));
    }
  };

  const handleAnswerQuestion = async (questionId: string) => {
    const answer = answerText[questionId];
    const validation = validateAnswer(answer);

    if (!validation.valid) {
      alert(validation.message); // You can replace with toast later
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading tender details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="bg-white rounded-md shadow-0 border border-gray-100 p-8 text-center max-w-md w-full">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium transition-all"
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
          <div className="bg-white rounded-md shadow-0 border border-gray-100 p-8 text-center max-w-md w-full">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
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

  const awardedBid = bids.find((bid) => bid.status === "accepted");
  const hasAwardedBid = !!awardedBid;
  const isPendingApproval = tender.status === "pending_approval";
  const isAwarded = tender.status === "awarded";
  const isCompleted = tender.status === "completed";

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-14">
          <div className="flex items-center justify-between h-16">
            <Link
              href={
                profile?.userType !== "business"
                  ? "/dashboard/my-tenders"
                  : "/business-dashboard/my-tenders"
              }
              className="flex items-center text-blue-500 hover:text-blue-600 font-medium transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Tenders
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-14 py-8">
        {/* Pending Approval Alert */}
        {isPendingApproval && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-md p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-amber-900 font-semibold">Under Review</h3>
                <p className="text-amber-800 mt-1 leading-relaxed">
                  This tender is currently being reviewed. Bids and Q&A will be
                  available once approved.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hero Card */}
        <div className="bg-white rounded-md shadow-0 border border-gray-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                  {tender.title}
                </h1>
                <Badge
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                    <Calendar className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Posted</p>
                    <p className="font-medium">
                      {formatDate(tender.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center mr-3">
                    <MapPin className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{tender.location}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center mr-3">
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Budget</p>
                    <p className="font-semibold text-emerald-600">
                      {formatCurrency(tender.estimatedBudget)}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                {tender.description}
              </p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center text-gray-600">
                  <Trophy className="h-4 w-4 mr-2 text-purple-500" />
                  <span className="text-gray-500 mr-1">Category:</span>
                  <span className="font-medium text-gray-900">
                    {tender.category.name}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-500 mr-1">Contact:</span>
                  <span className="font-medium text-gray-900">
                    {tender.contactEmail}
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Button - Only show when awarded */}
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
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-3 h-auto font-medium flex items-center"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Chat with Bidder
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Content Tabs */}
        {!isPendingApproval ? (
          <>
            {/* Tab Navigation */}
            <div className="bg-white rounded-md shadow-0 border border-gray-100 mb-6">
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActiveTab("bids")}
                  className={`flex-1 py-4 px-6 font-semibold text-center transition-all relative ${
                    activeTab === "bids"
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Bids ({bids.length})
                </button>
                <button
                  onClick={() => setActiveTab("qa")}
                  className={`flex-1 py-4 px-6 font-semibold text-center transition-all relative ${
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
                    className={`flex-1 py-4 px-6 font-semibold text-center transition-all relative ${
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

            {/* Bids Content */}
            {activeTab === "bids" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                {/* Awarded Bid Banner */}
                {hasAwardedBid && (
                  <div className="col-span-2 bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <p className="text-green-800 font-medium">
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
                  bids.map((bid) => (
                    <div
                      key={bid._id}
                      className="bg-white rounded-md shadow-0 border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-6">
                              <h3 className="font-semibold text-gray-900 text-lg">
                                {bid.bidder.profile?.fullName ||
                                  bid.bidder.profile?.companyName ||
                                  bid.bidder.email.split("@")[0]}
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
                            </div>

                            <div className="flex items-center justify-start gap-6">
                              {bid.bidder.profile?.phone && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <Phone className="h-4 w-4 mr-2" />
                                  {bid.bidder.profile.phone}
                                </div>
                              )}
                              {bid.bidder.profile?.address && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  {bid.bidder.profile.address}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                              {formatCurrency(bid.amount)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(bid.createdAt)}
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-md p-4 mb-4">
                          <p className="text-gray-700 leading-relaxed">
                            {bid.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <Link
                            href={
                              profile?.userType !== "business"
                                ? `/dashboard/my-tenders/bidder-profile/${bid.bidder._id}`
                                : `/business-dashboard/my-tenders/bidder-profile/${bid.bidder._id}`
                            }
                            className="flex items-center text-blue-500 hover:text-blue-600 font-medium text-sm transition-colors"
                          >
                            View Profile
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </Link>

                          <div className="flex gap-2">
                            {bid.status === "submitted" && !hasAwardedBid && (
                              <Button
                                onClick={() =>
                                  handleBidStatusUpdate(bid._id, "accepted")
                                }
                                disabled={updatingBidStatus[bid._id]}
                                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 h-auto text-sm font-medium"
                              >
                                {updatingBidStatus[bid._id] ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <Award className="h-4 w-4 mr-2" />
                                )}
                                Accept Bid
                              </Button>
                            )}
                            {hasAwardedBid && bid.status !== "accepted" && (
                              <span className="text-sm text-gray-500 italic">
                                Another bid was accepted
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 bg-white rounded-md shadow-0 border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building2 className="h-8 w-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Bids Received
                    </h3>
                    <p className="text-gray-600">
                      No providers have submitted bids for this tender yet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Q&A Content */}
            {activeTab === "qa" && (
              <div className="space-y-6">
                {questions.length > 0 ? (
                  questions.map((question) => (
                    <div
                      key={question._id}
                      className="bg-white rounded-md shadow-0 border border-gray-100 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start mb-6">
                          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                            <MessageSquare className="h-5 w-5 text-blue-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-semibold text-gray-900">
                                Anonymous
                              </span>
                              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {formatDate(question.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-lg">
                              {question.question}
                            </p>
                          </div>
                        </div>

                        {question.answer ? (
                          <div className="ml-14 bg-green-50 rounded-md p-4 border-l-4 border-green-400">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-green-800">
                                Your Response
                              </span>
                              <span className="text-sm text-green-600">
                                {formatDate(question.updatedAt)}
                              </span>
                            </div>
                            <p className="text-green-900 leading-relaxed">
                              {question.answer}
                            </p>
                          </div>
                        ) : (
                          <div className="ml-14">
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
                              className={`rounded-md border-gray-200 focus:border-blue-500 focus:ring-blue-500 mb-2 min-h-[100px] resize-none ${
                                answerErrors[question._id]
                                  ? "border-red-300 focus:border-red-500"
                                  : ""
                              }`}
                            />
                            {answerErrors[question._id] && (
                              <p className="text-red-500 text-sm mb-4 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {answerErrors[question._id]}
                              </p>
                            )}
                            <Button
                              onClick={() => handleAnswerQuestion(question._id)}
                              disabled={
                                !answerText[question._id]?.trim() ||
                                submittingAnswer[question._id] ||
                                !!answerErrors[question._id]
                              }
                              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 h-auto font-medium"
                            >
                              {submittingAnswer[question._id] ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <Send className="h-4 w-4 mr-2" />
                              )}
                              Send Response
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-md shadow-0 border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="h-8 w-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Questions Yet
                    </h3>
                    <p className="text-gray-600">
                      No questions have been asked about this tender.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && hasAwardedBid && (
              <div className="bg-white rounded-md shadow-0 border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Reviews
                </h2>

                {isCompleted ? (
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-md p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Your Review
                      </h3>
                      <div className="flex items-center mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-6 w-6 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                      <p className="text-gray-700">
                        Great work! The project was completed on time and
                        exceeded expectations.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-md p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Bidder's Review
                      </h3>
                      <div className="flex items-center mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-6 w-6 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                      <p className="text-gray-700">
                        Professional client, clear requirements, and prompt
                        payments.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Reviews Not Available Yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Reviews will be available once the project is completed.
                    </p>
                    {isAwarded && (
                      <Button
                        onClick={() =>
                          router.push(`/chat/${awardedBid.bidder._id}`)
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 h-auto font-medium"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat with Bidder
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-md shadow-0 border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <LockIcon className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Content Under Review
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed max-w-md mx-auto">
              Bids and questions are hidden while this tender undergoes our
              approval process.
            </p>
            <div className="inline-flex items-center bg-amber-50 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">
              <Clock className="h-4 w-4 mr-2" />
              Pending Approval
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

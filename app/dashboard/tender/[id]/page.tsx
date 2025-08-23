"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Briefcase,
  Trophy,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProviderBadge } from "@/components/provider-badge";
import useTranslation from "@/lib/hooks/useTranslation";
import { getTender } from "@/app/services/tenderService";
import { getTenderBids, updateBid } from "@/app/services/BidService";
import {
  getQuestionsForTender,
  answerQuestion,
  Question,
} from "@/app/services/QnaService";
import { getStatusColor, getStatusText } from "@/utils/tenderStatus";
import { set } from "react-hook-form";

interface Tender {
  _id: string;
  title: string;
  description: string;
  estimatedBudget: number;
  deadline: string;
  status: "active" | "pending_approval" | "closed" | "draft";
  category: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  requirements?: string[];
  skills?: string[];
  attachments?: Array<{
    name: string;
    size: string;
    url?: string;
  }>;
}

interface Bid {
  _id: string;
  tender: string;
  bidder: {
    _id: string;
    name: string;
    email: string;
    rating?: number;
    completedProjects?: number;
    onTimeDelivery?: number;
    verified?: boolean;
  };
  amount: number;
  description: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export default function TenderDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const tenderId = params.id as string;

  // State management
  const [tender, setTender] = useState<Tender | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("bids");
  const [answerText, setAnswerText] = useState<{ [key: string]: string }>({});
  const [submittingAnswer, setSubmittingAnswer] = useState<{
    [key: string]: boolean;
  }>({});
  const [updatingBidStatus, setUpdatingBidStatus] = useState<{
    [key: string]: boolean;
  }>({});
  const fetchTenderData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch tender details
      const tenderData = await getTender(tenderId);
      setTender(tenderData);
      console.log("Fetched tender data:", tenderData);
      const bidsdata = await getTenderBids(tenderId);
      const questionsData = await getQuestionsForTender(tenderId);
      console.log("Bids data:", bidsdata, tenderId);
      setBids(bidsdata);
      setQuestions(questionsData);
    } catch (err: any) {
      console.error("Error fetching tender data:", err);
      setError(err.response?.data?.message || "Failed to load tender data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch tender data
  useEffect(() => {
    if (tenderId) {
      fetchTenderData();
    }
  }, [tenderId]);

  // Handle bid status updates (award/reject)
  const handleBidStatusUpdate = async (
    bidId: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      setUpdatingBidStatus((prev) => ({ ...prev, [bidId]: true }));
      // Update bid status via API
      await updateBid(bidId, { status } as any);

      // Update local state
      setBids((prevBids) =>
        prevBids.map((bid) => {
          if (bid._id === bidId) {
            return { ...bid, status };
          }
          // If awarding this bid, reset other awarded bids to pending
          if (status === "accepted" && bid.status === "accepted") {
            return { ...bid, status: "pending" };
          }
          return bid;
        })
      );
    } catch (err: any) {
      console.error("Error updating bid status:", err);
      setError(err.response?.data?.message || "Failed to update bid status");
    } finally {
      setUpdatingBidStatus((prev) => ({ ...prev, [bidId]: false }));
    }
  };

  // Handle question answers
  const handleAnswerQuestion = async (questionId: string) => {
    const answer = answerText[questionId];
    if (!answer.trim()) return;

    try {
      setSubmittingAnswer((prev) => ({ ...prev, [questionId]: true }));

      const updatedQuestion = await answerQuestion(questionId, answer);

      // Update local state
      fetchTenderData();

      // Clear answer text
      setAnswerText((prev) => ({ ...prev, [questionId]: "" }));
    } catch (err: any) {
      console.error("Error answering question:", err);
      setError(err.response?.data?.message || "Failed to submit answer");
    } finally {
      setSubmittingAnswer((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  // Utility functions

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

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading tender details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Tender
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No tender found
  if (!tender) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tender Not Found
            </h3>
            <p className="text-gray-600">
              The tender you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const awardedBid = bids.find((bid) => bid.status === "accepted");
  const hasAwardedBid = !!awardedBid;
  const isPendingApproval = tender.status === "pending_approval";

  return (
    <div className="container mx-auto px-0 py-8">
      <div className="">
        {/* Pending Approval Notice */}
        {isPendingApproval && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  {t("tender_pending_approval")}
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  {t(
                    "this_tender_is_currently_under_admin_review_bids_and_qa_will_be_available_once_the_tender_is_active"
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tender Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {tender.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Posted: {formatDate(tender.createdAt)}
                </span>
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {tender.location}
                </span>
                <span className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {formatCurrency(tender.estimatedBudget)}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Deadline: {formatDate(tender.deadline)}
                </span>
              </div>
            </div>
            <Badge className={`border ${getStatusColor(tender.status)}`}>
              {getStatusText(tender.status)}
            </Badge>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            {tender.description}
          </p>

          {/* Skills and Requirements */}
          {tender.skills && tender.skills.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Required Skills:
              </h4>
              <div className="flex flex-wrap gap-2">
                {tender.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {tender.requirements && tender.requirements.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Requirements:
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {tender.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
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
                  {t("bids")} ({bids.length})
                </button>
                <button
                  onClick={() => setActiveTab("qa")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "qa"
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t("q_and_a")} ({questions.length})
                </button>
              </nav>
            </div>

            {/* Bids Tab */}
            {activeTab === "bids" && (
              <div className="space-y-6">
                {bids.length > 0 ? (
                  bids.map((bid) => (
                    <Card key={bid._id} className="border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-600" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-gray-900">
                                  {bid.bidder.name}
                                </h3>
                                {bid.bidder.verified && (
                                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                    <Shield className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                                {bid.status === "accepted" && (
                                  <Badge className="bg-green-600 text-white border-green-600">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Awarded
                                  </Badge>
                                )}
                                {bid.status === "rejected" && (
                                  <Badge className="bg-red-600 text-white border-red-600">
                                    <X className="h-3 w-3 mr-1" />
                                    Rejected
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                {bid.bidder.rating && (
                                  <span className="flex items-center">
                                    <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                                    {bid.bidder.rating.toFixed(1)}
                                  </span>
                                )}
                                {bid.bidder.completedProjects && (
                                  <span>
                                    {bid.bidder.completedProjects} projects
                                  </span>
                                )}
                                {bid.bidder.onTimeDelivery && (
                                  <span>
                                    {bid.bidder.onTimeDelivery}% on time
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {formatCurrency(bid.amount)}
                            </div>
                            <div className="text-sm text-gray-500">
                              Submitted: {formatDate(bid.createdAt)}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4">{bid.description}</p>

                        {/* Action buttons */}
                        <div className="flex items-center space-x-3">
                          {bid.status === "pending" && !hasAwardedBid && (
                            <>
                              <Button
                                onClick={() =>
                                  handleBidStatusUpdate(bid._id, "accepted")
                                }
                                disabled={updatingBidStatus[bid._id]}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                {updatingBidStatus[bid._id] ? (
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                  <Award className="h-4 w-4 mr-1" />
                                )}
                                Award Bid
                              </Button>
                              <Button
                                onClick={() =>
                                  handleBidStatusUpdate(bid._id, "rejected")
                                }
                                disabled={updatingBidStatus[bid._id]}
                                variant="outline"
                                size="sm"
                                className="border-red-200 text-red-600 hover:bg-red-50"
                              >
                                {updatingBidStatus[bid._id] ? (
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                  <X className="h-4 w-4 mr-1" />
                                )}
                                Reject
                              </Button>
                            </>
                          )}
                          {bid.status === "pending" && hasAwardedBid && (
                            <div className="text-sm text-gray-500 italic">
                              Cannot award - another bid has been selected
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
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

            {/* Q&A Tab */}
            {activeTab === "qa" && (
              <div className="space-y-6">
                {questions.length !== 0 &&
                  questions.map((question) => {
                    return (
                      <Card
                        key={question._id}
                        className="border border-gray-200"
                      >
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            {/* Question */}
                            <div>
                              <div className="flex items-center space-x-3 mb-2">
                                <MessageSquare className="h-5 w-5 text-blue-600" />
                                <span className="font-medium text-gray-900">
                                  Anomynus
                                </span>
                                <span className="text-sm text-gray-500">
                                  {formatDate(question.createdAt)}
                                </span>
                              </div>
                              <p className="text-gray-700 pl-8">
                                {question.question}
                              </p>
                            </div>

                            {/* Answer or Answer Input */}
                            {question.answer ? (
                              <div className="pl-8 border-l-2 border-gray-200">
                                <div className="flex items-center space-x-3 mb-2">
                                  <span className="font-medium text-green-600">
                                    Your Answer
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {formatDate(question.updatedAt)}
                                  </span>
                                </div>
                                <p className="text-gray-700">
                                  {question.answer}
                                </p>
                              </div>
                            ) : (
                              <div className="pl-8">
                                <Textarea
                                  placeholder="Type your answer..."
                                  value={answerText[question._id] || ""}
                                  onChange={(e) =>
                                    setAnswerText((prev) => ({
                                      ...prev,
                                      [question._id]: e.target.value,
                                    }))
                                  }
                                  className="mb-3"
                                />
                                <Button
                                  onClick={() =>
                                    handleAnswerQuestion(question._id)
                                  }
                                  disabled={
                                    !answerText[question._id]?.trim() ||
                                    submittingAnswer[question._id]
                                  }
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  {submittingAnswer[question._id] ? (
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                  ) : (
                                    <Send className="h-4 w-4 mr-1" />
                                  )}
                                  Submit Answer
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
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
                    Bids and Q&A sections are hidden until this tender is
                    approved and becomes active.
                  </p>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
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

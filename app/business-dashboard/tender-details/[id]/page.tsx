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

interface Tender {
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
    completedProjects?: number;
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
const mockQuestionsAnswers: QuestionAnswer[] = [
  {
    id: 1,
    question: "What specific cleaning equipment should we bring?",
    answer:
      "We can provide basic cleaning supplies, but please bring industrial-grade equipment suitable for warehouse cleaning including floor scrubbers and high-reach tools.",
    askedTime: "1 hour ago",
  },
  {
    id: 2,
    question: "Are there any safety protocols we need to follow?",
    answer: null,
    askedTime: "30 minutes ago",
  },
  {
    id: 3,
    question: "What are the working hours for this cleaning project?",
    answer:
      "We prefer the cleaning to be done during off-hours, preferably evenings or weekends to avoid disrupting warehouse operations.",
    askedTime: "2 hours ago",
  },
];

export default function TenderDetailsPage({ params }: PageProps) {
  // Use the 'use' hook to unwrap the Promise
  const { id } = use(params);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [currentStep, setCurrentStep] = useState<BidStep>(BidStep.BID_DETAILS);
  const [tender, setTender] = useState<Tender | null>(null);
  const [userBid, setUserBid] = useState<Bid | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidDescription, setBidDescription] = useState("");
  const [submittingBid, setSubmittingBid] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");
  const { t } = useTranslation();
  const router = useRouter();

  // Payment form states
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [hasUserBid, setHasUserBid] = useState(false);
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

  const handleNextStep = () => {
    if (currentStep === BidStep.BID_DETAILS) {
      if (!bidAmount || !bidDescription.trim()) {
        toast.error("Please fill all required fields");
        return;
      }
      if (isNaN(Number(bidAmount)) || Number(bidAmount) <= 0) {
        toast.error("Please enter a valid bid amount");
        return;
      }
      setCurrentStep(BidStep.REVIEW);
    } else if (currentStep === BidStep.REVIEW) {
      setCurrentStep(BidStep.PAYMENT);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === BidStep.PAYMENT) {
      setCurrentStep(BidStep.REVIEW);
    } else if (currentStep === BidStep.REVIEW) {
      setCurrentStep(BidStep.BID_DETAILS);
    }
  };

  const handlePayment = async () => {
    setPaymentProcessing(true);

    setTimeout(async () => {
      try {
        if (!tender?._id) {
          throw new Error("Tender ID is missing.");
        }
        const bidData = {
          tender: tender._id,
          amount: Number(bidAmount),
          description: bidDescription.trim(),
        };

        const result = await createBid(bidData);
        setPaymentReference(
          result.paymentReference || result.paymentId || "PAY-" + Date.now()
        );
        setCurrentStep(BidStep.CONFIRMATION);
        toast.success("Payment processed successfully!");
      } catch (err: any) {
        console.error("Error submitting bid:", err);
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to submit bid";
        toast.error(errorMessage);
      } finally {
        setPaymentProcessing(false);
      }
    }, 3000); // 3 second demo timeout
  };

  const handleComplete = () => {
    setShowApplyForm(false);
    setCurrentStep(BidStep.BID_DETAILS);
    setBidAmount("");
    setBidDescription("");
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setCardHolder("");
    toast.success("Bid submitted successfully!");
    // Reload to get updated bid status
    window.location.reload();
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

  const renderBidStep = () => {
    switch (currentStep) {
      case BidStep.BID_DETAILS:
        return (
          <div className="space-y-6">
            <div>
              <Label
                htmlFor="bid-amount"
                className="block text-sm font-medium text-gray-700 mb-3"
              >
                Bid Amount (USD) *
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="bid-amount"
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Enter your bid amount"
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300 text-lg"
                  min="1"
                  step="0.01"
                />
              </div>
              {tender && (
                <p className="text-sm text-gray-500 mt-2">
                  Estimated budget: ${tender.estimatedBudget?.toLocaleString()}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="bid-description"
                className="block text-sm font-medium text-gray-700 mb-3"
              >
                Proposal Description *
              </Label>
              <Textarea
                id="bid-description"
                value={bidDescription}
                onChange={(e) => setBidDescription(e.target.value)}
                placeholder="Describe your approach, experience, and why you're the best fit for this project..."
                rows={6}
                className="w-full rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-300"
              />
              <p className="text-sm text-gray-500 mt-2">
                {bidDescription.length}/1500 characters
              </p>
            </div>
          </div>
        );

      case BidStep.REVIEW:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Review Your Bid
            </h3>

            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Bid Amount:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${Number(bidAmount).toLocaleString()}
                </span>
              </div>

              <div className="border-t pt-4">
                <span className="text-gray-600 block mb-2">Your Proposal:</span>
                <p className="text-gray-800 p-4 px-0 rounded-lg leading-relaxed whitespace-pre-wrap break-words max-h-40 overflow-auto text-sm  border-gray-200">
                  {bidDescription}
                </p>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bid Fee </span>
                  <span className="font-semibold text-gray-800">100 QAR</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    Final Review
                  </p>
                  <p className="text-sm text-blue-700">
                    Please review your bid carefully. Once submitted and payment
                    is processed, you cannot modify your proposal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case BidStep.PAYMENT:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Payment Details
            </h3>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Bid Fee:</span>
                <span className="text-xl font-bold text-gray-900">100 QAR</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Method
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 border rounded-xl flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === "card"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  <span className="font-medium">Credit Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod("paypal")}
                  className={`p-4 border rounded-xl flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === "paypal"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="h-5 w-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    P
                  </div>
                  <span className="font-medium">PayPal</span>
                </button>
              </div>
            </div>

            {/* Credit Card Form */}
            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="card-holder"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Cardholder Name *
                  </Label>
                  <input
                    id="card-holder"
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="card-number"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Card Number *
                  </Label>
                  <input
                    id="card-number"
                    type="text"
                    value={cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s/g, "");
                      const formattedValue = value.replace(
                        /(\d{4})(?=\d)/g,
                        "$1 "
                      );
                      if (formattedValue.length <= 19)
                        setCardNumber(formattedValue);
                    }}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="expiry"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Expiry Date *
                    </Label>
                    <input
                      id="expiry"
                      type="text"
                      value={expiryDate}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        const formattedValue = value.replace(
                          /(\d{2})(\d{0,2})/,
                          "$1/$2"
                        );
                        if (formattedValue.length <= 5)
                          setExpiryDate(formattedValue);
                      }}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="cvv"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      CVV *
                    </Label>
                    <input
                      id="cvv"
                      type="text"
                      value={cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 4) setCvv(value);
                      }}
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "paypal" && (
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <div className="h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="h-8 w-8 bg-white rounded text-blue-600 text-sm flex items-center justify-center font-bold">
                    P
                  </div>
                </div>
                <p className="text-blue-800 font-medium mb-2">PayPal Payment</p>
                <p className="text-blue-700 text-sm">
                  You'll be redirected to PayPal to complete your payment
                  securely.
                </p>
              </div>
            )}

            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800 mb-1">
                    Secure Payment
                  </p>
                  <p className="text-sm text-green-700">
                    Your payment is secured with 256-bit SSL encryption and
                    processed securely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case BidStep.CONFIRMATION:
        return (
          <div className="text-center space-y-6">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Bid Submitted Successfully!
              </h3>
              <p className="text-gray-600">
                Your bid has been submitted and payment processed successfully.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Reference:</span>
                <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">
                  {paymentReference}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Bid Amount:</span>
                <span className="font-bold text-green-600">
                  ${Number(bidAmount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Fee Paid:</span>
                <span className="font-semibold">100 QAR</span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    What's Next?
                  </p>
                  <p className="text-sm text-blue-700">
                    The client will review your bid along with others. You'll
                    receive an notification if your bid is accepted or if the
                    client has questions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case BidStep.BID_DETAILS:
        return "Submit Your Bid";
      case BidStep.REVIEW:
        return "Review Your Bid";
      case BidStep.PAYMENT:
        return "Payment";
      case BidStep.CONFIRMATION:
        return "Confirmation";
      default:
        return "";
    }
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
              <Link href="/business-dashboard/browse-tenders">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6 py-2 font-medium transition-all duration-300">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Tenders
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen">
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
                    <Link href="/business-dashboard/browse-tenders" passHref>
                      <Button
                        variant="outline"
                        className="text-sm bg-white/60 border-gray-200/50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 rounded-xl transition-all duration-300"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Tenders
                      </Button>
                    </Link>
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
                            {hasUserBid
                              ? tender.postedBy?.name ||
                                tender.postedBy?.email ||
                                "Anonymous Client"
                              : "Anonymous Client"}
                          </h3>

                          {tender.postedBy?.isVerified && (
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
                      {hasUserBid && (
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
                        {tender.bidCount}
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
                        : "⭕ " + tender.status}
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

                  {/* User's Bid Status - Only show if user has bid */}

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
                        onClick={() => router.push("/business-dashboard/bids")}
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                {/* Header with Progress */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {getStepTitle()}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Step {currentStep} of {Object.keys(BidStep).length / 2}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setShowApplyForm(false);
                      setCurrentStep(BidStep.BID_DETAILS);
                    }}
                    className="h-8 w-8 rounded-full hover:bg-gray-100"
                    disabled={paymentProcessing}
                  >
                    ✕
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        currentStep >= BidStep.BID_DETAILS
                          ? "bg-blue-500"
                          : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        currentStep > BidStep.BID_DETAILS
                          ? "bg-blue-500"
                          : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`h-2 w-2 rounded-full ${
                        currentStep >= BidStep.REVIEW
                          ? "bg-blue-500"
                          : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        currentStep > BidStep.REVIEW
                          ? "bg-blue-500"
                          : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`h-2 w-2 rounded-full ${
                        currentStep >= BidStep.PAYMENT
                          ? "bg-blue-500"
                          : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        currentStep > BidStep.PAYMENT
                          ? "bg-blue-500"
                          : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`h-2 w-2 rounded-full ${
                        currentStep >= BidStep.CONFIRMATION
                          ? "bg-blue-500"
                          : "bg-gray-200"
                      }`}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Details</span>
                    <span>Review</span>
                    <span>Payment</span>
                    <span>Done</span>
                  </div>
                </div>

                {/* Step Content */}
                {renderBidStep()}

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8">
                  {currentStep > BidStep.BID_DETAILS &&
                    currentStep < BidStep.CONFIRMATION && (
                      <Button
                        variant="outline"
                        onClick={handlePrevStep}
                        className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50 py-3 font-medium transition-all duration-300"
                        disabled={paymentProcessing}
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                    )}

                  {currentStep === BidStep.BID_DETAILS && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setShowApplyForm(false)}
                        className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50 py-3 font-medium transition-all duration-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleNextStep}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-medium transition-all duration-300 shadow-lg shadow-blue-500/25"
                        disabled={!bidAmount || !bidDescription.trim()}
                      >
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </>
                  )}

                  {currentStep === BidStep.REVIEW && (
                    <Button
                      onClick={handleNextStep}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-medium transition-all duration-300 shadow-lg shadow-blue-500/25"
                    >
                      Proceed to Payment
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}

                  {currentStep === BidStep.PAYMENT && (
                    <Button
                      onClick={handlePayment}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 font-medium transition-all duration-300 shadow-lg shadow-green-500/25"
                      disabled={
                        paymentProcessing ||
                        (paymentMethod === "card" &&
                          (!cardNumber || !expiryDate || !cvv || !cardHolder))
                      }
                    >
                      {paymentProcessing ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Processing Payment...
                        </div>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay 100 QAR
                        </>
                      )}
                    </Button>
                  )}

                  {currentStep === BidStep.CONFIRMATION && (
                    <Button
                      onClick={handleComplete}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-medium transition-all duration-300 shadow-lg shadow-blue-500/25"
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

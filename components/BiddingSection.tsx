// components/BiddingSection.tsx
"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  DollarSign,
  AlertCircle,
  CreditCard,
  Shield,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  Loader2,
  ExternalLink,
  Upload,
  X,
  Image,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createBid } from "@/app/services/BidService";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

enum BidStep {
  BID_DETAILS = 1,
  REVIEW = 2,
  PAYMENT_REDIRECT = 3,
}

interface BiddingSectionProps {
  tenderId: string;
  estimatedBudget?: number;
  onBidSubmitted: () => void;
  onCancel: () => void;
}

export default function BiddingSection({
  tenderId,
  estimatedBudget,
  onBidSubmitted,
  onCancel,
}: BiddingSectionProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<BidStep>(BidStep.BID_DETAILS);
  const [bidAmount, setBidAmount] = useState("");
  const [bidDescription, setBidDescription] = useState("");
  const [submittingBid, setSubmittingBid] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [bidId, setBidId] = useState("");
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    filename: string;
    contentType: string;
    size: number;
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      handleSubmitBid();
    }
  };

  const handlePrevStep = () => {
    if (currentStep === BidStep.REVIEW) {
      setCurrentStep(BidStep.BID_DETAILS);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    try {
      const file = files[0]; // Only use first file

      // Validate file
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        throw new Error("Image must be less than 10MB");
      }

      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed");
      }

      // Upload to Cloudinary
      const result = await uploadToCloudinary(file);

      setSelectedImage({
        url: result,
        filename: file.name,
        contentType: file.type,
        size: file.size,
      });

      toast.success("Image uploaded successfully!");
    } catch (err: any) {
      console.error("Image upload failed:", err);
      setUploadError(err.message || "Failed to upload image");
      setTimeout(() => setUploadError(null), 5000);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmitBid = async () => {
    setSubmittingBid(true);
    setUploadError(null);

    try {
      if (!tenderId) {
        throw new Error("Tender ID is missing.");
      }

      // Call API to create bid and get payment URL
      const response = await createBid({
        tender: tenderId,
        amount: Number(bidAmount),
        description: bidDescription,
        image: selectedImage || undefined,
      });

      if (response.success && response.payment?.paymentUrl) {
        setBidId(response.bid._id);
        setPaymentUrl(response.payment.paymentUrl);
        setCurrentStep(BidStep.PAYMENT_REDIRECT);
        toast.success("Bid created! Redirecting to payment...");
      } else {
        throw new Error("Payment URL not received");
      }
    } catch (err: any) {
      console.error("Error submitting bid:", err);
      const errorMessage =
        err?.response?.data?.message || err?.message || "Failed to submit bid";
      toast.error(errorMessage);
      setSubmittingBid(false);
    }
  };

  const handleRedirectToPayment = () => {
    if (paymentUrl) {
      // Redirect user to Tap payment page
      window.location.href = paymentUrl;
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
                Bid Amount (QAR) *
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
              {estimatedBudget !== undefined && (
                <p className="text-sm text-gray-500 mt-2">
                  Estimated budget: {Number(estimatedBudget).toLocaleString()}{" "}
                  QAR
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

            {/* Image Upload Section */}
            <div>
              <Label
                htmlFor="bid-image"
                className="block text-sm font-medium text-gray-700 mb-3"
              >
                Project Image (Optional)
              </Label>

              {selectedImage ? (
                <div className="relative">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.filename}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                  <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
                    <span>{selectedImage.filename}</span>
                    <span>{formatFileSize(selectedImage.size)}</span>
                  </div>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Click to upload an image or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB • One image only
                  </p>
                </div>
              )}

              {uploadError && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{uploadError}</span>
                  </div>
                </div>
              )}
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
                  {Number(bidAmount).toLocaleString()} QAR
                </span>
              </div>

              <div className="border-t pt-4">
                <span className="text-gray-600 block mb-2">Your Proposal:</span>
                <p className="text-gray-800 p-4 px-0 rounded-lg leading-relaxed whitespace-pre-wrap break-words max-h-40 overflow-auto text-sm border-gray-200">
                  {bidDescription}
                </p>
              </div>

              {/* Review Image */}
              {selectedImage && (
                <div className="border-t pt-4">
                  <span className="text-gray-600 block mb-2">
                    Project Image:
                  </span>
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedImage.url}
                      alt={selectedImage.filename}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{selectedImage.filename}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(selectedImage.size)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bid Fee</span>
                  <span className="font-semibold text-gray-800">100 QAR</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    Payment Required
                  </p>
                  <p className="text-sm text-blue-700">
                    You will be redirected to a secure Tap Payments page to
                    complete your 100 QAR bid fee payment. After successful
                    payment, your bid will be submitted.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case BidStep.PAYMENT_REDIRECT:
        return (
          <div className="text-center space-y-6">
            <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <CreditCard className="h-10 w-10 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Ready for Payment
              </h3>
              <p className="text-gray-600">
                Your bid is ready. Click below to proceed to secure payment.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Bid Amount:</span>
                <span className="font-bold text-green-600">
                  {Number(bidAmount).toLocaleString()} QAR
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Fee:</span>
                <span className="font-semibold">100 QAR</span>
              </div>
            </div>

            {/* Show uploaded image in payment confirmation */}
            {selectedImage && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Image Attached
                </h4>
                <img
                  src={selectedImage.url}
                  alt={selectedImage.filename}
                  className="max-w-full h-32 object-contain mx-auto rounded-lg border border-gray-200"
                />
                <div className="mt-2 text-sm text-gray-500">
                  {selectedImage.filename} ({formatFileSize(selectedImage.size)}
                  )
                </div>
              </div>
            )}

            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800 mb-1">
                    Secure Payment by Tap
                  </p>
                  <p className="text-sm text-green-700">
                    You'll be redirected to Tap Payments' secure gateway.
                    Multiple payment methods are supported including cards,
                    KNET, and more.
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleRedirectToPayment}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-6 text-lg font-medium transition-all duration-300 shadow-lg shadow-blue-500/25"
              disabled={!paymentUrl}
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Proceed to Payment
            </Button>
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
      case BidStep.PAYMENT_REDIRECT:
        return "Complete Payment";
      default:
        return "";
    }
  };

  return (
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
                Step {currentStep} of 3
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
              disabled={submittingBid}
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
                  currentStep >= BidStep.REVIEW ? "bg-blue-500" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`flex-1 h-1 mx-2 ${
                  currentStep > BidStep.REVIEW ? "bg-blue-500" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`h-2 w-2 rounded-full ${
                  currentStep >= BidStep.PAYMENT_REDIRECT
                    ? "bg-blue-500"
                    : "bg-gray-200"
                }`}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Details</span>
              <span>Review</span>
              <span>Payment</span>
            </div>
          </div>

          {/* Step Content */}
          {renderBidStep()}

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > BidStep.BID_DETAILS &&
              currentStep < BidStep.PAYMENT_REDIRECT && (
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50 py-3 font-medium transition-all duration-300"
                  disabled={submittingBid}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
            {currentStep === BidStep.BID_DETAILS && (
              <>
                <Button
                  variant="outline"
                  onClick={onCancel}
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
                disabled={submittingBid}
              >
                {submittingBid ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Creating Bid...
                  </div>
                ) : (
                  <>
                    Proceed to Payment
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

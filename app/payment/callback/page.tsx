"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { verifyPaymentStatus } from "@/app/services/paymentService";

function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "failed" | "pending" | null
  >(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const tapId = searchParams.get("tap_id");

      if (!tapId) {
        toast.error("Invalid payment reference");
        setPaymentStatus("failed");
        setVerifying(false);
        return;
      }

      try {
        const result = await verifyPaymentStatus(tapId);

        if (result.success) {
          setPaymentStatus("success");
          setPaymentDetails(result);
          toast.success("Payment completed successfully!");
        } else {
          setPaymentStatus("failed");
          toast.error("Payment was not completed");
        }
      } catch (error: any) {
        console.error("Payment verification error:", error);
        setPaymentStatus("failed");
        toast.error(
          error?.response?.data?.message || "Failed to verify payment"
        );
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleBackToDashboard = () => {
    router.push("/business-dashboard");
  };

  const handleViewBids = () => {
    router.push("business-dashboard/bids");
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verifying Payment
          </h2>
          <p className="text-gray-600">
            Please wait while we confirm your payment...
          </p>
        </div>
      </div>
    );
  }

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600">
              Your bid has been submitted successfully.
            </p>
          </div>

          {paymentDetails && (
            <div className="bg-gray-50 rounded-xl p-6 space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">
                  {paymentDetails.payment?.transactionId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-semibold text-green-600">
                  {paymentDetails.payment?.amount} QAR
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Completed
                </span>
              </div>
            </div>
          )}

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">
                  What's Next?
                </p>
                <p className="text-sm text-blue-700">
                  The tender owner will review your bid. You'll receive a
                  notification when there's an update.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleBackToDashboard}
              className="flex-1 rounded-xl py-3"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              onClick={handleViewBids}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3"
            >
              View My Bids
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h2>
          <p className="text-gray-600">
            Your payment could not be completed. Please try again.
          </p>
        </div>

        <div className="bg-red-50 rounded-xl p-4 border border-red-100 mb-6">
          <div className="flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800 mb-1">
                Payment Not Completed
              </p>
              <p className="text-sm text-red-700">
                Your bid was created but the payment was not completed. You can
                try submitting again.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleBackToDashboard}
            className="flex-1 rounded-xl py-3"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button
            onClick={() => router.push("/tenders")}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3"
          >
            Browse Tenders
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<div>Loading payment status...</div>}>
      <PaymentCallbackContent />
    </Suspense>
  );
}

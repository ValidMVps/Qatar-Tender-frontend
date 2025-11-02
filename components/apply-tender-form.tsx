"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2 } from "lucide-react";

import { useTranslation } from "../lib/hooks/useTranslation";
interface ApplyTenderFormProps {
  isOpen: boolean;
  onClose: () => void;
  tenderId: number;
  tenderTitle: string;
}

export function ApplyTenderForm({
  isOpen,
  onClose,
  tenderId,
  tenderTitle,
}: ApplyTenderFormProps) {
  const [currentStep, setCurrentStep] = useState(0); // 0: Bid Details, 1: Payment, 2: Confirmation
  const [bidAmount, setBidAmount] = useState<string>("");
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [bidImage, setBidImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission if this were a real form
    // Basic validation
    if (!bidAmount || !coverLetter) {
      alert("Please fill in both bid amount and cover letter.");
      return;
    }
    setCurrentStep(1); // Move to payment step
  };

  const handleProcessPayment = async () => {
    setIsProcessingPayment(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2500)); // Simulate network delay
    setIsProcessingPayment(false);
    setCurrentStep(2); // Move to confirmation after simulated payment
    // In a real app, you would then trigger the actual bid submission here
    // after successful payment. For this demo, we'll just move to confirmation.
  };

  const handleBackStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleCloseForm = () => {
    setCurrentStep(0); // Reset form to first step
    setBidAmount("");
    setCoverLetter("");
    setBidImage(null);
    onClose();
  };
  const { t } = useTranslation();
  return (
    <Dialog open={isOpen} onOpenChange={handleCloseForm}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apply for Tender: {tenderTitle}</DialogTitle>
          <DialogDescription>
            {currentStep === 0 && "Step 1 of 2: Submit Your Bid Details"}
            {currentStep === 1 && "Step 2 of 2: Payment for Bid Placement"}
            {currentStep === 2 && "Bid Submitted Successfully!"}
          </DialogDescription>
        </DialogHeader>

        {currentStep === 0 && (
          <form onSubmit={handleProceedToPayment} className="space-y-4 py-4">
            <div>
              <Label htmlFor="bid-amount" className="mb-2 block">
                Your Bid Amount (USD)
              </Label>
              <Input
                id="bid-amount"
                type="number"
                placeholder="e.g., 7500"
                min="0"
                step="100"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="cover-letter" className="mb-2 block">
                {t('cover_letter')}
              </Label>
              <Textarea
                id="cover-letter"
                placeholder="Tell us why you're the best fit for this project..."
                rows={6}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="bid-image" className="mb-2 block">
                Upload Supporting Document / Image (Optional)
              </Label>
              <Input
                id="bid-image"
                type="file"
                accept="image/*"
                onChange={(e) => setBidImage(e.target.files?.[0] || null)}
              />
              {bidImage && (
                <p className="text-xs text-gray-500 mt-1">
                  Selected: {bidImage.name}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              {t('proceed_to_payment')}
            </Button>
          </form>
        )}

        {currentStep === 1 && (
          <div className="space-y-4 py-4">
            <p className="text-center text-lg font-semibold text-gray-800">
              A non-refundable fee of{" "}
              <span className="text-green-600">100 QAR</span> is required to
              place a bid.
            </p>
            <p className="text-sm text-gray-600 text-center">
              This fee helps ensure serious applicants and covers administrative
              costs.
            </p>
            <div className="flex justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBackStep}
                disabled={isProcessingPayment}
              >
                {t("back")}
              </Button>
              <Button
                onClick={handleProcessPayment}
                className="flex-1"
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  "Pay 100 QAR and Submit Bid"
                )}
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <p className="text-xl font-semibold text-center">
              Your bid has been successfully submitted!
            </p>
            <p className="text-sm text-gray-600 text-center">
              You will be notified if your bid is shortlisted or accepted.
            </p>
            <Button onClick={handleCloseForm} className="w-full">
              {t("close")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

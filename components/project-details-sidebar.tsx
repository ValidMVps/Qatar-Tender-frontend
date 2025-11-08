"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FileText,
  DollarSign,
  Calendar,
  User,
  CheckCircle,
  Star,
  ChevronRight,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { updateTenderStatus } from "@/app/services/tenderService";
import { createReview, getReviewForTender } from "@/app/services/ReviewService";
import { getTenderBids, updateBidStatus } from "@/app/services/BidService";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface ProjectDetailsSidebarProps
  extends React.ComponentPropsWithoutRef<"div"> {
  selectedProject: {
    id: string;
    title: string;
    description: string;
    status: string;
    startDate: string;
    budget: string;
    awardedTo?: any;
    postedBy: any;
  } | null;
  getStatusColor: (status: string) => string;
  onMarkComplete?: () => void;
  currentUserId: string;
  setRefresh: React.Dispatch<React.SetStateAction<number>>;
  activeTab?: "owned" | "awarded"; // Added to distinguish
}

export function ProjectDetailsSidebar({
  selectedProject,
  getStatusColor,
  currentUserId,
  setRefresh,
  activeTab = "owned",
  className,
  ...props
}: ProjectDetailsSidebarProps) {
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [completeStep, setCompleteStep] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [bid, setBid] = useState<{ _id: string; amount: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasReview, setHasReview] = useState(false);
  const [selectedBidAmount, setSelectedBidAmount] = useState<string | null>(
    null
  );
  const [bidLoading, setBidLoading] = useState(false);
  const { t } = useTranslation();
  const { profile } = useAuth();

  const isTenderOwner = selectedProject?.postedBy === currentUserId;
  const isBidder =
    selectedProject?.awardedTo?._id === currentUserId ||
    selectedProject?.awardedTo === currentUserId;
  const isCompleted = selectedProject?.status === "completed";
  const isAwarded = selectedProject?.status === "awarded";

  // Fetch bid amount
  useEffect(() => {
    const fetchBid = async () => {
      if (!selectedProject || !selectedProject.awardedTo) return;
      setBidLoading(true);
      try {
        const bids = await getTenderBids(selectedProject.id);
        const awardedBid = bids.find((b: any) =>
          ["accepted", "completed"].includes(b.status)
        );
        if (awardedBid) {
          setBid(awardedBid);
          setSelectedBidAmount(`${awardedBid.amount} QAR`);
        } else {
          setSelectedBidAmount(t("not_specified"));
        }
      } catch (err) {
        setSelectedBidAmount(t("not_specified"));
      } finally {
        setBidLoading(false);
      }
    };
    fetchBid();
  }, [selectedProject]);

  // Check if review exists
  useEffect(() => {
    const checkReview = async () => {
      if (!selectedProject || !isTenderOwner || !isCompleted) return;
      try {
        const review = await getReviewForTender(selectedProject.id);
        setHasReview(!!review);
      } catch (err) {
        console.error("Review check failed", err);
      }
    };
    checkReview();
  }, [selectedProject, isTenderOwner, isCompleted]);

  const handleMarkAsComplete = async () => {
    if (!selectedProject || !bid?._id) return;

    setLoading(true);
    setError(null);
    try {
      await updateBidStatus(bid._id, "completed");
      await updateTenderStatus(selectedProject.id, "completed");
      setCompleteStep(2);
    } catch (err) {
      setError(t("failed_to_complete"));
    } finally {
      setLoading(false);
      setRefresh((prev) => prev + 1);
    }
  };

  const handleReviewSubmit = async () => {
    if (!selectedProject || rating === 0) return;

    const reviewedUserId =
      activeTab === "owned"
        ? selectedProject.awardedTo?._id || selectedProject.awardedTo
        : selectedProject.postedBy?._id || selectedProject.postedBy;

    if (!reviewedUserId) return;

    try {
      await createReview({
        tender: selectedProject.id,
        reviewedUser: reviewedUserId,
        rating,
        comment,
      });
      setIsReviewDialogOpen(false);
      setIsCompleteDialogOpen(false);
      setCompleteStep(1);
      setRating(0);
      setComment("");
      setRefresh((prev) => prev + 1);
    } catch (err) {
      setError(t("failed_to_submit_review"));
    }
  };

  const handleCloseCompleteDialog = () => {
    setIsCompleteDialogOpen(false);
    setCompleteStep(1);
    setRating(0);
    setComment("");
    setError(null);
  };

  const handleCloseReviewDialog = () => {
    setIsReviewDialogOpen(false);
    setRating(0);
    setComment("");
    setError(null);
  };

  if (!selectedProject) {
    return (
      <div className={`flex flex-col h-full ${className}`} {...props}>
        <div className="h-full bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-lg flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">
              {t("select_a_project")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const awardedUserName =
    typeof selectedProject.awardedTo === "object"
      ? selectedProject.awardedTo.profile?.fullName ||
        selectedProject.awardedTo.profile?.companyName ||
        selectedProject.awardedTo.email
      : "User";

  const postedByName =
    typeof selectedProject.postedBy === "object"
      ? selectedProject.postedBy.profile?.fullName ||
        selectedProject.postedBy.profile?.companyName ||
        selectedProject.postedBy.email
      : "User";

  return (
    <div
      className={`flex flex-col h-full overflow-hidden ${className}`}
      {...props}
    >
      <div className="h-full bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            {t("project_details")}
          </h3>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Title Card */}
            <div className="bg-gradient-to-br from-gray-50/80 to-white dark:from-gray-800/80 dark:to-gray-900/80 rounded-xl border border-gray-200/60 p-4">
              <h4 className="font-semibold mb-3 line-clamp-2">
                {selectedProject.title}
              </h4>

              <div className="space-y-4">
                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {t("description")}
                  </label>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Amount & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {t("selected_amount")}
                    </label>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                      {bidLoading ? (
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16" />
                      ) : (
                        <p className="text-sm font-semibold">
                          {selectedBidAmount}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      {t("status")}
                    </label>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                      <Badge
                        variant="secondary"
                        className={`${getStatusColor(
                          selectedProject.status
                        )} text-xs px-2 py-1`}
                      >
                        {selectedProject.status === "awarded"
                          ? t("awarded")
                          : t(selectedProject.status)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {t("start_date")}
                  </label>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {new Date(selectedProject.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Awarded To / Awarded By */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {activeTab === "owned" ? t("awarded_to") : t("awarded_by")}
                  </label>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {activeTab === "owned" ? awardedUserName : postedByName}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-sm text-red-700 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* View Details */}
              <Link
                href={
                  profile?.userType !== "business"
                    ? `/dashboard/tender/${selectedProject.id}`
                    : `/business-dashboard/tender/${selectedProject.id}`
                }
              >
                <Button className="w-full group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl py-6 shadow-md hover:shadow-lg">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">
                      {t("view_tender_details")}
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Button>
              </Link>

              {/* Mark as Complete (Only for owner when awarded) */}
              {isTenderOwner && isAwarded && (
                <Button
                  onClick={() => setIsCompleteDialogOpen(true)}
                  className="w-full group bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white rounded-xl py-6 shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">
                      {t("mark_as_completed")}
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Button>
              )}

              {/* Leave Review (Only for owner when completed) */}
              {isTenderOwner && isCompleted && !hasReview && (
                <Button
                  onClick={() => setIsReviewDialogOpen(true)}
                  className="w-full group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl py-6 shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{t("leave_review")}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Complete Dialog */}
      <Dialog
        open={isCompleteDialogOpen}
        onOpenChange={handleCloseCompleteDialog}
      >
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl">
          {completeStep === 1 && (
            <>
              <DialogHeader className="pb-6">
                <DialogTitle className="text-xl font-semibold flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-gray-700" />
                  </div>
                  {t("mark_as_completed")}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  {t("confirm_mark_complete")}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex gap-3 pt-6">
                <Button
                  variant="outline"
                  onClick={handleCloseCompleteDialog}
                  disabled={loading}
                >
                  {t("cancel")}
                </Button>
                <Button
                  onClick={handleMarkAsComplete}
                  disabled={loading}
                  className="bg-gradient-to-r from-gray-900 to-gray-800 text-white"
                >
                  {loading ? t("processing") : t("confirm")}
                </Button>
              </DialogFooter>
            </>
          )}

          {completeStep === 2 && (
            <>
              <DialogHeader className="pb-6">
                <DialogTitle className="text-xl font-semibold flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  {t("rate_project_completion")}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  {t("please_rate_worker")}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    {t("rating")}
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-8 w-8 cursor-pointer transition-all ${
                          rating >= star
                            ? "fill-yellow-400 text-yellow-400 scale-110"
                            : "text-gray-300 hover:text-yellow-300"
                        }`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label
                    htmlFor="comment"
                    className="text-sm font-medium text-gray-700"
                  >
                    {t("review")}
                  </label>
                  <Textarea
                    id="comment"
                    placeholder={t("write_your_feedback")}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[120px] rounded-xl"
                  />
                </div>
              </div>

              <DialogFooter className="flex gap-3 pt-6">
                <Button variant="outline" onClick={handleCloseCompleteDialog}>
                  {t("skip")}
                </Button>
                <Button
                  onClick={handleReviewSubmit}
                  disabled={rating === 0}
                  className="bg-gradient-to-r from-gray-900 to-gray-800 text-white"
                >
                  {t("submit_review")}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Standalone Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={handleCloseReviewDialog}>
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl font-semibold flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              {t("rate_project_completion")}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {t("please_rate_worker")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                {t("rating")}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-8 w-8 cursor-pointer transition-all ${
                      rating >= star
                        ? "fill-yellow-400 text-yellow-400 scale-110"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label
                htmlFor="comment2"
                className="text-sm font-medium text-gray-700"
              >
                {t("review")}
              </label>
              <Textarea
                id="comment2"
                placeholder={t("write_your_feedback")}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[120px] rounded-xl"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-3 pt-6">
            <Button variant="outline" onClick={handleCloseReviewDialog}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleReviewSubmit}
              disabled={rating === 0}
              className="bg-gradient-to-r from-gray-900 to-gray-800 text-white"
            >
              {t("submit_review")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

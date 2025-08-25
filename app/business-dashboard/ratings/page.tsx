"use client";

import type React from "react";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  Search,
  TrendingUp,
  MessageSquare,
  Award,
  Clock,
  Edit,
  Save,
  X,
  MessageCircle,
  FileText,
} from "lucide-react";
import { useTranslation } from "../../../lib/hooks/useTranslation";
import {
  getMyReceivedReviews,
  getMyGivenReviews,
  updateReview,
} from "../../services/ReviewService";
import type { Review as ApiReview } from "../../services/ReviewService";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

// TypeScript Interfaces
interface Review {
  id: string;
  contractorEmail: string;
  contractorId: string;
  rating: number;
  comment: string;
  projectName: string;
  date: string;
  tags: string[];
  tenderId: string;
}

interface ReviewGiven {
  id: string;
  projectOwnerName: string;
  projectOwnerEmail: string;
  userId: string; // ID of the user reviewed (contractor)
  tenderId: string; // ID of the project/tender
  rating: number;
  comment: string;
  projectName: string;
  date: string;
  tags: string[];
}

interface AnalyticsSummary {
  averageRating: number;
  totalReviews: number;
  fiveStarPercentage: number;
  mostFrequentTag: string;
}

// Transform API review to UI review (reviews you received)
// For received reviews: reviewer is the person who gave you the review
const transformApiReviewToReview = (apiReview: ApiReview): Review => ({
  id: apiReview._id,
  contractorEmail: apiReview.reviewer.email || "Unknown Reviewer", // <- use reviewer email
  contractorId: apiReview.reviewer._id || "",
  rating: apiReview.rating,
  comment: apiReview.comment || "",
  projectName: apiReview.tender.title,
  date: apiReview.createdAt,
  tags: [],
  tenderId: apiReview.tender._id,
});
// Transform API review to UI review (reviews you gave)
// For given reviews: reviewedUser is the person you reviewed
const transformApiReviewToReviewGiven = (apiReview: ApiReview): ReviewGiven => {
  let userId = "";
  let email = "Unknown User";

  if (
    typeof apiReview.reviewedUser === "object" &&
    apiReview.reviewedUser !== null
  ) {
    userId = (apiReview.reviewedUser as any)._id;
    email = (apiReview.reviewedUser as any).email || "Unknown User";
  } else {
    userId = String(apiReview.reviewedUser);
  }

  return {
    id: apiReview._id,
    projectOwnerName: email,
    projectOwnerEmail: email,
    userId,
    tenderId: apiReview.tender._id,
    rating: apiReview.rating,
    comment: apiReview.comment || "",
    projectName: apiReview.tender.title,
    date: apiReview.createdAt,
    tags: [],
  };
};

// Star Rating Component
const StarRating: React.FC<{ rating: number; size?: "sm" | "md" | "lg" }> = ({
  rating,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} transition-colors ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

// Editable Star Rating
const EditableStarRating: React.FC<{
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: "sm" | "md" | "lg";
}> = ({ rating, onRatingChange, size = "md" }) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-0.5 transition-all"
        >
          <Star
            className={`${sizeClasses[size]} transition-colors ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400 hover:fill-yellow-500"
                : "fill-gray-200 text-gray-200 hover:fill-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

// Analytics Card Component
const AnalyticsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}> = ({ title, value, icon, description }) => (
  <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl backdrop-blur-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
      <CardTitle className="text-sm font-semibold text-gray-700">
        {title}
      </CardTitle>
      <div className="p-2 bg-blue-50 rounded-xl">
        <div className="text-blue-600">{icon}</div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </CardContent>
  </Card>
);

// Review Card (Received Reviews)
const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-gray-50 to-gray-100/50 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg mb-1">
              {review.contractorEmail}
            </h3>

            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-sm font-medium text-gray-700">
                {review.rating}/5
              </span>
            </div>
          </div>
          <span className="text-xs text-gray-400 bg-white rounded-lg px-2 py-1">
            {new Date(review.date).toLocaleDateString()}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-gray-700 leading-relaxed mb-6">{review.comment}</p>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t("project") || "Project"}
            </span>
            <p className="text-sm font-semibold text-gray-900 mt-1">
              {review.projectName}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50 transition-colors"
              onClick={() => router.push(`/chat/${review.contractorId}`)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {t("chat") || "Chat"}
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
              onClick={() => router.push(`/projects/${review.tenderId}`)}
            >
              <FileText className="h-4 w-4 mr-2" />
              {t("view_project") || "View Project"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Editable Review Card (Reviews You Gave)
const EditableReviewCard: React.FC<{
  review: ReviewGiven;
  onUpdate: (updatedReview: ReviewGiven) => void;
}> = ({ review, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReview, setEditedReview] = useState(review);
  const { profile, user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  console.log("Rendering EditableReviewCard for review ID:", review);
  const handleSave = async () => {
    setIsUpdating(true);
    try {
      // Call the API to update the review
      const updatedData = {
        rating: editedReview.rating,
        comment: editedReview.comment,
      };

      await updateReview(review.id, updatedData);

      // Update local state
      onUpdate(editedReview);
      setIsEditing(false);

      toast({
        title: t("success") || "Success",
        description:
          t("review_updated_successfully") || "Review updated successfully!",
      });
    } catch (error: any) {
      console.error("Error updating review:", error);
      toast({
        title: t("error") || "Error",
        description:
          error.message ||
          t("failed_to_update_review") ||
          "Failed to update review. Please try again.",
        variant: "destructive",
      });
      // Reset to original values on error
      setEditedReview(review);
    } finally {
      setIsUpdating(false);
    }
  };
  const handleCancel = () => {
    setEditedReview(review);
    setIsEditing(false);
  };

  return (
    <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-blue-50 to-blue-100/50 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg mb-1">
              {user?.email}
            </h3>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <EditableStarRating
                  rating={editedReview.rating}
                  onRatingChange={(rating) =>
                    setEditedReview({ ...editedReview, rating })
                  }
                  size="sm"
                />
              ) : (
                <StarRating rating={review.rating} size="sm" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {isEditing ? editedReview.rating : review.rating}/5
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs text-gray-400 bg-white rounded-lg px-2 py-1">
              {new Date(review.date).toLocaleDateString()}
            </span>
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 rounded-xl hover:bg-white/80 transition-colors"
              >
                <Edit className="h-4 w-4 mr-1" />
                {t("edit") || "Edit"}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={editedReview.comment}
              onChange={(e) =>
                setEditedReview({ ...editedReview, comment: e.target.value })
              }
              className="min-h-[120px] border-0 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder={t("write_your_review") || "Write your review..."}
              disabled={isUpdating}
            />
            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                size="sm"
                className="rounded-xl bg-green-600 hover:bg-green-700"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    {t("saving") || "Saving..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {t("save") || "Save"}
                  </>
                )}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                className="rounded-xl"
                disabled={isUpdating}
              >
                <X className="h-4 w-4 mr-2" />
                {t("cancel") || "Cancel"}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
        )}

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t("project") || "Project"}
            </span>
            <p className="text-sm font-semibold text-gray-900 mt-1">
              {review.projectName}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50 transition-colors"
              onClick={() => router.push(`/chat/${review.userId}`)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {t("chat") || "Chat"}
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
              onClick={() => router.push(`/projects/${review.tenderId}`)}
            >
              <FileText className="h-4 w-4 mr-2" />
              {t("view_project") || "View Project"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Component
const ReviewsRatingsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"received" | "given">("received");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsGiven, setReviewsGiven] = useState<ReviewGiven[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();
  const analytics = useMemo<AnalyticsSummary>(() => {
    const total = reviews.length;
    // averageRating: prefer profile.rating (backend truth) else compute from reviews
    const avgFromProfile = Number(profile?.rating ?? 0);
    const averageRating =
      total === 0
        ? Number(avgFromProfile.toFixed(1))
        : Number(
            (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1)
          );

    // totalReviews: prefer profile count else reviews length
    const totalReviews = Number(profile?.ratingCount ?? total);

    // fiveStarPercentage: exact from reviews if available, else approximate from profile
    const fiveStarPercentage =
      total === 0
        ? Math.round((Number(profile?.rating ?? 0) / 5) * 100)
        : Math.round(
            (reviews.filter((r) => r.rating === 5).length / total) * 100
          );

    // topProject: find tenderId with highest count in reviews
    let topProject = "N/A";
    if (total > 0) {
      const counts: Record<string, { name: string; count: number }> = {};
      reviews.forEach((r) => {
        const id = r.tenderId || r.id || "unknown";
        const name = r.projectName || "Untitled Project";
        if (!counts[id]) counts[id] = { name, count: 0 };
        counts[id].count += 1;
      });
      const top = Object.values(counts).sort((a, b) => b.count - a.count)[0];
      topProject = top ? `${top.name}` : "N/A";
    }

    return {
      averageRating,
      totalReviews,
      fiveStarPercentage,
      topProject,
    };
  }, [profile, reviews]);
  useEffect(() => {
    console.log(profile);
  }, [profile]);
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        if (activeTab === "received") {
          const apiReviews = await getMyReceivedReviews();
          const transformedReviews = apiReviews.map(transformApiReviewToReview);
          setReviews(transformedReviews);
        } else {
          const apiReviews = await getMyGivenReviews();
          const transformedReviews = apiReviews.map(
            transformApiReviewToReviewGiven
          );
          setReviewsGiven(transformedReviews);
        }
      } catch (err) {
        setError("Failed to fetch reviews");
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [activeTab]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchesSearch =
        review.contractorEmail
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        review.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating =
        ratingFilter === "all" || review.rating === parseInt(ratingFilter);
      return matchesSearch && matchesRating;
    });
  }, [reviews, searchTerm, ratingFilter]);

  const filteredReviewsGiven = useMemo(() => {
    return reviewsGiven.filter((review) => {
      const matchesSearch =
        review.projectOwnerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        review.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating =
        ratingFilter === "all" || review.rating === parseInt(ratingFilter);
      return matchesSearch && matchesRating;
    });
  }, [reviewsGiven, searchTerm, ratingFilter]);

  const handleReviewUpdate = (updatedReview: ReviewGiven) => {
    setReviewsGiven((prev) =>
      prev.map((r) => (r.id === updatedReview.id ? updatedReview : r))
    );
  };

  const mockAnalytics = {
    averageRating: 4.3,
    totalReviews: reviews.length,
    fiveStarPercentage: 50,
    mostFrequentTag: "Professional",
  };

  const EmptyState = ({ type }: { type: "received" | "given" }) => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
        <MessageSquare className="w-16 h-16 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        {t("no_reviews_found") || "No Reviews Found"}
      </h3>
      <p className="text-gray-500 max-w-md leading-relaxed">
        {searchTerm || ratingFilter !== "all"
          ? t("try_adjusting_filters") ||
            "Try adjusting your filters to see more reviews."
          : type === "received"
          ? t("no_received_reviews_yet") ||
            "You haven't received any reviews from contractors yet. Complete projects to start receiving feedback."
          : t("no_given_reviews_yet") ||
            "You haven't given any reviews yet. Complete projects to start giving feedback."}
      </p>
    </div>
  );

  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">
            {t("loading_reviews") || "Loading reviews..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md">
          <div className="text-red-500 text-lg font-semibold">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnalyticsCard
            title={t("average_rating") || "Average Rating"}
            value={analytics?.averageRating}
            icon={<TrendingUp className="w-4 h-4" />}
            description={t("out_of_5_stars") || "out of 5 stars"}
          />
          <AnalyticsCard
            title={t("total_reviews") || "Total Reviews"}
            value={analytics?.totalReviews}
            icon={<MessageSquare className="w-4 h-4" />}
            description={
              t("from_completed_projects") || "from completed projects"
            }
          />
          <AnalyticsCard
            title={t("5_star_reviews") || "5-Star Reviews"}
            value={`${analytics.fiveStarPercentage}%`}
            icon={<Award className="w-4 h-4" />}
            description={t("excellent_ratings") || "excellent ratings"}
          />
          <AnalyticsCard
            title={t("top_project") || "Top Project"}
            value={analytics.topProject}
            icon={<Clock className="w-4 h-4" />}
            description={t("most_reviewed_project") || "most reviewed project"}
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as any)}
            className="w-full"
          >
            <div className="border-b border-gray-100 p-6">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100 rounded-xl p-1">
                <TabsTrigger
                  value="received"
                  className="rounded-xl font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  {t("reviews_received") || "Reviews Received"}
                </TabsTrigger>
                <TabsTrigger
                  value="given"
                  className="rounded-xl font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  {t("reviews_given_by_me") || "Reviews Given by Me"}
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="received" className="space-y-8 mt-0">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder={
                        t(
                          "search_by_contractor_name_project_or_review_content"
                        ) || "Search by contractor, project, or content"
                      }
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-11 h-12 border-0 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger className="w-full sm:w-48 h-12 border-0 bg-gray-50 rounded-2xl">
                      <SelectValue
                        placeholder={
                          t("filter_by_rating") || "Filter by rating"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-0 shadow-lg">
                      <SelectItem value="all">
                        {t("all_ratings") || "All Ratings"}
                      </SelectItem>
                      <SelectItem value="5">
                        5 {t("stars") || "Stars"}
                      </SelectItem>
                      <SelectItem value="4">
                        4 {t("stars") || "Stars"}
                      </SelectItem>
                      <SelectItem value="3">
                        3 {t("stars") || "Stars"}
                      </SelectItem>
                      <SelectItem value="2">
                        2 {t("stars") || "Stars"}
                      </SelectItem>
                      <SelectItem value="1">1 {t("star") || "Star"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))
                  ) : (
                    <EmptyState type="received" />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="given" className="space-y-8 mt-0">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder={
                        t(
                          "search_by_project_owner_name_project_or_review_content"
                        ) || "Search by project owner, project, or content"
                      }
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-11 h-12 border-0 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger className="w-full sm:w-48 h-12 border-0 bg-gray-50 rounded-2xl">
                      <SelectValue
                        placeholder={
                          t("filter_by_rating") || "Filter by rating"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-0 shadow-lg">
                      <SelectItem value="all">
                        {t("all_ratings") || "All Ratings"}
                      </SelectItem>
                      <SelectItem value="5">
                        5 {t("stars") || "Stars"}
                      </SelectItem>
                      <SelectItem value="4">
                        4 {t("stars") || "Stars"}
                      </SelectItem>
                      <SelectItem value="3">
                        3 {t("stars") || "Stars"}
                      </SelectItem>
                      <SelectItem value="2">
                        2 {t("stars") || "Stars"}
                      </SelectItem>
                      <SelectItem value="1">1 {t("star") || "Star"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {filteredReviewsGiven.length > 0 ? (
                    filteredReviewsGiven.map((review) => (
                      <EditableReviewCard
                        key={review.id}
                        review={review}
                        onUpdate={handleReviewUpdate}
                      />
                    ))
                  ) : (
                    <EmptyState type="given" />
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ReviewsRatingsPage;

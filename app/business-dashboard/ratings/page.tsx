"use client";

import type React from "react";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "lucide-react";
import { useTranslation } from "../../../lib/hooks/useTranslation";
import {
  getMyReceivedReviews,
  getReviewsForUser,
} from "../../services/ReviewService";
import type { Review as ApiReview } from "@/services/reviewService";

// TypeScript Interfaces
interface Review {
  id: string;
  contractorName: string;
  contractorAvatar?: string;
  rating: number;
  comment: string;
  projectName: string;
  date: string;
  tags: string[];
}

interface ReviewGiven {
  id: string;
  projectOwnerName: string;
  projectOwnerAvatar?: string;
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

// Transform API review to UI review
const transformApiReviewToReview = (apiReview: ApiReview): Review => ({
  id: apiReview._id,
  contractorName: apiReview.reviewer.email, // Using email as name for now
  contractorAvatar: undefined, // API doesn't provide avatar
  rating: apiReview.rating,
  comment: apiReview.comment || "",
  projectName: apiReview.tender.title,
  date: apiReview.createdAt,
  tags: [], // API doesn't provide tags
});

const transformApiReviewToReviewGiven = (
  apiReview: ApiReview
): ReviewGiven => ({
  id: apiReview._id,
  projectOwnerName: apiReview.reviewedUser, // This should be the project owner name
  projectOwnerAvatar: undefined, // API doesn't provide avatar
  rating: apiReview.rating,
  comment: apiReview.comment || "",
  projectName: apiReview.tender.title,
  date: apiReview.createdAt,
  tags: [], // API doesn't provide tags
});

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
          className={`${sizeClasses[size]} ${
            star <= rating
              ? "fill-gray-900 text-gray-900"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

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
          className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          <Star
            className={`${sizeClasses[size]} transition-colors ${
              star <= rating
                ? "fill-gray-900 text-gray-900 hover:fill-gray-700"
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
  <Card className="border-gray-200 bg-blue-500 text-white ">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-white">{title}</CardTitle>
      <div className="text-white">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-white">{value}</div>
      {description && <p className="text-xs text-white mt-1">{description}</p>}
    </CardContent>
  </Card>
);

// Review Card Component
const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  const { t } = useTranslation();

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={review.contractorAvatar || "/placeholder.svg"}
                alt={review.contractorName}
              />
              <AvatarFallback className="bg-gray-100 text-gray-600">
                {review.contractorName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">
                {review.contractorName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={review.rating} size="sm" />
                <span className="text-sm text-gray-500">{review.rating}/5</span>
              </div>
            </div>
          </div>
          <span className="text-xs text-gray-400">
            {new Date(review.date).toLocaleDateString()}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          {review.comment}
        </p>

        <div className="space-y-3">
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {t("project")}
            </span>
            <p className="text-sm font-medium text-gray-900 mt-1">
              {review.projectName}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EditableReviewCard: React.FC<{
  review: ReviewGiven;
  onUpdate: (updatedReview: ReviewGiven) => void;
}> = ({ review, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReview, setEditedReview] = useState(review);

  const handleSave = () => {
    const { t } = useTranslation();

    onUpdate(editedReview);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedReview(review);
    setIsEditing(false);
  };
  const { t } = useTranslation();
  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={review.projectOwnerAvatar || "/placeholder.svg"}
                alt={review.projectOwnerName}
              />
              <AvatarFallback className="bg-gray-100 text-gray-600">
                {review.projectOwnerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">
                {review.projectOwnerName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
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
                <span className="text-sm text-gray-500">
                  {isEditing ? editedReview.rating : review.rating}/5
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              {new Date(review.date).toLocaleDateString()}
            </span>
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={editedReview.comment}
              onChange={(e) =>
                setEditedReview({ ...editedReview, comment: e.target.value })
              }
              className="min-h-[100px]"
              placeholder="Write your review..."
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                {t("save")}
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                {t("cancel")}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            {review.comment}
          </p>
        )}

        <div className="space-y-3">
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {t("project")}
            </span>
            <p className="text-sm font-medium text-gray-900 mt-1">
              {review.projectName}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Reviews & Ratings Component
const ReviewsRatingsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("received");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsGiven, setReviewsGiven] = useState<ReviewGiven[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch reviews when component mounts or tab changes
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
          // For "given" tab, you would need to implement a function to get reviews given by current user
          // This would require a new endpoint in your backend
          const apiReviews = await getMyReceivedReviews(); // Placeholder - replace with actual function
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
        review.contractorName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        review.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRating =
        ratingFilter === "all" ||
        review.rating === Number.parseInt(ratingFilter);

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
        ratingFilter === "all" ||
        review.rating === Number.parseInt(ratingFilter);

      return matchesSearch && matchesRating;
    });
  }, [reviewsGiven, searchTerm, ratingFilter]);

  const handleReviewUpdate = (updatedReview: ReviewGiven) => {
    setReviewsGiven((prev) =>
      prev.map((review) =>
        review.id === updatedReview.id ? updatedReview : review
      )
    );
  };

  // Mock analytics data - in a real app, this would come from the API
  const mockAnalytics: AnalyticsSummary = {
    averageRating: 4.3,
    totalReviews: reviews.length,
    fiveStarPercentage: 50,
    mostFrequentTag: "Professional",
  };

  const EmptyState = ({ type }: { type: "received" | "given" }) => (
    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <MessageSquare className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No Reviews Found
      </h3>
      <p className="text-gray-500 max-w-md">
        {searchTerm || ratingFilter !== "all"
          ? "Try adjusting your filters to see more reviews."
          : type === "received"
          ? "You haven't received any reviews from contractors yet. Complete projects to start receiving feedback."
          : "You haven't given any reviews yet. Complete projects to start giving feedback."}
      </p>
    </div>
  );

  const { t } = useTranslation();

  if (loading) {
    return <div className="container mx-auto py-8">Loading reviews...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 container mx-auto px-0 py-8 ">
      <div className="mx-auto space-y-8">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnalyticsCard
            title={t("average_rating")}
            value={mockAnalytics.averageRating.toFixed(1)}
            icon={<TrendingUp className="w-4 h-4" />}
            description={t("out_of_5_stars")}
          />
          <AnalyticsCard
            title={t("total_reviews")}
            value={mockAnalytics.totalReviews}
            icon={<MessageSquare className="w-4 h-4" />}
            description={t("from_completed_projects")}
          />
          <AnalyticsCard
            title={t("5_star_reviews")}
            value={`${mockAnalytics.fiveStarPercentage}%`}
            icon={<Award className="w-4 h-4" />}
            description={t("excellent_ratings")}
          />
          <AnalyticsCard
            title={t("top_quality")}
            value={mockAnalytics.mostFrequentTag}
            icon={<Clock className="w-4 h-4" />}
            description={t("most_mentioned_attribute")}
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="received">{t("reviews_received")}</TabsTrigger>
            <TabsTrigger value="given">{t("reviews_given_by_me")}</TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="space-y-8">
            {/* Filters */}
            <div className="rounded-lg">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder={t(
                      "search_by_contractor_name_project_or_review_content"
                    )}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-gray-500"
                  />
                </div>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="w-full sm:w-48 border-gray-300">
                    <SelectValue placeholder={t("filter_by_rating")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("all_ratings")}</SelectItem>
                    <SelectItem value="5">5 {t("stars")}</SelectItem>
                    <SelectItem value="4">4 {t("stars")}</SelectItem>
                    <SelectItem value="3">3 {t("stars")}</SelectItem>
                    <SelectItem value="2">2 {t("stars")}</SelectItem>
                    <SelectItem value="1">1 {t("star")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <EmptyState type="received" />
              )}
            </div>
          </TabsContent>

          <TabsContent value="given" className="space-y-8">
            {/* Filters */}
            <div className="rounded-lg">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder={t(
                      "search_by_project_owner_name_project_or_review_content"
                    )}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-gray-500"
                  />
                </div>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="w-full sm:w-48 border-gray-300">
                    <SelectValue placeholder={t("filter_by_rating")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("all_ratings")}</SelectItem>
                    <SelectItem value="5">5 {t("stars")}</SelectItem>
                    <SelectItem value="4">4 {t("stars")}</SelectItem>
                    <SelectItem value="3">3 {t("stars")}</SelectItem>
                    <SelectItem value="2">2 {t("stars")}</SelectItem>
                    <SelectItem value="1">1 {t("star")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Editable Reviews Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        </Tabs>
      </div>
    </div>
  );
};

export default ReviewsRatingsPage;

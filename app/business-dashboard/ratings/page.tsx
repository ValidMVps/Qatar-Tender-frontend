"use client";

import type React from "react";
import { useState, useMemo } from "react";
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

interface UserRole {
  type: "project_owner" | "contractor";
  name: string;
  company: string;
}

// Mock Data - Reviews Received
const mockReviews: Review[] = [
  {
    id: "1",
    contractorName: "Ahmed Al-Mansouri",
    contractorAvatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    rating: 5,
    comment:
      "Exceptional project owner. Clear communication, prompt payments, and realistic deadlines. Would definitely work with them again on future projects.",
    projectName: "Qatar National Museum Renovation",
    date: "2024-01-15",
    tags: ["Responsive", "Professional", "Paid Quickly"],
  },
  {
    id: "2",
    contractorName: "Fatima Al-Thani",
    contractorAvatar:
      "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    rating: 4,
    comment:
      "Great collaboration on the infrastructure project. Minor delays in feedback but overall a smooth working relationship.",
    projectName: "Doha Metro Station Upgrades",
    date: "2024-01-10",
    tags: ["Professional", "Detail-oriented"],
  },
  {
    id: "3",
    contractorName: "Mohammad Al-Kuwari",
    contractorAvatar:
      "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    rating: 5,
    comment:
      "Outstanding project management and clear specifications. Payment was processed ahead of schedule. Highly recommend.",
    projectName: "Lusail City Commercial Complex",
    date: "2024-01-05",
    tags: ["On-time", "Paid Quickly", "Clear Requirements"],
  },
  {
    id: "4",
    contractorName: "Sarah Al-Dosari",
    contractorAvatar:
      "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    rating: 4,
    comment:
      "Professional and organized project owner. Good communication throughout the project lifecycle.",
    projectName: "Education City Library Extension",
    date: "2023-12-28",
    tags: ["Responsive", "Organized"],
  },
  {
    id: "5",
    contractorName: "Khalid Al-Attiyah",
    contractorAvatar:
      "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    rating: 3,
    comment:
      "Decent working relationship. Some communication gaps during the project but issues were resolved satisfactorily.",
    projectName: "West Bay Office Tower",
    date: "2023-12-20",
    tags: ["Fair", "Resolves Issues"],
  },
  {
    id: "6",
    contractorName: "Noor Al-Sulaiti",
    contractorAvatar:
      "https://images.pexels.com/photos/3586798/pexels-photo-3586798.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    rating: 5,
    comment:
      "Excellent project owner with clear vision and excellent project coordination. Fast payment processing and great support.",
    projectName: "Hamad International Airport Terminal",
    date: "2023-12-15",
    tags: ["Visionary", "Supportive", "Paid Quickly"],
  },
];

const mockReviewsGiven: ReviewGiven[] = [
  {
    id: "g1",
    projectOwnerName: "Omar Al-Rashid",
    projectOwnerAvatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    rating: 5,
    comment:
      "Excellent contractor with outstanding technical skills. Delivered the project ahead of schedule with exceptional quality. Highly professional and communicative throughout.",
    projectName: "Smart City Infrastructure",
    date: "2024-01-20",
    tags: ["Skilled", "On-time", "Quality Work"],
  },
  {
    id: "g2",
    projectOwnerName: "Layla Al-Zahra",
    projectOwnerAvatar:
      "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    rating: 4,
    comment:
      "Good contractor with solid technical abilities. Minor communication delays but delivered quality work within budget.",
    projectName: "Residential Complex Development",
    date: "2024-01-12",
    tags: ["Reliable", "Budget-friendly"],
  },
  {
    id: "g3",
    projectOwnerName: "Hassan Al-Mahmoud",
    projectOwnerAvatar:
      "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    rating: 5,
    comment:
      "Outstanding contractor! Innovative solutions, excellent project management, and superior craftsmanship. Would definitely hire again.",
    projectName: "Cultural Center Renovation",
    date: "2024-01-08",
    tags: ["Innovative", "Professional", "High Quality"],
  },
];

const mockAnalytics: AnalyticsSummary = {
  averageRating: 4.3,
  totalReviews: 6,
  fiveStarPercentage: 50,
  mostFrequentTag: "Professional",
};

const mockAnalyticsGiven: AnalyticsSummary = {
  averageRating: 4.7,
  totalReviews: 3,
  fiveStarPercentage: 67,
  mostFrequentTag: "Professional",
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

  const [reviewsGiven, setReviewsGiven] =
    useState<ReviewGiven[]>(mockReviewsGiven);

  const filteredReviews = useMemo(() => {
    return mockReviews.filter((review) => {
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
  }, [searchTerm, ratingFilter]);

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
  }, [searchTerm, ratingFilter, reviewsGiven]);

  const handleReviewUpdate = (updatedReview: ReviewGiven) => {
    setReviewsGiven((prev) =>
      prev.map((review) =>
        review.id === updatedReview.id ? updatedReview : review
      )
    );
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

  return (
    <div className="min-h-screen bg-gray-50 container mx-auto px-0 py-8 ">
      <div className="mx-auto space-y-8">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnalyticsCard
            title="Average Rating"
            value={mockAnalytics.averageRating.toFixed(1)}
            icon={<TrendingUp className="w-4 h-4" />}
            description="Out of 5 stars"
          />
          <AnalyticsCard
            title="Total Reviews"
            value={mockAnalytics.totalReviews}
            icon={<MessageSquare className="w-4 h-4" />}
            description="From completed projects"
          />
          <AnalyticsCard
            title="5-Star Reviews"
            value={`${mockAnalytics.fiveStarPercentage}%`}
            icon={<Award className="w-4 h-4" />}
            description="Excellent ratings"
          />
          <AnalyticsCard
            title="Top Quality"
            value={mockAnalytics.mostFrequentTag}
            icon={<Clock className="w-4 h-4" />}
            description="Most mentioned attribute"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="received">Reviews Received</TabsTrigger>
            <TabsTrigger value="given">Reviews Given by Me</TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="space-y-8">
            {/* Filters */}
            <div className="rounded-lg">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by contractor name, project, or review content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-gray-500"
                  />
                </div>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="w-full sm:w-48 border-gray-300">
                    <SelectValue placeholder="Filter by rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
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
                    placeholder="Search by project owner name, project, or review content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-gray-500"
                  />
                </div>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="w-full sm:w-48 border-gray-300">
                    <SelectValue placeholder="Filter by rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
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

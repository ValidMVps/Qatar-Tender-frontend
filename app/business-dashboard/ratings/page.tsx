"use client";

import type React from "react";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// TypeScript Interfaces
interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar?: string;
  reviewedName: string; // The name of the entity being reviewed
  reviewedAvatar?: string; // Avatar of the entity being reviewed
  rating: number;
  comment: string;
  projectName: string;
  date: string;
  tags: string[];
  type: "received" | "given"; // Indicates if this review was received by the dashboard user or given by them
}

interface AnalyticsSummary {
  averageRating: number;
  totalReviews: number;
  fiveStarPercentage: number;
  mostFrequentTag: string;
}

// Mock Data
// Assuming the business using the dashboard is "Acme Solutions"
const mockReviewsReceived: Review[] = [
  {
    id: "1",
    reviewerName: "Ahmed Al-Mansouri",
    reviewerAvatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    reviewedName: "Acme Solutions (as Project Owner)", // Business reviewed as Project Owner
    reviewedAvatar: "/placeholder.svg?height=150&width=150",
    rating: 5,
    comment:
      "Exceptional project owner. Clear communication, prompt payments, and realistic deadlines. Would definitely work with them again on future projects.",
    projectName: "Qatar National Museum Renovation",
    date: "2024-01-15",
    tags: ["Responsive", "Professional", "Paid Quickly"],
    type: "received",
  },
  {
    id: "2",
    reviewerName: "Fatima Al-Thani",
    reviewerAvatar:
      "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    reviewedName: "Acme Solutions (as Project Owner)",
    reviewedAvatar: "/placeholder.svg?height=150&width=150",
    rating: 4,
    comment:
      "Great collaboration on the infrastructure project. Minor delays in feedback but overall a smooth working relationship.",
    projectName: "Doha Metro Station Upgrades",
    date: "2024-01-10",
    tags: ["Professional", "Detail-oriented"],
    type: "received",
  },
  {
    id: "3",
    reviewerName: "Mohammad Al-Kuwari",
    reviewerAvatar:
      "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    reviewedName: "Acme Solutions (as Contractor)", // Business reviewed as Contractor
    reviewedAvatar: "/placeholder.svg?height=150&width=150",
    rating: 5,
    comment:
      "Outstanding contractor. Delivered ahead of schedule and exceeded expectations. Highly recommend.",
    projectName: "Lusail City Commercial Complex",
    date: "2024-01-05",
    tags: ["On-time", "High Quality", "Clear Communication"],
    type: "received",
  },
  {
    id: "4",
    reviewerName: "Sarah Al-Dosari",
    reviewerAvatar:
      "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    reviewedName: "Acme Solutions (as Project Owner)",
    reviewedAvatar: "/placeholder.svg?height=150&width=150",
    rating: 4,
    comment:
      "Professional and organized project owner. Good communication throughout the project lifecycle.",
    projectName: "Education City Library Extension",
    date: "2023-12-28",
    tags: ["Responsive", "Organized"],
    type: "received",
  },
  {
    id: "5",
    reviewerName: "Khalid Al-Attiyah",
    reviewerAvatar:
      "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    reviewedName: "Acme Solutions (as Contractor)",
    reviewedAvatar: "/placeholder.svg?height=150&width=150",
    rating: 3,
    comment:
      "Decent working relationship. Some communication gaps during the project but issues were resolved satisfactorily.",
    projectName: "West Bay Office Tower",
    date: "2023-12-20",
    tags: ["Fair", "Resolves Issues"],
    type: "received",
  },
  {
    id: "6",
    reviewerName: "Noor Al-Sulaiti",
    reviewerAvatar:
      "https://images.pexels.com/photos/3586798/pexels-photo-3586798.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    reviewedName: "Acme Solutions (as Project Owner)",
    reviewedAvatar: "/placeholder.svg?height=150&width=150",
    rating: 5,
    comment:
      "Excellent project owner with clear vision and excellent project coordination. Fast payment processing and great support.",
    projectName: "Hamad International Airport Terminal",
    date: "2023-12-15",
    tags: ["Visionary", "Supportive", "Paid Quickly"],
    type: "received",
  },
];

const mockReviewsGiven: Review[] = [
  {
    id: "g1",
    reviewerName: "Acme Solutions",
    reviewerAvatar: "/placeholder.svg?height=150&width=150",
    reviewedName: "Global Builders Inc.",
    reviewedAvatar:
      "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    rating: 5,
    comment:
      "Global Builders delivered an exceptional outcome for our office fit-out project. Their team was highly skilled, efficient, and maintained excellent communication throughout. Highly recommended for complex commercial projects.",
    projectName: "New Office Fit-Out",
    date: "2024-02-01",
    tags: ["High Quality", "Efficient", "Great Communication"],
    type: "given",
  },
  {
    id: "g2",
    reviewerName: "Acme Solutions",
    reviewerAvatar: "/placeholder.svg?height=150&width=150",
    reviewedName: "Tech Innovators LLC",
    reviewedAvatar:
      "https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    rating: 4,
    comment:
      "Tech Innovators provided solid IT infrastructure support. There were minor delays in initial setup, but their problem-solving once engaged was excellent. A reliable partner for tech solutions.",
    projectName: "IT Infrastructure Upgrade",
    date: "2024-01-25",
    tags: ["Reliable", "Problem Solver"],
    type: "given",
  },
  {
    id: "g3",
    reviewerName: "Acme Solutions",
    reviewerAvatar: "/placeholder.svg?height=150&width=150",
    reviewedName: "Creative Designs Co.",
    reviewedAvatar:
      "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    rating: 3,
    comment:
      "Creative Designs delivered the branding assets as requested. The initial concepts required significant revisions, but they were responsive to feedback. Good for basic design needs.",
    projectName: "Brand Identity Development",
    date: "2024-01-18",
    tags: ["Responsive", "Flexible"],
    type: "given",
  },
];

// Helper function to calculate analytics
const calculateAnalytics = (reviews: Review[]): AnalyticsSummary => {
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      fiveStarPercentage: 0,
      mostFrequentTag: "N/A",
    };
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  const fiveStarReviews = reviews.filter(
    (review) => review.rating === 5
  ).length;
  const fiveStarPercentage = (fiveStarReviews / reviews.length) * 100;

  const tagCounts: { [key: string]: number } = {};
  reviews.forEach((review) => {
    review.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  let mostFrequentTag = "N/A";
  let maxCount = 0;
  for (const tag in tagCounts) {
    if (tagCounts[tag] > maxCount) {
      maxCount = tagCounts[tag];
      mostFrequentTag = tag;
    }
  }

  return {
    averageRating: Number.parseFloat(averageRating.toFixed(1)),
    totalReviews: reviews.length,
    fiveStarPercentage: Number.parseFloat(fiveStarPercentage.toFixed(1)),
    mostFrequentTag: mostFrequentTag,
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
const ReviewCard: React.FC<{
  review: Review;
  displayMode: "reviewer" | "reviewed";
}> = ({ review, displayMode }) => {
  const nameToDisplay =
    displayMode === "reviewer" ? review.reviewerName : review.reviewedName;
  const avatarToDisplay =
    displayMode === "reviewer" ? review.reviewerAvatar : review.reviewedAvatar;
  const fallbackText = nameToDisplay
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={avatarToDisplay || "/placeholder.svg"}
                alt={nameToDisplay}
              />
              <AvatarFallback className="bg-gray-100 text-gray-600">
                {fallbackText}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{nameToDisplay}</h3>
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
              Project
            </span>
            <p className="text-sm font-medium text-gray-900 mt-1">
              {review.projectName}
            </p>
          </div>
          {review.tags && review.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {review.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Reviews & Ratings Component
const ReviewsRatingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"received" | "given">("received");
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");

  const currentReviews =
    activeTab === "received" ? mockReviewsReceived : mockReviewsGiven;

  const filteredReviews = useMemo(() => {
    return currentReviews.filter((review) => {
      const nameToSearch =
        activeTab === "received" ? review.reviewerName : review.reviewedName;
      const matchesSearch =
        nameToSearch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating =
        ratingFilter === "all" ||
        review.rating === Number.parseInt(ratingFilter);
      return matchesSearch && matchesRating;
    });
  }, [searchTerm, ratingFilter, currentReviews, activeTab]); // Added activeTab to dependencies [^1]

  const currentAnalytics = useMemo(() => {
    return calculateAnalytics(filteredReviews);
  }, [filteredReviews]); // Added filteredReviews to dependencies [^1]

  const EmptyState = () => (
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
          : activeTab === "received"
          ? "You haven't received any reviews yet. Complete projects or services to start receiving feedback."
          : "You haven't given any reviews yet. Provide feedback on completed projects or services."}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen  container mx-auto px-0 py-4">
      <div className="mx-auto space-y-8">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "received" | "given")}
        >
          <TabsContent value="received" className="space-y-8 mt-3 md:mt-8">
            {/* Analytics Cards for Received Reviews */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <AnalyticsCard
                title="Average Rating"
                value={currentAnalytics.averageRating.toFixed(1)}
                icon={<TrendingUp className="w-4 h-4" />}
                description="Out of 5 stars"
              />
              <AnalyticsCard
                title="Total Reviews"
                value={currentAnalytics.totalReviews}
                icon={<MessageSquare className="w-4 h-4" />}
                description="From completed projects"
              />
              <AnalyticsCard
                title="5-Star Reviews"
                value={`${currentAnalytics.fiveStarPercentage.toFixed(1)}%`}
                icon={<Award className="w-4 h-4" />}
                description="Excellent ratings"
              />
              <AnalyticsCard
                title="Top Quality"
                value={currentAnalytics.mostFrequentTag}
                icon={<Clock className="w-4 h-4" />}
                description="Most mentioned attribute"
              />
            </div>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="received" className=" text-xs">
                Reviews About My Business
              </TabsTrigger>
              <TabsTrigger value="given" className=" text-xs">Reviews I've Given</TabsTrigger>
            </TabsList>

            {/* Filters */}
            <div className="rounded-lg">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by reviewer name, project, or review content..."
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
                  <ReviewCard
                    key={review.id}
                    review={review}
                    displayMode="reviewer"
                  />
                ))
              ) : (
                <EmptyState />
              )}
            </div>
          </TabsContent>

          <TabsContent value="given" className="space-y-8 mt-3 md:mt-8">
            {/* Analytics Cards for Given Reviews (optional, can be similar or different) */}
            <div className="hidden md:grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <AnalyticsCard
                title="Average Rating Given"
                value={currentAnalytics.averageRating.toFixed(1)}
                icon={<TrendingUp className="w-4 h-4" />}
                description="Average rating you've given"
              />
              <AnalyticsCard
                title="Total Reviews Given"
                value={currentAnalytics.totalReviews}
                icon={<MessageSquare className="w-4 h-4" />}
                description="Total reviews you've written"
              />
              <AnalyticsCard
                title="5-Star Reviews Given"
                value={`${currentAnalytics.fiveStarPercentage.toFixed(1)}%`}
                icon={<Award className="w-4 h-4" />}
                description="Percentage of 5-star ratings you've given"
              />
              <AnalyticsCard
                title="Most Common Tag"
                value={currentAnalytics.mostFrequentTag}
                icon={<Clock className="w-4 h-4" />}
                description="Most frequent tag in your reviews"
              />
            </div>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="received" className=" text-xs">
                Reviews About My Business
              </TabsTrigger>
              <TabsTrigger value="given" className=" text-xs">Reviews I've Given</TabsTrigger>
            </TabsList>

            {/* Filters */}
            <div className="rounded-lg">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by reviewed entity, project, or review content..."
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
                  <ReviewCard
                    key={review.id}
                    review={review}
                    displayMode="reviewed"
                  />
                ))
              ) : (
                <EmptyState />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReviewsRatingsPage;

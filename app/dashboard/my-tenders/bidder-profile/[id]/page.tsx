"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Star,
  Calendar,
  Briefcase,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { useTranslation } from "../../../../../lib/hooks/useTranslation";
import { profileApi } from "../../../../services/profileApi";
import {
  getReviewsForUser,
  Review as APIReview,
} from "@/app/services/ReviewService";

// Define TypeScript interfaces
interface Project {
  id: string;
  name: string;
  status: string;
  date: string;
  rating: number;
  reviews: {
    id: string;
    reviewer: string;
    comment: string;
    rating: number;
  }[];
}

interface BidderProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  overallRating: number;
  totalReviews: number;
  completedProjects: number;
  badge: string;
  isVerified: boolean;
  platformRank: number;
  projectHistory: Project[];
}

interface ProfileData {
  _id?: string;
  companyName?: string;
  contactPersonName?: string;
  companyEmail?: string;
  personalEmail?: string;
  phone?: string;
  address?: string;
  companyDesc?: string;
  rating?: number;
  ratingCount?: number;
  completedTenders?: number;
  badge?: string;
  isVerified?: boolean;
  platformRank?: number;
}

export default function BidderProfilePage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const bidderId = params.id as string;

  const [bidder, setBidder] = useState<BidderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBidderProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch profile
        const profileData: ProfileData = await profileApi.getProfileById(
          bidderId
        );

        // Fetch reviews for this user
        const apiReviews: APIReview[] = await getReviewsForUser(bidderId);

        // Simulate project history from reviews
        const simulatedProjects: Project[] = apiReviews.map((review) => ({
          id: review.tender._id,
          name: review.tender.title,
          status: "Completed",
          date: new Date(review.createdAt).toLocaleDateString(),
          rating: review.rating,
          reviews: [
            {
              id: review._id,
              reviewer: review.reviewer.email.split("@")[0],
              comment: review.comment || "No comment provided.",
              rating: review.rating,
            },
          ],
        }));
        console.log("Simulated Projects:", apiReviews);

        // Deduplicate projects by id
        const uniqueProjectsMap = new Map<string, Project>();
        simulatedProjects.forEach((proj) => {
          const existing = uniqueProjectsMap.get(proj.id);
          if (existing) {
            existing.reviews.push(...proj.reviews);
          } else {
            uniqueProjectsMap.set(proj.id, { ...proj });
          }
        });
        const projectHistory = Array.from(uniqueProjectsMap.values());

        // Compute overall rating
        const totalRating = apiReviews.reduce((sum, r) => sum + r.rating, 0);
        const overallRating =
          apiReviews.length > 0
            ? parseFloat((totalRating / apiReviews.length).toFixed(2))
            : 0;

        // Transform API data into BidderProfile
        const transformedData: BidderProfile = {
          id: profileData._id || bidderId,
          name:
            profileData.companyName ||
            profileData.contactPersonName ||
            "Unknown Bidder",
          email:
            profileData.companyEmail ||
            profileData.personalEmail ||
            "Not provided",
          phone: profileData.phone || "Not provided",
          address: profileData.address || "Not provided",
          bio:
            profileData.companyDesc ||
            "This bidder has not provided a description.",
          overallRating: profileData.rating ?? overallRating,
          totalReviews: apiReviews.length,
          completedProjects: projectHistory.length,
          badge: profileData.badge || "bronze",
          isVerified: profileData.isVerified ?? false,
          platformRank: profileData.platformRank || 0,
          projectHistory,
        };

        setBidder(transformedData);
      } catch (err: any) {
        console.error("Error fetching bidder profile:", err);
        setError(err.message || t("failed_to_load_profile"));
      } finally {
        setLoading(false);
      }
    };

    if (bidderId) {
      fetchBidderProfile();
    }
  }, [bidderId, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xs border border-gray-200/50">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-600 text-sm mt-4 font-medium">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error || !bidder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xs border border-gray-200/50 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t("bidder_not_found")}
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {error || t("requested_bidder_profile_not_found")}
          </p>
          <Button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-3 font-semibold shadow-xs transition-all duration-200 transform hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("go_back")}
          </Button>
        </div>
      </div>
    );
  }

  const getBadgeColor = (badge: string) => {
    switch (badge.toLowerCase()) {
      case "gold":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case "silver":
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case "platinum":
        return "bg-gradient-to-r from-purple-400 to-purple-600 text-white";
      default:
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="mx-auto px-4 sm:px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-blue-600 hover:bg-blue-50 rounded-xl font-semibold transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div className=" mx-auto px-4 sm:px-6 py-8">
        {/* Profile Header Card */}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}{" "}
            <div className="backdrop-blur-xl mb-8 overflow-hidden">
              <div className="bg-gradient-to-br  shadow-xs from-blue-50/10 to-blue-10/100 rounded-3xl text-blue-500 border p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold tracking-tight">
                        {bidder.name}
                      </h1>
                      {bidder.isVerified && (
                        <CheckCircle className="h-6 w-6 text-green-400 fill-current" />
                      )}
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 text-yellow-300 fill-current" />
                        <span className="font-semibold text-lg">
                          {bidder.overallRating.toFixed(1)}
                        </span>
                        <span className="text-black/80">
                          ({bidder.totalReviews} reviews)
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-black/80">Completed Projects</div>
                        <div className="text-xl font-bold">
                          {bidder.completedProjects}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xs border border-gray-200/50 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                About
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                {bidder.bio}
              </p>
            </div>
            {/* Projects & Reviews */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xs border border-gray-200/50 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center mr-3">
                  <Briefcase className="w-4 h-4 text-green-600" />
                </div>
                Projects & Reviews
              </h2>

              {bidder.projectHistory.length > 0 ? (
                <div className="space-y-6">
                  {bidder.projectHistory.map((project) => (
                    <div
                      key={project.id}
                      className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30 hover:shadow-xs transition-all duration-200"
                    >
                      {/* Project Header */}
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Briefcase className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 mb-1">
                              {project.name}
                            </h3>
                            <p className="text-gray-500 flex items-center text-sm">
                              <Calendar className="h-4 w-4 mr-2" />
                              {project.date}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {project.status}
                          </div>
                          <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                            <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                            <span className="font-semibold text-yellow-700">
                              {project.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Reviews */}
                      {project.reviews.length > 0 && (
                        <div className="space-y-4">
                          {project.reviews.map((review) => (
                            <div
                              key={review.id}
                              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <span className="font-semibold text-gray-900 text-sm">
                                  {review.reviewer}
                                </span>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                                  <span className="font-semibold text-yellow-700 text-sm">
                                    {review.rating}
                                  </span>
                                </div>
                              </div>
                              <p className="text-gray-700 leading-relaxed">
                                {review.comment}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">
                    {t("no_projects_or_reviews_found")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xs border border-gray-200/50 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-3 h-3 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                Contact
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 border border-gray-200/30">
                  <Mail className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="text-gray-900 font-medium break-all text-sm">
                      {bidder.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 border border-gray-200/30">
                  <Phone className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <p className="text-gray-900 font-medium text-sm">
                      {bidder.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 border border-gray-200/30">
                  <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Address</p>
                    <p className="text-gray-900 font-medium text-sm leading-relaxed">
                      {bidder.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xs border border-gray-200/50 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Quick Stats
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Total Reviews</span>
                  <span className="font-bold text-gray-900">
                    {bidder.totalReviews}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Completed Projects</span>
                  <span className="font-bold text-gray-900">
                    {bidder.completedProjects}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Average Rating</span>
                  <span className="font-bold text-gray-900">
                    {bidder.overallRating}/5
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Verification Status</span>
                  <span
                    className={`font-semibold ${
                      bidder.isVerified ? "text-green-600" : "text-orange-600"
                    }`}
                  >
                    {bidder.isVerified ? "Verified" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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

// Define TypeScript interfaces
interface Review {
  id: string;
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
}

interface Project {
  id: string;
  name: string;
  status: string;
  date: string;
  rating: number;
  reviews: Review[];
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

export default function BidderProfilePage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const bidderId = params.id as string;

  const [bidder, setBidder] = useState<BidderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetching profile for bidderId:", bidderId);
    const fetchBidderProfile = async () => {
      try {
        setLoading(true);
        const profileData = await profileApi.getProfileById(bidderId);

        // ✅ Transform API response to match expected structure
        const transformedData: BidderProfile = {
          id: profileData._id,
          name:
            profileData.companyName ||
            profileData.contactPersonName ||
            "Unknown",
          email: profileData.companyEmail || profileData.personalEmail || "N/A",
          phone: profileData.phone || "N/A",
          address: profileData.address || "N/A",
          bio: profileData.companyDesc || "No company description available",
          overallRating: profileData.rating || 0,
          totalReviews: profileData.ratingCount || 0,
          completedProjects: profileData.completedTenders || 0,
          badge: profileData.badge || "bronze",
          isVerified: profileData.isVerified || false,
          platformRank: profileData.platformRank || 0,
          projectHistory: profileData.projectHistory || [], // might be empty until backend supports it
        };

        setBidder(transformedData);
      } catch (err: any) {
        console.error("Error fetching bidder profile:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (bidderId) {
      fetchBidderProfile();
    }
  }, [bidderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !bidder) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md text-center p-8">
          <h2 className="text-2xl font-bold mb-4">{t("bidder_not_found")}</h2>
          <p className="mb-6">
            {error || t("requested_bidder_profile_not_found")}
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("go_back")}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-1 px-2 md:py-3 md:px-3 space-y-4 md:space-y-6">
      <Card className="border-0 bg-transparent px-0">
        <CardHeader className="p-2 md:p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 pb-3">
            <div>
              <CardTitle className="text-xl md:text-2xl font-semibold pb-1">
                {bidder.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                {bidder.overallRating} ({bidder.totalReviews} {t("reviews")})
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 md:p-6 space-y-6 pt-3">
          {/* About */}
          <section className="break-words">
            <h3 className="text-lg font-semibold mb-2">{t("about")}</h3>
            <p className="text-gray-700">{bidder.bio}</p>
          </section>

          <Separator />

          {/* Contact */}
          <section>
            <h3 className="text-lg font-semibold mb-2">
              {t("contact_information")}
            </h3>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-start md:items-center break-all">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0 mt-1 md:mt-0" />
                {bidder.email}
              </p>
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                {bidder.phone}
              </p>
              <p className="flex items-start md:items-center">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-1 md:mt-0" />
                {bidder.address}
              </p>
            </div>
          </section>

          <Separator />

          {/* Projects & Reviews */}
          <section>
            <h3 className="text-lg font-semibold mb-4">
              {t("projects_and_reviews")}
            </h3>

            <div className="space-y-6">
              {bidder.projectHistory.length > 0 ? (
                bidder.projectHistory.map((project) => (
                  <Card
                    key={project.id}
                    className="p-3 md:p-5 border-0 border-b-1 rounded-none"
                  >
                    {/* Project Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div className="flex items-start gap-3">
                        <Briefcase className="h-5 w-5 text-blue-600 mt-1" />
                        <div>
                          <p className="font-medium text-base">
                            {project.name}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {project.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
                        <Badge>{project.status}</Badge>
                        <span className="flex items-center text-yellow-500 text-sm">
                          {project.rating}
                          <Star className="h-4 w-4 fill-current ml-1" />
                        </span>
                      </div>
                    </div>

                    {/* Reviews */}
                    {project.reviews && project.reviews.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {project.reviews.map((review) => (
                          <div
                            key={review.id}
                            className="bg-gray-50 p-3 rounded-md border border-gray-200"
                          >
                            <p className="text-sm text-gray-700">
                              {review.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  {t("no_projects_found")}
                </p>
              )}
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

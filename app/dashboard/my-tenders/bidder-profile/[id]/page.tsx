"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Star,
  MessageSquare,
  Calendar,
  Briefcase,
} from "lucide-react";

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

// Mock bidder data
const getBidderProfileData = (id: string) => {
  const profiles = {
    "1": {
      id: 1,
      name: "Qatar Construction Co.",
      email: "info@qatarconstruction.com",
      phone: "+974 4412 3456",
      address: "Building 101, Al Corniche St, Doha, Qatar",
      bio: "Leading construction company in Qatar with over 15 years of experience in commercial and residential projects.",
      overallRating: 4.8,
      totalReviews: 120,
      completedProjects: 28,
      badge: "gold",
      isVerified: true,
      platformRank: 5,
      projectHistory: [
        {
          id: 101,
          name: "Luxury Villa Project",
          status: "Completed",
          date: "Dec 2023",
          rating: 5,
          reviews: [
            {
              id: 1,
              reviewer: "Ahmed Al-Thani",
              rating: 5,
              comment:
                "Excellent work, highly professional and delivered on time.",
              date: "Jan 15, 2024",
            },
          ],
        },
        {
          id: 102,
          name: "Commercial Tower Renovation",
          status: "Completed",
          date: "Aug 2023",
          rating: 4,
          reviews: [
            {
              id: 2,
              reviewer: "Fatima Al-Kuwari",
              rating: 4,
              comment: "Good quality, minor delays but overall satisfied.",
              date: "Dec 20, 2023",
            },
          ],
        },
        {
          id: 103,
          name: "Residential Complex Phase 1",
          status: "Completed",
          date: "Mar 2023",
          rating: 5,
          reviews: [
            {
              id: 2,
              reviewer: "Fatima Al-Kuwari",
              rating: 4,
              comment: "Good quality, minor delays but overall satisfied.",
              date: "Dec 20, 2023",
            },
          ],
        },
      ],
    },
  };

  return profiles[id as keyof typeof profiles] || profiles["1"];
};

export default function BidderProfilePage() {
  const params = useParams();
  const router = useRouter();
  const bidderId = params.id as string;
  const bidder = getBidderProfileData(bidderId);

  if (!bidder) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Bidder Not Found</h2>
          <p className="mb-6">
            The requested bidder profile could not be found.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto px-0 py-8">
      <div className="mx-auto space-y-8">
        <Card className="border-0 bg-transparent">
          <CardHeader className="p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gray-100 rounded-md flex items-center justify-center">
                <Building2 className="h-7 w-7 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-semibold pb-1">
                  {bidder.name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  {bidder.overallRating} ({bidder.totalReviews} reviews)
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* About */}
            <section>
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-gray-700">{bidder.bio}</p>
            </section>

            <Separator />

            {/* Contact */}
            <section>
              <h3 className="text-lg font-semibold mb-2">
                Contact Information
              </h3>
              <div className="space-y-2 text-gray-700 px-0">
                <p className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" /> {bidder.email}
                </p>
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" /> {bidder.phone}
                </p>
                <p className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" /> {bidder.address}
                </p>
              </div>
            </section>

            <Separator />

            {/* Projects & Reviews */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Projects & Reviews</h3>

              <div className="space-y-6">
                {bidder.projectHistory.map((project) => (
                  <Card
                    key={project.id}
                    className="p-5 border-0 border-b-1 rounded-none s px-0"
                  >
                    {/* Project Header */}
                    <div className="flex justify-between items-start flex-wrap gap-4">
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

                      <div className="flex items-center gap-3">
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
                ))}
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Star,
  DollarSign,
  MapPin,
  EqualApproximately,
  Save,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ApplyTenderForm } from "@/components/apply-tender-form";

interface Tender {
  id: number;
  postedTime: string;
  isUrgent: boolean; // Still in interface, but won't be displayed
  title: string;
  userVerified: boolean;
  rating: number;
  amountSpent: string;
  location: string;
  jobType: "Hourly" | "Fixed-Price";
  hourlyRate?: string;
  estimatedTime?: string;
  hoursPerWeek?: string;
  budget?: string;
  description: string;
  fullDescription: string;
  category: string;
  proposals: string;
}

interface QuestionAnswer {
  id: number;
  question: string;
  answer: string | null;
  askedBy: string; // Still in interface, but won't be displayed
  askedTime: string;
}

interface ClientReview {
  id: number;
  reviewerName: string;
  rating: number;
  comment: string;
  reviewTime: string;
}

// Mock data for demonstration purposes
const mockTender: Tender = {
  id: 1,
  postedTime: "2 hours ago",
  isUrgent: true, // Value remains, but not used for display
  title: "Develop a Full-Stack E-commerce Platform",
  userVerified: true,
  rating: 4.5,
  amountSpent: "$10k+",
  location: "Remote",
  jobType: "Fixed-Price",
  budget: "$5,000 - $10,000",
  description:
    "We are looking for an experienced developer to build a comprehensive e-commerce platform from scratch...",
  fullDescription:
    "We are seeking a highly skilled full-stack developer or a team to design, develop, and deploy a robust e-commerce platform. The platform should include user authentication, product listings, shopping cart functionality, secure payment gateway integration, order management, and an admin dashboard. Experience with Next.js, Node.js, PostgreSQL, and Stripe API is highly preferred. The project requires a keen eye for UI/UX and a strong understanding of scalable architecture. We expect regular updates and a collaborative approach.",
  category: "Web Development",
  proposals: "15-20",
  estimatedTime: "3-6 months",
};

const mockQuestionsAnswers: QuestionAnswer[] = [
  {
    id: 1,
    question: "What payment gateways are you considering besides Stripe?",
    answer:
      "We are open to other secure payment gateways like PayPal or Square, but Stripe is our primary preference due to its extensive features and ease of integration.",
    askedBy: "DeveloperX",
    askedTime: "1 hour ago",
  },
  {
    id: 2,
    question:
      "Is there an existing design system or brand guidelines to follow?",
    answer: null,
    askedBy: "DesignPro",
    askedTime: "30 minutes ago",
  },
  {
    id: 3,
    question: "What is the expected timeline for the project completion?",
    answer:
      "We are looking to complete the initial MVP within 3 months, with further iterations planned based on user feedback.",
    askedBy: "CodeMaster",
    askedTime: "2 hours ago",
  },
];

const mockClientReviews: ClientReview[] = [
  {
    id: 1,
    reviewerName: "Client A",
    rating: 5,
    comment:
      "Excellent work! The team delivered beyond expectations and was very responsive.",
    reviewTime: "1 month ago",
  },
  {
    id: 2,
    reviewerName: "Client B",
    rating: 4,
    comment:
      "Good communication and quality of work. A few minor delays but overall satisfied.",
    reviewTime: "3 months ago",
  },
  {
    id: 3,
    reviewerName: "Client C",
    rating: 5,
    comment:
      "Highly recommend! Professional and skilled developers. Will definitely work with them again.",
    reviewTime: "6 months ago",
  },
];

export default function TenderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const tender = mockTender; // Using mock data for demonstration

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return (
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className="h-3 w-3 fill-yellow-500 text-yellow-500"
          />
        ))}
        {hasHalfStar && (
          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 opacity-50" />
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />
        ))}
      </div>
    );
  };

  if (!tender) {
    return <div className="container mx-auto py-8">Tender not found.</div>;
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto py-4 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Tender Details */}
          <div className="lg:col-span-3">
            <Card className="mb-8 border-0 px-0">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Posted {tender.postedTime}</span>
                    {/* Removed Urgent badge */}
                  </div>
                  <Link href="/business-dashboard/browse-tenders" passHref>
                    <Button
                      variant="outline"
                      className="text-sm bg-transparent"
                    >
                      Back to Tenders
                    </Button>
                  </Link>
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                  {tender.title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  {tender.userVerified && (
                    <span className="flex items-center text-blue-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      User verified
                    </span>
                  )}
                  {tender.rating > 0 && (
                    <span className="flex items-center">
                      {renderStars(tender.rating)}
                      <span className="ml-1">{tender.rating}</span>
                    </span>
                  )}
                  {tender.amountSpent && (
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {tender.amountSpent} spent
                    </span>
                  )}
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {tender.location}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  {tender.jobType === "Hourly" && (
                    <>
                      {tender.hourlyRate && (
                        <span>Hourly Rate: {tender.hourlyRate}</span>
                      )}
                      {tender.hoursPerWeek && (
                        <span>{tender.hoursPerWeek}</span>
                      )}
                    </>
                  )}
                  {tender.jobType === "Fixed-Price" && tender.budget && (
                    <span className="font-medium">Budget: {tender.budget}</span>
                  )}
                  {tender.estimatedTime && (
                    <span>Estimated Time: {tender.estimatedTime}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 border-blue-200"
                  >
                    {tender.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold text-lg mb-2">Description</h4>
                <p className="text-gray-700 mb-6">{tender.fullDescription}</p>

                {/* Client Reviews Section */}
                <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-4">
                    Client Reviews ({mockClientReviews.length})
                  </h4>
                  {mockClientReviews.length > 0 ? (
                    <div className="space-y-4">
                      {mockClientReviews.map((review) => (
                        <Card key={review.id} className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">
                                {review.reviewerName}
                              </span>
                              <span className="text-sm text-gray-500">
                                • {review.reviewTime}
                              </span>
                            </div>
                            <div className="flex items-center mt-1 sm:mt-0">
                              {renderStars(review.rating)}
                              <span className="ml-1 text-sm font-medium text-gray-700">
                                {review.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">
                      No client reviews available yet.
                    </p>
                  )}
                </div>

                {/* Q&A Section */}
                <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-4">
                    Questions & Answers
                  </h4>
                  <Tabs defaultValue="qa" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="qa">
                        Q&A (
                        {
                          mockQuestionsAnswers.filter((q) => q.answer !== null)
                            .length
                        }
                        )
                      </TabsTrigger>
                      <TabsTrigger value="ask">Ask a Question</TabsTrigger>
                    </TabsList>
                    <TabsContent value="qa" className="mt-4">
                      {mockQuestionsAnswers.filter((q) => q.answer !== null)
                        .length > 0 ? (
                        <div className="space-y-4">
                          {mockQuestionsAnswers
                            .filter((q) => q.answer !== null)
                            .map((qa) => (
                              <Card key={qa.id} className="p-4">
                                <p className="font-medium text-gray-800 mb-1">
                                  Q: {qa.question}
                                </p>
                                <p className="text-sm text-gray-600 mb-2">
                                  {/* Removed Asked by */}
                                  {qa.askedTime}
                                </p>
                                {qa.answer ? (
                                  <p className="text-gray-700">
                                    A: {qa.answer}
                                  </p>
                                ) : (
                                  <p className="text-gray-500 italic">
                                    No answer yet.
                                  </p>
                                )}
                              </Card>
                            ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500">
                          No questions answered yet.
                        </p>
                      )}
                    </TabsContent>
                    <TabsContent value="ask" className="mt-4">
                      <form className="space-y-4">
                        <div>
                          <Label htmlFor="new-question" className="mb-2 block">
                            Your Question
                          </Label>
                          <Textarea
                            id="new-question"
                            placeholder="Type your question here..."
                            rows={4}
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          Submit Question
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Apply to Bid Button */}
          <div className="lg:col-span-1 h-full border-s">
            <Card className="border-0">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Tender Application
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 mb-4">
                  Bids: {tender.proposals}
                </div>
                <div className="flex-col">
                  <Button
                    onClick={() => setShowApplyForm(true)}
                    className="w-full mb-4 rounded-md shadow-none hover:shadow-none"
                  >
                    Apply to Bid
                  </Button>
                  <Button className="w-full  rounded-md" variant={"outline"}>
                    <Save /> Save Tender
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <ApplyTenderForm
        isOpen={showApplyForm}
        onClose={() => setShowApplyForm(false)}
        tenderId={tender.id}
        tenderTitle={tender.title}
      />
    </TooltipProvider>
  );
}

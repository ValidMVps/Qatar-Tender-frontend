"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileText, DollarSign, Calendar, User, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectDetailsSidebarProps
  extends React.ComponentPropsWithoutRef<"div"> {
  selectedProject: {
    title: string;
    description: string;
    budget: string;
    status: string;
    startDate: string;
    awardedTo: string;
    review?: string;
  };
  getStatusColor: (status: string) => string;
  onMarkComplete: () => void;
}

export function ProjectDetailsSidebar({
  selectedProject,
  getStatusColor,
  onMarkComplete,
  className,
  ...props
}: ProjectDetailsSidebarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const openReviewDialog = () => setIsDialogOpen(true);
  const handleSubmitReview = () => {
    onMarkComplete();
    setIsDialogOpen(false);
  };
  return (
    <div
      className={`flex flex-col h-full border-l bg-background overflow-hidden ${className}`}
      {...props}
    >
      <ScrollArea className="h-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6 text-black">
            Project Details
          </h3>
          <Card className="mb-6 bg-transparent px-0 border-0 rounded-lg shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="flex items-center gap-2 text-black">
                <FileText className="w-5 h-5" />
                {selectedProject.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-0">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Description
                </label>
                <p className="text-sm mt-1 text-gray-800">
                  {selectedProject.description}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Budget
                  </label>
                  <p className="text-sm font-semibold mt-1 text-gray-800">
                    {selectedProject.budget}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge
                      variant="secondary"
                      className={getStatusColor(selectedProject.status)}
                    >
                      {selectedProject.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Start Date
                </label>
                <p className="text-sm mt-1 text-gray-800">
                  {selectedProject.startDate}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Awarded To
                </label>
                <p className="text-sm mt-1 text-gray-800">
                  {selectedProject.awardedTo}
                </p>
              </div>
            </CardContent>
          </Card>
          {/* ✅ Review / Complete Button */}
          <div className="space-y-3">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="w-full justify-start rounded-lg bg-black text-white hover:bg-gray-800"
                  variant="default"
                  onClick={openReviewDialog}
                >
                  {selectedProject.review ? "Edit Review" : "Mark as Completed"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Submit Review</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="rating">Rating</Label>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="rating" className="text-right">
                        Rating
                      </Label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "h-6 w-6 cursor-pointer",
                              rating >= star
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            )}
                            onClick={() => setRating(star)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="review">Review</Label>
                    <Textarea
                      id="review"
                      placeholder="Write your feedback..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleSubmitReview}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    Submit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

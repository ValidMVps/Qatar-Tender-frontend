"use client";
import * as React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { useTranslation } from "../lib/hooks/useTranslation";
interface ReviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (rating: number, review: string) => void;
}

export function ReviewDialog({
  isOpen,
  onOpenChange,
  onSubmit,
}: ReviewDialogProps) {
  const [rating, setRating] = React.useState(0);
  const [reviewText, setReviewText] = React.useState("");
  const handleSubmit = () => {
    const { t } = useTranslation();

    onSubmit(rating, reviewText);
    setRating(0);
    setReviewText("");
    onOpenChange(false);
  };
  const { t } = useTranslation();
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate Project Completion</DialogTitle>
          <DialogDescription>
            Please rate the worker and provide a review for the completed
            project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="rating" className="text-right">
              {t("rating")}
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
          <div className="grid gap-2">
            <Label htmlFor="review">{t("review")}</Label>
            <Textarea
              id="review"
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={rating === 0}>
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import Link from "next/link";
import { CheckCircle, Star, DollarSign, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Import Button
import { TooltipProvider } from "@/components/ui/tooltip";

import { useTranslation } from '../lib/hooks/useTranslation';
interface Tender {
  id: number;
  postedTime: string;
  isUrgent: boolean;
  title: string;
  userVerified: boolean; // Changed from paymentVerified
  rating: number; // This is the job poster's rating
  amountSpent: string;
  location: string;
  jobType: "Hourly" | "Fixed-Price";
  hourlyRate?: string;
  estimatedTime?: string;
  hoursPerWeek?: string;
  budget?: string;
  description: string;
  category: string; // Changed from keywords array to single category string
  proposals: string;
}

interface TenderCardProps {
  tender: Tender;
}

export function TenderCard({ tender }: TenderCardProps) {
  const renderStars = (rating: number) => {
      const { t } = useTranslation();

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
const { t } = useTranslation();
  return (
    <TooltipProvider>
      <Card className="border border-gray-200 ">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 text-sm text-gray-500">
                <span>Posted {tender.postedTime}</span>
                {tender.isUrgent && (
                  <Badge
                    variant="destructive"
                    className="bg-red-500/10 text-red-700 border-red-200"
                  >
                    {t('urgent')}
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                {tender.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
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
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                {tender.jobType === "Hourly" && (
                  <>
                    {tender.estimatedTime && (
                      <span>Est. time: {tender.estimatedTime}</span>
                    )}
                    {tender.hoursPerWeek && <span>{tender.hoursPerWeek}</span>}
                  </>
                )}
                <span className="font-medium"> Est. budget: 200 usd</span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-3 mb-3">
                {tender.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 border-blue-200"
                >
                  {tender.category}
                </Badge>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Bids: {tender.proposals}
              </div>
              <Link
                href={`/business-dashboard/tender-details/${tender.id}`}
                passHref
              >
                <Button variant="outline" className="w-full bg-transparent">
                  View Details
                </Button>
              </Link>
            </div>
            {/* Removed ThumbsUp, ThumbsDown, and Heart buttons */}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

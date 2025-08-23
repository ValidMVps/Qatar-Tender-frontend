import Link from "next/link";
import { CheckCircle, Star, DollarSign, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTranslation } from "../lib/hooks/useTranslation";

interface Tender {
  id: number;
  postedTime: string;
  isUrgent: boolean;
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
  category: string;
  proposals: string;
}

interface TenderCardProps {
  tender: Tender;
}

export function TenderCard({ tender }: TenderCardProps) {
  const { t } = useTranslation();

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className="h-3 w-3 fill-gray-800 text-gray-800"
          />
        ))}
        {hasHalfStar && (
          <Star className="h-3 w-3 fill-gray-800 text-gray-800 opacity-50" />
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <div className="col-span-1">
      <TooltipProvider>
        <Card className=" border-gray-200 rounded-md border  shadow-0 hover:shadow-xs transition-all duration-300 bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col">
              {/* Posted time + Urgent */}
              <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                <span>
                  {t("posted")} {tender.postedTime}
                </span>
                {tender.isUrgent && (
                  <Badge className="bg-red-100 text-red-700 border-0 rounded-full px-2 py-0.5 text-xs font-medium">
                    {t("urgent")}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-gray-900 text-xl tracking-tight mb-3">
                {tender.title}
              </h3>

              {/* User + Rating + Spend + Location */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                {tender.userVerified && (
                  <span className="flex items-center text-gray-800">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                    Verified
                  </span>
                )}
                {tender.rating > 0 && (
                  <span className="flex items-center">
                    {renderStars(tender.rating)}
                    <span className="ml-1">{tender.rating.toFixed(1)}</span>
                  </span>
                )}
                {tender.amountSpent && (
                  <span className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                    {tender.amountSpent} spent
                  </span>
                )}
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                  {tender.location}
                </span>
              </div>

              {/* Job details */}
              <div className="flex flex-wrap gap-3 text-sm text-gray-700 mb-3">
                {tender.jobType === "Hourly" && (
                  <>
                    {tender.estimatedTime && (
                      <span>
                        {t("estTime")}: {tender.estimatedTime}
                      </span>
                    )}
                    {tender.hoursPerWeek && <span>{tender.hoursPerWeek}</span>}
                  </>
                )}
                <span className="font-medium text-gray-900">
                  Est. budget: {tender.budget ?? "200 USD"}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-3">
                {tender.description}
              </p>

              {/* Category */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-gray-100 text-gray-800 border-0 rounded-full px-3 py-1 text-xs font-medium">
                  {tender.category}
                </Badge>
              </div>

              {/* Bids */}
              <div className="text-sm text-gray-500 mb-5">
                {t("bids")}:{" "}
                <span className="font-medium text-gray-900">
                  {tender.proposals}
                </span>
              </div>

              {/* CTA */}
              <Link
                href={`/business-dashboard/tender-details/${tender.id}`}
                passHref
              >
                <Button
                  variant="ghost"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium transition-all duration-200"
                >
                  {t("viewDetails")}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>
    </div>
  );
}

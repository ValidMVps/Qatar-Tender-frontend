import { CheckCircle } from "lucide-react";

import { useTranslation } from "../lib/hooks/useTranslation";
interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
}

export function VerifiedBadge({ size = "md" }: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };
  const { t } = useTranslation();
  return (
    <div
      className={`flex items-center space-x-1 bg-green-100 text-green-800 rounded-full border border-green-200 ${sizeClasses[size]}`}
    >
      <CheckCircle className={iconSizes[size]} />
      <span>{t("verified")}</span>
    </div>
  );
}

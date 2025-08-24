// utils/tenderStatus.tsx
import React from "react";
import {
  CheckCircle,
  Award,
  AlertCircle,
  FileText,
  XCircle,
  Check,
} from "lucide-react";
import { UiTender } from "@/types/ui";

export const getStatusColor = (t: UiTender) => {
  if (t.isCompleted) return "bg-purple-100 text-purple-800 border-purple-200";
  if (t.awardedBid) return "bg-green-100 text-green-800 border-green-200";
  switch (t.status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "awarded":
      return "bg-blue-400 text-blue-800 border-blue-200";
    case "closed":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "draft":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getStatusText = (t: UiTender) => {
  if (t.isCompleted) return "Completed";
  if (t.awardedBid) return "Awarded";
  switch (t.status) {
    case "active":
      return "Active";
    case "closed":
      return "Closed";
    case "draft":
      return "Draft";
    case "rejected":
      return "Rejected";
    case "awarded":
      return "Awarded";
    default:
      return "Unknown";
  }
};

export const getStatusIcon = (t: UiTender): React.ReactNode => {
  if (t.isCompleted) return <CheckCircle className="h-4 w-4" />;
  if (t.awardedBid) return <Award className="h-4 w-4" />;
  switch (t.status) {
    case "active":
      return <CheckCircle className="h-4 w-4" />;
    case "closed":
      return <AlertCircle className="h-4 w-4" />;
    case "draft":
      return <FileText className="h-4 w-4" />;
    case "rejected":
      return <XCircle className="h-4 w-4" />;
    case "awarded":
      return <Check className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

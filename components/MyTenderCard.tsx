// components/TenderCard.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  MapPin,
  Mail,
  Eye,
  MoreHorizontal,
  Edit,
  Trash2,
  XCircle,
  AlertTriangle,
  RefreshCcw,
  CheckCircle,
  FileText,
  Award,
  AlertCircle,
  ChevronRightIcon,
} from "lucide-react";
import Link from "next/link";
import EditTenderModal from "@/components/EdittenderModal";
import { useState } from "react";
import {
  getStatusColor,
  getStatusIcon,
  getStatusText,
} from "@/utils/tenderStatus";
import { UiTender } from "@/types/ui";

interface TenderCardProps {
  tender: UiTender;
  onDelete: (id: string) => void;
  onClose: (id: string) => void;
  onReapply: (id: string) => void;
  onUpdate?: (apiTender: any) => void; // <-- parent can supply this to update list
  t: (key: string, params?: any) => string;
}

export default function MyTenderCard({
  tender,
  onDelete,
  onClose,
  onReapply,
  onUpdate,
  t,
}: TenderCardProps) {
  const [openTenderModal, setOpenTenderModal] = useState(false);

  const stopAnd = (e: React.MouseEvent, cb?: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    cb?.();
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-md border border-neutral-300 overflow-hidden shadow-sm">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Link
              href={`/dashboard/tender/${tender.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-lg font-semibold text-gray-900 mb-2 block hover:underline overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {tender.title}
            </Link>

            <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Badge variant="outline">{tender.category}</Badge>
              </div>
              {tender.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{tender.location}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Badge
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${getStatusColor(
                tender
              )}`}
            >
              {getStatusIcon(tender)}
              <span>{getStatusText(tender)}</span>
            </Badge>
          </div>
        </div>

        {/* Description */}
        <p
          className="text-gray-600 text-sm mb-4 overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {tender.description}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 py-6">
          <div className="text-center">
            <p className="text-2xl font-medium text-blue-600">
              {tender.budget.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 font-medium">QAR Budget</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-medium text-blue-600">
              {tender.bidsCount}
            </p>
            <p className="text-xs text-gray-500 font-medium">Bids Received</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-medium text-blue-600">
              {tender.deadlineDate}
            </p>
            <p className="text-xs text-gray-500 font-medium">Deadline</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
              <Eye className="h-4 w-4" />
            </button>
            <button
              className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={(e) => stopAnd(e, () => setOpenTenderModal(true))}
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={(e) => stopAnd(e, () => onDelete(tender.id))}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <Link href={`/dashboard/tender/${tender.id}`}>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-medium">
              <span>View Details</span>
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>

      <EditTenderModal
        open={openTenderModal}
        onOpenChange={setOpenTenderModal}
        tenderId={tender.id}
        onUpdated={(updated) => {
          onUpdate?.(updated);
          setOpenTenderModal(false);
        }}
      />
    </div>
  );
}

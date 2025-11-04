"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Edit,
  Trash2,
  RefreshCcw,
  MapPin,
  ChevronRightIcon,
  ActivitySquare,
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
import { updateTenderStatus } from "@/app/services/tenderService";
import ReopenTenderModal from "./ReopenTenderModal";
import { useAuth } from "@/context/AuthContext";
import useTranslation from "@/lib/hooks/useTranslation";

interface TenderCardProps {
  tender: UiTender;
  onReapply: (id: string) => void;
  onUpdate?: (apiTender: any) => void;
  fetchTenders: () => Promise<void>;
}
export default function MyTenderCard({
  tender,
  onUpdate,
  fetchTenders,
}: TenderCardProps) {
  const [openTenderModal, setOpenTenderModal] = useState(false);

  // Close Tender state
  const [confirmClose, setConfirmClose] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [closeError, setCloseError] = useState<string | null>(null);

  // Reopen Tender state
  const [isReopening, setIsReopening] = useState(false);
  const { t } = useTranslation();
  const stopAnd = (e: React.MouseEvent, cb?: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    cb?.();
  };

  // ✅ Close tender
  const handleCloseTender = async (e: { preventDefault?: () => void } = {}) => {
    e.preventDefault?.();
    try {
      setIsClosing(true);
      const updated = await updateTenderStatus(tender.id, "closed");
      onUpdate?.(updated);
      setConfirmClose(false);
      fetchTenders();
    } catch (err) {
      console.error("Failed to close tender:", err);
      setCloseError("Failed to close tender. Try again.");
    } finally {
      setIsClosing(false);
    }
  };

  const { profile } = useAuth();
  return (
    <>
      <div className="bg-white/80 backdrop-blur-lg rounded-lg sm:rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-5 gap-3">
            <div className="flex-1 min-w-0">
              <Link
                href={
                  profile?.userType == "business"
                    ? `/business-dashboard/tender/${tender.id}`
                    : `/dashboard/tender/${tender.id}`
                }
                onClick={(e) => e.stopPropagation()}
                className="text-lg sm:text-xl font-medium text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors"
              >
                {tender.title}
              </Link>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge
                  variant="secondary"
                  className="rounded-full px-3 py-1 text-xs font-medium"
                >
                  {tender.category}
                </Badge>
                {tender.location && (
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                    <span>{tender.location}</span>
                  </div>
                )}
              </div>
            </div>

            <Badge className="rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium flex items-center gap-1.5 bg-blue-50 text-blue-700">
              {getStatusIcon(tender)}
              <span>{getStatusText(tender)}</span>
            </Badge>
          </div>

          {/* Description */}
          <p
            className="text-gray-700 text-sm sm:text-base leading-relaxed mb-5 sm:mb-6 line-clamp-2"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {tender.description}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4 py-4 sm:py-5 border-t border-b border-gray-100 text-center">
            <div className="py-2">
              <p className="text-base sm:text-lg font-semibold text-gray-900">
                {tender.budget.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                QAR Budget
              </p>
            </div>
            <div className="py-2">
              <p className="text-base sm:text-lg font-semibold text-gray-900">
                {tender.bidCount}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                {t("bids_received")}
              </p>
            </div>
            <div className="py-2">
              <p className="text-base sm:text-lg font-semibold text-gray-900">
                {tender.deadlineDate}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                {t("deadline")}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pt-5">
            <div className="flex items-center gap-2">
              <button className="p-2.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-all">
                <Eye className="h-4 w-4" />
              </button>
              {tender.status !== "draft" && (
                <button
                  className="p-2.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-all"
                  onClick={(e) => stopAnd(e, () => setOpenTenderModal(true))}
                >
                  <Edit className="h-4 w-4" />
                </button>
              )}
              {tender.status === "draft" && (
                <button
                  className="p-2.5 rounded-full bg-green-100 text-gray-700 hover:bg-green-200 active:bg-green-300 transition-all"
                  onClick={(e) => stopAnd(e, () => setIsReopening(true))}
                >
                  <Edit className="h-4 w-4 text-green-400" />
                </button>
              )}
              {tender.status === "active" && tender.bidCount === 0 ? (
                <button
                  className="p-2.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200 transition-all"
                  onClick={(e) => stopAnd(e, () => setConfirmClose(true))}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : tender.status === "closed" ? (
                <button
                  className="p-2.5 rounded-full bg-green-50 text-green-600 hover:bg-green-100 active:bg-green-200 transition-all"
                  onClick={(e) => stopAnd(e, () => setIsReopening(true))}
                >
                  <RefreshCcw className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            <Link
              href={
                profile?.userType == "business"
                  ? `/business-dashboard/tender/${tender.id}`
                  : `/dashboard/tender/${tender.id}`
              }
            >
              <button className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 active:bg-blue-200 transition-all text-sm font-medium w-full sm:w-auto">
                <span>{t("view_details")}</span>
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>

        {/* Modals */}
        <EditTenderModal
          open={openTenderModal}
          onOpenChange={setOpenTenderModal}
          tenderId={tender.id}
          onUpdated={(updated) => {
            onUpdate?.(updated);
            setOpenTenderModal(false);
            fetchTenders();
          }}
        />

        <ReopenTenderModal
          open={isReopening}
          onOpenChange={setIsReopening}
          tenderId={tender.id}
          onUpdated={(updated) => {
            onUpdate?.(updated);
            setIsReopening(false);
            fetchTenders();
          }}
        />

        {/* Confirm Close Dialog */}
        {confirmClose && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm overflow-hidden border border-gray-200">
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t("close_tender")}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to mark this tender as{" "}
                  <b>{t("closed")}</b>?
                </p>

                {closeError && (
                  <p className="text-sm text-red-600 mb-4">{closeError}</p>
                )}
              </div>

              <div className="flex border-t border-gray-200">
                <Button
                  variant="ghost"
                  className="flex-1 py-3 text-gray-700 font-medium"
                  onClick={() => setConfirmClose(false)}
                  disabled={isClosing}
                >
                  {t("cancel")}
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 py-3 font-medium rounded-none"
                  onClick={handleCloseTender}
                  disabled={isClosing}
                >
                  {isClosing ? "Closing..." : "Close"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

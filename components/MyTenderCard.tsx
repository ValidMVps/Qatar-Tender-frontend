// components/TenderCard.tsx
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

interface TenderCardProps {
  tender: UiTender;
  onReapply: (id: string) => void;
  onUpdate?: (apiTender: any) => void;
  t: (key: string, params?: any) => string;
}

export default function MyTenderCard({
  tender,
  onReapply,
  onUpdate,
  t,
}: TenderCardProps) {
  const [openTenderModal, setOpenTenderModal] = useState(false);

  // Close Tender state
  const [confirmClose, setConfirmClose] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [closeError, setCloseError] = useState<string | null>(null);

  // Reopen Tender state
  const [isReopening, setIsReopening] = useState(false);

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
    } catch (err) {
      console.error("Failed to close tender:", err);
      setCloseError("Failed to close tender. Try again.");
    } finally {
      setIsClosing(false);
    }
  };

  // ✅ Reopen tender
  const { profile } = useAuth();
  return (
    <>
      <div className="bg-white/70 backdrop-blur-xl rounded-md border border-neutral-300 overflow-hidden shadow-0">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <Link
                href={
                  profile?.userType == "business"
                    ? `/business-dashboard/tender/${tender.id} `
                    : `/dashboard/tender/${tender.id} `
                }
                onClick={(e) => e.stopPropagation()}
                className="text-lg xl:text-2xl font-semibold text-gray-900 mb-2 block hover:underline overflow-hidden text-ellipsis whitespace-nowrap"
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
            className="text-gray-600 text-md mb-4 overflow-hidden"
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

              {tender.status === "active" ? (
                // Close button
                <button
                  className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                  onClick={(e) => stopAnd(e, () => setConfirmClose(true))}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : tender.status === "closed" ? (
                // Reopen button
                <button
                  className="p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                  onClick={(e) => stopAnd(e, () => setIsReopening(true))}
                >
                  <RefreshCcw className="h-4 w-4" />
                </button>
              ) : null}
            </div>
            <Link
              href={
                profile?.userType == "business"
                  ? `/business-dashboard/tender/${tender.id} `
                  : `/dashboard/tender/${tender.id} `
              }
            >
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-medium">
                <span>View Details</span>
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
        {/* Edit Modal */}
        <EditTenderModal
          open={openTenderModal}
          onOpenChange={setOpenTenderModal}
          tenderId={tender.id}
          onUpdated={(updated) => {
            onUpdate?.(updated);
            setOpenTenderModal(false);
          }}
        />{" "}
        <ReopenTenderModal
          open={isReopening}
          onOpenChange={setIsReopening}
          tenderId={tender.id}
          onUpdated={(updated) => {
            onUpdate?.(updated);
            setIsReopening(false);
          }}
        />
        {/* Confirm Close Dialog */}
        {confirmClose && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
              <h2 className="text-lg font-semibold mb-3">Close Tender</h2>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to mark this tender as <b>Closed</b>?
              </p>

              {closeError && (
                <div className="text-sm text-red-600 mb-3">{closeError}</div>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setConfirmClose(false)}
                  disabled={isClosing}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 text-white hover:bg-red-700"
                  onClick={handleCloseTender}
                  disabled={isClosing}
                >
                  {isClosing ? "Closing..." : "Close Tender"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

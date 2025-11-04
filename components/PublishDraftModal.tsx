// components/PublishDraftModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileText, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface PublishDraftModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draftTitle: string;
}

export default function PublishDraftModal({
  open,
  onOpenChange,
  draftTitle,
}: PublishDraftModalProps) {
  const router = useRouter();

  const handleActivate = () => {
    onOpenChange(false);
    router.push("/business-dashboard/my-tenders");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <DialogTitle className="text-center text-xl">
            Tender Saved as Draft!
          </DialogTitle>
          <DialogDescription className="text-center">
            Your tender <strong>{draftTitle}</strong> has been saved. Make it
            active to receive bids.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-3 sm:justify-center mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Later
          </Button>
          <Button
            onClick={handleActivate}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Activate Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

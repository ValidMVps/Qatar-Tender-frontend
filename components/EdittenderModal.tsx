// components/EdittenderModal.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslation } from "../lib/hooks/useTranslation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getTender, updateTender } from "@/app/services/tenderService";

interface EditTenderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenderId?: string | null;
  onUpdated?: (updatedTender: any) => void; // receives raw API tender
}

const EditTenderModal = ({
  open,
  onOpenChange,
  tenderId,
  onUpdated,
}: EditTenderModalProps) => {
  // Hooks at top level
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    location: "",
    contactEmail: "",
    attachments: null as File | null,
    deadline: "",
  });

  // Fetch existing tender when modal opens (and tenderId provided)
  useEffect(() => {
    let mounted = true;
    const fetchTender = async () => {
      if (!tenderId) {
        // no ID => keep mock or empty form
        setFormData((prev) => ({ ...prev, ...prev })); // no-op
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await getTender(tenderId);
        if (!mounted) return;
        // Map API fields -> form fields (adjust keys if your API differs)
        setFormData({
          title: data.title || "",
          description: data.description || "",
          category: data.category?._id || data.category || "",
          budget: data.estimatedBudget ? String(data.estimatedBudget) : "",
          location: data.location || "",
          contactEmail: data.contactEmail || data.postedBy?.email || "",
          attachments: null,
          deadline: data.deadline
            ? new Date(data.deadline).toISOString().slice(0, 10)
            : "",
        });
      } catch (err: any) {
        console.error("Failed to load tender for edit:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load tender"
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (open) fetchTender();

    return () => {
      mounted = false;
    };
  }, [open, tenderId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { id, value, files } = target;
    if (files && files.length) {
      setFormData((prev) => ({ ...prev, attachments: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!tenderId) {
      setError("Tender id missing");
      return;
    }

    try {
      const payload = new FormData();
      // Only append fields that you want the backend to update.
      if (formData.title) payload.append("title", formData.title);
      if (formData.description)
        payload.append("description", formData.description);
      if (formData.location) payload.append("location", formData.location);
      if (formData.contactEmail)
        payload.append("contactEmail", formData.contactEmail);
      if (formData.budget) payload.append("estimatedBudget", formData.budget);
      if (formData.deadline) payload.append("deadline", formData.deadline);
      // If you have a category update endpoint/support, append it. The server controller didn't update category,
      // so this may be ignored — keep if your backend supports it.
      if (formData.category) payload.append("category", formData.category);

      if (formData.attachments) {
        // backend expects 'image' (create uses image) — send as 'image'
        payload.append("image", formData.attachments);
      }

      // Call service
      const updated = await updateTender(tenderId, payload);

      // notify parent about update (raw API tender)
      onUpdated?.(updated);

      // close modal
      onOpenChange(false);
    } catch (err: any) {
      console.error("Failed to update tender:", err);
      setError(err?.response?.data?.message || err?.message || "Update failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl dark:bg-gray-900/70 border-none">
        {loading ? (
          <div className="p-4">
            <p className="text-muted-foreground">Loading tender...</p>
          </div>
        ) : (
          <div>
            <Card className="w-full border-none shadow-none bg-transparent">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">
                  Edit Tender
                </CardTitle>
                <CardDescription>
                  Update the information for this existing tender.
                </CardDescription>
              </CardHeader>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <CardContent className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Tender Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Construction of New Office Building"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">{t("description")}</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Detailed tender requirements and scope."
                      rows={5}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="category">{t("category")}</Label>
                      <Select
                        value={formData.category}
                        onValueChange={handleSelectChange}
                        required
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="construction">
                            {t("construction")}
                          </SelectItem>
                          <SelectItem value="it-services">
                            IT Services
                          </SelectItem>
                          <SelectItem value="consulting">
                            {t("consulting")}
                          </SelectItem>
                          <SelectItem value="supplies">
                            {t("supplies")}
                          </SelectItem>
                          <SelectItem value="logistics">
                            {t("logistics")}
                          </SelectItem>
                          <SelectItem value="other">{t("other")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="budget">Estimated Budget (QAR)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={formData.budget}
                        onChange={handleChange}
                        placeholder="e.g., 500000"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="location">{t("location")}</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., Doha, Qatar"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      placeholder="contact@example.com"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="attachments">
                      Replace Image (Optional)
                    </Label>
                    <Input
                      id="attachments"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleChange}
                    />
                    <p className="text-sm text-muted-foreground">
                      Max file size: 5MB. Supported formats: JPG, JPEG, PNG.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="deadline">Deadline (optional)</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={handleChange}
                    />
                  </div>
                </CardContent>

                <CardFooter className="justify-end">
           
                  <Button
                    type="submit"
                    className="w-min bg-blue-600 rounded-md text-white"
                  >
                    Save Changes
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditTenderModal;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

import { useTranslation } from "../lib/hooks/useTranslation";
import { createTender } from "@/app/services/tenderService";

// This should be replaced with actual category data from your backend
// Make sure to fetch these from your API
const CATEGORIES = [
  { _id: "68a30ba6a357d6980cb93ee4", name: "Cleaning Services" },
  { _id: "68a30ba6a357d6980cb93ee5", name: "Construction" },
  { _id: "68a30ba6a357d6980cb93ee6", name: "IT Services" },
  { _id: "68a30ba6a357d6980cb93ee7", name: "Consulting" },
  { _id: "68a30ba6a357d6980cb93ee8", name: "Supplies" },
  { _id: "68a30ba6a357d6980cb93ee9", name: "Logistics" },
];

const CreateTenderModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "68a30ba6a357d6980cb93ee4",
    estimatedBudget: "",
    deadline: "",
    location: "",
    contactEmail: "",
    image: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, files } = e.target as HTMLInputElement;
    if (id === "image" && files) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, category: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        contactEmail: formData.contactEmail,
        estimatedBudget: formData.estimatedBudget,
        deadline: new Date(formData.deadline).toISOString(),
      };

      console.log("Submitting tender data:", payload);

      const result = await createTender(payload);
      console.log("Tender created successfully:", result);

      setFormData({
        title: "",
        description: "",
        category: "",
        estimatedBudget: "",
        deadline: "",
        location: "",
        contactEmail: "",
        image: null,
      });

      onOpenChange(false);
      router.refresh();
    } catch (error: any) {
      console.error("Failed to create tender:", error);
      alert(
        error.response?.data?.message ||
          "Failed to create tender. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent className="max-w-4xl dark:bg-gray-900/70 border-none">
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Card className="w-full border-none shadow-none bg-transparent">
                <CardHeader>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <CardTitle className="text-3xl font-bold">
                      {t("create_new_tender")}
                    </CardTitle>
                    <CardDescription>
                      {t(
                        "fill_in_the_details_below_to_post_a_new_tender_on_the_qatar_marketplace"
                      )}
                    </CardDescription>
                  </motion.div>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                  <CardContent className="grid gap-6">
                    {[
                      {
                        id: "title",
                        label: t("tender_title"),
                        component: (
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Need Cleaning Service"
                            required
                          />
                        ),
                      },
                      {
                        id: "description",
                        label: t("description"),
                        component: (
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Detailed tender requirements and scope."
                            rows={5}
                            required
                          />
                        ),
                      },
                    ].map((field, index) => (
                      <motion.div
                        key={field.id}
                        className="grid gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 * (index + 1) }}
                      >
                        <Label htmlFor={field.id}>{field.label}</Label>
                        {field.component}
                      </motion.div>
                    ))}

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <motion.div
                        className="grid gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Label htmlFor="category">{t("category")}</Label>
                        <Select
                          value={formData.category}
                          onValueChange={handleSelectChange}
                          required
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder={t("select_a_category")} />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((category) => (
                              <SelectItem
                                key={category._id}
                                value={category._id}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div
                        className="grid gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                      >
                        <Label htmlFor="estimatedBudget">
                          {t("estimated_budget_qar")}
                        </Label>
                        <Input
                          id="estimatedBudget"
                          type="number"
                          value={formData.estimatedBudget}
                          onChange={handleChange}
                          placeholder="e.g., 1500"
                          min="0"
                          step="0.01"
                          required
                        />
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <motion.div
                        className="grid gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.52 }}
                      >
                        <Label htmlFor="deadline">{t("deadline")}</Label>
                        <Input
                          id="deadline"
                          type="datetime-local"
                          value={formData.deadline}
                          onChange={handleChange}
                          required
                        />
                      </motion.div>

                      <motion.div
                        className="grid gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55 }}
                      >
                        <Label htmlFor="location">{t("location")}</Label>
                        <Input
                          id="location"
                          type="text"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="e.g., West Bay, Doha, Qatar"
                          required
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      className="grid gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Label htmlFor="contactEmail">{t("contact_email")}</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        placeholder="contact@example.com"
                        required
                      />
                    </motion.div>

                    <motion.div
                      className="grid gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.65 }}
                    >
                      <Label htmlFor="image">
                        {t("upload_image_optional")}
                      </Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleChange}
                      />
                      <p className="text-sm text-muted-foreground">
                        {t("max_file_size_5mb_supported_formats_jpg_jpeg_png")}
                      </p>
                    </motion.div>
                  </CardContent>

                  <CardFooter className="justify-end">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Button
                        type="submit"
                        className="w-min bg-blue-600 rounded-md text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? t("posting") : t("post_tender")}
                      </Button>
                    </motion.div>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default CreateTenderModal;

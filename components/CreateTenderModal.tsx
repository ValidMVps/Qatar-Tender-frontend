"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const CreateTenderModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    location: "",
    contactEmail: "",
    attachments: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, files } = e.target as HTMLInputElement;
    if (files) {
      setFormData({ ...formData, attachments: files[0] });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, category: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) payload.append(key, value as string | Blob);
    });

    console.log("Submitting:", Object.fromEntries(payload.entries()));
    router.push("/tenders");
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
                      Create New Tender
                    </CardTitle>
                    <CardDescription>
                      Fill in the details below to post a new tender on the
                      Qatar marketplace.
                    </CardDescription>
                  </motion.div>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                  <CardContent className="grid gap-6">
                    {[
                      {
                        id: "title",
                        label: "Tender Title",
                        component: (
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Construction of New Office Building"
                            required
                          />
                        ),
                      },
                      {
                        id: "description",
                        label: "Description",
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
                        <Label htmlFor="category">Category</Label>
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
                              Construction
                            </SelectItem>
                            <SelectItem value="it-services">
                              IT Services
                            </SelectItem>
                            <SelectItem value="consulting">
                              Consulting
                            </SelectItem>
                            <SelectItem value="supplies">Supplies</SelectItem>
                            <SelectItem value="logistics">Logistics</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div
                        className="grid gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                      >
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
                      </motion.div>
                    </div>

                    {[
                      {
                        id: "location",
                        label: "Location",
                        placeholder: "e.g., Doha, Qatar",
                        type: "text",
                        value: formData.location,
                      },
                      {
                        id: "contactEmail",
                        label: "Contact Email",
                        placeholder: "contact@example.com",
                        type: "email",
                        value: formData.contactEmail,
                      },
                    ].map((field, index) => (
                      <motion.div
                        key={field.id}
                        className="grid gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                      >
                        <Label htmlFor={field.id}>{field.label}</Label>
                        <Input
                          id={field.id}
                          type={field.type}
                          value={field.value}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          required
                        />
                      </motion.div>
                    ))}

                    <motion.div
                      className="grid gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Label htmlFor="attachments">
                        Upload Image (Optional)
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
                    </motion.div>
                  </CardContent>

                  <CardFooter className="justify-end">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.65 }}
                    >
                      <Button
                        type="submit"
                        className="w-min bg-blue-600 rounded-md text-white"
                      >
                        Post Tender
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

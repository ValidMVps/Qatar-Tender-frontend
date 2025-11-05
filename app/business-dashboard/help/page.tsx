"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "../../../lib/hooks/useTranslation";
import PageTransitionWrapper from "@/components/animations/PageTransitionWrapper";
import { useAuth } from "@/context/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";

export default function HelpPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    user: {},
  });

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleCaptcha = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    if (!captchaToken) {
      setStatus("error");
      alert("Please complete the CAPTCHA verification.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, captchaToken }),
      });

      const data = await res.json();
      console.log("📩 Response:", data);

      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", message: "", user: {} });
        setCaptchaToken(null);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransitionWrapper>
      <div className="container py-1 px-2 md:py-8 md:px-12">
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-10">
            {/* FAQ Section */}
            <div className="space-y-4 order-2 md:order-1">
              <h3 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 md:mb-6">
                {t("frequently_asked_questions")}
              </h3>
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    title: t("how_do_i_post_a_new_tender"),
                    content: t("how_do_i_post_a_new_tender_content"),
                  },
                  {
                    title: t("how_can_i_track_my_tenders_progress"),
                    content: t("how_can_i_track_my_tenders_progress_content"),
                  },
                  {
                    title: t("what_if_i_need_to_modify_a_tender_after_posting"),
                    content: t(
                      "what_if_i_need_to_modify_a_tender_after_posting_content"
                    ),
                  },
                  {
                    title: t("how_do_i_contact_a_service_provider"),
                    content: t("how_do_i_contact_a_service_provider_content"),
                  },
                  {
                    title: t("can_i_cancel_a_tender"),
                    content: t("can_i_cancel_a_tender_content"),
                  },
                  {
                    title: t("is_there_a_fee_to_post_tenders"),
                    content: t("is_there_a_fee_to_post_tenders_content"),
                  },
                  {
                    title: t("how_do_i_report_an_issue_with_a_provider"),
                    content: t(
                      "how_do_i_report_an_issue_with_a_provider_content"
                    ),
                  },
                ].map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index + 1}`}
                    className="border-b py-1 md:py-2 px-0"
                  >
                    <AccordionTrigger className="bg- dark:bg-neutral-900 px-1 md:px-4 py-3 text-xs md:text-base font-medium text-left dark:hover:bg-neutral-800 transition-colors duration-200">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 text-gray-700 dark:text-gray-300">
                      {item.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Contact Form + Info */}
            <div className="flex flex-col md:gap-6 gap-4 order-2">
              <Card className="rounded-md border-0 md:border-1 md:border-neutral-200/70 h-min">
                <CardHeader className="px-0 md:px-6">
                  <CardTitle className="text-lg font-semibold">
                    {t("send_us_a_message")}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5 px-0 md:px-7">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <Label htmlFor="name">{t("your_name")}</Label>
                      <Input
                        id="name"
                        placeholder={t("john_doe")}
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">{t("your_email")}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t("john_doe@example_com")}
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        type="text"
                        id="_honeypot"
                        name="_honeypot"
                        className="hidden"
                        value=""
                        readOnly
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">{t("message")}</Label>
                      <Textarea
                        id="message"
                        rows={5}
                        placeholder={t("type_your_message_here")}
                        value={form.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* ✅ reCAPTCHA */}
                    <div className="flex justify-center">
                      <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                        onChange={handleCaptcha}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 text-white rounded-sm"
                      disabled={loading || !captchaToken}
                    >
                      {loading ? t("sending") : t("send_message")}
                    </Button>

                    {status === "success" && (
                      <p className="text-green-600 text-sm text-center">
                        ✅ {t("message_sent_successfully")}
                      </p>
                    )}
                    {status === "error" && (
                      <p className="text-red-600 text-sm text-center">
                        ❌ {t("failed_to_send_message")}
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="rounded-md border-neutral-200/70">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {t("reach_us_directly")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      support@GoTenderly.qa
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      +974 4455 6677
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {t("doha_qatar")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </PageTransitionWrapper>
  );
}

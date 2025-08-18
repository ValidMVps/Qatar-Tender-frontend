"use client";

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

export default function HelpPage() {
  const { t } = useTranslation();

  return (
    <div className="container py-1 px-2 md:py-3 md:px-3">
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-10">
          {/* FAQ Section */}
          <div className="space-y-4 order-2 md:order-1">
            <div>
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
                <div>
                  <Label htmlFor="name" className="mb-1">
                    {t("your_name")}
                  </Label>
                  <Input id="name" placeholder={t("john_doe")} />
                </div>
                <div>
                  <Label htmlFor="email" className="mb-1">
                    {t("your_email")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("john_doe@example_com")}
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="mb-1">
                    {t("message")}
                  </Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder={t("type_your_message_here")}
                  />
                </div>
                <Button className="w-full bg-blue-600 text-white rounded-sm">
                  {t("send_message")}
                </Button>
              </CardContent>
            </Card>

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
                    support@tenderhub.qa
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
  );
}

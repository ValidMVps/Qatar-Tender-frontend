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

import { useTranslation } from '../../../lib/hooks/useTranslation';
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
                Frequently Asked Questions
              </h3>
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    title: "How do I post a new tender?",
                    content:
                      'To post a new tender, go to "Dashboard" and click "Post Tender". Fill in all required details like description, budget, and deadline.',
                  },
                  {
                    title: "How can I track my tender's progress?",
                    content:
                      'Go to "My Tenders" from the sidebar. You can view status, submitted bids, and project milestones.',
                  },
                  {
                    title: "What if I need to modify a tender after posting?",
                    content:
                      'In "My Tenders", select the tender and click "Edit". Major changes may need re-approval or notify bidders.',
                  },
                  {
                    title: "How do I contact a service provider?",
                    content:
                      'After submitting or awarding a bid, use the "Chats" section from the sidebar to message providers directly.',
                  },
                  {
                    title: "Can I cancel a tender?",
                    content:
                      "Yes, go to 'My Tenders', select the tender, and click 'Cancel'. All active bidders will be notified.",
                  },
                  {
                    title: "Is there a fee to post tenders?",
                    content:
                      "No, posting tenders is currently free. Fees may apply later for featured listings or premium tools.",
                  },
                  {
                    title: "How do I report an issue with a provider?",
                    content:
                      "Go to the provider’s profile and click 'Report'. You can also reach out to support directly.",
                  },
                ].map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index + 1}`}
                    className="border-b py-1 md:py-2 px-0"
                  >
                    <AccordionTrigger className="bg- dark:bg-neutral-900 px-1 md:px-4 py-3 text-xs md:text-base font-medium text-left  dark:hover:bg-neutral-800 transition-colors duration-200">
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
                  Send us a message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5  px-0 md:px-7">
                <div>
                  <Label htmlFor="name" className="mb-1">
                    Your Name
                  </Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div>
                  <Label htmlFor="email" className="mb-1">
                    Your Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="mb-1">
                    {t('message')}
                  </Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder="Type your message here..."
                  />
                </div>
                <Button className="w-full bg-blue-600 text-white rounded-sm">
                  Send Message
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-md border-neutral-200/70">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Reach us directly
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
                    Doha, Qatar
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

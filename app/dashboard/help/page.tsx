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

export default function HelpPage() {
  return (
    <div className=" mx-auto px-4 md:px-6 lg:px-8 py-8">
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* FAQ Section */}
          <div className="space-y-10">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Frequently Asked Questions
              </h3>
              <Accordion type="single" collapsible className="w-full border-t">
                <AccordionItem value="item-1" className="border-b">
                  <AccordionTrigger className="px-4 py-3 text-base font-medium text-left">
                    How do I post a new tender?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-gray-700 dark:text-gray-300">
                    To post a new tender, navigate to the "Dashboard" and click
                    on the "Post Tender" button. Fill in all the required
                    details about your project, including description, budget,
                    and deadline. Once submitted, it will be visible to service
                    providers.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-b">
                  <AccordionTrigger className="px-4 py-3 text-base font-medium text-left">
                    How can I track my tender's progress?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-gray-700 dark:text-gray-300">
                    You can track the progress of your tenders by going to "My
                    Tenders" from the sidebar. Here, you'll see the status of
                    each tender, including submitted bids and project
                    milestones.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-b">
                  <AccordionTrigger className="px-4 py-3 text-base font-medium text-left">
                    What if I need to modify a tender after posting?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-gray-700 dark:text-gray-300">
                    If you need to modify a tender, go to "My Tenders," select
                    the tender you wish to edit, and look for the "Edit" option.
                    Please note that significant changes might require
                    re-approval or notification to bidders.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="px-4 py-3 text-base font-medium text-left">
                    How do I contact a service provider?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-gray-700 dark:text-gray-300">
                    Once a bid is submitted or a project is awarded, you can
                    communicate with service providers directly through the
                    built-in chat system. Access "Chats" from your sidebar to
                    view all your conversations.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          {/* Contact Form */}
          <div className="flex flex-col gap-6">
            <Card className="rounded-md border-neutral-200/70 h-min">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Send us a message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
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
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder="Type your message here..."
                  />
                </div>
                <Button className="w-full bg-neutral-900 text-white rounded-sm">
                  Send Message
                </Button>
              </CardContent>
            </Card>{" "}
            <Card className="rounded-md border-neutral-200/70 ">
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

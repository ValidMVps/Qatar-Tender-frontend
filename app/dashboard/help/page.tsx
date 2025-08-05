"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>

      {/* FAQ Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <Card className="mb-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:no-underline">
                How do I post a new tender?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                To post a new tender, navigate to the "Dashboard" and click on the "Post Tender" button. Fill in all the
                required details about your project, including description, budget, and deadline. Once submitted, it
                will be visible to service providers.
              </AccordionContent>
            </AccordionItem>
          </Card>

          <Card className="mb-4">
            <AccordionItem value="item-2">
              <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:no-underline">
                How can I track my tender's progress?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                You can track the progress of your tenders by going to "My Tenders" from the sidebar. Here, you'll see
                the status of each tender, including submitted bids and project milestones.
              </AccordionContent>
            </AccordionItem>
          </Card>

          <Card className="mb-4">
            <AccordionItem value="item-3">
              <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:no-underline">
                What if I need to modify a tender after posting?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                If you need to modify a tender, go to "My Tenders," select the tender you wish to edit, and look for the
                "Edit" option. Please note that significant changes might require re-approval or notification to
                bidders.
              </AccordionContent>
            </AccordionItem>
          </Card>

          <Card className="mb-4">
            <AccordionItem value="item-4">
              <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:no-underline">
                How do I contact a service provider?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700">
                Once a bid is submitted or a project is awarded, you can communicate with service providers directly
                through the built-in chat system. Access "Chats" from your sidebar to view all your conversations.
              </AccordionContent>
            </AccordionItem>
          </Card>
        </Accordion>
      </section>

      {/* Contact Us Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Send us a message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email
                </label>
                <Input id="email" type="email" placeholder="john.doe@example.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <Textarea id="message" rows={5} placeholder="Type your message here..." />
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Send Message</Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reach us directly</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">support@tenderhub.qa</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">+974 4455 6677</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">Doha, Qatar</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Operating Hours</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <p>Sunday - Thursday: 8:00 AM - 5:00 PM</p>
                <p>Friday - Saturday: Closed</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

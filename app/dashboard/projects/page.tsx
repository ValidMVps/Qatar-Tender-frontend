"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  SidebarContent, // Still useful for scrollable content within the new div structure
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"; // Keep imports for other sidebar components if used elsewhere
import {
  Send,
  Download,
  Edit,
  CheckCircle,
  X,
  Calendar,
  DollarSign,
  User,
  FileText,
} from "lucide-react";

// Mock data
const projects = [
  {
    id: 1,
    title: "Office Renovation",
    status: "In Progress",
    contractor: "Doha Elite Construction",
    description:
      "Complete renovation of the main office space including flooring, lighting, and furniture.",
    budget: "$45,000",
    startDate: "2024-01-15",
    endDate: "2024-03-30",
    awardedTo: "Doha Elite Construction",
  },
  {
    id: 2,
    title: "Kitchen Remodel",
    status: "Completed",
    contractor: "Modern Builders Co",
    description:
      "Full kitchen renovation with new appliances and custom cabinetry.",
    budget: "$32,000",
    startDate: "2023-11-01",
    endDate: "2024-01-10",
    awardedTo: "Modern Builders Co",
  },
  {
    id: 3,
    title: "Bathroom Upgrade",
    status: "In Progress",
    contractor: "Premium Contractors",
    description:
      "Master bathroom renovation with luxury fixtures and tile work.",
    budget: "$18,500",
    startDate: "2024-02-01",
    endDate: "2024-04-15",
    awardedTo: "Premium Contractors",
  },
];

const messages = [
  {
    id: 1,
    sender: "contractor",
    content:
      "Good morning! We've completed the flooring installation and are ready to move on to the lighting fixtures.",
    timestamp: "9:30 AM",
  },
  {
    id: 2,
    sender: "user",
    content:
      "That's great news! How long do you estimate the lighting installation will take?",
    timestamp: "9:45 AM",
  },
  {
    id: 3,
    sender: "contractor",
    content:
      "We should have all the lighting completed by end of day tomorrow. The electrical work is progressing smoothly.",
    timestamp: "10:15 AM",
  },
  {
    id: 4,
    sender: "user",
    content:
      "Perfect! Please send me photos of the flooring when you have a chance.",
    timestamp: "10:20 AM",
  },
];

export default function Dashboard() {
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [messageInput, setMessageInput] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-gray-200 text-gray-800";
      case "Completed":
        return "bg-gray-200 text-gray-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Handle message sending logic here
      setMessageInput("");
    }
  };

  return (
    <SidebarProvider>
      <SidebarInset className="flex flex-col lg:flex-row bg-white overflow-hidden">
        {" "}
        {/* Left Column - Projects List */}
        {/* Left Column - Projects List + Extra Content */}
        <div
          className="w-full lg:w-80   overflow-hidden bg-white border-b  lg:border-b-0 lg:border-r border-green-200 flex flex-col"
          style={{ height: "calc(100vh - 70px)" }}
        >
          <div className="p-2"></div>

          {/* 🔍 Optional Search or Filter */}
          <div className="px-4 pb-2">
            <Input placeholder="Search projects..." className="text-sm" />
          </div>

          {/* 🧭 Scrollable Project List */}
          <ScrollArea className="flex-1">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {projects.map((project) => (
                    <SidebarMenuItem key={project.id}>
                      <SidebarMenuButton
                        onClick={() => setSelectedProject(project)}
                        isActive={selectedProject.id === project.id}
                        className="h-auto p-4 flex-col items-start rounded-none hover:bg-gray-100 data-[active=true]:bg-gray-100"
                      >
                        <div className="w-full">
                          <div className="font-medium text-left mb-2 text-black">
                            {project.title}
                          </div>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(project.status)}
                          >
                            {project.status}
                          </Badge>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </ScrollArea>
        </div>
        {/* Middle Column - Chat Window */}
        <div
          className="flex-1 flex flex-col border-r border-gray-200 lg:min-w-0 overflow-hidden"
          style={{ height: "calc(100vh - 70px)" }}
        >
          {/* Chat Header */}
          <div className="border-b border-gray-200 p-4 bg-white">
            <h2 className="text-xl font-semibold mb-2 text-black">
              Chat with {selectedProject.contractor}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-medium">{selectedProject.title}</span>
              <Badge
                variant="secondary"
                className={getStatusColor(selectedProject.status)}
              >
                {selectedProject.status}
              </Badge>
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="flex items-start gap-3 max-w-[70%]">
                    {message.sender === "contractor" && (
                      <Avatar className="w-8 h-8 border border-gray-200">
                        <AvatarFallback className="bg-gray-200 text-gray-800">
                          DC
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <div
                        className={`rounded-lg p-3 ${
                          message.sender === "user"
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        {message.content}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {message.timestamp}
                      </div>
                    </div>
                    {message.sender === "user" && (
                      <Avatar className="w-8 h-8 border border-gray-200">
                        <AvatarFallback className="bg-gray-200 text-gray-800">
                          You
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 border border-gray-300 focus-visible:ring-black"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-black text-white hover:bg-gray-800"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        {/* Right Column - Project Details */}
        <div
          className="w-full lg:w-80 bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col overflow-hidden"
          style={{ height: "calc(100vh - 70px)" }}
        >
          <ScrollArea className="h-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-6 text-black">
                Project Details
              </h3>

              <Card className="mb-6 bg-transparent px-0 border-0 rounded-lg shadow-none">
                <CardHeader className="px-0">
                  <CardTitle className="flex items-center gap-2 text-black">
                    <FileText className="w-5 h-5" />
                    {selectedProject.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-0">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Description
                    </label>
                    <p className="text-sm mt-1 text-gray-800">
                      {selectedProject.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        Budget
                      </label>
                      <p className="text-sm font-semibold mt-1 text-gray-800">
                        {selectedProject.budget}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Status
                      </label>
                      <div className="mt-1">
                        <Badge
                          variant="secondary"
                          className={getStatusColor(selectedProject.status)}
                        >
                          {selectedProject.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Start Date
                    </label>
                    <p className="text-sm mt-1 text-gray-800">
                      {selectedProject.startDate}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Awarded To
                    </label>
                    <p className="text-sm mt-1 text-gray-800">
                      {selectedProject.awardedTo}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button
                  className="w-full justify-start rounded-lg bg-black text-white hover:bg-gray-800"
                  variant="default"
                  disabled={selectedProject.status === "Completed"}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Completed
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

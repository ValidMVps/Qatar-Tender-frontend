import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
function ChatSection() {
  return (
    <div className="flex flex-col h-[100%] pb-5 col-span-7">
      {/* Profile Section */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src="https://bundui-images.netlify.app/avatars/08.png"
              alt="Project Owner"
            />
            <AvatarFallback>PO</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <div className="font-semibold text-lg">Sarah Al-Farsi</div>
            <div className="text-sm text-muted-foreground">Project Lead</div>
          </div>
        </div>

        {/* Right Section */}
        <div className="text-sm text-muted-foreground">
          Apr 10, 2025, 11:45:00 AM
        </div>
      </div>

      {/* Chat Body */}
      {/* Chat Body */}
      {/* Chat Body */}
      <div className="flex flex-1 flex-col overflow-auto p-4 space-y-5">
        {/* Message 1 */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-[#060607]">
              Project Manager
            </span>
            <span className="text-xs text-[#6a7480]">Today at 10:12 AM</span>
          </div>
          <div className="max-w-none text-[#2e3338] text-[15px] leading-relaxed space-y-3">
            <p>
              Complete renovation of the main office space including flooring,
              lighting, and furniture. This project aims to modernize the
              workspace, improve employee comfort, and enhance the overall
              aesthetic of the office environment.
            </p>
            <p>
              The scope includes replacing all existing flooring with new
              eco-friendly materials, upgrading to energy-efficient LED lighting
              systems, and installing ergonomic furniture throughout the office.
              The project is budgeted at{" "}
              <span className="font-semibold text-[#060607]">$45,000</span> and
              is currently{" "}
              <span className="font-semibold text-[#060607]">In Progress</span>.
            </p>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-[#d0d3d6]" />

        {/* Message 2 */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-[#060607]">Contractor</span>
            <span className="text-xs text-[#6a7480]">Today at 10:15 AM</span>
          </div>
          <div className="max-w-none text-[#2e3338] text-[15px] leading-relaxed space-y-3">
            <p>
              Materials for the flooring have been delivered and will be
              installed next week. LED lighting fixtures have been ordered and
              are expected to arrive by the end of this week.
            </p>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-[#d0d3d6]" />

        {/* Message 3 */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-[#060607]">
              Project Manager
            </span>
            <span className="text-xs text-[#6a7480]">Today at 10:18 AM</span>
          </div>
          <div className="max-w-none text-[#2e3338] text-[15px] leading-relaxed space-y-3">
            <p>
              Great! Please share a timeline update once the lighting fixtures
              are installed so we can plan furniture placement accordingly.
            </p>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="relative">
          <Input
            placeholder="Type your message here..."
            className="min-h-[60px] resize-none pr-16"
          />
          <Button size="icon" className="absolute right-3 top-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-send h-4 w-4"
            >
              <path d="m22 2-7 20-4-9-9-4 20-7Z" />
              <path d="M15 7L6 16" />
            </svg>
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatSection;

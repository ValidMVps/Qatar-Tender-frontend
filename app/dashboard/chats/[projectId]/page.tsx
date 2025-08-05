"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, Smile } from "lucide-react"

interface Message {
  id: string
  sender: "user" | "other"
  content: string
  timestamp: string
}

interface ChatPartner {
  id: string
  name: string
  avatar: string
}

const mockChatPartners: Record<string, ChatPartner> = {
  "proj-1": { id: "bidder-1", name: "Sarah Johnson", avatar: "/placeholder-user.jpg" },
  "proj-3": { id: "bidder-3", name: "Fatima Khan", avatar: "/placeholder-user.jpg" },
}

const mockMessages: Record<string, Message[]> = {
  "proj-1": [
    {
      id: "m1",
      sender: "other",
      content: "Hi! I'm ready to start on the website redesign. Do you have any initial thoughts on the color scheme?",
      timestamp: "10:00 AM",
    },
    {
      id: "m2",
      sender: "user",
      content:
        "Great! I was thinking something modern and clean, perhaps with a touch of emerald green to match our brand. What do you think?",
      timestamp: "10:05 AM",
    },
    {
      id: "m3",
      sender: "other",
      content: "Emerald sounds good! I'll put together some mockups for you to review by end of day.",
      timestamp: "10:10 AM",
    },
  ],
  "proj-3": [
    {
      id: "m7",
      sender: "other",
      content:
        "Good morning! I've drafted the initial content for the social media ads. Would you like to review them?",
      timestamp: "Monday 09:00 AM",
    },
    {
      id: "m8",
      sender: "user",
      content: "Yes, please! Send them over. I'm excited to see what you've come up with.",
      timestamp: "Monday 09:05 AM",
    },
  ],
}

export default function ProjectChatPage() {
  const params = useParams()
  const projectId = params.projectId as string

  const [messages, setMessages] = useState<Message[]>(mockMessages[projectId] || [])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const chatPartner = mockChatPartners[projectId]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: `m${messages.length + 1}`,
        sender: "user",
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, newMsg])
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  if (!chatPartner) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-gray-700">Chat not found for this project.</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col">
      <Card className="flex flex-col flex-1 shadow-sm border border-gray-200">
        <CardHeader className="border-b p-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={chatPartner.avatar || "/placeholder.svg"} alt={chatPartner.name} />
              <AvatarFallback>{chatPartner.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {chatPartner.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-4 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-emerald-600 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span
                      className={`block text-xs mt-1 ${message.sender === "user" ? "text-emerald-100" : "text-gray-500"} text-right`}
                    >
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-4 flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-emerald-600">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-emerald-600">
            <Smile className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type your message..."
            className="flex-1 rounded-full h-10 px-4"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button size="icon" onClick={handleSendMessage} className="bg-emerald-600 hover:bg-emerald-700">
            <Send className="h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

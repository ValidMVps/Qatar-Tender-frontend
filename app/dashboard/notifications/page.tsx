"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, Mail, FileText, MessageSquare, Clock, MailOpen } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: string
  read: boolean
  icon: React.ComponentType<{ className?: string }>
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Bid Received",
      message: "You have received a new bid for 'Office Renovation Project'",
      type: "info",
      timestamp: "2 hours ago",
      read: false,
      icon: FileText,
    },
    {
      id: "2",
      title: "Tender Approved",
      message: "Your tender 'IT Infrastructure Setup' has been approved and is now live",
      type: "success",
      timestamp: "5 hours ago",
      read: false,
      icon: Check,
    },
    {
      id: "3",
      title: "New Message",
      message: "Ahmed Al-Rashid sent you a message regarding the construction project",
      type: "info",
      timestamp: "1 day ago",
      read: true,
      icon: MessageSquare,
    },
    {
      id: "4",
      title: "Tender Deadline Approaching",
      message: "Your tender 'Marketing Campaign' will close in 2 days",
      type: "warning",
      timestamp: "2 days ago",
      read: true,
      icon: Clock,
    },
    {
      id: "5",
      title: "Payment Received",
      message: "Payment of QAR 15,000 has been received for completed project",
      type: "success",
      timestamp: "3 days ago",
      read: false,
      icon: Check,
    },
  ])

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAsUnread = (id: string) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: false } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600 bg-green-50"
      case "warning":
        return "text-yellow-600 bg-yellow-50"
      case "error":
        return "text-red-600 bg-red-50"
      default:
        return "text-blue-600 bg-blue-50"
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="h-8 w-8 text-gray-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">
              {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : "All notifications are read"}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            Mark All as Read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => {
          const IconComponent = notification.icon
          return (
            <Card
              key={notification.id}
              className={`transition-all hover:shadow-md ${
                !notification.read ? "border-l-4 border-l-emerald-500 bg-emerald-50/30" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                        {!notification.read && (
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{notification.message}</p>
                      <p className="text-sm text-gray-500">{notification.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!notification.read ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Mark as Read
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsUnread(notification.id)}
                        className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                      >
                        <MailOpen className="h-4 w-4 mr-1" />
                        Mark as Unread
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {notifications.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">You're all caught up! Check back later for new notifications.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

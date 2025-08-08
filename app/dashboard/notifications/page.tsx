"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Check,
  Mail,
  FileText,
  MessageSquare,
  Clock,
  MailOpen,
  X,
  Filter,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  read: boolean;
  icon: React.ComponentType<{ className?: string }>;
  category: "Tender" | "Bid" | "Payment" | "Support";
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Bid Received",
      message: "You received a new bid on 'Office Renovation Project'.",
      type: "info",
      timestamp: "2 hours ago",
      read: false,
      icon: FileText,
      category: "Bid",
    },
    {
      id: "2",
      title: "Tender Approved",
      message: "Your tender 'Website Redesign' has been approved.",
      type: "success",
      timestamp: "4 hours ago",
      read: false,
      icon: Check,
      category: "Tender",
    },
    {
      id: "3",
      title: "Bid Accepted",
      message: "Your bid for 'Mobile App Development' was accepted.",
      type: "success",
      timestamp: "1 day ago",
      read: true,
      icon: Check,
      category: "Bid",
    },
    {
      id: "4",
      title: "Tender Deadline Approaching",
      message: "The tender 'Marketing Campaign' closes in 1 day.",
      type: "warning",
      timestamp: "2 days ago",
      read: true,
      icon: Clock,
      category: "Tender",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAsUnread = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: false } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600 bg-green-50";
      case "warning":
        return "text-yellow-600 bg-yellow-50";
      case "error":
        return "text-red-600 bg-red-50";
      default:
        return "text-blue-600 bg-blue-50";
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory
      ? n.category === filterCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 container mx-auto px-0 py-8">
      <div className="flex items-center gap-4">
        <div className="relative w-full">
          <Input
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <select
          onChange={(e) =>
            setFilterCategory(e.target.value === "" ? null : e.target.value)
          }
          className="border rounded px-3 py-2 text-neutral-950"
        >
          <option value="">All Categories</option>
          <option value="Tender">Tender</option>
          <option value="Bid">Bid</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredNotifications.map((notification) => {
          const IconComponent = notification.icon;
          return (
            <Card
              key={notification.id}
              className={`transition-all  rounded-none bg-transparent ${
                !notification.read
                  ? "border-0 border-b-2 border-blue-200 "
                  : "border-0 border-b border-neutral-200"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-2 rounded-full ${getTypeColor(
                        notification.type
                      )}`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800"
                          >
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-sm text-gray-500">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!notification.read ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
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
          );
        })}
      </div>

      {filteredNotifications.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No notifications
            </h3>
            <p className="text-gray-600">
              You're all caught up! Check back later for new notifications.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

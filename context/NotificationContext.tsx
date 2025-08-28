// contexts/NotificationContext.js
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import socketService from "@/lib/socket";
import { api } from "@/lib/apiClient";
import { useAuth } from "./AuthContext";

interface Notification {
  _id: string;
  user: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedTender?: string;
  relatedBid?: string;
  relatedPayment?: string;
  relatedUser?: string;
  // Add any other fields from your backend Notification model
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await api.get("/api/notifications");
      const fetchedNotifications = response.data;
      setNotifications(fetchedNotifications);
      setUnreadCount(
        fetchedNotifications.filter((n: Notification) => !n.isRead).length
      );
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Mark a single notification as read
  const markAsRead = useCallback(async (id) => {
    console.log("Attempting to mark notification as read:", id); // Debug log
    try {
      const response = await api.put(`/api/notifications/${id}/read`);
      console.log("API response for markAsRead:", response.data); // Debug log

      // Update local state only after successful API call
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
      console.log("Local state updated for notification:", id); // Debug log
    } catch (error) {
      console.error("❌ Failed to mark notification as read:", error);
      // Handle error (e.g., show a toast message to the user)
      // You might want to add more specific error handling based on status codes
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
      // Optionally, revert the UI change or show an error message
      // alert("Failed to mark as read. Please try again.");
    }
  }, []);
  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      // You might want to create a backend endpoint for this
      // For now, we'll mark them all client-side and then refresh
      await api.put("/api/notifications/read-all"); // Implement this endpoint
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      // Fallback: mark all as read client-side
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  }, []);

  // Refresh notifications
  const refreshNotifications = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  // Handle real-time notifications from socket
  useEffect(() => {
    const socket = socketService.getSocket();

    if (socket) {
      const handleNewNotification = (notification: Notification) => {
        console.log("🔔 New real-time notification received:", notification);

        // Add the new notification to the top of the list
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      };

      // Listen for new notifications
      socket.on("newNotification", handleNewNotification);

      // Cleanup listener on unmount
      return () => {
        socket.off("newNotification", handleNewNotification);
      };
    }
  }, []);

  // Fetch notifications when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, fetchNotifications]);

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    isLoading,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook for notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

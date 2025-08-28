// components/NotificationDemo.js
"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";

/**
 * NotificationDemo
 * - Whole card clickable
 * - Marks as read then navigates
 * - Routes follow user's mapping and use `business-dashboard` or `dashboard` prefix
 */

const NotificationDemo = () => {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } =
    useNotifications();
  const { user, profile } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-sm">
        <div className="text-center text-gray-600 font-medium">
          Please sign in to view notifications
        </div>
      </div>
    );
  }

  const prefix = () =>
    profile?.userType === "business" ? "business-dashboard" : "dashboard";

  const getId = (maybeObj) => {
    if (!maybeObj) return null;
    if (typeof maybeObj === "string") return maybeObj;
    if (maybeObj._id) return String(maybeObj._id);
    if (typeof maybeObj.toString === "function") return maybeObj.toString();
    return null;
  };

  const getNotificationRoute = (n) => {
    const tenderId = getId(n.relatedTender);
    const bidId = getId(n.relatedBid);
    const userId = getId(n.relatedUser);
    const paymentId = getId(n.relatedPayment);
    const profileId = getId(n.profileId);

    const p = prefix();

    // mapping according to your last message
    switch (n.type) {
      // profile / account / verification related -> /profile
      case "user_registered":
      case "password_changed":
      case "emailchanged":
      case "profile":
      case "verification":
      case "password_setting_change":
      case "transaction":
        return `/${p}/profile`;

      // question -> /tender/[id]
      case "question":
        if (tenderId) return `/${p}/tender/${tenderId}`;
        return `/${p}/tenders`;

      // answer -> /tender-details/[id]
      case "answer":
        if (tenderId) return `/${p}/tender-details/${tenderId}`;
        return `/${p}/tenders`;

      // tenders: new_tender -> /tender-details/[id]
      case "new_tender":
        if (tenderId) return `/${p}/tender-details/${tenderId}`;
        return `/${p}/tenders`;

      // tender_created -> /tender/[id]
      case "tender_created":
        if (tenderId) return `/${p}/tender/${tenderId}`;
        return `/${p}/tenders`;

      // tender status -> /tender/[id]
      case "tender_status":
        if (tenderId) return `/${p}/tender/${tenderId}`;
        return `/${p}/tenders`;

      // tender_awarded -> /projects
      case "tender_awarded":
        return `/${p}/projects`;

      // tender_deleted -> /my-tenders
      case "tender_deleted":
        return `/${p}/my-tenders`;

      // new_bid_received -> /tender/[id]
      case "new_bid_received":
        if (tenderId) return `/${p}/tender/${tenderId}`;
        return `/${p}/tenders`;

      // bid_submitted -> /tender-details/[id]
      case "bid_submitted":
        if (tenderId) return `/${p}/tender-details/${tenderId}`;
        // fallback to bids list if no tenderId
        return `/${p}/bids`;

      // payment & bid paid -> /tender-details/[id]
      case "payment_success":
      case "bid_paid":
        if (tenderId) return `/${p}/tender-details/${tenderId}`;
        return `/${p}/payments`;

      // bid_status_update -> /tender-details/[id]
      case "bid_status_update":
        if (tenderId) return `/${p}/tender-details/${tenderId}`;
        return `/${p}/bids`;

      // bid_rejected -> prefer relatedBid -> /bids/[id], else tender-details/[id]
      case "bid_rejected": {
        if (bidId) return `/${p}/bids`; // user wanted business-dashboard/bids
        if (tenderId) return `/${p}/tender-details/${tenderId}`;
        return `/${p}/bids`;
      }

      // if a bid object is involved for other bid events, go to bids or projects as requested
      case "new_bid_received":
      case "new_bid_received":
      case "new_bid_received":
        if (tenderId) return `/${p}/tender/${tenderId}`;
        return `/${p}/bids`;

      // default fallback: if tender exists show tender-details, if bid exists show bid, else dashboard root
      default:
        if (tenderId) return `/${p}/tender-details/${tenderId}`;
        if (bidId) return `/${p}/bids/${bidId}`;
        if (userId) return `/${p}/users/${userId}`;
        return `/${p}`;
    }
  };

  const getNotificationIcon = (type) => {
    const commonProps = {
      className: "w-5 h-5 flex-shrink-0",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
    };
    switch (type) {
      case "new_tender":
      case "tender_created":
      case "tender_posted":
        return (
          <svg {...commonProps}>
            <path
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6M12 3v4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "tender_awarded":
        return (
          <svg {...commonProps}>
            <path
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4M12 2a10 10 0 100 20 10 10 0 000-20z"
            />
          </svg>
        );
      case "bid_rejected":
      case "bid_deleted":
        return (
          <svg {...commonProps}>
            <path
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 14l4-4M14 14l-4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "new_bid_received":
      case "bid_submitted":
      case "bid_status_update":
        return (
          <svg {...commonProps}>
            <path
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10h4l3 8 4-16 3 8h4"
            />
          </svg>
        );
      case "question":
      case "answer":
        return (
          <svg {...commonProps}>
            <path
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
            />
          </svg>
        );
      case "payment_success":
      case "bid_paid":
      case "transaction":
        return (
          <svg {...commonProps}>
            <path
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c-3 0-5 2-5 4s2 4 5 4 5-2 5-4-2-4-5-4zM12 2v4"
            />
          </svg>
        );
      case "password_changed":
      case "password_setting_change":
        return (
          <svg {...commonProps}>
            <path
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m0-10a4 4 0 00-4 4v2h8v-2a4 4 0 00-4-4z"
            />
          </svg>
        );
      default:
        return (
          <svg {...commonProps}>
            <path
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20v-6M6 10l6-6 6 6"
            />
          </svg>
        );
    }
  };

  const formatTypeLabel = (type) => {
    if (!type) return "General";
    return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleOpenNotification = async (n) => {
    const route = getNotificationRoute(n);
    if (!route) return;

    try {
      if (!n.isRead && markAsRead) {
        // attempt to mark read (await if Promise)
        await markAsRead(n._id);
      }
    } catch (err) {
      console.error("markAsRead failed:", err);
      // continue to navigation even if markAsRead fails
    } finally {
      router.push(route);
    }
  };

  return (
    <div className="mx-auto p-4 max-w-3xl">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-b from-gray-50/80 to-white/80 backdrop-blur-xl border-b border-gray-200/30 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {unreadCount} unread
                </p>
              )}
            </div>
            <div className="flex items-center space-x-3">
              {unreadCount > 0 && (
                <div className="bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </div>
              )}
              <button
                onClick={() => setIsExpanded((s) => !s)}
                className="px-4 py-2 bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 text-sm font-medium rounded-full transition-all duration-200 ease-out active:scale-95"
              >
                {isExpanded ? "Collapse" : "Show All"}
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center space-x-2 text-gray-600">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <span className="font-medium">Loading notifications...</span>
            </div>
          </div>
        ) : (
          <>
            {unreadCount > 0 && (
              <div className="px-6 py-4 border-b border-gray-200/30">
                <button
                  onClick={markAllAsRead}
                  className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all duration-200 ease-out active:scale-98 shadow-sm"
                >
                  Mark All as Read
                </button>
              </div>
            )}

            <div
              className={`${
                isExpanded ? "max-h-none" : "max-h-96"
              } overflow-y-auto`}
            >
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 17h5l-5 5v-5zM9 17H4l5 5v-5zM12 3v12"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">No notifications</p>
                  <p className="text-sm text-gray-400 mt-1">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200/30">
                  {notifications
                    .slice(0, isExpanded ? notifications.length : 5)
                    .map((n) => (
                      <div
                        key={n._id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleOpenNotification(n)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ")
                            handleOpenNotification(n);
                        }}
                        className={`block p-6 hover:bg-gray-50/50 transition-colors duration-200 cursor-pointer focus:outline-none ${
                          !n.isRead ? "bg-blue-50/30" : ""
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start space-x-3">
                              {!n.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                              )}

                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  {getNotificationIcon(n.type)}
                                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    {formatTypeLabel(n.type)}
                                  </span>
                                </div>

                                <p className="text-gray-900 font-medium leading-relaxed">
                                  {n.message}
                                </p>

                                <div className="flex items-center space-x-4 mt-3">
                                  <p className="text-xs text-gray-500">
                                    {new Date(n.createdAt).toLocaleString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )}
                                  </p>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100/80 text-gray-600">
                                    {n.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* no separate view button; card click handles navigation */}
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {!isExpanded && notifications.length > 5 && (
                <div className="p-4 text-center border-t border-gray-200/30">
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="text-blue-500 hover:text-blue-600 font-medium text-sm transition-colors duration-200"
                  >
                    Show {notifications.length - 5} more notifications
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationDemo;

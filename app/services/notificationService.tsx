// src/services/notificationService.js

import Notification from "../models/Notification.js";
import User from "../models/User.js";

/**
 * @class NotificationService
 * A dedicated service for managing user notifications (real-time + persistent).
 */
class NotificationService {
  constructor(io) {
    this.io = io;
    this.connectedUsers = new Map(); // Track connected users (userId -> { socketId, joinedAt })
  }

  /**
   * Get all connected sockets for a user (if any)
   * @param {string} userId - User ID
   * @returns {Set<string>} Set of socket IDs
   */
  getConnectedSockets(userId) {
    const room = this.io?.sockets?.adapter?.rooms?.get(userId.toString());
    return room ? new Set(room) : new Set();
  }

  /**
   * Emit notification to all connected clients of a user
   * @param {string} userId - Target user ID
   * @param {Object} notificationData - Notification object
   * @returns {boolean} True if sent successfully
   */
  async emitToUser(userId, notificationData) {
    try {
      const userRoom = userId.toString();
      const sockets = this.getConnectedSockets(userId);

      if (sockets.size === 0) {
        console.log(
          `💤 User ${userId} not connected. Saving notification only.`
        );
        return false;
      }

      // Emit to all connected sockets
      this.io.to(userRoom).emit("newNotification", notificationData);
      console.log(
        `🚀 Sent notification to ${sockets.size} socket(s) for user ${userId}`
      );

      // Log each socket ID
      sockets.forEach((socketId) => {
        console.log(`   📤 Sent to socket: ${socketId}`);
      });

      return true;
    } catch (error) {
      console.error(`❌ Failed to emit notification to user ${userId}:`, error);
      return false;
    }
  }

  /**
   * Create a notification and send it in real-time (if user is online)
   * @param {string} userId - User ID
   * @param {string} type - Type of notification (e.g., 'tender_created', 'bid_placed')
   * @param {string} message - Message text
   * @param {Object} relatedData - Additional data (e.g., relatedTender, relatedBid)
   * @returns {Promise<Object|null>} Created notification or null on failure
   */
  async createAndNotify(userId, type, message, relatedData = {}) {
    try {
      // Validate input
      if (!userId || !type || !message) {
        throw new Error("Missing required parameters: userId, type, message");
      }

      const notification = await Notification.create({
        user: userId,
        type,
        message,
        ...relatedData,
      });

      console.log(
        `✅ Notification created: ${notification._id} for user ${userId}`
      );

      // Send real-time update if Socket.IO is available
      if (this.io) {
        const success = await this.emitToUser(userId, notification.toObject());

        if (!success) {
          console.log(
            `⚠️ Notification saved but not delivered (user offline): ${notification._id}`
          );
        }
      } else {
        console.warn("❌ Socket.IO not available. Notification saved only.");
      }

      return notification;
    } catch (error) {
      console.error("❌ Error in createAndNotify:", error);
      return null;
    }
  }

  /**
   * Notify multiple users (e.g., all business users when a tender is posted)
   * @param {Array<string>} userIds - List of user IDs
   * @param {string} type - Notification type
   * @param {string} message - Message
   * @param {Object} relatedData - Related data
   * @returns {Promise<Array<Object>>} Array of created notifications
   */
  async createAndNotifyMultiple(userIds, type, message, relatedData = {}) {
    const notifications = [];

    for (const userId of userIds) {
      const notification = await this.createAndNotify(
        userId,
        type,
        message,
        relatedData
      );
      if (notification) notifications.push(notification);
    }

    console.log(
      `✅ Created ${notifications.length} notifications for ${userIds.length} users`
    );

    return notifications;
  }

  /**
   * Mark a notification as read (for frontend sync)
   * @param {string} id - Notification ID
   * @param {string} userId - User ID (for access control)
   * @returns {Promise<Object|null>}
   */
  async markAsRead(id, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: id, user: userId },
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        console.warn("Notification not found or unauthorized", id, userId);
        return null;
      }

      // Optionally emit read status update
      if (this.io) {
        const userRoom = userId.toString();
        this.io.to(userRoom).emit("notificationRead", { notificationId: id });
        console.log(`📌 Read status updated for notification ${id}`);
      }

      return notification;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return null;
    }
  }

  /**
   * Handle user connection (called from Socket.IO)
   * @param {string} userId - User ID
   * @param {string} socketId - Socket ID
   */
  handleUserConnect(userId, socketId) {
    this.connectedUsers.set(userId, {
      socketId,
      joinedAt: new Date(),
      userId,
    });
    console.log(`📌 User ${userId} connected via socket ${socketId}`);
  }

  /**
   * Handle user disconnect
   * @param {string} socketId - Socket ID
   */
  handleUserDisconnect(socketId) {
    for (let [userId, userData] of this.connectedUsers.entries()) {
      if (userData.socketId === socketId) {
        this.connectedUsers.delete(userId);
        console.log(`🗑️ User ${userId} disconnected`);
        break;
      }
    }
  }

  /**
   * Get list of currently connected users (for debugging)
   * @returns {Array<{userId, socketId, joinedAt}>}
   */
  getConnectedUsers() {
    return Array.from(this.connectedUsers.entries()).map(([userId, data]) => ({
      userId,
      socketId: data.socketId,
      joinedAt: data.joinedAt,
    }));
  }
}

export default NotificationService;

// services/chatService.js
import { api } from "@/lib/apiClient";

/**
 * Fetch all chat rooms for the logged-in user
 * @returns {Promise<Array>} List of enriched chat rooms
 */
export const getChatRooms = async () => {
  try {
    const res = await api.get("/api/chat/rooms");
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching chat rooms:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Fetch messages from a specific chat room
 * @param {string} roomId
 * @param {Object} options - Optional: limit, lastMessageId
 * @returns {Promise<Object>} { roomId, messages, hasMore }
 */
export const getChatMessages = async (roomId, options = {}) => {
  try {
    const res = await api.get(`/api/chat/rooms/${roomId}/messages`, {
      params: options,
    });
    return res.data;
  } catch (error) {
    console.error(
      `Error fetching messages for room ${roomId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Send a message to a chat room (with optional media)
 * @param {string} roomId
 * @param {Object} payload - { text, media }
 * @returns {Promise<Object>} Response from server
 */
export const sendMessage = async (roomId, payload) => {
  try {
    const res = await api.post(`/api/chat/rooms/${roomId}/messages`, payload);
    return res.data;
  } catch (error) {
    console.error(
      `Error sending message to room ${roomId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Mark messages in a chat room as read
 * @param {string} roomId
 * @returns {Promise<Object>} Success message
 */
export const markMessagesAsRead = async (roomId) => {
  try {
    const res = await api.post(`/api/chat/rooms/${roomId}/mark-read`);
    return res.data;
  } catch (error) {
    console.error(
      `Error marking messages as read in room ${roomId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Get chat room by tender ID (useful to redirect to chat from tender page)
 * @param {string} tenderId
 * @returns {Promise<Object>} Chat room data or error
 */
export const getChatRoomByTenderId = async (tenderId) => {
  try {
    const res = await api.get(`/api/chat/tender/${tenderId}`);
    return res.data;
  } catch (error) {
    console.error(
      `Error getting chat room for tender ${tenderId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Create a new chat room (optional: only if not auto-created on award)
 * Usually not needed — created automatically when tender is awarded
 */
// export const createChatRoom = async (tenderId, participant1Id, participant2Id, title) => {
//   try {
//     const res = await api.post("/api/chat/create", {
//       tenderId,
//       participant1Id,
//       participant2Id,
//       title,
//     });
//     return res.data;
//   } catch (error) {
//     console.error("Error creating chat room:", error.response?.data || error.message);
//     throw error;
//   }
// }

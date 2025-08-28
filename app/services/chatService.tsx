// app/services/chatService.ts (or lib/services/chatService.ts)

import { api } from "@/lib/apiClient"; // Adjust the path based on your project structure

// --- Interfaces based on backend responses (adjust as needed) ---

export interface ChatRoom {
  id: string;
  tenderId: string;
  participants: string[]; // Array of user IDs
  createdAt: string; // ISO string date
  lastMessageAt?: string; // ISO string date
  otherParticipant?: {
    _id: string;
    email: string;
    // Add other user fields if returned by getChatRoomByTender
  } | null;
  // Add other chat room fields if needed
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  media?: string[]; // URLs to media files, if applicable
  createdAt: string; // ISO string date
  senderName?: string; // Added by backend for broadcast
  // Add other message fields if needed (e.g., read status if tracked)
}

export interface GetChatMessagesResponse {
  roomId: string;
  messages: ChatMessage[];
  hasMore: boolean;
}

export interface SendMessageResponse {
  // This might be the full message object or just an ID, check your backend's sendMessage response
  // Assuming it returns the message object like messageForBroadcast
  id: string;
  senderId: string;
  text: string;
  media?: string[];
  createdAt: string;
  senderName?: string;
}

// --- Chat Service Functions ---

/**
 * Fetches the list of chat rooms the current user is part of.
 * (This might be needed later for a general chat list, even if not used immediately)
 */
export const getChatRooms = async (): Promise<ChatRoom[]> => {
  try {
    const response = await api.get<ChatRoom[]>("/api/chat/rooms");
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching chat rooms:",
      error.response?.data || error.message
    );
    throw error; // Re-throw to be handled by the calling component
  }
};

/**
 * Fetches messages for a specific chat room.
 * @param roomId The ID of the chat room.
 * @param limit Optional limit on the number of messages to fetch (default handled by backend).
 * @param lastMessageId Optional ID of the last message seen, for pagination.
 */
export const getChatMessages = async (
  roomId: string,
  limit?: number,
  lastMessageId?: string
): Promise<GetChatMessagesResponse> => {
  try {
    const params: Record<string, string | number> = {};
    if (limit !== undefined) params.limit = limit;
    if (lastMessageId) params.lastMessageId = lastMessageId;

    const response = await api.get<GetChatMessagesResponse>(
      `/api/chat/rooms/${roomId}/messages`,
      { params }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error fetching messages for room ${roomId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Sends a text message (and optionally media) to a specific chat room.
 * @param roomId The ID of the chat room.
 * @param text The text content of the message.
 * @param media Optional array of media files to send.
 */
export const sendMessage = async (
  roomId: string,
  text: string,
  media?: File[]
): Promise<SendMessageResponse> => {
  try {
    const formData = new FormData();
    formData.append("text", text);

    if (media && media.length > 0) {
      media.forEach((file) => {
        // The key 'media' must match what your backend expects (multer.array('media'))
        formData.append("media", file);
      });
    }

    // Make sure to use the correct content-type for FormData (axios usually handles this)
    const response = await api.post<SendMessageResponse>(
      `/api/chat/rooms/${roomId}/messages`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Axios usually sets this for FormData, but good to be explicit
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error sending message to room ${roomId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Marks all messages in a chat room as read by the current user.
 * @param roomId The ID of the chat room.
 */
export const markMessagesAsRead = async (roomId: string): Promise<void> => {
  try {
    await api.post(`/api/chat/rooms/${roomId}/read`);
    // Backend returns { message: "Messages marked as read" }, we don't necessarily need the data
  } catch (error: any) {
    console.error(
      `Error marking messages as read for room ${roomId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Gets the chat room associated with a specific tender ID.
 * Only works if the current user is the tender owner or the awarded bidder.
 * @param tenderId The ID of the tender.
 */
export const getChatRoomByTender = async (
  tenderId: string
): Promise<ChatRoom> => {
  try {
    const response = await api.get<ChatRoom>(`/api/chat/tender/${tenderId}`);
    return response.data;
  } catch (error: any) {
    console.error(
      `Error fetching chat room for tender ${tenderId}:`,
      error.response?.data || error.message
    );
    throw error; // Re-throw so calling component can handle 403, 404, etc.
  }
};

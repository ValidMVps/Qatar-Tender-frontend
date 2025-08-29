"use client";

import { useState, useEffect, useRef } from "react";
import {
  getChatRooms,
  getChatMessages,
  sendMessage,
  markMessagesAsRead,
  getChatRoomByTenderId,
} from "@/app/services/chatService";
import { format } from "date-fns";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const ChatPage = () => {
  const { user, profile } = useAuth();
  const [chatRooms, setChatRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState("rooms");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [mediaPreview, setMediaPreview] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load chat rooms on component mount
  useEffect(() => {
    const loadChatRooms = async () => {
      try {
        setIsLoading(true);
        const rooms = await getChatRooms();
        setChatRooms(rooms);
      } catch (error) {
        console.error("Failed to load chat rooms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadChatRooms();
    }
  }, [user]);

  // Load messages when a room is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!currentRoom) return;

      try {
        setIsLoading(true);
        const roomMessages = await getChatMessages(currentRoom.id);
        setMessages(roomMessages.messages);

        // Mark messages as read
        await markMessagesAsRead(currentRoom.id);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [currentRoom]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle file selection
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);

    // Create previews
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setMediaPreview((prev) => [...prev, ...previews]);
  };

  // Remove file from preview
  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...mediaPreview];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setSelectedFiles(newFiles);
    setMediaPreview(newPreviews);
  };

  // Send message
  const handleSendMessage = async () => {
    if ((!newMessage.trim() && selectedFiles.length === 0) || !currentRoom)
      return;

    setIsSending(true);

    try {
      // Prepare media data
      const mediaData = selectedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      }));

      // Send message
      await sendMessage(currentRoom.id, {
        text: newMessage.trim(),
        media: mediaData,
      });

      // Clear input and files
      setNewMessage("");
      setSelectedFiles([]);
      setMediaPreview([]);

      // Refresh messages
      const roomMessages = await getChatMessages(currentRoom.id);
      setMessages(roomMessages.messages);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Open chat room
  const openChatRoom = (room) => {
    setCurrentRoom(room);
    setActiveTab("chat");
  };

  // Go back to rooms list
  const goBackToRooms = () => {
    setCurrentRoom(null);
    setActiveTab("rooms");
  };

  // Format message time
  const formatTime = (dateString) => {
    try {
      return format(new Date(dateString), "HH:mm");
    } catch (error) {
      return "";
    }
  };

  // Render message content
  const renderMessageContent = (message) => {
    return (
      <div className="space-y-2">
        {message.media && message.media.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.media.map((media, index) => (
              <div key={index} className="max-w-xs">
                {media.type.startsWith("image/") ? (
                  <img
                    src={media.url}
                    alt={media.name}
                    className="max-w-full h-auto rounded-lg"
                  />
                ) : media.type.startsWith("video/") ? (
                  <video
                    src={media.url}
                    controls
                    className="max-w-full rounded-lg"
                  />
                ) : media.type.startsWith("audio/") ? (
                  <audio src={media.url} controls className="w-full" />
                ) : (
                  <div className="flex items-center p-3 bg-gray-100 rounded-lg">
                    <div className="mr-3 p-2 bg-blue-500 text-white rounded text-sm font-bold">
                      {media.name.split(".").pop().toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{media.name}</div>
                      <div className="text-sm text-gray-500">
                        {(media.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {message.text && (
          <div className="whitespace-pre-wrap">{message.text}</div>
        )}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in</h2>
          <p>You need to be logged in to access the chat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Chat Rooms */}
      <div
        className={`w-80 bg-white border-r ${
          activeTab === "rooms" ? "block" : "hidden md:block"
        }`}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Chat Rooms</h2>
        </div>

        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : chatRooms.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No chat rooms available. Chat rooms are created when tenders are
            awarded.
          </div>
        ) : (
          <div className="overflow-y-auto h-[calc(100vh-65px)]">
            {chatRooms.map((room) => {
              const otherParticipant = room.otherParticipants?.[0];
              const lastMessage = room.lastMessage;
              console.log("Rendering room:", room);
              return (
                <div
                  key={room.id}
                  onClick={() => openChatRoom(room)}
                  className="p-4 border-b cursor-pointer hover:bg-gray-50 flex items-start"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3 flex-shrink-0">
                    {otherParticipant?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-800 truncate">
                        {room.tenderTitle || "Chat Room"}
                      </h3>
                      {room.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                          {room.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      With:{" "}
                      {otherParticipant?.name ||
                        otherParticipant?.email ||
                        "Unknown"}
                    </p>
                    {lastMessage && (
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {lastMessage.text
                          ? lastMessage.text.substring(0, 50) +
                            (lastMessage.text.length > 50 ? "..." : "")
                          : "📎 Attachment"}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {lastMessage
                        ? formatTime(lastMessage.createdAt)
                        : formatTime(room.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div
        className={`flex-1 flex flex-col ${
          activeTab === "chat" ? "block" : "hidden"
        }`}
      >
        {currentRoom ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b p-4 flex items-center">
              <button
                onClick={goBackToRooms}
                className="md:hidden mr-3 p-2 hover:bg-gray-100 rounded"
              >
                ←
              </button>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                {currentRoom.otherParticipants?.[0]?.name
                  ?.charAt(0)
                  .toUpperCase() || "U"}
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">
                  {currentRoom.tenderTitle || "Chat"}
                </h2>
                <p className="text-sm text-gray-500">
                  With:{" "}
                  {currentRoom.otherParticipants?.[0]?.name ||
                    currentRoom.otherParticipants?.[0]?.email ||
                    "Unknown"}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {isLoading ? (
                <div className="text-center text-gray-500 py-8">
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message) => {
                  const isOwnMessage = message.senderId === user._id;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${
                        isOwnMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwnMessage
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-800 shadow"
                        }`}
                      >
                        {!isOwnMessage && (
                          <div className="text-xs opacity-70 mb-1">
                            {message.senderName || "User"}
                          </div>
                        )}
                        {renderMessageContent(message)}
                        <div
                          className={`text-xs mt-1 ${
                            isOwnMessage ? "text-blue-100" : "text-gray-400"
                          }`}
                        >
                          {formatTime(message.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t p-4">
              {/* Media Preview */}
              {mediaPreview.length > 0 && (
                <div className="mb-3 p-3 bg-gray-100 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {mediaPreview.map((preview, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-white p-2 rounded text-sm"
                      >
                        <span className="mr-2">
                          {preview.type.startsWith("image/")
                            ? "🖼️"
                            : preview.type.startsWith("video/")
                            ? "🎥"
                            : preview.type.startsWith("audio/")
                            ? "🎵"
                            : "📄"}
                        </span>
                        <span className="mr-2 truncate max-w-xs">
                          {preview.name}
                        </span>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 ml-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-end gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                >
                  📎
                </button>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="1"
                  style={{ minHeight: "44px", maxHeight: "120px" }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={
                    isSending ||
                    (!newMessage.trim() && selectedFiles.length === 0)
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSending ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat room to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

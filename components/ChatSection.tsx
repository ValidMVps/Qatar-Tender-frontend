// components/ChatSection.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getChatRoomByTenderId,
  getChatMessages,
  sendMessage,
  markMessagesAsRead,
} from "@/app/services/chatService";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send, Paperclip, X } from "lucide-react";

interface ChatSectionProps {
  tenderId: string; // Pass this from parent
  className?: string;
  onOpenProjectList?: () => void;
  onOpenProjectDetails?: () => void;
}

export default function ChatSection({
  tenderId,
  className = "",
  onOpenProjectList,
  onOpenProjectDetails,
}: ChatSectionProps) {
  const { user } = useAuth();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomTitle, setRoomTitle] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [mediaPreview, setMediaPreview] = useState<
    Array<{ url: string; name: string; size: number; type: string }>
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 1: Get chat room by tenderId
  useEffect(() => {
    const loadChatRoom = async () => {
      if (!tenderId) return;

      try {
        const room = await getChatRoomByTenderId(tenderId);
        setRoomId(room.id);
        setRoomTitle(room.tenderTitle || "Chat");
      } catch (error) {
        console.error("Chat not available:", error);
        setRoomId(null);
      }
    };

    loadChatRoom();
  }, [tenderId]);

  // Step 2: Load messages when roomId is available
  useEffect(() => {
    const loadMessages = async () => {
      if (!roomId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getChatMessages(roomId);
        setMessages(data.messages || []);

        // Mark as read
        await markMessagesAsRead(roomId);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [roomId]);



  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);

    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setMediaPreview((prev) => [...prev, ...previews]);
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...mediaPreview];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setSelectedFiles(newFiles);
    setMediaPreview(newPreviews);
  };

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && selectedFiles.length === 0) || !roomId) return;

    setIsSending(true);
    try {
      const mediaData = selectedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      }));

      await sendMessage(roomId, {
        text: newMessage.trim(),
        media: mediaData,
      });

      setNewMessage("");
      setSelectedFiles([]);
      setMediaPreview([]);

      // Refresh messages
      const data = await getChatMessages(roomId);
      setMessages(data.messages);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!tenderId) {
    return (
      <div className={`flex flex-col ${className}`}>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          No tender selected.
        </div>
      </div>
    );
  }

  if (!roomId) {
    return (
      <div className={`flex flex-col ${className}`}>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Chat not available yet. This tender has not been awarded.
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-gray-50">
        <button
          onClick={onOpenProjectList}
          className="md:hidden p-2 hover:bg-gray-200 rounded"
        >
          ≡
        </button>
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {roomTitle.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{roomTitle}</h3>
          <p className="text-xs text-gray-500">
            Tender #{tenderId.slice(0, 6)}
          </p>
        </div>
        <div className="flex-1" />
        <button
          onClick={onOpenProjectDetails}
          className="text-blue-600 hover:underline text-sm"
        >
          View Tender
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {isLoading ? (
          <div className="text-center text-gray-500 py-4">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user?._id;
            const senderName = msg.senderName || "User";

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                    isMe ? "bg-blue-500 text-white" : "bg-white text-gray-800"
                  }`}
                >
                  {!isMe && (
                    <div className="text-xs opacity-80 mb-1">{senderName}</div>
                  )}
                  {msg.text && (
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  )}
                  {msg.media && msg.media.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {msg.media.map((m: any, i: number) => (
                        <div key={i} className="mt-1">
                          {m.type.startsWith("image/") ? (
                            <img
                              src={m.url}
                              alt={m.name}
                              className="max-w-full rounded"
                            />
                          ) : m.type.startsWith("video/") ? (
                            <video
                              src={m.url}
                              controls
                              className="max-w-full rounded"
                            />
                          ) : (
                            <a
                              href={m.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm p-2 bg-gray-100 rounded"
                            >
                              📄 {m.name} ({(m.size / 1024).toFixed(1)} KB)
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div
                    className={`text-xs mt-1 ${
                      isMe ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    {format(new Date(msg.createdAt), "HH:mm")}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t p-4 bg-white">
        {mediaPreview.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {mediaPreview.map((preview, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded text-sm"
              >
                <span>
                  {preview.type.startsWith("image/")
                    ? "🖼️"
                    : preview.type.startsWith("video/")
                    ? "🎥"
                    : "📄"}
                </span>
                <span className="truncate max-w-xs">{preview.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending}
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
            disabled={isSending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={
              isSending || (!newMessage.trim() && selectedFiles.length === 0)
            }
          >
            {isSending ? "Sending..." : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

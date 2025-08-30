// components/ChatSection.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getChatRoomByTenderId,
  getChatMessages,
  sendMessage as sendApiMessage,
  markMessagesAsRead,
} from "@/app/services/chatService";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send, Paperclip, X, User, Menu } from "lucide-react";
import io from "socket.io-client";
import { profileApi } from "@/app/services/profileApi";
// Ensure you have SOCKET_URL in .env.local
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

// Add this import for file upload
import { uploadMedia } from "@/app/services/uploadService";

interface ChatSectionProps {
  tenderId: string;
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
  const [otherTyping, setOtherTyping] = useState(false);
  const [typingUserName, setTypingUserName] = useState("");
  const [otherParticipant, setOtherParticipant] = useState<any>(null); // Added for participant info

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<any>(null);

  // Connect to Socket.IO on mount
  useEffect(() => {
    if (!user?._id) return;

    const token = localStorage.getItem("accessToken"); // or use auth context

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    // Join user room
    socket.emit("join", user._id);

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
    });

    socket.on("connect_error", (error: any) => {
      console.error("🔴 Socket connection error:", error);
    });

    socket.on("disconnect", (reason: any) => {
      console.log("🟡 Socket disconnected:", reason);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

  // Fetch chat room by tenderId
  useEffect(() => {
    if (!tenderId) return;

    const loadChatRoom = async () => {
      try {
        const room = (await getChatRoomByTenderId(tenderId)) as any;

        // prefer using id or fallback to _id if your backend uses Mongo-style _id
        setRoomId(String(room.id ?? room._id ?? ""));

        // safe fallback for title
        setRoomTitle(room.tenderTitle ?? room.title ?? "");

        // safe participant access
        const participantId =
          room.participants?.[1] ?? room.participants?.[0] ?? null;
        if (participantId) {
          profileApi.getProfileById(participantId).then((data) => {
            setOtherParticipant(data);
            console.log(data, "crazy");
          });
        }
      } catch (error) {
        console.error("Chat not available:", error);
        setRoomId(null);
      }
    };

    loadChatRoom();
  }, [tenderId]);

  // Load messages & join chat room when roomId is ready
  useEffect(() => {
    if (!roomId || !user || !socketRef.current) return;

    const loadMessages = async () => {
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

    const socket = socketRef.current;

    // Join chat room
    socket.emit("joinChatRoom", roomId);

    // Listen for new messages
    socket.on(
      "newMessage",
      (data: { roomId: string; message: { id: any } }) => {
        if (data.roomId === roomId) {
          setMessages((prev) => {
            const exists = prev.some((msg) => msg.id === data.message.id);
            if (exists) return prev;
            return [...prev, data.message];
          });
        }
      }
    );

    // Listen for typing
    socket.on(
      "userTyping",
      (data: { roomId: string; userId: string; senderName: any }) => {
        if (data.roomId === roomId && data.userId !== user._id) {
          setOtherTyping(true);
          setTypingUserName(data.senderName || "Someone");
          const timer = setTimeout(() => setOtherTyping(false), 3000);
          return () => clearTimeout(timer);
        }
      }
    );

    return () => {
      socket.emit("leaveChatRoom", roomId);
    };
  }, [roomId, user]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle file input
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

  // Send typing event
  const handleTyping = () => {
    if (!roomId || !socketRef.current) return;
    socketRef.current.emit("typing", {
      roomId,
      userId: user?._id,
      isTyping: true,
    });
  };

  // Send message
  const handleSendMessage = async () => {
    if ((!newMessage.trim() && selectedFiles.length === 0) || !roomId || !user)
      return;

    setIsSending(true);

    // ✅ Create a temporary message object
    const tempMessage = {
      id: `temp_${Date.now()}`, // Temporary ID
      senderId: user._id,
      senderName: user.email || "You",
      text: newMessage.trim(),
      media: selectedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        // Note: We'll update this with real URLs after upload
      })),
      createdAt: new Date().toISOString(),
      pending: true, // Optional: show "sending..." indicator
    };

    // ✅ Optimistically add to messages list
    setMessages((prev) => [...prev, tempMessage]);

    // Clear input
    setNewMessage("");
    setSelectedFiles([]);
    setMediaPreview([]);

    try {
      let uploadedMedia = [];

      // ✅ Upload files first if any are selected
      if (selectedFiles.length > 0) {
        uploadedMedia = await uploadMedia(selectedFiles);
      }

      // ✅ Send via API with the actual URLs
      await sendApiMessage(roomId, {
        text: tempMessage.text,
        media: uploadedMedia, // Now contains actual URLs
      });

      // ✅ After success, remove temp message
      setMessages((prev) =>
        prev.filter((msg) => !(msg.id === tempMessage.id && msg.pending))
      );
    } catch (error) {
      console.error("Failed to send message:", error);

      // ✅ Mark as failed
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessage.id
            ? { ...msg, error: true, pending: false }
            : msg
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
      handleTyping();
    }
  };

  if (!tenderId) {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        <div className="flex-1 flex items-center justify-center text-gray-500 bg-white">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-3xl mb-6">
              💬
            </div>
            <p className="text-lg font-medium text-gray-800 mb-2">
              No conversation selected
            </p>
            <p className="text-sm text-gray-500">
              Choose a tender to start messaging
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!roomId) {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        <div className="flex-1 flex items-center justify-center text-gray-500 bg-white">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-3xl mb-6">
              🚫
            </div>
            <p className="text-lg font-medium text-gray-800 mb-2">
              Chat unavailable
            </p>
            <p className="text-sm text-gray-500">
              This tender has not been awarded
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Header - Apple style with blur backdrop */}
      <div className="flex items-center gap-4 h-16 px-6 py-3 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <button
          onClick={onOpenProjectList}
          className="md:hidden p-2 hover:bg-gray-50 rounded-xl transition-all duration-200"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        {/* Updated to show first letter of participant's name */}
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-semibold text-sm shadow-sm">
          {otherParticipant?.name?.charAt(0) ||
            otherParticipant?.fullName?.charAt(0) ||
            otherParticipant?.email?.charAt(0) ||
            "U"}
        </div>

        {/* Updated to show participant name and tender title */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate text-base">
            {otherParticipant?.companyName ||
              otherParticipant?.contactPersonName ||
              "Participant"}
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            {roomTitle || "Tender Chat"}
          </p>
        </div>

        <button
          onClick={onOpenProjectDetails}
          className="text-blue-600 hover:text-blue-700 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-50 transition-all duration-200"
        >
          Details
        </button>
      </div>

      {/* Messages Container - Apple style scrolling */}
      <div className="flex-1 overflow-y-auto bg-gray-50/50">
        <div className="p-6 space-y-6 h-10">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <div className="w-8 h-8 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium">Loading messages...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-2xl mb-4">
                  💭
                </div>
                <p className="text-gray-800 font-medium mb-2">
                  Start the conversation
                </p>
                <p className="text-sm text-gray-500">
                  Send your first message below
                </p>
              </div>
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
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-3xl ${
                      isMe
                        ? "bg-blue-500 text-white rounded-br-lg"
                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-lg"
                    }`}
                  >
                    {!isMe && (
                      <div className="text-xs text-gray-500 mb-2 flex items-center font-medium">
                        <User className="w-3 h-3 mr-1.5" /> {senderName}
                      </div>
                    )}
                    {msg.text && (
                      <div className="whitespace-pre-wrap break-words leading-relaxed">
                        {msg.text}
                      </div>
                    )}
                    {msg.media && msg.media.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.media.map((m: any, i: number) => (
                          <div key={i}>
                            {m.type.startsWith("image/") ? (
                              <img
                                src={m.url}
                                alt={m.name}
                                className="max-w-full rounded-2xl "
                              />
                            ) : m.type.startsWith("video/") ? (
                              <video
                                src={m.url}
                                controls
                                className="max-w-full rounded-2xl border border-gray-200"
                              />
                            ) : (
                              <a
                                href={m.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-sm p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-200 border border-gray-200"
                              >
                                <span className="text-lg">📄</span>
                                <div className="flex-1 min-w-0">
                                  <div className="truncate font-medium">
                                    {m.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {(m.size / 1024).toFixed(1)} KB
                                  </div>
                                </div>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <div
                      className={`text-xs mt-2 font-medium ${
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

          {/* Typing Indicator - Apple style */}
          {otherTyping && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-3xl rounded-bl-lg border border-gray-100 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {typingUserName} is typing...
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Apple style with clean design */}
      <div className="border-t border-gray-100 bg-white/80 backdrop-blur-md p-4">
        {/* File Previews - Apple style */}
        {mediaPreview.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {mediaPreview.map((preview, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl text-sm border border-gray-200"
                >
                  <span className="text-lg">
                    {preview.type.startsWith("image/")
                      ? "🖼️"
                      : preview.type.startsWith("video/")
                      ? "🎥"
                      : "📄"}
                  </span>
                  <span className="truncate max-w-32 md:max-w-xs font-medium">
                    {preview.name}
                  </span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-full transition-all duration-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Controls - Apple style */}
        <div className="flex gap-3 items-end">
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
            disabled={isSending}
            className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all duration-200 shrink-0"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={handleKeyPress}
              placeholder="Message..."
              className="border-gray-200 rounded-2xl px-4 py-3 text-base bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              disabled={isSending}
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={
              isSending || (!newMessage.trim() && selectedFiles.length === 0)
            }
            className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-2xl transition-all duration-200 shrink-0"
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

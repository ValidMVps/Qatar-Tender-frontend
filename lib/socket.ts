// lib/socket.js
import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  // Initialize and connect the socket
  connect(token) {
    if (this.socket && this.isConnected) {
      console.log("Socket already connected");
      return;
    }

    // IMPORTANT: Make sure this URL matches your backend server URL
    // Based on your server.js, it seems to run on PORT 5000 by default
    const SOCKET_URL =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

    this.socket = io(SOCKET_URL, {
      withCredentials: true, // Important for CORS
      transports: ["websocket", "polling"], // Try WebSocket first, then polling
      auth: {
        token: token, // Send the auth token if your backend expects it
      },
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket.id);
      this.isConnected = true;
    });

    this.socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
      this.isConnected = false;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
      this.isConnected = false;
      // You might want to implement reconnection logic here
    });

    // Handle ping/pong for connection health
    this.socket.on("pong", (data) => {
      console.log("🏓 Pong received:", data);
    });

    return this.socket;
  }

  // Join a specific user room
  joinUserRoom(userId) {
    if (this.socket && this.isConnected) {
      console.log(`📡 Joining room for user: ${userId}`);
      this.socket.emit("join", userId);
    } else {
      console.warn("Cannot join room: Socket not connected");
    }
  }

  // Leave a specific user room
  leaveUserRoom(userId) {
    if (this.socket && this.isConnected) {
      console.log(`🚪 Leaving room for user: ${userId}`);
      this.socket.emit("leave", userId); // You might need to implement this on backend
    }
  }

  // Disconnect the socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
      console.log("🔌 Socket manually disconnected");
    }
  }

  // Get the socket instance
  getSocket() {
    return this.socket;
  }

  // Check connection status
  isConnected() {
    return this.isConnected;
  }
}

// Export a singleton instance
const socketService = new SocketService();
export default socketService;

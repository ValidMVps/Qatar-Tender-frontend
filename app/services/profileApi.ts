// api/profileApi.js

import { api } from "@/lib/apiClient";

export const profileApi = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get("/api/profiles");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/api/profiles", profileData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  },

  // Submit documents for verification
  submitDocuments: async (documentsData) => {
    try {
      const response = await api.put(
        "/api/profiles/submit-documents",
        documentsData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to submit documents"
      );
    }
  },

  // Get verification status
  getVerificationStatus: async () => {
    try {
      const response = await api.get("/api/profiles/verification-status");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch verification status"
      );
    }
  },
};

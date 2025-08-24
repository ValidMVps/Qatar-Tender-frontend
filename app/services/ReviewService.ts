// services/reviewService.ts
import { api } from "@/lib/apiClient";

// Define TypeScript interfaces
export interface Review {
    _id: string;
    tender: {
        _id: string;
        title: string;
    };
    reviewer: {
        _id: string;
        email: string;
        userType: string;
    };
    reviewedUser: string;
    rating: number;
    comment?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateReviewData {
    tender: string;
    reviewedUser: string;
    rating: number;
    comment?: string;
}

// Create a new review
export const createReview = async (
    reviewData: CreateReviewData
): Promise<Review> => {
    try {
        const response = await api.post<Review>("/api/reviews", reviewData);
        return response.data;
    } catch (error: any) {
        console.error("Error creating review:", error.response?.data || error.message);
        throw new Error(
            error.response?.data?.message || "Failed to create review. Please try again."
        );
    }
};

// Get review for a specific tender by current user
export const getReviewForTender = async (
    tenderId: string
): Promise<Review | null> => {
    console.log("Getting review for tender ID:", tenderId);
    try {
        const response = await api.get<Review>(`/api/reviews/tender/${tenderId}`);
        return response.data;
    } catch (error: any) {
        // If review not found, return null instead of throwing error
        if (error.response?.status === 404) {
            return null;
        }
        console.error("Error fetching tender review:", error.response?.data || error.message);
        throw new Error(
            error.response?.data?.message || "Failed to fetch tender review."
        );
    }
};

// Get reviews for a specific user
export const getReviewsForUser = async (
    userId: string
): Promise<Review[]> => {
    try {
        const response = await api.get<Review[]>(`/api/reviews/user/${userId}`);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching user reviews:", error.response?.data || error.message);
        throw new Error(
            error.response?.data?.message || "Failed to fetch user reviews."
        );
    }
};

// Get reviews received by the current user
export const getMyReceivedReviews = async (): Promise<Review[]> => {
    try {
        const response = await api.get<Review[]>("/api/reviews/my-reviews");
        return response.data;
    } catch (error: any) {
        console.error("Error fetching received reviews:", error.response?.data || error.message);
        throw new Error(
            error.response?.data?.message || "Failed to fetch received reviews."
        );
    }
};
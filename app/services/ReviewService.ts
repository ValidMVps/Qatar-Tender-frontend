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
export const createReview = async (reviewData: CreateReviewData): Promise<Review> => {
    const response = await api.post<Review>("/reviews", reviewData);
    return response.data;
};

// Get reviews for a specific user
export const getReviewsForUser = async (userId: string): Promise<Review[]> => {
    const response = await api.get<Review[]>(`/api/reviews/user/${userId}`);
    return response.data;
};

// Get reviews received by the current user
export const getMyReceivedReviews = async (): Promise<Review[]> => {
    const response = await api.get<Review[]>("/api/reviews/my-reviews");
    return response.data;
};
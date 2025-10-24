import { api } from "@/lib/apiClient";

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  status?: string;
  payment?: {
    status: string;
    amount: number;
    transactionId: string;
  };
  bid?: {
    _id: string;
    status: string;
    paymentStatus: string;
  };
}

/**
 * Verify payment status after redirect
 * @param tapId - The Tap charge ID from URL parameter
 */
export const verifyPaymentStatus = async (
  tapId: string
): Promise<PaymentVerificationResponse> => {
  try {
    const res = await api.get(`/api/payments/verify?tap_id=${tapId}`);
    return res.data;
  } catch (error: any) {
    console.error(
      "Error verifying payment:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Get payment details by ID
 */
export const getPaymentDetails = async (paymentId: string) => {
  try {
    const res = await api.get(`/api/payments/${paymentId}`);
    return res.data;
  } catch (error: any) {
    console.error(
      "Error fetching payment details:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const getMyPayments = async () => {
  try {
    const res = await api.get("/api/payments/my-payments");
    return res.data;
  } catch (error: any) {
    console.error(
      "Error fetching my payments:",
      error.response?.data || error.message
    );
    throw error;
  }
};

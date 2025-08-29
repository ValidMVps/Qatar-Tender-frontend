import { api } from "@/lib/apiClient"; // your axios/fetch wrapper
import { useState } from "react";

interface Props {
  tenderId: string;
}

export default function ActivateTenderButton({ tenderId }: Props) {
  const [loading, setLoading] = useState(false);

  const setTenderActive = async () => {
    try {
      setLoading(true);
      const res = await api.put(`/api/tenders/${tenderId}/status`, {
        status: "active",
      });
      alert("Tender is now active!");
    } catch (err: any) {
      console.error(
        "Error updating tender status:",
        err.response?.data || err.message
      );
      alert("Failed to update tender status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={setTenderActive}
      disabled={loading}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {loading ? "Activating..." : "Set Tender Active"}
    </button>
  );
}

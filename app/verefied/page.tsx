// app/verify/page.tsx
"use client";

import { CheckCircle } from "lucide-react";

export default function VerifyPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 text-blue-600 mx-auto mb-6" />
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Email Verified
        </h1>
        <p className="text-gray-600 mb-6">
          Your email has been successfully verified. You can now continue using
          your account.
        </p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.replace("/login");
          return;
        }

        const { data } = await axios.get<User>(
          "http://localhost:5000/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (data && data.isVerified) {
          setAuthorized(true);
        } else {
          router.replace("/verify");
        }
      } catch (error) {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <div className="p-4 text-center">Checking authentication...</div>;
  }

  return authorized ? <>{children}</> : null;
}

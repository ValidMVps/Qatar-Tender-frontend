"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Building2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "poster" | "provider" | "business" // Added 'business' role
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userDataString = localStorage.getItem("userData")
        console.log("AuthGuard: localStorage userDataString:", userDataString)

        if (!userDataString) {
          console.log("AuthGuard: No user data found, redirecting to /login after delay.")
          // Add a small delay to ensure localStorage is fully settled,
          // especially after a quick redirect from signup.
          setTimeout(() => {
            router.push("/login")
          }, 100) // 100ms delay
          return
        }

        const user = JSON.parse(userDataString)
        console.log("AuthGuard: Parsed user data:", user)
        console.log("AuthGuard: Required role:", requiredRole)

        // KYC is no longer mandatory at signup, so we don't redirect to kyc-pending here.
        // If KYC becomes a post-signup requirement, it would be handled elsewhere.

        if (requiredRole) {
          // Handle role-based access
          // 'poster' role is for 'individual' accounts and 'business' accounts (who can also post)
          if (requiredRole === "poster" && user.accountType !== "individual" && user.accountType !== "business") {
            console.log("AuthGuard: Role mismatch for poster, redirecting to /unauthorized")
            router.push("/unauthorized")
            return
          }

          // 'provider' role is only for 'business' accounts
          if (requiredRole === "provider" && user.accountType !== "business") {
            console.log("AuthGuard: Role mismatch for provider, redirecting to /unauthorized")
            router.push("/unauthorized")
            return
          }

          // 'business' role is only for 'business' accounts (used in business-dashboard layout)
          if (requiredRole === "business" && user.accountType !== "business") {
            console.log("AuthGuard: Role mismatch for business, redirecting to /unauthorized")
            router.push("/unauthorized")
            return
          }
        }

        console.log("AuthGuard: User authorized.")
        setIsAuthorized(true)
        setIsLoading(false)
      } catch (error) {
        console.error("AuthGuard: Auth check error:", error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router, requiredRole])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}

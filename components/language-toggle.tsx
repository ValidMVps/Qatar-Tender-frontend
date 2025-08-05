"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function LanguageToggle() {
  const [isArabic, setIsArabic] = useState(false)

  return (
    <div className="flex items-center bg-gray-100 rounded-full p-1">
      <Button
        variant={!isArabic ? "default" : "ghost"}
        size="sm"
        onClick={() => setIsArabic(false)}
        className={`rounded-full px-4 py-2 text-sm transition-all ${
          !isArabic ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:bg-transparent"
        }`}
      >
        EN
      </Button>
      <Button
        variant={isArabic ? "default" : "ghost"}
        size="sm"
        onClick={() => setIsArabic(true)}
        className={`rounded-full px-4 py-2 text-sm transition-all ${
          isArabic ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:bg-transparent"
        }`}
      >
        عر
      </Button>
    </div>
  )
}

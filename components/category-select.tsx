"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

const categories = [
  { value: "construction", label: "Construction & Building", labelAr: "البناء والتشييد" },
  { value: "design", label: "Design & Creative", labelAr: "التصميم والإبداع" },
  { value: "it", label: "Information Technology", labelAr: "تكنولوجيا المعلومات" },
  { value: "legal", label: "Legal Services", labelAr: "الخدمات القانونية" },
  { value: "transport", label: "Transportation & Logistics", labelAr: "النقل واللوجستيات" },
  { value: "consulting", label: "Business Consulting", labelAr: "الاستشارات التجارية" },
  { value: "maintenance", label: "Maintenance & Repair", labelAr: "الصيانة والإصلاح" },
  { value: "marketing", label: "Marketing & Advertising", labelAr: "التسويق والإعلان" },
  { value: "finance", label: "Financial Services", labelAr: "الخدمات المالية" },
  { value: "other", label: "Other", labelAr: "أخرى" },
]

interface CategorySelectProps {
  value: string
  onChange: (value: string) => void
  isArabic?: boolean
}

export function CategorySelect({ value, onChange, isArabic = false }: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedCategory = categories.find((c) => c.value === value)

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between bg-white border-gray-300 hover:bg-gray-50"
      >
        <span className={isArabic ? "text-right" : "text-left"}>
          {selectedCategory
            ? isArabic
              ? selectedCategory.labelAr
              : selectedCategory.label
            : isArabic
              ? "اختر الفئة"
              : "Select Category"}
        </span>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-md z-10 max-h-48 overflow-y-auto">
          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => {
                onChange(category.value)
                setIsOpen(false)
              }}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                isArabic ? "text-right" : "text-left"
              }`}
            >
              {isArabic ? category.labelAr : category.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

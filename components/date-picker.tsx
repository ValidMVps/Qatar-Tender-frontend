"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Calendar } from "lucide-react"

interface DatePickerProps {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  minDate?: string
}

export function DatePicker({ label, value, onChange, required = false, minDate }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    setIsOpen(false)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <Input
          type="date"
          value={value}
          onChange={handleDateChange}
          min={minDate}
          className="bg-white border-gray-300 pr-10"
        />
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  )
}

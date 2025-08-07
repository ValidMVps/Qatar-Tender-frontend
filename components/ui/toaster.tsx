"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import type { ReactNode } from "react"

// Define Toast type (adjust this to match your actual implementation)
type ToastType = {
  id: string
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  [key: string]: any
}

export function Toaster() {
  const { toasts } = useToast() as { toasts: ToastType[] }

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}

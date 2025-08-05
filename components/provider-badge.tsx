import { Badge } from "@/components/ui/badge"

interface ProviderBadgeProps {
  badge: "bronze" | "gold" | "platinum"
  size?: "sm" | "md" | "lg"
}

export function ProviderBadge({ badge, size = "md" }: ProviderBadgeProps) {
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "platinum":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "gold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "bronze":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-2 py-1",
    lg: "text-base px-3 py-1",
  }

  return <Badge className={`border ${getBadgeColor(badge)} ${sizeClasses[size]}`}>{badge.toUpperCase()}</Badge>
}

import { Bell } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { useTranslation } from '../../../lib/hooks/useTranslation';
export default function Loading() {
    const { t } = useTranslation();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Bell className="h-7 w-7 mr-3" />
          {t('notifications')}
        </h1>
        <p className="text-gray-600">Stay updated on all your activities and alerts</p>
      </div>

      {/* Notification Actions and Filters Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-36 rounded-md" />
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>

      {/* Notifications List Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="border border-gray-200 shadow-sm">
            <CardContent className="p-4 flex items-start space-x-4">
              <Skeleton className="h-5 w-5 rounded-full mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-12 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <Skeleton className="h-3 w-20" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-7 w-16 rounded-md" />
                    <Skeleton className="h-7 w-16 rounded-md" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}

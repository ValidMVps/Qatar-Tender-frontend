import { HelpCircle, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <HelpCircle className="h-7 w-7 mr-3" />
        help_support
        </h1>
        <p className="text-gray-600">find_answers_to_common_questions_or_contact_our_su</p>
      </div>

      {/* Quick Links / Sections Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border border-gray-200 shadow-sm">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Skeleton className="h-10 w-10 rounded-full mb-3" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section Skeleton */}
      <Card className="mb-8 border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">frequently_asked_questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input type="text" placeholder="Search FAQs..." className="pl-10 bg-white border-gray-300" disabled />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border-b border-gray-100 pb-4 last:border-b-0">
                <Skeleton className="h-5 w-full mb-1" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Support Form Skeleton */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">contact_support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="grid gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
            <div className="grid gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="grid gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
            <Skeleton className="h-10 w-36 rounded-md" />
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-600">
            <Skeleton className="h-4 w-48 mx-auto mb-2" />
            <div className="flex items-center justify-center space-x-6">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

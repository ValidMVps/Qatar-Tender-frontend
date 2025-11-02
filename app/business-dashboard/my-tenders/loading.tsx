import { FileText, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import useTranslation from "@/lib/hooks/useTranslation";
export default function Loading() {
  return (
    <>
      <div className="flex items-center justify-between mb-8 ">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <FileText className="h-7 w-7 mr-3" />
            my_tenders
          </h1>
          <p className="text-gray-600">manage_all_your_tender_opportunities</p>
        </div>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 flex items-center space-x-2"
          disabled
        >
          <Plus className="h-4 w-4" />
          <span>post_new_tender</span>
        </Button>
      </div>

      {/* Status Summary Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <Skeleton className="h-8 w-1/2 mx-auto mb-2" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tenders..."
            className="pl-10 bg-white border-gray-300"
            disabled
          />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>

      {/* Tenders List Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Skeleton className="h-8 w-16 rounded-md" />
                  <Skeleton className="h-8 w-16 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

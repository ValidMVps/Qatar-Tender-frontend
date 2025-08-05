"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

// Mock data for ratings and reviews
const mockReviews = [
  {
    id: "1",
    reviewerName: "John Doe",
    reviewerAvatar: "/placeholder-user.jpg",
    rating: 5,
    comment: "Excellent service! The project was completed on time and exceeded expectations.",
    date: "2023-10-26",
  },
  {
    id: "2",
    reviewerName: "Jane Smith",
    reviewerAvatar: "/placeholder-user.jpg",
    rating: 4,
    comment: "Good communication and quality work. Minor delays but overall satisfied.",
    date: "2023-10-20",
  },
  {
    id: "3",
    reviewerName: "Peter Jones",
    reviewerAvatar: "/placeholder-user.jpg",
    rating: 5,
    comment: "Highly recommend! Very professional and delivered exactly what was promised.",
    date: "2023-10-15",
  },
  {
    id: "4",
    reviewerName: "Alice Brown",
    reviewerAvatar: "/placeholder-user.jpg",
    rating: 3,
    comment: "The work was okay, but there were some misunderstandings regarding the scope.",
    date: "2023-10-10",
  },
]

export default function RatingsPage() {
  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length || 0
  const totalReviews = mockReviews.length

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Ratings & Reviews</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Overall Rating</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <span className="text-5xl font-bold">{averageRating.toFixed(1)}</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${
                    i < Math.floor(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-5xl font-bold">{totalReviews}</span>
            <p className="text-sm text-gray-500">customer reviews</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">All Reviews</h2>
      <div className="space-y-6">
        {mockReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarImage src={review.reviewerAvatar || "/placeholder.svg"} alt={review.reviewerName} />
                  <AvatarFallback>{review.reviewerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{review.reviewerName}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="ml-2">{review.rating} out of 5 stars</span>
                  </div>
                </div>
                <span className="ml-auto text-sm text-gray-500">{review.date}</span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

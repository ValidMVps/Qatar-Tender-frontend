"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Search, Eye, CheckCircle, XCircle } from "lucide-react"
import { sampleBids, type Bid, type BidStatus } from "@/lib/mock-data"
import { format } from "date-fns"

export default function AdminBidsPage() {
  const [bids, setBids] = useState<Bid[]>(sampleBids)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [viewingBid, setViewingBid] = useState<Bid | null>(null)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  const filteredBids = bids.filter((bid) => {
    const matchesSearch =
      bid.tenderTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.status.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "pending") return matchesSearch && bid.status === "Pending"
    if (activeTab === "accepted") return matchesSearch && bid.status === "Accepted"
    if (activeTab === "rejected") return matchesSearch && bid.status === "Rejected"
    return matchesSearch
  })

  const handleViewClick = (bid: Bid) => {
    setViewingBid(bid)
    setRejectionReason(bid.rejectionReason || "")
    setShowViewDialog(true)
  }

  const handleChangeBidStatus = (bidId: string, newStatus: BidStatus) => {
    setBids(
      bids.map((b) =>
        b.id === bidId
          ? { ...b, status: newStatus, rejectionReason: newStatus === "Rejected" ? rejectionReason : undefined }
          : b,
      ),
    )
    setShowViewDialog(false) // Close dialog after action
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-gray-900">Manage Bids</h1>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Bid List
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search bids..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList>
              <TabsTrigger value="all">All Bids</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tender Title</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Bid Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBids.length > 0 ? (
                filteredBids.map((bid) => (
                  <TableRow key={bid.id}>
                    <TableCell className="font-medium">{bid.tenderTitle}</TableCell>
                    <TableCell>{bid.providerName}</TableCell>
                    <TableCell>{bid.bidAmount}</TableCell>
                    <TableCell>{bid.status}</TableCell>
                    <TableCell>{format(new Date(bid.submittedAt), "PPP")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewClick(bid)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          {bid.status !== "Accepted" && (
                            <DropdownMenuItem onClick={() => handleChangeBidStatus(bid.id, "Accepted")}>
                              <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" /> Accept Bid
                            </DropdownMenuItem>
                          )}
                          {bid.status !== "Rejected" && (
                            <DropdownMenuItem
                              onClick={() => handleViewClick({ ...bid, status: "Rejected" })}
                              className="text-red-600"
                            >
                              <XCircle className="mr-2 h-4 w-4" /> Reject Bid
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    No bids found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Bid Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Bid Details for {viewingBid?.tenderTitle}</DialogTitle>
          </DialogHeader>
          {viewingBid && (
            <div className="grid gap-4 py-4">
              <p>
                <span className="font-semibold">Provider:</span> {viewingBid.providerName}
              </p>
              <p>
                <span className="font-semibold">Bid Amount:</span> {viewingBid.bidAmount}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {viewingBid.status}
              </p>
              <p>
                <span className="font-semibold">Submitted At:</span> {format(new Date(viewingBid.submittedAt), "PPP")}
              </p>
              <div>
                <span className="font-semibold">Bid Description:</span>
                <p className="mt-1 text-gray-700">{viewingBid.bidDescription}</p>
              </div>
              {viewingBid.status === "Rejected" && (
                <div>
                  <span className="font-semibold text-red-600">Rejection Reason:</span>
                  <p className="mt-1 text-red-700">{viewingBid.rejectionReason || "No reason provided."}</p>
                </div>
              )}
              {viewingBid.status !== "Accepted" && (
                <div className="grid gap-2">
                  <Label htmlFor="rejectionReason">Rejection Reason (Optional, if rejecting)</Label>
                  <Textarea
                    id="rejectionReason"
                    placeholder="Enter reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {viewingBid && viewingBid.status !== "Accepted" && (
              <Button onClick={() => handleChangeBidStatus(viewingBid.id, "Accepted")}>
                <CheckCircle className="mr-2 h-4 w-4" /> Accept Bid
              </Button>
            )}
            {viewingBid && viewingBid.status !== "Rejected" && (
              <Button variant="destructive" onClick={() => handleChangeBidStatus(viewingBid.id, "Rejected")}>
                <XCircle className="mr-2 h-4 w-4" /> Reject Bid
              </Button>
            )}
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

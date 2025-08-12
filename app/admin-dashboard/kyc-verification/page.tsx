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
import { MoreHorizontal, Search, Eye, CheckCircle, XCircle, RotateCcw } from "lucide-react"
import { sampleKYCRequests, type KYCRequest, type KYCStatus } from "@/lib/mock-data"
import { format } from "date-fns"

export default function AdminKYCVerificationPage() {
  const [kycRequests, setKycRequests] = useState<KYCRequest[]>(sampleKYCRequests)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewingRequest, setViewingRequest] = useState<KYCRequest | null>(null)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  const filteredRequests = kycRequests.filter(
    (req) =>
      req.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.idType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewClick = (request: KYCRequest) => {
    setViewingRequest(request)
    setRejectionReason("") // Clear previous rejection reason
    setShowViewDialog(true)
  }

  const handleChangeStatus = (requestId: string, newStatus: KYCStatus) => {
    setKycRequests(
      kycRequests.map((req) =>
        req.id === requestId
          ? { ...req, status: newStatus, rejectionReason: newStatus === "rejected" ? rejectionReason : undefined }
          : req,
      ),
    )
    setShowViewDialog(false) // Close dialog after action
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-gray-900">KYC & Verification</h1>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Pending Verifications
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Name</TableHead>
                <TableHead>ID Type</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.userName}</TableCell>
                    <TableCell>{request.idType}</TableCell>
                    <TableCell>{format(new Date(request.submittedAt), "PPP")}</TableCell>
                    <TableCell className="capitalize">{request.status.replace("_", " ")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewClick(request)}>
                            <Eye className="mr-2 h-4 w-4" /> View Documents
                          </DropdownMenuItem>
                          {request.status === "pending" && (
                            <>
                              <DropdownMenuItem onClick={() => handleChangeStatus(request.id, "verified")}>
                                <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" /> Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setViewingRequest(request)
                                  setShowViewDialog(true)
                                }}
                                className="text-red-600"
                              >
                                <XCircle className="mr-2 h-4 w-4" /> Reject
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleChangeStatus(request.id, "resubmission_requested")}
                              >
                                <RotateCcw className="mr-2 h-4 w-4" /> Ask for Resubmission
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    No KYC requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View KYC Request Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>KYC Details for {viewingRequest?.userName}</DialogTitle>
          </DialogHeader>
          {viewingRequest && (
            <div className="grid gap-4 py-4">
              <p>
                <span className="font-semibold">User:</span> {viewingRequest.userName}
              </p>
              <p>
                <span className="font-semibold">ID Type:</span> {viewingRequest.idType}
              </p>
              <p>
                <span className="font-semibold">Submitted At:</span>{" "}
                {format(new Date(viewingRequest.submittedAt), "PPP")}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span className="capitalize">{viewingRequest.status.replace("_", " ")}</span>
              </p>
              <div>
                <span className="font-semibold">Document:</span>
                <img
                  src={viewingRequest.documentUrl || "/placeholder.svg"}
                  alt={`${viewingRequest.idType} document`}
                  className="mt-2 max-w-full h-auto border rounded-md"
                />
              </div>
              {viewingRequest.status === "rejected" && viewingRequest.rejectionReason && (
                <div>
                  <span className="font-semibold text-red-600">Rejection Reason:</span>
                  <p className="mt-1 text-red-700">{viewingRequest.rejectionReason}</p>
                </div>
              )}
              {viewingRequest.status === "pending" && (
                <div className="grid gap-2 mt-4">
                  <Label htmlFor="rejectionReason">Rejection Reason (Optional, if rejecting)</Label>
                  <Textarea
                    id="rejectionReason"
                    placeholder="Enter reason for rejection or resubmission request..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {viewingRequest && viewingRequest.status === "pending" && (
              <>
                <Button onClick={() => handleChangeStatus(viewingRequest.id, "verified")}>
                  <CheckCircle className="mr-2 h-4 w-4" /> Approve
                </Button>
                <Button variant="destructive" onClick={() => handleChangeStatus(viewingRequest.id, "rejected")}>
                  <XCircle className="mr-2 h-4 w-4" /> Reject
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleChangeStatus(viewingRequest.id, "resubmission_requested")}
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Ask for Resubmission
                </Button>
              </>
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

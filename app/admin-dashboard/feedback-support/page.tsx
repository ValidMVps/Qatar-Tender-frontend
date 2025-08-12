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
import { MoreHorizontal, Search, Eye, CheckCircle, XCircle, User } from "lucide-react"
import { sampleSupportTickets, type SupportTicket, type SupportTicketStatus } from "@/lib/mock-data"
import { format } from "date-fns"

export default function AdminFeedbackSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(sampleSupportTickets)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [viewingTicket, setViewingTicket] = useState<SupportTicket | null>(null)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [resolutionNotes, setResolutionNotes] = useState("")

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.priority.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "open") return matchesSearch && ticket.status === "open"
    if (activeTab === "pending") return matchesSearch && ticket.status === "pending"
    if (activeTab === "resolved") return matchesSearch && ticket.status === "resolved"
    if (activeTab === "closed") return matchesSearch && ticket.status === "closed"
    return matchesSearch
  })

  const handleViewClick = (ticket: SupportTicket) => {
    setViewingTicket(ticket)
    setResolutionNotes(ticket.resolutionNotes || "")
    setShowViewDialog(true)
  }

  const handleChangeStatus = (ticketId: string, newStatus: SupportTicketStatus) => {
    setTickets(
      tickets.map((t) =>
        t.id === ticketId
          ? { ...t, status: newStatus, resolutionNotes: newStatus === "resolved" ? resolutionNotes : undefined }
          : t,
      ),
    )
    setShowViewDialog(false) // Close dialog after action
  }

  const handleAssignTo = (ticketId: string, assignee: string) => {
    setTickets(tickets.map((t) => (t.id === ticketId ? { ...t, assignedTo: assignee, status: "pending" } : t)))
    alert(`Ticket ${ticketId} assigned to ${assignee}.`)
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-gray-900">Feedback & Support Tickets</h1>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Support Tickets
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search tickets..."
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
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>
          </Tabs>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.subject}</TableCell>
                    <TableCell>{ticket.reportedBy}</TableCell>
                    <TableCell className="capitalize">{ticket.priority}</TableCell>
                    <TableCell className="capitalize">{ticket.status}</TableCell>
                    <TableCell>{ticket.assignedTo || "Unassigned"}</TableCell>
                    <TableCell>{format(new Date(ticket.createdAt), "PPP")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewClick(ticket)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          {ticket.status !== "resolved" && ticket.status !== "closed" && (
                            <>
                              <DropdownMenuItem onClick={() => handleChangeStatus(ticket.id, "resolved")}>
                                <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" /> Mark Resolved
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleChangeStatus(ticket.id, "closed")}>
                                <XCircle className="mr-2 h-4 w-4" /> Close Ticket
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAssignTo(ticket.id, "Admin User")}>
                                <User className="mr-2 h-4 w-4" /> Assign to Me
                              </DropdownMenuItem>
                            </>
                          )}
                          {ticket.status === "resolved" && (
                            <DropdownMenuItem onClick={() => handleChangeStatus(ticket.id, "closed")}>
                              <XCircle className="mr-2 h-4 w-4" /> Close Ticket
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    No support tickets found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Ticket Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ticket: {viewingTicket?.subject}</DialogTitle>
          </DialogHeader>
          {viewingTicket && (
            <div className="grid gap-4 py-4">
              <p>
                <span className="font-semibold">Reported By:</span> {viewingTicket.reportedBy}
              </p>
              <p>
                <span className="font-semibold">Priority:</span>{" "}
                <span className="capitalize">{viewingTicket.priority}</span>
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span className="capitalize">{viewingTicket.status}</span>
              </p>
              <p>
                <span className="font-semibold">Assigned To:</span> {viewingTicket.assignedTo || "Unassigned"}
              </p>
              <p>
                <span className="font-semibold">Created At:</span> {format(new Date(viewingTicket.createdAt), "PPP")}
              </p>
              <div>
                <span className="font-semibold">Description:</span>
                <p className="mt-1 text-gray-700">{viewingTicket.description}</p>
              </div>
              {(viewingTicket.status === "resolved" || viewingTicket.status === "closed") && (
                <div>
                  <span className="font-semibold">Resolution Notes:</span>
                  <p className="mt-1 text-gray-700">{viewingTicket.resolutionNotes || "N/A"}</p>
                </div>
              )}
              {viewingTicket.status !== "resolved" && viewingTicket.status !== "closed" && (
                <div className="grid gap-2">
                  <Label htmlFor="resolutionNotes">Resolution Notes (if resolving)</Label>
                  <Textarea
                    id="resolutionNotes"
                    placeholder="Add notes about the resolution..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {viewingTicket && viewingTicket.status !== "resolved" && viewingTicket.status !== "closed" && (
              <Button onClick={() => handleChangeStatus(viewingTicket.id, "resolved")}>
                <CheckCircle className="mr-2 h-4 w-4" /> Mark Resolved
              </Button>
            )}
            {viewingTicket && viewingTicket.status !== "closed" && (
              <Button variant="destructive" onClick={() => handleChangeStatus(viewingTicket.id, "closed")}>
                <XCircle className="mr-2 h-4 w-4" /> Close Ticket
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

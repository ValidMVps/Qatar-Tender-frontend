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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Search, Edit, Trash2, Eye, CheckCircle, XCircle, Flag } from "lucide-react"
import { sampleTenders, type Tender, type TenderStatus } from "@/lib/mock-data"

export default function AdminTendersPage() {
  const [tenders, setTenders] = useState<Tender[]>(sampleTenders)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [editingTender, setEditingTender] = useState<Tender | null>(null)
  const [viewingTender, setViewingTender] = useState<Tender | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)

  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch =
      tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.category.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "pending") return matchesSearch && tender.status === "pending_approval"
    if (activeTab === "approved") return matchesSearch && tender.status === "open" // 'open' means approved and active
    if (activeTab === "rejected") return matchesSearch && tender.status === "rejected"
    return matchesSearch
  })

  const handleEditClick = (tender: Tender) => {
    setEditingTender({ ...tender })
    setShowEditDialog(true)
  }

  const handleViewClick = (tender: Tender) => {
    setViewingTender(tender)
    setShowViewDialog(true)
  }

  const handleSaveTender = () => {
    if (editingTender) {
      setTenders(tenders.map((t) => (t.id === editingTender.id ? editingTender : t)))
      setShowEditDialog(false)
      setEditingTender(null)
    }
  }

  const handleDeleteTender = (tenderId: string) => {
    if (confirm("Are you sure you want to delete this tender?")) {
      setTenders(tenders.filter((tender) => tender.id !== tenderId))
    }
  }

  const handleChangeStatus = (tenderId: string, newStatus: TenderStatus) => {
    setTenders(tenders.map((t) => (t.id === tenderId ? { ...t, status: newStatus } : t)))
  }

  const handleFlagTender = (tenderId: string) => {
    alert(`Tender ${tenderId} has been flagged for review.`)
    // In a real app, you'd update the tender status to 'flagged' or add a flag property
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-gray-900">Manage Tenders</h1>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Tender List
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search tenders..."
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
              <TabsTrigger value="all">All Tenders</TabsTrigger>
              <TabsTrigger value="pending">Pending Approval</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenders.length > 0 ? (
                filteredTenders.map((tender) => (
                  <TableRow key={tender.id}>
                    <TableCell className="font-medium">{tender.title}</TableCell>
                    <TableCell>{tender.clientName}</TableCell>
                    <TableCell>{tender.category}</TableCell>
                    <TableCell>{tender.budget}</TableCell>
                    <TableCell>{tender.deadline}</TableCell>
                    <TableCell className="capitalize">{tender.status.replace("_", " ")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewClick(tender)}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditClick(tender)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          {tender.status !== "open" && (
                            <DropdownMenuItem onClick={() => handleChangeStatus(tender.id, "open")}>
                              <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" /> Approve
                            </DropdownMenuItem>
                          )}
                          {tender.status !== "rejected" && (
                            <DropdownMenuItem
                              onClick={() => handleChangeStatus(tender.id, "rejected")}
                              className="text-red-600"
                            >
                              <XCircle className="mr-2 h-4 w-4" /> Reject
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleFlagTender(tender.id)}>
                            <Flag className="mr-2 h-4 w-4" /> Flag Inappropriate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteTender(tender.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    No tenders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Tender Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Tender</DialogTitle>
          </DialogHeader>
          {editingTender && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={editingTender.title}
                  onChange={(e) => setEditingTender({ ...editingTender, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={editingTender.description}
                  onChange={(e) => setEditingTender({ ...editingTender, description: e.target.value })}
                  className="col-span-3 min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="budget" className="text-right">
                  Budget
                </Label>
                <Input
                  id="budget"
                  value={editingTender.budget}
                  onChange={(e) => setEditingTender({ ...editingTender, budget: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Input
                  id="category"
                  value={editingTender.category}
                  onChange={(e) => setEditingTender({ ...editingTender, category: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={editingTender.status}
                  onValueChange={(value: TenderStatus) => setEditingTender({ ...editingTender, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="pending_approval">Pending Approval</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSaveTender}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Tender Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Tender Details</DialogTitle>
          </DialogHeader>
          {viewingTender && (
            <div className="grid gap-4 py-4">
              <p>
                <span className="font-semibold">Title:</span> {viewingTender.title}
              </p>
              <p>
                <span className="font-semibold">Client:</span> {viewingTender.clientName}
              </p>
              <p>
                <span className="font-semibold">Description:</span> {viewingTender.description}
              </p>
              <p>
                <span className="font-semibold">Budget:</span> {viewingTender.budget}
              </p>
              <p>
                <span className="font-semibold">Category:</span> {viewingTender.category}
              </p>
              <p>
                <span className="font-semibold">Location:</span> {viewingTender.location}
              </p>
              <p>
                <span className="font-semibold">Deadline:</span> {viewingTender.deadline}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span className="capitalize">{viewingTender.status.replace("_", " ")}</span>
              </p>
              <p>
                <span className="font-semibold">Bids Count:</span> {viewingTender.bidsCount}
              </p>
              {viewingTender.attachments && viewingTender.attachments.length > 0 && (
                <div>
                  <span className="font-semibold">Attachments:</span>
                  <ul className="list-disc list-inside">
                    {viewingTender.attachments.map((att, idx) => (
                      <li key={idx}>
                        <a
                          href={att}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {att.split("/").pop()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowViewDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

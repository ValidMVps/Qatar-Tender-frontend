"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Search, Edit, Trash2, Eye, CheckCircle, XCircle, Ban } from "lucide-react"
import { sampleUsers, type User, type UserRole, type UserStatus, type KYCStatus } from "@/lib/mock-data"
import { format } from "date-fns"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(sampleUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [viewingUser, setViewingUser] = useState<User | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && user.status === "active"
    if (activeTab === "inactive") return matchesSearch && user.status === "inactive"
    if (activeTab === "pending_verification") return matchesSearch && user.status === "pending_verification"
    if (activeTab === "individual") return matchesSearch && user.role === "project_owner"
    if (activeTab === "business") return matchesSearch && user.role === "service_provider"
    return matchesSearch
  })

  const handleEditClick = (user: User) => {
    setEditingUser({ ...user }) // Create a copy to avoid direct state mutation
    setShowEditDialog(true)
  }

  const handleViewClick = (user: User) => {
    setViewingUser(user)
    setShowViewDialog(true)
  }

  const handleSaveUser = () => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)))
      setShowEditDialog(false)
      setEditingUser(null)
    }
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== userId))
    }
  }

  const handleSuspendUser = (userId: string) => {
    if (confirm("Are you sure you want to suspend this user?")) {
      setUsers(users.map((u) => (u.id === userId ? { ...u, status: "inactive" } : u)))
    }
  }

  const handleKYCStatusChange = (userId: string, newStatus: KYCStatus) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? {
              ...u,
              kycStatus: newStatus,
              status: newStatus === "verified" ? "active" : u.status, // Set user to active if KYC is verified
            }
          : u,
      ),
    )
    setShowViewDialog(false) // Close dialog after action
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            User List
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users..."
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
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="pending_verification">Pending KYC</TabsTrigger>
              <TabsTrigger value="individual">Individual</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
            </TabsList>
          </Tabs>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead>Member Since</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.role.replace("_", " ")}</TableCell>
                    <TableCell className="capitalize">{user.status.replace("_", " ")}</TableCell>
                    <TableCell className="capitalize">{user.kycStatus?.replace("_", " ") || "N/A"}</TableCell>
                    <TableCell>{format(new Date(user.memberSince), "PPP")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewClick(user)}>
                            <Eye className="mr-2 h-4 w-4" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditClick(user)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit User
                          </DropdownMenuItem>
                          {user.status === "active" && (
                            <DropdownMenuItem onClick={() => handleSuspendUser(user.id)}>
                              <Ban className="mr-2 h-4 w-4" /> Suspend User
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value: UserRole) => setEditingUser({ ...editingUser, role: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="project_owner">Project Owner</SelectItem>
                    <SelectItem value="service_provider">Service Provider</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={editingUser.status}
                  onValueChange={(value: UserStatus) => setEditingUser({ ...editingUser, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending_verification">Pending Verification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="kycStatus" className="text-right">
                  KYC Status
                </Label>
                <Select
                  value={editingUser.kycStatus}
                  onValueChange={(value: KYCStatus) => setEditingUser({ ...editingUser, kycStatus: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select KYC status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="resubmission_requested">Resubmission Requested</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSaveUser}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>User Details: {viewingUser?.name}</DialogTitle>
          </DialogHeader>
          {viewingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-1">
                <span className="font-semibold">Name:</span>
                <span>{viewingUser.name}</span>
                <span className="font-semibold">Email:</span>
                <span>{viewingUser.email}</span>
                <span className="font-semibold">Role:</span>
                <span className="capitalize">{viewingUser.role.replace("_", " ")}</span>
                <span className="font-semibold">Status:</span>
                <span className="capitalize">{viewingUser.status.replace("_", " ")}</span>
                <span className="font-semibold">KYC Status:</span>
                <span className="capitalize">{viewingUser.kycStatus?.replace("_", " ") || "N/A"}</span>
                <span className="font-semibold">Member Since:</span>
                <span>{format(new Date(viewingUser.memberSince), "PPP")}</span>
                <span className="font-semibold">Last Login:</span>
                <span>{format(new Date(viewingUser.lastLogin), "PPP")}</span>
                <span className="font-semibold">Tenders Posted:</span>
                <span>{viewingUser.tendersPosted || 0}</span>
                <span className="font-semibold">Bids Placed:</span>
                <span>{viewingUser.bidsPlaced || 0}</span>
              </div>
              {viewingUser.kycDocuments && viewingUser.kycDocuments.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-lg mb-2">KYC Documents</h3>
                  {viewingUser.kycDocuments.map((doc, idx) => (
                    <div key={idx} className="mb-2 border p-2 rounded-md">
                      <p>
                        <span className="font-medium">ID Type:</span> {doc.idType}
                      </p>
                      <p>
                        <span className="font-medium">Submitted At:</span> {format(new Date(doc.submittedAt), "PPP")}
                      </p>
                      <img
                        src={doc.documentUrl || "/placeholder.svg"}
                        alt={`${doc.idType} document`}
                        className="mt-2 max-w-full h-auto"
                      />
                    </div>
                  ))}
                  {viewingUser.kycStatus === "pending" && (
                    <div className="flex gap-2 mt-4">
                      <Button onClick={() => handleKYCStatusChange(viewingUser.id, "verified")}>
                        <CheckCircle className="mr-2 h-4 w-4" /> Approve KYC
                      </Button>
                      <Button variant="destructive" onClick={() => handleKYCStatusChange(viewingUser.id, "rejected")}>
                        <XCircle className="mr-2 h-4 w-4" /> Reject KYC
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleKYCStatusChange(viewingUser.id, "resubmission_requested")}
                      >
                        Ask for Resubmission
                      </Button>
                    </div>
                  )}
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

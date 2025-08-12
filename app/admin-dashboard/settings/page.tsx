"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { tenderCategories } from "@/lib/mock-data"
import { Plus, Trash2 } from "lucide-react"

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("TenderHub Qatar")
  const [adminEmail, setAdminEmail] = useState("admin@tenderhub.qa")
  const [welcomeMessage, setWelcomeMessage] = useState("Every Project Size, One Platform")
  const [autoApproveUsers, setAutoApproveUsers] = useState(true)
  const [enableKyc, setEnableKyc] = useState(true)
  const [requireTenderApproval, setRequireTenderApproval] = useState(true)
  const [enableBidFee, setEnableBidFee] = useState(true)
  const [bidFeeAmount, setBidFeeAmount] = useState(100)
  const [defaultTenderDeadline, setDefaultTenderDeadline] = useState(30)
  const [categories, setCategories] = useState<string[]>(tenderCategories)
  const [newCategory, setNewCategory] = useState("")
  const [moderators, setModerators] = useState(["admin@example.com", "support@example.com"])
  const [newModerator, setNewModerator] = useState("")

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()])
      setNewCategory("")
    }
  }

  const handleRemoveCategory = (categoryToRemove: string) => {
    setCategories(categories.filter((cat) => cat !== categoryToRemove))
  }

  const handleAddModerator = () => {
    if (newModerator.trim() && !moderators.includes(newModerator.trim())) {
      setModerators([...moderators, newModerator.trim()])
      setNewModerator("")
    }
  }

  const handleRemoveModerator = (modToRemove: string) => {
    setModerators(moderators.filter((mod) => mod !== modToRemove))
  }

  const handleSaveSettings = () => {
    // In a real application, you would send these settings to your backend API
    console.log("Saving settings:", {
      siteName,
      adminEmail,
      welcomeMessage,
      autoApproveUsers,
      enableKyc,
      requireTenderApproval,
      enableBidFee,
      bidFeeAmount,
      defaultTenderDeadline,
      categories,
      moderators,
    })
    alert("Settings saved successfully!")
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input id="site-name" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Admin Contact Email</Label>
              <Input id="admin-email" type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="welcome-message">Welcome Message (Landing Page)</Label>
            <Textarea id="welcome-message" value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>User Management Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-approve-new-users">Automatically approve new user registrations</Label>
            <Switch id="auto-approve-new-users" checked={autoApproveUsers} onCheckedChange={setAutoApproveUsers} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="enable-kyc">Enable KYC/AML verification for all users</Label>
            <Switch id="enable-kyc" checked={enableKyc} onCheckedChange={setEnableKyc} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Tender & Bid Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="tender-approval">Require admin approval for new tenders</Label>
            <Switch id="tender-approval" checked={requireTenderApproval} onCheckedChange={setRequireTenderApproval} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="bid-fee">Enable bid submission fee</Label>
            <Switch id="bid-fee" checked={enableBidFee} onCheckedChange={setEnableBidFee} />
          </div>
          {enableBidFee && (
            <div className="space-y-2">
              <Label htmlFor="bid-fee-amount">Bid Fee Amount (QAR)</Label>
              <Input
                id="bid-fee-amount"
                type="number"
                value={bidFeeAmount}
                onChange={(e) => setBidFeeAmount(Number(e.target.value))}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="default-tender-deadline">Default Tender Deadline (days)</Label>
            <Input
              id="default-tender-deadline"
              type="number"
              value={defaultTenderDeadline}
              onChange={(e) => setDefaultTenderDeadline(Number(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button onClick={handleAddCategory}>
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center justify-between rounded-md border p-2">
                <span>{category}</span>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveCategory(category)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Manage Platform Moderators</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add new moderator email"
              type="email"
              value={newModerator}
              onChange={(e) => setNewModerator(e.target.value)}
            />
            <Button onClick={handleAddModerator}>
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
          <div className="space-y-2">
            {moderators.map((moderator) => (
              <div key={moderator} className="flex items-center justify-between rounded-md border p-2">
                <span>{moderator}</span>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveModerator(moderator)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>Save All Settings</Button>
      </div>
    </div>
  )
}

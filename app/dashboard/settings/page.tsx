"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Bell, Lock, Globe, CreditCard, Palette } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")

  // State for General Settings (Individual Profile)
  const [fullName, setFullName] = useState("John Doe")
  const [username, setUsername] = useState("johndoe") // Added username
  const [email, setEmail] = useState("john.doe@example.com")
  const [phoneNumber, setPhoneNumber] = useState("+974 5512 3456")
  const [sex, setSex] = useState("male") // Added sex
  const [address, setAddress] = useState("Doha, Qatar")

  // State for Notification Settings
  const [newBidNotification, setNewBidNotification] = useState(true)
  const [tenderStatusNotification, setTenderStatusNotification] = useState(true)
  const [messageNotification, setMessageNotification] = useState(true)

  // State for Security Settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // State for Language Settings
  const [appLanguage, setAppLanguage] = useState("en")
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY")
  const [timeFormat, setTimeFormat] = useState("24h")

  // State for Personalization Settings
  const [theme, setTheme] = useState("system") // 'light', 'dark', 'system'
  const [fontSize, setFontSize] = useState("medium") // 'small', 'medium', 'large'
  const [layoutDensity, setLayoutDensity] = useState("default") // 'compact', 'default', 'spacious'
  const [enableAnimations, setEnableAnimations] = useState(true)

  const handleSubmitGeneral = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("General settings saved:", { fullName, username, email, phoneNumber, sex, address }) // Updated console log
    // Add API call to save settings
  }

  const handleSubmitNotifications = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Notification settings saved:", {
      newBidNotification,
      tenderStatusNotification,
      messageNotification,
    })
    // Add API call to save settings
  }

  const handleSubmitSecurity = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Security settings saved:", { twoFactorAuth, newPassword })
    // Add API call to save settings
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleSubmitLanguage = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Language settings saved:", { appLanguage, dateFormat, timeFormat })
    // Add API call to save settings
  }

  const handleSubmitPersonalization = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Personalization settings saved:", { theme, fontSize, layoutDensity, enableAnimations })
    // Add API call to save settings
  }

  const handleSubmitBilling = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Billing action triggered.")
    // This would typically trigger a redirect to a billing portal or open a modal
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation for Settings */}
        <Card className="w-full md:w-64 flex-shrink-0 border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <nav className="space-y-1">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  activeTab === "general" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("general")}
              >
                <User className="h-4 w-4 mr-2" /> General
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  activeTab === "notifications" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("notifications")}
              >
                <Bell className="h-4 w-4 mr-2" /> Notifications
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  activeTab === "security" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("security")}
              >
                <Lock className="h-4 w-4 mr-2" /> Security
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  activeTab === "language" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("language")}
              >
                <Globe className="h-4 w-4 mr-2" /> Language & Region
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  activeTab === "personalization" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("personalization")}
              >
                <Palette className="h-4 w-4 mr-2" /> Personalization
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  activeTab === "billing" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("billing")}
              >
                <CreditCard className="h-4 w-4 mr-2" /> Billing
              </Button>
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="flex-1">
          {activeTab === "general" && (
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">General Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitGeneral} className="space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your Full Name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Your Username"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+974 XXXX XXXX"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sex">Sex</Label>
                    <Select value={sex} onValueChange={setSex}>
                      <SelectTrigger id="sex">
                        <SelectValue placeholder="Select sex" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Your address"
                    />
                  </div>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Notification Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitNotifications} className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800">Alerts</h4>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="newBidNotification">New Bid Received</Label>
                      <Switch
                        id="newBidNotification"
                        checked={newBidNotification}
                        onCheckedChange={setNewBidNotification}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="tenderStatusNotification">Tender Status Updates</Label>
                      <Switch
                        id="tenderStatusNotification"
                        checked={tenderStatusNotification}
                        onCheckedChange={setTenderStatusNotification}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="messageNotification">New Messages</Label>
                      <Switch
                        id="messageNotification"
                        checked={messageNotification}
                        onCheckedChange={setMessageNotification}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitSecurity} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <Switch id="twoFactorAuth" checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                    Update Security
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "language" && (
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Language & Region</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitLanguage} className="space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="appLanguage">Application Language</Label>
                    <Select value={appLanguage} onValueChange={setAppLanguage}>
                      <SelectTrigger id="appLanguage">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">العربية (Arabic)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select value={dateFormat} onValueChange={setDateFormat}>
                      <SelectTrigger id="dateFormat">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="timeFormat">Time Format</Label>
                    <Select value={timeFormat} onValueChange={setTimeFormat}>
                      <SelectTrigger id="timeFormat">
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">24-hour (e.g., 14:30)</SelectItem>
                        <SelectItem value="12h">12-hour (e.g., 02:30 PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "personalization" && (
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Personalization</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitPersonalization} className="space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System Preference</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fontSize">Font Size</Label>
                    <Select value={fontSize} onValueChange={setFontSize}>
                      <SelectTrigger id="fontSize">
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="layoutDensity">Layout Density</Label>
                    <Select value={layoutDensity} onValueChange={setLayoutDensity}>
                      <SelectTrigger id="layoutDensity">
                        <SelectValue placeholder="Select layout density" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="spacious">Spacious</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableAnimations">Enable Animations</Label>
                    <Switch id="enableAnimations" checked={enableAnimations} onCheckedChange={setEnableAnimations} />
                  </div>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "billing" && (
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Billing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Add Payment Information Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Add Payment Information</h3>
                    <p className="text-gray-600 mb-4">
                      Securely add your credit card or other payment methods to manage your subscriptions.
                    </p>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">Add Payment Method</Button>
                  </div>

                  {/* View Billing History Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">View Billing History</h3>
                    <p className="text-gray-600 mb-4">
                      Access your past invoices, payment receipts, and subscription details.
                    </p>
                    <Button
                      variant="outline"
                      className="bg-transparent border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                    >
                      View History
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

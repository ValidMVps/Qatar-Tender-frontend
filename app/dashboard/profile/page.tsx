"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/file-upload"
import { CountryCodeSelect } from "@/components/country-code-select"
import { useToast } from "@/components/ui/use-toast"

interface UserProfile {
  fullName: string
  email: string
  mobile: string
  countryCode: string
  nationalId: string
  nationalIdFile: File | null
  bio: string
  skills: string
  portfolioLink: string
}

export default function ProfilePage() {
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "",
    email: "",
    mobile: "",
    countryCode: "+974",
    nationalId: "",
    nationalIdFile: null,
    bio: "",
    skills: "",
    portfolioLink: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching user data
    const fetchUserData = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay
      const userDataString = localStorage.getItem("userData")
      if (userDataString) {
        const userData = JSON.parse(userDataString)
        setProfile({
          fullName: userData.fullName || "John Doe",
          email: userData.email || "john.doe@example.com",
          mobile: userData.mobile || "12345678",
          countryCode: userData.countryCode || "+974",
          nationalId: userData.nationalId || "",
          nationalIdFile: userData.nationalIdFile || null,
          bio: "Experienced professional seeking new opportunities in various projects.",
          skills: "Project Management, Data Analysis, Communication",
          portfolioLink: "https://johndoe.com",
        })
      }
      setIsLoading(false)
    }
    fetchUserData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setProfile((prev) => ({ ...prev, [id]: value }))
  }

  const handleFileChange = (file: File | null, field: keyof UserProfile) => {
    setProfile((prev) => ({ ...prev, [field]: file }))
  }

  const handleCountryCodeChange = (value: string) => {
    setProfile((prev) => ({ ...prev, countryCode: value }))
  }

  const handleSave = async () => {
    setIsEditing(false)
    // Simulate API call to save data
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Profile saved:", profile)
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully saved.",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <Input
              id="fullName"
              value={profile.fullName}
              onChange={handleChange}
              disabled={!isEditing}
              className="bg-white border-gray-300"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="bg-white border-gray-300"
            />
          </div>
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <div className="flex space-x-3">
              <div className="w-32">
                <CountryCodeSelect
                  value={profile.countryCode}
                  onChange={handleCountryCodeChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex-1">
                <Input
                  id="mobile"
                  type="tel"
                  value={profile.mobile}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="bg-white border-gray-300"
                />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 mb-1">
              National ID Number
            </label>
            <Input
              id="nationalId"
              value={profile.nationalId}
              onChange={handleChange}
              disabled={!isEditing}
              className="bg-white border-gray-300"
            />
          </div>
          <FileUpload
            label="Upload National ID"
            accept=".pdf,.jpg,.jpeg,.png"
            value={profile.nationalIdFile}
            onChange={(file) => handleFileChange(file, "nationalIdFile")}
            disabled={!isEditing}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Professional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={handleChange}
              disabled={!isEditing}
              rows={4}
              placeholder="Tell us about yourself..."
              className="bg-white border-gray-300"
            />
          </div>
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
              Skills (comma-separated)
            </label>
            <Input
              id="skills"
              value={profile.skills}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="e.g., Project Management, Data Analysis"
              className="bg-white border-gray-300"
            />
          </div>
          <div>
            <label htmlFor="portfolioLink" className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio Link
            </label>
            <Input
              id="portfolioLink"
              type="url"
              value={profile.portfolioLink}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="https://your-portfolio.com"
              className="bg-white border-gray-300"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
              Save Changes
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)} className="bg-emerald-600 hover:bg-emerald-700">
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  )
}

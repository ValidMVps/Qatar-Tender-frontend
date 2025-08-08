"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/file-upload";
import { useToast } from "@/components/ui/use-toast";
import { AvatarFallback } from "@radix-ui/react-avatar";
import {
  Calendar,
  Camera,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CountryCodeSelect } from "@/components/country-code-select";

interface UserProfile {
  fullName: string;
  email: string;
  mobile: string;
  address: string;
  countryCode: string;
  nationalId: string;
  nationalIdFile: File | null;
  bio: string;
  skills: string;
  portfolioLink: string;
}

export default function ProfilePage() {
  const { toast } = useToast();

  const [profile, setProfile] = useState<UserProfile>({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    countryCode: "+974",
    nationalId: "",
    nationalIdFile: null,
    bio: "",
    skills: "",
    portfolioLink: "",
  });

  const [tempProfile, setTempProfile] = useState<UserProfile>({ ...profile });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [completion, setCompletion] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState<
    "unverified" | "reviewing" | "verified" | "rejected"
  >("unverified");

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const userData = {
        fullName: "John Doe",
        email: "john.doe@example.com",
        mobile: "12345678",
        address: "",
        countryCode: "+974",
        nationalId: "",
        nationalIdFile: null,
        bio: "Experienced professional seeking new opportunities.",
        skills: "Project Management, Data Analysis",
        portfolioLink: "https://johndoe.com",
      };
      setProfile(userData);
      setTempProfile(userData);
      setIsLoading(false);
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fields = [
      profile.fullName,
      profile.email,
      profile.mobile,
      profile.address,
      profile.countryCode,
      profile.nationalId,
      profile.nationalIdFile,
      profile.bio,
      profile.skills,
      profile.portfolioLink,
    ];
    const filled = fields.filter(Boolean).length;
    setCompletion(Math.round((filled / fields.length) * 100));
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setTempProfile((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (file: File | null, field: keyof UserProfile) => {
    setTempProfile((prev) => ({ ...prev, [field]: file }));
  };

  const handleCountryCodeChange = (value: string) => {
    setTempProfile((prev) => ({ ...prev, countryCode: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempProfile({ ...profile });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempProfile({ ...profile });
  };

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setProfile({ ...tempProfile });
    setIsEditing(false);
    setIsLoading(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved.",
    });
  };

  const handleVerify = () => {
    setVerificationStatus("reviewing");
    toast({
      title: "Verification Submitted",
      description: "Your documents are under review.",
    });

    setTimeout(() => {
      const outcome = Math.random() < 0.5 ? "verified" : "rejected";
      setVerificationStatus(outcome as "verified" | "rejected");

      toast({
        title:
          outcome === "verified" ? "Verified ✅" : "Verification Rejected ❌",
        description:
          outcome === "verified"
            ? "You're verified now!"
            : "Your submission was rejected. Please try again.",
      });
    }, 3000);
  };

  const displayProfile = isEditing ? tempProfile : profile;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto px-0 py-8">
      <Card className="border-0 bg-transparent">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src="https://bundui-images.netlify.app/avatars/08.png"
                  alt="Profile"
                />
                <AvatarFallback className="text-2xl">JD</AvatarFallback>
              </Avatar>
              {verificationStatus !== "verified" && (
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
                >
                  <Camera />
                </Button>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{profile.fullName}</h1>
                {verificationStatus === "verified" && (
                  <CheckCircle className="text-green-600" size={20} />
                )}
                {verificationStatus === "reviewing" && (
                  <Clock className="text-yellow-500" size={20} />
                )}
                {verificationStatus === "rejected" && (
                  <XCircle className="text-red-500" size={20} />
                )}
              </div>
              <p className="text-muted-foreground">Senior Product Designer</p>
              <div className="text-muted-foreground flex gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Mail className="size-4" />
                  {profile.email}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  Joined March 2023
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              {completion < 100 && (
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-blue-500"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${completion}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-700">
                      {completion}%
                    </span>
                  </div>
                </div>
              )}
              {verificationStatus === "unverified" && completion === 100 && (
                <Button
                  className="bg-green-500"
                  onClick={handleVerify}
                >
                  <CheckCircle /> Verify Account
                </Button>
              )}
              {verificationStatus === "reviewing" && (
                <p className="text-yellow-600 text-sm md:text-base font-semibold">
                  Under Review...
                </p>
              )}
              {verificationStatus === "verified" && (
                <p className="text-green-600 text-sm md:text-base font-semibold">
                  Verified
                </p>
              )}
              {verificationStatus === "rejected" && (
                <div className="flex flex-col items-center gap-2 text-center">
                  <p className="text-red-600 text-sm md:text-base font-semibold">
                    Your verification was rejected. Please check your info and
                    try again.
                  </p>
                  <Button
                    size="sm"
                    onClick={handleVerify}
                    variant="destructive"
                  >
                    Reapply Verification
                  </Button>
                </div>
              )}
            </div>

            {(verificationStatus === "unverified" ||
              verificationStatus === "rejected") &&
              (isEditing ? (
                <div className="flex flex-col gap-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save</Button>
                </div>
              ) : (
                <Button onClick={handleEdit}>Edit Profile</Button>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Personal Info Section */}
      <Card className="border-0 bg-transparent">
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="fullName" className="text-sm font-medium">
              Full Name
            </label>
            <Input
              id="fullName"
              value={displayProfile.fullName}
              onChange={handleChange}
              disabled={!isEditing || verificationStatus === "verified"}
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={displayProfile.email}
              disabled
            />
          </div>
          <div>
            <label htmlFor="mobile" className="text-sm font-medium">
              Mobile
            </label>
            <div className="flex space-x-2">
              <CountryCodeSelect
                value={displayProfile.countryCode}
                onChange={handleCountryCodeChange}
              />
              <Input
                id="mobile"
                type="tel"
                value={displayProfile.mobile}
                onChange={handleChange}
                disabled={!isEditing || verificationStatus === "verified"}
              />
            </div>
          </div>
          <div>
            <label htmlFor="address" className="text-sm font-medium">
              Address
            </label>
            <Input
              id="address"
              value={displayProfile.address}
              onChange={handleChange}
              disabled={!isEditing || verificationStatus === "verified"}
            />
          </div>
        </CardContent>
      </Card>

      {/* Verification Section */}
      <Card className="border-0 bg-transparent">
        <CardHeader>
          <CardTitle className="text-base">Account Verification</CardTitle>
          <p className="text-sm text-muted-foreground">
            This info is used to verify your identity.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="nationalId" className="text-sm font-medium">
              National ID
            </label>
            <Input
              id="nationalId"
              value={displayProfile.nationalId}
              onChange={handleChange}
              disabled={!isEditing || verificationStatus === "verified"}
            />
          </div>
          <FileUpload
            label="Upload National ID (PDF, JPG, PNG)"
            accept=".pdf,.jpg,.jpeg,.png"
            value={displayProfile.nationalIdFile}
            onChange={(file) => handleFileChange(file, "nationalIdFile")}
          />
        </CardContent>
      </Card>
    </div>
  );
}

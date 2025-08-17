"use client";

import type React from "react";

import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from '../../../lib/hooks/useTranslation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CameraIcon,
  MailIcon,
  CalendarIcon,
  CheckCircleIcon,
  SaveIcon,
  XIcon,
  UploadIcon,
} from "lucide-react";

export default function Component() {
    const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(75); // Example value
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    mobileCountryCode: "US",
    mobileNumber: "123-456-7890",
    address: "123 Main St, Anytown, USA",
    nationalId: "123-456-789",
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // In a real application, you would send this data to a backend
    console.log("Saving profile data:", profileData);
    setIsEditing(false);
    // Simulate profile completion update
    updateProfileCompletion();
  };

  const handleCancelClick = () => {
    // Reset to original data or fetch again
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    updateProfileCompletion();
  };

  const handleSelectChange = (value: string) => {
    setProfileData((prevData) => ({
      ...prevData,
      mobileCountryCode: value,
    }));
    updateProfileCompletion();
  };

  const updateProfileCompletion = () => {
    let completedFields = 0;
    if (profileData.fullName) completedFields++;
    if (profileData.email) completedFields++;
    if (profileData.mobileNumber) completedFields++;
    if (profileData.address) completedFields++;
    if (profileData.nationalId) completedFields++;

    // Assuming 5 fields for 100% completion
    setProfileCompletion(Math.min(100, (completedFields / 5) * 100));
  };

  const handleCompleteProfileClick = () => {
    setShowCompletionModal(true);
  };

  const handleConfirmCompletion = () => {
    setIsProfileCompleted(true);
    setShowCompletionModal(false);
    setIsEditing(false); // Lock editing after completion
  };

  const handleCloseModal = () => {
    setShowCompletionModal(false);
  };

  const areInputsDisabled = !isEditing || isProfileCompleted;

  return (
    <div className="flex min-h-screen bg-white container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex-1 flex flex-col">
        {/* Profile Content */}
        <main className="flex-1 p-0 sm:p-6 overflow-auto">
          {/* Profile Summary Section (Full Width) */}
          <div className="pb-6 mb-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between flex-wrap gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="relative">
                  <Avatar className="w-20 h-20 md:w-28 md:h-28">
                    <AvatarImage
                      src="https://bundui-images.netlify.app/avatars/08.png"
                      alt="John Doe"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full bg-white border border-gray-200 shadow-sm w-8 h-8 md:w-9 md:h-9"
                  >
                    <CameraIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                  </Button>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    John Doe
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600">
                    Senior Product Designer
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-sm sm:text-base text-gray-500 mt-3">
                    <div className="flex items-center gap-2">
                      <MailIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>john.doe@example.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Joined March 2023</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                {isProfileCompleted ? (
                  <div className="flex items-center gap-2 text-blue-600 font-medium">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>Verification Pending</span>
                  </div>
                ) : !isEditing ? (
                  <Button
                    onClick={handleEditClick}
                    className="bg-[#5A4DFF] hover:bg-[#4a3dff] text-white rounded-md px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSaveClick}
                      className="bg-green-500 hover:bg-green-600 text-white rounded-md px-4 py-2 sm:px-6 sm:py-2 flex items-center gap-2 text-sm sm:text-base"
                    >
                      <SaveIcon className="w-4 h-4" />
                      Save Changes
                    </Button>
                    <Button
                      onClick={handleCancelClick}
                      variant="outline"
                      className="rounded-md px-4 py-2 sm:px-6 sm:py-2 flex items-center gap-2 bg-transparent text-sm sm:text-base"
                    >
                      <XIcon className="w-4 h-4" />
                      {t('cancel')}
                    </Button>
                  </>
                )}
              </div>
            </div>
            {/* Profile Completion Bar */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-gray-700 font-semibold text-sm sm:text-base">
                  Profile Completion
                </Label>
                <span className="text-sm font-medium text-gray-700">
                  {profileCompletion}%
                </span>
              </div>
              <Progress
                value={profileCompletion}
                className="h-3 bg-gray-200 [&>*]:bg-[#5A4DFF]"
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Complete your profile to unlock all features.
              </p>
              {profileCompletion === 100 && !isProfileCompleted && (
                <Button
                  onClick={handleCompleteProfileClick}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base"
                >
                  Complete Profile
                </Button>
              )}
            </div>
          </div>
          {/* Tabbed Profile Form */}
          <Tabs defaultValue="profile-details" className="w-full mt-6">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1">
              <TabsTrigger
                value="profile-details"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md text-sm sm:text-base"
              >
                Profile Details
              </TabsTrigger>
              <TabsTrigger
                value="account-verification"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md text-sm sm:text-base"
              >
                Account Verification
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profile-details" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="fullName"
                    className="text-gray-700 text-sm sm:text-base"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={handleInputChange}
                    disabled={areInputsDisabled}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="email"
                    className="text-gray-700 text-sm sm:text-base"
                  >
                    {t('email')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={areInputsDisabled}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="mobile"
                    className="text-gray-700 text-sm sm:text-base"
                  >
                    {t('mobile')}
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Select
                      value={profileData.mobileCountryCode}
                      onValueChange={handleSelectChange}
                      disabled={areInputsDisabled}
                    >
                      <SelectTrigger className="w-[100px] sm:w-[120px]">
                        <SelectValue placeholder={t('country')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="QA">QA +974</SelectItem>
                        <SelectItem value="US">US +1</SelectItem>
                        <SelectItem value="UK">UK +44</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="mobileNumber"
                      value={profileData.mobileNumber}
                      onChange={handleInputChange}
                      disabled={areInputsDisabled}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="address"
                    className="text-gray-700 text-sm sm:text-base"
                  >
                    {t('address')}
                  </Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    disabled={areInputsDisabled}
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="account-verification" className="pt-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Account Verification
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4">
                    This info is used to verify your identity.
                  </p>
                  <Label
                    htmlFor="nationalId"
                    className="text-gray-700 text-sm sm:text-base"
                  >
                    National ID
                  </Label>
                  <Input
                    id="nationalId"
                    value={profileData.nationalId}
                    onChange={handleInputChange}
                    disabled={areInputsDisabled}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 text-sm sm:text-base">
                    Upload National ID (PDF, JPG, PNG)
                  </Label>
                  <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center flex flex-col items-center justify-center space-y-3">
                    <UploadIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                    <p className="text-xs sm:text-sm text-gray-600">
                      Drag and drop your file here, or click to browse
                    </p>
                    <Button
                      variant="outline"
                      className="px-4 py-2 sm:px-6 sm:py-2 bg-transparent text-sm sm:text-base"
                      disabled={areInputsDisabled}
                    >
                      Choose File
                    </Button>
                    <p className="text-xs text-gray-500">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      {/* Confirmation Dialog */}
      <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Profile Completion</DialogTitle>
            <DialogDescription>
              Are you sure you want to complete your profile? Once confirmed,
              your profile will be submitted for verification and you will no
              longer be able to edit it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              {t('cancel')}
            </Button>
            <Button
              onClick={handleConfirmCompletion}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {t('confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

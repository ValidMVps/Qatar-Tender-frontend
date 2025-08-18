"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "../../../lib/hooks/useTranslation";
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
  CheckCircleIcon,
  SaveIcon,
  XIcon,
  UploadIcon,
  GlobeIcon,
  PhoneIcon,
} from "lucide-react";

export default function Component() {
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [profileData, setProfileData] = useState({
    companyName: "Qatar Construction Co.",
    contactPersonName: "Jane Doe",
    personalEmail: "jane.doe@example.com",
    companyEmail: "omar545@hotmail.com",
    companyPhoneCountryCode: "QA",
    companyPhoneNumber: "97418995505",
    commercialRegistrationNumber: "123-456-789",
    companyDescription:
      "Leading provider of innovative solutions in the tech industry.",
    companyWebsite: "",
  });

  useEffect(() => {
    updateProfileCompletion();
  }, [profileData]);

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = () => {
    console.log("Saving profile data:", profileData);
    setIsEditing(false);
    updateProfileCompletion();
  };

  const handleCancelClick = () => setIsEditing(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setProfileData((prevData) => ({
      ...prevData,
      companyPhoneCountryCode: value,
    }));
  };

  const updateProfileCompletion = () => {
    let completedFields = 0;
    if (profileData.companyName) completedFields++;
    if (profileData.contactPersonName) completedFields++;
    if (profileData.personalEmail) completedFields++;
    if (profileData.companyEmail) completedFields++;
    if (profileData.companyPhoneNumber) completedFields++;
    if (profileData.commercialRegistrationNumber) completedFields++;
    if (profileData.companyDescription) completedFields++;
    if (profileData.companyWebsite) completedFields++;

    setProfileCompletion(Math.min(100, (completedFields / 8) * 100));
  };

  const handleCompleteProfileClick = () => setShowCompletionModal(true);

  const handleConfirmCompletion = () => {
    setIsProfileCompleted(true);
    setShowCompletionModal(false);
    setIsEditing(false);
  };

  const handleCloseModal = () => setShowCompletionModal(false);

  const areInputsDisabled = !isEditing || isProfileCompleted;

  return (
    <div className="flex min-h-screen bg-white container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-0 sm:p-6 overflow-auto">
          <div className="pb-6 mb-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between flex-wrap gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="relative">
                  <Avatar className="w-20 h-20 md:w-28 md:h-28">
                    <AvatarImage
                      src="/placeholder.svg?height=112&width=112"
                      alt={t("company_logo")}
                    />
                    <AvatarFallback>QC</AvatarFallback>
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
                    {profileData.companyName}
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600">
                    {profileData.companyDescription}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-sm sm:text-base text-gray-500 mt-3">
                    <div className="flex items-center gap-2">
                      <MailIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{profileData.companyEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>
                        {profileData.companyPhoneCountryCode}{" "}
                        {profileData.companyPhoneNumber}
                      </span>
                    </div>
                    {profileData.companyWebsite && (
                      <div className="flex items-center gap-2">
                        <GlobeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <a
                          href={profileData.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {profileData.companyWebsite}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                {isProfileCompleted ? (
                  <div className="flex items-center gap-2 text-blue-600 font-medium">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>{t("verification_pending")}</span>
                  </div>
                ) : !isEditing ? (
                  <Button
                    onClick={handleEditClick}
                    className="bg-[#5A4DFF] hover:bg-[#4a3dff] text-white rounded-md px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base"
                  >
                    {t("edit_profile")}
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSaveClick}
                      className="bg-green-500 hover:bg-green-600 text-white rounded-md px-4 py-2 sm:px-6 sm:py-2 flex items-center gap-2 text-sm sm:text-base"
                    >
                      <SaveIcon className="w-4 h-4" />
                      {t("save_changes")}
                    </Button>
                    <Button
                      onClick={handleCancelClick}
                      variant="outline"
                      className="rounded-md px-4 py-2 sm:px-6 sm:py-2 flex items-center gap-2 bg-transparent text-sm sm:text-base"
                    >
                      <XIcon className="w-4 h-4" />
                      {t("cancel")}
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-gray-700 font-semibold text-sm sm:text-base">
                  {t("profile_completion")}
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
                {t("complete_your_profile_to_unlock_all_features")}
              </p>
              {profileCompletion === 100 && !isProfileCompleted && (
                <Button
                  onClick={handleCompleteProfileClick}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base"
                >
                  {t("complete_profile")}
                </Button>
              )}
            </div>
          </div>
          <Tabs defaultValue="profile-details" className="w-full mt-6">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1">
              <TabsTrigger
                value="profile-details"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md text-sm sm:text-base"
              >
                {t("company_details")}
              </TabsTrigger>
              <TabsTrigger
                value="account-verification"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md text-sm sm:text-base"
              >
                {t("commercial_registration")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profile-details" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="companyName"
                    className="text-gray-700 text-sm sm:text-base"
                  >
                    {t("company_name")}
                  </Label>
                  <Input
                    id="companyName"
                    value={profileData.companyName}
                    onChange={handleInputChange}
                    disabled={areInputsDisabled}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="contactPersonName"
                    className="text-gray-700 text-sm sm:text-base"
                  >
                    {t("contact_person_name")}
                  </Label>
                  <Input
                    id="contactPersonName"
                    value={profileData.contactPersonName}
                    onChange={handleInputChange}
                    disabled={areInputsDisabled}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="personalEmail"
                    className="text-gray-700 text-sm sm:text-base"
                  >
                    {t("personal_email")}
                  </Label>
                  <Input
                    id="personalEmail"
                    type="email"
                    value={profileData.personalEmail}
                    onChange={handleInputChange}
                    disabled={areInputsDisabled}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="companyEmail"
                    className="text-gray-700 text-sm sm:text-base"
                  >
                    {t("company_email")}
                  </Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={profileData.companyEmail}
                    onChange={handleInputChange}
                    disabled={areInputsDisabled}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="companyPhoneNumber"
                    className="text-gray-700 text-sm sm:text-base"
                  >
                    {t("company_phone")}
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Select
                      value={profileData.companyPhoneCountryCode}
                      onValueChange={handleSelectChange}
                      disabled={areInputsDisabled}
                    >
                      <SelectTrigger className="w-[100px] sm:w-[120px]">
                        <SelectValue placeholder={t("country")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="QA">QA +974</SelectItem>
                        <SelectItem value="US">US +1</SelectItem>
                        <SelectItem value="UK">UK +44</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="companyPhoneNumber"
                      value={profileData.companyPhoneNumber}
                      onChange={handleInputChange}
                      disabled={areInputsDisabled}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="companyDescription"
                    className="text-gray-700 text-sm sm:text-base"
                  >
                    {t("company_description")}
                  </Label>
                  <Input
                    id="companyDescription"
                    value={profileData.companyDescription}
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
                    {t("commercial_registration_verification")}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4">
                    {t("this_info_is_used_to_verify_your_company_registration")}
                  </p>
                  <Label
                    htmlFor="commercialRegistrationNumber"
                    className="text-gray-700 text-sm sm:text-base"
                  >
                    {t("commercial_registration_number")}
                  </Label>
                  <Input
                    id="commercialRegistrationNumber"
                    value={profileData.commercialRegistrationNumber}
                    onChange={handleInputChange}
                    disabled={areInputsDisabled}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 text-sm sm:text-base">
                    {t("upload_cr_document_pdf_jpg_png")}
                  </Label>
                  <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center flex flex-col items-center justify-center space-y-3">
                    <UploadIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                    <p className="text-xs sm:text-sm text-gray-600">
                      {t("drag_and_drop_your_file_here_or_click_to_browse")}
                    </p>
                    <Button
                      variant="outline"
                      className="px-4 py-2 sm:px-6 sm:py-2 bg-transparent text-sm sm:text-base"
                      disabled={areInputsDisabled}
                    >
                      {t("choose_file")}
                    </Button>
                    <p className="text-xs text-gray-500">
                      {t("pdf_jpg_png_up_to_10mb")}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("confirm_profile_completion")}</DialogTitle>
            <DialogDescription>
              {t(
                "are_you_sure_you_want_to_complete_your_profile_once_confirmed_your_profile_will_be_submitted_for_verification_and_you_will_no_longer_be_able_to_edit_it"
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleConfirmCompletion}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {t("confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

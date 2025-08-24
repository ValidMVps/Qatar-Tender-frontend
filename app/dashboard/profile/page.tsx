"use client";
import type React from "react";
import { useContext, useEffect, useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Camera,
  Mail,
  CheckCircle,
  Save,
  X,
  Upload,
  Globe,
  Phone,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary";
import { profileApi } from "@/app/services/profileApi";
import { useAuth } from "@/context/AuthContext";

interface ProfileData {
  fullName: string;
  personalEmail: string;
  phone: string;
  address: string;
  companyName: string;
  companyEmail: string;
  contactPersonName: string;
  companyDesc: string;
}

interface DocumentData {
  nationalId: string;
  nationalIdFront: string | null;
  nationalIdBack: string | null;
  commercialRegistrationNumber: string;
  commercialRegistrationDoc: string | null;
}

interface User {
  userType: string;
  email?: string;
  verificationStatus?: string;
}

export default function Component() {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(
    null
  );

  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    personalEmail: "",
    phone: "",
    address: "",
    companyName: "",
    companyEmail: "",
    contactPersonName: "",
    companyDesc: "",
  });

  const [documentData, setDocumentData] = useState<DocumentData>({
    nationalId: "",
    nationalIdFront: null,
    nationalIdBack: null,
    commercialRegistrationNumber: "",
    commercialRegistrationDoc: null,
  });

  const { user, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading) {
      loadProfile();
      loadVerificationStatus();
    }
  }, [isAuthLoading]);

  useEffect(() => {
    updateProfileCompletion();
  }, [profileData, documentData]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profile = await profileApi.getProfile();
      if (profile.userType === "individual") {
        setProfileData({
          fullName: profile.fullName || "",
          phone: profile.phone || "",
          address: profile.address || "",
          personalEmail: user?.email || "",
          companyName: "",
          companyEmail: "",
          contactPersonName: "",
          companyDesc: "",
        });
        setDocumentData({
          nationalId: profile.nationalId || "",
          nationalIdFront: profile.nationalIdFront || null,
          nationalIdBack: profile.nationalIdBack || null,
          commercialRegistrationNumber: "",
          commercialRegistrationDoc: null,
        });
      } else if (profile.userType === "business") {
        setProfileData({
          fullName: profile.contactPersonName || "",
          companyName: profile.companyName || "",
          phone: profile.phone || "",
          address: profile.address || "",
          personalEmail: profile.personalEmail || "",
          companyEmail: profile.companyEmail || "",
          contactPersonName: profile.contactPersonName || "",
          companyDesc: profile.companyDesc || "",
        });
        setDocumentData({
          nationalId: "",
          nationalIdFront: null,
          nationalIdBack: null,
          commercialRegistrationNumber:
            profile.commercialRegistrationNumber || "",
          commercialRegistrationDoc: profile.commercialRegistrationDoc || null,
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadVerificationStatus = async () => {
    try {
      // Assuming a verification status field exists on the user object
      const status = user?.isDocumentVerified;
      setVerificationStatus(status || null);
      setIsProfileCompleted(status === "verified" || status === "pending");
    } catch (err: any) {
      console.error("Failed to load verification status:", err);
    }
  };

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = async () => {
    try {
      setSaving(true);
      setError(null);
      let updateData: any;
      if (user?.userType === "individual") {
        updateData = {
          fullName: profileData.fullName,
          phone: profileData.phone,
          address: profileData.address,
        };
      } else {
        updateData = {
          contactPersonName: profileData.fullName,
          companyName: profileData.companyName,
          companyEmail: profileData.companyEmail,
          personalEmail: profileData.personalEmail,
          phone: profileData.phone,
          address: profileData.address,
          companyDesc: profileData.companyDesc,
        };
      }
      const result = await profileApi.updateProfile(updateData);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      if (result.requiresReVerification) {
        await loadVerificationStatus();
        setIsProfileCompleted(false);
      }
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    loadProfile();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    docType: keyof DocumentData
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF, JPG, or PNG file");
      return;
    }
    if (file.size > maxSize) {
      setError("File size must be less than 10MB");
      return;
    }

    try {
      setUploadingFile(true);
      setError(null);
      const uploadedUrl = await uploadToCloudinary(file);
      setDocumentData((prev) => ({ ...prev, [docType]: uploadedUrl }));
      setSuccess("Document uploaded successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError("Failed to upload document: " + err.message);
    } finally {
      setUploadingFile(false);
    }
  };

  const updateProfileCompletion = () => {
    let completedFields = 0;
    let totalFields = 0;

    if (user?.userType === "individual") {
      const requiredFields = ["fullName", "phone", "address"];
      totalFields = requiredFields.length + 3; // + email, nationalId, nationalIdFront, nationalIdBack
      if (user.email) completedFields++;
      if (documentData.nationalId?.trim()) completedFields++;
      if (documentData.nationalIdFront) completedFields++;
      if (documentData.nationalIdBack) completedFields++;
      requiredFields.forEach((field) => {
        if (profileData[field as keyof ProfileData]?.trim()) completedFields++;
      });
    } else if (user?.userType === "business") {
      const requiredFields = [
        "companyName",
        "companyEmail",
        "phone",
        "address",
        "personalEmail",
        "contactPersonName",
      ];
      totalFields = requiredFields.length + 2; // + registration number and doc
      if (documentData.commercialRegistrationNumber?.trim()) completedFields++;
      if (documentData.commercialRegistrationDoc) completedFields++;
      requiredFields.forEach((field) => {
        if (profileData[field as keyof ProfileData]?.trim()) completedFields++;
      });
    }

    setProfileCompletion(Math.min(100, (completedFields / totalFields) * 100));
  };

  const handleCompleteProfileClick = () => setShowCompletionModal(true);

  const handleConfirmCompletion = async () => {
    try {
      setSaving(true);
      setError(null);
      let documentsPayload: any;
      if (user?.userType === "individual") {
        documentsPayload = {
          nationalId: documentData.nationalId,
          nationalIdFront: documentData.nationalIdFront,
          nationalIdBack: documentData.nationalIdBack,
        };
      } else {
        documentsPayload = {
          commercialRegistrationNumber:
            documentData.commercialRegistrationNumber,
          commercialRegistrationDoc: documentData.commercialRegistrationDoc,
        };
      }
      await profileApi.submitDocuments(documentsPayload);
      setIsProfileCompleted(true);
      setShowCompletionModal(false);
      setIsEditing(false);
      setSuccess("Documents submitted for verification successfully!");
      await loadVerificationStatus();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => setShowCompletionModal(false);

  const areInputsDisabled = !isEditing || isProfileCompleted;

  const canCompleteProfile = profileCompletion === 100 && !isProfileCompleted;

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#5A4DFF]" />
            <span className="text-gray-600">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  const renderFileUpload = (
    docType: keyof DocumentData,
    label: string,
    disabled: boolean
  ) => (
    <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center flex flex-col items-center justify-center space-y-3">
      {documentData[docType] ? (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 text-sm">{label} uploaded</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(documentData[docType]!, "_blank")}
          >
            View
          </Button>
        </div>
      ) : uploadingFile ? (
        <>
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 animate-spin" />
          <p className="text-xs sm:text-sm text-gray-600">
            Uploading {label}...
          </p>
        </>
      ) : (
        <>
          <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          <p className="text-xs sm:text-sm text-gray-600">
            {t("drag_and_drop_your_file_here_or_click_to_browse")}
          </p>
          <Button
            variant="outline"
            className="px-4 py-2 sm:px-6 sm:py-2 bg-transparent text-sm sm:text-base relative"
            disabled={disabled}
          >
            {t("choose_file")}
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e, docType)}
              disabled={disabled}
            />
          </Button>
          <p className="text-xs text-gray-500">{t("pdf_jpg_png_up_to_10mb")}</p>
        </>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-white container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex-1 flex flex-col">
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}
        <main className="flex-1 p-0 sm:p-6 overflow-auto">
          <div className="pb-6 mb-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between flex-wrap gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="relative">
                  <Avatar className="w-20 h-20 md:w-28 md:h-28">
                    <AvatarImage
                      src="/placeholder.svg?height=112&width=112"
                      alt={t("user_avatar")}
                    />
                    <AvatarFallback>
                      {(
                        profileData.fullName || profileData.companyName
                      )?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full bg-white border border-gray-200 shadow-sm w-8 h-8 md:w-9 md:h-9"
                  >
                    <Camera className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                  </Button>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {profileData.fullName ||
                      profileData.companyName ||
                      "Your Name"}
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600">
                    {user?.userType === "business"
                      ? profileData.contactPersonName
                      : t("senior_product_designer")}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-sm sm:text-base text-gray-500 mt-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>
                        {user?.userType === "business"
                          ? profileData.companyEmail || "company@email.com"
                          : user?.email || "user@email.com"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{profileData.phone || "Mobile number"}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                {verificationStatus === "verified" ? (
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <CheckCircle className="w-5 h-5" />
                    <span>Verified</span>
                  </div>
                ) : verificationStatus === "pending" ? (
                  <div className="flex items-center gap-2 text-blue-600 font-medium">
                    <Loader2 className="w-5 h-5" />
                    <span>Verification Pending</span>
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
                      disabled={saving}
                      className="bg-green-500 hover:bg-green-600 text-white rounded-md px-4 py-2 sm:px-6 sm:py-2 flex items-center gap-2 text-sm sm:text-base"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {saving ? "Saving..." : t("save_changes")}
                    </Button>
                    <Button
                      onClick={handleCancelClick}
                      disabled={saving}
                      variant="outline"
                      className="rounded-md px-4 py-2 sm:px-6 sm:py-2 flex items-center gap-2 bg-transparent text-sm sm:text-base"
                    >
                      <X className="w-4 h-4" />
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
                  {Math.round(profileCompletion)}%
                </span>
              </div>
              <Progress
                value={profileCompletion}
                className="h-3 bg-gray-200 [&>*]:bg-[#5A4DFF]"
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                {t("complete_your_profile_to_unlock_all_features")}
              </p>
              {canCompleteProfile && (
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
                {t("profile_details")}
              </TabsTrigger>
              <TabsTrigger
                value="account-verification"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md text-sm sm:text-base"
              >
                {t("account_verification")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profile-details" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user?.userType === "individual" && (
                  <div>
                    <Label
                      htmlFor="fullName"
                      className="text-gray-700 text-sm sm:text-base"
                    >
                      {t("full_name")} *
                    </Label>
                    <Input
                      id="fullName"
                      value={profileData.fullName}
                      onChange={handleInputChange}
                      disabled={areInputsDisabled}
                      className="mt-1"
                    />
                  </div>
                )}
                {user?.userType === "business" && (
                  <>
                    <div>
                      <Label
                        htmlFor="companyName"
                        className="text-gray-700 text-sm sm:text-base"
                      >
                        {t("company_name")} *
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
                        {t("contact_person_name")} *
                      </Label>
                      <Input
                        id="contactPersonName"
                        value={profileData.fullName}
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
                        {t("company_email")} *
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
                  </>
                )}
                <div>
                  <Label
                    htmlFor="email"
                    className="text-gray-700 text-sm sm:text-base"
                  >
                    {t("email")} *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.personalEmail || user?.email}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="phone"
                    className="text-gray-700 text-sm sm:text-base"
                  >
                    {t("phone")} *
                  </Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    disabled={areInputsDisabled}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="address"
                    className="text-gray-700 text-sm sm:text-base"
                  >
                    {t("address")} *
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
                    {t("account_verification")}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4">
                    {t("this_info_is_used_to_verify_your_identity")}
                  </p>
                </div>
                {user?.userType === "individual" && (
                  <>
                    <div>
                      <Label
                        htmlFor="nationalId"
                        className="text-gray-700 text-sm sm:text-base"
                      >
                        {t("national_id")} *
                      </Label>
                      <Input
                        id="nationalId"
                        value={documentData.nationalId}
                        onChange={(e) =>
                          setDocumentData((prev) => ({
                            ...prev,
                            nationalId: e.target.value,
                          }))
                        }
                        disabled={areInputsDisabled}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 text-sm sm:text-base">
                        {t("upload_national_id_front")} *
                      </Label>
                      {renderFileUpload(
                        "nationalIdFront",
                        "ID Front",
                        areInputsDisabled
                      )}
                    </div>
                    <div>
                      <Label className="text-gray-700 text-sm sm:text-base">
                        {t("upload_national_id_back")} *
                      </Label>
                      {renderFileUpload(
                        "nationalIdBack",
                        "ID Back",
                        areInputsDisabled
                      )}
                    </div>
                  </>
                )}
                {user?.userType === "business" && (
                  <>
                    <div>
                      <Label
                        htmlFor="commercialRegistrationNumber"
                        className="text-gray-700 text-sm sm:text-base"
                      >
                        {t("commercial_registration_number")} *
                      </Label>
                      <Input
                        id="commercialRegistrationNumber"
                        value={documentData.commercialRegistrationNumber}
                        onChange={(e) =>
                          setDocumentData((prev) => ({
                            ...prev,
                            commercialRegistrationNumber: e.target.value,
                          }))
                        }
                        disabled={areInputsDisabled}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 text-sm sm:text-base">
                        {t("upload_commercial_registration_doc")} *
                      </Label>
                      {renderFileUpload(
                        "commercialRegistrationDoc",
                        "Commercial Reg. Doc",
                        areInputsDisabled
                      )}
                    </div>
                  </>
                )}
                {verificationStatus === "rejected" && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Verification Rejected:</strong>{" "}
                      {verificationStatus}
                    </AlertDescription>
                  </Alert>
                )}
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
              Are you sure you want to submit your profile for verification?
              Once submitted, your documents will be reviewed by our team and
              you cannot edit them until the review is complete.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseModal}
              disabled={saving}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleConfirmCompletion}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
                  Submitting...
                </>
              ) : (
                t("confirm")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

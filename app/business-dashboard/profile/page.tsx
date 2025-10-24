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
import PageTransitionWrapper from "@/components/animations/PageTransitionWrapper";

interface ProfileData {
  companyName: string;
  contactPersonName: string;
  personalEmail: string;
  companyEmail: string;
  companyPhoneNumber: string;
  commercialRegistrationNumber: string;
  companyDescription: string;
  phone: string;
  address: string;
}

interface DocumentData {
  commercialRegistrationDoc: string | null;
  commercialRegistrationNumber: string;
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
  const [rejectionreaspm, setrejectionreaspm] = useState("");
  const [profileData, setProfileData] = useState<ProfileData>({
    companyName: "",
    contactPersonName: "",
    personalEmail: "",
    companyEmail: "",
    companyPhoneNumber: "",
    commercialRegistrationNumber: "",
    companyDescription: "",
    phone: "",
    address: "",
  });

  const [documentData, setDocumentData] = useState<DocumentData>({
    commercialRegistrationDoc: null,
    commercialRegistrationNumber: "",
  });

  const { user, isLoading, profile } = useAuth();

  useEffect(() => {
    // load both profile and verification status on mount / when auth profile changes
    loadProfile();
    loadVerificationStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  useEffect(() => {
    updateProfileCompletion();
  }, [profileData, documentData]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profile = await profileApi.getProfile();

      // Map API response to component state
      setProfileData({
        companyName: profile.companyName || "",
        contactPersonName: profile.contactPersonName || "",
        personalEmail: profile.personalEmail || "",
        companyEmail: profile.companyEmail || "",
        companyPhoneNumber: profile.phone || "",
        commercialRegistrationNumber:
          profile.commercialRegistrationNumber || "",
        companyDescription: profile.companyDesc || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });

      setDocumentData({
        commercialRegistrationDoc: profile.commercialRegistrationDoc || null,
        commercialRegistrationNumber:
          profile.commercialRegistrationNumber || "",
      });
    } catch (err: any) {
      setError(err?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const loadVerificationStatus = async () => {
    try {
      // Prefer authoritative source from profile endpoint instead of relying only on `user`
      const prof = await profileApi.getVerificationStatus();
      const status = prof?.isDocumentVerified;
      setrejectionreaspm(prof?.documentRejectionReason);

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

      // Prepare data for API
      const updateData: any = {
        companyName: profileData.companyName,
        contactPersonName: profileData.contactPersonName,
        personalEmail: profileData.personalEmail,
        companyEmail: profileData.companyEmail,
        phone: profileData.companyPhoneNumber,
        companyDesc: profileData.companyDescription,
        address: profileData.address,
      };

      // If CR number changed locally, include it
      if (documentData.commercialRegistrationNumber) {
        updateData.commercialRegistrationNumber =
          documentData.commercialRegistrationNumber;
      }

      const result = await profileApi.updateProfile(updateData);

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      await loadProfile();

      // If verification is required, update status
      if (result?.requiresReVerification) {
        await loadVerificationStatus();
        setIsProfileCompleted(false);
      } else {
        // always refresh verification after save to show latest status
        await loadVerificationStatus();
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    loadProfile(); // Reset to original data
  };

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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
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

      // Update local state
      setDocumentData((prev) => ({
        ...prev,
        commercialRegistrationDoc: uploadedUrl,
      }));

      // Persist to backend immediately so replacement persists across reloads
      try {
        await profileApi.updateProfile({
          commercialRegistrationDoc: uploadedUrl,
        });
      } catch (persistErr) {
        // Non-fatal: keep uploaded url locally but show warning
        console.warn("Failed to persist document URL to backend:", persistErr);
      }

      setSuccess("Document uploaded successfully!");
      // refresh verification status (uploading a new document could change pending/required state)
      await loadVerificationStatus();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError("Failed to upload document: " + (err?.message || err));
    } finally {
      setUploadingFile(false);
    }
  };

  const handleRemoveDocument = async () => {
    // Confirm removal
    const ok = window.confirm(
      "Remove commercial registration document? This will delete the current uploaded document."
    );
    if (!ok) return;

    try {
      setSaving(true);
      setError(null);

      // Update backend to remove doc (best-effort)
      try {
        await profileApi.updateProfile({
          commercialRegistrationDoc: undefined,
        });
      } catch (persistErr) {
        console.warn("Backend document removal failed:", persistErr);
        // continue to update local state anyway
      }

      // Update local state
      setDocumentData((prev) => ({
        ...prev,
        commercialRegistrationDoc: null,
      }));

      setSuccess("Document removed");
      // Refresh verification status because removing document might change it
      await loadVerificationStatus();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err?.message || "Failed to remove document");
    } finally {
      setSaving(false);
    }
  };

  const updateProfileCompletion = () => {
    let completedFields = 0;
    const requiredFields = [
      "companyName",
      "contactPersonName",
      "personalEmail",
      "companyEmail",
      "companyPhoneNumber",
      "companyDescription",
      "address",
    ];

    requiredFields.forEach((field) => {
      if (profileData[field as keyof ProfileData]?.toString().trim())
        completedFields++;
    });

    setProfileCompletion(
      Math.min(100, (completedFields / requiredFields.length) * 100)
    );
  };

  const handleCompleteProfileClick = () => setShowCompletionModal(true);

  const handleConfirmCompletion = async () => {
    try {
      setSaving(true);
      setError(null);

      const documentsPayload = {
        commercialRegistrationNumber: documentData.commercialRegistrationNumber,
        commercialRegistrationDoc:
          documentData.commercialRegistrationDoc ?? undefined,
      };

      await profileApi.submitDocuments(documentsPayload);

      setIsProfileCompleted(true);
      setShowCompletionModal(false);
      setIsEditing(false);
      setSuccess("Documents submitted for verification successfully!");

      // Reload verification status and profile after submission
      await loadVerificationStatus();
      await loadProfile();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err?.message || "Failed to submit documents");
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => setShowCompletionModal(false);

  const areInputsDisabled = !isEditing;
  const canCompleteProfile =
    profileCompletion === 100 &&
    documentData.commercialRegistrationNumber &&
    documentData.commercialRegistrationDoc &&
    !isProfileCompleted;

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

  return (
    <PageTransitionWrapper>
      <div className="flex min-h-screen bg-white container mx-auto px-4 sm:px-6 lg:px-0 py-8">
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
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {profileData.companyName || "Company Name"}
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600">
                      {profileData.companyDescription || "Company description"}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-sm sm:text-base text-gray-500 mt-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>
                          {profileData.companyEmail || "company@email.com"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>
                          {profileData.companyPhoneNumber || "Phone number"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  {/* Verification Status */}
                  {verificationStatus === "verified" && (
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <CheckCircle className="w-5 h-5" />
                      <span>Verified</span>
                    </div>
                  )}

                  {verificationStatus === "pending" && (
                    <div className="flex items-center gap-2 text-blue-600 font-medium">
                      <Loader2 className="w-5 h-5" />
                      <span>Verification Pending</span>
                    </div>
                  )}
                  {verificationStatus === "rejected" && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800">
                        <strong>Verification Rejected:</strong>{" "}
                        {verificationStatus}
                        {rejectionreaspm}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Action Buttons */}
                  {!isEditing ? (
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
                      {t("personal_email")} *
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
                  <div>
                    <Label
                      htmlFor="companyPhoneNumber"
                      className="text-gray-700 text-sm sm:text-base"
                    >
                      {t("company_phone")} *
                    </Label>
                    <div className="flex gap-2 mt-1">
          
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
                      htmlFor="address"
                      className="text-gray-700 text-sm sm:text-base"
                    >
                      Address *
                    </Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      disabled={areInputsDisabled}
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label
                      htmlFor="companyDescription"
                      className="text-gray-700 text-sm sm:text-base"
                    >
                      {t("company_description")} *
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
                      {t(
                        "this_info_is_used_to_verify_your_company_registration"
                      )}
                    </p>
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
                      {t("upload_cr_document_pdf_jpg_png")} *
                    </Label>

                    {/* If doc exists show uploaded state + actions (replace/remove when editing) */}
                    {documentData.commercialRegistrationDoc ? (
                      <div className="mt-1 p-4 border-2 border-green-300 rounded-lg bg-green-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-green-800 text-sm">
                              Document uploaded successfully
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(
                                  documentData.commercialRegistrationDoc!,
                                  "_blank"
                                )
                              }
                            >
                              View
                            </Button>

                            {/* Replace button (visible when editing) */}
                            {isEditing && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="relative overflow-hidden"
                                >
                                  Replace
                                  <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileUpload}
                                    disabled={uploadingFile}
                                  />
                                </Button>

                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={handleRemoveDocument}
                                  disabled={saving}
                                >
                                  Remove
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center flex flex-col items-center justify-center space-y-3">
                        {uploadingFile ? (
                          <>
                            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 animate-spin" />
                            <p className="text-xs sm:text-sm text-gray-600">
                              Uploading document...
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                            <p className="text-xs sm:text-sm text-gray-600">
                              {t(
                                "drag_and_drop_your_file_here_or_click_to_browse"
                              )}
                            </p>
                            <Button
                              variant="outline"
                              className="px-4 py-2 sm:px-6 sm:py-2 bg-transparent text-sm sm:text-base relative"
                              disabled={areInputsDisabled || uploadingFile}
                            >
                              {t("choose_file")}
                              <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileUpload}
                                disabled={areInputsDisabled || uploadingFile}
                              />
                            </Button>
                            <p className="text-xs text-gray-500">
                              {t("pdf_jpg_png_up_to_10mb")}
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>

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

        <Dialog
          open={showCompletionModal}
          onOpenChange={setShowCompletionModal}
        >
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
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
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
    </PageTransitionWrapper>
  );
}

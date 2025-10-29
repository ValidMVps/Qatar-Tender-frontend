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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  CheckCircle,
  Save,
  X,
  Upload,
  Phone,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary";
import { profileApi } from "@/app/services/profileApi";
import { useAuth } from "@/context/AuthContext";
import PageTransitionWrapper from "@/components/animations/PageTransitionWrapper";

interface ProfileData {
  fullName: string;
  personalEmail: string;
  phone: string;
  address: string;
  companyName?: string;
  companyEmail?: string;
  contactPersonName?: string;
  companyDesc?: string;
}

interface DocumentData {
  nationalId: string;
  nationalIdFront: string | null;
  nationalIdBack: string | null;
  commercialRegistrationNumber?: string;
  commercialRegistrationDoc?: string | null;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthLoading]);

  useEffect(() => {
    updateProfileCompletion();
  }, [profileData, documentData, user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const prof = await profileApi.getProfile();

      // Map to unified UI structure
      if (prof.userType === "individual") {
        setProfileData({
          fullName: prof.fullName || "",
          personalEmail: prof.personalEmail || prof.email || user?.email || "",
          phone: prof.phone || "",
          address: prof.address || "",
        });
        setDocumentData({
          nationalId: prof.nationalId || "",
          nationalIdFront: prof.nationalIdFront || null,
          nationalIdBack: prof.nationalIdBack || null,
          commercialRegistrationNumber: "",
          commercialRegistrationDoc: null,
        });
      } else {
        // fallback if server returns business unexpectedly
        setProfileData({
          fullName: prof.contactPersonName || "",
          personalEmail: prof.personalEmail || prof.email || user?.email || "",
          phone: prof.phone || "",
          address: prof.address || "",
          companyName: prof.companyName || "",
          companyEmail: prof.companyEmail || "",
          contactPersonName: prof.contactPersonName || "",
          companyDesc: prof.companyDesc || "",
        });
        setDocumentData({
          nationalId: "",
          nationalIdFront: null,
          nationalIdBack: null,
          commercialRegistrationNumber: prof.commercialRegistrationNumber || "",
          commercialRegistrationDoc: prof.commercialRegistrationDoc || null,
        });
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const loadVerificationStatus = async () => {
    try {
      // prefer profile API for authoritative status
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

  const handleCancelClick = () => {
    setIsEditing(false);
    loadProfile();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveClick = async () => {
    try {
      setSaving(true);
      setError(null);

      let updateData: any = {
        fullName: profileData.fullName,
        phone: profileData.phone,
        address: profileData.address,
      };

      // include national id number if present
      if (documentData.nationalId)
        updateData.nationalId = documentData.nationalId;

      const result = await profileApi.updateProfile(updateData);

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      await loadProfile();
      await loadVerificationStatus();

      // Clear success
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    docKey: keyof DocumentData
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

      // update local state immediately
      setDocumentData((prev) => ({ ...prev, [docKey]: uploadedUrl }));

      // persist to backend (best-effort)
      try {
        await profileApi.updateProfile({ [docKey]: uploadedUrl });
      } catch (err) {
        console.warn("Failed to persist uploaded document to backend:", err);
      }

      setSuccess("Document uploaded successfully!");
      await loadVerificationStatus();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError("Failed to upload document: " + (err?.message || err));
    } finally {
      setUploadingFile(false);
    }
  };

  const handleRemoveDocument = async (docKey: keyof DocumentData) => {
    const ok = window.confirm(
      "Remove document? This will delete the uploaded file."
    );
    if (!ok) return;

    try {
      setSaving(true);
      setError(null);

      // attempt to persist removal
      try {
        await profileApi.updateProfile({ [docKey]: null });
      } catch (err) {
        console.warn("Backend removal failed:", err);
      }

      // update local state anyway
      setDocumentData((prev) => ({ ...prev, [docKey]: null }));

      setSuccess("Document removed");
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
    let totalFields = 0;

    if (user?.userType === "individual") {
      const required = ["fullName", "phone", "address"];
      totalFields = required.length + 3; // + email, nationalId, two id images
      if (user?.email) completedFields++;
      if (documentData.nationalId?.trim()) completedFields++;
      if (documentData.nationalIdFront) completedFields++;
      if (documentData.nationalIdBack) completedFields++;
      required.forEach((f) => {
        if ((profileData as any)[f]?.toString().trim()) completedFields++;
      });
    } else {
      // fallback: treat like business
      const required = [
        "companyName",
        "companyEmail",
        "phone",
        "address",
        "personalEmail",
        "contactPersonName",
      ];
      totalFields = required.length + 2;
      if (documentData.commercialRegistrationNumber?.trim()) completedFields++;
      if (documentData.commercialRegistrationDoc) completedFields++;
      required.forEach((f) => {
        if ((profileData as any)[f]?.toString().trim()) completedFields++;
      });
    }

    const percent =
      totalFields === 0
        ? 0
        : Math.min(100, (completedFields / totalFields) * 100);
    setProfileCompletion(percent);
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
    docKey: keyof DocumentData,
    label: string,
    disabled: boolean
  ) => (
    <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center flex flex-col items-center justify-center space-y-3">
      {documentData[docKey] ? (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 text-sm">{label} uploaded</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(documentData[docKey]!, "_blank")}
            >
              View
            </Button>
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
                    onChange={(e) => handleFileUpload(e, docKey)}
                    disabled={uploadingFile}
                  />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveDocument(docKey)}
                  disabled={saving}
                >
                  Remove
                </Button>
              </>
            )}
          </div>
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
              onChange={(e) => handleFileUpload(e, docKey)}
              disabled={disabled}
            />
          </Button>
          <p className="text-xs text-gray-500">{t("pdf_jpg_png_up_to_10mb")}</p>
        </>
      )}
    </div>
  );

  return (
    <PageTransitionWrapper>
      <div className="flex min-h-screen container mx-auto px-4 sm:px-6 lg:px-0 py-8">
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
                      {profileData.fullName || "Your Name"}
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600">
                      {t("individual_profile")}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-sm sm:text-base text-gray-500 mt-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>
                          {profileData.personalEmail ||
                            user?.email ||
                            "user@email.com"}
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
                  {verificationStatus === "verified" && (
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <CheckCircle className="w-5 h-5" />
                      <span>Verified</span>
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

                  {verificationStatus === "pending" && (
                    <div className="flex items-center gap-2 text-blue-600 font-medium">
                      <Loader2 className="w-5 h-5" />
                      <span>Verification Pending</span>
                    </div>
                  )}

                

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
                {canCompleteProfile && !isEditing && (
                  <Button
                    onClick={handleCompleteProfileClick}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base"
                  >
                    {t("Send Profile For Verification")}
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
    </PageTransitionWrapper>
  );
}

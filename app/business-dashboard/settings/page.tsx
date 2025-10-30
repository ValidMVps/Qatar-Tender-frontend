"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Moon,
  Sun,
  Upload,
  Settings,
  Shield,
  LogOut,
  Bell,
  Globe,
  Palette,
  User,
  Smartphone,
  Volume2,
  EyeOff,
  Eye,
  XCircle,
} from "lucide-react";
import { authService } from "@/utils/auth";
import PageTransitionWrapper from "@/components/animations/PageTransitionWrapper";
import { LanguageToggle } from "@/components/LanguageToggle";
import useTranslation from "@/lib/hooks/useTranslation";
import { profileApi } from "@/app/services/profileApi";
import { toast } from "sonner";

// Define props for SettingRow interface
interface SettingRowProps {
  icon: React.ElementType;
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

// Define tab types
type TabId = "general" | "security" | "privacy";

export default function AppleStyleSettings() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>("general");

  // General Settings - initialized as empty, will be populated by API
  const [companyName, setCompanyName] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [contactPerson, setContactPerson] = useState<string>("");
  const [companyEmail, setCompanyEmail] = useState<string>("");
  const [personalEmail, setPersonalEmail] = useState<string>("");
  const [companyDescription, setCompanyDescription] = useState<string>("");
  const [companyLogo, setCompanyLogo] = useState<string>("");

  // Privacy Settings
  const [anonymousBidding, setAnonymousBidding] = useState<boolean>(true);
  const [showPublicProfile, setShowPublicProfile] = useState<boolean>(false);
  const [profileVisibility, setProfileVisibility] = useState<
    "public" | "private"
  >("private");

  // Notification Settings
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [pushNotifications, setPushNotifications] = useState<boolean>(true);

  // Security Settings
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordSuccess, setPasswordSuccess] = useState<string>("");
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState<boolean>(false);
  const [autoLock, setAutoLock] = useState<string>("15");

  // Appearance & Language
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("light");
  const [fontSize, setFontSize] = useState<string>("medium");
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Dark mode state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      return saved === "true";
    }
    return false;
  });

  // Load profile data on mount
  useEffect(() => {
    loadProfileData();
  }, []);

  // Save to localStorage when toggled
  useEffect(() => {
    localStorage.setItem("darkMode", isDark.toString());

    // Dispatch custom event to notify all listeners
    const event = new CustomEvent("darkModeChange", {
      detail: { dark: isDark },
    });
    window.dispatchEvent(event);
  }, [isDark]);

  // Sync with other tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "darkMode") {
        setIsDark(e.newValue === "true");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Load current profile settings from backend
  const loadProfileData = async () => {
    try {
      const profile = await profileApi.getProfile();

      // Set privacy settings
      setAnonymousBidding(profile.anonymousBidding ?? true);
      setShowPublicProfile(profile.showPublicProfile ?? false);
      setProfileVisibility(profile.profileVisibility || "private");

      // Set company info
      if (profile.companyName) setCompanyName(profile.companyName);
      if (profile.contactPersonName)
        setContactPerson(profile.contactPersonName);
      if (profile.companyEmail) setCompanyEmail(profile.companyEmail);
      if (profile.personalEmail) setPersonalEmail(profile.personalEmail);
      if (profile.companyDesc) setCompanyDescription(profile.companyDesc);
      if (profile.commercialRegistrationDoc)
        setCompanyLogo(profile.commercialRegistrationDoc);

      // Set appearance preferences
      if (profile.themePreference) setTheme(profile.themePreference);
      if (profile.fontSizePreference) setFontSize(profile.fontSizePreference);
      if (profile.reducedMotion !== undefined)
        setReducedMotion(profile.reducedMotion);

      // Set notification preferences
      if (profile.notificationsEnabled !== undefined)
        setNotificationsEnabled(profile.notificationsEnabled);
      if (profile.soundEnabled !== undefined)
        setSoundEnabled(profile.soundEnabled);
      if (profile.pushNotifications !== undefined)
        setPushNotifications(profile.pushNotifications);

      // Set security preferences
      if (profile.twoFactorAuth !== undefined)
        setTwoFactorAuth(profile.twoFactorAuth);
      if (profile.autoLock) setAutoLock(profile.autoLock);
    } catch (err) {
      console.error("Failed to load profile:", err);
      toast.error(
        t("failed_to_load_profile_settings") ||
          "Failed to load profile settings"
      );
    }
  };

  // Update profile setting through API
  const updateProfileSetting = async (
    field: string,
    value: any,
    successMessage: string
  ) => {
    try {
      const result = await profileApi.updateProfile({
        [field]: value,
      });

      toast.success(successMessage);

      // Update local state based on field
      switch (field) {
        case "anonymousBidding":
          setAnonymousBidding(value);
          break;
        case "showPublicProfile":
          setShowPublicProfile(value);
          break;
        case "profileVisibility":
          setProfileVisibility(value);
          break;
        case "companyName":
          setCompanyName(value);
          break;
        case "contactPersonName":
          setContactPerson(value);
          break;
        case "companyEmail":
          setCompanyEmail(value);
          break;
        case "personalEmail":
          setPersonalEmail(value);
          break;
        case "companyDesc":
          setCompanyDescription(value);
          break;
        case "commercialRegistrationDoc":
          setCompanyLogo(value);
          break;
        case "themePreference":
          setTheme(value);
          break;
        case "fontSizePreference":
          setFontSize(value);
          break;
        case "reducedMotion":
          setReducedMotion(value);
          break;
        case "notificationsEnabled":
          setNotificationsEnabled(value);
          break;
        case "soundEnabled":
          setSoundEnabled(value);
          break;
        case "pushNotifications":
          setPushNotifications(value);
          break;
        case "twoFactorAuth":
          setTwoFactorAuth(value);
          break;
        case "autoLock":
          setAutoLock(value);
          break;
      }
    } catch (err: any) {
      console.error(`Failed to update ${field}:`, err);
      toast.error(
        err.message ||
          t("failed_to_update_setting") ||
          "Failed to update setting"
      );
    }
  };

  const tabs = [
    { id: "general", label: t("General"), icon: Settings },
    { id: "security", label: t("Security_&_Privacy"), icon: Shield },
    { id: "privacy", label: t("Privacy_Settings"), icon: EyeOff },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(t("Saving_settings..."));
  };

  const handleLogout = () => {
    authService.logout();
  };

  const SettingRow = ({
    icon: Icon,
    label,
    description,
    children,
    className = "",
  }: SettingRowProps) => (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between py-4 px-4 sm:px-6 border-b border-gray-100 last:border-b-0 ${className}`}
    >
      <div className="flex items-start space-x-3 sm:space-x-4 flex-1 mb-3 sm:mb-0">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {label}
          </h3>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    setPasswordLoading(true);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(t("All_fields_are_required."));
      setPasswordLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t("New_password_do_not_match."));
      setPasswordLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError(t("New_password_must_be_at_least_6_characters_long."));
      setPasswordLoading(false);
      return;
    }

    const result = await authService.changePassword(
      currentPassword,
      newPassword
    );
    if (result.success) {
      setPasswordSuccess(result.message || t("Password_updated_successfully."));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(""), 5000);
    } else {
      setPasswordError(result.error || t("Unable_to_update_password."));
    }
    setPasswordLoading(false);
  };

  return (
    <PageTransitionWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8 ">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {t("Settings")}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {t("Manage_your_account_settings_and_preferences")}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-xl mb-6 sm:mb-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
            {activeTab === "general" && (
              <div>
                {/* Notifications Section */}
                <div className="border-b border-gray-100">
                  <div className="p-4 sm:p-6 pb-0">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                      {t("Notifications")}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {t("Control_how_you_receive_notifications")}
                    </p>
                  </div>

                  <SettingRow
                    icon={Bell}
                    label={t("Enable_Notifications")}
                    description={t(
                      "Receive_notifications_about_important_updates"
                    )}
                  >
                    <Switch
                      checked={notificationsEnabled}
                      onCheckedChange={(checked) =>
                        updateProfileSetting(
                          "notificationsEnabled",
                          checked,
                          t("Notification_settings_updated")
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={Volume2}
                    label={t("Sound_Notifications")}
                    description={t("Play_sound_with_notifications")}
                  >
                    <Switch
                      checked={soundEnabled}
                      onCheckedChange={(checked) =>
                        updateProfileSetting(
                          "soundEnabled",
                          checked,
                          t("Sound_settings_updated")
                        )
                      }
                      disabled={!notificationsEnabled}
                    />
                  </SettingRow>
                </div>

                {/* Appearance Section */}
                <div className="border-b border-gray-100">
                  <div className="p-4 sm:p-6 pb-0">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                      {t("Appearance")}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {t("Customize_how_the_app_looks_and_feels")}
                    </p>
                  </div>

                  {/* Language */}
                  <SettingRow
                    icon={Globe}
                    label={t("Language")}
                    description={t("Choose_your_preferred_language")}
                  >
                    <LanguageToggle />
                  </SettingRow>

                  {/* Dark Mode Toggle */}
                  <SettingRow
                    icon={Sun}
                    label={t("Dark_Mode")}
                    description={t("Switch_between_light_and_dark_theme")}
                  >
                    <Switch checked={isDark} onCheckedChange={setIsDark} />
                  </SettingRow>

                  {/* Font Size */}
                  <SettingRow
                    icon={User}
                    label={t("Font_Size")}
                    description={t("Adjust_text_size_for_better_readability")}
                  >
                    <Select
                      value={fontSize}
                      onValueChange={(value) =>
                        updateProfileSetting(
                          "fontSizePreference",
                          value,
                          t("Font_size_updated")
                        )
                      }
                    >
                      <SelectTrigger className="w-28 sm:w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">{t("Small")}</SelectItem>
                        <SelectItem value="medium">{t("Medium")}</SelectItem>
                        <SelectItem value="large">{t("Large")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingRow>

                  {/* Reduce Motion */}
                  <SettingRow
                    icon={Settings}
                    label={t("Reduce_Motion")}
                    description={t("Minimize_animations_and_transitions")}
                  >
                    <Switch
                      checked={reducedMotion}
                      onCheckedChange={(checked) =>
                        updateProfileSetting(
                          "reducedMotion",
                          checked,
                          t("Motion_settings_updated")
                        )
                      }
                    />
                  </SettingRow>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {t("Security_&_Privacy")}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {t("Keep_your_account_secure")}
                  </p>
                </div>

                {/* Password Change */}
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
                    {t("Password")}
                  </h3>
                  <form
                    onSubmit={handleChangePassword}
                    className="space-y-4 max-w-md"
                  >
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        {t("Current_Password")}
                      </Label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder={t("Enter_current_password")}
                        disabled={passwordLoading}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        {t("New_Password")}
                      </Label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={t("Enter_new_password")}
                        disabled={passwordLoading}
                        minLength={6}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        {t("Confirm_New_Password")}
                      </Label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t("Confirm_new_password")}
                        disabled={passwordLoading}
                        className="mt-1"
                      />
                    </div>

                    {passwordError && (
                      <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
                        {passwordError}
                      </div>
                    )}

                    {passwordSuccess && (
                      <div className="rounded-lg bg-green-100 p-3 text-sm text-green-700">
                        {passwordSuccess}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto"
                      disabled={passwordLoading}
                    >
                      {passwordLoading
                        ? t("Updating...")
                        : t("Update_Password")}
                    </Button>
                  </form>
                </div>

                {/* Logout Button */}
                <div className="p-4 sm:p-6 pt-2 sm:pt-4">
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full sm:w-auto text-red-600 border-red-300 hover:bg-red-50"
                  >
                    {t("Log_Out")}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div>
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {t("Privacy_Settings")}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {t("Control_your_profile_privacy_and_visibility")}
                  </p>
                </div>

                {/* Anonymous Bidding */}
                <div className="border-b border-gray-100">
                  <div className="p-4 sm:p-6 pb-0">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                      {t("Bidding_Privacy")}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {t(
                        "Control_whether_your_identity_is_shown_when_bidding_on_tenders"
                      )}
                    </p>
                  </div>

                  <SettingRow
                    icon={EyeOff}
                    label={t("Bid_Anonymously")}
                    description={t(
                      "Your_company_name_will_be_hidden_from_tender_owners_when_you_place_bids"
                    )}
                  >
                    <Switch
                      checked={anonymousBidding}
                      onCheckedChange={(checked) =>
                        updateProfileSetting(
                          "anonymousBidding",
                          checked,
                          t("Bidding_privacy_updated")
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={Eye}
                    label={t("Show_Public_Profile")}
                    description={t(
                      "Allow_others_to_view_your_public_profile_when_they_award_you_projects"
                    )}
                  >
                    <Switch
                      checked={showPublicProfile}
                      onCheckedChange={(checked) =>
                        updateProfileSetting(
                          "showPublicProfile",
                          checked,
                          t("Public_profile_settings_updated")
                        )
                      }
                    />
                  </SettingRow>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="mt-6 sm:mt-8 flex justify-end">
            <Button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl font-medium w-full sm:w-auto"
            >
              {t("Save_Changes")}
            </Button>
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
}

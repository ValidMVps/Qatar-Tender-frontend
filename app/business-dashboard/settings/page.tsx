"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { authService } from "@/utils/auth";
import PageTransitionWrapper from "@/components/animations/PageTransitionWrapper";
import { LanguageToggle } from "@/components/LanguageToggle";
import useTranslation from "@/lib/hooks/useTranslation";

// Define props for SettingRow interface
interface SettingRowProps {
  icon: React.ElementType;
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

// Define tab types
type TabId = "general" | "security";

export default function AppleStyleSettings() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>("general");

  // General Settings
  const [companyName, setCompanyName] = useState<string>(
    t("Acme_Solutions_Inc.")
  );
  const [industry, setIndustry] = useState<string>(t("Construction"));
  const [contactPerson, setContactPerson] = useState<string>(t("Jane_Doe"));
  const [companyEmail, setCompanyEmail] = useState<string>(
    t("info@acmesolutions.com")
  );
  const [companyLogo, setCompanyLogo] = useState<string>(
    "/placeholder.svg?height=100&width=100&text=Company+Logo"
  );
  const [autoSave, setAutoSave] = useState<boolean>(true);
  const [dataSync, setDataSync] = useState<boolean>(true);
  const [offlineMode, setOfflineMode] = useState<boolean>(false);

  // Notification Settings
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [pushNotifications, setPushNotifications] = useState<boolean>(true);

  // Security Settings - Password
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordSuccess, setPasswordSuccess] = useState<string>("");
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);

  // Security Settings - Other
  const [twoFactorAuth, setTwoFactorAuth] = useState<boolean>(false);
  const [autoLock, setAutoLock] = useState<string>("15");

  // Appearance & Language
  const [appLanguage, setAppLanguage] = useState<string>("en");
  const [theme, setTheme] = useState<string>("light");
  const [fontSize, setFontSize] = useState<string>("medium");
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  const tabs = [
    { id: "general", label: t("General"), icon: Settings },
    { id: "security", label: t("Security_&_Privacy"), icon: Shield },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(t("Saving_settings..."));
    // Add save logic for general settings if needed
  };

  const handleLogout = () => {
    authService.logout();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCompanyLogo(URL.createObjectURL(file));
    }
  };

  const SettingRow = ({
    icon: Icon,
    label,
    description,
    children,
    className = "",
  }: SettingRowProps) => (
    <div
      className={`flex items-center justify-between py-4 px-6 border-b border-gray-100 last:border-b-0 ${className}`}
    >
      <div className="flex items-start space-x-4 flex-1">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">{label}</h3>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );

  // Handle password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    setPasswordLoading(true);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(t("All_fields_are_required."));
      setPasswordLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t("New_passwords_do_not_match."));
      setPasswordLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError(t("New_password_must_be_at_least_6_characters_long."));
      setPasswordLoading(false);
      return;
    }

    // Call backend
    const result = await authService.changePassword(
      currentPassword,
      newPassword
    );
    if (result.success) {
      setPasswordSuccess(result.message || t("Password_updated_successfully."));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // Auto-clear success message
      setTimeout(() => setPasswordSuccess(""), 5000);
    } else {
      setPasswordError(result.error || t("Unable_to_update_password."));
    }
    setPasswordLoading(false);
  };

  return (
    <PageTransitionWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto py-8 px-14">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("Settings")}
            </h1>
            <p className="text-gray-600">
              {t("Manage_your_account_settings_and_preferences")}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-xl mb-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
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
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {activeTab === "general" && (
              <div>
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t("General_Settings")}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {t("Manage_your_basic_account_information")}
                  </p>
                </div>

                {/* Notifications */}
                <div className="border-b border-gray-100">
                  <div className="p-6 pb-0">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {t("Notifications")}
                    </h3>
                    <p className="text-gray-600 mb-4">
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
                      onCheckedChange={setNotificationsEnabled}
                    />
                  </SettingRow>

                  <SettingRow
                    icon={Volume2}
                    label={t("Sound_Notifications")}
                    description={t("Play_sound_with_notifications")}
                  >
                    <Switch
                      checked={soundEnabled}
                      onCheckedChange={setSoundEnabled}
                      disabled={!notificationsEnabled}
                    />
                  </SettingRow>

                  <SettingRow
                    icon={Smartphone}
                    label={t("Push_Notifications")}
                    description={t(
                      "Receive_push_notifications_on_mobile_devices"
                    )}
                  >
                    <Switch
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                      disabled={!notificationsEnabled}
                    />
                  </SettingRow>
                </div>

                {/* Appearance */}
                <div>
                  <div className="p-6 pb-0">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {t("Appearance")}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {t("Customize_how_the_app_looks_and_feels")}
                    </p>
                  </div>

                  <SettingRow
                    icon={Globe}
                    label={t("Language")}
                    description={t("Choose_your_preferred_language")}
                  >
                    <LanguageToggle />
                  </SettingRow>

                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Palette className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {t("Theme")}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {t("Choose_your_preferred_theme")}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      {(["light", "dark", "auto"] as const).map(
                        (themeOption) => (
                          <button
                            key={themeOption}
                            onClick={() => setTheme(themeOption)}
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-all ${
                              theme === themeOption
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {themeOption === "light" && (
                              <Sun className="w-4 h-4" />
                            )}
                            {themeOption === "dark" && (
                              <Moon className="w-4 h-4" />
                            )}
                            {themeOption === "auto" && (
                              <Smartphone className="w-4 h-4" />
                            )}
                            <span className="text-sm capitalize">
                              {t(themeOption)}
                            </span>
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <SettingRow
                    icon={User}
                    label={t("Font_Size")}
                    description={t("Adjust_text_size_for_better_readability")}
                  >
                    <Select value={fontSize} onValueChange={setFontSize}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">{t("Small")}</SelectItem>
                        <SelectItem value="medium">{t("Medium")}</SelectItem>
                        <SelectItem value="large">{t("Large")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingRow>

                  <SettingRow
                    icon={Settings}
                    label={t("Reduce_Motion")}
                    description={t("Minimize_animations_and_transitions")}
                  >
                    <Switch
                      checked={reducedMotion}
                      onCheckedChange={setReducedMotion}
                    />
                  </SettingRow>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t("Security_&_Privacy")}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {t("Keep_your_account_secure")}
                  </p>
                </div>

                {/* Password Change */}
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setCurrentPassword(e.target.value)
                        }
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewPassword(e.target.value)
                        }
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setConfirmPassword(e.target.value)
                        }
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
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      disabled={passwordLoading}
                    >
                      {passwordLoading
                        ? t("Updating...")
                        : t("Update_Password")}
                    </Button>
                  </form>
                </div>

                {/* Other Security Settings */}
                {/* Logout */}
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-medium"
            >
              {t("Save_Changes")}
            </Button>
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
}

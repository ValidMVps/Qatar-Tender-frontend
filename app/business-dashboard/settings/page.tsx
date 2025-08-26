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
  Download,
} from "lucide-react";

export default function AppleStyleSettings() {
  const [activeTab, setActiveTab] = useState("general");

  // General Settings States
  const [companyName, setCompanyName] = useState("Acme Solutions Inc.");
  const [industry, setIndustry] = useState("Construction");
  const [contactPerson, setContactPerson] = useState("Jane Doe");
  const [companyEmail, setCompanyEmail] = useState("info@acmesolutions.com");
  const [companyLogo, setCompanyLogo] = useState(
    "/placeholder.svg?height=100&width=100&text=Company+Logo"
  );
  const [autoSave, setAutoSave] = useState(true);
  const [dataSync, setDataSync] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  // Notification Settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  // Security Settings
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [autoLock, setAutoLock] = useState("15");

  // Appearance & Language Settings
  const [appLanguage, setAppLanguage] = useState("en");
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState("medium");
  const [reducedMotion, setReducedMotion] = useState(false);

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "security", label: "Security & Privacy", icon: Shield },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Saving settings...");
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const handleLogoUpload = (e) => {
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
  }) => (
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-xl mb-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
                  General Settings
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage your basic account information
                </p>
              </div>

              {/* Company Profile Section */}
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Company Profile
                </h3>
                <div className="flex items-center space-x-6 mb-6">
                  <div className="relative">
                    <img
                      src={companyLogo}
                      alt="Company Logo"
                      className="w-20 h-20 rounded-full object-cover bg-gray-100"
                    />
                    <label className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Company Name
                      </Label>
                      <Input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Contact Person
                      </Label>
                      <Input
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Industry
                    </Label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Construction">
                          Construction
                        </SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <Input
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* App Settings */}
              <div className="border-b border-gray-100">
                <SettingRow
                  icon={Download}
                  label="Auto-save"
                  description="Automatically save your work"
                >
                  <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                </SettingRow>
                <SettingRow
                  icon={Globe}
                  label="Data Sync"
                  description="Sync data across all devices"
                >
                  <Switch checked={dataSync} onCheckedChange={setDataSync} />
                </SettingRow>
                <SettingRow
                  icon={Smartphone}
                  label="Offline Mode"
                  description="Work without internet connection"
                >
                  <Switch
                    checked={offlineMode}
                    onCheckedChange={setOfflineMode}
                  />
                </SettingRow>
              </div>

              {/* Notifications Section */}
              <div className="border-b border-gray-100">
                <div className="p-6 pb-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Notifications
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Control how you receive notifications
                  </p>
                </div>

                <SettingRow
                  icon={Bell}
                  label="Enable Notifications"
                  description="Receive notifications about important updates"
                >
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </SettingRow>
                <SettingRow
                  icon={Volume2}
                  label="Sound Notifications"
                  description="Play sound with notifications"
                >
                  <Switch
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                    disabled={!notificationsEnabled}
                  />
                </SettingRow>
                <SettingRow
                  icon={Smartphone}
                  label="Push Notifications"
                  description="Receive push notifications on mobile devices"
                >
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                    disabled={!notificationsEnabled}
                  />
                </SettingRow>
              </div>

              {/* Appearance Section */}
              <div>
                <div className="p-6 pb-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Appearance
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Customize how the app looks and feels
                  </p>
                </div>

                <SettingRow
                  icon={Globe}
                  label="Language"
                  description="Choose your preferred language"
                >
                  <Select value={appLanguage} onValueChange={setAppLanguage}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingRow>

                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Palette className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        Theme
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Choose your preferred theme
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    {["light", "dark", "auto"].map((themeOption) => (
                      <button
                        key={themeOption}
                        onClick={() => setTheme(themeOption)}
                        className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-all ${
                          theme === themeOption
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {themeOption === "light" && <Sun className="w-4 h-4" />}
                        {themeOption === "dark" && <Moon className="w-4 h-4" />}
                        {themeOption === "auto" && (
                          <Smartphone className="w-4 h-4" />
                        )}
                        <span className="text-sm capitalize">
                          {themeOption}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <SettingRow
                  icon={User}
                  label="Font Size"
                  description="Adjust text size for better readability"
                >
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingRow>

                <SettingRow
                  icon={Settings}
                  label="Reduce Motion"
                  description="Minimize animations and transitions"
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
                  Security & Privacy
                </h2>
                <p className="text-gray-600 mt-1">Keep your account secure</p>
              </div>

              {/* Password Section */}
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Password
                </h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Current Password
                    </Label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      New Password
                    </Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Confirm New Password
                    </Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="mt-1"
                    />
                  </div>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    Update Password
                  </Button>
                </div>
              </div>

              {/* Security Settings */}
              <div className="border-b border-gray-100">
                <SettingRow
                  icon={Shield}
                  label="Two-Factor Authentication"
                  description="Add an extra layer of security"
                >
                  <Switch
                    checked={twoFactorAuth}
                    onCheckedChange={setTwoFactorAuth}
                  />
                </SettingRow>
                <SettingRow
                  icon={Smartphone}
                  label="Auto-lock"
                  description="Automatically lock after inactivity"
                >
                  <Select value={autoLock} onValueChange={setAutoLock}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingRow>
              </div>

              {/* Logout Section */}
              <div className="p-6">
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-medium"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

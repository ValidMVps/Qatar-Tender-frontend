"use client";

import type React from "react";
import { useState } from "react";
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
import Image from "next/image";
import { Moon, Sun, Upload } from "lucide-react";

import { useTranslation } from "@/lib/hooks/useTranslation";

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState("Acme Solutions Inc.");
  const [industry, setIndustry] = useState("Construction");
  const [contactPerson, setContactPerson] = useState("Jane Doe");
  const [companyEmail, setCompanyEmail] = useState("info@acmesolutions.com");
  const [companyLogo, setCompanyLogo] = useState(
    "/placeholder.svg?height=100&width=100&text=Company+Logo"
  );

  const [newBidNotification, setNewBidNotification] = useState(true);
  const [tenderStatusNotification, setTenderStatusNotification] =
    useState(true);
  const [messageNotification, setMessageNotification] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [appLanguage, setAppLanguage] = useState("en");
  const [font, setFont] = useState("Inter");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving settings:", {
      companyName,
      industry,
      contactPerson,
      companyEmail,
      companyLogo,
      newBidNotification,
      tenderStatusNotification,
      messageNotification,
      currentPassword,
      newPassword,
      confirmPassword,
      appLanguage,
      font,
      theme,
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCompanyLogo(URL.createObjectURL(file));
    }
  };

  const { t } = useTranslation();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 space-y-8">
        <form onSubmit={handleSaveAll}>
          {/* Notification Settings */}
          <Card className="border-0 px-0">
            <CardHeader className="border-0 px-0">
              <CardTitle className="text-2xl font-semibold text-gray-800">
                {t("notification_settings")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-0">
              <div className="flex items-center justify-between">
                <Label htmlFor="newBidNotification">
                  {t("bid_status_updates")}
                </Label>
                <Switch
                  id="newBidNotification"
                  checked={newBidNotification}
                  onCheckedChange={setNewBidNotification}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="tenderStatusNotification">
                  {t("tender_status_updates")}
                </Label>
                <Switch
                  id="tenderStatusNotification"
                  checked={tenderStatusNotification}
                  onCheckedChange={setTenderStatusNotification}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="newBids">{t("new_bids_on_your_tender")}</Label>
                <Switch
                  id="newBids"
                  checked={newBidNotification}
                  onCheckedChange={setNewBidNotification}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="profileVerification">
                  {t("profile_verification_updates")}
                </Label>
                <Switch
                  id="profileVerification"
                  checked={tenderStatusNotification}
                  onCheckedChange={setTenderStatusNotification}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="messageNotification">{t("new_messages")}</Label>
                <Switch
                  id="messageNotification"
                  checked={messageNotification}
                  onCheckedChange={setMessageNotification}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="px-0 border-0">
            <CardHeader className="px-0 border-0">
              <CardTitle className="text-2xl font-semibold text-gray-800">
                {t("security")}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 px-0">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">{t("current_password")}</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder={t("enter_current_password")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t("new_password")}</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t("enter_new_password")}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="confirmPassword">
                  {t("confirm_new_password")}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("confirm_new_password")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance & Language */}
          <Card className="border-0 px-0">
            <CardHeader className="border-0 px-0">
              <CardTitle className="text-2xl font-semibold text-gray-800">
                {t("appearance_and_language")}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 px-0">
              <div className="flex flex-col space-y-3 max-w-40">
                <Label htmlFor="appLanguage" className="mb-4">
                  {t("application_language")}
                </Label>
              </div>

              <div className="space-y-3 md:col-span-3">
                <Label className="text-base font-medium">{t("theme")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("select_the_theme_for_the_dashboard")}
                </p>
                <div className="flex items-center gap-3">
                  <Sun className="w-5 h-5 text-gray-500" />
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) =>
                      setTheme(checked ? "dark" : "light")
                    }
                  />
                  <Moon className="w-5 h-5 text-gray-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              {t("save_all_settings")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Moon, Sun, Thermometer } from "lucide-react";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");

  const [newBidNotification, setNewBidNotification] = useState(true);
  const [tenderStatusNotification, setTenderStatusNotification] =
    useState(true);
  const [messageNotification, setMessageNotification] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [appLanguage, setAppLanguage] = useState("en");

  // New states for Font & Theme
  const [font, setFont] = useState("Inter");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Saving settings:", {
      fullName,
      email,
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

  return (
    <div className="container mx-auto px-0 py-8">
      <Card className="border-0 bg-transparent px-0">
        <CardContent className="px-0">
          <form onSubmit={handleSaveAll} className="space-y-0">
            {/* Notification Settings */}
            <div className="space-y-4 pt-6 pb-6">
              <h2 className="text-lg font-semibold">Notification Settings</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>New Bid Received</Label>
                  <Switch
                    checked={newBidNotification}
                    onCheckedChange={setNewBidNotification}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Tender Status Updates</Label>
                  <Switch
                    checked={tenderStatusNotification}
                    onCheckedChange={setTenderStatusNotification}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>New Messages</Label>
                  <Switch
                    checked={messageNotification}
                    onCheckedChange={setMessageNotification}
                  />
                </div>
              </div>
            </div>

            {/* Language Settings */}
            <div className="space-y-4 pt-6 border-t">
              <h2 className="text-lg font-semibold pb-2">Language & Region</h2>
              <div className="max-w-sm flex flex-col gap-1">
                <Label htmlFor="appLanguage" className="pb-3">
                  Application Language
                </Label>
                <Select value={appLanguage} onValueChange={setAppLanguage}>
                  <SelectTrigger id="appLanguage">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية (Arabic)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Font & Theme Settings */}
            <div className="space-y-6 pt-6 border-t">
              {/* Font Selection */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Font</Label>
                <Select value={font} onValueChange={(value) => setFont(value)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Set the font you want to use in the dashboard.
                </p>
              </div>

              {/* Theme Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Select the theme for the dashboard.
                </p>
                <div className="flex items-center gap-3">
                  <Sun className="w-5 h-5" />
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) =>
                      setTheme(checked ? "dark" : "light")
                    }
                  />
                  <Moon className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Save All Settings
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

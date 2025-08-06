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
    });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className=" mx-auto px-3 py-2">
      <Card className="border-0 bg-transparent">
        <CardContent>
          <form onSubmit={handleSaveAll} className="space-y-0">
            {/* Notification Settings */}
            <div className="space-y-4 pt-6 pb-6 ">
              <h2 className="text-lg font-semibold">
                Notification Settings
              </h2>
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

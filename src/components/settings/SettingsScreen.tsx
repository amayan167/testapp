import React, { useState } from "react";
import {
  ArrowLeft,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useToast } from "../ui/use-toast";

interface SettingsScreenProps {
  onBack?: () => void;
  initialSettings?: {
    unitPreference: "km" | "miles";
    darkMode: boolean;
    notifications: boolean;
    sound: boolean;
  };
}

const SettingsScreen = ({
  onBack = () => {},
  initialSettings = {
    unitPreference: "km",
    darkMode: false,
    notifications: true,
    sound: true,
  },
}: SettingsScreenProps) => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(initialSettings);

  const handleUnitChange = (value: "km" | "miles") => {
    setSettings({ ...settings, unitPreference: value });
  };

  const handleToggleChange = (
    setting: "darkMode" | "notifications" | "sound",
  ) => {
    setSettings({ ...settings, [setting]: !settings[setting] });
  };

  const { toast } = useToast();

  const handleBack = () => {
    onBack();
    // If no custom back handler is provided, use navigation
    navigate(-1);
  };

  const handleEditProfile = () => {
    navigate("/profile/edit");
  };

  const handleChangePassword = () => {
    navigate("/profile/change-password");
  };

  const handleLogout = () => {
    // In a real app, you would clear auth tokens/state here
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/auth");
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <header className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="mr-2"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </header>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Units</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <span>Distance Unit</span>
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
                <Button
                  variant={
                    settings.unitPreference === "km" ? "default" : "ghost"
                  }
                  size="sm"
                  className={`rounded-full ${settings.unitPreference === "km" ? "bg-primary text-primary-foreground" : "bg-transparent"}`}
                  onClick={() => handleUnitChange("km")}
                >
                  Kilometers
                </Button>
                <Button
                  variant={
                    settings.unitPreference === "miles" ? "default" : "ghost"
                  }
                  size="sm"
                  className={`rounded-full ${settings.unitPreference === "miles" ? "bg-primary text-primary-foreground" : "bg-transparent"}`}
                  onClick={() => handleUnitChange("miles")}
                >
                  Miles
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {settings.darkMode ? (
                <Moon className="mr-2 h-5 w-5" />
              ) : (
                <Sun className="mr-2 h-5 w-5" />
              )}
              <span>Dark Mode</span>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={() => handleToggleChange("darkMode")}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {settings.notifications ? (
                  <Bell className="mr-2 h-5 w-5" />
                ) : (
                  <BellOff className="mr-2 h-5 w-5" />
                )}
                <span>Push Notifications</span>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={() => handleToggleChange("notifications")}
              />
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {settings.sound ? (
                  <Volume2 className="mr-2 h-5 w-5" />
                ) : (
                  <VolumeX className="mr-2 h-5 w-5" />
                )}
                <span>Sound Effects</span>
              </div>
              <Switch
                checked={settings.sound}
                onCheckedChange={() => handleToggleChange("sound")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleEditProfile}
            >
              Edit Profile
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleChangePassword}
            >
              Change Password
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsScreen;

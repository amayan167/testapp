import React, { useState } from "react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import {
  ArrowLeft,
  Edit,
  LogOut,
  Settings,
  BarChart,
  Clock,
  Users,
  AlertCircle,
  LogIn,
} from "lucide-react";
import RunHistory from "./RunHistory";
import RunStats from "./RunStats";
import FriendsList from "./FriendsList";
import AvatarDetails from "./AvatarDetails";
import { useNavigate } from "react-router-dom";

interface ProfileScreenProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    joinDate: string;
    isGuest?: boolean;
  };
  onLogout?: () => void;
  onEditProfile?: () => void;
  onSettingsClick?: () => void;
  preferredUnit?: "km" | "mi";
  onUnitChange?: (unit: "km" | "mi") => void;
  onConvertGuestAccount?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user = {
    name: "Jane Runner",
    email: "jane.runner@example.com",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    joinDate: "January 2023",
    isGuest: false,
  },
  onLogout,
  onEditProfile,
  onSettingsClick,
  preferredUnit = "mi",
  onUnitChange = (unit) => console.log(`Unit changed to ${unit}`),
  onConvertGuestAccount = () => console.log("Convert guest account clicked"),
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("stats");

  // Default handlers if props aren't provided
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      console.log("Logout clicked");
      navigate("/auth");
    }
  };

  const handleEditProfile = () => {
    if (onEditProfile) {
      onEditProfile();
    } else {
      console.log("Edit profile clicked");
      navigate("/profile/edit");
    }
  };

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      console.log("Settings clicked");
      navigate("/settings");
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleTabChange = (value: string) => {
    if (user.isGuest && value === "friends") {
      // If guest user tries to access friends tab, prompt to create account
      onConvertGuestAccount();
    } else {
      setActiveTab(value);
    }
  };

  const [unit, setUnit] = useState<"km" | "mi">(preferredUnit);

  const handleUnitChange = (checked: boolean) => {
    const newUnit = checked ? "mi" : "km";
    setUnit(newUnit);
    onUnitChange(newUnit);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleBackClick}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Profile</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleSettingsClick}>
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="p-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <AvatarDetails
                name={user.name}
                joinDate={user.isGuest ? "Guest Account" : user.joinDate}
                avatarUrl={user.avatar}
              />
              {!user.isGuest ? (
                <p className="text-sm text-muted-foreground mt-2">
                  {user.email}
                </p>
              ) : (
                <div className="mt-2 w-full">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={onConvertGuestAccount}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Create an Account
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Create an account to save your data and access all features
                  </p>
                </div>
              )}
              {!user.isGuest && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditProfile}
                  className="mt-4"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="unit-toggle" className="text-sm font-medium">
                  Distance Unit
                </Label>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-xs ${unit === "km" ? "font-bold" : "text-muted-foreground"}`}
                  >
                    KM
                  </span>
                  <Switch
                    id="unit-toggle"
                    checked={unit === "mi"}
                    onCheckedChange={handleUnitChange}
                  />
                  <span
                    className={`text-xs ${unit === "mi" ? "font-bold" : "text-muted-foreground"}`}
                  >
                    MI
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Stats and History */}
      <div className="flex-1 p-4 pt-0">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="stats">
              <BarChart className="h-4 w-4 mr-2" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger
              value="friends"
              disabled={user.isGuest}
              className={user.isGuest ? "relative" : ""}
            >
              <Users className="h-4 w-4 mr-2" />
              Friends
              {user.isGuest && (
                <AlertCircle className="h-3 w-3 absolute top-1 right-1 text-amber-500" />
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="stats" className="mt-0">
            <RunStats unit={unit} />
          </TabsContent>
          <TabsContent value="history" className="mt-0">
            <RunHistory unit={unit} limitedView={user.isGuest} />
          </TabsContent>
          <TabsContent value="friends" className="mt-0">
            <FriendsList unit={unit} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileScreen;

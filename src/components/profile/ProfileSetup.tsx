import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UnitPreference from "./UnitPreference";
import { ArrowRight, Camera, User, ArrowLeft } from "lucide-react";

interface ProfileSetupProps {
  onComplete?: (profileData: ProfileData) => void;
  initialData?: Partial<ProfileData>;
}

interface ProfileData {
  name: string;
  age: string;
  weight: string;
  heightFeet: string;
  heightInches: string;
  profileImage?: string;
  preferredUnit: "km" | "miles";
}

const ProfileSetup = ({ onComplete, initialData = {} }: ProfileSetupProps) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: initialData.name || "",
    age: initialData.age || "",
    weight: initialData.weight || "",
    heightFeet: initialData.heightFeet || "",
    heightInches: initialData.heightInches || "0",
    profileImage: initialData.profileImage || "",
    preferredUnit: initialData.preferredUnit || "miles",
  });

  const [step, setStep] = useState<number>(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUnitChange = (unit: "km" | "miles") => {
    setProfileData((prev) => ({
      ...prev,
      preferredUnit: unit,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onComplete) {
      onComplete(profileData);
    }
  };

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Set Up Your Profile</h1>
          {step > 1 && (
            <Button variant="ghost" size="icon" onClick={handlePrevStep}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
        </div>
        <div className="w-full bg-muted h-1 mt-4">
          <div
            className="bg-primary h-1 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        {profileData.profileImage ? (
                          <AvatarImage src={profileData.profileImage} />
                        ) : (
                          <AvatarFallback className="bg-primary/10 text-primary text-xl">
                            {profileData.name ? (
                              getInitials(profileData.name)
                            ) : (
                              <User />
                            )}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                        type="button"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={profileData.age}
                      onChange={handleInputChange}
                      placeholder="Enter your age"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Physical Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (ft & in)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Input
                          id="heightFeet"
                          name="heightFeet"
                          type="number"
                          value={profileData.heightFeet}
                          onChange={handleInputChange}
                          placeholder="Feet"
                          required
                        />
                      </div>
                      <div>
                        <Input
                          id="heightInches"
                          name="heightInches"
                          type="number"
                          min="0"
                          max="11"
                          value={profileData.heightInches}
                          onChange={handleInputChange}
                          placeholder="Inches"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (lbs)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      value={profileData.weight}
                      onChange={handleInputChange}
                      placeholder="Enter your weight"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Label>Distance Unit</Label>
                    <UnitPreference
                      selectedUnit={profileData.preferredUnit}
                      onUnitChange={handleUnitChange}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </form>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 p-4 bg-background border-t">
        {step < 3 ? (
          <Button
            className="w-full"
            onClick={handleNextStep}
            disabled={step === 1 && (!profileData.name || !profileData.age)}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button className="w-full" onClick={handleSubmit}>
            Complete Setup
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileSetup;

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  Save,
  X,
  Share2,
  Award,
  Flame,
  Heart,
  Timer,
  BarChart3,
} from "lucide-react";

interface RunData {
  id: string;
  date: string;
  distance: number;
  duration: string;
  pace: string;
  location: string;
  elevationGain?: number;
  isPersonalBest?: boolean;
  route?: { lat: number; lng: number }[];
}

interface RunSummaryProps {
  onSaveRun?: (runData: RunData) => void;
  onDiscardRun?: () => void;
  unit?: "km" | "mi";
}

const RunSummary: React.FC<RunSummaryProps> = ({
  onSaveRun = () => {},
  onDiscardRun = () => {},
  unit = "mi",
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const runData = (location.state?.runData as RunData) || {
    id: "123",
    date: new Date().toISOString(),
    distance: 5.2,
    duration: "28:35",
    pace: "5:30",
    location: "Central Park, New York",
    elevationGain: 45,
    route: [{ lat: 40.785091, lng: -73.968285 }],
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Check if this is a personal best
  // In a real app, this would compare with previous runs
  const checkPersonalBest = (run: RunData): boolean => {
    // For demo purposes, let's say it's a personal best if pace is under 6 min/km or mi
    const paceParts = run.pace.split(":");
    const paceMinutes = parseInt(paceParts[0]);
    const paceSeconds = parseInt(paceParts[1]);

    return paceMinutes < 6 || (paceMinutes === 6 && paceSeconds === 0);
  };

  // Handle save run
  const handleSaveRun = () => {
    // Check if it's a personal best
    const isPersonalBest = checkPersonalBest(runData);
    const updatedRunData = { ...runData, isPersonalBest };

    onSaveRun(updatedRunData);
    navigate("/");
  };

  // Handle discard run
  const handleDiscardRun = () => {
    onDiscardRun();
    navigate("/");
  };

  // Calculate calories burned (improved estimation based on distance and pace)
  const calculateCalories = (distance: number, pace: string): number => {
    // Parse pace into minutes and seconds
    const [paceMin, paceSec] = pace.split(":").map(Number);
    const paceInMinutes = paceMin + paceSec / 60;

    // Estimate MET (Metabolic Equivalent of Task) based on pace
    // Slower pace = lower MET, faster pace = higher MET
    let met = 7; // Default MET for moderate running

    // Adjust MET thresholds for miles (slightly different from km pace)
    if (paceInMinutes < 8)
      met = 11; // Very fast running
    else if (paceInMinutes < 9)
      met = 10; // Fast running
    else if (paceInMinutes < 10)
      met = 9; // Moderately fast running
    else if (paceInMinutes < 12)
      met = 8; // Moderate running
    else if (paceInMinutes >= 12) met = 7; // Slower running/jogging

    // Assume average weight of 70kg if not available
    const weight = 70;

    // Calculate duration in hours (distance / pace in km/h)
    const paceInKmPerHour = 60 / paceInMinutes;
    const durationInHours = distance / paceInKmPerHour;

    // Calories = MET × weight (kg) × duration (hours)
    return Math.round(met * weight * durationInHours);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Run Complete!</h1>
          <Button variant="ghost" size="icon" onClick={handleDiscardRun}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4 pb-20">
        {/* Achievement Banner */}
        {checkPersonalBest(runData) && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4 flex items-center gap-3 mb-2 shadow-sm">
            <div className="bg-green-100 p-2 rounded-full">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-green-800">New Personal Best!</h3>
              <p className="text-sm text-green-600">
                Your fastest {runData.distance} {unit} run yet
              </p>
            </div>
          </div>
        )}

        {/* Run Summary Card */}
        <Card className="overflow-hidden border-none shadow-md bg-white">
          <CardHeader className="bg-primary/5 pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(runData.date)}
              </CardTitle>
              {checkPersonalBest(runData) && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 border-green-200"
                >
                  Personal Best
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col items-center justify-center p-3 bg-blue-50 rounded-lg shadow-sm border border-blue-100">
                <div className="bg-blue-100 p-1.5 rounded-full mb-1">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-xs text-muted-foreground mb-1">
                  Distance
                </span>
                <span className="font-semibold text-lg text-blue-700">
                  {runData.distance} {unit}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-purple-50 rounded-lg shadow-sm border border-purple-100">
                <div className="bg-purple-100 p-1.5 rounded-full mb-1">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-xs text-muted-foreground mb-1">Time</span>
                <span className="font-semibold text-lg text-purple-700">
                  {runData.duration}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-amber-50 rounded-lg shadow-sm border border-amber-100">
                <div className="bg-amber-100 p-1.5 rounded-full mb-1">
                  <Timer className="h-4 w-4 text-amber-600" />
                </div>
                <span className="text-xs text-muted-foreground mb-1">Pace</span>
                <span className="font-semibold text-lg text-amber-700">
                  {runData.pace} min/{unit}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded-md">
              <MapPin className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">{runData.location}</span>
            </div>

            <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded-md">
              <TrendingUp className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">
                {runData.elevationGain || 0}m elevation gain
              </span>
            </div>

            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-md border border-orange-100">
              <Flame className="h-5 w-5 text-orange-500" />
              <div>
                <span className="text-sm font-medium block">
                  {calculateCalories(runData.distance, runData.pace)} calories
                </span>
                <span className="text-xs text-gray-500">
                  Based on your pace and distance
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Card */}
        <Card className="overflow-hidden border-none shadow-md bg-white">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">Your Route</CardTitle>
            <Badge variant="outline" className="text-xs">
              {runData.distance} {unit}
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-gray-100 h-48 relative overflow-hidden rounded-md">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-100 opacity-50"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-primary/60 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 font-medium">
                    Route map visualization
                  </p>
                  <p className="text-xs text-gray-500">
                    GPS data recorded for this run
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Heart Rate Card (Mock) */}
        <Card className="overflow-hidden border-none shadow-md bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              Heart Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                  <span className="text-xs text-gray-500 block">Average</span>
                  <span className="font-semibold text-lg text-red-700 flex items-center">
                    145 <span className="text-xs ml-1">bpm</span>
                  </span>
                </div>
                <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                  <span className="text-xs text-gray-500 block">Maximum</span>
                  <span className="font-semibold text-lg text-red-700 flex items-center">
                    172 <span className="text-xs ml-1">bpm</span>
                  </span>
                </div>
              </div>
              <div className="h-24 bg-gray-50 rounded-md border border-gray-100 relative overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-16">
                  <svg
                    viewBox="0 0 100 20"
                    preserveAspectRatio="none"
                    className="w-full h-full"
                  >
                    <path
                      d="M0,10 L5,8 L10,12 L15,10 L20,13 L25,9 L30,14 L35,13 L40,16 L45,7 L50,15 L55,13 L60,16 L65,14 L70,16 L75,11 L80,15 L85,10 L90,13 L95,9 L100,11"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="1"
                      className="stroke-2"
                    />
                  </svg>
                </div>
                <div className="absolute top-2 left-2 right-2 flex justify-between">
                  <span className="text-xs text-gray-400">0:00</span>
                  <span className="text-xs text-gray-400">28:35</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-md">
        <div className="flex gap-3 max-w-md mx-auto">
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={handleSaveRun}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Run
          </Button>
          <Button variant="outline" className="flex-1">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RunSummary;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Play,
  User,
  Settings,
  Award,
  BarChart,
  Calendar,
  Users,
  LogIn,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";

interface HomeScreenProps {
  user?: {
    name: string;
    avatar?: string;
    isGuest?: boolean;
    guestRunCount?: number;
  };
  lastRun?: {
    date: string;
    distance: number;
    duration: string;
    pace: string;
  };
  stats?: {
    totalRuns: number;
    totalDistance: number;
    preferredUnit: "km" | "mi";
  };
  onStartRun?: () => void;
  onViewProfile?: () => void;
  onViewSettings?: () => void;
  onConvertGuestAccount?: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  user = {
    name: "Jane Runner",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    isGuest: false,
    guestRunCount: 0,
  },
  lastRun = {
    date: "2 days ago",
    distance: 5.2,
    duration: "28:35",
    pace: "5:30",
  },
  stats = {
    totalRuns: 24,
    totalDistance: 127.5,
    preferredUnit: "km",
  },
  onStartRun = () => console.log("Start run clicked"),
  onViewProfile = () => console.log("View profile clicked"),
  onViewSettings = () => console.log("View settings clicked"),
  onConvertGuestAccount = () => console.log("Convert guest account clicked"),
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);

  // Show account creation prompt after 3 runs for guest users
  useEffect(() => {
    if (user.isGuest && (user.guestRunCount || 0) >= 3 && !showAccountPrompt) {
      setShowAccountPrompt(true);
    }
  }, [user.isGuest, user.guestRunCount]);

  const handleStartRun = () => {
    setIsLoading(true);
    // Simulate loading state
    setTimeout(() => {
      setIsLoading(false);
      onStartRun();
      navigate("/run");
    }, 500);
  };

  const handleViewProfile = () => {
    onViewProfile();
    navigate("/profile");
  };

  const handleViewSettings = () => {
    onViewSettings();
    navigate("/settings");
  };

  const handleViewCommunity = () => {
    if (user.isGuest) {
      setShowAccountPrompt(true);
    } else {
      navigate("/community");
    }
  };

  const handleCreateAccount = () => {
    setShowAccountPrompt(false);
    onConvertGuestAccount();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Run Tracker</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleViewProfile}>
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleViewSettings}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {/* Welcome Card */}
        <Card className="mb-4 bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">
              Welcome{user.isGuest ? "" : " back"}, {user.name}!
            </h2>
            <p className="text-sm opacity-90">
              Ready for your next run?{" "}
              {!user.isGuest && "Your stats are looking great!"}
            </p>
            {user.isGuest && (
              <div className="mt-2 pt-2 border-t border-primary-foreground/20">
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-1 w-full"
                  onClick={handleCreateAccount}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Create an account to unlock all features
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <BarChart className="h-6 w-6 mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Total Runs</p>
              <p className="text-xl font-bold">{stats.totalRuns}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Award className="h-6 w-6 mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Total Distance</p>
              <p className="text-xl font-bold">
                {stats.totalDistance} {stats.preferredUnit}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Last Run Card */}
        {lastRun && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Last Run</h3>
                <span className="text-xs text-muted-foreground">
                  {lastRun.date}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Distance</p>
                  <p className="font-bold">
                    {lastRun.distance} {stats.preferredUnit}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-bold">{lastRun.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pace</p>
                  <p className="font-bold">
                    {lastRun.pace} /{stats.preferredUnit}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Start Run Button */}
        <Button
          className="w-full py-6 text-lg rounded-xl shadow-lg"
          onClick={handleStartRun}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Preparing...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Play className="mr-2 h-5 w-5" fill="currentColor" />
              Start Run
            </span>
          )}
        </Button>
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 bg-background border-t p-2">
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant="ghost"
            className="flex flex-col items-center py-2"
            onClick={handleStartRun}
          >
            <Play className="h-5 w-5" />
            <span className="text-xs mt-1">Run</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center py-2"
            onClick={handleViewProfile}
          >
            <BarChart className="h-5 w-5" />
            <span className="text-xs mt-1">Stats</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center py-2 ${user.isGuest ? "opacity-50" : ""}`}
            onClick={handleViewCommunity}
          >
            <Users className="h-5 w-5" />
            <span className="text-xs mt-1">Community</span>
            {user.isGuest && (
              <AlertCircle className="h-3 w-3 absolute top-1 right-1 text-amber-500" />
            )}
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center py-2"
            onClick={handleViewProfile}
          >
            <Calendar className="h-5 w-5" />
            <span className="text-xs mt-1">History</span>
          </Button>
        </div>
      </div>

      {/* Account Creation Prompt Dialog */}
      <Dialog open={showAccountPrompt} onOpenChange={setShowAccountPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create an Account</DialogTitle>
            <DialogDescription>
              Create an account to unlock all features and save your run history
              permanently.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-4 mb-4 p-3 bg-blue-50 rounded-md">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <h4 className="font-medium">Community Features</h4>
                <p className="text-sm text-muted-foreground">
                  Connect with other runners and share your achievements
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-md">
              <Calendar className="h-8 w-8 text-green-500" />
              <div>
                <h4 className="font-medium">Unlimited Run History</h4>
                <p className="text-sm text-muted-foreground">
                  Keep track of all your runs and progress over time
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAccountPrompt(false)}
              className="sm:flex-1"
            >
              Maybe Later
            </Button>
            <Button onClick={handleCreateAccount} className="sm:flex-1">
              Create Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomeScreen;

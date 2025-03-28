import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthScreen from "./auth/AuthScreen";
import HomeScreen from "./home/HomeScreen";
import ProfileSetup from "./profile/ProfileSetup";

interface User {
  id: string;
  name: string;
  avatar?: string;
  isProfileComplete: boolean;
  isGuest?: boolean;
  guestRunCount?: number;
}

interface RunStats {
  totalRuns: number;
  totalDistance: number;
  preferredUnit: "km" | "mi";
}

interface LastRun {
  date: string;
  distance: number;
  duration: string;
  pace: string;
}

interface GuestRunData {
  runs: Array<{
    date: string;
    distance: number;
    duration: string;
    pace: string;
  }>;
  stats: {
    totalRuns: number;
    totalDistance: number;
    preferredUnit: "km" | "mi";
  };
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<RunStats>({
    totalRuns: 0,
    totalDistance: 0,
    preferredUnit: "km",
  });
  const [lastRun, setLastRun] = useState<LastRun | null>(null);
  const [isConvertingFromGuest, setIsConvertingFromGuest] =
    useState<boolean>(false);
  const [guestRunData, setGuestRunData] = useState<GuestRunData | null>(null);

  // Simulate checking for authentication on component mount
  useEffect(() => {
    // In a real app, this would check for a valid session token
    const checkAuth = () => {
      const hasSession = localStorage.getItem("runapp_session");
      const isGuest = localStorage.getItem("runapp_guest") === "true";

      if (hasSession) {
        // Mock user data
        setUser({
          id: "1",
          name: isGuest ? "Guest User" : "Jane Runner",
          avatar: isGuest
            ? undefined
            : "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
          isProfileComplete: isGuest
            ? true
            : localStorage.getItem("runapp_profile_complete") === "true",
          isGuest: isGuest,
          guestRunCount: isGuest
            ? parseInt(localStorage.getItem("runapp_guest_run_count") || "0")
            : 0,
        });
        setIsAuthenticated(true);

        // Mock stats data
        setStats({
          totalRuns: isGuest
            ? parseInt(localStorage.getItem("runapp_guest_total_runs") || "0")
            : 24,
          totalDistance: isGuest
            ? parseFloat(
                localStorage.getItem("runapp_guest_total_distance") || "0",
              )
            : 127.5,
          preferredUnit:
            (localStorage.getItem("runapp_unit") as "km" | "mi") || "km",
        });

        // Mock last run data
        if (isGuest) {
          const guestLastRun = localStorage.getItem("runapp_guest_last_run");
          if (guestLastRun) {
            setLastRun(JSON.parse(guestLastRun));
          }
        } else {
          setLastRun({
            date: "2 days ago",
            distance: 5.2,
            duration: "28:35",
            pace: "5:30",
          });
        }

        // Prepare guest run data for potential conversion
        if (isGuest) {
          const guestRuns = localStorage.getItem("runapp_guest_runs");
          if (guestRuns) {
            setGuestRunData({
              runs: JSON.parse(guestRuns),
              stats: {
                totalRuns: stats.totalRuns,
                totalDistance: stats.totalDistance,
                preferredUnit: stats.preferredUnit,
              },
            });
          }
        }
      } else {
        // Always start with authentication screen for new users
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    // Simulate network delay
    setTimeout(checkAuth, 1000);
  }, []);

  const handleAuthenticated = (isGuest: boolean = false) => {
    localStorage.setItem("runapp_session", "true");

    if (isGuest) {
      localStorage.setItem("runapp_guest", "true");
      localStorage.setItem("runapp_guest_run_count", "0");
      localStorage.setItem("runapp_guest_total_runs", "0");
      localStorage.setItem("runapp_guest_total_distance", "0");
      localStorage.setItem("runapp_guest_runs", JSON.stringify([]));
    } else {
      localStorage.removeItem("runapp_guest");
    }

    setIsAuthenticated(true);
    setUser({
      id: "1",
      name: isGuest ? "Guest User" : "New User",
      isProfileComplete: isGuest ? true : false,
      isGuest: isGuest,
      guestRunCount: 0,
    });
  };

  const handleProfileComplete = (profileData: any) => {
    localStorage.setItem("runapp_profile_complete", "true");
    localStorage.setItem("runapp_unit", profileData.preferredUnit);

    setUser((prev) =>
      prev
        ? {
            ...prev,
            name: profileData.name,
            isProfileComplete: true,
            isGuest: false,
          }
        : null,
    );

    setStats((prev) => ({
      ...prev,
      preferredUnit: profileData.preferredUnit,
    }));
  };

  const handleStartRun = () => {
    // If user is a guest, increment their run count
    if (user?.isGuest) {
      const newRunCount = (user.guestRunCount || 0) + 1;
      localStorage.setItem("runapp_guest_run_count", newRunCount.toString());
      setUser((prev) =>
        prev ? { ...prev, guestRunCount: newRunCount } : null,
      );
    }
    navigate("/run");
  };

  const handleViewProfile = () => {
    navigate("/profile");
  };

  const handleViewSettings = () => {
    navigate("/settings");
  };

  const handleConvertGuestAccount = () => {
    setIsConvertingFromGuest(true);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthScreen
        onAuthenticated={handleAuthenticated}
        isConvertingFromGuest={isConvertingFromGuest}
        guestRunData={guestRunData}
      />
    );
  }

  if (user && !user.isGuest && !user.isProfileComplete) {
    return <ProfileSetup onComplete={handleProfileComplete} />;
  }

  return (
    <HomeScreen
      user={
        user
          ? {
              name: user.name,
              avatar: user.avatar,
              isGuest: user.isGuest,
              guestRunCount: user.guestRunCount,
            }
          : undefined
      }
      stats={stats}
      lastRun={lastRun || undefined}
      onStartRun={handleStartRun}
      onViewProfile={handleViewProfile}
      onViewSettings={handleViewSettings}
      onConvertGuestAccount={handleConvertGuestAccount}
    />
  );
};

export default Home;

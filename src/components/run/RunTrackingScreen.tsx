import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pause, Play, StopCircle, ArrowLeft, MapPin } from "lucide-react";

interface RunTrackingScreenProps {
  onSaveRun?: (runData: RunData) => void;
  onDiscardRun?: () => void;
  unit?: "km" | "mi";
}

interface Position {
  latitude: number;
  longitude: number;
  timestamp: number;
}

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

const RunTrackingScreen: React.FC<RunTrackingScreenProps> = ({
  onSaveRun = () => {},
  onDiscardRun = () => {},
  unit = "mi",
}) => {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [currentPace, setCurrentPace] = useState("-:--");
  const [positions, setPositions] = useState<Position[]>([]);
  const [currentLocation, setCurrentLocation] = useState(
    "Determining location...",
  );
  const [watchId, setWatchId] = useState<number | null>(null);

  // Format time as MM:SS or HH:MM:SS
  const formatTime = (timeInSeconds: number): string => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371; // Earth's radius in km (will convert to miles later if needed)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c; // Distance in km

    // Convert to miles if needed
    if (unit === "mi") {
      distance *= 0.621371; // Convert km to miles
    }

    return distance;
  };

  // Calculate pace (minutes per km/mile)
  const calculatePace = (
    distanceInKm: number,
    timeInSeconds: number,
  ): string => {
    if (distanceInKm <= 0 || timeInSeconds <= 0) return "-:--";

    const paceInSecondsPerUnit = timeInSeconds / distanceInKm;
    const paceMinutes = Math.floor(paceInSecondsPerUnit / 60);
    const paceSeconds = Math.floor(paceInSecondsPerUnit % 60);

    return `${paceMinutes}:${paceSeconds.toString().padStart(2, "0")}`;
  };

  // Update elapsed time
  useEffect(() => {
    let interval: number | null = null;

    if (isRunning && !isPaused && startTime) {
      interval = window.setInterval(() => {
        const now = Date.now();
        setElapsedTime(
          (prev) => prev + (now - (startTime + prev * 1000)) / 1000,
        );
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused, startTime]);

  // Start location tracking
  const startLocationTracking = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    // Get initial location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPositions([{ latitude, longitude, timestamp: Date.now() }]);

        // Try to get location name using reverse geocoding
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.display_name) {
              const locationParts = data.display_name.split(", ");
              // Use first part and last part for a shorter name
              setCurrentLocation(
                `${locationParts[0]}, ${locationParts[locationParts.length - 1]}`,
              );
            }
          })
          .catch(() => {
            setCurrentLocation("Unknown location");
          });
      },
      (error) => {
        console.error("Error getting location:", error);
        setCurrentLocation("Location unavailable");
      },
    );

    // Start watching position
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const timestamp = Date.now();

        setPositions((prev) => {
          const newPositions = [...prev, { latitude, longitude, timestamp }];

          // Calculate new distance if we have at least two positions
          if (newPositions.length >= 2) {
            const lastPos = newPositions[newPositions.length - 2];
            const newPos = newPositions[newPositions.length - 1];

            const segmentDistance = calculateDistance(
              lastPos.latitude,
              lastPos.longitude,
              newPos.latitude,
              newPos.longitude,
            );

            // Only add distance if it's reasonable (to filter out GPS jumps)
            if (segmentDistance < 0.1) {
              // Less than 100m
              setDistance((prev) => {
                const newDistance = prev + segmentDistance;
                // Update pace
                if (elapsedTime > 0) {
                  setCurrentPace(calculatePace(newDistance, elapsedTime));
                }
                return newDistance;
              });
            }
          }

          return newPositions;
        });
      },
      (error) => {
        console.error("Error tracking location:", error);
      },
      { enableHighAccuracy: true, maximumAge: 0 },
    );

    setWatchId(id);
  }, [elapsedTime, unit]);

  // Stop location tracking
  const stopLocationTracking = useCallback(() => {
    if (watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  // Start run
  const handleStartRun = () => {
    setIsRunning(true);
    setIsPaused(false);
    setStartTime(Date.now());
    startLocationTracking();
  };

  // Pause run
  const handlePauseRun = () => {
    setIsPaused(true);
  };

  // Resume run
  const handleResumeRun = () => {
    setIsPaused(false);
    setStartTime(Date.now() - elapsedTime * 1000);
  };

  // Stop run
  const handleStopRun = () => {
    setIsRunning(false);
    setIsPaused(false);
    stopLocationTracking();

    // Prepare run data
    const runData: RunData = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      distance: parseFloat(distance.toFixed(2)),
      duration: formatTime(elapsedTime),
      pace: currentPace,
      location: currentLocation,
      elevationGain: 0, // Would need elevation API for real data
      route: positions.map((pos) => ({
        lat: pos.latitude,
        lng: pos.longitude,
      })),
    };

    // Navigate to summary screen
    navigate("/run-summary", { state: { runData } });
  };

  // Discard run
  const handleDiscardRun = () => {
    setIsRunning(false);
    setIsPaused(false);
    setElapsedTime(0);
    setDistance(0);
    setCurrentPace("-:--");
    setPositions([]);
    stopLocationTracking();
    onDiscardRun();
    navigate("/");
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopLocationTracking();
    };
  }, [stopLocationTracking]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Track Run</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Location */}
        <Card className="mb-4">
          <CardContent className="p-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-primary" />
            <span className="text-sm truncate">{currentLocation}</span>
          </CardContent>
        </Card>

        {/* Stats Display */}
        <div className="flex-1 flex flex-col justify-center items-center mb-8">
          {/* Time */}
          <div className="text-5xl font-bold mb-8">
            {formatTime(elapsedTime)}
          </div>

          {/* Distance and Pace */}
          <div className="grid grid-cols-2 gap-8 w-full max-w-xs">
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground mb-1">
                Distance
              </span>
              <span className="text-3xl font-bold">{distance.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">{unit}</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground mb-1">Pace</span>
              <span className="text-3xl font-bold">{currentPace}</span>
              <span className="text-sm text-muted-foreground">min/{unit}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mb-4">
          {!isRunning ? (
            <Button className="h-16 w-16 rounded-full" onClick={handleStartRun}>
              <Play className="h-8 w-8" fill="currentColor" />
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="h-16 w-16 rounded-full"
                onClick={handleStopRun}
              >
                <StopCircle className="h-8 w-8" />
              </Button>

              {isPaused ? (
                <Button
                  className="h-16 w-16 rounded-full"
                  onClick={handleResumeRun}
                >
                  <Play className="h-8 w-8" fill="currentColor" />
                </Button>
              ) : (
                <Button
                  className="h-16 w-16 rounded-full"
                  onClick={handlePauseRun}
                >
                  <Pause className="h-8 w-8" fill="currentColor" />
                </Button>
              )}
            </>
          )}
        </div>

        {/* Discard Button (only shown when running) */}
        {isRunning && (
          <Button
            variant="ghost"
            className="text-destructive"
            onClick={handleDiscardRun}
          >
            Discard Run
          </Button>
        )}
      </div>
    </div>
  );
};

export default RunTrackingScreen;

import React from "react";
import { Calendar, Clock, MapPin, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RunData {
  id: string;
  date: string;
  distance: number;
  duration: string;
  pace: string;
  location: string;
  elevationGain?: number;
  isPersonalBest?: boolean;
}

interface RunHistoryProps {
  runs?: RunData[];
  unit?: "km" | "mi";
}

const RunHistory = ({
  runs = [
    {
      id: "1",
      date: "2023-06-15",
      distance: 5.2,
      duration: "28:45",
      pace: "5:32",
      location: "Central Park",
      elevationGain: 45,
      isPersonalBest: true,
    },
    {
      id: "2",
      date: "2023-06-12",
      distance: 3.7,
      duration: "21:30",
      pace: "5:48",
      location: "Riverside Trail",
      elevationGain: 20,
    },
    {
      id: "3",
      date: "2023-06-08",
      distance: 8.1,
      duration: "47:15",
      pace: "5:50",
      location: "Beach Boardwalk",
      elevationGain: 12,
    },
  ],
  unit = "km",
}: RunHistoryProps) => {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="w-full bg-background p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">Run History</h2>

      {runs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No runs recorded yet. Start your first run to see your history!
        </div>
      ) : (
        <div className="space-y-3">
          {runs.map((run) => (
            <Card key={run.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(run.date)}
                  </CardTitle>
                  {run.isPersonalBest && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 border-green-200"
                    >
                      Personal Best
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm truncate">{run.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{run.elevationGain || 0}m</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-base">
                      {run.distance} {unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{run.duration}</span>
                  </div>
                  <div className="col-span-2 mt-1">
                    <div className="text-xs text-muted-foreground">Pace</div>
                    <div className="font-medium">
                      {run.pace} min/{unit}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RunHistory;

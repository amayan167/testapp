import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Separator } from "../../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Trophy, TrendingUp, Calendar, Clock, Route } from "lucide-react";

interface RunStatsProps {
  totalDistance?: number;
  totalRuns?: number;
  avgPace?: string;
  bestPace?: string;
  longestRun?: number;
  weeklyGoal?: number;
  weeklyProgress?: number;
  recentAchievements?: {
    title: string;
    date: string;
    icon: string;
  }[];
  monthlyStats?: {
    month: string;
    distance: number;
    runs: number;
  }[];
  unit?: "km" | "mi";
}

const RunStats: React.FC<RunStatsProps> = ({
  totalDistance = 124.5,
  totalRuns = 28,
  avgPace = "5:42",
  bestPace = "4:53",
  longestRun = 15.3,
  weeklyGoal = 30,
  weeklyProgress = 18.5,
  recentAchievements = [
    { title: "Personal Best 5K", date: "2 days ago", icon: "trophy" },
    { title: "10 Day Streak", date: "Yesterday", icon: "trending-up" },
    { title: "Marathon Ready", date: "1 week ago", icon: "route" },
  ],
  monthlyStats = [
    { month: "Jan", distance: 85.2, runs: 18 },
    { month: "Feb", distance: 92.7, runs: 20 },
    { month: "Mar", distance: 124.5, runs: 28 },
  ],
  unit = "km",
}) => {
  const progressPercentage = (weeklyProgress / weeklyGoal) * 100;

  return (
    <div className="w-full max-w-md mx-auto bg-background p-4 space-y-4">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-2">
          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-card">
              <CardContent className="p-4">
                <div className="flex flex-col items-center">
                  <Route className="h-8 w-8 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Total Distance
                  </p>
                  <p className="text-2xl font-bold">
                    {totalDistance} {unit}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="p-4">
                <div className="flex flex-col items-center">
                  <Calendar className="h-8 w-8 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Total Runs</p>
                  <p className="text-2xl font-bold">{totalRuns}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="p-4">
                <div className="flex flex-col items-center">
                  <Clock className="h-8 w-8 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Avg Pace</p>
                  <p className="text-2xl font-bold">
                    {avgPace} min/{unit}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="p-4">
                <div className="flex flex-col items-center">
                  <TrendingUp className="h-8 w-8 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Longest Run</p>
                  <p className="text-2xl font-bold">
                    {longestRun} {unit}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Progress */}
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Weekly Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Progress
                  </span>
                  <span className="text-sm font-medium">
                    {weeklyProgress}/{weeklyGoal} {unit}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {recentAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-center p-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      {achievement.icon === "trophy" && (
                        <Trophy className="h-5 w-5 text-primary" />
                      )}
                      {achievement.icon === "trending-up" && (
                        <TrendingUp className="h-5 w-5 text-primary" />
                      )}
                      {achievement.icon === "route" && (
                        <Route className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {achievement.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4 mt-2">
          {/* Monthly Stats */}
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Monthly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-end justify-between pt-6">
                {monthlyStats.map((stat, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="relative w-12">
                      <div
                        className="absolute bottom-0 w-full bg-primary rounded-t"
                        style={{ height: `${(stat.distance / 150) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm font-medium mt-2">{stat.month}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.distance} {unit}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Personal Records */}
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Personal Records</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="p-4 flex justify-between items-center">
                  <span>Best Pace</span>
                  <span className="font-bold">
                    {bestPace} min/{unit}
                  </span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span>Fastest 5K</span>
                  <span className="font-bold">23:45</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span>Fastest 10K</span>
                  <span className="font-bold">52:18</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RunStats;

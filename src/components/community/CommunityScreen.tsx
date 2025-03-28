import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Users,
  MessageSquare,
  Award,
  Search,
  ThumbsUp,
  MessageCircle,
  Share2,
  User,
  Settings,
  Plus,
  MapPin,
  Timer,
  Ruler,
  X,
} from "lucide-react";

interface Comment {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  text: string;
  date: string;
}

interface RunPost {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  date: string;
  distance: number;
  duration: string;
  pace: string;
  location: string;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
  shared: boolean;
}

interface ChallengeItem {
  id: string;
  title: string;
  description: string;
  participants: number;
  endDate: string;
  isJoined: boolean;
}

interface CommunityScreenProps {
  unit?: "km" | "mi";
}

const CommunityScreen: React.FC<CommunityScreenProps> = ({ unit = "mi" }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("feed");
  const [showShareRunModal, setShowShareRunModal] = useState(false);
  const [newRunData, setNewRunData] = useState({
    distance: 0,
    duration: "",
    location: "",
  });
  const [showComments, setShowComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  // Mock data for nearby runners
  const [nearbyRunners, setNearbyRunners] = useState([
    {
      id: "r1",
      name: "Alex Rivera",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
      distance: "0.5 miles away",
      pace: "8:30 /mi",
      totalRuns: 45,
      isFriend: false,
      isFollowing: true,
    },
    {
      id: "r2",
      name: "Jordan Taylor",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      distance: "1.2 miles away",
      pace: "7:45 /mi",
      totalRuns: 78,
      isFriend: true,
      isFollowing: true,
    },
    {
      id: "r3",
      name: "Casey Morgan",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
      distance: "2.0 miles away",
      pace: "9:15 /mi",
      totalRuns: 32,
      isFriend: false,
      isFollowing: false,
    },
  ]);

  // Mock data for the feed
  const [posts, setPosts] = useState<RunPost[]>([
    {
      id: "1",
      user: {
        name: "Sarah Johnson",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
      },
      date: "2 hours ago",
      distance: 5.2,
      duration: "42:15",
      pace: "8:07",
      location: "Central Park",
      likes: 24,
      comments: [
        {
          id: "c1",
          user: {
            name: "Mike Chen",
            avatar:
              "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80",
          },
          text: "Great pace! How was the weather?",
          date: "1 hour ago",
        },
        {
          id: "c2",
          user: {
            name: "Emma Wilson",
            avatar:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
          },
          text: "Love that route!",
          date: "30 minutes ago",
        },
      ],
      isLiked: false,
      shared: false,
    },
    {
      id: "2",
      user: {
        name: "Mike Chen",
        avatar:
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80",
      },
      date: "Yesterday",
      distance: 10.0,
      duration: "1:21:30",
      pace: "8:09",
      location: "Riverside Trail",
      likes: 42,
      comments: [
        {
          id: "c3",
          user: {
            name: "Sarah Johnson",
            avatar:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
          },
          text: "Amazing distance! How do you stay motivated?",
          date: "Yesterday",
        },
      ],
      isLiked: true,
      shared: true,
    },
    {
      id: "3",
      user: {
        name: "Emma Wilson",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
      },
      date: "2 days ago",
      distance: 3.1,
      duration: "24:45",
      pace: "7:59",
      location: "City Loop",
      likes: 18,
      comments: [],
      isLiked: false,
      shared: false,
    },
  ]);

  // Mock data for challenges
  const [challenges, setChallenges] = useState<ChallengeItem[]>([
    {
      id: "1",
      title: "Summer 100 Mile Challenge",
      description: "Run 100 miles during the month of July",
      participants: 1243,
      endDate: "July 31, 2023",
      isJoined: true,
    },
    {
      id: "2",
      title: "Weekend Warrior",
      description: "Complete 3 runs every weekend this month",
      participants: 856,
      endDate: "July 31, 2023",
      isJoined: false,
    },
    {
      id: "3",
      title: "Hill Climber",
      description: "Accumulate 5000ft of elevation gain",
      participants: 432,
      endDate: "August 15, 2023",
      isJoined: false,
    },
  ]);

  // Toggle like on a post
  const toggleLike = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      }),
    );
  };

  // Add a comment to a post
  const addComment = (postId: string) => {
    if (!commentText.trim()) return;

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              {
                id: `c${Date.now()}`,
                user: {
                  name: "Jane Runner", // Current user
                  avatar:
                    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
                },
                text: commentText,
                date: "Just now",
              },
            ],
          };
        }
        return post;
      }),
    );

    setCommentText("");
  };

  // Toggle friend status
  const toggleFriend = (runnerId: string) => {
    setNearbyRunners(
      nearbyRunners.map((runner) => {
        if (runner.id === runnerId) {
          return {
            ...runner,
            isFriend: !runner.isFriend,
          };
        }
        return runner;
      }),
    );
  };

  // Toggle follow status
  const toggleFollow = (runnerId: string) => {
    setNearbyRunners(
      nearbyRunners.map((runner) => {
        if (runner.id === runnerId) {
          return {
            ...runner,
            isFollowing: !runner.isFollowing,
          };
        }
        return runner;
      }),
    );
  };

  // Toggle join on a challenge
  const toggleJoinChallenge = (challengeId: string) => {
    setChallenges(
      challenges.map((challenge) => {
        if (challenge.id === challengeId) {
          return {
            ...challenge,
            isJoined: !challenge.isJoined,
            participants: challenge.isJoined
              ? challenge.participants - 1
              : challenge.participants + 1,
          };
        }
        return challenge;
      }),
    );
  };

  // Share a new run
  const shareRun = () => {
    // Calculate pace based on distance and duration
    const durationParts = newRunData.duration.split(":");
    let totalMinutes = 0;

    if (durationParts.length === 2) {
      totalMinutes =
        parseInt(durationParts[0]) + parseInt(durationParts[1]) / 60;
    } else if (durationParts.length === 3) {
      totalMinutes =
        parseInt(durationParts[0]) * 60 +
        parseInt(durationParts[1]) +
        parseInt(durationParts[2]) / 60;
    }

    const paceMinutes = Math.floor(totalMinutes / newRunData.distance);
    const paceSeconds = Math.floor(
      (totalMinutes / newRunData.distance - paceMinutes) * 60,
    );
    const paceFormatted = `${paceMinutes}:${paceSeconds.toString().padStart(2, "0")}`;

    // Create new post
    const newPost: RunPost = {
      id: `post-${Date.now()}`,
      user: {
        name: "Jane Runner", // Current user
        avatar:
          "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
      },
      date: "Just now",
      distance: newRunData.distance,
      duration: newRunData.duration,
      pace: paceFormatted,
      location: newRunData.location,
      likes: 0,
      comments: [],
      isLiked: false,
      shared: true,
    };

    // Add to posts
    setPosts([newPost, ...posts]);

    // Reset form and close modal
    setNewRunData({
      distance: 0,
      duration: "",
      location: "",
    });
    setShowShareRunModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold ml-2">Community</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => {}}>
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {}}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-4 pb-0">
        <Tabs
          defaultValue="feed"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feed">
              <MessageSquare className="h-4 w-4 mr-2" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="challenges">
              <Award className="h-4 w-4 mr-2" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="runners">
              <Users className="h-4 w-4 mr-2" />
              Runners
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="mt-4 space-y-4">
            {/* Feed Content */}
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Post Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={post.user.avatar} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-sm">
                          {post.user.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {post.date}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Run Stats */}
                  <div className="px-4 pb-3 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-muted/50 rounded-md p-2">
                      <p className="text-xs text-muted-foreground">Distance</p>
                      <p className="font-bold">
                        {post.distance} {unit}
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-md p-2">
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="font-bold">{post.duration}</p>
                    </div>
                    <div className="bg-muted/50 rounded-md p-2">
                      <p className="text-xs text-muted-foreground">Pace</p>
                      <p className="font-bold">
                        {post.pace} /{unit}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="px-4 pb-4">
                    <Badge variant="outline" className="text-xs">
                      {post.location}
                    </Badge>
                  </div>

                  <Separator />

                  {/* Actions */}
                  <div className="p-2 flex justify-around">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex items-center gap-1 ${post.isLiked ? "text-primary" : ""}`}
                      onClick={() => toggleLike(post.id)}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() =>
                        setShowComments(
                          showComments === post.id ? null : post.id,
                        )
                      }
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments.length}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex items-center gap-1 ${post.shared ? "text-primary" : ""}`}
                      onClick={() => {
                        setPosts(
                          posts.map((p) => {
                            if (p.id === post.id) {
                              return { ...p, shared: !p.shared };
                            }
                            return p;
                          }),
                        );
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                      <span>{post.shared ? "Shared" : "Share"}</span>
                    </Button>
                  </div>

                  {/* Comments Section */}
                  {showComments === post.id && (
                    <div className="px-4 pb-3">
                      <Separator className="mb-3" />
                      <h4 className="text-sm font-medium mb-2">Comments</h4>

                      {post.comments.length > 0 ? (
                        <div className="space-y-3 mb-3">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={comment.user.avatar} />
                                <AvatarFallback>
                                  <User className="h-3 w-3" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-muted/50 rounded-lg p-2">
                                  <p className="text-xs font-medium">
                                    {comment.user.name}
                                  </p>
                                  <p className="text-xs">{comment.text}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {comment.date}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground mb-3">
                          No comments yet
                        </p>
                      )}

                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a comment..."
                          className="text-xs"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              addComment(post.id);
                            }
                          }}
                        />
                        <Button size="sm" onClick={() => addComment(post.id)}>
                          Post
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="challenges" className="mt-4 space-y-4">
            {/* Challenges Content */}
            {challenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{challenge.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-2">
                    {challenge.description}
                  </p>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{challenge.participants} participants</span>
                    </div>
                    <Badge variant="outline">{challenge.endDate}</Badge>
                  </div>
                  <Button
                    variant={challenge.isJoined ? "default" : "outline"}
                    className="w-full"
                    onClick={() => toggleJoinChallenge(challenge.id)}
                  >
                    {challenge.isJoined ? "Leave Challenge" : "Join Challenge"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="runners" className="mt-4 space-y-4">
            {/* Find Runners Content */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Find runners near you..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Map Placeholder */}
            <Card className="mb-4 overflow-hidden">
              <div className="bg-muted h-40 flex items-center justify-center">
                <p className="text-muted-foreground">Map of nearby runners</p>
              </div>
            </Card>

            {/* Nearby Runners List */}
            <h3 className="font-medium text-sm mb-2">Runners Near You</h3>
            {nearbyRunners.map((runner) => (
              <Card key={runner.id} className="mb-3">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={runner.avatar} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-sm">{runner.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {runner.distance}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={runner.isFriend ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleFriend(runner.id)}
                      >
                        {runner.isFriend ? "Friends" : "Add Friend"}
                      </Button>
                      <Button
                        variant={runner.isFollowing ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => toggleFollow(runner.id)}
                      >
                        {runner.isFollowing ? "Following" : "Follow"}
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="bg-muted/50 rounded-md p-2 text-center">
                      <p className="text-xs text-muted-foreground">Avg. Pace</p>
                      <p className="font-bold text-sm">{runner.pace}</p>
                    </div>
                    <div className="bg-muted/50 rounded-md p-2 text-center">
                      <p className="text-xs text-muted-foreground">
                        Total Runs
                      </p>
                      <p className="font-bold text-sm">{runner.totalRuns}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Share Run Dialog */}
      <Dialog open={showShareRunModal} onOpenChange={setShowShareRunModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Run</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              <div className="grid flex-1 gap-2">
                <label className="text-sm font-medium">Distance ({unit})</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="5.0"
                  value={newRunData.distance || ""}
                  onChange={(e) =>
                    setNewRunData({
                      ...newRunData,
                      distance: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <div className="grid flex-1 gap-2">
                <label className="text-sm font-medium">
                  Duration (hh:mm:ss or mm:ss)
                </label>
                <Input
                  placeholder="30:00"
                  value={newRunData.duration}
                  onChange={(e) =>
                    setNewRunData({ ...newRunData, duration: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div className="grid flex-1 gap-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  placeholder="Central Park"
                  value={newRunData.location}
                  onChange={(e) =>
                    setNewRunData({ ...newRunData, location: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowShareRunModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={shareRun}
              disabled={
                !newRunData.distance ||
                !newRunData.duration ||
                !newRunData.location
              }
            >
              Share Run
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-20 right-4 rounded-full h-12 w-12 shadow-lg"
        onClick={() => setShowShareRunModal(true)}
      >
        <Plus className="h-5 w-5" />
      </Button>

      {/* Bottom Navigation */}
      <div className="mt-auto sticky bottom-0 bg-background border-t p-2">
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="ghost"
            className="flex flex-col items-center py-2"
            onClick={() => navigate("/")}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center py-2 text-primary"
          >
            <Users className="h-5 w-5" />
            <span className="text-xs mt-1">Community</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center py-2"
            onClick={() => navigate("/profile")}
          >
            <Award className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunityScreen;

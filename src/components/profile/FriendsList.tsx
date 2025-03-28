import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { User, Search, UserPlus, UserMinus, MessageCircle } from "lucide-react";

interface Friend {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "offline" | "running";
  lastActive?: string;
  mutualFriends: number;
  isFriend: boolean;
}

interface FriendsListProps {
  unit?: "km" | "mi";
}

const FriendsList: React.FC<FriendsListProps> = ({ unit = "mi" }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: "f1",
      name: "Alex Rivera",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
      status: "online",
      mutualFriends: 5,
      isFriend: true,
    },
    {
      id: "f2",
      name: "Jordan Taylor",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      status: "running",
      lastActive: "Running 2.5 mi away",
      mutualFriends: 3,
      isFriend: true,
    },
    {
      id: "f3",
      name: "Casey Morgan",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
      status: "offline",
      lastActive: "Last active 2 hours ago",
      mutualFriends: 2,
      isFriend: true,
    },
    {
      id: "f4",
      name: "Sarah Johnson",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
      status: "online",
      mutualFriends: 8,
      isFriend: true,
    },
    {
      id: "f5",
      name: "Mike Chen",
      avatar:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80",
      status: "offline",
      lastActive: "Last active yesterday",
      mutualFriends: 1,
      isFriend: true,
    },
  ]);

  const [suggestions, setSuggestions] = useState<Friend[]>([
    {
      id: "s1",
      name: "Emma Wilson",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
      status: "online",
      mutualFriends: 4,
      isFriend: false,
    },
    {
      id: "s2",
      name: "David Park",
      avatar:
        "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80",
      status: "offline",
      lastActive: "Last active 3 days ago",
      mutualFriends: 2,
      isFriend: false,
    },
  ]);

  const toggleFriendStatus = (id: string, currentStatus: boolean) => {
    if (currentStatus) {
      // Remove from friends, add to suggestions
      const friendToRemove = friends.find((friend) => friend.id === id);
      if (friendToRemove) {
        setFriends(friends.filter((friend) => friend.id !== id));
        setSuggestions([
          ...suggestions,
          { ...friendToRemove, isFriend: false },
        ]);
      }
    } else {
      // Remove from suggestions, add to friends
      const suggestionToAdd = suggestions.find((sugg) => sugg.id === id);
      if (suggestionToAdd) {
        setSuggestions(suggestions.filter((sugg) => sugg.id !== id));
        setFriends([...friends, { ...suggestionToAdd, isFriend: true }]);
      }
    }
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusColor = (status: "online" | "offline" | "running") => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "running":
        return "bg-blue-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search friends..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Friends List */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Your Friends ({friends.length})</h3>
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <Card key={friend.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={friend.avatar} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(
                          friend.status,
                        )}`}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{friend.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {friend.status === "online"
                          ? "Online"
                          : friend.lastActive}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFriendStatus(friend.id, true)}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    {friend.mutualFriends} mutual friends
                  </Badge>
                  {friend.status === "running" && (
                    <Badge className="ml-2 text-xs bg-blue-500">
                      Currently Running
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No friends match your search.
          </p>
        )}
      </div>

      {/* Suggestions */}
      {filteredSuggestions.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Suggested Friends</h3>
            {filteredSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={suggestion.avatar} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-sm">
                          {suggestion.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {suggestion.mutualFriends} mutual friends
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => toggleFriendStatus(suggestion.id, false)}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Add Friend
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FriendsList;

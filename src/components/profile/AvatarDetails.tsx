import React from "react";

interface AvatarDetailsProps {
  name?: string;
  joinDate?: string;
  avatarUrl?: string;
}

const AvatarDetails: React.FC<AvatarDetailsProps> = ({
  name = "John Doe",
  joinDate = "4 years",
  avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative my-4">
        <div className="absolute -inset-2">
          <div className="w-28 h-full max-w-sm mx-auto lg:mx-0 opacity-70 blur-lg bg-gradient-to-r from-yellow-400 via-pink-500 to-green-600"></div>
        </div>
        <img
          src={avatarUrl}
          className="relative object-cover shrink-0 h-28 w-28 z-10 rounded-xl"
          alt={name}
        />
      </div>

      <p className="text-2xl font-bold">{name}</p>

      <div className="text-gray-400">Member since {joinDate}</div>
    </div>
  );
};

export default AvatarDetails;

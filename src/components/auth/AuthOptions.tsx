import React from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Mail, Facebook, UserRound } from "lucide-react";

interface AuthOptionsProps {
  onSelectMethod: (method: "email" | "facebook" | "google" | "guest") => void;
}

const AuthOptions = ({ onSelectMethod = () => {} }: AuthOptionsProps) => {
  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
        <CardDescription>
          Choose your preferred authentication method
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 h-12"
          onClick={() => onSelectMethod("email")}
        >
          <Mail className="h-5 w-5" />
          <span>Continue with Email</span>
        </Button>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 h-12 bg-[#1877F2] text-white hover:bg-[#166FE5]"
          onClick={() => onSelectMethod("facebook")}
        >
          <Facebook className="h-5 w-5" />
          <span>Continue with Facebook</span>
        </Button>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 h-12 bg-white border-gray-300 hover:bg-gray-50"
          onClick={() => onSelectMethod("google")}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-gray-900">Continue with Google</span>
        </Button>

        <div className="flex items-center my-4">
          <Separator className="flex-grow" />
          <span className="px-3 text-sm text-gray-500">or</span>
          <Separator className="flex-grow" />
        </div>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 h-12 bg-gray-100 text-gray-700 hover:bg-gray-200"
          onClick={() => onSelectMethod("guest")}
        >
          <UserRound className="h-5 w-5" />
          <span>Continue as Guest</span>
        </Button>

        <p className="text-center text-sm text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardContent>
    </Card>
  );
};

export default AuthOptions;

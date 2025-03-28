import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import AuthOptions from "./AuthOptions";
import EmailAuth from "./EmailAuth";
import { motion, AnimatePresence } from "framer-motion";

interface AuthScreenProps {
  onAuthenticated?: (isGuest?: boolean) => void;
  isConvertingFromGuest?: boolean;
  guestRunData?: any;
}

type AuthMethod = "options" | "email" | "facebook" | "google" | "guest";

const AuthScreen = ({
  onAuthenticated = () => {},
  isConvertingFromGuest = false,
  guestRunData = null,
}: AuthScreenProps) => {
  const [currentView, setCurrentView] = useState<AuthMethod>("options");

  const handleSelectMethod = (
    method: "email" | "facebook" | "google" | "guest",
  ) => {
    setCurrentView(method);

    // For demo purposes, simulate authentication for social logins
    if (method === "facebook" || method === "google") {
      // In a real app, this would trigger the OAuth flow
      setTimeout(() => {
        onAuthenticated(false);
      }, 1000);
    } else if (method === "guest") {
      // Handle guest login
      setTimeout(() => {
        onAuthenticated(true);
      }, 500);
    }
  };

  const handleEmailSubmit = (values: any, isLogin: boolean) => {
    // In a real app, this would validate credentials with a backend
    console.log("Email auth:", values, isLogin ? "login" : "signup");
    // If converting from guest, we would transfer the guest data to the new account
    if (isConvertingFromGuest && guestRunData) {
      console.log("Converting guest account with data:", guestRunData);
      // In a real app, this would associate the guest data with the new account
    }
    onAuthenticated(false);
  };

  const handleBack = () => {
    setCurrentView("options");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">
            Cool Runnings Fitness
          </h1>
          <p className="text-blue-600 mt-2">Track, Share, Connect</p>
          {isConvertingFromGuest && (
            <p className="text-sm bg-green-100 text-green-800 p-2 mt-2 rounded-md">
              Create an account to save your run history and access all
              features!
            </p>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentView === "options" && (
              <AuthOptions onSelectMethod={handleSelectMethod} />
            )}

            {currentView === "email" && (
              <EmailAuth
                onSubmit={handleEmailSubmit}
                onBack={handleBack}
                isConvertingFromGuest={isConvertingFromGuest}
              />
            )}

            {(currentView === "facebook" || currentView === "google") && (
              <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <div className="w-16 h-16 rounded-full border-4 border-t-blue-500 border-r-blue-500 border-b-blue-500 border-l-transparent animate-spin mb-4"></div>
                  <p className="text-lg font-medium text-center">
                    Connecting to{" "}
                    {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
                    ...
                  </p>
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    You'll be redirected automatically
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthScreen;

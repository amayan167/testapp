import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import React from "react";
import routes from "tempo-routes";

// Lazy load components for better performance
const RunTrackingScreen = lazy(
  () => import("./components/run/RunTrackingScreen"),
);
const RunSummary = lazy(() => import("./components/run/RunSummary"));
const ProfileScreen = lazy(() => import("./components/profile/ProfileScreen"));
const SettingsScreen = lazy(
  () => import("./components/settings/SettingsScreen"),
);
const CommunityScreen = lazy(() => import("./components/community"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg">Loading...</p>
        </div>
      }
    >
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/run" element={<RunTrackingScreen />} />
          <Route path="/run-summary" element={<RunSummary />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/community" element={<CommunityScreen />} />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;

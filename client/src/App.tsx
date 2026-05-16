import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "@/pages/Landing";
import MobileLanding from "@/pages/MobileLanding";
import ScreenPage from "@/pages/screen/ScreenPage";
import JoinPage from "@/pages/controller/JoinPage";
import ControllerPage from "@/pages/controller/ControllerPage";
import LeaderboardPage from "@/pages/Leaderboard";
import { useIsMobileViewport } from "@/lib/useIsMobileViewport";

// Host-only routes (need a real browser big enough to run the Unity build).
// The controller routes are deliberately NOT wrapped — phones must reach them.
function HostOnly({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobileViewport();
  return isMobile ? <MobileLanding /> : <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<HostOnly><Landing /></HostOnly>} />

        {/* Host screen — TV / laptop */}
        <Route path="/screen" element={<HostOnly><ScreenPage /></HostOnly>} />

        {/* Phone controller */}
        <Route path="/controller" element={<JoinPage />} />
        <Route path="/controller/:roomCode" element={<ControllerPage />} />

        {/* Leaderboard page */}
        <Route path="/leaderboard" element={<LeaderboardPage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

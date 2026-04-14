import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "@/pages/Landing";
import ScreenPage from "@/pages/screen/ScreenPage";
import JoinPage from "@/pages/controller/JoinPage";
import ControllerPage from "@/pages/controller/ControllerPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<Landing />} />

        {/* Host screen — TV / laptop */}
        <Route path="/screen" element={<ScreenPage />} />

        {/* Phone controller */}
        <Route path="/controller" element={<JoinPage />} />
        <Route path="/controller/:roomCode" element={<ControllerPage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
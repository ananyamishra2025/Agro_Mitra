import { useEffect, useMemo, useState } from "react";

import MainLayout from "../components/layout/MainLayout";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import AdvisoryPage from "../pages/AdvisoryPage";
import ChatbotPage from "../pages/ChatbotPage";
import VoicePage from "../pages/VoicePage";
import ImageUploadPage from "../pages/ImageUploadPage";
import HistoryPage from "../pages/HistoryPage";
import LearningPage from "../pages/LearningPage";
import GardeningPage from "../pages/GardeningPage";

const routeMap = {
  "/": Home,
  "/dashboard": Dashboard,
  "/advisory": AdvisoryPage,
  "/chat": ChatbotPage,
  "/voice": VoicePage,
  "/upload": ImageUploadPage,
  "/history": HistoryPage,
  "/learning": LearningPage,
  "/gardening": GardeningPage,
};

      const AppRoutes = () => {
  const [path, setPath] = useState(window.location.pathname || "/");

      useEffect(() => {
    const handleRouteChange = () => setPath(window.location.pathname || "/");
    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

      const Page = useMemo(() => routeMap[path] || Home, [path]);

      return (
    <MainLayout currentPath={path}>
      <Page />
    </MainLayout>
  );
};

export default AppRoutes;

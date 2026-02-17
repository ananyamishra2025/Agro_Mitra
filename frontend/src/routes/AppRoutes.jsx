import { Routes, Route } from "react-router-dom";

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

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />

      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />

      <Route
        path="/advisory"
        element={
          <MainLayout>
            <AdvisoryPage />
          </MainLayout>
        }
      />

      <Route
        path="/chat"
        element={
          <MainLayout>
            <ChatbotPage />
          </MainLayout>
        }
      />

      <Route
        path="/voice"
        element={
          <MainLayout>
            <VoicePage />
          </MainLayout>
        }
      />

      <Route
        path="/upload"
        element={
          <MainLayout>
            <ImageUploadPage />
          </MainLayout>
        }
      />

      <Route
        path="/history"
        element={
          <MainLayout>
            <HistoryPage />
          </MainLayout>
        }
      />

      <Route
        path="/learning"
        element={
          <MainLayout>
            <LearningPage />
          </MainLayout>
        }
      />

      <Route
        path="/gardening"
        element={
          <MainLayout>
            <GardeningPage />
          </MainLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;

import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import AdvisoryPage from "../pages/AdvisoryPage";
import ChatbotPage from "../pages/ChatbotPage";
import VoicePage from "../pages/VoicePage";
import ImageUploadPage from "../pages/ImageUploadPage";
import LearningPage from "../pages/LearningPage";
import GardeningPage from "../pages/GardeningPage";
import HistoryPage from "../pages/HistoryPage";
import ContactPage from "../pages/ContactPage";
import AccountPage from "../pages/AccountPage";
import FutureScopePage from "../pages/FutureScopePage";
import SettingsPage from "../pages/SettingsPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
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

        <Route
          path="/history"
          element={
            <MainLayout>
              <HistoryPage />
            </MainLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <MainLayout>
              <ContactPage />
            </MainLayout>
          }
        />

        <Route
          path="/account"
          element={<AccountPage />}
        />

        <Route
          path="/future"
          element={
            <MainLayout>
              <FutureScopePage />
            </MainLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <MainLayout>
              <SettingsPage />
            </MainLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

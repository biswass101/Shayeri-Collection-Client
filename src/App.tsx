import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import HomePage from "@/components/home/HomePage";
import VideoRoutePage from "@/components/home/VideoRoutePage";
import { UIProvider } from "@/components/layout/UIContext";
import { ToastProvider } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import ShortsPage from "@/components/pages/ShortsPage";
import HistoryPage from "@/components/pages/HistoryPage";
import LikedVideosPage from "@/components/pages/LikedVideosPage";
import DownloadsPage from "@/components/pages/DownloadsPage";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AdminRoute from "@/components/layout/AdminRoute";
import AdminShell from "@/components/admin/AdminShell";
import AdminDashboardPage from "@/components/admin/AdminDashboardPage";
import AdminVideosPage from "@/components/admin/AdminVideosPage";
import AdminCategoriesPage from "@/components/admin/AdminCategoriesPage";

export default function App() {
  return (
    <UIProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/shorts" element={<ShortsPage />} />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <HistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/liked"
                element={
                  <ProtectedRoute>
                    <LikedVideosPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/downloads"
                element={
                  <ProtectedRoute>
                    <DownloadsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/watch/:videoId" element={<VideoRoutePage />} />
            </Route>
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminShell />
                </AdminRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="videos" element={<AdminVideosPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster />
      </ToastProvider>
    </UIProvider>
  );
}

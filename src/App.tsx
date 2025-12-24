import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { PerformanceProvider } from "@/hooks/usePerformance";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Eager load critical pages
import { SplashScreen } from "./pages/SplashScreen";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";

// Lazy load non-critical pages
const LogProcrastination = lazy(() => import("./pages/LogProcrastination").then(m => ({ default: m.LogProcrastination })));
const ChainViewer = lazy(() => import("./pages/ChainViewer").then(m => ({ default: m.ChainViewer })));
const Analytics = lazy(() => import("./pages/Analytics").then(m => ({ default: m.Analytics })));
const Settings = lazy(() => import("./pages/Settings").then(m => ({ default: m.Settings })));
const Achievements = lazy(() => import("./pages/Achievements").then(m => ({ default: m.Achievements })));
const Profile = lazy(() => import("./pages/Profile").then(m => ({ default: m.Profile })));
const Certificate = lazy(() => import("./pages/Certificate").then(m => ({ default: m.Certificate })));
const ExcuseGenerator = lazy(() => import("./pages/ExcuseGenerator").then(m => ({ default: m.ExcuseGenerator })));
const About = lazy(() => import("./pages/About").then(m => ({ default: m.About })));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - longer stale time for cached data
      gcTime: 30 * 60 * 1000, // 30 minutes cache retention
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Don't refetch when component mounts (back navigation)
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center animated-gradient">
    <Loader2 className="w-8 h-8 text-primary animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <PerformanceProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<SplashScreen />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/log" element={
                  <Suspense fallback={<PageLoader />}>
                    <LogProcrastination />
                  </Suspense>
                } />
                <Route path="/chain" element={
                  <Suspense fallback={<PageLoader />}>
                    <ChainViewer />
                  </Suspense>
                } />
                <Route path="/analytics" element={
                  <Suspense fallback={<PageLoader />}>
                    <Analytics />
                  </Suspense>
                } />
                <Route path="/settings" element={
                  <Suspense fallback={<PageLoader />}>
                    <Settings />
                  </Suspense>
                } />
                <Route path="/achievements" element={
                  <Suspense fallback={<PageLoader />}>
                    <Achievements />
                  </Suspense>
                } />
                <Route path="/profile" element={
                  <Suspense fallback={<PageLoader />}>
                    <Profile />
                  </Suspense>
                } />
                <Route path="/certificate" element={
                  <Suspense fallback={<PageLoader />}>
                    <Certificate />
                  </Suspense>
                } />
                <Route path="/excuses" element={
                  <Suspense fallback={<PageLoader />}>
                    <ExcuseGenerator />
                  </Suspense>
                } />
                <Route path="/about" element={
                  <Suspense fallback={<PageLoader />}>
                    <About />
                  </Suspense>
                } />
                <Route path="*" element={
                  <Suspense fallback={<PageLoader />}>
                    <NotFound />
                  </Suspense>
                } />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </PerformanceProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

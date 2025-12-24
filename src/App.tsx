import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { SplashScreen } from "./pages/SplashScreen";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { LogProcrastination } from "./pages/LogProcrastination";
import { ChainViewer } from "./pages/ChainViewer";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";
import { Achievements } from "./pages/Achievements";
import { Profile } from "./pages/Profile";
import { Certificate } from "./pages/Certificate";
import { ExcuseGenerator } from "./pages/ExcuseGenerator";
import { About } from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/log" element={<LogProcrastination />} />
              <Route path="/chain" element={<ChainViewer />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/certificate" element={<Certificate />} />
              <Route path="/excuses" element={<ExcuseGenerator />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import RoboticArmControl from "./pages/RoboticArmControl";
import DigitalTesting from "./pages/DigitalTesting";
import EngineAssembly from "./pages/EngineAssembly";
import DronesAircraft from "./pages/DronesAircraft";
import Inventory from "./pages/Inventory";
import AlertsLogs from "./pages/AlertsLogs";
import AIInsights from "./pages/AIInsights";
import SystemConfigurations from "./pages/SystemConfigurations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="robotic-arm-control" element={<RoboticArmControl />} />
              <Route path="digital-testing" element={<DigitalTesting />} />
              <Route path="engine-assembly" element={<EngineAssembly />} />
              <Route path="drones-aircraft" element={<DronesAircraft />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="alerts-logs" element={<AlertsLogs />} />
              <Route path="ai-insights" element={<AIInsights />} />
              <Route path="system-configurations" element={<SystemConfigurations />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

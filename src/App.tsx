import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import UploadImages from "./pages/UploadImages";
import Upload3DModels from "./pages/Upload3DModels";
import UploadReports from "./pages/UploadReports";
import Projects from "./pages/Projects";
import News from "./pages/News";
import AdminManagement from "./pages/AdminManagement";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import LoginForm from "./pages/LoginForm";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/images" element={<UploadImages />} />
          <Route path="/models" element={<Upload3DModels />} />
          <Route path="/reports" element={<UploadReports />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/news" element={<News />} />
          <Route path="/admins" element={<AdminManagement />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/auth/login" element={<LoginForm />}></Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

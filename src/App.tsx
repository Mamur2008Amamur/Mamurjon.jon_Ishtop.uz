import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
<<<<<<< HEAD
import { Suspense } from "react";
=======
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Yordam from "./pages/Yordam.tsx";
import Aloqa from "./pages/Aloqa.tsx";
import Admin from "./pages/Admin.tsx";
import Auth from "./pages/Auth.tsx";
import Profil from "./pages/Profil.tsx";
import Chat from "./pages/Chat.tsx";
import NotFound from "./pages/NotFound.tsx";
<<<<<<< HEAD
import ActivityTracker from "./components/ActivityTracker";

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
    </div>
  </div>
);

=======

const queryClient = new QueryClient();

>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
<<<<<<< HEAD
        <ActivityTracker />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/yordam" element={<Yordam />} />
            <Route path="/aloqa" element={<Aloqa />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
=======
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/yordam" element={<Yordam />} />
          <Route path="/aloqa" element={<Aloqa />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Toaster } from "@/components/ui/sonner";

import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminProjects from "./pages/admin/Projects";
import Projects from "./pages/Projects";
import Services from "./pages/Services"; // Yeni eklenen Hizmetler sayfası
import ProjectDetail from "./pages/ProjectDetail";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import ThreeDViewer from "./pages/ThreeDViewer"; // Yeni sayfa eklendi
import Settings from "./pages/admin/Settings";
import Messages from "./pages/admin/Messages";
import ProjectEdit from "./pages/admin/ProjectEdit";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/services" element={<Services />} /> {/* Hizmetler sayfası rotası */}
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/3d-viewer" element={<ThreeDViewer />} /> 
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/projects" element={<AdminProjects />} />
        <Route path="/admin/projects/new" element={<ProjectEdit />} />
        <Route path="/admin/projects/:id/edit" element={<ProjectEdit />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/messages" element={<Messages />} />

        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Registration from "./pages/Registration";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ContactUs from "./pages/ContactUs";
import CulturalEvents from "./pages/CulturalEvents";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center flex flex-col items-center justify-between h-full py-16 md:py-24 w-full"
            >
              <div className="flex-1 flex items-center justify-center">
                {/* Replace the src below with your actual splash logo PNG path (e.g., "/splash-logo.png") */}
                <img 
                  src="poster.jpeg" 
                  alt="Splash Poster" 
                  className="w-[240px] h-[320px] md:w-[360px] md:h-[480px] object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="mt-auto">
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-widest text-glow text-mech-accent mb-4">
                  Mechverse
                </h1>
                <div className="w-64 h-1 bg-mech-border mx-auto overflow-hidden relative">
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-0 bg-mech-accent"
                  />
                </div>
                <p className="mt-4 text-mech-muted tracking-widest text-sm uppercase">
                  Initializing System...
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="technical" element={<Events />} />
            <Route path="non-technical" element={<Events />} />
            <Route path="register" element={<Registration />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="cultural" element={<CulturalEvents />} />
            <Route path="admin" element={<AdminLogin />} />
            <Route path="admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

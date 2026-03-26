/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
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
  const [showSplash, setShowSplash] = useState(() => window.location.pathname === "/");
  const [showRegisterSplash, setShowRegisterSplash] = useState(false);

  useEffect(() => {
    if (window.location.pathname !== "/") return;

    const splashTimer = setTimeout(() => {
      setShowSplash(false);
      setShowRegisterSplash(true);
    }, 5000);

    const registerTimer = setTimeout(() => {
      setShowRegisterSplash(false);
    }, 15000);

    return () => {
      clearTimeout(splashTimer);
      clearTimeout(registerTimer);
    };
  }, []);

  return (
    <BrowserRouter>
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

        {showRegisterSplash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center flex flex-col items-center justify-center min-h-[100dvh] py-4 md:py-8 w-full max-w-6xl mx-auto px-2 sm:px-4 relative"
            >
              <div className="absolute inset-0 bg-mech-accent blur-[150px] opacity-10 rounded-full" />
              
              <div className="relative z-10 w-full mb-3 md:mb-4 flex flex-col gap-3 md:gap-4 items-center mt-2 md:mt-4">
                {/* Team Image */}
                <img 
                  src="/team.jpeg" 
                  alt="Mechverse 26 Team" 
                  onError={(e) => (e.currentTarget.style.display = "none")}
                  className="w-full max-w-3xl max-h-[150px] sm:max-h-[200px] md:max-h-[300px] object-contain rounded-xl border border-mech-accent/30 shadow-[0_0_15px_rgba(255,51,102,0.2)]" 
                />
                
                {/* Coordinators */}
                <div className="w-full max-w-xl flex flex-row justify-center gap-3 md:gap-8 mt-1 md:mt-2 px-2 md:px-4">
                  <div className="flex-1 max-w-[100px] sm:max-w-[140px] flex flex-col items-center justify-center bg-black/40 p-1.5 md:p-2 rounded-xl border border-mech-accent/20 backdrop-blur-sm">
                    <img 
                      src="/rishiraj.png" 
                      alt="Rishiraj R" 
                      onError={(e) => (e.currentTarget.style.display = "none")}
                      className="w-full aspect-square object-cover rounded-lg border border-mech-accent/30 shadow-[0_0_10px_rgba(255,51,102,0.15)] mb-1.5 md:mb-2" 
                    />
                    <p className="text-mech-text font-mono text-[8px] md:text-xs font-bold uppercase tracking-wider text-center text-glow">Rishiraj R</p>
                  </div>
                  
                  <div className="flex-1 max-w-[100px] sm:max-w-[140px] flex flex-col items-center justify-center bg-black/40 p-1.5 md:p-2 rounded-xl border border-mech-accent/20 backdrop-blur-sm">
                    <img 
                      src="/madhav.png" 
                      alt="Madhav Jayaprakash" 
                      onError={(e) => (e.currentTarget.style.display = "none")}
                      className="w-full aspect-square object-cover rounded-lg border border-mech-accent/30 shadow-[0_0_10px_rgba(255,51,102,0.15)] mb-1.5 md:mb-2" 
                    />
                    <p className="text-mech-text font-mono text-[8px] md:text-xs font-bold uppercase tracking-wider text-center text-glow">Madhav Jayaprakash</p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 bg-black/60 p-3 md:p-6 rounded-2xl border border-mech-accent/20 backdrop-blur-md w-full max-w-3xl shadow-xl mt-1 mb-4 md:mb-6">
                <h1 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-glow text-mech-text mb-2 md:mb-6 leading-tight group">
                  Thank you for making <br className="hidden sm:block"/><span className="text-mech-accent group-hover:text-white transition-colors duration-500">Mechverse 26</span> a success!!! &lt;3
                </h1>
                
                <div className="w-24 md:w-48 h-1 bg-mech-border mx-auto overflow-hidden relative mb-2 md:mb-6">
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute inset-0 bg-mech-accent"
                  />
                </div>
                
                <p className="text-xs sm:text-sm md:text-2xl font-mono text-mech-accent font-bold tracking-widest uppercase mb-1 md:mb-4 text-glow">
                  - Mechverse 26 Team
                </p>
                
                <p className="text-[10px] sm:text-[11px] md:text-base font-mono text-mech-muted opacity-90 mt-1 md:mt-4 leading-tight md:leading-relaxed tracking-wide">
                  Special thanks to the main coordinators<br/>
                  <span className="text-mech-text font-bold text-glow px-1 md:px-2">Rishiraj R</span> 
                  <span className="opacity-50 text-[8px] sm:text-[10px] md:text-xs">and</span>
                  <span className="text-mech-text font-bold text-glow px-1 md:px-2">Madhav Jayaprakash</span>
                </p>
                
                <p className="text-[8px] sm:text-[9px] md:text-[11px] font-mono text-mech-accent/60 mt-3 md:mt-6 tracking-tight italic">
                  Also the web admins Amal S Kumar and Aswin P (evidelum pere varatee)
                </p>
              </div>

              <button 
                onClick={() => setShowRegisterSplash(false)} 
                className="relative z-10 flex items-center justify-center space-x-2 font-mono text-mech-text hover:text-white transition-all duration-300 border border-mech-accent/30 hover:bg-mech-accent/20 px-6 sm:px-8 py-2 md:py-3 rounded-full uppercase tracking-widest text-[10px] md:text-sm hover:shadow-[0_0_15px_rgba(255,51,102,0.4)] hover:scale-105"
              >
                <span>Continue</span>
                <svg className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
  );
}

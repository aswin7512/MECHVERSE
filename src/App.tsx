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
  const [showSplash, setShowSplash] = useState(true);
  const [showRegisterSplash, setShowRegisterSplash] = useState(false);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
      setShowRegisterSplash(true);
    }, 5000);

    const registerTimer = setTimeout(() => {
      setShowRegisterSplash(false);
    }, 10000);

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
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center flex flex-col items-center justify-between h-full py-16 md:py-24 w-full"
            >
              <div className="flex-1 flex items-center justify-center w-full px-4">
                <Link to="/register" onClick={() => setShowRegisterSplash(false)} className="group flex flex-col items-center justify-center w-full relative">
                  <div className="absolute inset-0 bg-mech-accent blur-[100px] opacity-20 rounded-full transition-opacity duration-500 group-hover:opacity-40" />
                  <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-glow relative z-10 text-mech-text transition-colors duration-500 mb-6 max-w-4xl leading-tight text-center">
                    Register Now
                  </h1>
                  <p className="mt-2 text-lg md:text-2xl font-mono text-mech-muted tracking-widest uppercase mb-8 text-center px-4 relative z-10">
                    Secure your spot in the ultimate showdown.
                  </p>
                  <div className="inline-flex items-center justify-center space-x-3 bg-mech-accent border border-mech-accent/30 px-8 py-4 rounded-full group-hover:bg-mech-accent/80 transition-colors relative z-10">
                    <span className="font-mono font-bold text-black tracking-widest uppercase text-xl">
                      Join Now
                    </span>
                  </div>
                </Link>
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
                  Loading Experience...
                </p>
              </div>
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

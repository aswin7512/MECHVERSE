import { Link, Outlet, useLocation } from "react-router-dom";
import { Wrench, Settings, Cpu, FileText, UserCircle } from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "motion/react";

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { name: "HQ", path: "/", icon: Wrench },
    { name: "Tech Events", path: "/technical", icon: Cpu },
    { name: "Non-Tech Events", path: "/non-technical", icon: Settings },
    { name: "Register", path: "/register", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-mech-bg text-mech-text bg-grid flex flex-col">
      <header className="border-b border-mech-border bg-mech-panel/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <Settings className="w-8 h-8 text-mech-accent group-hover:rotate-180 transition-transform duration-700" />
              <span className="text-2xl font-black tracking-widest uppercase text-glow">
                Mechverse
              </span>
            </Link>

            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center space-x-1 text-sm font-mono uppercase tracking-wider transition-colors",
                      isActive
                        ? "text-mech-accent"
                        : "text-mech-muted hover:text-mech-text"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <Link
              to="/admin"
              className="text-mech-muted hover:text-mech-accent transition-colors flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border border-mech-border hover:border-mech-accent"
              title="Admin Panel"
            >
              {/* Replace the src below with your actual event logo PNG path (e.g., "/logo.png") */}
              <img 
                src="logo.png" 
                alt="Event Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>

      <footer className="border-t border-mech-border bg-mech-panel py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center font-mono">
          <a 
            href="https://www.instagram.com/mechverse.cemp?igsh=MThjMmlob3JjemJndw=="
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xl md:text-2xl font-bold text-mech-accent uppercase tracking-wider mb-2 hover:underline"
          >
            Department of Mechanical Engineering CEMP
          </a>
          <a 
            href="https://www.instagram.com/tinkerhub.cemp?igsh=MXF0NDlxbG9iOTMzcw=="
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-mech-muted uppercase tracking-widest hover:text-mech-accent transition-colors"
          >
            Website by Tinkerhub CEMP
          </a>
        </div>
      </footer>
    </div>
  );
}

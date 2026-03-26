import { motion } from "motion/react";
import { Award, Construction } from "lucide-react";

export default function Certificates() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-mech-accent blur-[40px] opacity-20 rounded-full" />
        <Award className="w-24 h-24 md:w-32 md:h-32 text-mech-accent relative z-10" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-glow mb-4">
          Certificates
        </h1>
        <div className="w-48 h-1 bg-mech-border mx-auto overflow-hidden relative mb-8">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute inset-0 bg-mech-accent"
          />
        </div>
        
        <div className="flex items-center justify-center space-x-3 text-mech-muted bg-mech-panel/50 border border-mech-border px-6 py-3 rounded-full backdrop-blur-sm">
          <Construction className="w-5 h-5 text-mech-accent animate-pulse" />
          <p className="text-xl md:text-2xl font-mono uppercase tracking-widest">
            Coming Soon!
          </p>
        </div>
        
        <p className="mt-8 text-mech-muted max-w-md mx-auto leading-relaxed">
          The certification portal is currently under maintenance. Please check back later to download your Mechverse 26 certificates.
        </p>
      </motion.div>
    </div>
  );
}

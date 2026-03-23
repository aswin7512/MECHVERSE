import { motion } from "motion/react";
import { Music, AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CulturalEvents() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-glow mb-4">
          Cultural Events
        </h1>
        <p className="text-mech-muted font-mono tracking-widest uppercase">
          Beyond the Machinery
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel p-8 md:p-12 text-center space-y-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Music className="w-48 h-48 text-mech-accent" />
        </div>

        <div className="relative z-10 flex flex-col items-center space-y-6">
          <div className="w-20 h-20 bg-mech-accent/10 rounded-full flex items-center justify-center border border-mech-accent/30">
            <AlertTriangle className="w-10 h-10 text-mech-accent" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wider text-mech-text">
            Cultural Event Proposals
          </h2>
          
          <p className="text-mech-muted font-mono max-w-2xl leading-relaxed text-lg">
            We are currently accepting proposals for cultural events and performances. 
            If you or your team wish to carry out any cultural events during MechVerse, 
            please establish communications with our event coordinators for approval and scheduling.
          </p>

          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-mech-accent text-black font-bold uppercase tracking-widest hover:bg-mech-accent-hover transition-colors rounded-sm mt-4"
          >
            <span>Contact Admins</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

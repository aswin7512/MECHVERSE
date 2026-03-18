import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Cpu, Settings, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <div className="absolute inset-0 bg-mech-accent blur-[100px] opacity-20 rounded-full" />
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-glow relative z-10">
          Mechverse
        </h1>
        <p className="mt-4 text-xl md:text-2xl font-mono text-mech-muted tracking-widest uppercase">
          Ignite the Gears of Innovation
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-16">
        {[
          {
            title: "Technical",
            icon: Cpu,
            desc: "Showcase your engineering prowess in high-stakes technical challenges.",
            path: "/technical",
          },
          {
            title: "Non-Technical",
            icon: Settings,
            desc: "Unleash your creativity and strategic thinking beyond the workshop.",
            path: "/non-technical",
          },
          {
            title: "Register Now",
            icon: Zap,
            desc: "Secure your spot in the ultimate mechanical showdown.",
            path: "/register",
          },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 + 0.5 }}
          >
            <Link
              to={item.path}
              className="panel p-8 flex flex-col items-center text-center group hover:border-mech-accent transition-colors duration-300 h-full"
            >
              <item.icon className="w-16 h-16 text-mech-muted group-hover:text-mech-accent transition-colors duration-300 mb-6" />
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">
                {item.title}
              </h2>
              <p className="text-mech-muted font-mono text-sm leading-relaxed">
                {item.desc}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

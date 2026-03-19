import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Cpu, Settings, Zap, Calendar, Phone, MapPin } from "lucide-react";

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
        
        <div className="mt-8 inline-flex items-center space-x-3 bg-mech-accent/10 border border-mech-accent/30 px-6 py-3 rounded-full">
          <Calendar className="w-5 h-5 text-mech-accent" />
          <span className="font-mono font-bold text-mech-accent tracking-widest uppercase">
            26th March 2026
          </span>
        </div>

        <p className="mt-8 max-w-3xl mx-auto text-sm md:text-base font-mono text-mech-muted leading-relaxed">
          MechVerse is the premier technical odyssey organized by the Mechanical Engineering Association (MEA) of the College of Engineering and Management Punnapra (CEMP). It serves as a high-octane intersection where academic rigor meets industrial innovation.
          <br /><br />
          Driven by a passion for machines and a vision for the future, MechVerse is designed to challenge the limits of engineering through immersive technical experiences, expert-led workshops, and high-level exhibitions.
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

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="w-full max-w-5xl mt-16 pt-16 border-t border-mech-border"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-glow mb-2">
            Contact HQ
          </h2>
          <p className="text-mech-muted font-mono tracking-widest uppercase text-sm">
            Establish Communications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="panel p-8 space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-mech-accent border-b border-mech-border pb-4">
              Event Coordinators
            </h2>
            
            <div className="space-y-6 font-mono">
              <div className="flex items-center space-x-4">
                <Phone className="w-6 h-6 text-mech-accent flex-shrink-0" />
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-mech-text uppercase">Rishiraj R</h3>
                  <a href="tel:+916238877438" className="text-mech-muted hover:text-mech-accent transition-colors">
                    +91 62388 77438
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Phone className="w-6 h-6 text-mech-accent flex-shrink-0" />
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-mech-text uppercase">Madhav Jayaprakash</h3>
                  <a href="tel:+918590984167" className="text-mech-muted hover:text-mech-accent transition-colors">
                    +91 85909 84167
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="panel p-8 space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-mech-accent border-b border-mech-border pb-4">
              Location Data
            </h2>
            
            <div className="space-y-6 font-mono">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-mech-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-mech-text uppercase">College of Engineering and Management Punnapra</h3>
                  <a href="https://maps.app.goo.gl/fTfFV7KZCLDAVaK4A" target="_blank" rel="noopener noreferrer" className="text-mech-muted mt-2 leading-relaxed hover:text-mech-accent transition-colors block">
                    View on Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

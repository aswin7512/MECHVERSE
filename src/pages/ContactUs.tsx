import { motion } from "motion/react";
import { Phone, MapPin } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-glow mb-4">
          Contact HQ
        </h1>
        <p className="text-mech-muted font-mono tracking-widest uppercase">
          Establish Communications
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="panel p-8 space-y-6"
        >
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="panel p-8 space-y-6"
        >
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
        </motion.div>
      </div>
    </div>
  );
}

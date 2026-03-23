import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { motion } from "motion/react";
import { AlertCircle, Zap, Clock, MapPin } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  type: string;
  fee: number;
  time?: string;
  venue?: string;
}

export default function Events() {
  const location = useLocation();
  const navigate = useNavigate();
  const type = location.pathname.includes("non-technical")
    ? "non-technical"
    : "technical";

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      if (!isSupabaseConfigured) {
        setEvents([
          {
            id: "1",
            title: "Robo Wars",
            description: "Build and battle your own combat robots in the arena.",
            type: "technical",
            fee: 500,
            time: "10:00 AM",
            venue: "Main Arena",
          },
          {
            id: "2",
            title: "CAD Modeling",
            description: "Design complex 3D models using industry-standard CAD software.",
            type: "technical",
            fee: 200,
            time: "TBD",
            venue: "Computer Lab 1",
          },
          {
            id: "3",
            title: "Treasure Hunt",
            description: "Solve mechanical puzzles to find the hidden treasure.",
            type: "non-technical",
            fee: 150,
            time: "TBD",
            venue: "TBD",
          },
          {
            id: "4",
            title: "Gaming Tournament",
            description: "Compete in popular multiplayer games.",
            type: "non-technical",
            fee: 300,
            time: "TBD",
            venue: "TBD",
          },
        ].filter((e) => e.type === type));
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("type", type)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setEvents(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [type]);

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-glow mb-4">
          {type === "technical" ? "Tech" : "Non-Tech"} Events
        </h1>
        <p className="text-mech-muted font-mono tracking-widest uppercase">
          Select your battlefield
        </p>
      </div>

      {!isSupabaseConfigured && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 p-4 rounded-lg flex items-center space-x-3 font-mono text-sm max-w-3xl mx-auto">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>
            Supabase is not configured. Showing mock data. Please set
            VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-mech-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center font-mono bg-red-500/10 p-4 rounded-lg border border-red-500/50 max-w-3xl mx-auto">
          Error: {error}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center text-mech-muted font-mono py-20">
          No events found for this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate('/register')}
              className="panel p-6 flex flex-col h-full relative overflow-hidden group cursor-pointer hover:border-mech-accent transition-colors"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="w-24 h-24 text-mech-accent" />
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-wider mb-2 text-mech-accent relative z-10">
                {event.title}
              </h3>
              <p className="text-mech-muted font-mono text-sm mb-4 flex-grow relative z-10">
                {event.description}
              </p>
              <div className="flex flex-col space-y-2 mb-6 relative z-10 font-mono text-sm text-mech-muted">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-mech-accent" />
                  <span className="uppercase">{event.time || "TBD"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-mech-accent" />
                  <span className="uppercase">{event.venue || "TBD"}</span>
                </div>
              </div>
              <div className="mt-auto pt-4 border-t border-mech-border flex justify-between items-center relative z-10">
                <span className="font-mono text-xs text-mech-muted uppercase">
                  Registration Fee
                </span>
                <span className="font-bold text-xl font-mono text-glow">
                  ₹{event.fee}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

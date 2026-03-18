import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { motion } from "motion/react";
import { AlertCircle, QrCode, CheckCircle2 } from "lucide-react";

interface Event {
  id: string;
  title: string;
  type: string;
  fee: number;
}

export default function Registration() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    college: "",
    student_class: "",
    semester: "",
    ktu_id: "",
    phone: "",
    email: "",
    transaction_id: "",
  });

  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      if (!isSupabaseConfigured) {
        setEvents([
          { id: "1", title: "Robo Wars", type: "technical", fee: 500 },
          { id: "2", title: "CAD Modeling", type: "technical", fee: 200 },
          { id: "3", title: "Treasure Hunt", type: "non-technical", fee: 150 },
          { id: "4", title: "Gaming Tournament", type: "non-technical", fee: 300 },
        ]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("events")
          .select("id, title, type, fee")
          .order("title");

        if (error) throw error;
        setEvents(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEventToggle = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const totalAmount = selectedEvents.reduce((total, eventId) => {
    const event = events.find((e) => e.id === eventId);
    return total + (event?.fee || 0);
  }, 0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (selectedEvents.length === 0) {
      setError("Please select at least one event.");
      return;
    }

    if (!formData.transaction_id.trim()) {
      setError("Please enter the UPI Transaction ID.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const registrationData = {
      ...formData,
      events: selectedEvents,
      total_amount: totalAmount,
      status: "pending",
    };

    if (!isSupabaseConfigured) {
      setTimeout(() => {
        setSubmitting(false);
        setSuccess(true);
      }, 1500);
      return;
    }

    try {
      const { error } = await supabase.from("registrations").insert([registrationData]);
      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <CheckCircle2 className="w-32 h-32 text-green-500" />
        </motion.div>
        <h2 className="text-4xl font-black uppercase tracking-widest text-glow text-green-500">
          Registration Complete
        </h2>
        <p className="text-mech-muted font-mono max-w-md">
          Your registration has been successfully recorded in the mainframe.
          Prepare for the Mechverse.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setFormData({
              name: "",
              college: "",
              student_class: "",
              semester: "",
              ktu_id: "",
              phone: "",
              email: "",
              transaction_id: "",
            });
            setSelectedEvents([]);
          }}
          className="mt-8 px-8 py-3 bg-mech-accent text-black font-bold uppercase tracking-wider hover:bg-mech-accent-hover transition-colors rounded-sm"
        >
          Register Another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-glow mb-4">
          Register
        </h1>
        <p className="text-mech-muted font-mono tracking-widest uppercase">
          Initialize your profile
        </p>
      </div>

      {error && (
        <div className="mb-8 bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg flex items-center space-x-3 font-mono text-sm max-w-3xl mx-auto">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="panel p-8 space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-mech-accent border-b border-mech-border pb-4">
              Pilot Data
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-mech-muted uppercase tracking-wider">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-mech-border rounded-sm px-4 py-3 text-mech-text focus:outline-none focus:border-mech-accent font-mono transition-colors"
                  placeholder="Your Name Here"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-mech-muted uppercase tracking-wider">
                  College <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="college"
                  required
                  value={formData.college}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-mech-border rounded-sm px-4 py-3 text-mech-text focus:outline-none focus:border-mech-accent font-mono transition-colors"
                  placeholder="CEMP"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-mech-muted uppercase tracking-wider">
                  Class <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="student_class"
                  required
                  value={formData.student_class}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-mech-border rounded-sm px-4 py-3 text-mech-text focus:outline-none focus:border-mech-accent font-mono transition-colors"
                  placeholder="ME"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-mech-muted uppercase tracking-wider">
                  Semester <span className="text-red-500">*</span>
                </label>
                <select
                  name="semester"
                  required
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-mech-border rounded-sm px-4 py-3 text-mech-text focus:outline-none focus:border-mech-accent font-mono transition-colors appearance-none"
                >
                  <option value="" disabled>Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={`S${s}`}>S{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-mech-muted uppercase tracking-wider">
                  KTU ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="ktu_id"
                  required
                  value={formData.ktu_id}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-mech-border rounded-sm px-4 py-3 text-mech-text focus:outline-none focus:border-mech-accent font-mono transition-colors uppercase"
                  placeholder="PRP00ME012"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-mech-muted uppercase tracking-wider">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-mech-border rounded-sm px-4 py-3 text-mech-text focus:outline-none focus:border-mech-accent font-mono transition-colors"
                  placeholder="+91 9876543210"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-mech-muted uppercase tracking-wider">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-mech-border rounded-sm px-4 py-3 text-mech-text focus:outline-none focus:border-mech-accent font-mono transition-colors"
                  placeholder="example@gmail.com"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="panel p-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-mech-accent border-b border-mech-border pb-4 mb-6">
              Select Events
            </h2>

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="w-8 h-8 border-4 border-mech-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {events.map((event) => (
                  <label
                    key={event.id}
                    className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-colors ${
                      selectedEvents.includes(event.id)
                        ? "border-mech-accent bg-mech-accent/10"
                        : "border-mech-border bg-black hover:border-mech-muted"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selectedEvents.includes(event.id)}
                      onChange={() => handleEventToggle(event.id)}
                    />
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-5 h-5 border rounded-sm flex items-center justify-center ${
                          selectedEvents.includes(event.id)
                            ? "border-mech-accent bg-mech-accent"
                            : "border-mech-muted"
                        }`}
                      >
                        {selectedEvents.includes(event.id) && (
                          <CheckCircle2 className="w-4 h-4 text-black" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold uppercase tracking-wider text-sm">
                          {event.title}
                        </h3>
                        <span className="text-xs font-mono text-mech-muted uppercase">
                          {event.type}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-mech-accent font-bold">
                      ₹{event.fee}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="panel p-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-mech-accent border-b border-mech-border pb-4 mb-6">
              Payment Gateway
            </h2>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="w-48 h-48 bg-white p-2 rounded-sm flex items-center justify-center">
                <img 
                  src="qr.jpg"
                  alt="Payment QR Code" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="flex-1 space-y-4 w-full">
                <div className="flex justify-between items-center border-b border-mech-border pb-2">
                  <span className="font-mono text-sm text-mech-muted uppercase">Selected Events</span>
                  <span className="font-mono font-bold">{selectedEvents.length}</span>
                </div>
                <div className="flex justify-between items-center border-b border-mech-border pb-2">
                  <span className="font-mono text-sm text-mech-muted uppercase">Total Amount</span>
                  <span className="font-mono font-bold text-2xl text-mech-accent text-glow">₹{totalAmount}</span>
                </div>
                
                <div className="mt-4 space-y-2">
                  <label className="text-xs font-mono text-mech-muted uppercase tracking-wider">
                    Transaction ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="transaction_id"
                    required
                    value={formData.transaction_id}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-mech-border rounded-sm px-4 py-3 text-mech-text focus:outline-none focus:border-mech-accent font-mono transition-colors uppercase"
                    placeholder="Enter UPI Transaction ID"
                  />
                </div>

                <p className="text-xs font-mono text-mech-muted uppercase mt-4">
                  * Scan the QR code to complete payment. Registration will be verified manually.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full py-4 bg-mech-accent text-black font-bold text-lg uppercase tracking-widest hover:bg-mech-accent-hover transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {submitting ? (
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              "Register"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

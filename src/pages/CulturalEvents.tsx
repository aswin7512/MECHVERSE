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

        <div className="relative z-10 max-w-2xl mx-auto">
          {!isSupabaseConfigured && !isSuccess && (
            <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-sm flex items-start space-x-3 text-yellow-500">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="font-mono text-sm leading-relaxed">
                <strong className="uppercase block mb-1">Mock Mode Active</strong>
                Supabase is not configured. Registrations will succeed visually but won't be saved to a database.
              </div>
            </div>
          )}

          {isSuccess ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12 space-y-6"
            >
              <div className="w-24 h-24 bg-mech-accent/20 rounded-full flex items-center justify-center mx-auto border border-mech-accent/50">
                <CheckCircle2 className="w-12 h-12 text-mech-accent" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-wider text-glow">
                Registration Confirmed!
              </h2>
              <p className="text-mech-muted font-mono max-w-md mx-auto">
                Your cultural event registration has been successfully received. We will contact you shortly to confirm your slot.
              </p>
              <button
                onClick={() => {
                  setFormData({ name: "", department: "", semester: "S1", mobile_number: "", event_type: "Dance" });
                  setIsSuccess(false);
                }}
                className="inline-flex items-center space-x-2 px-8 py-4 border border-mech-accent text-mech-accent font-bold uppercase tracking-widest hover:bg-mech-accent hover:text-black transition-colors rounded-sm mt-8"
              >
                <span>Register Another</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-center mb-8">
                <h2 className="text-2xl font-bold uppercase tracking-wider text-mech-text">
                  Performer Registration
                </h2>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-sm font-mono text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-mono text-mech-muted uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/50 border border-mech-border rounded-sm px-4 py-3 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm uppercase transition-colors"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-mech-muted uppercase tracking-wider block">Department</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-black/50 border border-mech-border rounded-sm px-4 py-3 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm uppercase transition-colors"
                    placeholder="e.g. Mechanical"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-mech-muted uppercase tracking-wider block">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full bg-black/50 border border-mech-border rounded-sm px-4 py-3 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm uppercase transition-colors appearance-none"
                  >
                    {["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"].map(sem => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-mech-muted uppercase tracking-wider block">Mobile Number</label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={formData.mobile_number}
                  onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="w-full bg-black/50 border border-mech-border rounded-sm px-4 py-3 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm transition-colors"
                  placeholder="10-digit mobile number"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-mech-muted uppercase tracking-wider block">Type of Event (Performance)</label>
                <input
                  type="text"
                  required
                  value={formData.event_type}
                  onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                  className="w-full bg-black/50 border border-mech-border rounded-sm px-4 py-3 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm uppercase transition-colors"
                  placeholder="e.g. Dance, Singing, Standup Comedy"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-mech-accent text-black font-bold uppercase tracking-widest hover:bg-mech-accent-hover transition-colors rounded-sm mt-8 disabled:opacity-50 flex justify-center items-center"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Submit Registration"
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

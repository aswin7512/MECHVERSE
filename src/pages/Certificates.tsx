import { motion } from "motion/react";
import { Award, Download, Search } from "lucide-react";
import { useState } from "react";
import React from "react";
import { Link } from "react-router-dom";

export default function Certificates() {
  const [prpCode, setPrpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [certificates, setCertificates] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = prpCode.toUpperCase().trim();
    if (code.length < 10) {
      setError("PRP CODE must be at least 10 characters.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await fetch('/certificates.json');
      if (!response.ok) throw new Error('Failed to load certificates list');
      const allCertificates: string[] = await response.json();
      const matchingFiles = allCertificates.filter(file => file.toUpperCase().startsWith(code));
      setCertificates(matchingFiles);
    } catch (err) {
      setError("Failed to fetch certificates. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = (fileName: string) => {
    window.open(`/certificates/${fileName}`, '_blank');
  };

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

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-center justify-center space-x-3 text-mech-muted bg-mech-panel/50 border border-mech-border px-6 py-3 rounded-full backdrop-blur-sm mb-4">
            <Search className="w-5 h-5 text-mech-accent" />
            <input
              type="text"
              value={prpCode}
              onChange={(e) => setPrpCode(e.target.value)}
              placeholder="Enter PRP CODE (10 or more characters)"
              className="bg-transparent text-mech-text placeholder-mech-muted outline-none uppercase"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-mech-accent text-mech-bg px-6 py-2 rounded-full font-bold uppercase tracking-widest hover:bg-mech-accent/80 transition-colors disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search Certificates"}
          </button>
        </form>

        <div className="mb-8">
          <Link
            to="/validate"
            className="bg-mech-accent text-mech-bg px-6 py-2 rounded-full font-bold uppercase tracking-widest hover:bg-mech-accent/80 transition-colors inline-block"
          >
            Validate Certificate
          </Link>
        </div>

        {error && (
          <p className="text-red-400 mb-4">{error}</p>
        )}

        {certificates.length > 0 && (
          <div className="bg-mech-panel/50 border border-mech-border p-6 rounded-lg backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4">Your Certificates</h2>
            <div className="space-y-2">
              {certificates.map((fileName) => (
                <div key={fileName} className="flex items-center justify-between bg-mech-bg/50 p-3 rounded">
                  <span className="text-mech-text">{fileName}</span>
                  <button
                    onClick={() => downloadCertificate(fileName)}
                    className="flex items-center space-x-2 bg-mech-accent text-mech-bg px-4 py-2 rounded font-bold hover:bg-mech-accent/80 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {certificates.length === 0 && !loading && !error && prpCode && (
          <p className="text-mech-muted">No certificates found for the entered PRP CODE.</p>
        )}
      </motion.div>
    </div>
  );
}

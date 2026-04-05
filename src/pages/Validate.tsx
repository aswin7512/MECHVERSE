import { motion } from "motion/react";
import { Award, Search, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import React from "react";

interface CertificateData {
  Name: string;
  "Class/Sem": string;
  "KTU ID": string;
  "Certificate ID": string;
}

export default function Validate() {
  const [certificateId, setCertificateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = certificateId.trim();
    if (!id) {
      setError("Please enter a Certificate ID.");
      return;
    }
    setError("");
    setLoading(true);
    setCertificate(null);
    try {
      const response = await fetch('/Certificate_Ledger.csv');
      if (!response.ok) throw new Error('Failed to load certificate ledger');
      const csvText = await response.text();
      const lines = csvText.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',');
      const data = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header.trim()] = values[index]?.trim() || '';
        });
        return obj as CertificateData;
      });
      const found = data.find(cert => cert["Certificate ID"] === id);
      if (found) {
        setCertificate(found);
      } else {
        setError("No data exists for this Certificate ID.");
      }
    } catch (err) {
      setError("Failed to validate certificate. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
          Validate Certificate
        </h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-center justify-center space-x-3 text-mech-muted bg-mech-panel/50 border border-mech-border px-6 py-3 rounded-full backdrop-blur-sm mb-4">
            <Search className="w-5 h-5 text-mech-accent" />
            <input
              type="text"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              placeholder="Enter Certificate ID"
              className="bg-transparent text-mech-text placeholder-mech-muted outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-mech-accent text-mech-bg px-6 py-2 rounded-full font-bold uppercase tracking-widest hover:bg-mech-accent/80 transition-colors disabled:opacity-50"
          >
            {loading ? "Validating..." : "Validate"}
          </button>
        </form>

        {error && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center space-x-2 text-red-400 mb-4"
          >
            <XCircle className="w-5 h-5" />
            <p>{error}</p>
          </motion.div>
        )}

        {certificate && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-mech-panel/50 border border-mech-border p-6 rounded-lg backdrop-blur-sm"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold text-green-400">Certificate Valid</h2>
            </div>
            <div className="space-y-2 text-left">
              <p><strong>Name:</strong> {certificate.Name}</p>
              <p><strong>Class/Sem:</strong> {certificate["Class/Sem"]}</p>
              <p><strong>KTU ID:</strong> {certificate["KTU ID"]}</p>
              <p><strong>Certificate ID:</strong> {certificate["Certificate ID"]}</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
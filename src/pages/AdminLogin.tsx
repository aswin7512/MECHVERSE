import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    if (password === adminPassword) {
      localStorage.setItem("adminAuth", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid access code.");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="panel p-8 max-w-md w-full space-y-8">
        <div className="text-center">
          <Lock className="w-16 h-16 mx-auto text-mech-accent mb-4" />
          <h1 className="text-3xl font-black uppercase tracking-widest text-glow">
            Admin Access
          </h1>
          <p className="text-mech-muted font-mono text-sm mt-2 uppercase">
            Restricted Area
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-sm flex items-center space-x-2 font-mono text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-mech-muted uppercase tracking-wider">
              Access Code
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-mech-border rounded-sm px-4 py-3 text-mech-text focus:outline-none focus:border-mech-accent font-mono transition-colors"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-mech-accent text-black font-bold uppercase tracking-widest hover:bg-mech-accent-hover transition-colors rounded-sm"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}

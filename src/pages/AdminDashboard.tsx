import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { LogOut, Plus, Users, Calendar, AlertCircle, Trash2, Check, X, Download, Edit2 } from "lucide-react";

interface Event {
  id: string;
  title: string;
  type: string;
  fee: number;
  time?: string;
  venue?: string;
}

interface Registration {
  id: string;
  name: string;
  college: string;
  student_class: string;
  semester: string;
  ktu_id: string;
  phone: string;
  email: string;
  events: string[];
  total_amount: number;
  created_at: string;
  transaction_id?: string;
  status?: 'pending' | 'accepted' | 'rejected';
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"registrations" | "events">("registrations");
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>("all");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: "",
  });

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "technical",
    fee: 0,
    time: "TBD",
    venue: "TBD",
  });

  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editEventData, setEditEventData] = useState<Partial<Event>>({});

  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null);

  const fetchData = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setRegistrations([
        {
          id: "1",
          name: "John Doe",
          college: "College of Engineering Trivandrum",
          student_class: "S6 ME",
          semester: "S6",
          ktu_id: "TVE21ME000",
          phone: "9876543210",
          email: "john@example.com",
          events: ["1", "2"],
          total_amount: 700,
          created_at: new Date().toISOString(),
          transaction_id: "UPI123456789",
          status: "pending",
        },
      ]);
      setEvents([
        { id: "1", title: "Robo Wars", type: "technical", fee: 500, time: "10:00 AM", venue: "Main Arena" },
        { id: "2", title: "CAD Modeling", type: "technical", fee: 200, time: "TBD", venue: "Computer Lab 1" },
      ]);
      setLoading(false);
      return;
    }

    try {
      const [regRes, evRes] = await Promise.all([
        supabase.from("registrations").select("*").order("created_at", { ascending: false }),
        supabase.from("events").select("*").order("created_at", { ascending: false }),
      ]);

      if (regRes.error) throw regRes.error;
      if (evRes.error) throw evRes.error;

      setRegistrations(regRes.data || []);
      setEvents(evRes.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth !== "true") {
      navigate("/admin");
    } else {
      setIsAuthenticated(true);
      fetchData();
    }
  }, [navigate]);

  const exportRegistrationsCSV = () => {
    const headers = ["Pilot Name", "College", "KTU ID", "Class/Sem", "Phone", "Email", "Events", "Total (₹)", "Payment ID", "Status", "Date"];
    const dataToExport = selectedEventFilter === "all" 
      ? registrations 
      : registrations.filter(r => (r.events || []).includes(selectedEventFilter));
      
    const csvData = dataToExport.map(reg => {
      const eventNames = (reg.events || []).map(eventId => {
        const event = events.find(e => e.id === eventId);
        return event ? event.title : eventId;
      }).join("; "); // use semicolon to avoid breaking csv format
      
      return [
        `"${reg.name}"`,
        `"${reg.college || ''}"`,
        `"${reg.ktu_id}"`,
        `"${reg.student_class} (${reg.semester})"`,
        `"${reg.phone}"`,
        `"${reg.email}"`,
        `"${eventNames}"`,
        reg.total_amount,
        `"${reg.transaction_id || 'N/A'}"`,
        `"${reg.status || 'pending'}"`,
        `"${new Date(reg.created_at).toLocaleDateString()}"`
      ].join(",");
    });
    
    const csvString = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportEventsCSV = () => {
    const headers = ["Event Title", "Type", "Fee (₹)", "Registrations"];
    const csvData = events.map(event => {
      const count = registrations.filter(r => (r.events || []).includes(event.id)).length;
      return [
        `"${event.title}"`,
        `"${event.type}"`,
        event.fee,
        count
      ].join(",");
    });
    
    const csvString = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `events-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin");
  };

  const handleAddEvent = async (e: FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setAlertDialog({ isOpen: true, message: "Supabase not configured. Cannot add event." });
      return;
    }

    try {
      const { error } = await supabase.from("events").insert([newEvent]);
      if (error) throw error;
      
      setNewEvent({ title: "", description: "", type: "technical", fee: 0, time: "TBD", venue: "TBD" });
      fetchData();
      setAlertDialog({ isOpen: true, message: "Event added successfully" });
    } catch (err: any) {
      setAlertDialog({ isOpen: true, message: "Error adding event: " + err.message });
    }
  };

  const handleDeleteEvent = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Event",
      message: "Are you sure you want to delete this event?",
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        if (!isSupabaseConfigured) {
          setEvents(events.filter(e => e.id !== id));
          return;
        }
        try {
          const { error } = await supabase.from("events").delete().eq("id", id);
          if (error) throw error;
          fetchData();
        } catch (err: any) {
          setAlertDialog({ isOpen: true, message: "Error deleting event: " + err.message });
        }
      }
    });
  };

  const startEditEvent = (event: Event) => {
    setEditingEventId(event.id);
    setEditEventData(event);
  };

  const handleEditEventSubmit = async (e: FormEvent, id: string) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setEvents(events.map(ev => ev.id === id ? { ...ev, ...editEventData } as Event : ev));
      setEditingEventId(null);
      setAlertDialog({ isOpen: true, message: "Event updated successfully (Mock Mode)" });
      return;
    }
    try {
      const { error } = await supabase.from("events").update(editEventData).eq("id", id);
      if (error) throw error;
      setEditingEventId(null);
      fetchData();
      setAlertDialog({ isOpen: true, message: "Event updated successfully" });
    } catch (err: any) {
      setAlertDialog({ isOpen: true, message: "Error updating event: " + err.message });
    }
  };

  const handleEditRegistrationSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingRegistration) return;
    
    if (!isSupabaseConfigured) {
      setRegistrations(registrations.map(r => r.id === editingRegistration.id ? editingRegistration : r));
      setEditingRegistration(null);
      setAlertDialog({ isOpen: true, message: "Registration updated successfully (Mock Mode)" });
      return;
    }
    try {
      const { id, created_at, ...dataToUpdate } = editingRegistration;
      const { error } = await supabase.from("registrations").update(dataToUpdate).eq("id", id);
      if (error) throw error;
      
      setEditingRegistration(null);
      fetchData();
      setAlertDialog({ isOpen: true, message: "Registration updated successfully" });
    } catch (err: any) {
      setAlertDialog({ isOpen: true, message: "Error updating registration: " + err.message });
    }
  };

  const startEditRegistration = (reg: Registration) => {
    setEditingRegistration(reg);
  };

  const handleDeleteRegistration = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Registration",
      message: "Are you sure you want to delete this registration?",
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        if (!isSupabaseConfigured) {
          setRegistrations(registrations.filter(r => r.id !== id));
          return;
        }
        try {
          const { error } = await supabase.from("registrations").delete().eq("id", id);
          if (error) throw error;
          fetchData();
        } catch (err: any) {
          setAlertDialog({ isOpen: true, message: "Error deleting registration: " + err.message });
        }
      }
    });
  };

  const handleUpdateRegistrationStatus = async (id: string, status: 'accepted' | 'rejected') => {
    if (!isSupabaseConfigured) {
      setRegistrations(registrations.map(r => r.id === id ? { ...r, status } : r));
      return;
    }
    try {
      const { error } = await supabase.from("registrations").update({ status }).eq("id", id);
      if (error) throw error;
      fetchData();
    } catch (err: any) {
      alert("Error updating status: " + err.message);
    }
  };

  const filteredRegistrations = selectedEventFilter === "all"
    ? registrations
    : registrations.filter((r) => (r.events || []).includes(selectedEventFilter));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b border-mech-border pb-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-glow">
            Command Center
          </h1>
          <p className="text-mech-muted font-mono text-sm uppercase">
            Admin Dashboard
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-mech-muted hover:text-red-500 transition-colors font-mono uppercase text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {!isSupabaseConfigured && (
        <div className="mb-8 bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 p-4 rounded-lg flex items-center space-x-3 font-mono text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>
            Running in mock mode. Configure Supabase to enable real data storage.
          </p>
        </div>
      )}

      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("registrations")}
          className={`flex items-center space-x-2 px-6 py-3 font-bold uppercase tracking-wider rounded-sm transition-colors ${
            activeTab === "registrations"
              ? "bg-mech-accent text-black"
              : "bg-mech-panel text-mech-muted hover:text-mech-text border border-mech-border"
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Registrations</span>
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`flex items-center space-x-2 px-6 py-3 font-bold uppercase tracking-wider rounded-sm transition-colors ${
            activeTab === "events"
              ? "bg-mech-accent text-black"
              : "bg-mech-panel text-mech-muted hover:text-mech-text border border-mech-border"
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Manage Events</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-mech-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center font-mono bg-red-500/10 p-4 rounded-lg border border-red-500/50">
          Error: {error}
        </div>
      ) : activeTab === "registrations" ? (
        <div className="panel overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-mech-border bg-black/30">
            <h2 className="text-lg font-bold uppercase tracking-wider text-mech-accent">All Registrations</h2>
            <div className="flex items-center space-x-4">
              <select
                value={selectedEventFilter}
                onChange={(e) => setSelectedEventFilter(e.target.value)}
                className="bg-black border border-mech-border rounded-sm px-3 py-1.5 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm uppercase tracking-wider"
              >
                <option value="all">All Activities</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
              <button
                onClick={exportRegistrationsCSV}
                className="flex items-center space-x-2 px-4 py-2 bg-mech-panel text-mech-text hover:bg-mech-accent hover:text-black transition-colors rounded-sm font-mono text-xs uppercase tracking-wider"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-sm">
              <thead className="bg-black/50 text-mech-muted uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 border-b border-mech-border">Pilot Name</th>
                  <th className="px-6 py-4 border-b border-mech-border">College</th>
                  <th className="px-6 py-4 border-b border-mech-border">KTU ID</th>
                  <th className="px-6 py-4 border-b border-mech-border">Class/Sem</th>
                  <th className="px-6 py-4 border-b border-mech-border">Contact</th>
                  <th className="px-6 py-4 border-b border-mech-border">Events</th>
                  <th className="px-6 py-4 border-b border-mech-border">Total (₹)</th>
                  <th className="px-6 py-4 border-b border-mech-border">Payment</th>
                  <th className="px-6 py-4 border-b border-mech-border">Date</th>
                  <th className="px-6 py-4 border-b border-mech-border text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mech-border">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-8 text-center text-mech-muted">
                      No registrations found for this activity.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-bold text-mech-text">{reg.name}</td>
                      <td className="px-6 py-4 text-mech-muted text-xs">{reg.college}</td>
                      <td className="px-6 py-4 uppercase">{reg.ktu_id}</td>
                      <td className="px-6 py-4">{reg.student_class} ({reg.semester})</td>
                      <td className="px-6 py-4">
                        <div>{reg.phone}</div>
                        <div className="text-xs text-mech-muted">{reg.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(reg.events || []).map((eventId) => {
                            const event = events.find((e) => e.id === eventId);
                            return event ? (
                              <span key={eventId} className="px-2 py-1 bg-mech-accent/10 text-mech-accent text-[10px] rounded-sm border border-mech-accent/20">
                                {event.title}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-mech-accent">₹{reg.total_amount}</td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-mono mb-1">{reg.transaction_id || 'N/A'}</div>
                        <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-sm ${
                          reg.status === 'accepted' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                          reg.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                          'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                        }`}>
                          {reg.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-mech-muted">
                        {new Date(reg.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => startEditRegistration(reg)}
                            className="p-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-sm transition-colors mr-2"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {reg.status !== 'accepted' && (
                            <button
                              onClick={() => handleUpdateRegistrationStatus(reg.id, 'accepted')}
                              className="p-1.5 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black rounded-sm transition-colors"
                              title="Accept"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {reg.status !== 'rejected' && (
                            <button
                              onClick={() => handleUpdateRegistrationStatus(reg.id, 'rejected')}
                              className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-black rounded-sm transition-colors"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteRegistration(reg.id)}
                            className="p-1.5 bg-mech-muted/10 text-mech-muted hover:bg-red-500 hover:text-black rounded-sm transition-colors ml-2"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="panel p-6 space-y-6">
              <h2 className="text-xl font-bold uppercase tracking-wider text-mech-accent border-b border-mech-border pb-4 flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Add New Event</span>
              </h2>
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-mech-muted uppercase tracking-wider">Title</label>
                  <input
                    type="text"
                    required
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full bg-black border border-mech-border rounded-sm px-4 py-2 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-mech-muted uppercase tracking-wider">Description</label>
                  <textarea
                    required
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full bg-black border border-mech-border rounded-sm px-4 py-2 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm h-24 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-mech-muted uppercase tracking-wider">Type</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                    className="w-full bg-black border border-mech-border rounded-sm px-4 py-2 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm"
                  >
                    <option value="technical">Technical</option>
                    <option value="non-technical">Non-Technical</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-mech-muted uppercase tracking-wider">Fee (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newEvent.fee === 0 ? 0 : newEvent.fee || ""}
                    onChange={(e) => setNewEvent({ ...newEvent, fee: e.target.value === "" ? 0 : parseInt(e.target.value) })}
                    className="w-full bg-black border border-mech-border rounded-sm px-4 py-2 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-mech-muted uppercase tracking-wider">Time</label>
                    <input
                      type="text"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="w-full bg-black border border-mech-border rounded-sm px-4 py-2 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm"
                      placeholder="e.g. 10:00 AM or TBD"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-mech-muted uppercase tracking-wider">Venue</label>
                    <input
                      type="text"
                      value={newEvent.venue}
                      onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                      className="w-full bg-black border border-mech-border rounded-sm px-4 py-2 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm"
                      placeholder="e.g. Main Hall or TBD"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-mech-accent text-black font-bold uppercase tracking-widest hover:bg-mech-accent-hover transition-colors rounded-sm mt-4"
                >
                  Deploy Event
                </button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="panel p-6">
              <div className="flex justify-between items-center border-b border-mech-border pb-4 mb-6">
                <h2 className="text-xl font-bold uppercase tracking-wider text-mech-accent">
                  Active Events
                </h2>
                <button
                  onClick={exportEventsCSV}
                  className="flex items-center space-x-2 px-4 py-2 bg-mech-panel text-mech-text hover:bg-mech-accent hover:text-black transition-colors rounded-sm font-mono text-xs uppercase tracking-wider"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
              <div className="space-y-4">
                {events.map((event) => {
                  const regCount = registrations.filter(r => (r.events || []).includes(event.id)).length;
                  if (editingEventId === event.id) {
                    return (
                      <form key={event.id} onSubmit={(e) => handleEditEventSubmit(e, event.id)} className="p-4 border border-mech-accent bg-black rounded-sm space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-mono text-mech-muted uppercase">Title</label>
                            <input
                              type="text"
                              required
                              value={editEventData.title || ""}
                              onChange={(e) => setEditEventData({ ...editEventData, title: e.target.value })}
                              className="w-full bg-black border border-mech-border rounded-sm px-3 py-1.5 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-mono text-mech-muted uppercase">Type</label>
                            <select
                              value={editEventData.type || "technical"}
                              onChange={(e) => setEditEventData({ ...editEventData, type: e.target.value })}
                              className="w-full bg-black border border-mech-border rounded-sm px-3 py-1.5 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm"
                            >
                              <option value="technical">Technical</option>
                              <option value="non-technical">Non-Technical</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-mono text-mech-muted uppercase">Fee (₹)</label>
                            <input
                              type="number"
                              required
                              min="0"
                              value={editEventData.fee === undefined ? "" : editEventData.fee}
                              onChange={(e) => setEditEventData({ ...editEventData, fee: e.target.value === "" ? 0 : parseInt(e.target.value) })}
                              className="w-full bg-black border border-mech-border rounded-sm px-3 py-1.5 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-mono text-mech-muted uppercase">Time</label>
                            <input
                              type="text"
                              value={editEventData.time || ""}
                              onChange={(e) => setEditEventData({ ...editEventData, time: e.target.value })}
                              className="w-full bg-black border border-mech-border rounded-sm px-3 py-1.5 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm"
                            />
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-mono text-mech-muted uppercase">Venue</label>
                            <input
                              type="text"
                              value={editEventData.venue || ""}
                              onChange={(e) => setEditEventData({ ...editEventData, venue: e.target.value })}
                              className="w-full bg-black border border-mech-border rounded-sm px-3 py-1.5 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 pt-2 border-t border-mech-border">
                          <button
                            type="button"
                            onClick={() => setEditingEventId(null)}
                            className="px-4 py-1.5 border border-mech-border text-mech-muted hover:text-mech-text hover:border-mech-muted font-mono uppercase text-xs transition-colors rounded-sm"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 bg-mech-accent text-black font-bold uppercase tracking-wider hover:bg-mech-accent-hover transition-colors rounded-sm text-xs"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    );
                  }

                  return (
                  <div key={event.id} className="flex items-center justify-between p-4 border border-mech-border bg-black rounded-sm group hover:border-mech-muted transition-colors">
                    <div>
                      <h3 className="font-bold uppercase tracking-wider">{event.title}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs font-mono text-mech-muted uppercase">{event.type}</span>
                        <span className="text-[10px] font-mono text-mech-muted uppercase bg-black px-2 py-0.5 rounded-sm border border-mech-border">
                          {event.time || "TBD"} • {event.venue || "TBD"}
                        </span>
                        <span className="text-[10px] font-mono text-mech-accent bg-mech-accent/10 px-2 py-0.5 rounded-sm border border-mech-accent/20">
                          {regCount} {regCount === 1 ? 'Registration' : 'Registrations'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-mono text-mech-accent font-bold">₹{event.fee}</span>
                      <div className="flex items-center space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEditEvent(event)}
                          className="p-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-sm transition-colors"
                          title="Edit Event"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-black rounded-sm transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )})}
                {events.length === 0 && (
                  <p className="text-mech-muted font-mono text-center py-8">No events deployed yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-black border border-mech-border p-6 rounded-sm max-w-md w-full mx-4 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <h3 className="text-xl font-bold uppercase tracking-wider text-mech-accent mb-4">
              {confirmDialog.title}
            </h3>
            <p className="text-mech-muted font-mono mb-8">
              {confirmDialog.message}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                className="px-6 py-2 border border-mech-border text-mech-muted hover:text-mech-text hover:border-mech-muted font-mono uppercase text-sm transition-colors rounded-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="px-6 py-2 bg-red-500 text-black font-bold uppercase tracking-wider hover:bg-red-600 transition-colors rounded-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Dialog */}
      {alertDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-black border border-mech-border p-6 rounded-sm max-w-md w-full mx-4 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-6 h-6 text-mech-accent" />
              <h3 className="text-xl font-bold uppercase tracking-wider text-mech-text">
                Notice
              </h3>
            </div>
            <p className="text-mech-muted font-mono mb-8">
              {alertDialog.message}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setAlertDialog(prev => ({ ...prev, isOpen: false }))}
                className="px-6 py-2 bg-mech-accent text-black font-bold uppercase tracking-wider hover:bg-mech-accent-hover transition-colors rounded-sm"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Registration Modal */}
      {editingRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-black border border-mech-border p-6 rounded-sm max-w-2xl w-full mx-auto my-8 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <div className="flex justify-between items-center mb-6 border-b border-mech-border pb-4">
              <h3 className="text-xl font-bold uppercase tracking-wider text-mech-accent">
                Edit Registration
              </h3>
              <button
                onClick={() => setEditingRegistration(null)}
                className="text-mech-muted hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditRegistrationSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-mech-muted uppercase">Name</label>
                  <input
                    type="text"
                    required
                    value={editingRegistration.name}
                    onChange={(e) => setEditingRegistration({ ...editingRegistration, name: e.target.value })}
                    className="w-full bg-black border border-mech-border rounded-sm px-3 py-2 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-mech-muted uppercase">College</label>
                  <input
                    type="text"
                    required
                    value={editingRegistration.college}
                    onChange={(e) => setEditingRegistration({ ...editingRegistration, college: e.target.value })}
                    className="w-full bg-black border border-mech-border rounded-sm px-3 py-2 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-mech-muted uppercase">Class</label>
                  <input
                    type="text"
                    required
                    value={editingRegistration.student_class}
                    onChange={(e) => setEditingRegistration({ ...editingRegistration, student_class: e.target.value })}
                    className="w-full bg-black border border-mech-border rounded-sm px-3 py-2 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-mech-muted uppercase">Semester</label>
                  <input
                    type="text"
                    required
                    value={editingRegistration.semester}
                    onChange={(e) => setEditingRegistration({ ...editingRegistration, semester: e.target.value })}
                    className="w-full bg-black border border-mech-border rounded-sm px-3 py-2 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-mech-muted uppercase">KTU ID</label>
                  <input
                    type="text"
                    required
                    value={editingRegistration.ktu_id}
                    onChange={(e) => setEditingRegistration({ ...editingRegistration, ktu_id: e.target.value })}
                    className="w-full bg-black border border-mech-border rounded-sm px-3 py-2 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-mech-muted uppercase">Phone</label>
                  <input
                    type="text"
                    required
                    value={editingRegistration.phone}
                    onChange={(e) => setEditingRegistration({ ...editingRegistration, phone: e.target.value })}
                    className="w-full bg-black border border-mech-border rounded-sm px-3 py-2 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-mech-muted uppercase">Email</label>
                  <input
                    type="email"
                    required
                    value={editingRegistration.email}
                    onChange={(e) => setEditingRegistration({ ...editingRegistration, email: e.target.value })}
                    className="w-full bg-black border border-mech-border rounded-sm px-3 py-2 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-mech-muted uppercase">Total Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingRegistration.total_amount}
                    onChange={(e) => setEditingRegistration({ ...editingRegistration, total_amount: parseInt(e.target.value) || 0 })}
                    className="w-full bg-black border border-mech-border rounded-sm px-3 py-2 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-mech-muted uppercase">Transaction ID</label>
                  <input
                    type="text"
                    value={editingRegistration.transaction_id || ""}
                    onChange={(e) => setEditingRegistration({ ...editingRegistration, transaction_id: e.target.value })}
                    className="w-full bg-black border border-mech-border rounded-sm px-3 py-2 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-mech-muted uppercase">Status</label>
                  <select
                    value={editingRegistration.status || "pending"}
                    onChange={(e) => setEditingRegistration({ ...editingRegistration, status: e.target.value as 'pending' | 'accepted' | 'rejected' })}
                    className="w-full bg-black border border-mech-border rounded-sm px-3 py-2 text-mech-text focus:outline-none focus:border-mech-accent font-mono text-sm uppercase tracking-wider"
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <label className="text-xs font-mono text-mech-muted uppercase">Selected Events</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {events.map((event) => (
                    <label key={event.id} className="flex items-center space-x-2 p-2 border border-mech-border rounded-sm bg-black hover:border-mech-accent cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={(editingRegistration.events || []).includes(event.id)}
                        onChange={(e) => {
                          const currentEvents = editingRegistration.events || [];
                          const newEvents = e.target.checked
                            ? [...currentEvents, event.id]
                            : currentEvents.filter(id => id !== event.id);
                          setEditingRegistration({ ...editingRegistration, events: newEvents });
                        }}
                        className="accent-mech-accent"
                      />
                      <span className="text-xs font-mono uppercase truncate">{event.title}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-6 border-t border-mech-border">
                <button
                  type="button"
                  onClick={() => setEditingRegistration(null)}
                  className="px-6 py-2 border border-mech-border text-mech-muted hover:text-mech-text hover:border-mech-muted font-mono uppercase text-sm transition-colors rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-mech-accent text-black font-bold uppercase tracking-wider hover:bg-mech-accent-hover transition-colors rounded-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

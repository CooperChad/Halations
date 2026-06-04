"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import type { Pin } from "../components/Map";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [pins, setPins] = useState<Pin[]>([]);
  const [pending, setPending] = useState<{ lat: number; lng: number } | null>(null);
  const [form, setForm] = useState({ location: "", date: "" });
  const [error, setError] = useState("");

  const fetchPins = useCallback(async () => {
    const res = await fetch("/api/pins");
    setPins(await res.json());
  }, []);

  useEffect(() => {
    if (authed) fetchPins();
  }, [authed, fetchPins]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // We verify by attempting to POST — but for UX, just store and let API reject
    setAuthed(true);
    setError("");
  }

  function handleMapClick(lat: number, lng: number) {
    setPending({ lat, lng });
    setForm({ location: "", date: "" });
  }

  async function handleAddPin(e: React.FormEvent) {
    e.preventDefault();
    if (!pending) return;
    const res = await fetch("/api/pins", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ ...pending, ...form }),
    });
    if (res.status === 401) { setError("Wrong password."); setAuthed(false); return; }
    setPending(null);
    fetchPins();
  }

  async function handleDelete(id: string) {
    await fetch("/api/pins", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ id }),
    });
    fetchPins();
  }

  if (!authed) {
    return (
      <div style={{
        minHeight: "100vh", background: "#e8e0d4",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px", width: 280 }}>
          <h1 style={{ fontFamily: "var(--font-playfair), serif", color: "#6b7a5e", fontSize: "1.6rem", marginBottom: 8 }}>
            Admin
          </h1>
          {error && <p style={{ color: "#a05050", fontSize: "0.85rem" }}>{error}</p>}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
          <button type="submit" style={btnStyle}>Enter</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#e8e0d4", padding: "40px" }}>
      <h1 style={{ fontFamily: "var(--font-playfair), serif", color: "#6b7a5e", fontSize: "1.8rem", marginBottom: 8 }}>
        #inthemoment — Pin Manager
      </h1>
      <p style={{ color: "#7a7268", fontSize: "0.9rem", marginBottom: 32 }}>
        Click anywhere on the map to drop a pin.
      </p>

      <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Map */}
        <div style={{
          flex: "1 1 500px", height: 480,
          border: "1px solid #c8c0b0",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(80,50,20,0.10)",
        }}>
          <Map pins={pins} onMapClick={handleMapClick} interactive />
        </div>

        {/* Sidebar */}
        <div style={{ flex: "0 0 260px", display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Add pin form */}
          {pending && (
            <div style={{ background: "#f0ebe2", padding: 24, borderRadius: 4, border: "1px solid #c8c0b0" }}>
              <h2 style={{ fontFamily: "var(--font-playfair), serif", color: "#6b7a5e", fontSize: "1.1rem", marginBottom: 16 }}>
                New pin
              </h2>
              <p style={{ fontSize: "0.75rem", color: "#a09888", marginBottom: 16 }}>
                {pending.lat.toFixed(4)}, {pending.lng.toFixed(4)}
              </p>
              <form onSubmit={handleAddPin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Location</label>
                  <input required value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Provo, Utah" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Date</label>
                  <input required type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="submit" style={btnStyle}>Add pin</button>
                  <button type="button" onClick={() => setPending(null)} style={{ ...btnStyle, background: "transparent", color: "#7a7268", border: "1px solid #c8c0b0" }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Pin list */}
          {pins.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <h2 style={{ fontFamily: "var(--font-playfair), serif", color: "#6b7a5e", fontSize: "1rem" }}>
                Active pins
              </h2>
              {pins.map(pin => (
                <div key={pin.id} style={{
                  background: "#f0ebe2", padding: "12px 16px", borderRadius: 4,
                  border: "1px solid #c8c0b0", display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <div style={{ fontSize: "0.9rem", color: "#3a3530", fontWeight: 400 }}>{pin.location}</div>
                    <div style={{ fontSize: "0.75rem", color: "#7a7268" }}>{pin.date}</div>
                  </div>
                  <button
                    onClick={() => handleDelete(pin.id)}
                    style={{ background: "none", border: "none", color: "#a09888", fontSize: "1rem", cursor: "none", padding: "0 4px" }}
                    title="Remove pin"
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "transparent", border: "1px solid #b8b0a4",
  borderRadius: 4, padding: "8px 12px", fontSize: "0.9rem", color: "#3a3530",
  outline: "none", fontFamily: "var(--font-inter), sans-serif", fontWeight: 300,
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.75rem", color: "#7a7268",
  marginBottom: 6, letterSpacing: "0.03em",
};

const btnStyle: React.CSSProperties = {
  background: "#1a1714", color: "white", border: "none",
  borderRadius: 999, padding: "8px 20px", fontSize: "0.85rem", cursor: "none",
};

"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Cursor from "./components/Cursor";
import CameraGame from "./components/CameraGame";
import MobileEffects from "./components/MobileEffects";
import type { Pin } from "./components/Map";

const Map = dynamic(() => import("./components/Map"), { ssr: false });

const PLACEHOLDER_PHOTOS = [
  { id: 1, alt: "Family in the park" },
  { id: 2, alt: "American flag against mountain sky" },
  { id: 3, alt: "Mountain peak" },
  { id: 4, alt: "Father lifting child" },
  { id: 5, alt: "Street scene" },
];

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8rem",
  color: "#8a7a62",
  marginBottom: "8px",
  letterSpacing: "0.03em",
};

const sublabelStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "#8a7a62",
  marginBottom: "6px",
  letterSpacing: "0.03em",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "1px solid #b8b0a4",
  borderRadius: "4px",
  padding: "8px 12px",
  fontSize: "0.9rem",
  color: "#2e2616",
  outline: "none",
  fontFamily: "var(--font-inter), sans-serif",
  fontWeight: 300,
};

export default function Home() {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", subject: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [pins, setPins] = useState<Pin[]>([]);

  useEffect(() => {
    fetch("/api/pins").then(r => r.json()).then(setPins).catch(() => {});
  }, []);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Mouse tracking
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const heroPhotoRef = useRef<HTMLDivElement>(null);
  const aboutHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      mouseRef.current = { x, y };

      if (heroPhotoRef.current) {
        const dx = (x - 0.5) * 18;
        const dy = (y - 0.5) * 12;
        heroPhotoRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
      }

      if (aboutHeadingRef.current) {
        const dx = (x - 0.5) * 6;
        const dy = (y - 0.5) * 3;
        aboutHeadingRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
      }
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  function scroll(dir: "left" | "right") {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = new URLSearchParams({
      "form-name": "contact",
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    });
    await fetch("/netlify-forms.html", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    setSubmitted(true);
  }

  return (
    <>
      <style>{`
        @media (pointer: fine) { * { cursor: none !important; } }
        .photo-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .photo-card:hover {
          transform: scale(1.03) rotate(-0.8deg) !important;
          box-shadow: 0 8px 32px rgba(58,53,48,0.18);
        }
        .send-btn {
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .send-btn:hover {
          transform: scale(1.05);
          background: #6b7a5e !important;
        }
        .hero-photo {
          transition: transform 0.08s linear;
          will-change: transform;
        }
        .about-heading {
          transition: transform 0.15s ease-out;
          will-change: transform;
        }
      `}</style>

      <Cursor />
      <CameraGame />
      <MobileEffects />

      <main>
        {/* NAV */}
        <nav style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "28px 40px",
          position: "absolute",
          top: 0, left: 0, right: 0,
          zIndex: 10,
        }}>
          <span data-subject="logo" style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "1.15rem",
            letterSpacing: "0.04em",
            color: "#7a8c5e",
          }}>
            HalationStudio
          </span>
        </nav>

        {/* HERO */}
        <section style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5ead8",
          padding: "100px 40px 60px",
          overflow: "hidden",
        }}>
          {/* Video */}
          <div
            data-subject="video"
            ref={heroPhotoRef}
            className="hero-photo"
            style={{
              width: "min(860px, 90vw)",
              aspectRatio: "16/9",
              margin: "0 auto",
              boxShadow: "0 8px 48px rgba(46,38,22,0.16)",
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/dvhmnLhMQK4?rel=0&modestbranding=1"
              title="Halation Studio"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            />
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" style={{ background: "#eddfc8", padding: "clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px)" }}>
          <div data-subject="about" style={{ maxWidth: "900px", margin: "0 auto" }}>
            <h2
              ref={aboutHeadingRef}
              className="about-heading"
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "clamp(1.6rem, 5vw, 3.2rem)",
                color: "#7a8c5e",
                lineHeight: 1.2,
                marginBottom: "28px",
                maxWidth: "700px",
                display: "inline-block",
              }}
            >
              I&apos;m Cooper — a documentary photographer based in Orem, Utah.
            </h2>
            <p style={{
              fontSize: "1rem",
              lineHeight: 1.75,
              color: "#4a3c28",
              maxWidth: "640px",
              marginBottom: "56px",
            }}>
              I make quiet, observant photos and videos for families and small businesses who&apos;d rather have real moments than posed ones. Halation Studio is built around the idea that the best work comes from paying attention.
            </p>

            {/* CAROUSEL */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                style={{
                  position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
                  zIndex: 2, background: "rgba(245,234,216,0.85)", border: "none", borderRadius: "50%",
                  width: 36, height: 36, fontSize: "1rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                  transition: "transform 0.2s",
                  backdropFilter: "blur(4px)",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-50%) scale(1.1)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(-50%) scale(1)")}
              >←</button>

              <div
                data-subject="carousel"
                ref={carouselRef}
                style={{
                  display: "flex",
                  gap: "16px",
                  overflowX: "auto",
                  scrollSnapType: "x mandatory",
                  scrollbarWidth: "none",
                  background: "#fdf6ec",
                  padding: "24px",
                }}
              >
                {PLACEHOLDER_PHOTOS.map((photo) => (
                  <div
                    key={photo.id}
                    className="photo-card"
                    style={{
                      flex: "0 0 min(220px, 60vw)",
                      aspectRatio: "3/4",
                      background: "#d4c4a0",
                      scrollSnapAlign: "start",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ color: "#a09888", fontSize: "0.75rem", letterSpacing: "0.06em", textAlign: "center", padding: "8px" }}>
                      {photo.alt}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                style={{
                  position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                  zIndex: 2, background: "rgba(245,234,216,0.85)", border: "none", borderRadius: "50%",
                  width: 36, height: 36, fontSize: "1rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                  transition: "transform 0.2s",
                  backdropFilter: "blur(4px)",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-50%) scale(1.1)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(-50%) scale(1)")}
              >→</button>
            </div>
          </div>
        </section>

        {/* IN THE MOMENT MAP */}
        <section id="map" data-subject="map" style={{ background: "#e6d8c0", padding: "clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px)" }}>
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <p style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.75rem",
              letterSpacing: "0.18em",
              color: "#8a9a7c",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}>
              #inthemoment
            </p>
            <h2 style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              color: "#7a8c5e",
              marginBottom: "32px",
              lineHeight: 1.2,
            }}>
              Where I&apos;m shooting next.
            </h2>
            <div style={{
              height: 440,
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(80,50,20,0.13)",
              border: "1px solid #c0b8a8",
            }}>
              <Map pins={pins} />
            </div>
            {pins.length === 0 && (
              <p style={{ color: "#a09888", fontSize: "0.85rem", marginTop: 16, fontStyle: "italic" }}>
                No upcoming shoots pinned yet — check back soon.
              </p>
            )}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ background: "#eddfc8", padding: "clamp(48px, 10vw, 100px) clamp(20px, 5vw, 40px)" }}>
          <div data-subject="contact" style={{ maxWidth: "560px", margin: "0 auto" }}>
            <h2 style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              color: "#7a8c5e",
              lineHeight: 1.25,
              marginBottom: "48px",
            }}>
              Booking sessions in Utah Valley and beyond.
            </h2>

            {submitted ? (
              <p style={{ color: "#7a8c5e", fontSize: "1rem", lineHeight: 1.75 }}>
                Thanks — I&apos;ll be in touch soon.
              </p>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label style={labelStyle}>Name</label>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={sublabelStyle}>First Name <span style={{ color: "#a09888" }}>Required</span></div>
                      <input required value={formData.firstName} onChange={e => setFormData(f => ({ ...f, firstName: e.target.value }))} style={inputStyle} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={sublabelStyle}>Last Name <span style={{ color: "#a09888" }}>Required</span></div>
                      <input required value={formData.lastName} onChange={e => setFormData(f => ({ ...f, lastName: e.target.value }))} style={inputStyle} />
                    </div>
                  </div>
                </div>
                <div>
                  <label style={sublabelStyle}>Email <span style={{ color: "#a09888" }}>Required</span></label>
                  <input type="email" required value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={sublabelStyle}>Subject <span style={{ color: "#a09888" }}>Required</span></label>
                  <input required value={formData.subject} onChange={e => setFormData(f => ({ ...f, subject: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={sublabelStyle}>Message <span style={{ color: "#a09888" }}>Required</span></label>
                  <textarea required rows={5} value={formData.message} onChange={e => setFormData(f => ({ ...f, message: e.target.value }))} style={{ ...inputStyle, resize: "vertical" }} />
                </div>
                <button type="submit" className="send-btn" style={{
                  alignSelf: "flex-start",
                  background: "#1a1714",
                  color: "white",
                  border: "none",
                  borderRadius: "999px",
                  padding: "10px 28px",
                  fontSize: "0.9rem",
                  letterSpacing: "0.02em",
                }}>
                  Send
                </button>
              </form>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{
          background: "#eddfc8",
          borderTop: "1px solid #c8b898",
          padding: "40px 40px 36px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}>
          {/* Social icons */}
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <a data-subject="instagram" href="https://www.instagram.com/studio.halation?igsh=enJlMnBxanduaGYz"
              target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              style={{ color: "#8a7a62", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#7a8c5e")}
              onMouseLeave={e => (e.currentTarget.style.color = "#8a7a62")}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
              </svg>
            </a>
            <a href="https://www.youtube.com/@CooperChadburn"
              target="_blank" rel="noopener noreferrer" aria-label="YouTube"
              style={{ color: "#8a7a62", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#7a8c5e")}
              onMouseLeave={e => (e.currentTarget.style.color = "#8a7a62")}>
              <svg width="24" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
              </svg>
            </a>
          </div>

          {/* Email + wordmark */}
          <a href="mailto:cooper@halationstudio.com"
            style={{ color: "#8a7a62", fontSize: "0.8rem", textDecoration: "none", letterSpacing: "0.04em" }}>
            cooper@halationstudio.com
          </a>
          <span style={{
            fontFamily: "var(--font-playfair), serif",
            color: "#b8a888",
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
          }}>
            © {new Date().getFullYear()} HalationStudio
          </span>
        </footer>
      </main>
    </>
  );
}

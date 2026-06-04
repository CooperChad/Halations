"use client";

import { useState, useRef, useEffect } from "react";
import Cursor from "./components/Cursor";

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
  color: "#7a7268",
  marginBottom: "8px",
  letterSpacing: "0.03em",
};

const sublabelStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "#7a7268",
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
  color: "#3a3530",
  outline: "none",
  fontFamily: "var(--font-inter), sans-serif",
  fontWeight: 300,
};

export default function Home() {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", subject: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
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
    await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
    setSubmitted(true);
  }

  return (
    <>
      <style>{`
        * { cursor: none !important; }
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
          <span style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "1.15rem",
            letterSpacing: "0.04em",
            color: "#6b7a5e",
          }}>
            HalationStudio
          </span>
        </nav>

        {/* HERO */}
        <section style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#e8e0d4",
          paddingTop: "80px",
          overflow: "hidden",
        }}>
          <div
            ref={heroPhotoRef}
            className="hero-photo"
            style={{
              width: "min(580px, 82vw)",
              aspectRatio: "3/4",
              background: "#c8c0b4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#a09888", fontSize: "0.85rem", letterSpacing: "0.08em" }}>
              hero photo
            </span>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" style={{ background: "#ddd4c5", padding: "80px 40px" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <h2
              ref={aboutHeadingRef}
              className="about-heading"
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                color: "#6b7a5e",
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
              color: "#5a5248",
              maxWidth: "640px",
              marginBottom: "56px",
            }}>
              I make quiet, observant photographs for families and small businesses who&apos;d rather have real moments than posed ones. Halation Studio is built around the idea that the best photos come from paying attention.
            </p>

            {/* CAROUSEL */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                style={{
                  position: "absolute", left: -20, top: "50%", transform: "translateY(-50%)",
                  zIndex: 2, background: "white", border: "none", borderRadius: "50%",
                  width: 40, height: 40, fontSize: "1.1rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-50%) scale(1.1)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(-50%) scale(1)")}
              >←</button>

              <div
                ref={carouselRef}
                style={{
                  display: "flex",
                  gap: "16px",
                  overflowX: "auto",
                  scrollSnapType: "x mandatory",
                  scrollbarWidth: "none",
                  background: "white",
                  padding: "24px",
                }}
              >
                {PLACEHOLDER_PHOTOS.map((photo) => (
                  <div
                    key={photo.id}
                    className="photo-card"
                    style={{
                      flex: "0 0 220px",
                      aspectRatio: "3/4",
                      background: "#d8d0c4",
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
                  position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)",
                  zIndex: 2, background: "white", border: "none", borderRadius: "50%",
                  width: 40, height: 40, fontSize: "1.1rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-50%) scale(1.1)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(-50%) scale(1)")}
              >→</button>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ background: "#e0d8cc", padding: "100px 40px" }}>
          <div style={{ maxWidth: "560px", margin: "0 auto" }}>
            <h2 style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              color: "#6b7a5e",
              lineHeight: 1.25,
              marginBottom: "48px",
            }}>
              Booking sessions in Utah Valley and beyond.
            </h2>

            {submitted ? (
              <p style={{ color: "#6b7a5e", fontSize: "1rem", lineHeight: 1.75 }}>
                Thanks — I&apos;ll be in touch soon.
              </p>
            ) : (
              <form name="contact" data-netlify="true" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <input type="hidden" name="form-name" value="contact" />
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
          background: "#e0d8cc",
          borderTop: "1px solid #ccc4b4",
          padding: "32px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <span style={{
            fontFamily: "var(--font-playfair), serif",
            color: "#6b7a5e",
            fontSize: "0.9rem",
            letterSpacing: "0.04em",
          }}>
            HalationStudio.com
          </span>
          <a href="mailto:cooper@halationstudio.com" style={{ color: "#6b7a5e", fontSize: "0.85rem", textDecoration: "none" }}>
            cooper@halationstudio.com
          </a>
        </footer>
      </main>
    </>
  );
}

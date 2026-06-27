import Image from "next/image";
import heroImage from "@/Pictures/IMG_8842.jpeg";
import homecomingImage from "@/Pictures/_DSC2315.jpg";
import anniversaryImage from "@/Pictures/_DSC3679.jpg";
import MobileNav from "./components/MobileNav";

const photoTypes = [
  {
    title: "Weddings",
    copy: "Documentary-style wedding photography that captures the day as it really happened, not overly staged.",
    status: "Now booking weddings for this season.",
    image: null,
    position: "50% 50%",
  },
  {
    title: "Family",
    copy: "Honest photos of your everyday — the little moments you never want to forget.",
    status: "Now booking family sessions.",
    image: "/reference-images/family-couch-reference.jpg",
    position: "50% 35%",
  },
  {
    title: "Mission Homecomings",
    copy: "The reunion, the hug, the tears — captured the moment it happens.",
    status: "Now booking homecomings.",
    image: homecomingImage,
    position: "50% 30%",
  },
  {
    title: "Couples & Anniversary",
    copy: "Quiet, real moments between two people — not posed, just true to who you are together.",
    status: "Now booking couples sessions.",
    image: anniversaryImage,
    position: "50% 25%",
  },
];

const weddingPackages = [
  {
    name: "Wedding Day",
    price: "$650",
    bestFor: "Straightforward day-of coverage",
    includes: [
      "Up to 3 hours of wedding-day coverage",
      "Family & wedding party photos",
      "Couple portraits",
      "150+ edited photos",
      "Online gallery",
      "Sneak peeks within 72 hours",
      "Full gallery in 3–4 weeks",
    ],
    featured: false,
  },
  {
    name: "Wedding Day + Reception",
    price: "$950",
    bestFor: "Full day, ceremony to send-off",
    includes: [
      "Up to 5 hours of wedding-day coverage",
      "Everything in Wedding Day",
      "Full reception coverage",
      "Cake cutting, first dance & send-off",
      "250+ edited photos",
      "Online gallery",
      "Sneak peeks within 72 hours",
      "Full gallery in 4–5 weeks",
    ],
    featured: false,
  },
  {
    name: "Full Wedding Collection",
    price: "$1,450",
    bestFor: "The complete experience",
    includes: [
      "Engagement session",
      "Bridal / formal session",
      "Up to 6 hours of wedding-day coverage",
      "Everything in Wedding Day + Reception",
      "400+ edited photos across all sessions",
      "Sneak peeks after each session",
      "Full wedding gallery in 5–6 weeks",
    ],
    featured: true,
  },
];

const weddingAddOns = [
  { label: "Add reception coverage", price: "$250" },
  { label: "Engagement session", price: "$250" },
  { label: "Bridal / formal session", price: "$300" },
  { label: "Extra wedding-day hour", price: "$125/hr" },
  { label: "Additional location", price: "$75" },
  { label: "Rush delivery", price: "+25%" },
  { label: "Travel beyond Utah Valley", price: "$0.75/mi" },
];

export default function Home() {
  return (
    <main className="studio-page">
      <section className="hero" id="home">
        <Image
          src={heroImage}
          alt="Cooper in the Utah desert with a wide cinematic landscape behind him"
          fill
          priority
          sizes="100vw"
          className="hero__image"
        />
        <div className="hero__shade" />

        <header className="site-header" aria-label="Primary navigation">
          <a className="wordmark" href="#home" aria-label="Halation Studio home">
            <span>Halation</span>
            <small>Studio</small>
          </a>
          <nav className="site-nav">
            <a href="#photography">Photography</a>
            <a href="#about">About</a>
            <a href="https://halationstudio11.pixieset.com" target="_blank" rel="noopener noreferrer">
              Client Galleries
            </a>
            <a href="#book">Contact</a>
            <a className="nav-button" href="#book">
              Book a Session
            </a>
          </nav>
          <MobileNav />
        </header>

        <div className="hero__content">
          <p className="eyebrow">Documentary Photography &amp; Film</p>
          <h1>Photos for the moments you&apos;ll want to remember.</h1>
          <p>
            Halation Studio creates honest documentary photography for
            families, weddings, homecomings, and the moments that deserve to
            be remembered — with film when the story calls for it.
          </p>
          <a className="outline-button" href="#photography">
            See My Work <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section className="film-types" id="photography">
        <div className="section-heading">
          <p className="eyebrow">Types of Photography</p>
          <h2>
            Every story is different.
            <br />
            Every one matters.
          </h2>
        </div>

        <div className="film-grid">
          {photoTypes.map((photo) => (
            <article className="film-card" key={photo.title}>
              <div className="film-card__image">
                {photo.image ? (
                  <Image
                    src={photo.image}
                    alt=""
                    fill
                    sizes="(max-width: 760px) 100vw, 31vw"
                    style={{ objectPosition: photo.position }}
                  />
                ) : (
                  <span className="film-card__image-label">Photos Coming Soon</span>
                )}
              </div>
              <h3>{photo.title}</h3>
              <p>{photo.copy}</p>
              <div className="film-card__examples">
                <strong>{photo.status}</strong>
                <a href="#book">
                  Inquire About This <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-band" id="about">
        <div className="about-band__image">
          <Image
            src={heroImage}
            alt="Cooper standing in a Utah landscape"
            fill
            sizes="(max-width: 820px) 100vw, 50vw"
          />
        </div>
        <div className="about-band__content">
          <p className="eyebrow">About</p>
          <h2>I believe the best stories are the real ones.</h2>
          <p>
            I started taking photos to preserve the moments I never want to
            forget with my family. Now I get to help others do the same. My
            approach is simple: document real moments, tell honest stories,
            and create photos — and the occasional film — that will mean more
            with time.
          </p>
          <a className="outline-button outline-button--dark" href="#photography">
            View My Work
          </a>
        </div>
      </section>

      <section className="weddings" id="weddings">
        <div className="section-heading">
          <p className="eyebrow">Now Booking — Weddings</p>
          <h2>Wedding photography, captured honestly.</h2>
        </div>

        <div className="weddings__intro">
          <p>
            I&apos;m taking on a limited number of weddings through Halation
            Studio — natural, documentary-style photography for couples who
            want their day captured as it really happened, not overly staged.
            I work solo, so every wedding gets my full attention.
          </p>
          <p>
            Coverage starts with the ceremony and builds up from there — add
            reception coverage, an engagement session, or a bridal/formal
            session as you need them. (For couples marrying in a temple,
            photography isn&apos;t permitted inside the sealing, so coverage
            begins at the exit.)
          </p>
        </div>

        <div className="wedding-grid">
          {weddingPackages.map((pkg) => (
            <article
              className={`wedding-card${pkg.featured ? " wedding-card--featured" : ""}`}
              key={pkg.name}
            >
              <h3 className="wedding-card__name">{pkg.name}</h3>
              <p className="wedding-card__price">{pkg.price}</p>
              <p className="wedding-card__best">{pkg.bestFor}</p>
              <ul className="wedding-card__list">
                {pkg.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a className="wedding-card__cta" href="#book">
                Inquire <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>

        <div className="wedding-addons">
          <p className="eyebrow">Add-Ons</p>
          <ul>
            {weddingAddOns.map((addon) => (
              <li key={addon.label}>
                <span>{addon.label}</span>
                <span className="wedding-addons__price">{addon.price}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="weddings__note">
          Introductory pricing while I build the wedding side of Halation
          Studio — these rates will go up as I book more weddings. A
          non-refundable retainer holds your date, with the balance split
          across your sessions.
        </p>
      </section>

      <section className="booking" id="book">
        <div className="booking__intro">
          <p className="eyebrow">Book a Session</p>
          <h2>Tell me what you want to remember.</h2>
          <p>
            Share a few details and I&apos;ll reply with availability, next
            steps, and the best way to capture your story.
          </p>
        </div>

        <form
          className="booking-form"
          name="contact"
          method="POST"
          action="/netlify-forms.html"
          data-netlify="true"
        >
          <input type="hidden" name="form-name" value="contact" />
          <label>
            Name
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Project Type
            <select name="projectType" defaultValue="Family photos" required>
              <option>Family photos</option>
              <option>Wedding photography</option>
              <option>Mission homecoming</option>
              <option>Couples / anniversary</option>
              <option>Story / brand photos</option>
              <option>Not sure yet</option>
            </select>
          </label>
          <label>
            Date or Timeframe
            <input name="timeframe" type="text" placeholder="Fall 2026, June wedding, flexible..." />
          </label>
          <label className="booking-form__wide">
            What should this capture?
            <textarea name="message" rows={5} required />
          </label>
          <button className="outline-button outline-button--dark booking-form__button" type="submit">
            Send Inquiry
          </button>
        </form>
      </section>

      <footer className="site-footer">
        <div>
          <strong>Halation Studio</strong>
          <span>Utah County</span>
        </div>
        <nav aria-label="Footer navigation">
          <a href="#photography">Photography</a>
          <a href="#about">About</a>
          <a href="#book">Contact</a>
        </nav>
        <div className="footer-socials">
          <a
            href="https://www.instagram.com/studio.halation?igsh=enJlMnBxanduaGYz"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            Instagram
          </a>
          <a
            href="https://www.youtube.com/@CooperChadburn"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            YouTube
          </a>
          <a href="mailto:cooper@halationstudio.com" aria-label="Email">
            Email
          </a>
        </div>
      </footer>
    </main>
  );
}

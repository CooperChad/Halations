import Image from "next/image";
import heroImage from "@/Pictures/IMG_8842.jpeg";
import MobileNav from "./components/MobileNav";

const filmTypes = [
  {
    title: "Family Films",
    copy: "Cinematic films of your everyday. The little moments you never want to forget.",
    status: "Now booking first family films. This example library will grow from those projects.",
    image: "/reference-images/family-film-reference.png",
    position: "50% 50%",
  },
  {
    title: "Wedding Films",
    copy: "Documentary wedding films that capture the real moments and true emotions of your day.",
    status: "Now booking first wedding films. Early couples help shape the examples future clients will see.",
    image: "/reference-images/wedding-film-reference.png",
    position: "50% 50%",
  },
  {
    title: "Story Films",
    copy: "Honest films for the people behind the businesses, brands, and places that make an impact.",
    status: "Now booking first story films for makers, brands, and meaningful local work.",
    image: "/reference-images/story-film-reference.png",
    position: "50% 50%",
  },
];

const journalNotes = [
  {
    title: "What Makes a Film Feel Honest",
    copy: "A few thoughts on quiet direction, real movement, and letting people stay themselves on camera.",
  },
  {
    title: "How I Approach Family Stories",
    copy: "The best family films are built from normal days: breakfast tables, backyard light, and the rituals you barely notice yet.",
  },
  {
    title: "Why Story Films Matter",
    copy: "For small businesses and personal projects, a film can hold the human reason behind the work.",
  },
];

const weddingPackages = [
  {
    name: "Temple Essentials",
    price: "$750",
    bestFor: "Simple temple-day coverage",
    includes: [
      "Up to 2 hours of wedding-day coverage",
      "Temple exit & family photos",
      "Wedding party photos",
      "Couple portraits on temple grounds",
      "150+ edited photos",
      "Online gallery",
      "Sneak peeks within 72 hours",
      "Full gallery in 3–4 weeks",
    ],
    featured: false,
  },
  {
    name: "LDS Wedding Day",
    price: "$1,200",
    bestFor: "Temple + reception coverage",
    includes: [
      "Up to 4 hours of wedding-day coverage",
      "Everything in Temple Essentials",
      "Reception details & candids",
      "Cake cutting, first dance & send-off",
      "250+ edited photos",
      "Online gallery",
      "Sneak peeks within 72 hours",
      "Full gallery in 4–5 weeks",
    ],
    featured: false,
  },
  {
    name: "LDS Wedding Collection",
    price: "$1,800",
    bestFor: "The full wedding experience",
    includes: [
      "Engagement session",
      "Bridal / formal session",
      "Up to 4 hours of wedding-day coverage",
      "Everything in LDS Wedding Day",
      "500+ edited photos across all sessions",
      "Sneak peeks after each session",
      "Full wedding gallery in 5–6 weeks",
    ],
    featured: true,
  },
];

const weddingAddOns = [
  { label: "Engagement session", price: "$300" },
  { label: "Bridal / formal session", price: "$400" },
  { label: "Extra wedding-day hour", price: "$150/hr" },
  { label: "Second photographer", price: "$400–700" },
  { label: "Additional location", price: "$100" },
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
            <a href="#films">Films</a>
            <a href="#about">About</a>
            <a href="#journal">Journal</a>
            <a href="https://halationstudio11.pixieset.com" target="_blank" rel="noopener noreferrer">
              Client Galleries
            </a>
            <a href="#book">Contact</a>
            <a className="nav-button" href="#book">
              Book a Film
            </a>
          </nav>
          <MobileNav />
        </header>

        <div className="hero__content">
          <p className="eyebrow">Documentary Film &amp; Photography</p>
          <h1>Films for the moments you&apos;ll want to remember.</h1>
          <p>
            Halation Studio creates cinematic documentary films for families,
            weddings, and meaningful stories that deserve to be remembered.
          </p>
          <a className="outline-button" href="#films">
            Watch Films <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section className="film-types" id="films">
        <div className="section-heading">
          <p className="eyebrow">Films We Tell</p>
          <h2>
            Every story is different.
            <br />
            Every one matters.
          </h2>
        </div>

        <div className="film-grid">
          {filmTypes.map((film) => (
            <article className="film-card" key={film.title}>
              <div className="film-card__image">
                <Image
                  src={film.image}
                  alt=""
                  fill
                  sizes="(max-width: 760px) 100vw, 31vw"
                  style={{ objectPosition: film.position }}
                />
              </div>
              <h3>{film.title}</h3>
              <p>{film.copy}</p>
              <div className="film-card__examples">
                <strong>Now Booking First Films</strong>
                <span>{film.status}</span>
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
            I started filming to preserve the moments I never want to forget
            with my family. Now I get to help others do the same. My approach
            is simple: document real moments, tell honest stories, and create
            films that will mean more with time.
          </p>
          <a className="outline-button outline-button--dark" href="#journal">
            Read Field Notes
          </a>
        </div>
      </section>

      <section className="journal" id="journal">
        <div className="journal__heading">
          <p className="eyebrow">Journal</p>
          <h2>Field notes on filming real life.</h2>
          <p>
            Short reflections on documentary filmmaking, family memory, and
            building stories that feel lived-in.
          </p>
        </div>
        <div className="journal-grid">
          {journalNotes.map((note) => (
            <article className="journal-card" key={note.title}>
              <p className="eyebrow">Note</p>
              <h3>{note.title}</h3>
              <p>{note.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="weddings" id="weddings">
        <div className="section-heading">
          <p className="eyebrow">Now Booking — LDS Weddings</p>
          <h2>Wedding photography, captured honestly.</h2>
        </div>

        <div className="weddings__intro">
          <p>
            I&apos;m taking on select weddings through Halation Studio —
            natural, documentary-style photography for couples who want their
            day captured as it really happened, not overly staged. My focus is
            real moments, family, and emotion.
          </p>
          <p>
            For LDS weddings, coverage begins at the temple exit, since
            photography isn&apos;t done inside the sealing. From there I
            document family photos, couple portraits, and your reception. Most
            couples pair the day with an engagement and a bridal or formal
            session beforehand.
          </p>
        </div>

        <div className="wedding-grid">
          {weddingPackages.map((pkg) => (
            <article
              className={`wedding-card${pkg.featured ? " wedding-card--featured" : ""}`}
              key={pkg.name}
            >
              {pkg.featured && (
                <span className="wedding-card__tag">Most Popular</span>
              )}
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
          Studio. A non-refundable retainer books your date, with the balance
          split across your sessions. Photography is not done inside the temple
          sealing.
        </p>
      </section>

      <section className="booking" id="book">
        <div className="booking__intro">
          <p className="eyebrow">Book a Film</p>
          <h2>Tell me what you want to remember.</h2>
          <p>
            Share a few details and I&apos;ll reply with availability, next
            steps, and the best way to shape the film around your story.
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
            Film Type
            <select name="filmType" defaultValue="Family film" required>
              <option>Family film</option>
              <option>Wedding film</option>
              <option>Wedding photography</option>
              <option>Story film</option>
              <option>Not sure yet</option>
            </select>
          </label>
          <label>
            Date or Timeframe
            <input name="timeframe" type="text" placeholder="Fall 2026, June wedding, flexible..." />
          </label>
          <label className="booking-form__wide">
            What should this film preserve?
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
          <a href="#films">Films</a>
          <a href="#about">About</a>
          <a href="#journal">Journal</a>
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

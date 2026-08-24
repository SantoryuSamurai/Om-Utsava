"use client";

import { useEffect, useState } from "react";

const impact = [
  ["Idol & rituals", "Pran Pratishtha, pooja items, flowers, and offerings"],
  ["Decoration", "Stage, lights, rangoli, and a welcoming festive space"],
  ["Prasadam", "Laddoo and prasad for devotees, neighbours, and visitors"],
];

const programme = [
  ["14 Sep", "Monday", "Gauri Ganesha Prana Pratishthapana", "At 12:30 PM, followed by Maha Mangalarathi and prasada distribution."],
  ["15 Sep", "Tuesday", "Annamma Agamana · 5:00 PM", "Tamate drum procession at 5:00 PM, followed by Annasantarpane (community meal) for all devotees."],
  ["16 Sep", "Wednesday", "Mahaganapati Homa", "108 modakas will be offered, followed by pooja and prasada distribution."],
  ["17 Sep", "Thursday", "Rangoli Competition", "Various cultural programmes."],
  ["18 Sep", "Friday", "Deepaaradhane", "Deepa ceremony, followed by Maha Mangalarathi and prasada distribution."],
  ["19 Sep", "Saturday", "Special decoration & procession", "Ganesha and Annamma will be specially decorated, followed by programmes and a procession through the main streets of Bangarapet."],
];

function Arrow() {
  return <span aria-hidden="true" className="arrow">→</span>;
}

function InstagramIcon() {
  return <svg className="instagram-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle className="instagram-dot" cx="17.4" cy="6.6" r=".8" /></svg>;
}

const asset = (path) => `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;

export default function Home() {
  const [amount, setAmount] = useState("501");
  const [donorName, setDonorName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [isStartingPayment, setIsStartingPayment] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }), { threshold: 0.12 });
    reveals.forEach((element) => observer.observe(element));

    const parallax = [...document.querySelectorAll(".parallax")];
    const pinnedGallery = document.querySelector(".gallery-pinned");
    const galleryTrack = pinnedGallery?.querySelector(".gallery-swipe");
    const desktopGallery = window.matchMedia("(min-width: 761px)");
    let frame;
    const updateParallax = () => {
      frame = undefined;
      parallax.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const speed = Number(element.dataset.speed || 0.03);
        element.style.setProperty("--parallax-y", `${Math.round((window.innerHeight / 2 - (rect.top + rect.height / 2)) * speed)}px`);
      });
      if (pinnedGallery && galleryTrack) {
        if (desktopGallery.matches) {
          const rect = pinnedGallery.getBoundingClientRect();
          const travel = Math.max(pinnedGallery.offsetHeight - window.innerHeight, 1);
          const progress = Math.min(1, Math.max(0, -rect.top / travel));
          const distance = Math.max(0, galleryTrack.scrollWidth - pinnedGallery.clientWidth);
          galleryTrack.style.setProperty("--pinned-x", `${Math.round(distance * progress)}px`);
        } else galleryTrack.style.setProperty("--pinned-x", "0px");
      }
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(updateParallax); };
    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { observer.disconnect(); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (frame) window.cancelAnimationFrame(frame); };
  }, []);

  async function pledge(event) {
    event.preventDefault();
    if (isStartingPayment) return;
    setIsStartingPayment(true);
    setPaymentMessage("");
    try {
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, name: donorName, phone }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      if (!window.Cashfree) throw new Error("Payment checkout is still loading. Please try again.");
      const cashfree = window.Cashfree({ mode: result.environment });
      cashfree.checkout({ paymentSessionId: result.paymentSessionId, redirectTarget: "_self" });
    } catch (error) {
      setPaymentMessage(error.message || "We could not start the payment. Please try again.");
      setIsStartingPayment(false);
    }
  }

  return (
    <main>
      <section className="hero" id="home">
        <nav className="nav shell" aria-label="Main navigation">
          <a className="brand brand-logo" href="#home" aria-label="Om Utsava home"><img src={asset("/om-utsava-mark.png")} alt="Om Utsava emblem" /><span className="brand-name">UTSAVA</span></a>
          <div className="navlinks">
            <a href="#programme">Programme</a>
            <a href="#glimpse">Glimpses</a>
            <a href="#impact">Your contribution</a>
          </div>
          <a className="button button-small" href="#donate">Donate <Arrow /></a>
        </nav>

        <div className="hero-grid shell">
          <div className="hero-copy">
            <p className="eyebrow">6th year celebration · 14–19 September 2026</p>
            <h1>Celebrate<br /><em>Lord Ganesha.</em></h1>
            <p className="intro">Join Om Utsava, Shanthi Nagar, Bangarpet, for six days of devotion, prayer, music, prasadam, and community during Ganesh Chaturthi 2026.</p>
            <div className="hero-actions">
              <a className="button" href="#donate">Contribute to Utsava <Arrow /></a>
              <a className="text-link" href="#programme">View programme <span>↓</span></a>
            </div>
            <div className="event-line">
              <div><span className="label">When</span><strong>14–19 September 2026</strong></div>
              <div><span className="label">Where</span><strong>Shanthi Nagar, Bangarpet</strong></div>
            </div>
          </div>
          <div className="hero-art" aria-label="Abstract festival decoration">
            <div className="sun parallax" data-speed="0.035"></div><div className="arch arch-one"></div><div className="arch arch-two"></div>
            <div className="festival-seal"><strong>6</strong><span>TH YEAR<br />OM UTSAVA</span></div>
            <p>Six days of<br /><em>divine celebration.</em></p>
            <div className="flower flower-one">✦</div><div className="flower flower-two">✦</div>
          </div>
        </div>
      </section>

      <section className="programme shell reveal" id="programme">
        <div className="programme-heading"><p className="eyebrow">Om Utsava 2026</p><h2>Six days of <em>prayer and celebration.</em></h2></div>
        <div className="programme-list">{programme.map(([date, day, title, detail]) => <article key={date}><div><strong>{date}</strong><span>{day}</span></div><div className="programme-event"><h3>{title}</h3><p>{detail}</p></div></article>)}</div>
        <p className="programme-closing">Concludes with <strong>Ganesha Visarjane</strong></p>
      </section>

      <section className="impact-section reveal" id="impact">
        <div className="shell impact-grid">
          <div><p className="eyebrow light">Where your contribution goes</p><h2>Every offering helps make the <em>Utsava</em> possible.</h2></div>
          <div className="impact-cards">
            {impact.map(([value, text]) => <article className="impact-card" key={value}><strong>₹{value}</strong><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="gallery shell reveal" id="glimpse" aria-labelledby="gallery-title">
        <div className="gallery-heading"><div><p className="eyebrow">Glimpse of Om Utsava 2025</p><h2 id="gallery-title">Last year, <em>together in devotion.</em></h2></div><a className="text-link instagram-link" href="https://www.instagram.com/om_utsava/" target="_blank" rel="noreferrer" aria-label="Follow Om Utsava on Instagram"><InstagramIcon /><span>@om_utsava</span><Arrow /></a></div>
        <div className="gallery-pinned"><div className="gallery-pinned-stage"><div className="gallery-swipe photo-swipe" aria-label="Om Utsava 2025 memories"><figure className="glimpse-card glimpse-group"><img src={asset("/om-utsava-community-2025.jpeg")} alt="Om Utsava volunteers gathered before Lord Ganesha" /><figcaption>Our community, united in celebration.</figcaption></figure><figure className="glimpse-card glimpse-ganesha"><img src={asset("/om-utsava-ganesha-2025.jpeg")} alt="Lord Ganesha adorned for Om Utsava" /><figcaption>With devotion, every detail is an offering.</figcaption></figure></div></div></div>
      </section>

      <section className="donate reveal" id="donate">
        <div className="shell donate-grid">
          <div><p className="eyebrow">Offer your contribution</p><h2>Be part of<br /><em>Om Utsava 2026.</em></h2><p>Every contribution supports the arrangements for the Ganesh Chaturthi celebration. We receive your offering with gratitude.</p></div>
          <form className="donate-card" onSubmit={pledge}>
            <label htmlFor="amount">Choose an amount</label>
            <div className="amount-options">{["101", "501", "1001"].map((item) => <button type="button" className={amount === item ? "selected" : ""} onClick={() => setAmount(item)} key={item}>₹{item}</button>)}</div>
            <div className="custom-amount"><span>₹</span><input id="amount" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} inputMode="numeric" aria-label="Donation amount" /></div>
            <div className="donor-fields"><label htmlFor="donor-name">Your name</label><input className="donor-input" id="donor-name" value={donorName} onChange={(e) => setDonorName(e.target.value)} autoComplete="name" required /><label htmlFor="donor-phone">Mobile number</label><input className="donor-input" id="donor-phone" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="numeric" autoComplete="tel" required /></div>
            <button className="button full" type="submit" disabled={isStartingPayment}>{isStartingPayment ? "Opening secure checkout…" : <>Continue to contribute <Arrow /></>}</button>
            {paymentMessage && <p className="form-message">{paymentMessage}</p>}
            <small>Payments are securely processed by Cashfree. By contributing, you agree to our <a href="/terms">Terms</a> and <a href="/refunds">Refunds Policy</a>.</small>
          </form>
        </div>
      </section>

      <footer><div className="shell footer-content"><a className="brand brand-logo footer-logo" href="#home" aria-label="Om Utsava home"><img src={asset("/om-utsava-mark.png")} alt="Om Utsava emblem" /><span className="brand-name">UTSAVA</span></a><p className="footer-copyright">© 2026 Om Utsava · <a href="/policies">Policies</a></p><a className="footer-instagram instagram-link" href="https://www.instagram.com/om_utsava/" target="_blank" rel="noreferrer" aria-label="Follow Om Utsava on Instagram"><InstagramIcon /><span>@om_utsava</span><Arrow /></a></div></footer>
    </main>
  );
}

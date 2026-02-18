document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header"),
    sections = [...document.querySelectorAll(".section")],
    navLinks = [...document.querySelectorAll(".nav a")],
    scrollIndicator = document.querySelector(".scroll-indicator"),
    banner = document.querySelector(".banner"),
    newsletterInput = document.querySelector(".input-group input"),
    newsletterBtn = document.querySelector(".input-group button"),
    liveTime = document.getElementById("live-time"),
    liveMoon = document.getElementById("live-moon"),
    liveCountdown = document.getElementById("live-countdown");

  let scrollYPos = 0,
    ticking = false,
    currentSectionIndex = 0;

  /* ================= SECTION REVEAL ================= */

  const observer = new IntersectionObserver(
    (e) => {
      e.forEach(
        (entry) =>
          entry.isIntersecting && entry.target.classList.add("visible"),
      );
    },
    { threshold: 0.15 },
  );
  sections.forEach((s) => observer.observe(s));

  /* ================= HAMBURGER ================= */

  const hamburger = document.querySelector(".hamburger"),
    nav = document.querySelector(".nav");
  if (hamburger && nav) {
    hamburger.addEventListener("click", () => nav.classList.toggle("open"));
  }

  /* ================= LIVE STRIP ================= */

  /* 1. Live Date + Time */

  if (liveTime) {
    setInterval(() => {
      const now = new Date();
      liveTime.textContent = now.toLocaleString(undefined, {
        weekday: "short",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }, 1000);
  }

  /* 2. Moon Phase Calculation */

  function getMoonPhase(date) {
    const synodicMonth = 29.53058867;
    const knownNewMoon = new Date("2000-01-06T18:14:00Z");
    const days = (date - knownNewMoon) / 86400000;
    const phase = (days % synodicMonth) / synodicMonth;
    if (phase < 0.03 || phase > 0.97) return "New Moon";
    if (phase < 0.22) return "Waxing Crescent";
    if (phase < 0.28) return "First Quarter";
    if (phase < 0.47) return "Waxing Gibbous";
    if (phase < 0.53) return "Full Moon";
    if (phase < 0.72) return "Waning Gibbous";
    if (phase < 0.78) return "Last Quarter";
    return "Waning Crescent";
  }

  if (liveMoon) {
    liveMoon.textContent = "Moon: " + getMoonPhase(new Date());
  }

  /* 3. Upcoming Event Countdown (reads global events from calendar.js) */

  function getNextEvent() {
    if (typeof events === "undefined") return null;
    const now = new Date();
    let upcoming = null;

    Object.keys(events).forEach((dateStr) => {
      events[dateStr].forEach((e) => {
        const eventDate = new Date(dateStr + " " + (e.time || "00:00"));
        if (
          eventDate > now &&
          (upcoming === null || eventDate < upcoming.date)
        ) {
          upcoming = { date: eventDate, title: e.title };
        }
      });
    });

    return upcoming;
  }

  function updateCountdown() {
    if (!liveCountdown) return;
    const next = getNextEvent();
    if (!next) {
      liveCountdown.textContent = "No upcoming observations";
      return;
    }

    const diff = next.date - new Date();
    if (diff <= 0) {
      liveCountdown.textContent = "Observation in progress";
      return;
    }

    const d = Math.floor(diff / 86400000),
      h = Math.floor((diff % 86400000) / 3600000),
      m = Math.floor((diff % 3600000) / 60000);

    liveCountdown.textContent = `Next: ${next.title} in ${d}d ${h}h ${m}m`;
  }

  updateCountdown();
  setInterval(updateCountdown, 60000);
});

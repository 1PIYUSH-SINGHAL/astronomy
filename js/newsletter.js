document.addEventListener("DOMContentLoaded", () => {
  console.log("newsletter.js active");

  const form = document.querySelector(".newsletter-form");
  if (!form) return;

  const input = form.querySelector("input[type='email']");
  const button = form.querySelector("button");

  const ENDPOINT =
    "https://script.google.com/macros/s/AKfycby-oGrPRtjlqEkezhYJu9EeFStsbhivd1FPcME1bwmR-fUtKeermjZubYZ-qnrtdBdV/exec";

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = input.value.trim();
    const valid = validateEmail(email);

    input.style.borderColor = valid ? "var(--accent)" : "#ff5c5c";

    if (!valid) return;

    button.disabled = true;
    button.textContent = "Subscribing...";
    button.style.background = "#1f6feb";

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
          email: email,
          source: "Homepage",
        }),
      });

      if (!res.ok) throw new Error("Network error");

      button.textContent = "Subscribed ✓";
      button.style.background = "#2ea043";
      input.value = "";
    } catch (err) {
      console.error("Newsletter error:", err);
      button.textContent = "Error";
      button.style.background = "#ff5c5c";
    }

    setTimeout(() => {
      button.textContent = "Subscribe";
      button.style.background = "var(--accent)";
      input.style.borderColor = "var(--border)";
      button.disabled = false;
    }, 2000);
  });
});

const events = {
  "2026-02-28": [
    { title: "Alignment of planets", time: "23:00", status: "scheduled" },
  ],
};

/*
EVENT OBJECT FORMAT

events = {
  "YYYY-MM-DD": [
    {
      title: "Event title (required)",
      time: "HH:MM",
      status: "scheduled" | "weather-risk" | "cancelled" | "completed",

      reason: "Required if cancelled",
      description: "Optional longer description",
      telescope: "Optional equipment used",
      visibility: "Optional visibility notes"
    }
  ]
}
*/

let currentDate = new Date();
const today = new Date();
const monthLabel = document.getElementById("monthLabel");
const calendarGrid = document.getElementById("calendarGrid");
const eventPanel = document.getElementById("eventPanel");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

/* ================= NAVIGATION ================= */

if (prevBtn)
  prevBtn.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  };

if (nextBtn)
  nextBtn.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  };

function formatDate(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/* ================= LIFECYCLE UPDATE ================= */

function updateEventLifecycle() {
  const now = new Date();

  Object.keys(events).forEach((dateStr) => {
    events[dateStr].forEach((e) => {
      const eventDate = new Date(dateStr + " " + (e.time || "00:00"));

      if (eventDate <= now) {
        if (e.status !== "cancelled") {
          e.status = "completed";
        }
      }
    });
  });
}

/* ================= WEATHER UPDATE (DEHRADUN) ================= */

async function updateWeatherStatus() {
  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=30.3165&longitude=78.0322&daily=precipitation_probability_max&timezone=auto"
    );
    const data = await res.json();
    const now = new Date();

    data.daily.time.forEach((date, i) => {
      const precip = data.daily.precipitation_probability_max[i];

      if (events[date]) {
        events[date].forEach((e) => {
          const eventDate = new Date(date + " " + (e.time || "00:00"));

          if (e.status === "scheduled" && eventDate > now) {
            if (precip > 80) {
              e.status = "cancelled";
              e.reason = "Cancelled due to heavy rainfall forecast";
            } else if (precip > 60) {
              e.status = "weather-risk";
              e.reason = "High precipitation probability";
            }
          }
        });
      }
    });

    renderCalendar();
  } catch (err) {
    console.warn("Weather update failed");
  }
}

/* ================= RENDER ================= */

function renderCalendar() {
  if (!calendarGrid) return;

  updateEventLifecycle();
  calendarGrid.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  monthLabel &&
    (monthLabel.textContent =
      firstDay.toLocaleString("default", { month: "long" }) +
      " " +
      year);

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const frag = document.createDocumentFragment();

  weekdays.forEach((day) => {
    const div = document.createElement("div");
    div.className = "weekday";
    div.textContent = day;
    frag.appendChild(div);
  });

  for (let i = 0; i < firstDay.getDay(); i++)
    frag.appendChild(document.createElement("div"));

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = formatDate(year, month, d);
    const dayEvents = events[dateStr];
    const isToday =
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    const dayDiv = document.createElement("div");
    dayDiv.className = "calendar-day";
    dayDiv.textContent = d;

    if (isToday) dayDiv.classList.add("today");

    if (dayEvents) {
      const indicator = document.createElement("div");
      indicator.className =
        "event-indicator " + (dayEvents[0].status || "scheduled");
      dayDiv.appendChild(indicator);
    }

    dayDiv.addEventListener("click", () => {
      document
        .querySelectorAll(".calendar-day")
        .forEach((el) => el.classList.remove("active"));
      dayDiv.classList.add("active");
      showEvents(dateStr);
    });

    frag.appendChild(dayDiv);
  }

  calendarGrid.appendChild(frag);
}

/* ================= SHOW EVENTS ================= */

function showEvents(dateStr) {
  const dayEvents = events[dateStr];

  if (!dayEvents) {
    eventPanel.innerHTML = "<p>No scheduled observations.</p>";
    return;
  }

  eventPanel.innerHTML = dayEvents
    .map((e) => {
      let statusLabel = "",
        extra = "";

      if (e.status === "scheduled")
        statusLabel = `<span class="status scheduled">Scheduled</span>`;

      if (e.status === "weather-risk") {
        statusLabel = `<span class="status weather">Weather Risk</span>`;
        extra = `<p>${e.reason || "Weather conditions may affect recording."}</p>`;
      }

      if (e.status === "cancelled") {
        statusLabel = `<span class="status cancelled">Cancelled</span>`;
        extra = `<p>Reason: ${e.reason || "Unavailable"}</p>`;
      }

      if (e.status === "completed")
        statusLabel = `<span class="status completed">Completed</span>`;

      return `
<div class="event-card">
<h3>${e.title}</h3>
<p>${e.time || ""}</p>
${statusLabel}
${extra}
</div>`;
    })
    .join("");
}

/* ================= UPCOMING EVENT AUTO-SHOW ================= */

function getNextUpcoming() {
  const now = new Date();
  let upcoming = null;

  Object.keys(events).forEach((dateStr) => {
    events[dateStr].forEach((e) => {
      const eventDate = new Date(dateStr + " " + (e.time || "00:00"));

      if (
        eventDate > now &&
        (upcoming === null || eventDate < upcoming.date)
      ) {
        upcoming = { date: eventDate, dateStr };
      }
    });
  });

  return upcoming;
}

const next = getNextUpcoming();

if (next) {
  currentDate = new Date(next.dateStr);
  renderCalendar();
  showEvents(next.dateStr);
} else {
  renderCalendar();
}

/* ================= INITIAL WEATHER CHECK ================= */

updateWeatherStatus();
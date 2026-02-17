const events = {
  "2026-02-28": [
    {
      title: "Alignment of planets",
      time: "11:00 pm",
      status: "scheduled",
    },
  ]
};

let currentDate = new Date();

const monthLabel = document.getElementById("monthLabel");
const calendarGrid = document.getElementById("calendarGrid");
const eventPanel = document.getElementById("eventPanel");

document.getElementById("prevMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

document.getElementById("nextMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

function renderCalendar() {
  calendarGrid.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  monthLabel.textContent =
    firstDay.toLocaleString("default", { month: "long" }) + " " + year;

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  weekdays.forEach((day) => {
    const div = document.createElement("div");
    div.className = "weekday";
    div.textContent = day;
    calendarGrid.appendChild(div);
  });

  const startDay = firstDay.getDay();

  for (let i = 0; i < startDay; i++) {
    calendarGrid.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

    const hasEvent = events[dateStr];
    const isToday =
      d === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear();

    const dayDiv = document.createElement("div");
    dayDiv.className = "calendar-day";
    dayDiv.textContent = d;

    if (isToday) dayDiv.classList.add("today");

    if (hasEvent) {
      dayDiv.classList.add("event");
      const indicator = document.createElement("div");
      indicator.className = "event-indicator " + hasEvent[0].status;

      dayDiv.appendChild(indicator);
    }

    dayDiv.onclick = () => showEvents(dateStr);

    calendarGrid.appendChild(dayDiv);
  }
}

function showEvents(dateStr) {
  const dayEvents = events[dateStr];

  if (!dayEvents) {
    eventPanel.innerHTML = "<p>No scheduled observations.</p>";
    return;
  }

  eventPanel.innerHTML = dayEvents
    .map((e) => {
      let statusLabel = "";
      let extra = "";

      if (e.status === "scheduled") {
        statusLabel = `<span class="status scheduled">Scheduled</span>`;
      }

      if (e.status === "weather-risk") {
        statusLabel = `<span class="status weather">Weather Risk</span>`;
        extra = "<p>Recording may not occur due to weather conditions.</p>";
      }

      if (e.status === "cancelled") {
        statusLabel = `<span class="status cancelled">Cancelled</span>`;
        extra = `<p>Reason: ${e.reason}</p>`;
      }

      return `
      <div class="event-card">
        <h3>${e.title}</h3>
        <p>${e.time}</p>
        ${statusLabel}
        ${extra}
      </div>
    `;
    })
    .join("");
}

renderCalendar();

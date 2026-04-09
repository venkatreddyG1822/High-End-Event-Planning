const body = document.body;
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const sidebarLinks = document.querySelectorAll(".sidebar-link");
const sections = document.querySelectorAll(".dashboard-section");
const profileToggle = document.getElementById("profileToggle");
const profileDropdown = document.getElementById("profileDropdown");
const logoutLinks = document.querySelectorAll("[data-logout]");
const themeToggle = document.getElementById("themeToggle");
const rtlToggle = document.getElementById("rtlToggle");
const progressCanvas = document.getElementById("progressChart");
const budgetCanvas = document.getElementById("budgetChart");
const eventsCanvas = document.getElementById("eventsChart");
const moodboardCanvas = document.getElementById("moodboardChart");
const vendorsCanvas = document.getElementById("vendorsChart");
const timelineCanvas = document.getElementById("timelineChart");
const messagesCanvas = document.getElementById("messagesChart");
const settingsCanvas = document.getElementById("settingsChart");
const reportsCanvas = document.getElementById("reportsChart");
let progressChart = null;
let budgetChart = null;
let eventsChart = null;
let moodboardChart = null;
let vendorsChart = null;
let timelineChart = null;
let messagesChart = null;
let settingsChart = null;
let reportsChart = null;

const closeSidebar = () => {
  body.classList.remove("sidebar-open");
};

if (sidebarToggle) {
  sidebarToggle.addEventListener("click", () => {
    body.classList.toggle("sidebar-open");
  });
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener("click", closeSidebar);
}

const switchSection = (targetId) => {
  const current = document.querySelector(".dashboard-section.active");
  const next = document.getElementById(targetId);
  if (!next || current === next) return;

  current.classList.add("is-hiding");
  next.classList.add("active");

  window.setTimeout(() => {
    current.classList.remove("active", "is-hiding");
  }, 350);
};

sidebarLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const target = link.dataset.section;
    if (!target) return;
    sidebarLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
    switchSection(target);
    closeSidebar();
  });
});

const setTheme = (mode) => {
  if (!themeToggle) return;
  const icon = themeToggle.querySelector("i");
  if (mode === "dark") {
    body.classList.add("dark-mode");
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
    themeToggle.setAttribute("aria-pressed", "true");
  } else {
    body.classList.remove("dark-mode");
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
    themeToggle.setAttribute("aria-pressed", "false");
  }
};

const createCharts = () => {
  if (typeof Chart === "undefined") return;
  if (progressChart) progressChart.destroy();
  if (budgetChart) budgetChart.destroy();
  if (eventsChart) eventsChart.destroy();
  if (moodboardChart) moodboardChart.destroy();
  if (vendorsChart) vendorsChart.destroy();
  if (timelineChart) timelineChart.destroy();
  if (messagesChart) messagesChart.destroy();
  if (settingsChart) settingsChart.destroy();
  if (reportsChart) reportsChart.destroy();

  const styles = getComputedStyle(document.body);
  const primary = styles.getPropertyValue("--primary-color").trim() || "#c6a46a";
  const secondary = styles.getPropertyValue("--secondary-color").trim() || "#1b1b1f";
  const accent = styles.getPropertyValue("--accent-color").trim() || "#f3ece2";
  const muted = body.classList.contains("dark-mode")
    ? "rgba(248, 244, 238, 0.15)"
    : "rgba(27, 27, 31, 0.2)";
  const soft = "rgba(198, 164, 106, 0.35)";

  Chart.defaults.font.family = '"Manrope", system-ui, -apple-system, sans-serif';
  Chart.defaults.color = secondary;

  if (progressCanvas) {
    const lineCtx = progressCanvas.getContext("2d");
    const gradient = lineCtx.createLinearGradient(0, 0, 0, 240);
    gradient.addColorStop(0, soft);
    gradient.addColorStop(1, "rgba(198, 164, 106, 0)");
    progressChart = new Chart(lineCtx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
          {
            data: [12, 22, 35, 48, 62, 74, 86],
            borderColor: primary,
            backgroundColor: gradient,
            fill: true,
            tension: 0.45,
            borderWidth: 2,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: muted } }
        }
      }
    });
  }

  if (budgetCanvas) {
    const donutCtx = budgetCanvas.getContext("2d");
    budgetChart = new Chart(donutCtx, {
      type: "doughnut",
      data: {
        labels: ["Venue", "Decor", "Catering", "Others"],
        datasets: [
          {
            data: [38, 26, 22, 14],
            backgroundColor: [primary, "rgba(198, 164, 106, 0.7)", accent, "rgba(27, 27, 31, 0.35)"],
            borderWidth: 0,
            hoverOffset: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } },
        cutout: "70%"
      }
    });
  }

  if (eventsCanvas) {
    eventsChart = new Chart(eventsCanvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            data: [2, 3, 4, 5, 6, 7],
            backgroundColor: "rgba(198, 164, 106, 0.6)",
            borderRadius: 10
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: muted } }
        }
      }
    });
  }

  if (moodboardCanvas) {
    moodboardChart = new Chart(moodboardCanvas.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: ["Florals", "Lighting", "Textiles", "Tabletop"],
        datasets: [
          {
            data: [32, 24, 26, 18],
            backgroundColor: [primary, accent, "rgba(198, 164, 106, 0.55)", "rgba(27, 27, 31, 0.35)"],
            borderWidth: 0,
            hoverOffset: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } },
        cutout: "70%"
      }
    });
  }

  if (vendorsCanvas) {
    vendorsChart = new Chart(vendorsCanvas.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: ["Confirmed", "Pending", "Review"],
        datasets: [
          {
            data: [18, 6, 4],
            backgroundColor: [primary, "rgba(198, 164, 106, 0.55)", "rgba(27, 27, 31, 0.35)"],
            borderWidth: 0,
            hoverOffset: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } },
        cutout: "70%"
      }
    });
  }

  if (timelineCanvas) {
    const timeCtx = timelineCanvas.getContext("2d");
    const timeGradient = timeCtx.createLinearGradient(0, 0, 0, 240);
    timeGradient.addColorStop(0, soft);
    timeGradient.addColorStop(1, "rgba(198, 164, 106, 0)");
    timelineChart = new Chart(timeCtx, {
      type: "line",
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
          {
            data: [40, 58, 72, 86],
            borderColor: primary,
            backgroundColor: timeGradient,
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: muted } }
        }
      }
    });
  }

  if (messagesCanvas) {
    const msgCtx = messagesCanvas.getContext("2d");
    messagesChart = new Chart(msgCtx, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            data: [4, 6, 3, 7, 5, 4, 6],
            borderColor: primary,
            backgroundColor: "rgba(198, 164, 106, 0.15)",
            fill: true,
            tension: 0.45,
            borderWidth: 2,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: muted } }
        }
      }
    });
  }

  if (settingsCanvas) {
    settingsChart = new Chart(settingsCanvas.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: ["Email", "SMS", "In-app", "Phone"],
        datasets: [
          {
            data: [40, 18, 28, 14],
            backgroundColor: [primary, "rgba(198, 164, 106, 0.7)", accent, "rgba(27, 27, 31, 0.35)"],
            borderWidth: 0,
            hoverOffset: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } },
        cutout: "70%"
      }
    });
  }

  if (reportsCanvas) {
    reportsChart = new Chart(reportsCanvas.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: ["Weddings", "Corporate", "Private", "Styling"],
        datasets: [
          {
            data: [42, 28, 20, 10],
            backgroundColor: [primary, "rgba(198, 164, 106, 0.7)", accent, "rgba(27, 27, 31, 0.35)"],
            borderWidth: 0,
            hoverOffset: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } },
        cutout: "70%"
      }
    });
  }
};

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
const storedTheme = localStorage.getItem("theme");

if (storedTheme) {
  setTheme(storedTheme);
} else {
  setTheme(prefersDark.matches ? "dark" : "light");
}

createCharts();

prefersDark.addEventListener("change", (event) => {
  if (!localStorage.getItem("theme")) {
    setTheme(event.matches ? "dark" : "light");
  }
});

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = body.classList.contains("dark-mode") ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    createCharts();
  });
}

const setRtl = (enabled) => {
  if (!rtlToggle) return;
  body.classList.toggle("rtl", enabled);
  rtlToggle.setAttribute("aria-pressed", enabled ? "true" : "false");
};

const storedRtl = localStorage.getItem("rtl") === "true";
setRtl(storedRtl);

if (rtlToggle) {
  rtlToggle.addEventListener("click", () => {
    const nextRtl = !body.classList.contains("rtl");
    setRtl(nextRtl);
    localStorage.setItem("rtl", nextRtl ? "true" : "false");
  });
}

if (profileToggle && profileDropdown) {
  profileToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = profileDropdown.classList.toggle("open");
    profileToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

logoutLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const target = link.getAttribute("href") || "login.html";
    if (profileDropdown) {
      profileDropdown.classList.remove("open");
    }
    window.location.href = target;
  });
});

document.addEventListener("click", (event) => {
  if (!profileDropdown) return;
  if (!profileDropdown.contains(event.target)) {
    profileDropdown.classList.remove("open");
    if (profileToggle) {
      profileToggle.setAttribute("aria-expanded", "false");
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSidebar();
    if (profileDropdown) {
      profileDropdown.classList.remove("open");
    }
  }
});

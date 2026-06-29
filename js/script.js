gsap.registerPlugin(ScrollTrigger);

/* Smooth Scroll - Lenis */

const lenis = new Lenis({
  duration: 1.35,
  smoothWheel: true,
  wheelMultiplier: 0.85,
  touchMultiplier: 1.5
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

/* Header Menu */

const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const menuLinks = document.querySelectorAll(".menu a");

let menuOpen = false;

if (header && menuToggle) {
  const getClosedHeaderHeight = () => (window.innerWidth <= 768 ? 72 : 90);
  const getOpenHeaderHeight = () => (window.innerWidth <= 768 ? 360 : 520);

  gsap.set(header, { height: getClosedHeaderHeight() });
  gsap.set(menuLinks, { x: 40, opacity: 0 });

  const menuTl = gsap.timeline({
    paused: true,
    defaults: { ease: "power3.out" }
  });

  menuTl
    .to(header, {
      height: getOpenHeaderHeight(),
      duration: 0.45
    })
    .to(
      menuLinks,
      {
        x: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.08
      },
      "-=0.15"
    );

  menuToggle.addEventListener("click", () => {
    menuOpen = !menuOpen;
    header.classList.toggle("open", menuOpen);
    menuOpen ? menuTl.play() : menuTl.reverse();
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuOpen = false;
      header.classList.remove("open");
      menuTl.reverse();
    });
  });

  window.addEventListener("resize", () => {
    if (!menuOpen) {
      gsap.set(header, { height: getClosedHeaderHeight() });
    }
  });
}

/* Hero Time Panel */

const skyPalettes = {
  sunrise: ["#439BF9", "#EAA663", "#FCD192", "#12306B", "#041442", "#050B1C"],
  morning: ["#77B7F7", "#2C8BF1", "#0F6BCE", "#12306B", "#041442", "#050B1C"],
  afternoon: ["#5145C0", "#A142C4", "#F06120", "#12306B", "#041442", "#050B1C"],
  night: ["#081F54", "#081F54", "#081F54", "#050B1C", "#050B1C", "#050B1C"]
};

const SUNRISE_HOUR = 6 + 18 / 60;
const SUNSET_HOUR = 19 + 57 / 60;

function getSkyMode(hours) {
  if (hours >= 6 && hours < 9) return "sunrise";
  if (hours >= 9 && hours < 12) return "morning";
  if (hours >= 12 && hours < 18) return "afternoon";
  return "night";
}

function formatTime(hourFloat) {
  const hour = Math.floor(hourFloat);
  const minute = Math.round((hourFloat - hour) * 60);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function initSunGraph() {
  const morningPath = document.getElementById("sunPathMorning");
  const afternoonPath = document.getElementById("sunPathAfternoon");

  [morningPath, afternoonPath].forEach((path) => {
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  });
}

function resetSunGraph() {
  const morningPath = document.getElementById("sunPathMorning");
  const afternoonPath = document.getElementById("sunPathAfternoon");
  const sunDot = document.getElementById("sunDot");

  [morningPath, afternoonPath].forEach((path) => {
    if (!path) return;

    const length = path.getTotalLength();

    gsap.to(path, {
      strokeDashoffset: length,
      duration: 0.8,
      ease: "power2.out",
      overwrite: true
    });
  });

  if (sunDot) {
    gsap.to(sunDot, {
      opacity: 0,
      duration: 0.3,
      overwrite: true
    });
  }
}

function placeSunDot(activePath, segmentProgress) {
  const sunDot = document.getElementById("sunDot");
  const graph = document.getElementById("sunGraph");

  if (!sunDot || !activePath || !graph) return;

  const pathLength = activePath.getTotalLength();
  const point = activePath.getPointAtLength(pathLength * segmentProgress);

  const x = (point.x / 1858) * 100;
  const y = (point.y / 552) * 100;

  gsap.to(sunDot, {
    left: `${x}%`,
    top: `${y}%`,
    opacity: 1,
    duration: 0.8,
    ease: "power2.out",
    overwrite: true
  });
}

function updateSunGraph(currentHour) {
  const morningPath = document.getElementById("sunPathMorning");
  const afternoonPath = document.getElementById("sunPathAfternoon");

  if (!morningPath || !afternoonPath) return;

  resetSunGraph();

  const morningLength = morningPath.getTotalLength();
  const afternoonLength = afternoonPath.getTotalLength();

  let activePath = null;
  let segmentProgress = 0;

  if (currentHour >= 6 && currentHour < 12) {
    activePath = morningPath;
    segmentProgress = (currentHour - 6) / 6;

    gsap.to(morningPath, {
      strokeDashoffset: morningLength * (1 - segmentProgress),
      duration: 0.8,
      ease: "power2.out",
      overwrite: true
    });
  }

  if (currentHour >= 12 && currentHour <= 18) {
    activePath = afternoonPath;
    segmentProgress = (currentHour - 12) / 6;

    gsap.to(morningPath, {
      strokeDashoffset: 0,
      duration: 0.8,
      ease: "power2.out",
      overwrite: true
    });

    gsap.to(afternoonPath, {
      strokeDashoffset: afternoonLength * (1 - segmentProgress),
      duration: 0.8,
      ease: "power2.out",
      overwrite: true
    });
  }

  if (!activePath) return;

  segmentProgress = Math.min(Math.max(segmentProgress, 0), 1);
  placeSunDot(activePath, segmentProgress);
}

function updateHeroTime() {
  const timeText = document.getElementById("timeText");
  const greetingText = document.getElementById("greetingText");
  const dateText = document.getElementById("dateText");
  const dayText = document.getElementById("dayText");
  const skyIcon = document.getElementById("skyIcon");
  const sunriseText = document.getElementById("sunriseText");
  const sunsetText = document.getElementById("sunsetText");
  const bars = document.querySelectorAll(".sky-bar");

  if (!timeText || !greetingText || !dateText || !dayText) return;

  const now = new Date();

  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const currentHour =
    hours + now.getMinutes() / 60 + now.getSeconds() / 3600;

  const isAM = hours < 12;
  const displayHour = hours % 12 || 12;

  const greeting =
    hours >= 5 && hours < 12
      ? "Good Morning"
      : hours >= 12 && hours < 17
      ? "Good Afternoon"
      : hours >= 17 && hours < 21
      ? "Good Evening"
      : "Good Night";

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");

  timeText.textContent = `${isAM ? "AM" : "PM"} ${String(displayHour).padStart(
    2,
    "0"
  )}:${minutes}:${seconds}`;

  greetingText.textContent = greeting;
  dateText.textContent = `${year}.${month}.${date}`;
  dayText.textContent = days[now.getDay()];

  const mode = getSkyMode(hours);
  const palette = skyPalettes[mode];

  bars.forEach((bar, index) => {
    gsap.to(bar, {
      "--bar-color": palette[index],
      duration: 1.2,
      ease: "power2.out"
    });
  });

  palette.forEach((color, index) => {
    const item = document.getElementById(`palette0${index + 1}`);
    if (item) item.textContent = color;
  });

  if (skyIcon) {
    skyIcon.textContent = mode === "night" ? "🌙" : "☀️";
  }

  if (sunriseText) sunriseText.textContent = formatTime(SUNRISE_HOUR);
  if (sunsetText) sunsetText.textContent = formatTime(SUNSET_HOUR);

  updateSunGraph(currentHour);
}

initSunGraph();
updateHeroTime();
setInterval(updateHeroTime, 1000);
window.addEventListener("resize", updateHeroTime);

/* Hero Entrance Animation */

if (document.querySelector(".sky-stage")) {
  gsap.from(".sky-bar", {
    opacity: 0,
    duration: 0.8,
    stagger: 0.08,
    ease: "power2.out"
  });

  gsap.from(".sky-divider", {
    scaleX: 0,
    transformOrigin: "left center",
    duration: 0.9,
    ease: "power3.out",
    delay: 0.25
  });

  gsap.from(".sun-path-base, .sun-path-active", {
    opacity: 0,
    duration: 0.9,
    ease: "power2.out",
    delay: 0.35
  });

  gsap.from(".sun-dot", {
    scale: 0,
    opacity: 0,
    duration: 0.6,
    ease: "back.out(1.7)",
    delay: 0.75
  });

  gsap.from(".hero-panel", {
    opacity: 0,
    x: 24,
    duration: 0.8,
    ease: "power3.out",
    delay: 0.85
  });
}

/* List Card Animation */

if (document.querySelector(".projects-grid")) {
  gsap.from(".projects-grid .card", {
    scrollTrigger: {
      trigger: ".projects-grid",
      start: "top 80%",
      once: true
    },
    opacity: 0,
    y: 80,
    duration: 0.8,
    stagger: 0.08,
    ease: "power3.out"
  });
}

if (document.querySelector(".thinking-grid")) {
  gsap.from(".thinking-grid .card", {
    scrollTrigger: {
      trigger: ".thinking-grid",
      start: "top 80%",
      once: true
    },
    opacity: 0,
    y: 80,
    duration: 0.8,
    stagger: 0.08,
    ease: "power3.out"
  });
}

/* Footer Animation */

if (document.querySelector(".footer")) {
  gsap.fromTo(
    ".footer-copy, .footer-bottom",
    {
      opacity: 0,
      y: 40
    },
    {
      scrollTrigger: {
        trigger: ".footer",
        start: "top 75%",
        once: true
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out"
    }
  );
}

/* Number Counter */

if (document.querySelector(".number-list")) {
  document.querySelectorAll(".counter").forEach((counter, index) => {
    const target = Number(counter.dataset.count);
    const obj = { value: 0 };

    if (!target) return;

    gsap.to(obj, {
      value: target,
      duration: 1.8,
      delay: index * 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".number-list",
        start: "top 80%",
        once: true
      },
      onUpdate() {
        counter.textContent = Math.floor(obj.value);
      }
    });
  });
}
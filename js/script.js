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

  gsap.set(header, {
    height: getClosedHeaderHeight()
  });

  gsap.set(menuLinks, {
    x: 40,
    opacity: 0
  });

  const menuTl = gsap.timeline({
    paused: true,
    defaults: {
      ease: "power3.out"
    }
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

    if (menuOpen) {
      menuTl.play();
    } else {
      menuTl.reverse();
    }
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
      gsap.set(header, {
        height: getClosedHeaderHeight()
      });
    }
  });
}

/* Hero Time Panel */

function updateHeroTime() {
  const timeText = document.getElementById("timeText");
  const greetingText = document.getElementById("greetingText");
  const dateText = document.getElementById("dateText");
  const dayText = document.getElementById("dayText");

  if (!timeText || !greetingText || !dateText || !dayText) return;

  const now = new Date();

  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

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
}

updateHeroTime();
setInterval(updateHeroTime, 1000);

/* Hero Palette Bar Interaction */

const paletteBars = document.querySelectorAll(".palette-bar");

paletteBars.forEach((bar) => {
  bar.addEventListener("click", async () => {
    const color =
      bar.dataset.color ||
      getComputedStyle(bar).getPropertyValue("--color").trim();

    if (!color) return;

    try {
      await navigator.clipboard.writeText(color);

      bar.classList.add("copied");

      setTimeout(() => {
        bar.classList.remove("copied");
      }, 900);
    } catch (error) {
      console.warn("Clipboard copy failed:", error);
    }
  });
});

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
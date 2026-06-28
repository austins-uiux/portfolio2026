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

gsap.set(header, {
  height: window.innerWidth <= 768 ? 72 : 90
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
    height: window.innerWidth <= 768 ? 360 : 520,
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

gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll(".counter").forEach((counter, index) => {
    const obj = { value: 0 };

    gsap.to(obj, {
        value: Number(counter.dataset.count),
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
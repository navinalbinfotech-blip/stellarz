const canvas = document.querySelector("#starfield");
const ctx = canvas.getContext("2d");
let stars = [];

function buildStars() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  stars = Array.from({ length: Math.floor(window.innerWidth / 4) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 1.3 + 0.15,
    alpha: Math.random() * 0.7 + 0.15,
    speed: Math.random() * 0.08 + 0.02
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  stars.forEach((star) => {
    star.y += star.speed;
    if (star.y > window.innerHeight) star.y = 0;
    ctx.fillStyle = `rgba(210, 232, 255, ${star.alpha})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}

buildStars();
drawStars();
window.addEventListener("resize", buildStars);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
  revealObserver.observe(item);
});

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.count);
    const duration = 1100;
    const start = performance.now();
    const tick = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      element.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(element);
  });
}, { threshold: 0.6 });

document.querySelectorAll("[data-count]").forEach((counter) => countObserver.observe(counter));

const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.classList.toggle("open");
  mobileNav.classList.toggle("open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  document.body.style.overflow = isOpen ? "hidden" : "";
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton.classList.remove("open");
    mobileNav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  });
});

const form = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = new FormData(form).get("email");
  formStatus.textContent = `Thanks. We'll reach out to ${email}.`;
  form.reset();
});

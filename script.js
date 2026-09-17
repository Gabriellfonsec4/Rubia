"use strict";

const header = document.querySelector(".header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a");

const updateHeader = () =>
  header.classList.toggle("scrolled", window.scrollY > 24);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

function closeMenu() {
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  nav.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const willOpen = !nav.classList.contains("open");
  menuToggle.classList.toggle("active", willOpen);
  menuToggle.setAttribute("aria-expanded", String(willOpen));
  menuToggle.setAttribute(
    "aria-label",
    willOpen ? "Fechar menu" : "Abrir menu",
  );
  nav.classList.toggle("open", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("resize", () => {
  if (window.innerWidth > 860) closeMenu();
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -45px" },
);

document
  .querySelectorAll(".reveal")
  .forEach((element) => revealObserver.observe(element));

const filterButtons = document.querySelectorAll(".filter-button");
const treatmentCards = document.querySelectorAll(".treatment-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    treatmentCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

document.querySelectorAll(".accordion-item").forEach((item) => {
  const button = item.querySelector("button");
  const panel = item.querySelector(".accordion-panel");

  if (item.classList.contains("active"))
    panel.style.maxHeight = `${panel.scrollHeight}px`;

  button.addEventListener("click", () => {
    const isOpen = item.classList.contains("active");

    document.querySelectorAll(".accordion-item").forEach((other) => {
      other.classList.remove("active");
      other.querySelector("button").setAttribute("aria-expanded", "false");
      other.querySelector(".accordion-panel").style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add("active");
      button.setAttribute("aria-expanded", "true");
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    }
  });
});

const testimonials = [...document.querySelectorAll(".testimonial")];
const dotsContainer = document.querySelector(".slider-dots");
let testimonialIndex = 0;
let testimonialTimer;

testimonials.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = `slider-dot${index === 0 ? " active" : ""}`;
  dot.setAttribute("aria-label", `Exibir depoimento ${index + 1}`);
  dot.addEventListener("click", () => showTestimonial(index));
  dotsContainer.appendChild(dot);
});

function showTestimonial(index) {
  testimonialIndex = (index + testimonials.length) % testimonials.length;
  testimonials.forEach((item, itemIndex) =>
    item.classList.toggle("active", itemIndex === testimonialIndex),
  );
  dotsContainer
    .querySelectorAll(".slider-dot")
    .forEach((dot, dotIndex) =>
      dot.classList.toggle("active", dotIndex === testimonialIndex),
    );
  restartTestimonialTimer();
}

function restartTestimonialTimer() {
  window.clearInterval(testimonialTimer);
  testimonialTimer = window.setInterval(
    () => showTestimonial(testimonialIndex + 1),
    6500,
  );
}

document
  .querySelector(".slider-prev")
  .addEventListener("click", () => showTestimonial(testimonialIndex - 1));
document
  .querySelector(".slider-next")
  .addEventListener("click", () => showTestimonial(testimonialIndex + 1));
restartTestimonialTimer();

const modal = document.querySelector(".image-modal");
const modalImage = modal.querySelector("img");
const modalCaption = modal.querySelector("figcaption");
const modalClose = modal.querySelector(".modal-close");
let lastFocusedElement;

function openModal(item) {
  lastFocusedElement = item;
  modalImage.src = item.dataset.image;
  modalImage.alt = item.querySelector("img").alt;
  modalCaption.textContent = item.dataset.caption;
  modal.hidden = false;
  document.body.classList.add("modal-open");
  modalClose.focus();
}

function closeModal() {
  modal.hidden = true;
  modalImage.src = "";
  document.body.classList.remove("modal-open");
  lastFocusedElement?.focus();
}

document
  .querySelectorAll(".result-item")
  .forEach((item) => item.addEventListener("click", () => openModal(item)));
modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeModal();
});

const bookingForm = document.querySelector("#booking-form");
bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(bookingForm);
  const name = data.get("name").trim();
  const service = data.get("service");
  const period = data.get("period");
  const message = data.get("message").trim();

  const text = [
    `Olá, Rubia! Meu nome é ${name}.`,
    `Gostaria de solicitar uma avaliação para: ${service}.`,
    `Prefiro atendimento no período da ${period.toLowerCase()}.`,
    message ? `O que estou buscando: ${message}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  window.open(
    `https://wa.me/5514996533566?text=${encodeURIComponent(text)}`,
    "_blank",
    "noopener,noreferrer",
  );
});

document.querySelector("#year").textContent = new Date().getFullYear();

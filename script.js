"use strict";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetSelector = anchor.getAttribute("href");
    if (!targetSelector || targetSelector === "#") {
      return;
    }

    const target = document.querySelector(targetSelector);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
      block: "start"
    });
  });
});

const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".menu a").forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentPage) {
    link.classList.add("is-active");
  }
});

const externalRedirectUrl = document.body.dataset.externalRedirectUrl;
const externalRedirectDelay = Number(document.body.dataset.externalRedirectDelay || 0);
const redirectCountdown = document.getElementById("redirectCountdown");

if (externalRedirectUrl && externalRedirectDelay > 0) {
  let remainingSeconds = Math.ceil(externalRedirectDelay / 1000);
  if (redirectCountdown) {
    redirectCountdown.textContent = String(remainingSeconds);
  }

  const countdownInterval = window.setInterval(() => {
    remainingSeconds -= 1;
    if (redirectCountdown && remainingSeconds >= 0) {
      redirectCountdown.textContent = String(remainingSeconds);
    }

    if (remainingSeconds <= 0) {
      window.clearInterval(countdownInterval);
    }
  }, 1000);

  window.setTimeout(() => {
    window.location.href = externalRedirectUrl;
  }, externalRedirectDelay);
}

const contactForm = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const requiredFields = contactForm.querySelectorAll("[required]");
    let hasErrors = false;

    requiredFields.forEach((field) => {
      const input = field;
      const isValid = input.value.trim().length > 0 && input.checkValidity();
      input.setAttribute("aria-invalid", isValid ? "false" : "true");
      if (!isValid) {
        hasErrors = true;
      }
    });

    if (hasErrors) {
      if (formFeedback) {
        formFeedback.classList.add("is-error");
        formFeedback.textContent =
          "Merci de compléter tous les champs avec des informations valides.";
      }
      return;
    }

    if (formFeedback) {
      formFeedback.classList.remove("is-error");
      formFeedback.textContent =
        "Message envoyé. Merci, je reviens vers vous très rapidement.";
    }

    contactForm.reset();
  });
}

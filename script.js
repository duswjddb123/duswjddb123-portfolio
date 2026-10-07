const header = document.querySelector("[data-header]");
const toggle = document.querySelector("[data-nav-toggle]");
const mobileNav = document.querySelector("#mobile-nav");
const navLabel = document.querySelector("[data-nav-label]");
const form = document.querySelector("[data-form]");
const formFields = document.querySelector("[data-form-fields]");
const formSuccess = document.querySelector("[data-form-success]");
const successTitle = document.querySelector("[data-success-title]");
const successCopy = document.querySelector("[data-success-copy]");
const resetButton = document.querySelector("[data-form-reset]");
const messageInput = document.querySelector("#message");
const desktopQuery = window.matchMedia("(min-width: 800px)");

mobileNav.inert = true;

function setMenu(open) {
  toggle.setAttribute("aria-expanded", String(open));
  navLabel.textContent = open ? "메뉴 닫기" : "메뉴 열기";
  mobileNav.classList.toggle("is-open", open);
  mobileNav.inert = !open;

  if (open) {
    const firstLink = mobileNav.querySelector("a");
    firstLink?.focus();
  }
}

toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  setMenu(!open);
  if (open) toggle.focus();
});

mobileNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    toggle.focus();
  }
});

desktopQuery.addEventListener("change", (event) => {
  if (event.matches) setMenu(false);
});

function onScroll() {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
}

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const sections = ["work", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);
const navLinks = [...document.querySelectorAll(".nav-desktop a")];

if ("IntersectionObserver" in window && sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll(".reveal").forEach((card) => revealObserver.observe(card));
} else {
  document.querySelectorAll(".reveal").forEach((card) => card.classList.add("is-in"));
}

document.querySelectorAll("[data-project]").forEach((button) => {
  button.addEventListener("click", () => {
    const project = button.dataset.project;
    messageInput.value = `「${project}」 작업이 궁금해서 연락드려요.\n`;
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => messageInput.focus(), 350);
  });
});

const fields = [
  {
    input: document.querySelector("#name"),
    error: document.querySelector("#name-error"),
    validate(value) {
      if (value.length < 2) return "이름을 두 글자 이상 입력해 주세요.";
      return "";
    },
  },
  {
    input: document.querySelector("#email"),
    error: document.querySelector("#email-error"),
    validate(value) {
      if (!value) return "이메일을 입력해 주세요.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "이메일 형식을 확인해 주세요.";
      return "";
    },
  },
  {
    input: messageInput,
    error: document.querySelector("#message-error"),
    validate(value) {
      if (value.length < 10) return "메시지는 10자 이상 적어 주세요.";
      return "";
    },
  },
];

function showError(field, message) {
  field.error.textContent = message;
  field.input.setAttribute("aria-invalid", message ? "true" : "false");
}

fields.forEach((field) => {
  field.input.addEventListener("input", () => showError(field, ""));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let firstInvalid = null;

  fields.forEach((field) => {
    const message = field.validate(field.input.value.trim());
    showError(field, message);
    if (message && !firstInvalid) firstInvalid = field.input;
  });

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  const name = fields[0].input.value.trim();
  successCopy.textContent = `${name} 님, 따뜻한 답장을 준비할게요.`;
  formFields.hidden = true;
  formSuccess.hidden = false;
  successTitle.focus();
});

resetButton.addEventListener("click", () => {
  form.reset();
  fields.forEach((field) => showError(field, ""));
  formSuccess.hidden = true;
  formFields.hidden = false;
  fields[0].input.focus();
});

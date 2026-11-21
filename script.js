// Sanaa Henna Academy — front-end demo
// Replace this number with the academy's real WhatsApp number (international format, digits only).
const WHATSAPP_NUMBER = "212600000000";
const whatsappBase = `https://wa.me/${WHATSAPP_NUMBER}`;
const setWhatsApp = (id, message) => {
  const el = document.getElementById(id);
  if (el) el.href = `${whatsappBase}?text=${encodeURIComponent(message)}`;
};
setWhatsApp("whatsappInline", "Bonjour Sanaa Henna Academy, je souhaite avoir des informations sur vos formations.");
setWhatsApp("whatsappFooter", "Bonjour, je souhaite contacter Sanaa Henna Academy.");
setWhatsApp("whatsappFloat", "Bonjour Sanaa Henna Academy, je souhaite avoir plus d'informations.");

document.getElementById("year").textContent = new Date().getFullYear();

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const opened = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(opened));
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

// Scroll reveal, with a graceful fallback for older browsers.
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
}

// Course category filters
document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const selected = button.dataset.filter;
    document.querySelectorAll(".course-card").forEach(card => {
      card.hidden = selected !== "all" && card.dataset.level !== selected;
    });
  });
});

// Course details modal
const courseData = {
  basics: { title: "Les premiers gestes", description: "Un parcours d'initiation pour découvrir les outils et acquérir des gestes de base avec méthode.", modules: ["Découvrir le matériel et les règles de préparation", "Prendre en main le cône et contrôler le trait", "S'exercer aux lignes, points et formes simples", "Composer un premier motif guidé"] },
  motifs: { title: "Motifs & harmonie", description: "Explorer les éléments décoratifs et apprendre à organiser une composition harmonieuse.", modules: ["Réviser les motifs fondamentaux", "Dessiner des fleurs et feuillages stylisés", "Explorer les répétitions et les symétries", "Créer des transitions entre les motifs", "Composer un dessin équilibré"] },
  signature: { title: "Créer sa signature", description: "Un parcours avancé de démonstration autour de la recherche créative et de la cohérence d'un style personnel.", modules: ["Analyser les références et les influences", "Construire une composition complexe", "Travailler le rythme et les espaces", "Développer une bibliothèque de motifs", "Créer une composition originale", "Présenter son univers artistique"] }
};
const courseModal = document.getElementById("courseModal");
document.querySelectorAll("[data-open]").forEach(button => {
  button.addEventListener("click", () => {
    const data = courseData[button.dataset.open];
    if (!data) return;
    document.getElementById("modalTitle").textContent = data.title;
    document.getElementById("modalDescription").textContent = data.description;
    const list = document.getElementById("modalModules");
    list.replaceChildren(...data.modules.map(module => {
      const li = document.createElement("li"); li.textContent = module; return li;
    }));
    courseModal.classList.add("open");
    courseModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});
function closeCourseModal() {
  courseModal.classList.remove("open");
  courseModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
courseModal.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", closeCourseModal));
document.getElementById("modalRegister").addEventListener("click", closeCourseModal);

// Gallery lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImage = lightbox.querySelector("img");
document.querySelectorAll(".gallery-item").forEach(item => {
  item.addEventListener("click", () => {
    lightboxImage.src = item.dataset.image;
    lightboxImage.alt = item.querySelector("img").alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = "";
}
lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", event => {
  if (event.key === "Escape") { closeCourseModal(); closeLightbox(); }
});

// Registration: browser validation + WhatsApp handoff (no data is stored or sent to a server).
const form = document.getElementById("registrationForm");
const feedback = document.getElementById("formFeedback");
form.addEventListener("submit", event => {
  event.preventDefault();
  feedback.textContent = "";
  feedback.className = "form-feedback";
  if (!form.reportValidity()) {
    feedback.textContent = "Veuillez vérifier les champs obligatoires et réessayer.";
    feedback.classList.add("error");
    return;
  }
  const data = new FormData(form);
  const message = [
    "Bonjour Sanaa Henna Academy, je souhaite demander des informations.",
    `Nom : ${data.get("fullName")}`,
    `E-mail : ${data.get("email")}`,
    `Téléphone : ${data.get("phone")}`,
    `Niveau : ${data.get("level")}`,
    `Formation : ${data.get("program")}`,
    `Message : ${data.get("message") || "Non renseigné"}`
  ].join("\\n");
  feedback.textContent = "Votre demande est prête. WhatsApp va s'ouvrir pour vous permettre de l'envoyer.";
  feedback.classList.add("success");
  const url = `${whatsappBase}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});
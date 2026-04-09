const body = document.body;
const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const primaryNav = document.getElementById("primaryNav");
const themeToggle = document.getElementById("themeToggle");
const rtlToggle = document.getElementById("rtlToggle");
const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 8);
};

const closeDropdowns = (except = null) => {
  dropdownToggles.forEach((toggle) => {
    const item = toggle.closest(".has-dropdown");
    if (!item || item === except) return;
    item.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
};

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

const setRtl = (enabled) => {
  if (!rtlToggle) return;
  body.classList.toggle("rtl", enabled);
  rtlToggle.setAttribute("aria-pressed", enabled ? "true" : "false");
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (navToggle && primaryNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    if (!isOpen) {
      closeDropdowns();
    }
  });
}

dropdownToggles.forEach((toggle) => {
  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    const item = toggle.closest(".has-dropdown");
    if (!item) return;
    const willOpen = !item.classList.contains("open");
    closeDropdowns(item);
    item.classList.toggle("open", willOpen);
    toggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
  });
});

document.addEventListener("click", (event) => {
  const clickedInsideNav = event.target.closest(".nav");
  const clickedHamburger = event.target.closest(".hamburger");
  if (!clickedInsideNav && !clickedHamburger) {
    closeDropdowns();
    body.classList.remove("nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
    }
  }
});

const storedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

if (storedTheme) {
  setTheme(storedTheme);
} else {
  setTheme(prefersDark.matches ? "dark" : "light");
}

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
  });
}

const storedRtl = localStorage.getItem("rtl") === "true";
setRtl(storedRtl);

if (rtlToggle) {
  rtlToggle.addEventListener("click", () => {
    const nextRtl = !body.classList.contains("rtl");
    setRtl(nextRtl);
    localStorage.setItem("rtl", nextRtl ? "true" : "false");
  });
}

const markActiveNav = () => {
  const path = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav a");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    const cleanHref = href.split("#")[0].split("?")[0];
    if (cleanHref === path) {
      link.classList.add("active");
      const parentDropdown = link.closest(".has-dropdown");
      if (parentDropdown) {
        const toggle = parentDropdown.querySelector(".dropdown-toggle");
        if (toggle) {
          toggle.classList.add("active");
        }
      }
    }
  });
};

markActiveNav();

const heroMedia = document.querySelector(".hero-media");
const ctaMedia = document.querySelector(".cta-media");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let parallaxTicking = false;

const updateParallax = () => {
  if (prefersReducedMotion.matches) return;
  if (heroMedia) {
    const offset = window.scrollY * 0.18;
    heroMedia.style.transform = `translate3d(0, ${offset}px, 0) scale(1.08)`;
  }
  if (ctaMedia) {
    const offset = window.scrollY * 0.12;
    ctaMedia.style.transform = `translate3d(0, ${offset}px, 0) scale(1.07)`;
  }
};

const onParallaxScroll = () => {
  if (parallaxTicking) return;
  parallaxTicking = true;
  window.requestAnimationFrame(() => {
    updateParallax();
    parallaxTicking = false;
  });
};

updateParallax();
window.addEventListener("scroll", onParallaxScroll, { passive: true });

const backToTop = document.querySelector(".back-to-top");

const toggleBackToTop = () => {
  if (!backToTop) return;
  backToTop.classList.toggle("show", window.scrollY > 520);
};

toggleBackToTop();
window.addEventListener("scroll", toggleBackToTop, { passive: true });

if (backToTop) {
  backToTop.addEventListener("click", () => {
    const behavior = prefersReducedMotion.matches ? "auto" : "smooth";
    window.scrollTo({ top: 0, behavior });
  });
}

const revealElements = document.querySelectorAll("[data-reveal], .reveal");
if (revealElements.length > 0) {
  body.classList.add("has-reveal");
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioCards = document.querySelectorAll(".portfolio-card");

if (filterButtons.length > 0 && portfolioCards.length > 0) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;

      portfolioCards.forEach((card) => {
        const categories = card.dataset.category ? card.dataset.category.split(" ") : [];
        const matches = filter === "all" || categories.includes(filter);

        if (matches) {
          card.classList.remove("is-removed");
          requestAnimationFrame(() => {
            card.classList.remove("is-hidden");
          });
        } else {
          card.classList.add("is-hidden");
          window.setTimeout(() => {
            card.classList.add("is-removed");
          }, 280);
        }
      });
    });
  });
}

const testimonialSlides = document.querySelectorAll(".testimonial-slide");
const testimonialDots = document.querySelectorAll(".testimonial-dots .dot");
const testimonialPrev = document.querySelector(".testimonial-nav.prev");
const testimonialNext = document.querySelector(".testimonial-nav.next");
let testimonialIndex = 0;
let testimonialTimer = null;

const setTestimonial = (index) => {
  if (testimonialSlides.length === 0) return;
  testimonialSlides.forEach((slide, idx) => {
    slide.classList.toggle("is-active", idx === index);
  });
  testimonialDots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === index);
  });
  testimonialIndex = index;
};

const nextTestimonial = () => {
  const nextIndex = (testimonialIndex + 1) % testimonialSlides.length;
  setTestimonial(nextIndex);
};

const prevTestimonial = () => {
  const prevIndex = (testimonialIndex - 1 + testimonialSlides.length) % testimonialSlides.length;
  setTestimonial(prevIndex);
};

const startTestimonialAuto = () => {
  if (testimonialSlides.length < 2) return;
  testimonialTimer = window.setInterval(nextTestimonial, 7000);
};

const resetTestimonialAuto = () => {
  if (testimonialTimer) {
    window.clearInterval(testimonialTimer);
  }
  startTestimonialAuto();
};

if (testimonialSlides.length > 0) {
  setTestimonial(0);
  startTestimonialAuto();
}

if (testimonialPrev && testimonialNext) {
  testimonialPrev.addEventListener("click", () => {
    prevTestimonial();
    resetTestimonialAuto();
  });
  testimonialNext.addEventListener("click", () => {
    nextTestimonial();
    resetTestimonialAuto();
  });
}

testimonialDots.forEach((dot, idx) => {
  dot.addEventListener("click", () => {
    setTestimonial(idx);
    resetTestimonialAuto();
  });
});
// reveal (same style as homepage 1)
const heroSaas = document.querySelector(".hero-saas");

window.addEventListener("scroll", () => {
  const rect = heroSaas.getBoundingClientRect();
  if(rect.top < window.innerHeight - 100){
    heroSaas.classList.add("show");
  }
});

// parallax
document.addEventListener("mousemove", (e)=>{
  const x = (e.clientX / window.innerWidth - 0.5) * 15;
  const y = (e.clientY / window.innerHeight - 0.5) * 15;

  const card = document.querySelector(".dashboard-card");
  if(card){
    card.style.transform = `translate(${x}px, ${y}px)`;
  }
});
// reveal + progress animation
const workflow = document.querySelector(".workflow");

window.addEventListener("scroll", () => {
  const rect = workflow.getBoundingClientRect();
  if(rect.top < window.innerHeight - 100){
    workflow.classList.add("show");
  }
});

// step highlight animation
const steps = document.querySelectorAll(".step");

let current = 0;

function activateStep(){
  if(current < steps.length){
    steps[current].classList.add("active");
    current++;
  }
}

setInterval(activateStep, 1200);

// reveal animation (reuse pattern)
const whySection = document.querySelector(".why-choose");

window.addEventListener("scroll", () => {
  const rect = whySection.getBoundingClientRect();
  if(rect.top < window.innerHeight - 100){
    whySection.classList.add("show");
  }
});
// reveal animation
const aboutHero = document.querySelector(".about-hero");

window.addEventListener("scroll", () => {
  const rect = aboutHero.getBoundingClientRect();
  if(rect.top < window.innerHeight - 100){
    aboutHero.classList.add("show");
  }
});

// subtle zoom effect
window.addEventListener("load",()=>{
  document.querySelector(".about-hero-bg").style.transform = "scale(1.1)";
});
// reveal animation
const brandStory = document.querySelector(".brand-story");

window.addEventListener("scroll", () => {
  const rect = brandStory.getBoundingClientRect();
  if(rect.top < window.innerHeight - 100){
    brandStory.classList.add("show");
  }
});
// reveal animation
const journeySection = document.querySelector(".journey");

window.addEventListener("scroll", () => {
  const rect = journeySection.getBoundingClientRect();
  if(rect.top < window.innerHeight - 100){
    journeySection.classList.add("show");
  }
});
// counter animation
const counters = document.querySelectorAll(".counter");

const runCounter = () => {
  counters.forEach(counter => {
    const target = +counter.getAttribute("data-target");
    let count = 0;
    const increment = target / 100;
    const suffix = counter.querySelector(".stat-plus");

    const setValue = (value) => {
      const textValue = Math.ceil(value).toString();
      if (suffix) {
        const textNode = Array.from(counter.childNodes).find(
          (node) => node.nodeType === Node.TEXT_NODE
        );
        if (textNode) {
          textNode.nodeValue = textValue;
        } else {
          counter.insertBefore(document.createTextNode(textValue), counter.firstChild);
        }
      } else {
        counter.textContent = textValue;
      }
    };

    const update = () => {
      count += increment;
      if(count < target){
        setValue(count);
        requestAnimationFrame(update);
      } else {
        setValue(target);
      }
    };

    update();
  });
};

// trigger on scroll
const statsSection = document.querySelector(".stats");

window.addEventListener("scroll", () => {
  const rect = statsSection.getBoundingClientRect();
  if(rect.top < window.innerHeight - 100){
    runCounter();
  }
});
// reveal animation
const servicesHero = document.querySelector(".services-hero");

window.addEventListener("scroll", () => {
  const rect = servicesHero.getBoundingClientRect();
  if(rect.top < window.innerHeight - 100){
    servicesHero.classList.add("show");
  }
});

// subtle zoom effect
window.addEventListener("load",()=>{
  document.querySelector(".services-hero-bg").style.transform = "scale(1.1)";
});
// reveal animation
const serviceDetail = document.querySelector(".service-detail");

window.addEventListener("scroll", () => {
  const rect = serviceDetail.getBoundingClientRect();
  if(rect.top < window.innerHeight - 100){
    serviceDetail.classList.add("show");
  }
});
// reveal animation
const processSection = document.querySelector(".process");

window.addEventListener("scroll", () => {
  const rect = processSection.getBoundingClientRect();
  if(rect.top < window.innerHeight - 100){
    processSection.classList.add("show");
  }
});
// reveal animation
const ctaService = document.querySelector(".cta-service");

window.addEventListener("scroll", () => {
  const rect = ctaService.getBoundingClientRect();
  if(rect.top < window.innerHeight - 100){
    ctaService.classList.add("show");
  }
});

// subtle zoom
window.addEventListener("load",()=>{
  document.querySelector(".cta-service-bg").style.transform = "scale(1.1)";
});
// reveal animation
const pricingHero = document.querySelector(".pricing-hero");

window.addEventListener("scroll", () => {
  const rect = pricingHero.getBoundingClientRect();
  if(rect.top < window.innerHeight - 100){
    pricingHero.classList.add("show");
  }
});
// reveal animation
const ctaFinal = document.querySelector(".cta-final");

window.addEventListener("scroll", () => {
  const rect = ctaFinal.getBoundingClientRect();
  if(rect.top < window.innerHeight - 100){
    ctaFinal.classList.add("show");
  }
});
// reveal animation
const contactHero = document.querySelector(".contact-hero");

window.addEventListener("scroll", () => {
  const rect = contactHero.getBoundingClientRect();
  if(rect.top < window.innerHeight - 100){
    contactHero.classList.add("show");
  }
});
// validation
document.querySelector(".contact-form").addEventListener("submit", function(e){
  e.preventDefault();

  let valid = true;

  this.querySelectorAll("input, textarea, select").forEach(field=>{
    const error = field.parentElement.querySelector(".error");

    if(!field.value){
      error.style.display="block";
      valid=false;
    }else{
      error.style.display="none";
    }
  });

  if(valid){
    alert("Form submitted successfully!");
    this.reset();
  }
});
const contactCTA = document.querySelector(".contact-cta");

window.addEventListener("scroll", () => {
  const rect = contactCTA.getBoundingClientRect();
  if(rect.top < window.innerHeight - 100){
    contactCTA.classList.add("show");
  }
});

// Theme Management System
class ThemeManager {
  constructor() {
    this.storageKey = "craftive-theme"
    this.init()
  }

  init() {
    // Initialize theme on page load
    this.applyTheme(this.getCurrentTheme())
    this.setupEventListeners()
    this.updateThemeIcons()
  }

  getCurrentTheme() {
    const savedTheme = localStorage.getItem(this.storageKey)
    if (savedTheme) {
      return savedTheme
    }

    // Check system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    return prefersDark ? "dark" : "light"
  }

  applyTheme(theme) {
    const html = document.documentElement

    if (theme === "dark") {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }

    // Save to localStorage
    localStorage.setItem(this.storageKey, theme)
    this.updateThemeIcons()
  }

  toggleTheme() {
    const currentTheme = this.getCurrentTheme()
    const newTheme = currentTheme === "dark" ? "light" : "dark"
    this.applyTheme(newTheme)
  }

  updateThemeIcons() {
    const currentTheme = this.getCurrentTheme()
    const desktopIcon = document.getElementById("theme-icon")
    const mobileIcon = document.getElementById("theme-icon-mobile")

    const icon = currentTheme === "dark" ? "☀️" : "🌙"

    if (desktopIcon) desktopIcon.textContent = icon
    if (mobileIcon) mobileIcon.textContent = icon
  }

  setupEventListeners() {
    // Desktop theme toggle
    const desktopToggle = document.getElementById("theme-toggle")
    if (desktopToggle) {
      desktopToggle.addEventListener("click", () => this.toggleTheme())
    }

    // Mobile theme toggle
    const mobileToggle = document.getElementById("theme-toggle-mobile")
    if (mobileToggle) {
      mobileToggle.addEventListener("click", () => this.toggleTheme())
    }

    // Listen for system theme changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      // Only apply system preference if no manual theme is set
      if (!localStorage.getItem(this.storageKey)) {
        this.applyTheme(e.matches ? "dark" : "light")
      }
    })
  }
}

// Mobile Navigation Management
class NavigationManager {
  constructor() {
    this.hamburger = document.getElementById("hamburger")
    this.mobileMenu = document.getElementById("mobile-menu")
    this.init()
  }

  init() {
    this.setupEventListeners()
  }

  setupEventListeners() {
    if (this.hamburger && this.mobileMenu) {
      this.hamburger.addEventListener("click", () => this.toggleMobileMenu())
    }

    // Close mobile menu when clicking on links
    const mobileLinks = this.mobileMenu?.querySelectorAll("a")
    mobileLinks?.forEach((link) => {
      link.addEventListener("click", () => this.closeMobileMenu())
    })

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (this.mobileMenu && !this.mobileMenu.contains(e.target) && !this.hamburger.contains(e.target)) {
        this.closeMobileMenu()
      }
    })
  }

  toggleMobileMenu() {
    this.hamburger.classList.toggle("open")
    this.mobileMenu.classList.toggle("hidden")
    this.mobileMenu.classList.toggle("flex")
    document.body.style.overflow = this.mobileMenu.classList.contains("flex") ? "hidden" : "auto"
  }

  closeMobileMenu() {
    this.hamburger.classList.remove("open")
    this.mobileMenu.classList.add("hidden")
    this.mobileMenu.classList.remove("flex")
    document.body.style.overflow = "auto"
  }
}

// Modal Management
class ModalManager {
  constructor() {
    this.modal = document.getElementById("imageModal")
    this.modalImg = document.getElementById("modalImg")
    this.modalCaption = document.getElementById("modalCaption")
    this.init()
  }

  init() {
    this.setupEventListeners()
  }

  setupEventListeners() {
    // Close modal when clicking outside or on close button
    if (this.modal) {
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal || e.target.classList.contains("close-modal")) {
          this.closeModal()
        }
      })
    }

    // Close modal with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !this.modal.classList.contains("hidden")) {
        this.closeModal()
      }
    })
  }

  openModal(src, caption) {
    if (this.modal && this.modalImg && this.modalCaption) {
      this.modalImg.src = src
      this.modalCaption.textContent = caption
      this.modal.classList.remove("hidden")
      this.modal.classList.add("flex")
      document.body.style.overflow = "hidden"
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.classList.add("hidden")
      this.modal.classList.remove("flex")
      document.body.style.overflow = "auto"
    }
  }
}

// Enhanced Accordion Management
class AccordionManager {
  constructor() {
    this.activeAccordion = null
    this.init()
  }

  init() {
    this.setupEventListeners()
    this.setupKeyboardNavigation()
  }

  setupEventListeners() {
    const faqHeaders = document.querySelectorAll(".faq-header")
    faqHeaders.forEach((header) => {
      header.addEventListener("click", (e) => {
        e.preventDefault()
        const targetId = header.getAttribute("data-target")
        this.toggleAccordion(targetId, header)
      })

      // Add hover effects
      header.addEventListener("mouseenter", () => {
        if (!header.classList.contains("active")) {
          header.style.transform = "translateX(5px)"
        }
      })

      header.addEventListener("mouseleave", () => {
        if (!header.classList.contains("active")) {
          header.style.transform = "translateX(0)"
        }
      })
    })
  }

  setupKeyboardNavigation() {
    const faqHeaders = document.querySelectorAll(".faq-header")
    faqHeaders.forEach((header, index) => {
      header.addEventListener("keydown", (e) => {
        switch (e.key) {
          case "Enter":
          case " ":
            e.preventDefault()
            const targetId = header.getAttribute("data-target")
            this.toggleAccordion(targetId, header)
            break
          case "ArrowDown":
            e.preventDefault()
            const nextHeader = faqHeaders[index + 1]
            if (nextHeader) nextHeader.focus()
            break
          case "ArrowUp":
            e.preventDefault()
            const prevHeader = faqHeaders[index - 1]
            if (prevHeader) prevHeader.focus()
            break
        }
      })
    })
  }

  toggleAccordion(targetId, header) {
    const content = document.getElementById(targetId)
    const icon = header.querySelector(".faq-icon")
    const isCurrentlyActive = header.classList.contains("active")

    // Close all other accordions with animation
    this.closeAllAccordions()

    if (!isCurrentlyActive) {
      // Open the clicked accordion
      this.openAccordion(header, content, icon)
      this.activeAccordion = targetId
    } else {
      // Close the clicked accordion if it was already open
      this.closeAccordion(header, content, icon)
      this.activeAccordion = null
    }
  }

  openAccordion(header, content, icon) {
    // Add active classes
    header.classList.add("active")
    content.classList.add("active")

    // Calculate the actual height needed
    const contentHeight = content.scrollHeight
    content.style.maxHeight = contentHeight + "px"

    // Add pulse animation to the FAQ item
    const faqItem = header.closest(".faq-item")
    faqItem.classList.add("pulse")
    setTimeout(() => faqItem.classList.remove("pulse"), 1500)

    // Smooth scroll to the FAQ item if it's not fully visible
    setTimeout(() => {
      const headerRect = header.getBoundingClientRect()
      const headerTop = window.pageYOffset + headerRect.top
      const headerHeight = document.querySelector("header")?.offsetHeight || 0

      if (headerRect.top < headerHeight) {
        window.scrollTo({
          top: headerTop - headerHeight - 20,
          behavior: "smooth",
        })
      }
    }, 100)
  }

  closeAccordion(header, content, icon) {
    header.classList.remove("active")
    content.classList.remove("active")
    content.style.maxHeight = "0px"
  }

  closeAllAccordions() {
    const allHeaders = document.querySelectorAll(".faq-header")
    const allContents = document.querySelectorAll(".faq-content")

    allHeaders.forEach((header) => {
      header.classList.remove("active")
      header.style.transform = "translateX(0)"
    })

    allContents.forEach((content) => {
      content.classList.remove("active")
      content.style.maxHeight = "0px"
    })
  }

  // Method to open specific FAQ (useful for deep linking)
  openSpecificFAQ(faqId) {
    const header = document.querySelector(`[data-target="${faqId}"]`)
    if (header) {
      const targetId = header.getAttribute("data-target")
      this.toggleAccordion(targetId, header)

      // Scroll to the FAQ
      setTimeout(() => {
        header.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 300)
    }
  }

  // Method to close all FAQs
  closeAll() {
    this.closeAllAccordions()
    this.activeAccordion = null
  }
}

// Smooth Scrolling
class ScrollManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupSmoothScrolling()
    this.setupScrollAnimations()
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault()
        const target = document.querySelector(anchor.getAttribute("href"))
        if (target) {
          const headerHeight = document.querySelector("header")?.offsetHeight || 0
          const targetPosition = target.offsetTop - headerHeight - 20

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })
        }
      })
    })
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate")
        }
      })
    }, observerOptions)

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
      ".service-card, .portfolio-item, .pricing-card, .testimonial-card",
    )
    animateElements.forEach((el) => {
      el.classList.add("scroll-animate")
      observer.observe(el)
    })
  }
}

// Global Functions (for backward compatibility)
function toggleMode() {
  window.themeManager?.toggleTheme()
}

function closeMobileMenu() {
  window.navigationManager?.closeMobileMenu()
}

function openModal(src, caption) {
  window.modalManager?.openModal(src, caption)
}

function closeModal() {
  window.modalManager?.closeModal()
}

// Update the global toggleAccordion function
function toggleAccordion(id) {
  const header = document.querySelector(`[data-target="${id}"]`)
  if (header && window.accordionManager) {
    window.accordionManager.toggleAccordion(id, header)
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize managers
  window.themeManager = new ThemeManager()
  window.navigationManager = new NavigationManager()
  window.modalManager = new ModalManager()
  window.accordionManager = new AccordionManager()
  window.scrollManager = new ScrollManager()

  // Initialize AOS if available
  const AOS = window.AOS // Declare the AOS variable
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    })
  }

  console.log("CRAFTIVE website initialized successfully!")
})

// Handle page visibility change to maintain theme consistency
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    // Reapply theme when page becomes visible
    window.themeManager?.applyTheme(window.themeManager?.getCurrentTheme())
  }
})

// Handle browser back/forward navigation
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    // Page was loaded from cache, reapply theme
    window.themeManager?.applyTheme(window.themeManager?.getCurrentTheme())
  }
})

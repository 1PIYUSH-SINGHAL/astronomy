document.addEventListener("DOMContentLoaded", () => {

  const header = document.querySelector(".site-header")
  const sections = document.querySelectorAll(".section")
  const navLinks = document.querySelectorAll(".nav a")
  const scrollIndicator = document.querySelector(".scroll-indicator")
  const banner = document.querySelector(".banner")
  const monthLabel = document.getElementById("monthLabel")

  window.addEventListener("scroll", () => {
    const y = window.scrollY

    if (header) {
      header.style.background =
        y > 40
          ? "rgba(13,17,23,0.95)"
          : "linear-gradient(to bottom,rgba(13,17,23,0.85),rgba(13,17,23,0.4))"
    }

    if (scrollIndicator) {
      scrollIndicator.style.opacity = Math.max(0, 1 - y / 300)
    }

    if (banner) {
      banner.style.transform = `translateY(${y * 0.1}px)`
    }

    highlightNav()
  })

  function highlightNav() {
    let index = sections.length
    while (--index && window.scrollY + 200 < sections[index].offsetTop) {}
    navLinks.forEach(link => link.classList.remove("active"))
    if (navLinks[index]) navLinks[index].classList.add("active")
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, { threshold: 0.15 })

  sections.forEach(section => observer.observe(section))

  const newsletterInput = document.querySelector(".input-group input")
  const newsletterBtn = document.querySelector(".input-group button")

  if (newsletterBtn && newsletterInput) {
    newsletterBtn.addEventListener("click", e => {
      e.preventDefault()
      const value = newsletterInput.value.trim()

      if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        newsletterInput.style.border = "1px solid #ff5c5c"
        return
      }

      newsletterInput.style.border = "1px solid var(--accent)"
      newsletterInput.value = ""
    })
  }

  const monthNavButtons = document.querySelectorAll(".calendar-nav button")

  monthNavButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (!monthLabel) return
      monthLabel.style.opacity = "0"
      setTimeout(() => monthLabel.style.opacity = "1", 150)
    })
  })

})
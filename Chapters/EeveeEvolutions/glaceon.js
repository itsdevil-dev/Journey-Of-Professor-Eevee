// Snowflake Animation (same as before)
document.addEventListener("DOMContentLoaded", () => {
  for (let i = 0; i < 10; i++) {
    const snow = document.createElement("div");
    snow.classList.add("snowflake");
    snow.style.left = `${Math.random() * 100}vw`;
    snow.style.animationDuration = `${2 + Math.random() * 3}s`;
    snow.style.opacity = `${0.3 + Math.random() * 0.7}`;
    snow.style.fontSize = `${12 + Math.random() * 20}px`;
    snow.innerText = "❄";
    document.body.appendChild(snow);
  }

  // Scroll-based fade-in effect
  const fadeIns = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  fadeIns.forEach(el => observer.observe(el));
});
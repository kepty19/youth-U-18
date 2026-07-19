(() => {
  const header = document.getElementById("site-header");
  const reveals = document.querySelectorAll("[data-reveal]");

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );

    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // Hero elements should appear immediately on load
  requestAnimationFrame(() => {
    document.querySelectorAll(".hero [data-reveal]").forEach((el) => {
      el.classList.add("is-visible");
    });
  });
})();

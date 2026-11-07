(() => {
  const body = document.body;
  const menuToggle = document.querySelector(".menu-toggle");
  const menuLinks = document.querySelectorAll(".site-menu a[href^='#']");
  const markers = document.querySelectorAll(".marker");
  const siteMenu = document.getElementById("site-menu");

  function setMenuOpen(open) {
    body.classList.toggle("menu-open", open);
    menuToggle?.setAttribute("aria-expanded", open ? "true" : "false");
    siteMenu?.setAttribute("aria-hidden", open ? "false" : "true");
    if (siteMenu) {
      if ("inert" in siteMenu) {
        siteMenu.inert = !open;
      }
      siteMenu.querySelectorAll("a").forEach((link) => {
        if (open) link.removeAttribute("tabindex");
        else link.setAttribute("tabindex", "-1");
      });
    }
  }

  setMenuOpen(false);

  menuToggle?.addEventListener("click", () => {
    setMenuOpen(!body.classList.contains("menu-open"));
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });

  markers.forEach((marker) => {
    marker.addEventListener("mouseenter", () => {
      markers.forEach((m) => {
        m.classList.toggle("is-active", m === marker);
      });
    });
  });

  const reveals = document.querySelectorAll(".reveal");
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
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }
})();

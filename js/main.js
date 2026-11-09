(() => {
  const body = document.body;
  const root = document.documentElement;
  const menuToggle = document.querySelector(".menu-toggle");
  const themeToggle = document.querySelector(".theme-toggle");
  const menuLinks = document.querySelectorAll(".site-menu a[href^='#']");
  const markers = document.querySelectorAll(".marker");
  const siteMenu = document.getElementById("site-menu");

  function getTheme() {
    const theme = root.getAttribute("data-theme");
    return theme === "dark" ? "dark" : "light";
  }

  function setTheme(theme) {
    const next = theme === "dark" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (_) {}
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        next === "dark" ? "Switch to light background" : "Switch to dark background"
      );
    }
  }

  setTheme(getTheme());

  themeToggle?.addEventListener("click", () => {
    setTheme(getTheme() === "light" ? "dark" : "light");
  });

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

  const formatCount = (n) => {
    if (n >= 1000) {
      const value = n / 1000;
      return `${value >= 10 ? Math.round(value) : value.toFixed(1).replace(/\.0$/, "")}k`;
    }
    return String(n);
  };

  const githubStats = document.querySelectorAll(".os-stats[data-github]");
  githubStats.forEach((el) => {
    const repo = el.getAttribute("data-github");
    if (!repo) return;
    fetch(`https://api.github.com/repos/${repo}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        const stars = el.querySelector("[data-stars]");
        const forks = el.querySelector("[data-forks]");
        if (stars) stars.textContent = formatCount(data.stargazers_count ?? 0);
        if (forks) forks.textContent = formatCount(data.forks_count ?? 0);
        el.hidden = false;
      })
      .catch(() => {
        el.hidden = true;
      });
  });
})();

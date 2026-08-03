(() => {
  const adSenseClient = "ca-pub-1008190701714140";
  const languageRoutes = {
    "/": "/en/",
    "/index.html": "/en/",
    "/blog.html": "/en/blog.html",
    "/cv.html": "/en/cv.html",
    "/iletisim.html": "/en/contact.html",
    "/kuran23.html": "/en/kuran23.html",
    "/barzakh.html": "/en/barzakh.html",
    "/truckup.html": "/en/truckup.html",
    "/littleprince.html": "/en/littleprince.html",
    "/gizlilik.html": "/en/privacy.html",
    "/cerez-politikasi.html": "/en/cookie-policy.html",
    "/blog/barzakh-star-gardener-etkilesimli-kissa-gaybi-esikler.html": "/en/blog/barzakh-star-gardener-interactive-parable-unseen-thresholds.html",
    "/blog/commentarius-perpetuus-uniqus-martyrium.html": "/en/blog/commentarius-perpetuus-uniqus-martyrium.html",
    "/blog/immateryalizm-ve-berkeleyin-idealizmi.html": "/en/blog/immateryalizm-ve-berkeleyin-idealizmi.html",
  };
  const reverseLanguageRoutes = Object.fromEntries(Object.entries(languageRoutes).map(([tr, en]) => [en, tr]));
  const normalizePath = (pathname) => {
    const clean = pathname.replace(/\/{2,}/g, "/");
    return clean.endsWith("/en/index.html") ? "/en/" : clean;
  };
  const currentPath = normalizePath(window.location.pathname);
  const explicitLanguage = currentPath === "/en/" || currentPath.startsWith("/en/") ? "en" : "tr";

  document.querySelectorAll('a[hreflang="tr"], a[hreflang="en"]').forEach((link) => {
    link.addEventListener("click", () => {
      localStorage.setItem("preferredLanguage", link.getAttribute("hreflang"));
    });
  });

  // Otomatik Dil Yönlendirmesi (Tarayıcı diline göre)
  const preferredLanguage = localStorage.getItem("preferredLanguage");
  const browserLanguage = (navigator.languages?.[0] || navigator.language || "").toLowerCase();
  const detectedLanguage = browserLanguage.startsWith("tr") ? "tr" : "en";
  const targetLanguage = preferredLanguage || detectedLanguage;
  const redirectKey = `languageRedirect:${currentPath}`;
  const canRedirect =
    !new URLSearchParams(window.location.search).has("lang") &&
    !sessionStorage.getItem(redirectKey) &&
    ((targetLanguage === "en" && languageRoutes[currentPath]) ||
      (targetLanguage === "tr" && reverseLanguageRoutes[currentPath]));

  if (canRedirect && targetLanguage !== explicitLanguage) {
    const targetPath = targetLanguage === "en" ? languageRoutes[currentPath] : reverseLanguageRoutes[currentPath];
    sessionStorage.setItem(redirectKey, "1");
    window.location.replace(`${targetPath}${window.location.search}${window.location.hash}`);
    return;
  }

  const getStoredTheme = () => {
    return localStorage.getItem("theme") || (document.cookie.match(/theme=(dark|light)/i)?.[1]) || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  };

  const setTheme = (theme) => {
    document.body.classList.toggle("dark-mode", theme === "dark");
    document.body.classList.toggle("light-mode", theme !== "dark");
    document.cookie = `theme=${theme}; path=/; max-age=31536000`;
    localStorage.setItem("theme", theme);

    document.querySelectorAll(".nav__theme__toggle").forEach((toggle) => {
      toggle.checked = theme === "dark";
    });
    document.querySelectorAll(".nav__theme__text").forEach((text) => {
      if (explicitLanguage === "tr") {
        text.textContent = theme === "dark" ? "Karanlık" : "Aydınlık";
      } else {
        text.textContent = theme === "dark" ? "Dark" : "Light";
      }
    });
  };

  // Initial theme application
  setTheme(getStoredTheme());

  // Global event delegation for theme button click (works across Barba page transitions)
  document.addEventListener("click", (event) => {
    const themeControl = event.target.closest(".nav__theme");
    if (themeControl) {
      event.preventDefault();
      const currentTheme = document.body.classList.contains("dark-mode") ? "dark" : "light";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      setTheme(newTheme);
    }
  });

  const footerYear = document.getElementById("footerYear");
  if (footerYear) {
    footerYear.textContent = String(new Date().getFullYear());
  }

  // Hero Stat Numbers — CountUp Animation (IntersectionObserver ile tetiklenir)
  const statNumbers = document.querySelectorAll(".hero-stat__number");
  if (statNumbers.length) {
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const animateStat = (el) => {
      const target = parseInt(el.getAttribute("data-target"), 10);
      const rawPrefix = el.getAttribute("data-prefix") || "";
      const suffix = el.getAttribute("data-suffix") || "";
      const isZeroPadded = rawPrefix === "0";
      const prefix = isZeroPadded ? "" : rawPrefix;
      const digitCount = Math.max(String(target).length, isZeroPadded ? 2 : 1);
      const duration = 1400;
      const startTime = performance.now();

      const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutQuart(progress);
        const current = Math.round(eased * target);

        // Her zaman aynı karakter sayısı → layout kayması yok
        const valStr = String(current).padStart(digitCount, "0");
        el.textContent = `${prefix}${valStr}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    };

    const setupObserver = () => {
      if ("IntersectionObserver" in window) {
        const statObserver = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                animateStat(entry.target);
                obs.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.5 }
        );
        statNumbers.forEach((el) => statObserver.observe(el));
      } else {
        statNumbers.forEach((el) => animateStat(el));
      }
    };

    // Başlangıçta sıfır göster — aynı karakter sayısında (CSS grid sütun genişliğini sabit tutar)
    statNumbers.forEach((el) => {
      const target = parseInt(el.getAttribute("data-target"), 10);
      const rawPrefix = el.getAttribute("data-prefix") || "";
      const suffix = el.getAttribute("data-suffix") || "";
      const isZeroPadded = rawPrefix === "0";
      const prefix = isZeroPadded ? "" : rawPrefix;
      const digitCount = Math.max(String(target).length, isZeroPadded ? 2 : 1);
      el.textContent = `${prefix}${"0".repeat(digitCount)}${suffix}`;
    });

    setupObserver();
  }

  // Methodology Section Smooth Reveal Animation
  const frameworkCols = document.querySelectorAll(".side-framework-col");
  if (frameworkCols.length) {
    if ("IntersectionObserver" in window) {
      const colObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      frameworkCols.forEach((col, idx) => {
        col.style.transitionDelay = `${idx * 0.1}s`;
        colObserver.observe(col);
      });
    } else {
      frameworkCols.forEach((col) => col.classList.add("is-visible"));
    }
  }

  const loadAds = () => {
    if (document.querySelector('script[data-consent-ad="adsense"]')) return;
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.consentAd = "adsense";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseClient}`;
    document.head.appendChild(script);
  };

  const consent = localStorage.getItem("cookieConsent");
  if (consent === "accepted") {
    loadAds();
  } else if (!consent) {
    const isEnglish = document.documentElement.lang?.toLowerCase().startsWith("en");
    const cookiePolicyHref = isEnglish
      ? currentPath.startsWith("/en/blog/")
        ? "../cookie-policy.html"
        : "cookie-policy.html"
      : currentPath.startsWith("/blog/")
        ? "../cerez-politikasi.html"
        : "cerez-politikasi.html";
    const banner = document.createElement("section");
    banner.className = "cookie-consent";
    banner.setAttribute("aria-label", isEnglish ? "Cookie notice" : "\u00c7erez bildirimi");
    banner.innerHTML = `
      <div class="cookie-consent__copy">
        <strong>${isEnglish ? "Cookie preferences" : "\u00c7erez tercihleri"}</strong>
        <p>${isEnglish ? "We use essential preferences for the site and, with your consent, advertising cookies such as Google AdSense." : "Site i\u00e7in zorunlu tercihleri ve onay\u0131n\u0131zla Google AdSense gibi reklam \u00e7erezlerini kullan\u0131yoruz."}</p>
      </div>
      <div class="cookie-consent__actions">
        <a class="cookie-consent__link" href="${cookiePolicyHref}">${isEnglish ? "Details" : "Detaylar"}</a>
        <button type="button" class="cookie-consent__button" data-cookie-choice="rejected">${isEnglish ? "Reject" : "Reddet"}</button>
        <button type="button" class="cookie-consent__button cc-primary" data-cookie-choice="accepted">${isEnglish ? "Accept" : "Kabul et"}</button>
      </div>
    `;
    document.body.appendChild(banner);
    banner.querySelectorAll("[data-cookie-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        const choice = button.getAttribute("data-cookie-choice");
        localStorage.setItem("cookieConsent", choice);
        banner.remove();
        if (choice === "accepted") loadAds();
      });
    });
  }



  const hasMainAnimationBundle = Boolean(document.querySelector('script[src*="assets/js/app.js"]'));
  const headerItems = Array.from(document.querySelectorAll(".header .header__item"));
  if (!hasMainAnimationBundle && headerItems.length) {
    headerItems.forEach((item) => {
      item.style.opacity = "0";
    });

    window.requestAnimationFrame(() => {
      headerItems.forEach((item, index) => {
        const animation = item.animate(
          [
            { opacity: 0, transform: "translateY(-6px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: 420,
            delay: index * 45,
            easing: "cubic-bezier(.25,.46,.45,.94)",
            fill: "forwards",
          },
        );

        animation.addEventListener("finish", () => {
          item.style.opacity = "";
          item.style.transform = "";
        });
      });
    });
  }

  const currentRank = 99999999;

  const dateToRank = (value) => {
    const normalized = value.trim();
    const isoDate = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (isoDate) {
      return Number(`${isoDate[1]}${isoDate[2].padStart(2, "0")}${isoDate[3].padStart(2, "0")}`);
    }

    const dayMonthYear = normalized.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (dayMonthYear) {
      return Number(`${dayMonthYear[3]}${dayMonthYear[2].padStart(2, "0")}${dayMonthYear[1].padStart(2, "0")}`);
    }

    const monthYear = normalized.match(/^(\d{1,2})\.(\d{4})$/);
    if (monthYear) {
      return Number(`${monthYear[2]}${monthYear[1].padStart(2, "0")}00`);
    }

    const year = normalized.match(/^(\d{4})$/);
    if (year) {
      return Number(`${year[1]}0000`);
    }

    return 0;
  };

  const extractDateRank = (value) => {
    if (!value) return 0;
    if (/güncel/i.test(value)) return currentRank;

    const normalized = value.replace(/\s+/g, " ").trim();
    const isoDate = normalized.match(/\b\d{4}-\d{1,2}-\d{1,2}\b/);
    if (isoDate) return dateToRank(isoDate[0]);

    const parts = normalized
      .split(/\s*(?:-|–|—|&)\s*/)
      .map((part) => part.trim())
      .filter(Boolean);

    return Math.max(...parts.map(dateToRank), 0);
  };

  document.querySelectorAll(".cv-section").forEach((section) => {
    const items = Array.from(section.querySelectorAll(":scope > .cv-item"));
    if (items.length > 1) {
      items
        .map((item, index) => ({
          item,
          index,
          rank: extractDateRank(item.querySelector(".cv-item__meta").textContent || ""),
        }))
        .sort((a, b) => b.rank - a.rank || a.index - b.index)
        .forEach(({ item }) => section.appendChild(item));
    }

    const certList = section.querySelector(".cv-cert-list");
    if (certList) {
      Array.from(certList.children)
        .map((item, index) => ({
          item,
          index,
          rank: extractDateRank(item.textContent.split("—")[0] || ""),
        }))
        .sort((a, b) => b.rank - a.rank || a.index - b.index)
        .forEach(({ item }) => certList.appendChild(item));
    }
  });

  const homeJournalShelf = document.querySelector(".home-journal__shelf");
  if (homeJournalShelf) {
    const renderLatestBlogPosts = (cards) => {
      const posts = cards
        .map((card, index) => {
          const meta = card.querySelector("small")?.textContent || "";
          const metaParts = meta.split("•").map((part) => part.trim()).filter(Boolean);
          const category = metaParts[0] || "Blog";
          const date = metaParts.find((part) => /\b\d{4}-\d{1,2}-\d{1,2}\b/.test(part)) || "";
          const duration = metaParts.find((part) => /\bdk\b/i.test(part)) || "";
          const title = card.querySelector("h2")?.textContent.trim() || "";
          const description = card.querySelector("p")?.textContent.trim() || "";
          const href = card.getAttribute("href") || "";

          return {
            category,
            date,
            duration,
            title,
            description,
            href,
            index,
            rank: dateToRank(date),
          };
        })
        .filter((post) => post.href && post.title)
        .sort((a, b) => b.rank - a.rank || a.index - b.index)
        .slice(0, 5);

      if (!posts.length) return;

      homeJournalShelf.replaceChildren(
        ...posts.map((post) => {
          const book = document.createElement("a");
          book.href = post.href;
          book.className = "home-journal__book";

          const category = document.createElement("small");
          category.textContent = post.category;

          const title = document.createElement("h3");
          title.textContent = post.title;

          const description = document.createElement("p");
          description.textContent = post.description;

          const meta = document.createElement("div");
          meta.className = "home-journal__meta";

          const date = document.createElement("span");
          date.textContent = post.date;

          const duration = document.createElement("span");
          duration.textContent = post.duration;

          meta.append(date, duration);
          book.append(category, title, description, meta);
          return book;
        }),
      );
    };

    const blogCards = Array.from(document.querySelectorAll(".blog-card"));
    if (blogCards.length) {
      renderLatestBlogPosts(blogCards);
    } else {
      fetch("blog.html", { cache: "no-store" })
        .then((response) => {
          if (!response.ok) throw new Error("Blog list could not be loaded.");
          return response.text();
        })
        .then((html) => {
          const blogDocument = new DOMParser().parseFromString(html, "text/html");
          renderLatestBlogPosts(Array.from(blogDocument.querySelectorAll(".blog-card")));
        })
        .catch(() => {
          // Keep the static homepage fallback when the blog list cannot be read.
        });
    }
  }

  const scrollProjectGallery = (button, direction) => {
    const gallery = button.closest(".project-gallery");
    const track = gallery?.querySelector(".project-gallery__track");
    if (!track) return;

    const item = track.querySelector(".project-gallery__item");
    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 20;
    const distance = item ? item.getBoundingClientRect().width + gap : track.clientWidth;
    track.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  document.addEventListener("click", (event) => {
    const prev = event.target.closest("[data-gallery-prev]");
    const next = event.target.closest("[data-gallery-next]");
    if (!prev && !next) return;

    event.preventDefault();
    scrollProjectGallery(prev || next, prev ? -1 : 1);
  });

  const initProjectGalleries = () => document.querySelectorAll(".project-gallery").forEach((gallery) => {
    if (gallery.dataset.galleryReady === "true") return;
    gallery.dataset.galleryReady = "true";

    const track = gallery.querySelector(".project-gallery__track");
    if (!track) return;

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    let pointerId = null;

    track.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      isDragging = true;
      pointerId = event.pointerId;
      startX = event.clientX;
      startScrollLeft = track.scrollLeft;
      track.classList.add("cc-dragging");
      track.setPointerCapture(pointerId);
    });

    track.addEventListener("pointermove", (event) => {
      if (!isDragging) return;
      event.preventDefault();
      track.scrollLeft = startScrollLeft - (event.clientX - startX);
    });

    const stopDragging = () => {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove("cc-dragging");
      if (pointerId !== null && track.hasPointerCapture(pointerId)) {
        track.releasePointerCapture(pointerId);
      }
      pointerId = null;
    };

    track.addEventListener("pointerup", stopDragging);
    track.addEventListener("pointercancel", stopDragging);
    track.addEventListener("pointerleave", stopDragging);
  });

  initProjectGalleries();

  // Accordion / Dropdown Toggle Handler with Smooth Height Animation
  document.addEventListener("click", (event) => {
    const dropdownHeader = event.target.closest(".dropdown__header");
    if (!dropdownHeader) return;

    const dropdown = dropdownHeader.closest(".dropdown");
    if (!dropdown) return;

    const body = dropdown.querySelector(".dropdown__body");
    if (!body) return;

    const isOpen = dropdown.classList.contains("cc-open");

    if (isOpen) {
      // Smooth Close
      body.style.height = body.scrollHeight + "px";
      body.offsetHeight; // Force reflow
      body.style.height = "0px";
      dropdown.classList.remove("cc-open");
    } else {
      // Smooth Open
      dropdown.classList.add("cc-open");
      body.style.height = "0px";
      body.offsetHeight; // Force reflow
      body.style.height = body.scrollHeight + "px";
    }
  });

  document.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "height") return;
    const body = event.target.closest(".dropdown__body");
    if (!body) return;
    const dropdown = body.closest(".dropdown");
    if (dropdown && dropdown.classList.contains("cc-open")) {
      body.style.height = "auto";
    }
  });

  const galleryObserver = new MutationObserver(() => initProjectGalleries());
  galleryObserver.observe(document.body, { childList: true, subtree: true });
})();




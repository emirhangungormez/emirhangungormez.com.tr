(() => {
  const siteRootUrl = new URL("../../", document.currentScript?.src || new URL("assets/js/site.js", window.location.href));
  const resolveSiteHref = (href) => {
    let resolvedHref = href.replace(/^\//, "");
    if (siteRootUrl.protocol === "file:") {
      const [pathWithQuery, hash = ""] = resolvedHref.split("#");
      resolvedHref = `${pathWithQuery.endsWith("/") || pathWithQuery === "" ? `${pathWithQuery}index.html` : pathWithQuery}${hash ? `#${hash}` : ""}`;
    }
    return new URL(resolvedHref, siteRootUrl).href;
  };
  const languageRoutes = {
    "/": "/en/",
    "/index.html": "/en/",
    "/404.html": "/en/404.html",
    "/500.html": "/en/500.html",
    "/admin.html": "/en/admin.html",
    "/ai.html": "/en/ai.html",
    "/blog.html": "/en/blog.html",
    "/blog/": "/en/blog/",
    "/blog/index.html": "/en/blog/index.html",
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
    "/blog/unvansizlar-cemiyeti-diplomasiz-bir-hakikat-ekolojisi.html": "/en/blog/society-of-the-untitled-an-ecology-of-truth-without-diplomas.html",
  };
  const reverseLanguageRoutes = Object.fromEntries(Object.entries(languageRoutes).map(([tr, en]) => [en, tr]));
  const normalizePath = (pathname) => {
    const clean = pathname.replace(/\/{2,}/g, "/");
    return clean.endsWith("/en/index.html") ? "/en/" : clean;
  };
  const getRoutePath = (pathname) => {
    const rootPath = siteRootUrl.pathname.replace(/\/$/, "");
    const relativePath = pathname.startsWith(rootPath) ? pathname.slice(rootPath.length) : pathname;
    return normalizePath(relativePath || "/");
  };
  const currentPath = getRoutePath(window.location.pathname);
  const explicitLanguage = currentPath === "/en/" || currentPath.startsWith("/en/") ? "en" : "tr";

  const normalizeHeaderNavigation = () => {
    const isEnglish = explicitLanguage === "en";
    const homePath = isEnglish ? "/en/" : "/";
    const isHome = currentPath === homePath || currentPath === `${homePath}index.html`;
    const items = isEnglish
      ? [
          ["Home", homePath],
          ["About", `${homePath}#about`],
          ["Work", `${homePath}#work`],
          ["Process", `${homePath}#process`],
          ["Blog", "/en/blog.html"],
          ["CV", "/en/cv.html"],
          ["Digital Emirhan", "/en/ai.html"],
          ["Contact", "/en/contact.html"],
        ]
      : [
          ["Ana Sayfa", homePath],
          ["Hakkımda", `${homePath}#about`],
          ["İş", `${homePath}#work`],
          ["Süreç", `${homePath}#process`],
          ["Blog", "/blog.html"],
          ["Özgeçmiş", "/cv.html"],
          ["Sanal Emirhan", "/ai.html"],
          ["İletişim", "/iletisim.html"],
        ];

    document.querySelectorAll("header .nav").forEach((nav) => {
      const logo = nav.querySelector(".nav__logo");
      const links = nav.querySelector(".nav__links");
      if (logo) logo.setAttribute("href", resolveSiteHref(homePath));
      if (!links) return;

      links.replaceChildren(...items.map(([label, href]) => {
        const link = document.createElement("a");
        link.setAttribute("href", isHome && href.includes("#") ? href.slice(href.indexOf("#")) : resolveSiteHref(href));
        link.textContent = label;
        link.className = "nav__link header__item text-link";
        if (isHome && href.includes("#")) link.classList.add("js--nav-link");
        if (!href.includes("#") && getRoutePath(new URL(link.href).pathname) === currentPath) {
          link.classList.add("is-active");
        }
        return link;
      }));
    });
  };

  normalizeHeaderNavigation();

  const normalizeFooterNavigation = () => {
    const isEnglish = explicitLanguage === "en";
    const translatedPath = isEnglish ? reverseLanguageRoutes[currentPath] : languageRoutes[currentPath];
    const languagePath = translatedPath || (isEnglish ? "/" : "/en/");
    const links = isEnglish
      ? [
          ["GitHub", "https://github.com/emirhangungormez"],
          ["LinkedIn", "https://www.linkedin.com/in/emirhangungormez"],
          ["X (Twitter)", "https://twitter.com/emirhangngrmz"],
          ["Medium", "https://medium.com/@emirhangungormez"],
          ["YouTube", "https://www.youtube.com/@han23studio"],
          ["ArtStation", "https://www.artstation.com/han23studio"],
          ["Türkçe", languagePath, "tr"],
          ["Privacy & Cookies", "/en/privacy.html"],
        ]
      : [
          ["GitHub", "https://github.com/emirhangungormez"],
          ["LinkedIn", "https://www.linkedin.com/in/emirhangungormez"],
          ["X (Twitter)", "https://twitter.com/emirhangngrmz"],
          ["Medium", "https://medium.com/@emirhangungormez"],
          ["YouTube", "https://www.youtube.com/@han23studio"],
          ["ArtStation", "https://www.artstation.com/han23studio"],
          ["English", languagePath, "en"],
          ["Gizlilik ve Çerezler", "/gizlilik.html"],
        ];

    document.querySelectorAll(".footer__links").forEach((footerLinks) => {
      const intro = document.createElement("li");
      intro.className = "footer__intro";

      const description = document.createElement("p");
      description.textContent = isEnglish
        ? "I turn research, technology and design into work that creates lasting value."
        : "Araştırma, teknoloji ve tasarımı kalıcı değer üreten işlere dönüştürüyorum.";

      const contributions = document.createElement("div");
      contributions.className = "contribution-days";
      contributions.setAttribute("aria-label", isEnglish
        ? "GitHub contributions for the last 30 days"
        : "Son 30 günlük GitHub katkıları");

      const contributionGrid = document.createElement("div");
      contributionGrid.className = "contribution-days__grid";
      contributionGrid.dataset.githubUser = "emirhangungormez";
      contributions.appendChild(contributionGrid);
      intro.append(description, contributions);

      footerLinks.replaceChildren(intro, ...links.map(([label, href, language]) => {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.textContent = label;
        link.href = href.startsWith("http") ? href : resolveSiteHref(href);
        link.className = "text-link";
        if (href.startsWith("http")) link.target = "_blank";
        if (language) link.hreflang = language;
        item.appendChild(link);
        return item;
      }));
    });

    if (!document.querySelector('script[src*="contributions.js"]')) {
      const contributionScript = document.createElement("script");
      contributionScript.src = resolveSiteHref("/assets/js/contributions.js");
      document.head.appendChild(contributionScript);
    }
  };

  normalizeFooterNavigation();

  const scrollVirtualViewportTo = (hash) => {
    const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
    const viewport = document.getElementById("viewport");
    const content = viewport?.querySelector(".scroll-content");
    if (!target || !viewport || !content) return false;

    const matrix = new DOMMatrixReadOnly(getComputedStyle(content).transform);
    const currentOffset = -matrix.m42;
    const targetOffset = target.getBoundingClientRect().top + currentOffset;
    viewport.dispatchEvent(new WheelEvent("wheel", {
      deltaY: targetOffset - currentOffset,
      bubbles: true,
      cancelable: true,
    }));
    return true;
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;

    const url = new URL(link.href, window.location.href);
    if (!url.hash || url.pathname !== window.location.pathname || !scrollVirtualViewportTo(url.hash)) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    window.history.replaceState(window.history.state, "", url.hash);

    if (link.classList.contains("mobile-drawer-link")) {
      document.querySelector(".mobile-hamburger")?.classList.remove("is-open");
      document.querySelector(".mobile-drawer-backdrop")?.classList.remove("is-open");
      document.querySelector(".mobile-drawer-panel")?.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  }, true);

  if (window.location.hash) {
    window.requestAnimationFrame(() => {
      scrollVirtualViewportTo(window.location.hash);
    });
  }

  // Every document owns page-specific styles in its <head>. Force a full
  // document load between pages so the next document's styles are applied.
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target === "_blank" || link.hasAttribute("download")) return;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    const sameDocument = url.pathname === window.location.pathname && url.search === window.location.search;
    if (sameDocument && url.hash) return;

    const selectedLanguage = link.getAttribute("hreflang");
    if (selectedLanguage === "tr" || selectedLanguage === "en") {
      localStorage.setItem("preferredLanguage", selectedLanguage);
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(url.href);
  }, true);

  document.querySelectorAll('a[href$="/ai.html"], a[href="ai.html"], a[href$="/en/ai.html"], a[href="../ai.html"]').forEach((link) => {
    link.setAttribute("data-barba-prevent", "self");
  });

  document.querySelectorAll('a[hreflang="tr"], a[hreflang="en"]').forEach((link) => {
    const linkLanguage = link.getAttribute("hreflang");
    const mappedPath = linkLanguage === "en" ? languageRoutes[currentPath] : reverseLanguageRoutes[currentPath];
    if (mappedPath) {
      link.setAttribute("href", resolveSiteHref(mappedPath));
    } else {
      link.setAttribute("href", resolveSiteHref(link.getAttribute("href")));
    }
    link.addEventListener("click", () => {
      localStorage.setItem("preferredLanguage", linkLanguage);
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
    const targetUrl = new URL(resolveSiteHref(targetPath));
    targetUrl.search = window.location.search;
    targetUrl.hash = window.location.hash;
    sessionStorage.setItem(redirectKey, "1");
    window.location.replace(targetUrl.href);
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
  setupStatsMarquee();
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
          const rawSmall = card.querySelector("small");
          const category = rawSmall ? rawSmall.textContent.trim() : "";
          const metaEl = card.querySelector(".blog-card__meta, .home-journal__meta");
          const metaHtml = metaEl ? metaEl.innerHTML : "";
          const metaText = (metaEl ? metaEl.textContent : "") + " " + (rawSmall ? rawSmall.textContent : "");
          const dateMatch = metaText.match(/\b\d{4}-\d{1,2}-\d{1,2}\b/);
          const date = dateMatch ? dateMatch[0] : "";
          const title = card.querySelector("h2, h3")?.textContent.trim() || "";
          const description = card.querySelector("p")?.textContent.trim() || "";
          const href = card.getAttribute("href") || "";
          const imgEl = card.querySelector(".blog-card__image img, img:not(.footer__logo-img)");
          const imageSrc = imgEl ? imgEl.getAttribute("src") : null;
          const imageAlt = imgEl ? imgEl.getAttribute("alt") : "";

          return {
            category,
            metaHtml,
            date,
            title,
            description,
            href,
            imageSrc,
            imageAlt,
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
          const card = document.createElement("a");
          card.href = post.href;
          card.className = post.imageSrc
            ? "blog-card blog-card--has-image home-journal__book"
            : "blog-card home-journal__book";

          const contentDiv = document.createElement("div");

          if (post.imageSrc) {
            const imgContainer = document.createElement("div");
            imgContainer.className = "blog-card__image";
            const img = document.createElement("img");
            img.src = post.imageSrc;
            img.alt = post.imageAlt || post.title;
            img.loading = "lazy";
            imgContainer.appendChild(img);
            contentDiv.appendChild(imgContainer);
          } else {
            const dotsSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            dotsSvg.setAttribute("class", "card-dots");
            dotsSvg.setAttribute("width", "18");
            dotsSvg.setAttribute("height", "22");
            dotsSvg.setAttribute("viewBox", "0 0 16 22");
            dotsSvg.setAttribute("fill", "currentColor");
            dotsSvg.innerHTML = `<circle cx="4" cy="4" r="1.8"/><circle cx="12" cy="4" r="1.8"/><circle cx="4" cy="11" r="1.8"/><circle cx="12" cy="11" r="1.8"/><circle cx="4" cy="18" r="1.8"/><circle cx="12" cy="18" r="1.8"/>`;
            contentDiv.appendChild(dotsSvg);
          }

          if (post.category) {
            const small = document.createElement("small");
            small.textContent = post.category;
            contentDiv.appendChild(small);
          }

          const title = document.createElement("h3");
          title.textContent = post.title;
          contentDiv.appendChild(title);

          const desc = document.createElement("p");
          desc.textContent = post.description;
          contentDiv.appendChild(desc);

          card.appendChild(contentDiv);

          if (post.metaHtml) {
            const metaDiv = document.createElement("div");
            metaDiv.className = "home-journal__meta blog-card__meta";
            metaDiv.innerHTML = post.metaHtml;
            card.appendChild(metaDiv);
          }

          return card;
        }),
      );
    };

    const blogCards = Array.from(document.querySelectorAll(".blog-list .blog-card"));
    if (blogCards.length) {
      renderLatestBlogPosts(blogCards);
    } else {
      const blogFetchUrl = explicitLanguage === "en" ? "en/blog.html" : "blog.html";
      fetch(blogFetchUrl, { cache: "no-store" })
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

  // Dynamic Mobile Off-Canvas Drawer Setup
  const setupMobileDrawer = () => {
    // Only run on mobile viewport
    if (window.innerWidth > 767) {
      const existingPanel = document.querySelector(".mobile-drawer-panel");
      const existingBackdrop = document.querySelector(".mobile-drawer-backdrop");
      const existingHamburger = document.querySelector(".mobile-hamburger");
      if (existingPanel) existingPanel.remove();
      if (existingBackdrop) existingBackdrop.remove();
      if (existingHamburger) existingHamburger.remove();
      document.body.style.overflow = "";
      return;
    }

    let hamburger = document.querySelector(".mobile-hamburger");
    let backdrop = document.querySelector(".mobile-drawer-backdrop");
    let panel = document.querySelector(".mobile-drawer-panel");

    const nav = document.querySelector("header .nav");

    if (nav && !hamburger) {
      hamburger = document.createElement("button");
      hamburger.className = "mobile-hamburger";
      hamburger.setAttribute("aria-label", "Menü");
      hamburger.innerHTML = "<span></span><span></span><span></span>";
      nav.appendChild(hamburger);
    }

    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "mobile-drawer-backdrop";
      document.body.appendChild(backdrop);
    }

    if (!panel) {
      panel = document.createElement("aside");
      panel.className = "mobile-drawer-panel";
      
      const isEn = window.location.pathname.includes("/en/");
      const links = isEn ? [
        { href: "/en/", label: "Home" },
        { href: "/en/#about", label: "About" },
        { href: "/en/#work", label: "Work" },
        { href: "/en/#process", label: "Process" },
        { href: "/en/blog.html", label: "Blog" },
        { href: "/en/cv.html", label: "CV" },
        { href: "/en/ai.html", label: "Digital Emirhan" },
        { href: "/en/contact.html", label: "Contact" }
      ] : [
        { href: "index.html", label: "Ana Sayfa" },
        { href: "index.html#about", label: "Hakkımda" },
        { href: "index.html#work", label: "İş" },
        { href: "index.html#process", label: "Süreç" },
        { href: "blog.html", label: "Blog" },
        { href: "cv.html", label: "Özgeçmiş" },
        { href: "ai.html", label: "Sanal Emirhan" },
        { href: "iletisim.html", label: "İletişim" }
      ];

      let linksHtml = links.map(l => `<a href="${resolveSiteHref(l.href)}" class="mobile-drawer-link">${l.label}</a>`).join('');

      panel.innerHTML = `
        <nav class="mobile-drawer-nav">
          ${linksHtml}
        </nav>
        <div class="mobile-drawer-footer">
          <label class="nav__theme" role="button" tabindex="0">
            <div class="nav__theme__icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 12 12" class="cc-moon"><path fill="none" d="M0 0h12v12H0z"></path><path fill="currentColor" d="M6.315 10.617q-.223 0-.448-.02a4.93 4.93 0 0 1-.876-9.66.394.394 0 0 1 .486.486 4.142 4.142 0 0 0 5.1 5.1.394.394 0 0 1 .486.486 4.943 4.943 0 0 1-4.748 3.608Zm-1.741-8.69a4.142 4.142 0 1 0 5.5 5.5 4.931 4.931 0 0 1-5.5-5.5Z"></path></svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cc-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
            </div>
            <div class="nav__theme__text">${document.body.classList.contains("dark-mode") ? (isEn ? "Dark" : "Karanlık") : (isEn ? "Light" : "Aydınlık")}</div>
          </label>
          <a href="mailto:han23studio@gmail.com" class="mobile-drawer-email">han23studio@gmail.com</a>
        </div>
      `;
      document.body.appendChild(panel);
    }
  };

  setupMobileDrawer();
  window.addEventListener("resize", setupMobileDrawer);

  const toggleDrawer = (open) => {
    const hamburger = document.querySelector(".mobile-hamburger");
    const backdrop = document.querySelector(".mobile-drawer-backdrop");
    const panel = document.querySelector(".mobile-drawer-panel");
    const isCurrentlyOpen = panel?.classList.contains("is-open");
    const shouldOpen = open !== undefined ? open : !isCurrentlyOpen;

    if (shouldOpen) {
      hamburger?.classList.add("is-open");
      backdrop?.classList.add("is-open");
      panel?.classList.add("is-open");
      document.body.style.overflow = "hidden";
    } else {
      hamburger?.classList.remove("is-open");
      backdrop?.classList.remove("is-open");
      panel?.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  };

  // Mobile Portrait Modal Pop-up (Lightbox)
  const setupMobilePortraitModal = () => {
    let backdrop = document.getElementById("portraitModalBackdrop");
    let card = document.getElementById("portraitModalCard");

    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "portraitModalBackdrop";
      backdrop.className = "portrait-modal-backdrop";
      document.body.appendChild(backdrop);
    }

    if (!card) {
      card = document.createElement("div");
      card.id = "portraitModalCard";
      card.className = "portrait-modal-card";
      card.setAttribute("role", "dialog");
      card.setAttribute("aria-modal", "true");

      const isEn = explicitLanguage === "en";
      const title = isEn ? "Indie Game Developer & Technical Founder" : "Bağımsız Oyun Geliştiricisi & Teknik Kurucu";
      const badge = isEn ? "hey, how's it going? 👋" : "selam, nasıl gidiyor? 👋";
      const portraitImgSrc = isEn ? "../assets/images/emirhan-portrait.jpg?v=2" : "assets/images/emirhan-portrait.jpg?v=2";

      card.innerHTML = `
        <button type="button" class="portrait-modal-close" id="portraitModalClose" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div class="portrait-modal-img-wrapper">
          <img src="${portraitImgSrc}" alt="Emirhan Güngörmez">
          <div class="portrait-modal-badge">${badge}</div>
        </div>
        <div class="portrait-modal-caption">
          <h3>Emirhan Güngörmez</h3>
          <p>${title}</p>
        </div>
      `;
      document.body.appendChild(card);
    }
  };

  const togglePortraitModal = (open) => {
    setupMobilePortraitModal();
    const backdrop = document.getElementById("portraitModalBackdrop");
    const card = document.getElementById("portraitModalCard");
    const isOpen = card?.classList.contains("is-open");
    const shouldOpen = open !== undefined ? open : !isOpen;

    if (shouldOpen) {
      backdrop?.classList.add("is-open");
      card?.classList.add("is-open");
      document.body.style.overflow = "hidden";
    } else {
      backdrop?.classList.remove("is-open");
      card?.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  };

  // Dynamic Mobile Portrait Trigger Button (Injects ONLY on screens <= 767px, ZERO DOM element on Desktop)
  const setupMobilePortraitTriggerButton = () => {
    const isMobile = window.innerWidth <= 767;
    const existingBtn = document.getElementById("mobilePortraitTrigger");

    if (isMobile) {
      if (!existingBtn) {
        const h1Span = document.querySelector(".h-hero__title h1 span:not(.text-hidden)");
        if (h1Span) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "mobile-portrait-trigger";
          btn.id = "mobilePortraitTrigger";
          const ariaLabel = explicitLanguage === "en" ? "View profile photo" : "Profil resmini gör";
          btn.setAttribute("aria-label", ariaLabel);
          btn.setAttribute("title", ariaLabel);
          btn.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          `;
          const br = h1Span.querySelector(".mobile-break");
          if (br) {
            h1Span.insertBefore(btn, br);
          } else {
            h1Span.appendChild(btn);
          }
        }
      }
    } else {
      if (existingBtn) {
        existingBtn.remove();
      }
    }
  };

  // Dynamic mobile content rearrangement: Moves name explanation above "veri sınırsızdır" text on mobile
  const handleMobileContentMove = () => {
    const isMobile = window.innerWidth <= 767;
    const subContainer = document.querySelector(".h-hero__sub");
    const subP = subContainer?.querySelector("p");
    const heroText = document.querySelector(".h-hero__text");

    if (isMobile) {
      if (subP && heroText && !heroText.querySelector(".mobile-moved-sub")) {
        subP.classList.add("mobile-moved-sub");
        heroText.insertBefore(subP, heroText.firstChild);
      }
    } else {
      const movedP = heroText?.querySelector(".mobile-moved-sub");
      if (movedP && subContainer) {
        movedP.classList.remove("mobile-moved-sub");
        subContainer.insertBefore(movedP, subContainer.firstChild);
      }
    }
  };
  // Dynamic Stats Infinite Marquee (Global for Desktop & Mobile)
  function setupStatsMarquee() {
    const container = document.querySelector(".hero-stats-container");
    if (!container) return;

    if (!container.querySelector(".hero-stats-track")) {
      const items = Array.from(container.querySelectorAll(".hero-stat"));
      if (items.length > 0) {
        container.removeAttribute("style");
        
        const track = document.createElement("div");
        track.className = "hero-stats-track";
        
        items.forEach(item => {
          item.removeAttribute("style");
          track.appendChild(item);
        });
        
        // Duplicate items to ensure seamless loop
        items.forEach(item => {
          const clone = item.cloneNode(true);
          track.appendChild(clone);
        });
        
        container.appendChild(track);
      }
    }
  };

  const enrichBlogCardsWithImages = () => {
    const cards = Array.from(document.querySelectorAll(".blog-card:not([data-image-checked])"));
    if (!cards.length) return;

    cards.forEach((card) => {
      card.setAttribute("data-image-checked", "true");
      if (card.querySelector(".blog-card__image, img")) return;

      const href = card.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http")) return;

      fetch(href, { cache: "force-cache" })
        .then((res) => {
          if (!res.ok) return null;
          return res.text();
        })
        .then((html) => {
          if (!html) return;
          const doc = new DOMParser().parseFromString(html, "text/html");
          const figureImg = doc.querySelector(".blog-post__image img, .blog-post figure img, .blog-post img:not(.footer__logo-img)");
          let imgSrc = figureImg ? figureImg.getAttribute("src") : null;
          let imgAlt = figureImg ? figureImg.getAttribute("alt") : "";

          if (!imgSrc) {
            const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute("content");
            if (ogImage && !ogImage.includes("og-min.jpg")) {
              imgSrc = ogImage;
            }
          }

          if (imgSrc) {
            let resolvedSrc = imgSrc;
            if (!imgSrc.startsWith("http") && !imgSrc.startsWith("/")) {
              const postDir = href.includes("/") ? href.slice(0, href.lastIndexOf("/") + 1) : "";
              const combinedPath = postDir + imgSrc;
              const stack = [];
              const segments = combinedPath.split("/");
              for (const seg of segments) {
                if (seg === ".." && stack.length && stack[stack.length - 1] !== "..") {
                  stack.pop();
                } else if (seg !== "." && seg !== "") {
                  stack.push(seg);
                }
              }
              resolvedSrc = stack.join("/");
              if (window.location.pathname.includes("/blog/") || window.location.pathname.includes("/en/blog/")) {
                if (!resolvedSrc.startsWith("../")) {
                  resolvedSrc = "../" + resolvedSrc;
                }
              }
            }

            const imgContainer = document.createElement("div");
            imgContainer.className = "blog-card__image";
            const img = document.createElement("img");
            img.src = resolvedSrc;
            img.alt = imgAlt || card.querySelector("h2")?.textContent.trim() || "Blog görseli";
            img.loading = "lazy";
            imgContainer.appendChild(img);

            const innerDiv = card.querySelector("div") || card;
            const dots = innerDiv.querySelector(".card-dots");
            if (dots) {
              innerDiv.replaceChild(imgContainer, dots);
            } else {
              innerDiv.insertBefore(imgContainer, innerDiv.firstChild);
            }
            card.classList.add("blog-card--has-image");
          }
        })
        .catch(() => {});
    });
  };

  setupMobilePortraitTriggerButton();
  handleMobileContentMove();
  setupStatsMarquee();
  enrichBlogCardsWithImages();
  window.addEventListener("resize", () => {
    setupMobilePortraitTriggerButton();
    handleMobileContentMove();
    setupStatsMarquee();
  });

  document.addEventListener("click", (e) => {
    if (e.target.closest(".mobile-hamburger")) {
      e.preventDefault();
      toggleDrawer();
    } else if (e.target.closest(".mobile-drawer-close") || e.target.closest(".mobile-drawer-backdrop") || e.target.closest(".mobile-drawer-link")) {
      toggleDrawer(false);
    } else if (e.target.closest(".mobile-portrait-trigger")) {
      e.preventDefault();
      togglePortraitModal(true);
    } else if (e.target.closest(".portrait-modal-close") || e.target.closest(".portrait-modal-backdrop")) {
      togglePortraitModal(false);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      togglePortraitModal(false);
    }
  });

  // Re-run setup after Barba page transitions
  if (window.barba) {
    window.barba.hooks.after(() => {
      setupMobileDrawer();
      setupMobilePortraitModal();
      setupMobilePortraitTriggerButton();
      handleMobileContentMove();
      setupStatsMarquee();
      enrichBlogCardsWithImages();
    });
  }
})();






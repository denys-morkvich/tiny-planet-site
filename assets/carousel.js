// eSIM plans carousel for index.html (#esim).
// Renders cards from window.ESIM_PLANS (assets/esim-plans.js), then enhances them with
// Embla Carousel + Auto Scroll (loaded from jsDelivr, pinned to 8.6.0, see index.html).
(function () {
  const root = document.querySelector("[data-esim-carousel]");
  if (!root) return;
  const track = root.querySelector(".esim-track");
  const plans = (window.ESIM_PLANS || []).filter(function (p) { return p.priceUSD != null; });

  // 1. Render the cards synchronously so there is no layout shift.
  plans.forEach(function (p, i) {
    const slide = document.createElement("div");
    slide.className = "esim-slide";
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", (i + 1) + " of " + plans.length);

    const card = document.createElement("a");
    card.className = "esim-card";
    card.href = p.checkoutUrl;
    card.draggable = false;
    card.setAttribute("aria-label",
      "Buy " + p.title + " eSIM, " + p.validityDays + " days, data only, $" + p.priceUSD.toFixed(2) + " USD");

    const flag = document.createElement("img");
    flag.className = "esim-flag";
    flag.src = "assets/flags/" + p.countryCode + ".svg";
    flag.alt = "";
    flag.width = 36;
    flag.height = 36;
    flag.draggable = false;

    const title = document.createElement("h3");
    title.textContent = p.title;

    const meta = document.createElement("p");
    meta.className = "esim-meta";
    meta.textContent = p.validityDays + " days · Data only";

    const foot = document.createElement("div");
    foot.className = "esim-foot";
    const price = document.createElement("span");
    price.className = "esim-price";
    price.textContent = "$" + p.priceUSD.toFixed(2);
    const buy = document.createElement("span");
    buy.className = "esim-buy";
    buy.setAttribute("aria-hidden", "true");
    buy.textContent = "Buy →";
    foot.append(price, buy);

    card.append(flag, title, meta, foot);
    slide.append(card);
    track.append(slide);
  });

  // 2. Enhance with Embla once the deferred CDN scripts have loaded.
  window.addEventListener("DOMContentLoaded", function () {
    if (typeof window.EmblaCarousel !== "function") return; // CDN unavailable: cards stay swipeable via native overflow

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const toggle = root.querySelector("[data-esim-toggle]");
    const viewport = root.querySelector(".esim-viewport");
    const autoScroll = !reducedMotion.matches && typeof window.EmblaCarouselAutoScroll === "function"
      ? window.EmblaCarouselAutoScroll({
          speed: 0.6,
          startDelay: 0,
          stopOnInteraction: true, // we decide when to resume (see update())
          stopOnMouseEnter: false,
          stopOnFocusIn: false,
        })
      : null;

    root.classList.add("is-enhanced");
    const embla = window.EmblaCarousel(viewport, { loop: true, dragFree: true, align: "start" },
      autoScroll ? [autoScroll] : []);

    root.querySelector("[data-esim-prev]").addEventListener("click", function () { embla.scrollPrev(); });
    root.querySelector("[data-esim-next]").addEventListener("click", function () { embla.scrollNext(); });

    if (!autoScroll) {
      toggle.hidden = true;
      return;
    }

    // Autoplay runs only when nothing is holding it: hover, focus inside, drag, or the pause button.
    const state = { hover: false, focus: false, drag: false, userPaused: false };
    let resumeTimer = null;

    function update(delay) {
      clearTimeout(resumeTimer);
      const shouldPlay = !state.hover && !state.focus && !state.drag && !state.userPaused;
      if (!shouldPlay) {
        if (autoScroll.isPlaying()) autoScroll.stop();
      } else if (!autoScroll.isPlaying()) {
        resumeTimer = setTimeout(function () { autoScroll.play(); }, delay || 0);
      }
      toggle.setAttribute("aria-pressed", String(state.userPaused));
      toggle.setAttribute("aria-label", state.userPaused ? "Play autoplay" : "Pause autoplay");
      toggle.dataset.state = state.userPaused ? "paused" : "playing";
    }

    root.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") { state.hover = true; update(); } });
    root.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") { state.hover = false; update(); } });
    // Focus is tracked on the cards only, so the pause button itself does not hold autoplay.
    viewport.addEventListener("focusin", function () { state.focus = true; update(); });
    viewport.addEventListener("focusout", function (e) {
      if (!viewport.contains(e.relatedTarget)) { state.focus = false; update(); }
    });
    embla.on("pointerDown", function () { state.drag = true; update(); });
    embla.on("pointerUp", function () { state.drag = false; update(1500); });
    toggle.addEventListener("click", function () { state.userPaused = !state.userPaused; update(); });

    reducedMotion.addEventListener("change", function (e) {
      if (e.matches) { state.userPaused = true; toggle.hidden = true; update(); }
    });

    update();
  });
})();

// eSIM plan data for the carousel in index.html (#esim).
// Plain script (no modules, no build step): defines window.ESIM_PLANS.

(function () {
  // Lemon Squeezy checkout URL per country code.
  // TODO: paste each Lemon Squeezy checkout URL once the store is approved.
  // While a value is empty, the card falls back to a mailto: link.
  const CHECKOUT_URLS = {
    gr: "", // TODO
    it: "", // TODO
    es: "", // TODO
    fr: "", // TODO
    de: "", // TODO
    gb: "", // TODO
    tr: "", // TODO
    us: "", // TODO
    jp: "", // TODO
    th: "", // TODO
    ae: "", // TODO
    ge: "", // TODO
  };

  function checkoutUrl(countryCode, countryName) {
    return CHECKOUT_URLS[countryCode] ||
      "mailto:hey@tinyplanet.tech?subject=" + encodeURIComponent("eSIM " + countryName + " 5GB");
  }

  function plan(countryCode, countryName, priceUSD) {
    return {
      countryCode: countryCode,
      countryName: countryName,
      title: countryName + " 5GB",
      dataGB: 5,
      validityDays: 30,
      priceUSD: priceUSD,
      checkoutUrl: checkoutUrl(countryCode, countryName),
    };
  }

  // Prices hardcoded from airalo.com, verified 2026-10-03. Update manually.
  // Source: https://www.airalo.com/<country>-esim → local eSIM, "Fixed data", 30 days, 5 GB, standard price (no promo codes).
  // A plan with priceUSD: null is not rendered.
  const ESIM_PLANS = [
    plan("gr", "Greece", 12.00),
    plan("it", "Italy", 12.00),
    plan("es", "Spain", 9.00),
    plan("fr", "France", 11.00),
    plan("de", "Germany", 11.00),
    plan("gb", "United Kingdom", 13.00),
    plan("tr", "Turkey", 10.00),
    plan("us", "United States", 13.50),
    plan("jp", "Japan", 11.00),
    plan("th", "Thailand", 8.00),
    plan("ae", "United Arab Emirates", 12.00),
    plan("ge", "Georgia", 17.00),
  ];

  window.ESIM_PLANS = ESIM_PLANS;
})();

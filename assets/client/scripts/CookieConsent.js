import Base from "./core/Base.js";

class CookieConsent extends Base {
  init() {
    this.cookieName = "cookie-consent-preferences";
    this.legacyKey = "cookie-consent-accepted";
    this.legacyStorageKey = "cookie-consent-preferences";
    this.cookieMaxAgeDays = 180;
  }

  initCache() {
    this.cache.acceptButton = this.element.querySelector("[data-cookie-accept]");
    this.cache.toggleButton = this.element.querySelector("[data-cookie-toggle]");
    this.cache.saveButton = this.element.querySelector("[data-cookie-save]");
    this.cache.details = this.element.querySelector("[data-cookie-details]");
    this.cache.analyticsCheckbox = this.element.querySelector("[data-cookie-analytics]");
    this.cache.marketingCheckbox = this.element.querySelector("[data-cookie-marketing]");
  }

  initStates() {
    const storedPreferences = this.getStoredPreferences();

    if (storedPreferences) {
      this.applyPreferences(storedPreferences);
      this.hideBanner();
      return;
    }

    this.element.classList.remove("is-hidden");
    this.element.classList.add("is-visible");
    this.collapseDetails();
  }

  bindEvents() {
    if (this.cache.acceptButton) {
      this.cache.acceptButton.addEventListener("click", () => {
        this.savePreferences({
          necessary: true,
          analytics: true,
          marketing: true,
        });
        this.hideBanner();
      });
    }

    if (this.cache.toggleButton) {
      this.cache.toggleButton.addEventListener("click", () => {
        this.toggleDetails();
      });
    }

    if (this.cache.saveButton) {
      this.cache.saveButton.addEventListener("click", () => {
        this.savePreferences(this.getCurrentPreferences());
        this.hideBanner();
      });
    }
  }

  getStoredPreferences() {
    try {
      const stored = this.getCookie(this.cookieName);
      if (stored) {
        const parsed = JSON.parse(decodeURIComponent(stored));
        if (this.isValidPreferences(parsed)) {
          return parsed;
        }
      }

      const legacyPreferences = localStorage.getItem(this.legacyStorageKey);
      if (legacyPreferences) {
        const parsedLegacy = JSON.parse(legacyPreferences);
        if (this.isValidPreferences(parsedLegacy)) {
          this.savePreferences(parsedLegacy);
          return parsedLegacy;
        }
      }

      if (localStorage.getItem(this.legacyKey) === "true") {
        const accepted = { necessary: true, analytics: true, marketing: true };
        this.savePreferences(accepted);
        return accepted;
      }
    } catch (error) {
      return null;
    }

    return null;
  }

  savePreferences(preferences) {
    try {
      const payload = encodeURIComponent(JSON.stringify(preferences));
      this.setCookie(this.cookieName, payload, this.cookieMaxAgeDays);
    } catch (error) {
      // Storage might be blocked; banner remains visible.
    }
  }

  getCurrentPreferences() {
    return {
      necessary: true,
      analytics: Boolean(this.cache.analyticsCheckbox && this.cache.analyticsCheckbox.checked),
      marketing: Boolean(this.cache.marketingCheckbox && this.cache.marketingCheckbox.checked),
    };
  }

  isValidPreferences(preferences) {
    return Boolean(
      preferences &&
        typeof preferences === "object" &&
        typeof preferences.necessary === "boolean" &&
        typeof preferences.analytics === "boolean" &&
        typeof preferences.marketing === "boolean"
    );
  }

  toggleDetails() {
    if (this.element.classList.contains("is-expanded")) {
      this.collapseDetails();
    } else {
      this.expandDetails();
    }
  }

  collapseDetails() {
    this.element.classList.remove("is-expanded");
    if (this.cache.toggleButton) {
      this.cache.toggleButton.setAttribute("aria-expanded", "false");
    }
    if (this.cache.details) {
      this.cache.details.hidden = true;
    }
  }

  expandDetails() {
    this.element.classList.add("is-expanded");
    if (this.cache.toggleButton) {
      this.cache.toggleButton.setAttribute("aria-expanded", "true");
    }
    if (this.cache.details) {
      this.cache.details.hidden = false;
    }
  }

  applyPreferences(preferences) {
    if (this.cache.analyticsCheckbox) {
      this.cache.analyticsCheckbox.checked = Boolean(preferences.analytics);
    }
    if (this.cache.marketingCheckbox) {
      this.cache.marketingCheckbox.checked = Boolean(preferences.marketing);
    }
  }

  open(expandDetails = false) {
    const storedPreferences = this.getStoredPreferences();
    if (storedPreferences) {
      this.applyPreferences(storedPreferences);
    }

    this.element.classList.remove("is-hidden");
    this.element.classList.add("is-visible");
    if (expandDetails) {
      this.expandDetails();
    } else {
      this.collapseDetails();
    }
  }

  hideBanner() {
    this.element.classList.remove("is-visible");
    this.element.classList.add("is-hidden");
    this.collapseDetails();
  }


  setCookie(name, value, maxAgeDays) {
    const maxAge = maxAgeDays * 24 * 60 * 60;
    document.cookie = `${name}=${value}; max-age=${maxAge}; path=/; samesite=lax`;
  }

  getCookie(name) {
    const needle = `${name}=`;
    return document.cookie
      .split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith(needle))
      ?.slice(needle.length) || null;
  }
}

export default CookieConsent;

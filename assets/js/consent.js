/* ============================================================
   Einwilligung & Google Analytics
   ------------------------------------------------------------
   Die Mess-ID unten eintragen (Format G-XXXXXXXXXX), dann ist
   die Messung aktiv. Solange sie leer ist, passiert gar nichts:
   kein Banner, keine Cookies, keine Verbindung zu Google.
   ============================================================ */

(function () {
  var GA_ID = "";              // <-- hier die Mess-ID aus Google Analytics eintragen
  var KEY = "ertlerhof-consent";

  if (!GA_ID) return;

  var store = {
    get: function () {
      try { return localStorage.getItem(KEY); } catch (e) { return null; }
    },
    set: function (v) {
      try { localStorage.setItem(KEY, v); } catch (e) {}
    }
  };

  // Consent Mode: erst einmal alles verweigert, bis zugestimmt wird.
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500
  });

  var loaded = false;
  function loadAnalytics() {
    gtag("consent", "update", { analytics_storage: "granted" });
    if (loaded) return;
    loaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", GA_ID);
  }

  /* ---------- Banner ---------- */

  var banner = null;

  function closeBanner() {
    if (!banner) return;
    banner.remove();
    banner = null;
    document.body.classList.remove("consent-open");
  }

  function decide(value) {
    store.set(value);
    if (value === "granted") loadAnalytics();
    closeBanner();
  }

  function showBanner() {
    if (banner) return;
    banner = document.createElement("div");
    banner.className = "consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-modal", "false");
    banner.setAttribute("aria-label", "Hinweis zur Statistik");
    banner.innerHTML =
      '<div class="consent-inner">' +
        '<div class="consent-text">' +
          '<strong>Dürfen wir mitzählen?</strong>' +
          '<p>Wir würden gerne mit Google Analytics erfassen, welche Seiten aufgerufen werden — ' +
            'damit wir wissen, was euch interessiert. Dafür werden Cookies gesetzt und Daten an ' +
            'Google übertragen. Ohne deine Zustimmung passiert nichts, und die Seite ' +
            'funktioniert genauso. Mehr dazu in der ' +
            '<a href="' + (window.CONSENT_PRIVACY_URL || "impressum.html") + '#datenschutz">Datenschutzerklärung</a>.</p>' +
        '</div>' +
        '<div class="consent-actions">' +
          '<button type="button" class="consent-btn consent-no">Nein, danke</button>' +
          '<button type="button" class="consent-btn consent-yes">Einverstanden</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);
    document.body.classList.add("consent-open");
    banner.querySelector(".consent-yes").addEventListener("click", function () { decide("granted"); });
    banner.querySelector(".consent-no").addEventListener("click", function () { decide("denied"); });
    banner.querySelector(".consent-yes").focus();
  }

  /* ---------- Start ---------- */

  var saved = store.get();
  if (saved === "granted") {
    loadAnalytics();
  } else if (saved !== "denied") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", showBanner);
    } else {
      showBanner();
    }
  }

  // Erlaubt es, die Entscheidung später zu ändern:
  // <a href="#" onclick="ertlerhofConsent.open(); return false">Cookie-Einstellungen</a>
  window.ertlerhofConsent = {
    open: function () { showBanner(); },
    status: function () { return store.get() || "offen"; }
  };
})();

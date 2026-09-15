/* ============================================================
   Einwilligung & Google Analytics
   ------------------------------------------------------------
   Die Mess-ID unten eintragen (Format G-XXXXXXXXXX), dann ist
   die Messung aktiv. Solange sie leer ist, passiert gar nichts:
   kein Banner, keine Cookies, keine Verbindung zu Google.
   ============================================================ */

(function () {
  var GA_ID = "G-80NGLHMFLP";              // <-- hier die Mess-ID aus Google Analytics eintragen
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

  // Bei Ablehnung oder Widerruf: bereits gesetzte Google-Cookies wieder entfernen
  // und die Messung für diese Mess-ID abschalten.
  function clearAnalytics() {
    gtag("consent", "update", { analytics_storage: "denied" });
    window["ga-disable-" + GA_ID] = true;

    var host = location.hostname;
    var scopes = ["", host, "." + host];
    var parts = host.split(".");
    if (parts.length > 2) scopes.push("." + parts.slice(-2).join("."));

    document.cookie.split(";").forEach(function (raw) {
      var name = raw.split("=")[0].trim();
      if (!/^_ga|^_gid$|^_gat/.test(name)) return;
      scopes.forEach(function (d) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" +
          (d ? "; domain=" + d : "");
      });
    });
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
    if (value === "granted") { loadAnalytics(); } else { clearAnalytics(); }
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
  } else if (saved === "denied") {
    clearAnalytics();
  } else {
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

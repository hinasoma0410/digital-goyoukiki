(function () {
  "use strict";

  const config = window.SITE_CONFIG || {};
  const isSet = (value) => Boolean(value && !String(value).startsWith("TODO"));

  document.querySelectorAll("[data-config]").forEach((element) => {
    const value = config[element.dataset.config];
    if (isSet(value)) element.textContent = value;
  });

  const publicUrl = isSet(config.publicUrl) ? config.publicUrl.replace(/\/$/, "") : "";
  if (publicUrl) {
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = publicUrl + (location.pathname.endsWith("privacy.html") ? "/privacy.html" : "/");
    document.head.appendChild(canonical);
    document.querySelectorAll('[data-meta-url]').forEach((meta) => meta.content = canonical.href);
  }

  const lineLinks = document.querySelectorAll("[data-line-link]");
  lineLinks.forEach((link) => {
    if (isSet(config.lineUrl)) {
      link.href = config.lineUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.removeAttribute("aria-disabled");
      link.classList.remove("is-disabled");
      link.querySelector(".button-note")?.remove();
    } else {
      link.href = "#consultation";
      link.setAttribute("aria-disabled", "true");
      link.classList.add("is-disabled");
      link.addEventListener("click", (event) => event.preventDefault());
    }
  });

  const menuButton = document.querySelector("[data-menu-button]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const closeMenu = () => {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
    document.body.classList.remove("menu-open");
  };
  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(open));
      mobileMenu.hidden = !open;
      document.body.classList.toggle("menu-open", open);
    });
    mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") { closeMenu(); menuButton.focus(); }
    });
  }

  const form = document.querySelector("[data-consultation-form]");
  if (form) {
    const status = form.querySelector("[data-form-status]");
    const submitButton = form.querySelector('button[type="submit"]');
    let submitting = false;

    const setStatus = (message, type) => {
      status.textContent = message;
      status.className = `form-status ${type || ""}`;
      status.focus();
    };

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (submitting) return;
      status.textContent = "";

      if (!form.checkValidity()) {
        form.reportValidity();
        setStatus("未入力または形式に誤りがある項目をご確認ください。", "error");
        return;
      }
      if (form.elements.website.value) return;
      if (!isSet(config.formEndpoint)) {
        setStatus("フォーム送信先は準備中です。設定完了までは送信されません。", "error");
        return;
      }

      submitting = true;
      submitButton.disabled = true;
      submitButton.dataset.originalText = submitButton.textContent;
      submitButton.textContent = "送信中…";
      setStatus("送信しています。画面を閉じずにお待ちください。", "pending");

      try {
        const response = await fetch(config.formEndpoint, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });
        if (!response.ok) throw new Error("Request failed");
        form.reset();
        setStatus("送信しました。内容を確認のうえご連絡します。", "success");
      } catch (_) {
        setStatus("送信できませんでした。時間をおいて再度お試しください。", "error");
      } finally {
        submitting = false;
        submitButton.disabled = false;
        submitButton.textContent = submitButton.dataset.originalText;
      }
    });
  }

  if (/^G-[A-Z0-9]+$/.test(config.gaMeasurementId || "")) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.gaMeasurementId)}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", config.gaMeasurementId);
  }
})();

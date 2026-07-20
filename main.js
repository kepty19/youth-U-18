(() => {
  const header = document.getElementById("site-header");
  const reveals = document.querySelectorAll("[data-reveal]");

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

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
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );

    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  requestAnimationFrame(() => {
    document.querySelectorAll(".hero [data-reveal]").forEach((el) => {
      el.classList.add("is-visible");
    });
  });

  const modal = document.getElementById("contact-modal");
  const form = document.getElementById("contact-form");
  const formPanel = document.getElementById("contact-form-panel");
  const successPanel = document.getElementById("contact-success");
  const errorEl = document.getElementById("contact-error");
  const submitBtn = document.getElementById("contact-submit");
  const openers = document.querySelectorAll(".contact-open");
  const closers = document.querySelectorAll("[data-contact-close]");

  const WEB3FORMS_ACCESS_KEY = "bcb8a667-538a-4b4c-a0a6-f6f88f95aa08";
  let lastFocused = null;

  const setError = (message) => {
    if (!errorEl) return;
    if (!message) {
      errorEl.hidden = true;
      errorEl.textContent = "";
      return;
    }
    errorEl.hidden = false;
    errorEl.textContent = message;
  };

  const resetContactState = () => {
    form?.reset();
    setError(null);
    if (formPanel) formPanel.hidden = false;
    if (successPanel) successPanel.hidden = true;
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  };

  const openContact = () => {
    if (!modal) return;
    lastFocused = document.activeElement;
    resetContactState();
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("contact-open");
    const firstField = document.getElementById("contact-name");
    window.setTimeout(() => firstField?.focus(), 50);
  };

  const closeContact = () => {
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("contact-open");
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  };

  openers.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      openContact();
    });
  });

  closers.forEach((btn) => {
    btn.addEventListener("click", closeContact);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal && !modal.hidden) {
      closeContact();
    }
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    setError(null);

    const data = new FormData(form);
    const userName = String(data.get("userName") || "").trim();
    const userEmail = String(data.get("userEmail") || "").trim();
    const userMessage = String(data.get("userMessage") || "").trim();

    if (!userName || !userEmail || !userMessage) {
      setError("必須項目をすべて入力してください。");
      return;
    }

    const payload = new FormData();
    payload.append("access_key", WEB3FORMS_ACCESS_KEY);
    payload.append("subject", "【Kepty English U-18】お問い合わせ");
    payload.append("from_name", userName);
    payload.append("name", userName);
    payload.append("email", userEmail);
    payload.append("replyto", userEmail);
    payload.append(
      "message",
      `お名前: ${userName}\nメールアドレス: ${userEmail}\n\nお問い合わせ内容:\n${userMessage}`
    );

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: payload,
      });
      const result = await response.json();

      if (response.ok && result.success) {
        if (formPanel) formPanel.hidden = true;
        if (successPanel) successPanel.hidden = false;
        form.reset();
        return;
      }

      setError(result.message || "送信に失敗しました。しばらくしてから再度お試しください。");
    } catch {
      setError(
        "送信に失敗しました。通信環境をご確認のうえ、contact@kepty.co へ直接メールでもお問い合わせください。"
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
    }
  });
})();

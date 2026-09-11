(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var navToggle = document.getElementById("nav-toggle");
  var primaryNav = document.getElementById("primary-nav");
  var footerYear = document.getElementById("footer-year");

  if (footerYear) {
    footerYear.textContent = String(new Date().getFullYear());
  }

  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.pageYOffset > 12);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeNav() {
    if (!primaryNav || !navToggle) return;
    primaryNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Toggle navigation");
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", function () {
      var open = primaryNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close navigation" : "Toggle navigation");
    });

    primaryNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
  }

  document.addEventListener("click", function (e) {
    if (!primaryNav || !primaryNav.classList.contains("is-open")) return;
    if (!primaryNav.contains(e.target) && !navToggle.contains(e.target)) closeNav();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("revealed");
    });
  }

  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-target"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1300;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll(".count");
  if (counters.length && "IntersectionObserver" in window) {
    var countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) {
      countObserver.observe(el);
    });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute("data-target") + (el.getAttribute("data-suffix") || "");
    });
  }

  var form = document.getElementById("contact-form");
  if (!form) return;

  var statusEl = document.getElementById("form-status");
  var submitBtn = document.getElementById("form-submit");
  var siteEmail = "info@gforcesecurity.zm";

  function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = "form-status" + (type ? " " + type : "");
  }

  function mailFallback(data) {
    var subject = "Security survey request from " + (data.name || "website enquiry");
    var body = [
      "Name: " + (data.name || ""),
      "Company: " + (data.company || ""),
      "Email: " + (data.email || ""),
      "Phone: " + (data.phone || ""),
      "",
      "Message:",
      data.message || ""
    ].join("\n");
    window.location.href =
      "mailto:" + siteEmail +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var data = {
      name: form.name.value.trim(),
      company: form.company.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      message: form.message.value.trim()
    };

    submitBtn.disabled = true;
    setStatus("Sending your enquiry...", "loading");

    fetch("/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        if (!res.ok) throw new Error("send failed");
        return res.json();
      })
      .then(function (json) {
        if (json && json.success) {
          setStatus("Thank you. Your enquiry has been sent — we will reply within one working day.", "success");
          form.reset();
        } else {
          throw new Error("not accepted");
        }
      })
      .catch(function () {
        setStatus("Online form unavailable — opening your email app to complete the request.", "error");
        mailFallback(data);
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });
})();
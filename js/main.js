(function () {
  "use strict";

  var footerYear = document.getElementById("footer-year");
  if (footerYear) {
    footerYear.textContent = String(new Date().getFullYear());
  }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ready() {
    if (reduce || !Element.prototype.animate) {
      document.querySelectorAll("[data-reveal]").forEach(function (el) {
        el.style.opacity = "1";
      });
      return;
    }

    var ease = "cubic-bezier(0.23, 1, 0.32, 1)";
    document.querySelectorAll("[data-hero]").forEach(function (el, i) {
      el.animate(
        [{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }],
        { duration: 800, delay: 120 + i * 70, easing: ease, fill: "backwards" }
      );
    });

    if (!("IntersectionObserver" in window)) return;
    var vh = window.innerHeight;
    var els = Array.prototype.filter.call(
      document.querySelectorAll("[data-reveal]"),
      function (el) { return el.getBoundingClientRect().top > vh; }
    );
    els.forEach(function (el) { el.style.opacity = "0"; });

    var batch = 0;
    var io = new IntersectionObserver(
      function (entries) {
        entries.filter(function (e) { return e.isIntersecting; }).forEach(function (e) {
          var el = e.target;
          io.unobserve(el);
          var a = el.animate(
            [{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "none" }],
            { duration: 650, delay: (batch++ % 6) * 60, easing: ease, fill: "backwards" }
          );
          el.style.opacity = "";
          a.onfinish = function () { batch = 0; };
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach(function (el) { io.observe(el); });
  }

  ready();

  var form = document.getElementById("contact-form");
  if (!form) return;

  var statusEl = document.getElementById("form-status");
  var submitBtn = document.getElementById("form-submit");
  var siteEmail = "gforcesecure11@gmail.com";

  function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = "form-status" + (type ? " " + type : "");
    statusEl.hidden = !message;
  }

  function mailFallback(d) {
    var subject = "Security survey request from " + (d.name || "website");
    var body = ["Name: " + (d.name || ""), "Company: " + (d.company || ""), "Email: " + (d.email || ""), "Phone: " + (d.phone || ""), "", d.message || ""].join("\n");
    window.location.href = "mailto:" + siteEmail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var d = {};
    ["name", "company", "email", "phone", "message"].forEach(function (k) {
      d[k] = form.elements[k].value.trim();
    });

    submitBtn.disabled = true;
    setStatus("Sending your request...", "");

    fetch("/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(d)
    })
      .then(function (r) { if (!r.ok) throw new Error("failed"); return r.json(); })
      .then(function (j) {
        if (!j || !j.success) throw new Error("rejected");
        setStatus("Thank you. Your request has been received and our team will be in touch.", "success");
        form.reset();
      })
      .catch(function () {
        setStatus("Web form unavailable — opening your email app to send the request.", "error");
        mailFallback(d);
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });
})();
/* ============================================================
   Perform Air — Component MRO Capabilities section
   Paste into: Webflow → Page Settings → Custom Code →
   "Before body tag", wrapped in an opening and closing script tag
   Staggered scroll-reveal for the header and cards.
   Degrades gracefully: with no JS (or reduced motion),
   everything is simply visible.
   ============================================================ */

(function () {
  var items = document.querySelectorAll(".pa-mro-reveal");
  if (!items.length) return;

  // No IntersectionObserver (very old browsers): just show everything.
  if (!("IntersectionObserver" in window)) {
    items.forEach
      ? items.forEach(show)
      : Array.prototype.forEach.call(items, show);
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // Stagger siblings that enter together
        var delay = (parseInt(el.getAttribute("data-pa-index"), 10) || 0) * 90;
        setTimeout(function () {
          show(el);
        }, delay);
        observer.unobserve(el);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );

  Array.prototype.forEach.call(items, function (el, i) {
    el.setAttribute("data-pa-index", i % 6);
    observer.observe(el);
  });

  function show(el) {
    el.classList.add("pa-mro-in");
  }
})();

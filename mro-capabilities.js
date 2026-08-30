/* ============================================================
   Perform Air International — About Us page
   Staggered scroll-reveal for elements with class "pa-reveal".
   Load via jsDelivr before the closing body tag (see setup guide).
   Degrades gracefully: with no JS or reduced motion, everything
   is simply visible.
   ============================================================ */

(function () {
  var items = document.querySelectorAll(".pa-reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(items, show);
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
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
    el.classList.add("pa-in");
  }
})();

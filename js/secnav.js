/* The buttons at the bottom of every section: Previous section, Home, Next section.
   Order of the workbook: Home, A (listen), B (words), C (rule 1), D (rule 2), E (phonics). */
(() => {
  "use strict";

  const SECTIONS = [
    { key: "a", href: "listen.html" },
    { key: "b", href: "words.html" },
    { key: "c", href: "rule1.html" },
    { key: "d", href: "rule2.html" },
    { key: "e", href: "phonics.html" },
  ];

  function button(href, cls, html) {
    const a = document.createElement("a");
    a.className = "nav-btn " + cls;
    a.href = href;
    a.innerHTML = html;
    return a;
  }

  // options.homeOnly: show just the Home button (used on the early steps/parts of a section)
  window.LRL_buildSecNav = function (key, options) {
    const homeOnly = !!(options && options.homeOnly);
    const i = SECTIONS.findIndex((s) => s.key === key);
    const nav = document.createElement("nav");
    nav.className = "secbottom";
    nav.setAttribute("aria-label", "Move between sections");

    // Section A has no previous section: its "previous" is Home, which is already offered
    if (i > 0 && !homeOnly) {
      nav.appendChild(button(SECTIONS[i - 1].href, "prev",
        '<span class="ico" aria-hidden="true">◀</span><span class="lbl"><span class="en">Previous section</span><span class="bn">আগের সেকশন</span></span>'));
    }
    nav.appendChild(button("index.html", "home",
      '<span class="ico" aria-hidden="true">🏠</span><span class="lbl"><span class="en">Home</span><span class="bn">হোম</span></span>'));
    if (!homeOnly && i >= 0 && i < SECTIONS.length - 1) {
      nav.appendChild(button(SECTIONS[i + 1].href, "next",
        '<span class="lbl"><span class="en">Next section</span><span class="bn">পরের সেকশন</span></span><span class="ico" aria-hidden="true">▶</span>'));
    }
    return nav;
  };

  // pages can also just contain <div data-secnav="b"></div>
  document.querySelectorAll("[data-secnav]").forEach((host) => {
    host.appendChild(window.LRL_buildSecNav(host.dataset.secnav));
  });
})();

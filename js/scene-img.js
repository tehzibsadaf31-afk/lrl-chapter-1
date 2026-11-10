/* Section pictures: look for images/scenes/<name>.jpg, then .png, then .webp,
   and fall back to the old picture until the new one has been added. */
(() => {
  "use strict";
  const EXTS = ["jpg", "png", "webp"];

  window.LRL_sceneImage = function (img, name, fallback) {
    let i = 0;
    img.onerror = function () {
      i++;
      if (i < EXTS.length) img.src = "images/scenes/" + name + "." + EXTS[i];
      else { img.onerror = null; img.src = fallback; }
    };
    img.src = "images/scenes/" + name + "." + EXTS[0];
  };

  document.querySelectorAll("img[data-scene]").forEach((img) =>
    window.LRL_sceneImage(img, img.dataset.scene, img.dataset.fallback));
})();

(() => {
  "use strict";

  const CH = window.LRL_CH1;
  const B = window.LRL_B;
  const AUD = window.LRL_AUDIO || {};
  const synth = "speechSynthesis" in window ? window.speechSynthesis : null;

  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html; // fixed strings only
    return e;
  };
  const txt = (tag, cls, text) => { const e = el(tag, cls); e.textContent = text; return e; };

  /* ---------------- the ten words ---------------- */
  const PALETTE = [
    ["#7e22ce", "#f3e8ff"], ["#0284c7", "#e0f2fe"], ["#ea580c", "#ffedd5"], ["#16a34a", "#dcfce7"],
    ["#d97706", "#fef3c7"], ["#3730a3", "#e0e7ff"], ["#be185d", "#fce7f3"], ["#0f766e", "#ccfbf1"],
    ["#e11d48", "#ffe4e6"], ["#4d7c0f", "#ecfccb"],
  ];
  const items = B.items.map((it, i) => {
    const [sylStr, meaning] = CH.words[it.key];
    const parts = sylStr.split("-");
    return {
      key: it.key, word: it.key, emoji: it.emoji, meaning, pron: CH.vocab[it.key],
      syl: parts.map((s) => s.toLowerCase()),
      stress: parts.length > 1 ? parts.findIndex((s) => /[A-Z]/.test(s)) : -1,
      color: PALETTE[i % PALETTE.length][0], soft: PALETTE[i % PALETTE.length][1],
    };
  });

  /* ---------------- audio ---------------- */
  const SLOW_PLAYBACK = 0.85;
  let current = null;
  let timers = [];
  function stopAudio() {
    if (current) { current.pause(); current = null; }
    timers.forEach(clearTimeout); timers = [];
    if (synth) synth.cancel();
    document.querySelectorAll(".syl.lit").forEach((c) => c.classList.remove("lit"));
  }
  function playWord(item, slow, onMeta) {
    stopAudio();
    const f = slow ? AUD.words && AUD.words[item.key] : (AUD.wordsNormal && AUD.wordsNormal[item.key]) || (AUD.words && AUD.words[item.key]);
    if (f) {
      const a = new Audio(f); current = a;
      // the "slow" clip is already generated slowly (0.7); playing it at 0.85 makes it slower still
      if (slow) a.playbackRate = SLOW_PLAYBACK;
      if (onMeta) a.addEventListener("loadedmetadata", () => onMeta(a.duration / a.playbackRate));
      a.play().catch(() => {});
    } else if (synth) {
      const u = new SpeechSynthesisUtterance(item.word);
      u.lang = "en-GB"; u.rate = slow ? 0.5 : 0.95;
      if (onMeta) onMeta(1.8);
      synth.speak(u);
    }
  }
  // light up the syllable chips one after another while the slow word plays
  function lightSyllables(chips, item, total) {
    const w = item.syl.map((_, i) => (i === item.stress ? 1.5 : 1));
    const sum = w.reduce((a, b) => a + b, 0);
    let t = 0;
    chips.forEach((c, i) => {
      timers.push(setTimeout(() => { chips.forEach((x) => x.classList.remove("lit")); c.classList.add("lit"); }, (t / sum) * total * 1000));
      t += w[i];
      if (i === chips.length - 1) timers.push(setTimeout(() => c.classList.remove("lit"), (t / sum) * total * 1000));
    });
  }

  /* ---------------- the flashcards ---------------- */
  const deck = document.getElementById("deck");

  items.forEach((it, i) => {
    const card = el("article", "fcard");
    card.style.setProperty("--c", it.color);
    card.style.setProperty("--c-soft", it.soft);
    const inner = el("div", "fc-inner");

    // FRONT: the word only - the student guesses the meaning and the pronunciation
    const front = el("button", "fc-front");
    front.type = "button";
    front.setAttribute("aria-label", `Flashcard ${i + 1}: ${it.word}. Press to check the meaning and pronunciation.`);
    front.append(
      txt("span", "fc-no", String(i + 1)),
      txt("span", "fc-emoji", it.emoji),
      txt("span", "fc-word", it.word),
      txt("span", "fc-prompt", "অর্থ ও উচ্চারণ আন্দাজ করো"),
      txt("span", "fc-tap", "👆 ক্লিক করে মিলিয়ে দেখো")
    );

    // BACK: syllables, Bangla pronunciation, Bangla meaning, audio
    const back = el("div", "fc-face fc-back");
    const top = el("div", "fc-back-top");
    top.append(txt("span", "fc-back-word", it.word));
    const flipBack = el("button", "fc-flip", "↺ ফিরে যাও");
    flipBack.type = "button";
    top.appendChild(flipBack);

    const row = el("div", "syl-row");
    const chips = it.syl.map((s, n) => {
      const c = el("span", "syl" + (n === it.stress ? " stress" : ""));
      c.textContent = s;
      row.appendChild(c);
      return c;
    });

    const pron = el("p", "pron");
    pron.append("বাংলা উচ্চারণ: ");
    pron.appendChild(txt("b", "", it.pron));

    const mean = el("div", "meaning", '<span class="k">বাংলা অর্থ</span><span class="v"></span>');
    mean.querySelector(".v").textContent = it.meaning;

    const audioRow = el("div", "audio-row");
    const listen = el("button", "pill listen", '<span aria-hidden="true">🔊</span> Listen <small>শোনো</small>');
    const slow = el("button", "pill slow", '<span aria-hidden="true">🐢</span> Slow <small>ধীরে</small>');
    listen.type = slow.type = "button";
    listen.addEventListener("click", () => playWord(it, false));
    slow.addEventListener("click", () => playWord(it, true, (d) => lightSyllables(chips, it, d)));
    audioRow.append(listen, slow);

    back.append(top, row, pron, mean, audioRow);
    inner.append(front, back);
    card.appendChild(inner);
    deck.appendChild(card);

    // flipping: the hidden side is made inert so it cannot be focused or clicked
    function setFlipped(flipped) {
      card.classList.toggle("flipped", flipped);
      front.inert = flipped;
      back.inert = !flipped;
      back.setAttribute("aria-hidden", flipped ? "false" : "true");
      front.setAttribute("aria-hidden", flipped ? "true" : "false");
    }
    setFlipped(false);

    front.addEventListener("click", () => {
      setFlipped(true);
      setTimeout(() => flipBack.focus({ preventScroll: true }), 250);
      setTimeout(() => playWord(it, false), 300);
    });
    flipBack.addEventListener("click", () => {
      stopAudio();
      setFlipped(false);
      setTimeout(() => front.focus({ preventScroll: true }), 250);
    });
  });
})();

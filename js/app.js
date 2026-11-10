(() => {
  "use strict";

  const CH = window.LRL_CH1;
  const totalParas = CH.parts.reduce((n, p) => n + p.paragraphs.length, 0);
  const AUD =
    window.LRL_AUDIO && window.LRL_AUDIO.paragraphs && window.LRL_AUDIO.paragraphs.length === totalParas
      ? window.LRL_AUDIO
      : null;
  const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
  const $ = (id) => document.getElementById(id);

  $("chapter-title").textContent = CH.title;
  $("closing").textContent = CH.closingQuote || "";

  /* ---------------------------------------------------------------
     Build the story: every word becomes a button we can highlight
     --------------------------------------------------------------- */
  const paras = []; // { text, tokens:[{start,end,key,el,g,word}] }
  const flat = [];  // every token in reading order
  const partRange = []; // [firstParagraph, lastParagraph] for each part
  const sections = [];  // one <section> per part
  const nextBtns = [];
  let curPart = 0;

  const story = $("story");
  CH.parts.forEach((part, pi) => {
    const sec = document.createElement("section");
    sec.className = "part p" + (pi + 1);

    const head = document.createElement("div");
    head.className = "part-head";
    if (part.image) {
      const img = document.createElement("img");
      img.src = part.image;
      img.alt = part.alt || "";
      img.loading = "lazy";
      head.appendChild(img);
    }
    const label = document.createElement("span");
    label.className = "part-label";
    label.textContent = part.label;
    head.appendChild(label);
    sec.appendChild(head);

    const body = document.createElement("div");
    body.className = "part-body";
    sec.appendChild(body);

    const firstPara = paras.length;
    part.paragraphs.forEach((text) => {
      const p = document.createElement("p");
      const tokens = [];
      let last = 0;
      for (const m of text.matchAll(/\S+/g)) {
        if (m.index > last) p.append(text.slice(last, m.index));
        const key = m[0].toLowerCase().replace(/[^a-z]/g, "");
        const b = document.createElement("button");
        b.type = "button";
        b.className = "w" + (CH.vocab[key] ? " vocab" : "");
        b.textContent = m[0];
        const tok = {
          start: m.index, end: m.index + m[0].length, key, el: b, g: flat.length,
          word: m[0].replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, ""),
        };
        b.addEventListener("click", () => openWord(tok));
        p.appendChild(b);
        tokens.push(tok);
        flat.push(tok);
        last = tok.end;
      }
      if (last < text.length) p.append(text.slice(last));
      body.appendChild(p);
      paras.push({ text, tokens, part: pi });
    });
    partRange.push([firstPara, paras.length - 1]);

    // Previous / Next buttons at the end of every part
    const nav = document.createElement("div");
    nav.className = "part-nav";
    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = "nav-btn prev";
    prev.innerHTML = '<span class="ico" aria-hidden="true">◀</span><span class="lbl"><span class="en">Previous</span><span class="bn">আগের অংশ</span></span>';
    prev.disabled = pi === 0;
    prev.addEventListener("click", () => goPart(pi - 1));
    const next = document.createElement("button");
    next.type = "button";
    next.className = "nav-btn next";
    next.innerHTML = '<span class="lbl"><span class="en">Next</span><span class="bn">পরের অংশ</span></span><span class="ico" aria-hidden="true">▶</span>';
    next.disabled = pi === CH.parts.length - 1;
    next.addEventListener("click", () => goPart(pi + 1));
    nav.append(prev, next);
    sec.appendChild(nav);
    nextBtns.push(next);

    sec.hidden = pi !== 0;
    sections.push(sec);
    story.appendChild(sec);
  });

  /* ---------------------------------------------------------------
     Highlighting
     --------------------------------------------------------------- */
  let activeG = -2;

  function setActive(k, i) {
    const tk = paras[k].tokens;
    const tok = tk[Math.max(0, Math.min(i, tk.length - 1))];
    if (tok.g === activeG) return;
    activeG = tok.g;
    // only the word being read is highlighted - no trail behind it
    for (const f of flat) f.el.classList.toggle("active", f.g === tok.g);
    const r = tok.el.getBoundingClientRect();
    if (r.top < 200 || r.bottom > window.innerHeight - 60) {
      tok.el.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }

  function clearHighlight() {
    activeG = -2;
    flat.forEach((f) => f.el.classList.remove("active"));
  }

  function tokenAt(k, charIndex) {
    const t = paras[k].tokens;
    let idx = 0;
    for (let i = 0; i < t.length; i++) {
      if (t[i].start <= charIndex) idx = i; else break;
    }
    return idx;
  }

  /* ---------------------------------------------------------------
     The three buttons: Play, Pause, Slower
     --------------------------------------------------------------- */
  let state = "idle"; // idle | playing | paused | done
  let rate = 1;
  let cur = 0;        // current paragraph

  const playBtn = $("play-btn");
  const pauseBtn = $("pause-btn");
  const slowBtn = $("slow-btn");

  function renderUI() {
    playBtn.disabled = state === "playing";
    pauseBtn.disabled = state !== "playing";
    slowBtn.setAttribute("aria-pressed", rate < 1 ? "true" : "false");
  }

  playBtn.addEventListener("click", () => {
    if (state === "paused") resume();
    else if (state !== "playing") start(partRange[curPart][0]);
  });
  pauseBtn.addEventListener("click", pause);
  slowBtn.addEventListener("click", () => {
    rate = rate < 1 ? 1 : 0.75;
    if (AUD) audio.playbackRate = rate;
    renderUI();
  });

  function start(k) {
    stopEngines();
    clearHighlight();
    state = "playing";
    renderUI();
    if (AUD) playFile(k); else speakChunk(k, 0);
  }

  function pause() {
    if (state !== "playing") return;
    state = "paused";
    if (AUD) { audio.pause(); cancelAnimationFrame(raf); clearTimeout(gapTimer); }
    else { speechRun++; clearInterval(estTimer); synth && synth.cancel(); }
    renderUI();
  }

  function resume() {
    if (state !== "paused") return;
    state = "playing";
    renderUI();
    if (AUD) {
      if (audio.ended) { if (cur < partRange[curPart][1]) playFile(cur + 1); else finish(); }
      else if (!audio.src) playFile(cur);
      else audio.play().then(tick).catch(() => playFile(cur));
    } else speakChunk(cur, spChunk);
  }

  function finish() {
    state = "done";
    renderUI();
    clearHighlight();
    // gently point at the Next button when this part has been read
    const nb = nextBtns[curPart];
    if (nb && !nb.disabled) {
      nb.classList.add("nudge");
      setTimeout(() => nb.classList.remove("nudge"), 4000);
    }
  }

  // Home at the bottom of every part; after the last part also Next section
  const secNav = $("section-nav");
  const updateSecNav = () => {
    if (!secNav || !window.LRL_buildSecNav) return;
    secNav.hidden = false;
    secNav.textContent = "";
    secNav.appendChild(window.LRL_buildSecNav("a", { homeOnly: curPart !== sections.length - 1 }));
  };

  function goPart(i) {
    if (i < 0 || i >= sections.length) return;
    stopEngines();
    state = "idle";
    clearHighlight();
    curPart = i;
    cur = partRange[i][0];
    sections.forEach((s, n) => { s.hidden = n !== i; });
    $("closing").hidden = i !== sections.length - 1;
    updateSecNav();
    renderUI();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function stopEngines() {
    cancelAnimationFrame(raf);
    clearInterval(estTimer);
    clearTimeout(gapTimer);
    speechRun++;
    if (AUD) audio.pause();
    if (synth) synth.cancel();
  }

  /* ---------------------------------------------------------------
     Engine 1: pre-generated ElevenLabs audio (audio/manifest.js)
     --------------------------------------------------------------- */
  const audio = new Audio();
  audio.preload = "auto";
  let raf = 0;
  let gapTimer = 0;

  function playFile(k) {
    cur = k;
    audio.src = AUD.paragraphs[k].file;
    audio.defaultPlaybackRate = rate;
    audio.playbackRate = rate;
    setActive(k, 0);
    audio.play().then(tick).catch(() => { state = "paused"; renderUI(); });
  }

  function tick() {
    cancelAnimationFrame(raf);
    const loop = () => {
      if (state !== "playing") return;
      const t = audio.currentTime;
      const w = AUD.paragraphs[cur].words;
      let idx = 0;
      for (let i = 0; i < w.length; i++) { if (w[i][0] <= t + 0.03) idx = i; else break; }
      setActive(cur, idx);
      raf = requestAnimationFrame(loop);
    };
    loop();
  }

  audio.addEventListener("ended", () => {
    if (!AUD || state !== "playing") return;
    cancelAnimationFrame(raf);
    if (cur < partRange[curPart][1]) {
      gapTimer = setTimeout(() => { if (state === "playing") playFile(cur + 1); }, 350);
    } else finish();
  });

  /* ---------------------------------------------------------------
     Engine 2: browser voice (preview mode, used until audio exists)
     --------------------------------------------------------------- */
  const chunks = paras.map((p) =>
    [...p.text.matchAll(/[^.!?]+[.!?]+["”’]*\s*|[^.!?]+$/g)].map((m) => ({ start: m.index, text: m[0] }))
  );
  let voice = null;
  let speechRun = 0;
  let spChunk = 0;
  let estTimer = 0;

  function pickVoice() {
    if (!synth) return;
    const v = synth.getVoices();
    voice =
      v.find((x) => x.lang === "en-GB" && x.localService) ||
      v.find((x) => x.lang === "en-GB") ||
      v.find((x) => x.lang.startsWith("en") && x.localService) ||
      v.find((x) => x.lang.startsWith("en")) || null;
  }
  if (synth) { pickVoice(); synth.addEventListener("voiceschanged", pickVoice); }

  function speakChunk(k, c) {
    if (!synth) return;
    synth.cancel();
    clearInterval(estTimer);
    const run = ++speechRun;
    cur = k; spChunk = c;
    const ch = chunks[k][c];
    setActive(k, tokenAt(k, ch.start));

    const u = new SpeechSynthesisUtterance(ch.text.trim());
    u.lang = "en-GB";
    if (voice) u.voice = voice;
    u.rate = 0.95 * rate;

    let gotBoundary = false;
    u.onstart = () => {
      const t0 = performance.now();
      estTimer = setInterval(() => {
        if (gotBoundary || run !== speechRun) { clearInterval(estTimer); return; }
        if (performance.now() - t0 < 700) return;
        const secs = (performance.now() - t0 - 300) / 1000;
        setActive(k, tokenAt(k, ch.start + Math.max(0, secs * 14 * u.rate)));
      }, 90);
    };
    u.onboundary = (e) => {
      if (run !== speechRun) return;
      if (e.name && e.name !== "word") return;
      gotBoundary = true;
      setActive(k, tokenAt(k, ch.start + e.charIndex));
    };
    const next = () => {
      if (run !== speechRun || state !== "playing") return;
      clearInterval(estTimer);
      if (c + 1 < chunks[k].length) speakChunk(k, c + 1);
      else if (k < partRange[curPart][1]) speakChunk(k + 1, 0);
      else finish();
    };
    u.onend = next;
    u.onerror = next;
    synth.speak(u);
  }

  /* ---------------------------------------------------------------
     Word pop-up: syllables, Bangla meaning, slow pronunciation
     --------------------------------------------------------------- */
  const dlg = $("word-dialog");
  const wordAudio = new Audio();
  let lastWord = null;

  const bnDigits = "০১২৩৪৫৬৭৮৯";
  const bn = (n) => String(n).replace(/\d/g, (d) => bnDigits[d]);

  function openWord(tok) {
    if (state === "playing") pause();
    lastWord = tok;
    const entry = CH.words[tok.key];
    const syllables = entry ? entry[0].split("-") : [tok.word.toLowerCase()];
    const multi = syllables.length > 1;

    $("wd-word").textContent = tok.word;
    const box = $("wd-syl");
    box.textContent = "";
    syllables.forEach((s) => {
      const d = document.createElement("span");
      d.className = "syl" + (multi && /[A-Z]/.test(s) ? " stress" : "");
      d.textContent = s.toLowerCase();
      box.appendChild(d);
    });
    $("wd-syl-note").textContent = multi
      ? bn(syllables.length) + "টি Syllable · কমলা অংশে জোর (stress) দাও"
      : "১টি Syllable";

    // every word gets a Bangla pronunciation line; the star tag marks the chapter's new words
    const isVocab = !!CH.vocab[tok.key];
    const pron = CH.vocab[tok.key] || (CH.pron && CH.pron[tok.key]);
    dlg.classList.toggle("is-vocab", isVocab);
    $("wd-tag").hidden = !isVocab;
    const pronEl = $("wd-pron");
    pronEl.hidden = !pron;
    pronEl.textContent = "";
    if (pron) {
      pronEl.append("বাংলা উচ্চারণ: ");
      const parts = pron.split("-");
      const aligned = multi && parts.length === syllables.length;
      parts.forEach((part, i) => {
        if (i) pronEl.append("-");
        const s = document.createElement("span");
        s.className = "pron-part" + (aligned && /[A-Z]/.test(syllables[i]) ? " stress" : "");
        s.textContent = part;
        pronEl.appendChild(s);
      });
    }

    $("wd-bn").textContent = entry ? entry[1] : "এই শব্দের অর্থ এখনো যোগ করা হয়নি";

    if (!dlg.open) dlg.showModal();
    playWord(tok);
  }

  function playWord(tok) {
    stopWord();
    if (AUD && AUD.words && AUD.words[tok.key]) {
      wordAudio.src = AUD.words[tok.key];
      wordAudio.playbackRate = 1;
      wordAudio.play().catch(() => {});
    } else if (synth) {
      speechRun++;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(tok.word);
      u.lang = "en-GB";
      if (voice) u.voice = voice;
      u.rate = 0.5;
      synth.speak(u);
    }
  }

  function stopWord() {
    wordAudio.pause();
    if (synth) synth.cancel();
  }

  $("wd-replay").addEventListener("click", () => lastWord && playWord(lastWord));
  $("wd-close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", stopWord);

  /* ---------------------------------------------------------------
     Preview-mode notice
     --------------------------------------------------------------- */
  const note = $("mode-note");
  if (!AUD) {
    note.hidden = false;
    note.textContent = synth
      ? "Preview mode: this page is using your browser's built-in voice. Run tools/generate-audio.ps1 to add ElevenLabs audio, then reload."
      : "This browser has no speech support and no ElevenLabs audio has been generated yet. Run tools/generate-audio.ps1.";
  }

  $("closing").hidden = sections.length > 1;
  updateSecNav();
  renderUI();
})();

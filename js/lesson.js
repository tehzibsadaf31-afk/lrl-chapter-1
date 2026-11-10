(() => {
  "use strict";

  const L = window.LRL_LESSON;
  const AUD = window.LRL_AUDIO || {};
  const synth = "speechSynthesis" in window ? window.speechSynthesis : null;

  document.body.classList.add("theme-" + L.theme);

  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html; // fixed, trusted strings from the data files only
    return e;
  };
  const txt = (tag, cls, text) => { const e = el(tag, cls); e.textContent = text; return e; };
  const bnDigits = "০১২৩৪৫৬৭৮৯";
  const bn = (n) => String(n).replace(/\d/g, (d) => bnDigits[d]);
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const roleOf = (r) => L.roles[r];

  /* ---------------------------------------------------------------- audio */
  let current = null;
  let timers = [];
  function stopAudio() {
    if (current) { current.pause(); current = null; }
    timers.forEach(clearTimeout); timers = [];
    if (synth) synth.cancel();
    document.querySelectorAll(".lit").forEach((n) => n.classList.remove("lit"));
  }
  function speak(text, rate) {
    if (!synth) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-GB"; u.rate = rate || 0.95;
    synth.speak(u);
  }
  function playClip(id, text) {
    stopAudio();
    const f = AUD.clips && AUD.clips[id];
    if (f) { current = new Audio(f); current.play().catch(() => {}); } else speak(text);
  }
  function playSlow(word, onMeta) {
    stopAudio();
    const f = AUD.words && AUD.words[word];
    if (f) {
      const a = new Audio(f); current = a;
      if (onMeta) a.addEventListener("loadedmetadata", () => onMeta(a.duration));
      a.play().catch(() => {});
    } else { if (onMeta) onMeta(1.8); speak(word, 0.5); }
  }
  function listenBtn(id, text, label) {
    const b = el("button", "pill listen", `<span aria-hidden="true">🔊</span> ${label || 'Listen <small>শোনো</small>'}`);
    b.type = "button";
    b.addEventListener("click", () => playClip(id, text));
    return b;
  }
  function slowBtn(word) {
    const b = el("button", "pill slow", '<span aria-hidden="true">🐢</span> Slow <small>ধীরে</small>');
    b.type = "button";
    b.addEventListener("click", () => playSlow(word));
    return b;
  }

  function burst(anchor) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = anchor.getBoundingClientRect();
    ["⭐", "🎉", "✨", "🌟", "🎈", "⭐", "✨", "🎉"].forEach((em) => {
      const s = el("span", "burst");
      s.textContent = em;
      s.style.left = r.left + r.width / 2 + "px";
      s.style.top = r.top + r.height / 2 + "px";
      s.style.setProperty("--dx", Math.round((Math.random() - 0.5) * 220) + "px");
      s.style.setProperty("--dy", Math.round(-60 - Math.random() * 140) + "px");
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1100);
    });
  }

  /* ----------------------------------------------------------- building blocks */
  const POSITIONS = ["শুরু · FIRST", "মাঝ · MIDDLE", "শেষ · LAST"];
  const sentenceText = (chunks) => chunks.map((c) => c.t).join(" ");

  function chunkBlock(c, withNote) {
    const b = el("div", "ck show");
    b.style.setProperty("--rc", roleOf(c.r).color);
    b.append(txt("span", "ck-t", c.t), txt("span", "ck-r", roleOf(c.r).en));
    if (withNote && c.note) b.append(txt("span", "ck-n", c.note));
    return b;
  }
  function chunkRow(chunks, withNote) {
    const row = el("div", "ck-row");
    chunks.forEach((c) => row.appendChild(chunkBlock(c, withNote)));
    return row;
  }
  function legend(roles) {
    const row = el("div", "legend");
    row.appendChild(txt("span", "legend-k", "🎨 রঙের মানে:"));
    roles.forEach((r) => {
      const p = el("span", "lg");
      p.style.setProperty("--rc", roleOf(r).color);
      p.append(txt("b", "", roleOf(r).en), txt("small", "", roleOf(r).bn));
      row.appendChild(p);
    });
    return row;
  }

  /* --------------------------------------------------------------- page shell */
  const app = document.getElementById("app");

  const hero = el("header", "hero");
  const hi = el("div", "hero-inner");
  const ht = el("div", "hero-text");
  ht.append(
    txt("p", "eyebrow", "LRL Series · Chapter 1"),
    txt("h1", "", L.title),
    el("p", "hero-sub", `<span class="chip">${L.letter}</span> <span class="sub-t"></span>`)
  );
  ht.querySelector(".sub-t").textContent = L.subtitle;
  const himg = el("img", "hero-img");
  himg.alt = L.heroAlt || "";
  // new picture at images/scenes/<scene>.jpg|png|webp; the old picture shows until it exists
  if (window.LRL_sceneImage && L.scene) window.LRL_sceneImage(himg, L.scene, L.hero);
  else himg.src = L.hero;
  hi.append(ht, himg);
  hero.appendChild(hi);

  // the four steps, shown one at a time: Notice -> Discover -> Explain -> Apply
  const STEPS = [
    ["👀", "Notice", "দেখো"], ["🤔", "Discover", "ভাবো"], ["💡", "Explain", "বোঝো"], ["✍️", "Apply", "করো"],
  ];
  const ctlWrap = el("div", "controls-wrap");
  const ctl = el("div", "controls four");
  ctl.setAttribute("role", "tablist");
  const tabs = STEPS.map((s, i) => {
    const b = el("button", "ctl st-" + (i + 1), `<span class="ico" aria-hidden="true">${s[0]}</span><span class="en">${s[1]}</span><span class="bn">${s[2]}</span>`);
    b.type = "button";
    b.setAttribute("role", "tab");
    b.addEventListener("click", () => goStep(i));
    ctl.appendChild(b);
    return b;
  });
  ctlWrap.appendChild(ctl);

  const main = el("main", "wrap");
  const stage = el("section", "stage");
  main.appendChild(stage);
  app.append(hero, ctlWrap, main);

  const RENDER = {
    examples: renderExamples,
    "phonics-notice": renderPhonicsNotice,
    discover: renderDiscover,
    explain: renderExplain,
    apply: renderApply,
  };

  let stepIdx = 0;
  function goStep(i, scroll = true) {
    stopAudio();
    stepIdx = i;
    tabs.forEach((t, n) => t.setAttribute("aria-selected", n === i ? "true" : "false"));
    const step = L.steps[i];
    stage.textContent = "";
    stage.append(txt("h2", "step-title", step.title), txt("p", "step-intro", step.intro));
    RENDER[step.type](step, stage);
    stepNav(stage);
    // Home at the bottom of every step; on the last step also Previous / Next section
    if (window.LRL_buildSecNav) stage.appendChild(window.LRL_buildSecNav(L.id, { homeOnly: i !== L.steps.length - 1 }));
    if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function stepNav(host) {
    const nav = el("div", "part-nav");
    const prev = el("button", "nav-btn prev", '<span class="ico" aria-hidden="true">◀</span><span class="lbl"><span class="en">Previous</span><span class="bn">আগের ধাপ</span></span>');
    prev.type = "button";
    prev.disabled = stepIdx === 0;
    prev.addEventListener("click", () => goStep(stepIdx - 1));
    nav.appendChild(prev);
    if (stepIdx < L.steps.length - 1) {
      const next = el("button", "nav-btn next", '<span class="lbl"><span class="en">Next</span><span class="bn">পরের ধাপ</span></span><span class="ico" aria-hidden="true">▶</span>');
      next.type = "button";
      next.addEventListener("click", () => goStep(stepIdx + 1));
      nav.appendChild(next);
    }
    host.appendChild(nav);
  }

  /* ------------------------------------------------------------- 1. Notice */
  function renderExamples(step, host) {
    if (step.legend) host.appendChild(legend(step.legend));
    step.examples.forEach((ex, i) => {
      const card = el("article", "ex-card" + (ex.chunks ? " colored" : ""));
      card.appendChild(txt("span", "ex-no", String(i + 1)));
      if (ex.chunks) card.appendChild(chunkRow(ex.chunks));
      else card.appendChild(txt("p", "ex-text", ex.text));
      card.appendChild(listenBtn(ex.clip, ex.text));
      host.appendChild(card);
    });
  }

  function renderPhonicsNotice(step, host) {
    step.words.forEach((w) => {
      const card = el("article", "card ph-card");
      card.style.setProperty("--c", "#ea580c");
      card.style.setProperty("--c-soft", "#ffedd5");
      card.appendChild(txt("h3", "word", w.word));

      // each letter tile plays its own sound, as it is said in this position of the word
      const tiles = el("div", "tiles");
      const tileEls = w.letters.map((ch, i) => {
        const t = el("button", "tile");
        t.type = "button";
        t.setAttribute("aria-label", `${POSITIONS[i]} letter ${ch}: ${w.ipa[i]}. Press to hear the sound.`);
        t.style.setProperty("--rc", roleOf(w.roles[i]).color);
        t.append(txt("span", "tp", POSITIONS[i]), txt("span", "tl", ch), txt("span", "tr", roleOf(w.roles[i]).en), txt("span", "ti", w.ipa[i]), txt("span", "tb", w.bnSounds[i]));
        t.addEventListener("click", () => {
          playClip(w.soundClips[i], ch);
          t.classList.add("lit");
          setTimeout(() => t.classList.remove("lit"), 700);
        });
        tiles.appendChild(t);
        return t;
      });
      card.appendChild(tiles);
      card.appendChild(txt("p", "tile-hint", "👆 Letter-এ ক্লিক করে তার ধ্বনি শোনো"));
      card.appendChild(txt("p", "blend", `${w.bnSounds.join(" + ")} → ${w.bnWord}`));

      const row = el("div", "audio-row");
      const listen = el("button", "pill listen", '<span aria-hidden="true">🔊</span> Listen <small>শোনো</small>');
      const blendBtn = el("button", "pill slow", '<span aria-hidden="true">🔗</span> Blend <small>জোড়া লাগাও</small>');
      listen.type = blendBtn.type = "button";
      listen.addEventListener("click", () => playClip(w.clip, w.word));
      blendBtn.addEventListener("click", () => playSlow(w.word, (d) => {
        const each = (d * 1000) / (tileEls.length + 0.5);
        tileEls.forEach((t, i) => {
          timers.push(setTimeout(() => { tileEls.forEach((x) => x.classList.remove("lit")); t.classList.add("lit"); }, i * each));
        });
        timers.push(setTimeout(() => { tileEls.forEach((x) => x.classList.remove("lit")); tiles.classList.add("joined"); setTimeout(() => tiles.classList.remove("joined"), 1200); }, d * 1000));
      }));
      row.append(listen, blendBtn);
      card.appendChild(row);
      host.appendChild(card);
    });
  }

  /* ----------------------------------------------------------- 2. Discover */
  function renderDiscover(step, host) {
    step.scenes.forEach((sc, si) => {
      const card = el("article", "scene card");
      card.style.setProperty("--c", "var(--theme)");
      card.style.setProperty("--c-soft", "var(--theme-soft)");

      const head = el("div", "scene-head");
      head.append(txt("span", "count", `${bn(si + 1)} / ${bn(step.scenes.length)}`));
      const aud = el("div", "audio-row");
      aud.appendChild(listenBtn(sc.clip, sc.word || sentenceText(sc.chunks)));
      if (sc.word) aud.appendChild(slowBtn(sc.word));
      head.appendChild(aud);
      card.appendChild(head);

      const row = el("div", "ck-row tappable" + (L.id === "e" ? " letters" : ""));
      const chunkEls = sc.chunks.map((c, i) => {
        const b = el("button", "ck tap");
        b.type = "button";
        b.append(txt("span", "ck-t", c.t), txt("span", "ck-r", ""));
        b.addEventListener("click", () => onTap(i));
        row.appendChild(b);
        return b;
      });
      card.appendChild(row);

      const ask = txt("p", "q-ask", "");
      const choices = el("div", "choices");
      const fb = el("p", "tap-fb", "");
      const actions = el("div", "scene-actions");
      card.append(ask, choices, fb, actions);
      host.appendChild(card);

      let qi = 0, tries = 0;
      const reveal = (i) => {
        const b = chunkEls[i];
        b.style.setProperty("--rc", roleOf(sc.chunks[i].r).color);
        b.classList.add("show");
        b.querySelector(".ck-r").textContent = roleOf(sc.chunks[i].r).en;
        b.disabled = true;
      };

      function askNext() {
        choices.textContent = ""; actions.textContent = ""; fb.textContent = ""; tries = 0;
        chunkEls.forEach((b) => b.classList.remove("hint"));
        if (qi >= sc.questions.length) return finishScene();
        const q = sc.questions[qi];
        ask.textContent = q.ask;
        row.classList.toggle("locked", !!q.choices);
        if (q.choices) {
          shuffle(q.choices.slice()).forEach((c) => {
            const b = el("button", "opt opt-bn");
            b.type = "button"; b.textContent = c.t;
            b.addEventListener("click", () => {
              if (c.ok) {
                b.classList.add("right");
                choices.querySelectorAll("button").forEach((x) => { x.disabled = true; });
                fb.className = "tap-fb good";
                fb.textContent = "🎉 সঠিক! " + (q.explain || "");
                burst(b);
                const go = el("button", "nav-btn next", '<span class="lbl"><span class="en">Continue</span><span class="bn">এগিয়ে যাও</span></span><span class="ico" aria-hidden="true">▶</span>');
                go.type = "button";
                go.addEventListener("click", () => { qi++; askNext(); });
                actions.appendChild(go);
                go.focus({ preventScroll: true });
              } else {
                b.classList.add("wrong"); b.disabled = true;
                fb.className = "tap-fb bad";
                fb.textContent = "😅 আবার চেষ্টা করো!";
              }
            });
            choices.appendChild(b);
          });
        }
      }

      function onTap(i) {
        const q = sc.questions[qi];
        if (!q || q.choices) return;
        const ok = q.index != null ? i === q.index : sc.chunks[i].r === q.role;
        if (ok) {
          reveal(i);
          fb.className = "tap-fb good"; fb.textContent = "✓ সঠিক!";
          burst(chunkEls[i]);
          qi++;
          setTimeout(askNext, 650);
        } else {
          tries++;
          const b = chunkEls[i];
          b.classList.add("nope");
          setTimeout(() => b.classList.remove("nope"), 450);
          fb.className = "tap-fb bad"; fb.textContent = "😅 আবার চেষ্টা করো!";
          if (tries >= 2) {
            const target = q.index != null ? q.index : sc.chunks.findIndex((c) => c.r === q.role);
            chunkEls[target].classList.add("hint");
            fb.textContent = "💡 ঝলমল করা অংশটি দেখো!";
          }
        }
      }

      function finishScene() {
        sc.chunks.forEach((c, i) => reveal(i));
        row.classList.add("locked");
        ask.textContent = "✅ দারুণ!";
        fb.className = "tap-fb good";
        fb.textContent = sc.after || "";
        card.classList.add("done");
      }

      askNext();
    });
  }

  /* ------------------------------------------------------------ 3. Explain */
  function renderExplain(step, host) {
    step.cards.forEach((c) => {
      const card = el("article", "xcard xc-" + c.type);
      if (c.type === "text") {
        card.appendChild(el("p", "x-text", c.html));
      } else if (c.type === "formula") {
        const f = el("div", "formula");
        c.parts.forEach((r, i) => {
          if (i) f.appendChild(txt("span", "plus", "+"));
          const b = el("div", "fblock");
          b.style.setProperty("--rc", roleOf(r).color);
          b.append(txt("b", "", roleOf(r).en), txt("small", "", roleOf(r).bn));
          f.appendChild(b);
        });
        card.appendChild(f);
        if (c.caption) card.appendChild(txt("p", "x-cap", c.caption));
      } else if (c.type === "breakdown") {
        card.appendChild(txt("h3", "", c.title));
        card.appendChild(chunkRow(c.chunks, true));
        card.appendChild(listenBtn(c.clip, sentenceText(c.chunks)));
      } else if (c.type === "compare") {
        card.appendChild(txt("h3", "", c.title));
        const g = el("div", "compare");
        [c.left, c.right].forEach((side) => {
          const s = el("div", "cmp");
          s.append(txt("b", "cmp-l", side.label), chunkRow(side.chunks), txt("p", "cmp-n", side.note));
          g.appendChild(s);
        });
        card.appendChild(g);
      } else if (c.type === "sounds") {
        card.appendChild(txt("h3", "", c.title));
        c.items.forEach((it) => {
          const r = el("div", "snd");
          const btn = el("button", "pill listen", '<span aria-hidden="true">🔊</span>');
          btn.type = "button"; btn.setAttribute("aria-label", "Listen to " + it.word);
          btn.addEventListener("click", () => playClip(it.clip, it.word));
          r.append(btn, txt("b", "snd-w", it.text), txt("span", "snd-s", it.sound));
          card.appendChild(r);
        });
      } else if (c.type === "steps") {
        card.appendChild(txt("h3", "", c.title));
        const g = el("ol", "steps");
        c.steps.forEach((s) => {
          const li = el("li", "stp");
          li.append(txt("span", "stp-e", s.emoji), txt("span", "stp-t", s.text));
          g.appendChild(li);
        });
        card.appendChild(g);
      }
      host.appendChild(card);
    });
  }

  /* ------------------------------------------------------------- 4. Apply */
  function renderApply(step, host) {
    const total = step.items.length;
    let solved = 0;
    const summary = el("div", "xcard summary");
    const sumText = txt("p", "sum-t", "");
    const sumBar = el("div", "q-bar", "<div></div>");
    summary.append(sumText, sumBar);
    host.appendChild(summary);

    const finishBlock = el("div", "xcard finish");
    finishBlock.hidden = true;
    finishBlock.appendChild(txt("p", "fin-t", "🏆 এই সেকশনের অনুশীলন শেষ! চমৎকার কাজ!"));

    const updateSummary = () => {
      sumText.textContent = `সম্পন্ন: ${bn(solved)} / ${bn(total)}` + (solved === total ? " 🎉" : "");
      sumBar.firstChild.style.width = (solved / total) * 100 + "%";
      finishBlock.hidden = solved !== total;
    };
    const markSolved = () => { solved++; updateSummary(); };

    const KINDS = { label: labelItem, choice: choiceItem, multi: multiItem, build: buildItem };
    step.items.forEach((it) => {
      const card = el("article", "card item");
      card.style.setProperty("--c", "var(--theme)");
      card.style.setProperty("--c-soft", "var(--theme-soft)");
      card.appendChild(txt("p", "item-prompt", it.prompt));
      host.appendChild(card);
      KINDS[it.kind](it, card);
    });
    host.appendChild(finishBlock);
    updateSummary();

    /* --- pick a role for every part of a sentence --- */
    function labelItem(it, card) {
      card.appendChild(listenBtn(it.clip, sentenceText(it.chunks)));
      const row = el("div", "label-row");
      const chosen = it.chunks.map(() => null);
      let done = false;
      const cols = it.chunks.map((c, i) => {
        const col = el("div", "lcol");
        col.appendChild(txt("div", "lc-t", c.t));
        const rb = el("div", "role-btns");
        it.roles.forEach((r) => {
          const b = el("button", "rbtn", "");
          b.type = "button";
          b.style.setProperty("--rc", roleOf(r).color);
          b.append(txt("b", "", roleOf(r).en), txt("small", "", roleOf(r).bn));
          b.addEventListener("click", () => {
            if (done) return;
            chosen[i] = r;
            rb.querySelectorAll(".rbtn").forEach((x) => x.classList.toggle("on", x === b));
            col.classList.remove("good", "bad");
            col.querySelector(".lc-fix")?.remove();
          });
          rb.appendChild(b);
        });
        col.appendChild(rb);
        row.appendChild(col);
        return col;
      });
      card.appendChild(row);
      const fb = txt("p", "tap-fb", "");
      const check = el("button", "pill check", "✔ Check <small>দেখো ঠিক হলো কি না</small>");
      check.type = "button";
      check.addEventListener("click", () => {
        if (done) return;
        if (chosen.some((c) => c == null)) { fb.className = "tap-fb bad"; fb.textContent = "সব অংশের জন্য একটি করে ভূমিকা বেছে নাও।"; return; }
        let all = true;
        cols.forEach((col, i) => {
          const ok = chosen[i] === it.chunks[i].r;
          col.classList.toggle("good", ok); col.classList.toggle("bad", !ok);
          col.querySelector(".lc-fix")?.remove();
          if (!ok) { all = false; col.appendChild(txt("div", "lc-fix", "✔ " + roleOf(it.chunks[i].r).en)); }
        });
        if (all) {
          done = true; check.disabled = true;
          fb.className = "tap-fb good"; fb.textContent = "🎉 সবগুলো ঠিক হয়েছে!";
          burst(check); markSolved();
        } else {
          fb.className = "tap-fb bad";
          fb.textContent = "😅 কিছু অংশ ঠিক হয়নি। সঠিক উত্তর লাল অংশের নিচে দেওয়া আছে — আবার বেছে ‘Check’ চাপো।";
        }
      });
      card.append(check, fb);
    }

    /* --- listen, then choose one answer --- */
    function choiceItem(it, card) {
      if (it.clip) {
        const row = el("div", "audio-row");
        row.append(listenBtn(it.clip, it.word), slowBtn(it.word));
        card.appendChild(row);
      }
      const opts = el("div", "options syl-options");
      const fb = txt("p", "tap-fb", "");
      let done = false;
      it.choices.forEach((c) => {
        const b = el("button", "opt " + (it.bnOptions ? "opt-bn" : "opt-syl"));
        b.type = "button"; b.textContent = c;
        b.addEventListener("click", () => {
          if (done) return;
          if (c === it.answer) {
            done = true; b.classList.add("right");
            opts.querySelectorAll("button").forEach((x) => { x.disabled = true; });
            fb.className = "tap-fb good"; fb.textContent = "🎉 সঠিক! " + (it.explain || "");
            burst(b); markSolved();
          } else {
            b.classList.add("wrong"); b.disabled = true;
            fb.className = "tap-fb bad"; fb.textContent = "😅 আবার চেষ্টা করো!";
          }
        });
        opts.appendChild(b);
      });
      card.append(opts, fb);
    }

    /* --- tap every word that fits the pattern --- */
    function multiItem(it, card) {
      const wrap = el("div", "mwords");
      const entries = shuffle(it.words.slice()).map((w) => {
        const b = el("button", "mw");
        b.type = "button"; b.textContent = w.t;
        b.setAttribute("aria-pressed", "false");
        return { w, b, sel: false };
      });
      const fb = txt("p", "tap-fb", "");
      let done = false;
      const clearMarks = () => entries.forEach((e) => e.b.classList.remove("good", "bad", "miss"));
      entries.forEach((e) => {
        e.b.addEventListener("click", () => {
          if (done) return;
          e.sel = !e.sel;
          e.b.classList.toggle("sel", e.sel);
          e.b.setAttribute("aria-pressed", e.sel ? "true" : "false");
          clearMarks(); fb.textContent = "";
        });
        wrap.appendChild(e.b);
      });
      const check = el("button", "pill check", "✔ Check <small>দেখো</small>");
      check.type = "button";
      check.addEventListener("click", () => {
        if (done) return;
        if (!entries.some((e) => e.sel)) { fb.className = "tap-fb bad"; fb.textContent = "আগে কিছু শব্দ বেছে নাও।"; return; }
        let bad = 0, miss = 0;
        entries.forEach((e) => {
          const ok = !!e.w.ok;
          e.b.classList.toggle("good", e.sel && ok);
          e.b.classList.toggle("bad", e.sel && !ok);
          e.b.classList.toggle("miss", !e.sel && ok);
          if (e.sel && !ok) bad++;
          if (!e.sel && ok) miss++;
        });
        if (!bad && !miss) {
          done = true; check.disabled = true;
          fb.className = "tap-fb good"; fb.textContent = "🎉 সঠিক! " + (it.explain || "");
          burst(check); markSolved();
        } else {
          fb.className = "tap-fb bad";
          fb.textContent = `😅 ${bad ? "লাল শব্দ(গুলো) CVC নয়। " : ""}${miss ? "ড্যাশ দাগ দেওয়া শব্দ(গুলো) তুমি বাদ দিয়েছ — ওগুলোও CVC। " : ""}আবার চেষ্টা করো।`;
        }
      });
      card.append(wrap, check, fb);
    }

    /* --- listen, then put scrambled letters in order --- */
    function buildItem(it, card) {
      const row = el("div", "audio-row");
      row.append(listenBtn(it.clip, it.word), slowBtn(it.word));
      card.appendChild(row);

      const letters = it.word.split("");
      let order;
      do { order = shuffle(letters.map((_, i) => i)); } while (order.map((i) => letters[i]).join("") === it.word);
      const placed = letters.map(() => null); // tile index in each slot
      let done = false;

      const slots = el("div", "slots");
      const slotEls = letters.map((_, s) => {
        const b = el("button", "slot");
        b.type = "button";
        b.setAttribute("aria-label", "Slot " + (s + 1));
        b.addEventListener("click", () => {
          if (done || placed[s] == null) return;
          placed[s] = null; render();
        });
        slots.appendChild(b);
        return b;
      });
      const pool = el("div", "btiles");
      const tileEls = order.map((li) => {
        const b = el("button", "btile");
        b.type = "button"; b.textContent = letters[li];
        b.addEventListener("click", () => {
          if (done) return;
          const s = placed.indexOf(null);
          if (s < 0) return;
          placed[s] = li; render();
          if (placed.every((p) => p != null)) check();
        });
        pool.appendChild(b);
        return b;
      });
      const fb = txt("p", "tap-fb", "");

      function render() {
        slotEls.forEach((b, s) => { b.textContent = placed[s] == null ? "" : letters[placed[s]]; b.classList.toggle("filled", placed[s] != null); });
        tileEls.forEach((b, i) => { b.disabled = placed.includes(order[i]); });
      }
      function check() {
        const made = placed.map((p) => letters[p]).join("");
        if (made === it.word) {
          done = true;
          slotEls.forEach((b) => b.classList.add("right"));
          fb.className = "tap-fb good"; fb.textContent = `🎉 সঠিক! ${it.word} = ${letters.join(" + ")}`;
          burst(slots); markSolved();
        } else {
          fb.className = "tap-fb bad"; fb.textContent = "😅 শব্দটি মেলেনি। আবার শুনে চেষ্টা করো!";
          slotEls.forEach((b) => b.classList.add("wrong"));
          setTimeout(() => { slotEls.forEach((b) => b.classList.remove("wrong")); placed.fill(null); render(); }, 700);
        }
      }
      render();
      card.append(slots, pool, fb);
    }
  }

  goStep(0, false);
})();

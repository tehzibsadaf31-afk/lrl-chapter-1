window.LRL_LESSON = {
  "id": "e", "letter": "E", "theme": "e", "scene": "phonics",
  "title": "Phonics: CVC Short Vowels",
  "subtitle": "উচ্চারণ ও Decoding · Pronunciation & Decoding",
  "hero": "images/hero.jpg",
  "heroAlt": "Asha, Nila and Tuli look at three big letter blocks that spell b, a, g.",
  "roles": {
    "C": { "en": "Consonant", "bn": "ব্যঞ্জন", "color": "#0284c7" },
    "V": { "en": "Vowel", "bn": "স্বর", "color": "#ea580c" }
  },
  "steps": [
    {
      "type": "phonics-notice",
      "title": "১. গল্পের শব্দ তিনটি দেখো ও শোনো (NOTICE)",
      "intro": "প্রতিটি শব্দ শোনো। Letter-এর ওপর ক্লিক করলে শব্দের ওই জায়গায় (শুরু, মাঝ বা শেষ) তার ধ্বনি শুনতে পাবে। ‘Blend’ চাপলে ধ্বনিগুলো একে একে জ্বলে উঠবে, তারপর জোড়া লেগে শব্দ হবে।",
      "words": [
        {
          "word": "had", "letters": ["h", "a", "d"], "roles": ["C", "V", "C"],
          "ipa": ["/h/", "/æ/", "/d/"], "bnSounds": ["হ্", "অ্যা", "ড্"], "bnWord": "হ্যাড",
          "clip": "e_had", "soundClips": ["s_h", "s_ae", "s_d"]
        },
        {
          "word": "bag", "letters": ["b", "a", "g"], "roles": ["C", "V", "C"],
          "ipa": ["/b/", "/æ/", "/ɡ/"], "bnSounds": ["ব্", "অ্যা", "গ্"], "bnWord": "ব্যাগ",
          "clip": "e_bag", "soundClips": ["s_b", "s_ae", "s_g"]
        },
        {
          "word": "wet", "letters": ["w", "e", "t"], "roles": ["C", "V", "C"],
          "ipa": ["/w/", "/e/", "/t/"], "bnSounds": ["ওয়্", "এ", "ট্"], "bnWord": "ওয়েট্",
          "clip": "e_wet", "soundClips": ["s_w", "s_e", "s_t"]
        }
      ]
    },
    {
      "type": "discover",
      "title": "২. ধ্বনি মিলিয়ে আবিষ্কার করো (DISCOVER)",
      "intro": "শব্দটি শোনো। Letter-গুলোর দিকে তাকিয়ে বোঝার চেষ্টা করো — কোনটি Consonant (C), কোনটি Vowel (V)? তারপর শব্দটি কোন Pattern মেনে চলে, সেটি বেছে নাও।",
      "scenes": [
        {
          "word": "had", "clip": "e_had",
          "chunks": [ { "t": "h", "r": "C" }, { "t": "a", "r": "V" }, { "t": "d", "r": "C" } ],
          "questions": [
            {
              "ask": "had শব্দটি কোন Pattern মেনে চলে? (C = Consonant, V = Vowel)",
              "choices": [ { "t": "CVC", "ok": true }, { "t": "VCC" }, { "t": "CCC" }, { "t": "CVV" } ],
              "explain": "had = Consonant (h) + Vowel (a) + Consonant (d) → CVC।"
            },
            {
              "ask": "শব্দটি শুনে মাঝের Vowel Sound কেমন লাগছে?",
              "choices": [ { "t": "ছোট ও দ্রুত (Short)", "ok": true }, { "t": "লম্বা (Long)" } ],
              "explain": "মাঝের a ছোট ও দ্রুত ধ্বনি দিচ্ছে: /æ/"
            }
          ],
          "after": "👉 had = h + a + d → হ্যাড। Pattern: CVC, মাঝের a = /æ/।"
        },
        {
          "word": "bag", "clip": "e_bag",
          "chunks": [ { "t": "b", "r": "C" }, { "t": "a", "r": "V" }, { "t": "g", "r": "C" } ],
          "questions": [
            {
              "ask": "bag শব্দটি কোন Pattern মেনে চলে?",
              "choices": [ { "t": "CVC", "ok": true }, { "t": "CCV" }, { "t": "VCV" }, { "t": "VVC" } ],
              "explain": "bag = Consonant (b) + Vowel (a) + Consonant (g) → CVC।"
            },
            {
              "ask": "মাঝের Vowel Sound কেমন?",
              "choices": [ { "t": "ছোট ও দ্রুত (Short)", "ok": true }, { "t": "লম্বা (Long)" } ],
              "explain": "bag-এও মাঝের a ছোট ধ্বনি: /æ/"
            }
          ],
          "after": "👉 bag = b + a + g → ব্যাগ। had-এর মতোই Pattern CVC, মাঝের a = /æ/।"
        },
        {
          "word": "wet", "clip": "e_wet",
          "chunks": [ { "t": "w", "r": "C" }, { "t": "e", "r": "V" }, { "t": "t", "r": "C" } ],
          "questions": [
            {
              "ask": "wet শব্দটি কোন Pattern মেনে চলে?",
              "choices": [ { "t": "CVC", "ok": true }, { "t": "VCC" }, { "t": "CCV" }, { "t": "VCV" } ],
              "explain": "wet = Consonant (w) + Vowel (e) + Consonant (t) → CVC।"
            },
            {
              "ask": "মাঝের Vowel Sound কেমন?",
              "choices": [ { "t": "ছোট ও দ্রুত (Short)", "ok": true }, { "t": "লম্বা (Long)" } ],
              "explain": "wet-এ মাঝের e ছোট ধ্বনি: /e/"
            }
          ],
          "after": "👉 wet = w + e + t → ওয়েট্। Pattern CVC, মাঝের e = /e/।"
        }
      ]
    },
    {
      "type": "explain",
      "title": "৩. নিয়মটি বুঝি (EXPLAIN)",
      "intro": "CVC Decoding Rule",
      "cards": [
        { "type": "text", "html": "<b>CVC</b> মানে <b>Consonant + Vowel + Consonant</b>। এক Syllable-এর অনেক সাধারণ CVC শব্দে মাঝের Vowel সাধারণত <b>Short Vowel Sound</b> দেয়।" },
        { "type": "formula", "parts": ["C", "V", "C"], "caption": "যেমন: h + a + d = had" },
        { "type": "text", "html": "💡 মনে রাখবে, বাংলা উচ্চারণ শুধু সহায়ক; সঠিক ইংরেজি ধ্বনি শুনে অনুকরণ করা অত্যন্ত জরুরি।" }
      ]
    },
    {
      "type": "apply",
      "title": "৪. অনুশীলন (PRACTICE)",
      "intro": "দুটি প্রশ্নের উত্তর দিয়ে দেখাও, নিয়মটি তুমি বুঝেছ।",
      "items": [
        {
          "kind": "multi",
          "prompt": "১. নিচের শব্দগুলো গল্প থেকে নেওয়া। যেগুলো CVC শব্দ (Consonant + Vowel + Consonant), সেগুলোতে ক্লিক করে বেছে নাও:",
          "words": [
            { "t": "had", "ok": true }, { "t": "bag", "ok": true }, { "t": "wet", "ok": true },
            { "t": "but", "ok": true }, { "t": "did", "ok": true }, { "t": "not", "ok": true },
            { "t": "road" }, { "t": "still" }, { "t": "rest" }, { "t": "and" }, { "t": "rain" }, { "t": "drew" }
          ],
          "explain": "had, bag, wet, but, did, not — সবগুলোতেই Consonant + Vowel + Consonant। road, rain, drew, still, rest, and অন্য Pattern মেনে চলে।"
        },
        {
          "kind": "choice", "bnOptions": true,
          "prompt": "২. CVC শব্দে মাঝের Vowel সাধারণত কেমন ধ্বনি দেয়?",
          "choices": ["ছোট ও দ্রুত (Short)", "লম্বা (Long)", "কোনো ধ্বনি দেয় না (Silent)"],
          "answer": "ছোট ও দ্রুত (Short)",
          "explain": "যেমন had ও bag-এ a = /æ/, আর wet-এ e = /e/ — দুটোই Short Vowel Sound।"
        }
      ]
    }
  ],
  "next": null
};

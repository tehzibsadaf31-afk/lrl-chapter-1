window.LRL_LESSON = {
  "id": "d", "letter": "D", "theme": "d", "scene": "rule2",
  "title": "Rule 2: Subject + Verb",
  "subtitle": "বাক্য গঠন · Without an Object",
  "hero": "images/part1.jpg",
  "heroAlt": "Arif, Tuli, Saif and Asha run and leap through puddles on a village road after the rain, with empty hands.",
  "roles": {
    "S": { "en": "Subject", "bn": "কে করছে?", "color": "#0284c7" },
    "V": { "en": "Verb", "bn": "কী করছে?", "color": "#ea580c" },
    "O": { "en": "Object", "bn": "কাকে / কী নিয়ে?", "color": "#16a34a" },
    "T": { "en": "Time", "bn": "কখন?", "color": "#7e22ce" },
    "P": { "en": "Place / Direction", "bn": "কোথায়? কোন দিকে?", "color": "#0f766e" },
    "M": { "en": "State / Manner", "bn": "কেমন? কীভাবে?", "color": "#b45309" }
  },
  "steps": [
    {
      "type": "examples",
      "title": "১. উদাহরণ দেখে পার্থক্য খোঁজো (NOTICE)",
      "intro": "প্রতিটি বাক্য শোনো ও পড়ো। রং দেখে বোঝো — কোন অংশটির কী কাজ। এবার লক্ষ করো, কোনো বাক্যে কি “কাকে/কী” (সবুজ রঙের Object) অংশটি আছে?",
      "legend": ["S", "V", "T", "P", "M"],
      "examples": [
        {
          "clip": "d_ex1", "text": "Asha smiled.",
          "chunks": [ { "t": "Asha", "r": "S" }, { "t": "smiled.", "r": "V" } ]
        },
        {
          "clip": "d_ex2", "text": "Every morning, Asha walked along a muddy road to school.",
          "chunks": [ { "t": "Every morning,", "r": "T" }, { "t": "Asha", "r": "S" }, { "t": "walked", "r": "V" }, { "t": "along a muddy road to school.", "r": "P" } ]
        },
        {
          "clip": "d_ex3", "text": "The road filled with water.",
          "chunks": [ { "t": "The road", "r": "S" }, { "t": "filled", "r": "V" }, { "t": "with water.", "r": "M" } ]
        }
      ]
    },
    {
      "type": "discover",
      "title": "২. নিজে ভাবো (DISCOVER)",
      "intro": "প্রশ্ন পড়ে বাক্যের সঠিক অংশে ক্লিক করো, অথবা সঠিক উত্তর বেছে নাও।",
      "scenes": [
        {
          "clip": "d_ex1",
          "chunks": [ { "t": "Asha", "r": "S" }, { "t": "smiled.", "r": "V" } ],
          "questions": [
            { "ask": "কে হাসল?", "role": "S" },
            { "ask": "কী করল?", "role": "V" },
            {
              "ask": "“smiled”-এর পরে কি কোনো Object আছে?",
              "choices": [ { "t": "হ্যাঁ, আছে" }, { "t": "না, নেই", "ok": true } ],
              "explain": "কোনো Object নেই! বাক্যটি Subject + Verb দিয়েই সম্পূর্ণ।"
            }
          ],
          "after": "👉 “Asha smiled.” — Subject + Verb, কোনো Object ছাড়া।"
        },
        {
          "clip": "d_ex2",
          "chunks": [ { "t": "Every morning,", "r": "T" }, { "t": "Asha", "r": "S" }, { "t": "walked", "r": "V" }, { "t": "along a muddy road to school.", "r": "P" } ],
          "questions": [
            { "ask": "কে হাঁটল?", "role": "S" },
            { "ask": "কী করল?", "role": "V" },
            {
              "ask": "“along a muddy road to school” কোন তথ্য দিচ্ছে?",
              "choices": [ { "t": "স্থান বা দিকের তথ্য", "ok": true }, { "t": "Object" } ],
              "explain": "এটি স্থান বা দিক নির্দেশনা দিচ্ছে, Object নয়।"
            }
          ],
          "after": "👉 Verb-এর পরে Place বা Time-এর তথ্য থাকতে পারে, কিন্তু সেটি Object নয়।"
        },
        {
          "clip": "d_ex3",
          "chunks": [ { "t": "The road", "r": "S" }, { "t": "filled", "r": "V" }, { "t": "with water.", "r": "M" } ],
          "questions": [
            { "ask": "কী ভরে গেল?", "role": "S" },
            { "ask": "কী ঘটল?", "role": "V" },
            {
              "ask": "“with water” কি সরাসরি Object, নাকি অবস্থা বা ঘটনা সম্পর্কে তথ্য?",
              "choices": [ { "t": "সরাসরি Object" }, { "t": "অবস্থা সম্পর্কে তথ্য", "ok": true } ],
              "explain": "এটি অবস্থা প্রকাশের তথ্য, সরাসরি Object নয়।"
            }
          ],
          "after": "👉 “with water” বাক্যে অতিরিক্ত তথ্য দিচ্ছে।"
        }
      ]
    },
    {
      "type": "explain",
      "title": "৩. নিয়মটি বুঝি (EXPLAIN)",
      "intro": "Intransitive Verb",
      "cards": [
        { "type": "text", "html": "কিছু বাক্যে <b>Subject + Verb</b> দিয়েই মূল ভাব সম্পূর্ণ হয়। Verb-এর পরে Object থাকা বাধ্যতামূলক নয়। এমন Verb-কে <b>Intransitive Verb</b> বলা হয়। তবে এর পরে Place, Time বা অন্য তথ্য যোগ হতে পারে।" },
        { "type": "formula", "parts": ["S", "V"], "caption": "কোনো Object ছাড়াই বাক্য সম্পূর্ণ" },
        {
          "type": "compare", "title": "💡 পার্থক্য মনে রাখো",
          "left": { "label": "Object আছে", "note": "“Asha made a sketch” বাক্যে sketch হলো Object।", "chunks": [ { "t": "Asha", "r": "S" }, { "t": "made", "r": "V" }, { "t": "a sketch", "r": "O" } ] },
          "right": { "label": "Object নেই", "note": "“Asha smiled” বাক্যে কোনো Object নেই।", "chunks": [ { "t": "Asha", "r": "S" }, { "t": "smiled", "r": "V" } ] }
        },
        {
          "type": "breakdown", "clip": "d_ex1", "title": "STRUCTURE A · Pure SV",
          "chunks": [ { "t": "Asha", "r": "S", "note": "কাজটি যে করে" }, { "t": "smiled.", "r": "V", "note": "কোনো Object ছাড়া বাক্য সম্পূর্ণ" } ]
        },
        {
          "type": "breakdown", "clip": "d_b", "title": "STRUCTURE B · With Place / Time",
          "chunks": [ { "t": "Asha", "r": "S", "note": "কাজটি যে করে" }, { "t": "walked", "r": "V", "note": "ক্রিয়া" }, { "t": "along a muddy road to school.", "r": "P", "note": "স্থান বা দিকের তথ্য" } ]
        }
      ]
    },
    {
      "type": "apply",
      "title": "৪. অনুশীলন (APPLY)",
      "intro": "প্রতিটি অংশের নিচে সঠিক ভূমিকাটি বেছে নাও, তারপর ‘Check’ চাপো।",
      "items": [
        {
          "kind": "label", "clip": "d_ex1", "prompt": "১. Subject ও Verb আলাদা করো:",
          "roles": ["S", "V"],
          "chunks": [ { "t": "Asha", "r": "S" }, { "t": "smiled.", "r": "V" } ]
        },
        {
          "kind": "label", "clip": "d_ex2", "prompt": "২. Subject, Verb, Time ও Place/Direction অংশ চিহ্নিত করো:",
          "roles": ["S", "V", "T", "P"],
          "chunks": [ { "t": "Every morning,", "r": "T" }, { "t": "Asha", "r": "S" }, { "t": "walked", "r": "V" }, { "t": "along a muddy road to school.", "r": "P" } ]
        }
      ]
    }
  ],
  "next": { "href": "phonics.html", "en": "Section E", "bn": "পরের সেকশন" }
};

window.LRL_LESSON = {
  "id": "c", "letter": "C", "theme": "c", "scene": "rule1",
  "title": "Rule 1: Subject + Verb + Object",
  "subtitle": "বাক্য গঠন · Sentence Formation",
  "hero": "images/part2.jpg",
  "heroAlt": "Rakib, Asha and Arif build a toy train from a blue engine, an orange carriage and a green cargo block.",
  "roles": {
    "S": { "en": "Subject", "bn": "কে করছে?", "color": "#0284c7" },
    "V": { "en": "Verb", "bn": "কী করছে?", "color": "#ea580c" },
    "O": { "en": "Object", "bn": "কাকে / কী নিয়ে?", "color": "#16a34a" },
    "X": { "en": "Extra info", "bn": "অতিরিক্ত তথ্য", "color": "#64748b" }
  },
  "steps": [
    {
      "type": "examples",
      "title": "১. আগে উদাহরণগুলো পড়ো (NOTICE)",
      "intro": "প্রতিটি বাক্য শোনো ও পড়ো। রং দেখে বোঝো — প্রতিটি বাক্যে কোন অংশটির কী কাজ, আর সবগুলোর মধ্যে কী মিল আছে।",
      "legend": ["S", "V", "O", "X"],
      "examples": [
        {
          "clip": "c_ex1", "text": "Asha had a blue notebook.",
          "chunks": [ { "t": "Asha", "r": "S" }, { "t": "had", "r": "V" }, { "t": "a blue notebook.", "r": "O" } ]
        },
        {
          "clip": "c_ex2", "text": "She wrote questions in it because her curiosity never seemed to rest.",
          "chunks": [ { "t": "She", "r": "S" }, { "t": "wrote", "r": "V" }, { "t": "questions", "r": "O" }, { "t": "in it", "r": "X" }, { "t": "because her curiosity never seemed to rest.", "r": "X" } ]
        },
        {
          "clip": "c_ex3", "text": "Asha made a sketch of the road and the ditch.",
          "chunks": [ { "t": "Asha", "r": "S" }, { "t": "made", "r": "V" }, { "t": "a sketch of the road and the ditch.", "r": "O" } ]
        }
      ]
    },
    {
      "type": "discover",
      "title": "২. নিজে খুঁজে দেখো (DISCOVER)",
      "intro": "প্রতি বাক্যে তিনটি জিনিস লক্ষ করো: কে কাজ করছে? কী কাজ করছে? কী জিনিস বা কাকে নিয়ে কাজটি হচ্ছে? প্রশ্ন পড়ে বাক্যের সঠিক অংশে ক্লিক করো।",
      "scenes": [
        {
          "clip": "c_ex1",
          "chunks": [ { "t": "Asha", "r": "S" }, { "t": "had", "r": "V" }, { "t": "a blue notebook.", "r": "O" } ],
          "questions": [
            { "ask": "(ক) কে কাজ করছে?", "role": "S" },
            { "ask": "(খ) কী কাজ করছে?", "role": "V" },
            { "ask": "(গ) কী জিনিস বা কাকে নিয়ে কাজটি হচ্ছে?", "role": "O" }
          ],
          "after": "👉 Asha [কে] | had [কী করল] | a blue notebook [কী জিনিস]।"
        },
        {
          "clip": "c_ex2",
          "chunks": [ { "t": "She", "r": "S" }, { "t": "wrote", "r": "V" }, { "t": "questions", "r": "O" }, { "t": "in it", "r": "X" }, { "t": "because her curiosity never seemed to rest.", "r": "X" } ],
          "questions": [
            { "ask": "মূল অংশে: কে কাজ করছে?", "role": "S" },
            { "ask": "কী কাজ করছে?", "role": "V" },
            { "ask": "কী জিনিস নিয়ে কাজটি হচ্ছে?", "role": "O" }
          ],
          "after": "👉 মূল Clause হলো “She wrote questions”। বাকি অংশে কোথায় লিখেছে (in it) ও কেন লিখেছে (because her curiosity…), সে সম্পর্কে অতিরিক্ত তথ্য যোগ হয়েছে।"
        },
        {
          "clip": "c_ex3",
          "chunks": [ { "t": "Asha", "r": "S" }, { "t": "made", "r": "V" }, { "t": "a sketch of the road and the ditch.", "r": "O" } ],
          "questions": [
            { "ask": "কে কাজ করছে?", "role": "S" },
            { "ask": "কী কাজ করছে?", "role": "V" },
            { "ask": "কী জিনিস বানানো হয়েছে?", "role": "O" }
          ],
          "after": "👉 এখানেও একই নিয়ম: আগে কে, তারপর কী করল, তারপর কী জিনিস।"
        }
      ]
    },
    {
      "type": "explain",
      "title": "৩. এবার নিয়মটি বুঝি (EXPLAIN)",
      "intro": "বিস্তারিত ব্যাখ্যা ও Grammar Breakdown",
      "cards": [
        { "type": "text", "html": "ইংরেজির অনেক বাক্যে প্রথমে <b>Subject</b> (কে/কারা কাজ করছে), তারপর <b>Verb</b> (কী করছে), তারপর <b>Object</b> (কাকে/কীকে নিয়ে কাজটি হচ্ছে) বসে। একে <b>Subject + Verb + Object</b> বা <b>SVO Pattern</b> বলে।" },
        { "type": "formula", "parts": ["S", "V", "O"] },
        {
          "type": "breakdown", "clip": "c_ex3", "title": "📌 Example Breakdown",
          "chunks": [
            { "t": "Asha", "r": "S", "note": "যে কাজটি সম্পাদন করে" },
            { "t": "made", "r": "V", "note": "ক্রিয়া বা কাজের অংশ" },
            { "t": "a sketch of the road and the ditch.", "r": "O", "note": "কাজের উদ্দেশ্য বা ফলাফল" }
          ]
        },
        { "type": "text", "html": "💡 মনে রাখবে, অবশ্য সব বাক্য SVO নয়। পরের সেকশনে অন্য একটি নিয়ম শিখবে।" }
      ]
    },
    {
      "type": "apply",
      "title": "৪. অনুশীলন (APPLY)",
      "intro": "প্রতিটি অংশের নিচে সঠিক ভূমিকাটি বেছে নাও, তারপর ‘Check’ চাপো।",
      "items": [
        {
          "kind": "label", "clip": "c_a1", "prompt": "১. Subject, Verb ও Object চিহ্নিত করো:",
          "roles": ["S", "V", "O"],
          "chunks": [ { "t": "Leaves and plastic", "r": "S" }, { "t": "covered", "r": "V" }, { "t": "its narrow opening.", "r": "O" } ]
        },
        {
          "kind": "label", "clip": "c_a2", "prompt": "২. বাক্যের মূল অংশে Subject, Verb ও Object চিহ্নিত করো (বাকিটা অতিরিক্ত তথ্য):",
          "roles": ["S", "V", "O", "X"],
          "chunks": [ { "t": "She", "r": "S" }, { "t": "shared", "r": "V" }, { "t": "her drawing", "r": "O" }, { "t": "with the community worker, who promised to discuss a lasting solution.", "r": "X" } ]
        },
        {
          "kind": "label", "clip": "c_a3", "prompt": "৩. আরও একটি বাক্য চেষ্টা করো:",
          "roles": ["S", "V", "O"],
          "chunks": [ { "t": "A community worker", "r": "S" }, { "t": "brought", "r": "V" }, { "t": "gloves and a bag.", "r": "O" } ]
        }
      ]
    }
  ],
  "next": { "href": "rule2.html", "en": "Section D", "bn": "পরের সেকশন" }
};

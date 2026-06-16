let step = 0;
let locked = false;

const home = document.getElementById("home");
const chatScreen = document.getElementById("chatScreen");
const chat = document.getElementById("chat");
const choices = document.getElementById("choices");
const typing = document.getElementById("typing");

const bgm = document.getElementById("bgm");
const musicBtn = document.getElementById("musicBtn");

let musicOn = false;

// 🌙 intro (lebih santai + deket)
const intro = [
  "hai kamu 😳",
  "aku Nova",
  "aku datang buat ngobrol sama kamu",
  "btw kamu lagi apa sih disana? 😗",
];

// 🌙 questions (pendek + pacaran vibe)
const questions = [
  "eh kamu lagi di mana sekarang? 🥺",
  "kamu udah makan belum? 🍽️",
  "emang kamu lagi ngapain sih? 😙",
  "eh kalau aku lagi di samping kamu, kamu mau apa sih ? 🤭",
  "kira kira kamu lagi kepikiran aku gak? 👀",
  "kalau aku datang di sini, kamu nyaman gak sih ? 🌙",
];

// 💞 choices (simple, umum, santai)
const optionSets = [
  ["di kamar 🛏️", "di luar 🚶", "lagi rebahan 😴", "gak tau juga 😶"],

  ["udah 🍚", "belum 😵", "nanti aja 🍜", "lupa makan 😭"],

  ["rebahan 😌", "scroll hp 📱", "denger lagu 🎧", "diam aja 😶‍🌫️"],

  ["peluk kamu 🤍", "duduk deket aja 🫶", "ngobrol santai 😙", "malu 😳"],

  ["iya dikit 👀", "sering 😶‍🌫️", "gak tau 🤔", "gak sih 😗"],

  ["nyaman 😳", "lumayan 😌", "masih biasa aja 😶", "jadi hangat 🤍"],
];

// 💞 responses (pendek, manis, nyambung)
const responses = [
  {
    "di kamar 🛏️": [
      "lagi rebahan ya 😌",
      "pantes keliatan kalem gitu",
      "di kamar itu nyaman banget 🤍",
    ],
    "di luar 🚶": [
      "jalan ya kamu 😙",
      "hati-hati yaa",
      "jangan capek-capek banget",
    ],
    "lagi rebahan 😴": [
      "enak banget itu 😭",
      "aku jadi ikut males gerak 🤏",
      "rebahan mode on ya",
    ],
    "gak tau juga 😶": [
      "kok bisa gak tau sih 😭",
      "lagi random aja ya pikiran kamu",
      "aku temenin aja deh 😌",
    ],
  },

  {
    "udah 🍚": ["bagus 😳", "jangan skip makan ya", "aku tenang dikit 😌"],
    "belum 😵": [
      "eh makan dulu 😠",
      "nanti kamu lemes tau",
      "aku jagain kamu sambil makan ya 😤",
    ],
    "nanti aja 🍜": [
      "nanti tuh sering kelupaan 😭",
      "jangan ditunda lama ya",
      "aku ingetin kamu 😙",
    ],
    "lupa makan 😭": [
      "parah kamu 😭",
      "aku marahin pelan ya 😤",
      "habis ini makan ya janji",
    ],
  },

  {
    "rebahan 😌": [
      "paling enak itu sih 😭",
      "aku ikut rebahan juga jadinya",
      "kita sama-sama santai ",
    ],
    "scroll hp 📱": [
      "scroll terus ya kamu 😗",
      "tapi jangan lupa aku ya 😳",
      "aku di sini kok",
    ],
    "denger lagu 🎧": [
      "lagu apa tuh 😙",
      "aku jadi penasaran",
      "kayak kamu lagi di dunia kamu sendiri ya",
    ],
    "diam aja 😶‍🌫️": [
      "diam kamu tuh tenang 😌",
      "aku suka itu",
      "aku ikut diem bareng deh jadinya",
    ],
  },

  {
    "peluk kamu 🤍": [
      "eh… 😳",
      "aku diem bentar ya",
      "aku bayangin kamu peluk aku",
    ],
    "duduk deket aja 🫶": [
      "deket gitu udah cukup 😌",
      "gak usah jauh-jauh",
      "aku nyaman gitu sih",
    ],
    "ngobrol santai 😙": [
      "kita ngobrol aja terus ya",
      "aku suka ini 😌",
      "gak perlu ribet",
    ],
    "malu 😳": ["ih lucu 😭", "kenapa malah malu sih", "aku diem dulu deh"],
  },

  {
    "iya dikit 👀": [
      "eh jadi kepikiran aku ya 😳",
      "aku senyum dikit nih",
      "jangan kebanyakan ya nanti kangen",
    ],
    "sering 😶‍🌫️": [
      "loh serius? 😳",
      "aku jadi salting dikit",
      "aku juga sih , kadang 😙",
    ],
    "gak tau 🤔": [
      "gapapa kok 😌",
      "kadang emang gak haruss tau semuanya ",
      "aku ngerti kok",
    ],
    "gak sih 😗": [
      "ih cuek banget 😭",
      "aku pura-pura gak denger ya",
      "padahal aku kepikiran kamu 😙",
    ],
  },

  {
    "nyaman 😳": [
      "syukurlah 😌",
      "aku juga nyaman sama kamu",
      "hehehe 🤍",
    ],
    "lumayan 😌": [
      "lumayan itu udah bagus 😙",
      "santai aja ",
      "aku ngerti",
    ],
    "masih biasa aja 😶": [
      "gapapa 😌",
      "kita baru kenal juga",
      "wajar kok",
    ],
    "jadi hangat 🤍": [
      "itu aku suka 😳",
      "aku juga ngerasa gitu",
      "kita sama ya",
    ],
  },
];

// ===== UI =====
function addMsg(text, type) {
  const div = document.createElement("div");
  div.className = "msg " + type;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function user(text) {
  addMsg(text, "user");
}

function showTyping() {
  typing.classList.remove("hidden");
}
function hideTyping() {
  typing.classList.add("hidden");
}

// ===== FLOW =====
let queue = Promise.resolve();

function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function speak(lines) {
  queue = queue.then(async () => {
    for (let line of lines) {
      showTyping();
      await wait(600 + Math.random() * 400);
      hideTyping();

      addMsg(line, "bot");
      await wait(700);
    }
  });

  return queue;
}

// ===== CHOICES =====
function showChoices() {
  choices.innerHTML = "";

  optionSets[step].forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.innerText = opt;
    btn.onclick = () => handle(opt);
    choices.appendChild(btn);
  });
}

// ===== HANDLE =====
function handle(opt) {
  if (locked) return;
  locked = true;

  user(opt);

  speak(responses[step][opt]).then(() => {
    step++;

    if (step < questions.length) {
      speak([questions[step]]).then(() => {
        showChoices();
        locked = false;
      });
    } else {
      speak([
        "aku seneng kamu di sini 😳",
        "jangan ilang ya…",
        "aku tunggu kamu 🤍",
      ]);

      choices.innerHTML = "";
      locked = false;
    }
  });
}

// ===== START =====
function startChat() {
  home.classList.add("hidden");
  chatScreen.classList.remove("hidden");

  step = 0;

  speak(intro).then(() => {
    speak([questions[0]]).then(() => {
      showChoices();
    });
  });
}

// ===== RESET =====
function goHome() {
  chatScreen.classList.add("hidden");
  home.classList.remove("hidden");

  chat.innerHTML = "";
  choices.innerHTML = "";
  step = 0;
  locked = false;
  queue = Promise.resolve();

  bgm.pause();
  musicBtn.innerText = "▶";
}

// ===== MUSIC =====
function fadeIn(audio) {
  audio.volume = 0;
  audio.play().catch(() => {});
  let v = 0;

  const fade = setInterval(() => {
    if (v < 0.3) {
      v += 0.02;
      audio.volume = v;
    } else clearInterval(fade);
  }, 60);
}

function fadeOut(audio) {
  let v = audio.volume;

  const fade = setInterval(() => {
    if (v > 0) {
      v -= 0.03;
      audio.volume = v;
    } else {
      audio.pause();
      clearInterval(fade);
    }
  }, 60);
}

musicBtn.onclick = () => {
  musicOn = !musicOn;

  if (musicOn) {
    fadeIn(bgm);
    musicBtn.innerText = "⏸";
  } else {
    fadeOut(bgm);
    musicBtn.innerText = "▶";
  }
};

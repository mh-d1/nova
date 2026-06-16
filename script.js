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

// 🌙 intro (lebih hangat & natural)
const intro = [
  "hai kamu 😳",
  "aku Nova",
  "aku seneng kamu akhirnya datang 🤍",
  "aku cuma mau ngobrol sama kamu 😗",
];

// 🌙 questions (lebih natural, gak kaku)
const questions = [
  "kamu lagi di mana sih? 🥺",
  "udah makan belum hari ini? 🍽️",
  "lagi ngapain sih sekarang? 😙",
  "kalau aku duduk di samping kamu, kamu pengen ngapain? 🤭",
  "kamu lagi kepikiran sesuatu gak? 👀",
  "kalau aku di dekat kamu, kamu nyaman gak? 🌙",
];

// 💞 choices (tetap santai & deket)
const optionSets = [
  ["di kamar 🛏️", "di luar 🚶", "lagi rebahan 😴", "gak tau juga 😶"],

  ["udah 🍚", "belum 😵", "nanti aja 🍜", "lupa makan 😭"],

  ["rebahan 😌", "scroll hp 📱", "denger lagu 🎧", "diam aja 😶‍🌫️"],

  ["peluk kamu 🤍", "duduk deket aja 🫶", "ngobrol santai 😙", "malu 😳"],

  ["iya dikit 👀", "sering 😶‍🌫️", "gak tau 🤔", "gak sih 😗"],

  ["nyaman 😳", "lumayan 😌", "masih biasa aja 😶", "jadi hangat 🤍"],
];

// 💞 responses (lebih natural & nyambung emosinya)
const responses = [
  {
    "di kamar 🛏️": [
      "lagi santai di kamar ya 😌",
      "pantes keliatan tenang gitu",
      "kamar emang tempat paling nyaman 🤍",
    ],
    "di luar 🚶": [
      "lagi keluar ya kamu 😙",
      "hati-hati ya di luar",
      "jangan capek-capek banget ya",
    ],
    "lagi rebahan 😴": [
      "rebahan terus ya 😭",
      "enak banget sih itu",
      "aku jadi ikut santai juga",
    ],
    "gak tau juga 😶": [
      "kok bisa gak tau sih 😭",
      "lagi random aja ya pikiran kamu",
      "aku temenin aja deh 😌",
    ],
  },

  {
    "udah 🍚": [
      "bagus 😳",
      "jangan lupa makan teratur ya",
      "aku jadi tenang dikit 🤍",
    ],
    "belum 😵": [
      "eh makan dulu ya 😠",
      "nanti kamu lemes loh",
      "aku tunggu kamu makan dulu 😤",
    ],
    "nanti aja 🍜": [
      "jangan nanti terus ya 😭",
      "aku takut kamu kelupaan",
      "ingat makan ya 😙",
    ],
    "lupa makan 😭": [
      "ih bahaya itu 😭",
      "aku marahin pelan ya 😤",
      "abis ini makan ya janji",
    ],
  },

  {
    "rebahan 😌": [
      "enak banget sih itu 😌",
      "aku jadi pengen rebahan juga",
      "kita sama-sama santai aja ya",
    ],
    "scroll hp 📱": [
      "scroll terus ya kamu 😗",
      "tapi jangan lupa istirahat juga ya",
      "aku di sini nemenin kok",
    ],
    "denger lagu 🎧": [
      "lagi denger lagu apa tuh 😙",
      "kayaknya kamu lagi di dunia kamu sendiri ya",
      "aku jadi penasaran lagunya",
    ],
    "diam aja 😶‍🌫️": [
      "diam kamu tuh tenang banget 😌",
      "aku suka suasana kayak gitu",
      "aku ikut diem bareng kamu",
    ],
  },

  {
    "peluk kamu 🤍": [
      "eh… 😳",
      "aku diem dulu bentar ya",
      "aku bayangin itu sekarang",
    ],
    "duduk deket aja 🫶": [
      "deket gitu aja udah cukup 😌",
      "gak perlu jauh-jauh",
      "aku suka suasana itu",
    ],
    "ngobrol santai 😙": [
      "kita ngobrol aja terus ya",
      "aku suka banget ini 😌",
      "gak perlu dipikir ribet",
    ],
    "malu 😳": [
      "ih kenapa malah malu 😭",
      "lucu banget sih kamu",
      "aku diem dulu deh",
    ],
  },

  {
    "iya dikit 👀": [
      "loh jadi kepikiran aku ya 😳",
      "aku jadi senyum sendiri",
      "jangan kebanyakan ya nanti kangen 😙",
    ],
    "sering 😶‍🌫️": [
      "serius? 😳",
      "aku jadi agak salting",
      "aku juga kadang gitu sih 😙",
    ],
    "gak tau 🤔": [
      "gapapa kok 😌",
      "gak semua hal harus jelas",
      "aku ngerti kamu",
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
      "aku juga ngerasa nyaman sama kamu",
      "🤍",
    ],
    "lumayan 😌": [
      "lumayan itu udah bagus 😙",
      "pelan-pelan aja ya",
      "aku di sini",
    ],
    "masih biasa aja 😶": [
      "gapapa 😌",
      "kita kan masih baru ngobrol",
      "semua pelan-pelan ya",
    ],
    "jadi hangat 🤍": [
      "itu aku suka 😳",
      "aku juga ngerasa hangat",
      "kayaknya kita nyambung ya 🤍",
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
      await wait(500 + Math.random() * 350);
      hideTyping();

      addMsg(line, "bot");
      await wait(650);
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
      speak(["hmm… 😶", questions[step]]).then(() => {
        showChoices();
        locked = false;
      });
    } else {
      speak([
        "kayaknya kita sampai sini dulu ya 😌",
        "aku seneng banget ngobrol sama kamu 🤍",
        "nanti kita lanjut lagi ya",
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

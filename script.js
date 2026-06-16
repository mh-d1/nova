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

// 🌙 intro (lebih chill, deket, gak drama)
const intro = [
  "hai 😳",
  "aku Nova",
  "kamu lagi apa? 😗",
];

// 🌙 questions (simple, kayak chat beneran)
const questions = [
  "lagi di mana? 🥺",
  "udah makan? 🍽️",
  "lagi ngapain? 😙",
  "kalau aku di sebelah kamu, kamu ngapain? 🤭",
  "lagi kepikiran sesuatu ya? 👀",
  "kalau aku deket kamu, kamu risih gak? 😶",
];

// 💞 choices (lebih real, gak terlalu “script”)
const optionSets = [
  ["di kamar", "di luar", "rebahan", "gak tau"],

  ["udah", "belum", "nanti", "lupa"],

  ["rebahan", "scroll hp", "denger lagu", "diam aja"],

  ["peluk kamu", "deket aja", "ngobrol", "malu"],

  ["iya", "sering", "gak tau", "enggak"],

  ["nyaman", "lumayan", "biasa aja", "agak risih"],
];

// 💞 responses (natural, kayak pacaran santai)
const responses = [
  {
    "di kamar": ["oh di kamar", "lagi santai ya", "enak sih itu"],
    "di luar": ["lagi keluar ya", "hati-hati", "jangan capek"],
    "rebahan": ["rebahan terus 😭", "mager ya", "aku juga gitu kadang"],
    "gak tau": ["kok gak tau 😭", "yaudah gapapa", "aku temenin"],
  },

  {
    "udah": ["bagus", "jangan telat makan ya", "oke 👍"],
    "belum": ["makan dulu", "nanti lemes loh", "aku tunggu"],
    "nanti": ["jangan nanti mulu", "nanti kelupaan", "makan ya"],
    "lupa": ["parah 😭", "makan sekarang ya", "janji ya"],
  },

  {
    "rebahan": ["males banget ya", "aku ngerti sih", "enak emang"],
    "scroll hp": ["scroll terus 😗", "capek mata loh", "istirahat juga"],
    "denger lagu": ["lagu apa?", "kamu lagi chill ya", "enak tuh"],
    "diam aja": ["tenang banget kamu", "aku suka sih", "sunyi ya"],
  },

  {
    "peluk kamu": ["eh 😳", "ngapain tiba-tiba", "bikin aku diem"],
    "deket aja": ["ya udah gitu aja", "gak perlu jauh-jauh", "simple aja"],
    "ngobrol": ["ya ngobrol aja", "aku gak keberatan", "santai aja"],
    "malu": ["ngapain malu 😭", "lucu kamu", "aku diem deh"],
  },

  {
    "iya": ["oh pantes", "kepikiran apa?", "cerita aja"],
    "sering": ["sering banget?", "sama ya kadang", "aku juga"],
    "gak tau": ["yaudah santai", "gak harus dipikirin", "pelan-pelan aja"],
    "enggak": ["oh yaudah", "berarti santai ya", "oke"],
  },

  {
    "nyaman": ["syukur", "aku juga santai sama kamu", "oke 👍"],
    "lumayan": ["yaudah cukup", "pelan-pelan aja", "gak papa"],
    "biasa aja": ["gapapa", "baru juga", "wajar", "oke"],
    "agak risih": ["oh 😶", "maaf ya", "aku jaga jarak"],
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
      await wait(450 + Math.random() * 300);
      hideTyping();

      addMsg(line, "bot");
      await wait(500);
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
        "udah dulu ya",
        "nanti kita lanjut lagi",
        "bye 😗",
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

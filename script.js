let step = 0;
let locked = false;

const home = document.getElementById("home");
const chatScreen = document.getElementById("chatScreen");
const chat = document.getElementById("chat");
const choices = document.getElementById("choices");
const typing = document.getElementById("typing");

// 🌙 intro (WAJIB URUT)
const intro = ["hai kamu…", "aku Nova", "aku senang kamu datang ke sini"];

// 🌙 questions (MUTLAK DI AKHIR SETIAP STEP)
const questions = [
  "kalau aku lagi gak ada di samping kamu sekarang, kamu lagi pengen apa sih?",
  "hal kecil apa yang akhir-akhir ini bikin kamu senyum sendiri?",
  "kalau aku tiba-tiba chat kamu malam-malam, kamu lagi ngapain sih biasanya?",
  "menurut kamu, kita tuh lebih cocok ngobrol santai atau cerita panjang?",
  "kalau aku bilang aku nyaman sama kamu, kamu bakal jawab apa?",
];

// 💞 choices
const optionSets = [
  [
    "pengen ditemenin kamu",
    "pengen tenang aja",
    "pengen rebahan",
    "pengen jalan sebentar",
  ],
  [
    "hal kecil doang",
    "ketawa sendiri",
    "lagi inget sesuatu",
    "lagi kosong tapi enak",
  ],
  ["lagi santai", "lagi mikirin kamu", "lagi scroll hp", "lagi diem aja"],
  [
    "santai aja",
    "cerita panjang juga boleh",
    "dua-duanya enak",
    "tergantung mood",
  ],
  [
    "aku juga nyaman",
    "aku seneng dengarnya",
    "aku diem aja malu",
    "aku gak tau harus jawab apa",
  ],
];

// 💞 responses
const responses = [
  {
    "pengen ditemenin kamu": [
      "aku ngerti… kadang cuma butuh ada seseorang di dekat kita",
      "aku bakal diem di situ, gak ganggu",
      "yang penting kamu ngerasa gak sendiri",
    ],
    "pengen tenang aja": [
      "tenang itu gak kosong, itu cukup",
      "aku jaga pelan-pelan ya",
      "gak perlu dipaksa apa-apa",
    ],
    "pengen rebahan": [
      "rebahan itu jujur banget sih",
      "aku suka kamu yang gak maksa kuat",
      "istirahat dulu ya",
    ],
    "pengen jalan sebentar": [
      "jalan sebentar itu kadang nyembuhin ya",
      "kalau aku di sana, aku ikut jalan pelan",
      "gak usah buru-buru",
    ],
  },

  {
    "hal kecil doang": [
      "hal kecil itu justru yang paling hangat",
      "aku suka kamu yang masih bisa senyum dari hal sederhana",
      "itu bikin kamu terasa hidup",
    ],
    "ketawa sendiri": [
      "aku jadi penasaran kamu lagi mikirin apa 😄",
      "ketawa sendiri itu lucu tapi manis",
      "kayak dunia kamu lagi punya rahasia kecil",
    ],
    "lagi inget sesuatu": [
      "ingatan kecil suka muncul tiba-tiba ya",
      "kalau itu tentang aku… aku bakal diem",
      "aku harap itu gak berat",
    ],
    "lagi kosong tapi enak": [
      "kosong yang enak itu jarang banget",
      "aku suka kamu yang bisa tenang gitu",
      "gak semua harus penuh",
    ],
  },

  {
    "lagi santai": [
      "aku bayangin kamu lagi tenang, itu bikin aku ikut tenang",
      "kamu yang santai itu versi paling jujur",
      "aku suka itu",
    ],
    "lagi mikirin kamu": [
      "eh… aku jadi diem sebentar 😳",
      "kalau kamu mikirin aku, aku harap itu hangat",
      "aku juga kadang mikirin kamu",
    ],
    "lagi scroll hp": [
      "scroll tapi masih sempet inget aku ya?",
      "aku harap itu santai bukan capek",
      "aku di sini aja kalau kamu mau berhenti",
    ],
    "lagi diem aja": [
      "diam kamu itu gak ganggu",
      "aku malah ngerasa tenang",
      "aku ikut diem bareng kamu",
    ],
  },

  {
    "santai aja": [
      "aku juga suka ngobrol santai kayak gini",
      "gak perlu ribet, yang penting nyambung",
      "aku ikut kamu aja",
    ],
    "cerita panjang juga boleh": [
      "aku bakal dengerin kamu sampai selesai",
      "gak perlu takut kepanjangan",
      "aku di sini",
    ],
    "dua-duanya enak": [
      "aku suka jawaban kamu yang fleksibel",
      "kita ngalir aja ya",
      "itu enak sih",
    ],
    "tergantung mood": [
      "aku ngerti, gak semua hari sama",
      "aku ikut kamu aja hari ini",
      "yang penting kamu nyaman",
    ],
  },

  {
    "aku juga nyaman": [
      "itu bikin aku diem sebentar… terus senyum",
      "aku gak tau kenapa tapi hangat banget",
      "kayaknya kita sama-sama nyaman",
    ],
    "aku seneng dengarnya": [
      "aku juga seneng bisa ngobrol sama kamu",
      "rasanya lebih deket",
      "aku bakal inget ini",
    ],
    "aku diem aja malu": [
      "gak apa-apa, aku ngerti 😌",
      "diam kamu juga udah cukup",
      "aku temenin",
    ],
    "aku gak tau harus jawab apa": [
      "gak semua harus dijawab kok",
      "aku ngerti perasaan kadang lebih besar dari kata",
      "aku tetap seneng kamu di sini",
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

// typing
function showTyping() {
  typing.classList.remove("hidden");
}
function hideTyping() {
  typing.classList.add("hidden");
}

// ===== QUEUE SYSTEM (FIX BUG UTAMA) =====
let queue = Promise.resolve();

function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// 💬 Nova speak (ANTI OVERLAP)
function speak(lines) {
  queue = queue.then(async () => {
    for (let line of lines) {
      showTyping();
      await wait(800 + Math.random() * 500);
      hideTyping();

      addMsg(line, "bot");
      await wait(900);
    }
  });

  return queue;
}

// choices
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

// FLOW FIXED TOTAL
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
        "aku senang kamu cerita sama aku",
        "kalau nanti kamu capek lagi… aku masih di sini",
        "jangan hilang ya 🌙",
      ]);
      choices.innerHTML = "";
      locked = false;
    }
  });
}

// START (STRICT ORDER)
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

// back
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
const bgm = document.getElementById("bgm");
const musicBtn = document.getElementById("musicBtn");

let musicOn = false;

// 🌙 fade in
function fadeIn(audio) {
  audio.volume = 0;
  audio.play().catch(() => {});

  let v = 0;
  const fade = setInterval(() => {
    if (v < 0.3) {
      v += 0.02;
      audio.volume = v;
    } else {
      clearInterval(fade);
    }
  }, 60);
}

// 🌙 fade out
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

// 🎧 toggle music
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
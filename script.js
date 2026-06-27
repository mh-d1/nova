/* ======================================================
   🌸 NOVA V3 ULTIMATE (CLEAN VERSION)
   - smooth WA flow
   - easy edit content block
   - no double question fix
====================================================== */

/* =========================
   ELEMENTS
========================= */

const home = document.getElementById("home");
const chatScreen = document.getElementById("chatScreen");
const chatBox = document.getElementById("chatBox");
const choices = document.getElementById("choices");
const typing = document.getElementById("typing");
const status = document.getElementById("status");
const musicBtn = document.getElementById("musicBtn");
const bgm = document.getElementById("bgm");

/* =========================
   STATE
========================= */

const state = {
  step: 0,
  memory: {},
  locked: false,
  queue: Promise.resolve(),
  music: false,
};

/* ======================================================
   🌸 CONTENT ZONE (EDIT INI SAJA)
   INTRO + STORY + ENDING
====================================================== */

const CONTENT = {
  /* =========================
   INTRO
========================= */
  intro: [
    "haii kamu 🌸",
    "aku Nova ya",
    "akhirnya kamu muncul juga 😶",

    "aku tadi lagi santai sambil nunggu kamu",
    "tapi aku pura-pura nggak nungguin sih wkwk 🤍",

    "eh… boleh ngobrol sebentar gak? aku pengen tau kabar kamu dulu",
  ],

  /* =========================
   STORY (CHAT FLOW)
========================= */
  story: [
    {
      q: "hari kamu tadi gimana? 🌸",
      a: {
        baik: [
          "ohh syukurlah 😊",
          "aku seneng dengernya",
          "berarti hari kamu nggak terlalu berat ya",
          "aku jadi agak tenang sekarang",
        ],
        capek: [
          "eh capek ya 🥺",
          "pantes kamu keliatan agak lemes",
          "sini dulu tarik napas pelan ya",
          "aku temenin kamu pelan-pelan 🤍",
        ],
        biasa: [
          "oh gitu 😶",
          "hari netral ya",
          "nggak jelek tapi juga nggak spesial ya",
          "yang penting kamu masih jalanin hari ini",
        ],
      },
    },

    {
      q: "kamu sekarang lagi di mana? 🌿",
      a: {
        kamar: [
          "di kamar ya 😊",
          "hmm enak sih pasti santai",
          "aku bayangin kamu lagi rebahan atau duduk diem",
          "kamar emang tempat paling nyaman ya",
        ],
        luar: [
          "lagi di luar ya 😮",
          "hati-hati ya jangan capek banget",
          "cuaca juga kadang nggak jelas",
          "jangan lupa istirahat nanti ya",
        ],
      },
    },

    {
      q: "tadi kamu ngapain aja hari ini? 👀",
      a: {
        kerja: [
          "ohh sibuk ya 😮",
          "pantes capeknya kerasa",
          "kamu tuh kuat juga ternyata",
          "tapi jangan lupa istirahat ya",
        ],
        rebahan: [
          "wkwk rebahan lagi 😭",
          "itu kamu banget sih",
          "aku ngerti kok itu nyaman banget",
          "aku juga bakal gitu kalau bisa",
        ],
      },
    },
  ],

  /* =========================
   ENDING
========================= */
  ending: [
    "hmm… kita udah ngobrol lumayan lama ya 🌸",
    "aku seneng kamu mau cerita sama aku hari ini",

    "kalau nanti kamu lagi kosong atau capek",
    "balik lagi ya 🤍",

    "aku bakal di sini kok",
  ],
};

/* =========================
   HELPERS
========================= */

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function add(text, type) {
  const d = document.createElement("div");
  d.className = `msg ${type}`;
  d.textContent = text;
  chatBox.appendChild(d);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function setStatus(t) {
  status.textContent = t;
}

/* =========================
   TYPING
========================= */

function showTyping() {
  typing.classList.remove("hidden");
  setStatus("typing...");
}

function hideTyping() {
  typing.classList.add("hidden");
  setStatus("online");
}

/* =========================
   SPEAK ENGINE
========================= */

async function speak(lines) {
  state.queue = state.queue.then(async () => {
    for (const line of lines) {
      showTyping();
      await wait(700 + Math.random() * 400);
      hideTyping();
      if (line) add(line, "bot");
      await wait(250);
    }
  });

  return state.queue;
}

/* =========================
   FLOW SAFE ACCESS
========================= */

function getCurrent() {
  return CONTENT.story?.[state.step];
}

/* =========================
   CHOICES
========================= */

function renderChoices() {
  choices.innerHTML = "";

  const current = getCurrent();
  if (!current) return;

  Object.keys(current.a).forEach((opt) => {
    const b = document.createElement("button");
    b.className = "choice";
    b.textContent = opt;

    b.onclick = () => handle(opt);
    choices.appendChild(b);
  });
}

/* =========================
   HANDLE FLOW
========================= */

async function handle(opt) {
  if (state.locked) return;
  state.locked = true;

  choices.innerHTML = "";

  add(opt, "user");

  const current = getCurrent();

  await speak(current.a[opt] || ["..."]);

  state.step++;

  const next = getCurrent();

  if (next) {
    await speak([next.q]);
    renderChoices();
    state.locked = false;
    return;
  }

  await ending();
  state.locked = false;
}

/* =========================
   ENDING
========================= */

async function ending() {
  await speak(CONTENT.ending);

  const btn = document.createElement("button");
  btn.className = "choice";
  btn.textContent = "💬 ngobrol lagi";
  btn.onclick = startChat;

  choices.appendChild(btn);
}

/* =========================
   START CHAT (FIXED FLOW)
========================= */

window.startChat = async function () {
  home.classList.add("hidden");
  chatScreen.classList.remove("hidden");

  chatBox.innerHTML = "";
  choices.innerHTML = "";

  state.step = 0;
  state.locked = true;

  await speak(CONTENT.intro);

  await speak([CONTENT.story[0].q]);

  renderChoices();

  state.locked = false;
};

/* =========================
   HOME
========================= */

function goHome() {
  location.reload();
}

/* =========================
   MUSIC
========================= */

musicBtn?.addEventListener("click", () => {
  state.music = !state.music;

  if (state.music) {
    bgm.play().catch(() => {});
    musicBtn.textContent = "♫";
  } else {
    bgm.pause();
    musicBtn.textContent = "♪";
  }
});

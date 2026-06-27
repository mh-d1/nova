const home = document.getElementById("home");
const chatScreen = document.getElementById("chatScreen");
const chatBox = document.getElementById("chatBox");
const choices = document.getElementById("choices");
const typing = document.getElementById("typing");
const status = document.getElementById("status");
const audioBtn = document.getElementById("audioBtn");
const bgm = document.getElementById("bgm");

const state = {
  step: 0,
  locked: false,
  queue: Promise.resolve(),
  music: false,
};

/* =========================
   CONTENT (NO DOUBLE QUESTION FIXED)
========================= */

const CONTENT = {
  intro: [
    "haii kamu 🌸",
    "aku Nova",
    "akhirnya kamu muncul juga",
    "aku tadi nunggu kamu sebentar… tapi aku pura-pura santai wkwk",
    "boleh ngobrol sebentar gak? aku pengen kenal kamu dulu 🤍",
  ],

  story: [
    {
      q: "hari kamu gimana tadi? 🌸",
      a: {
        baik: [
          "ohh syukurlah 😊",
          "aku seneng kamu bilang baik",
          "berarti hari kamu nggak terlalu berat ya",
          "aku jadi agak tenang",
        ],
        capek: [
          "eh capek ya 🥺",
          "pantes kamu keliatan lemes",
          "sini dulu tarik napas pelan ya",
          "aku temenin pelan-pelan 🤍",
        ],
        biasa: [
          "oh gitu 😶",
          "hari netral ya",
          "nggak jelek tapi nggak spesial",
          "yang penting masih jalan",
        ],
      },
    },

    {
      q: "sekarang kamu lagi di mana? 🌿",
      a: {
        kamar: [
          "di kamar ya 😊",
          "pasti lagi santai",
          "aku bayangin kamu lagi rebahan atau scroll pelan-pelan",
          "kamar emang paling nyaman ya",
        ],
        luar: [
          "lagi di luar ya 😮",
          "hati-hati ya",
          "jangan capek banget",
          "nanti istirahat ya 🤍",
        ],
      },
    },

    {
      q: "tadi kamu ngapain aja hari ini? 👀",
      a: {
        kerja: [
          "ohh sibuk ya 😮",
          "pantes capek",
          "kamu keren juga bisa bertahan",
          "tapi jangan lupa istirahat ya",
        ],
        rebahan: [
          "wkwk rebahan lagi 😭",
          "itu kamu banget sih",
          "aku ngerti kok itu nyaman",
          "aku juga bakal gitu sih",
        ],
      },
    },
  ],

  ending: [
    "hehe 🌸",
    "kita ngobrolnya lumayan lama ya",
    "aku seneng kamu di sini",
    "kalau nanti capek atau kosong… balik lagi ya 🤍",
    "aku bakal nungguin kamu pelan-pelan",
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

function showTyping() {
  typing.classList.remove("hidden");
  setStatus("typing...");
}

function hideTyping() {
  typing.classList.add("hidden");
  setStatus("online");
}

/* =========================
   SPEAK ENGINE (IMPORTANT FIX)
========================= */

async function speak(lines) {
  state.queue = state.queue.then(async () => {
    for (const line of lines) {
      showTyping();
      await wait(700);
      hideTyping();
      add(line, "bot");
      await wait(200);
    }
  });
  return state.queue;
}

/* =========================
   FLOW
========================= */

function getCurrent() {
  return CONTENT.story[state.step];
}

function renderChoices() {
  choices.innerHTML = "";
  const cur = getCurrent();
  if (!cur) return;

  Object.keys(cur.a).forEach((opt) => {
    const b = document.createElement("button");
    b.className = "choice";
    b.textContent = opt;
    b.onclick = () => handle(opt);
    choices.appendChild(b);
  });
}

async function handle(opt) {
  if (state.locked) return;
  state.locked = true;

  choices.innerHTML = "";
  add(opt, "user");

  const cur = getCurrent();
  await speak(cur.a[opt]);

  state.step++;

  const next = getCurrent();

  if (next) {
    await speak([next.q]);
    renderChoices();
    state.locked = false;
    return;
  }

  await speak(CONTENT.ending);
  state.locked = false;
}

/* =========================
   START
========================= */

window.startChat = async () => {
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
   AUDIO FIX
========================= */

audioBtn?.addEventListener("click", () => {
  state.music = !state.music;

  if (state.music) {
    bgm.play().catch(() => {});
    audioBtn.textContent = "⏸";
  } else {
    bgm.pause();
    audioBtn.textContent = "▶";
  }
});

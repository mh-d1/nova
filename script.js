/* ======================================================
   NOVA V3 PRO - FULL JS SYSTEM
   Natural chat engine (warm + long + stable)
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

/* =========================
   STATE SYSTEM
========================= */

const state = {
    step: 0,
    memory: {},
    locked: false,
    queue: Promise.resolve()
};

/* =========================
   STORY (NATURAL LONG VERSION)
========================= */

const story = [
{
q:"lagi di mana sekarang? 🌸",
a:{
"kamar":[
"di kamar ya 😊",
"lagi santai gitu?",
"aku bayangin kamu lagi rebahan sambil scroll pelan-pelan",
"vibenya tenang banget sih itu"
],
"luar":[
"lagi di luar ya",
"semoga ga terlalu capek 🌿",
"tapi enak juga ya udara luar kadang",
"jangan kelamaan capeknya ya"
],
"rebahan":[
"rebahan 😭 klasik banget",
"itu posisi paling sulit dilawan sih",
"aku ngerti banget itu mode 'aku cuma mau diam sebentar' 🤍",
"tapi biasanya sebentarnya jadi lama ya 😏"
]
}
},

{
q:"udah makan belum? 🍽️",
a:{
"udah":[
"bagus lah 😊",
"aku jadi tenang dengernya",
"minimal kamu udah isi energi ya",
"jangan lupa minum juga nanti"
],
"belum":[
"loh belum? 🥺",
"jangan kebiasaan ya",
"aku ga marahin sih… tapi aku concern aja",
"habis ini makan ya, janji 🤍"
]
}
},

{
q:"lagi ngapain sekarang? 👀",
a:{
"scroll":[
"scrolling ya 😄",
"itu aktivitas yang ga terasa tapi tiba-tiba 1 jam hilang",
"aku juga kadang gitu sih kalau lagi santai",
"lagi cari apa atau cuma lewat-lewat aja?"
],
"diam":[
"lagi diem ya",
"kadang diem itu enak juga sih",
"kayak pause dari semuanya sebentar",
"aku ngerti kok itu rasanya"
],
"musik":[
"denger musik ya 🎧",
"itu mood changer paling cepat sih",
"lagu bisa bikin dunia kerasa beda banget",
"lagi denger lagu apa sekarang?"
]
}
},

{
q:"kalau aku duduk di sebelah kamu… kamu bakal ngapain? 🤍",
a:{
"peluk":[
"eh 😳 tiba-tiba banget",
"tapi itu… bikin aku senyum sih",
"aku ga tau harus jawab apa selain… itu hangat banget"
],
"ngobrol":[
"aku suka jawaban itu",
"ngobrol itu simpel tapi kadang paling nyaman",
"ga perlu hal besar buat ngerasa dekat ya"
],
"diam":[
"diam juga oke sih",
"kadang ga semua harus diisi kata-kata",
"ada momen yang cukup ditemani aja"
]
}
},

{
q:"akhir-akhir ini kamu lagi kepikiran sesuatu gak? 👀",
a:{
"iya":[
"hm… pelan-pelan ya",
"kadang kepala emang suka penuh sendiri",
"aku ga akan maksa kamu cerita detailnya",
"tapi aku ada di sini kalau kamu mau cerita"
],
"enggak":[
"syukurlah kalau lagi agak ringan",
"tapi kalau nanti tiba-tiba berat lagi juga gapapa",
"naik turun itu normal kok"
]
}
}
];

/* =========================
   INTRO
========================= */

const intro = [
"hai 🌸",
"aku Nova",
"aku ga tau kamu lagi gimana hari ini…",
"tapi aku seneng kamu datang",
"kalau capek, kita ngobrol pelan-pelan aja ya 🤍"
];

/* =========================
   HELPERS
========================= */

const wait = ms => new Promise(r => setTimeout(r, ms));

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
   UI STATES
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
   MEMORY SYSTEM
========================= */

function remember(k, v) {
    state.memory[k] = v;
}

function recall(k) {
    return state.memory[k];
}

/* =========================
   SPEAK ENGINE (STABLE)
========================= */

async function speak(lines) {
    state.queue = state.queue.then(async () => {

        for (const line of lines) {

            showTyping();
            await wait(700 + Math.random() * 500);
            hideTyping();

            if (line) add(line, "bot");

            await wait(250);
        }

    });

    return state.queue;
}

/* =========================
   CHOICES
========================= */

function renderChoices() {
    choices.innerHTML = "";

    const current = story[state.step];
    const options = Object.keys(current.a);

    options.forEach(opt => {

        const btn = document.createElement("button");
        btn.className = "choice";
        btn.textContent = opt;

        btn.onclick = () => handle(opt);

        choices.appendChild(btn);

    });
}

/* =========================
   HANDLE FLOW
========================= */

async function handle(opt) {

    if (state.locked) return;
    state.locked = true;

    add(opt, "user");
    remember(`step_${state.step}`, opt);

    const current = story[state.step];
    const reply = current.a[opt];

    await speak(reply);

    state.step++;

    if (state.step < story.length) {

        await speak([story[state.step].q]);
        renderChoices();

        state.locked = false;
        return;
    }

    await speak([
        "makasih ya 🤍",
        "aku seneng ngobrol sama kamu"
    ]);

    state.locked = false;
}

/* =========================
   START CHAT (FIXED)
========================= */

window.startChat = async function () {

    home.classList.add("hidden");
    chatScreen.classList.remove("hidden");

    chatBox.innerHTML = "";
    state.step = 0;
    state.memory = {};

    await speak(intro);
    await speak([story[0].q]);

    renderChoices();
};

/* =========================
   HOME
========================= */

function goHome() {
    location.reload();
}

/* =========================
   NOVA V3 CORE ENGINE
========================= */

const home = document.getElementById("home");
const chatScreen = document.getElementById("chatScreen");
const chatBox = document.getElementById("chatBox");
const choicesBox = document.getElementById("choices");
const typing = document.getElementById("typing");
const statusEl = document.getElementById("status");

/* =========================
   STATE ENGINE
========================= */

const state = {
step:0,
memory:{},
mood:"neutral",
relationship:0,
locked:false,
queue:Promise.resolve()
};

/* =========================
   DIALOG SYSTEM
========================= */

const story = [
{
q:"lagi di mana sekarang? 🌸",
a:{
"kamar":[
"di kamar ya 😊",
"santai banget itu",
"aku suka vibe itu"
],
"luar":[
"lagi di luar ya",
"hati-hati 🌿"
],
"rebahan":[
"rebahan itu valid 😭"
]
}
},
{
q:"udah makan belum? 🍽️",
a:{
"udah":[
"bagus 😊",
"aku seneng dengernya"
],
"belum":[
"loh 😭",
"habis ini makan ya"
]
}
},
{
q:"lagi ngapain? 👀",
a:{
"scroll":[
"ketahuan 😭"
],
"diam":[
"tenang banget ya"
]
}
}
];

/* =========================
   HELPERS
========================= */

const wait = ms => new Promise(r=>setTimeout(r,ms));

function add(text,type){
const d=document.createElement("div");
d.className=`msg ${type}`;
d.textContent=text;
chatBox.appendChild(d);
chatBox.scrollTop=chatBox.scrollHeight;
}

function setStatus(t){
statusEl.textContent=t;
}

/* =========================
   TYPING
========================= */

function showTyping(){
typing.classList.remove("hidden");
setStatus("typing...");
}

function hideTyping(){
typing.classList.add("hidden");
setStatus("online");
}

/* =========================
   MEMORY SYSTEM
========================= */

function remember(k,v){
state.memory[k]=v;
}

function recall(k){
return state.memory[k];
}

/* =========================
   MOOD ENGINE
========================= */

function updateMood(){
if(state.memory.step_1==="belum") state.mood="care";
if(state.memory.step_0==="luar") state.mood="alert";
}

/* =========================
   SPEAK ENGINE
========================= */

async function speak(lines){

state.queue = state.queue.then(async()=>{

for(const line of lines){

showTyping();
await wait(700);
hideTyping();

if(line) add(line,"bot");

await wait(300);
}

});

}

/* =========================
   CHOICES
========================= */

function renderChoices(){
choicesBox.innerHTML="";
const s=story[state.step];

Object.keys(s.a).forEach(opt=>{
const b=document.createElement("button");
b.textContent=opt;

b.onclick=()=>handle(opt);

choicesBox.appendChild(b);
});
}

/* =========================
   HANDLE INPUT
========================= */

async function handle(opt){

if(state.locked) return;
state.locked=true;

add(opt,"user");

remember(`step_${state.step}`,opt);
updateMood();

const data=story[state.step];

await speak(data.a[opt]);

state.step++;

if(state.step < story.length){

await speak([story[state.step].q]);
renderChoices();

state.locked=false;
return;
}

await speak([
"makasih ya 🤍",
"obrolan ini hangat banget"
]);

state.locked=false;
}

/* =========================
   START
========================= */

async function startChat(){

home.classList.add("hidden");
chatScreen.classList.remove("hidden");

state.step=0;
chatBox.innerHTML="";

await speak([
"hai 🌸",
"aku Nova V3"
]);

await speak([story[0].q]);

renderChoices();
}

/* =========================
   HOME
========================= */

function goHome(){
location.reload();
}

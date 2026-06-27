const home = document.getElementById("home");
const chatScreen = document.getElementById("chatScreen");
const chat = document.getElementById("chat");
const choices = document.getElementById("choices");
const typing = document.getElementById("typing");
const statusText = document.getElementById("statusText");
const musicBtn = document.getElementById("musicBtn");
const bgm = document.getElementById("bgm");

const app = {
    step:0,
    locked:false,
    music:false,
    queue:Promise.resolve(),
    memory:{}
};

const nova = {
    mood:"happy",
    typing:false
};

/* ===================== DATA ===================== */

const conversation = [/* sama seperti punyamu */];

const intro = [
"haii 😊","aku Nova.","seneng kamu datang 🌸","boleh aku nemenin kamu?"
];

const filler = ["hehe 🤍","hmm...","aku penasaran deh 😊"];

/* ===================== HELPERS ===================== */

function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }

function random(a){ return a[Math.floor(Math.random()*a.length)]; }

function setStatus(t){ statusText.textContent=t; }

function scroll(){ chat.scrollTop = chat.scrollHeight; }

/* ===================== BUBBLE ===================== */

function add(text,type){
    const d=document.createElement("div");
    d.className=`msg ${type}`;
    d.textContent=text;
    chat.appendChild(d);
    scroll();
}

/* ===================== TYPING ===================== */

function showTyping(){ typing.classList.remove("hidden"); }
function hideTyping(){ typing.classList.add("hidden"); }

/* ===================== SPEAK (FINAL FIX) ===================== */

function speak(lines){
    app.queue = app.queue.then(async()=>{
        for(const l of lines){

            showTyping();
            await wait(800);
            hideTyping();

            if(l) add(l,"bot");
            await wait(300);
        }
    });
}

/* ===================== CHOICES ===================== */

function showChoices(){
    choices.innerHTML="";
    const c=conversation[app.step];

    Object.keys(c.options).forEach(opt=>{
        const b=document.createElement("button");
        b.className="choice";
        b.textContent=opt;

        b.onclick=()=>handle(opt);

        choices.appendChild(b);
    });
}

/* ===================== MEMORY ===================== */

function remember(k,v){ app.memory[k]=v; }
function recall(k){ return app.memory[k]; }

/* ===================== MOOD ===================== */

function reactMemory(){
    if(app.memory.step_1==="belum") nova.mood="care";
}

/* ===================== ADAPTIVE ===================== */

function adaptiveQuestion(){
    return conversation[app.step].question;
}

/* ===================== FLOW ===================== */

async function handle(opt){

    if(app.locked) return;
    app.locked=true;

    add(opt,"user");
    remember(`step_${app.step}`,opt);
    reactMemory();

    const c=conversation[app.step];
    let reply=[...c.options[opt]];

    await speak(reply);

    app.step++;

    if(app.step<conversation.length){
        await speak([adaptiveQuestion()]);
        showChoices();
        app.locked=false;
        return;
    }

    await speak(["makasih ya 🤍"]);
}

/* ===================== START ===================== */

async function startChat(){
    home.classList.add("hidden");
    chatScreen.classList.remove("hidden");

    app.step=0;
    chat.innerHTML="";

    await speak(intro);
    await speak([adaptiveQuestion()]);
    showChoices();
}

/* ===================== HOME ===================== */

function goHome(){
    location.reload();
}

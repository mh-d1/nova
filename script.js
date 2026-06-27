// ======================================================
// NOVA V2
// Script.js
// Tahap 1 / 6
// ======================================================

// ======================================================
// ELEMENT
// ======================================================

const home = document.getElementById("home");
const chatScreen = document.getElementById("chatScreen");

const chat = document.getElementById("chat");
const choices = document.getElementById("choices");

const typing = document.getElementById("typing");
const statusText = document.getElementById("statusText");

const musicBtn = document.getElementById("musicBtn");
const bgm = document.getElementById("bgm");


// ======================================================
// APP
// ======================================================

const app = {

    step:0,

    locked:false,

    music:false,

    queue:Promise.resolve(),

    memory:{}

};

// ======================================================
// NOVA
// ======================================================

const nova={

    name:"Nova",

    mood:"happy",

    typing:false

};

// ======================================================
// CONVERSATION
// ======================================================

const conversation=[

{

question:"sekarang lagi di mana nih? 🥺",

options:{

"di kamar":[

"ohh di kamar ya 😊",

"berarti lagi santai nih.",

"aku suka suasana kayak gitu.",

"jadi pengen nemenin ngobrol lebih lama 🤍"

],

"di luar":[

"lagi di luar ya 😊",

"jangan lupa hati-hati ya.",

"semoga harimu lancar 🌸",

"eh... jangan lupa istirahat juga."

],

"rebahan":[

"hehe 😭",

"rebahan emang susah ditolak ya.",

"aku gak nyalahin kok.",

"yang penting nyaman 🤍"

],

"gak tau":[

"eh kok bisa gak tau 😭",

"gapapa deh.",

"yang penting sekarang aku bisa ngobrol sama kamu 😊"

]

},

next:"eh iya... aku jadi penasaran deh 🤭"

},

{

question:"udah makan belum? 🍽️",

options:{

"udah":[

"yeay 😊",

"aku jadi lega.",

"bagus deh."

],

"belum":[

"yahh 🥺",

"aku jadi kepikiran.",

"habis ini makan ya?"

],

"nanti":[

"hehe... nanti terus 😭",

"janji jangan kelamaan ya."

],

"lupa":[

"aduhh 😭",

"itu tandanya kamu harus makan 🤍"

]

},

next:"ngomong-ngomong..."

},

{

question:"sekarang lagi ngapain? 😙",

options:{

"rebahan":[

"pantes 😭",

"aku nebak juga gitu."

],

"scroll hp":[

"ketauan lagi asik scroll 🤭"

],

"denger lagu":[

"wahh 🎵",

"lagu bisa bikin suasana beda ya."

],

"diam aja":[

"kadang diem juga enak kok 😊"

]

},

next:"boleh nanya lagi gak? 🥺"

},

{

question:"kalau aku duduk di sebelah kamu... kamu bakal ngapain? 🤍",

options:{

"peluk kamu":[

"ehhh 😳",

"tiba-tiba banget.",

"bikin aku senyum sendiri tau."

],

"deket aja":[

"hehe 😊",

"boleh kok."

],

"ngobrol":[

"aku suka pilihan itu 🤍"

],

"malu":[

"kok malah malu 😭"

]

},

next:"aku penasaran satu hal lagi..."

},

{

question:"akhir-akhir ini ada yang lagi kamu pikirin gak? 👀",

options:{

"iya":[

"pelan-pelan ya 😊",

"aku yakin kamu bisa."

],

"sering":[

"capek ya? 🥺",

"semoga semuanya cepat membaik."

],

"gak tau":[

"gapapa kok 🤍"

],

"enggak":[

"syukurlah 😊"

]

},

next:"terakhir nih..."

},

{

question:"kalau aku ada di dekat kamu... kamu nyaman gak? 🌸",

options:{

"nyaman":[

"hehe 😊",

"aku seneng dengernya."

],

"lumayan":[

"itu juga udah bikin aku senyum."

],

"biasa aja":[

"wajar kok 😊"

],

"agak risih":[

"makasih ya udah jujur.",

"aku gak marah kok 🤍"

]

},

next:null

}

];

// ======================================================
// INTRO
// ======================================================

const intro=[

"haii 😊",

"aku Nova.",

"seneng akhirnya kamu datang 🌸",

"makasih ya udah mampir.",

"boleh aku nemenin kamu sebentar? 🤍"

];

// ======================================================
// RANDOM
// ======================================================

const filler=[

"hehe 🤍",

"eh iya...",

"hmm...",

"ngomong-ngomong...",

"aku penasaran deh 😊",

"boleh nanya lagi gak? 🥺"

];

// ======================================================
// HELPER
// ======================================================

function wait(ms){

    return new Promise(resolve=>setTimeout(resolve,ms));

}

function random(arr){

    return arr[
        Math.floor(Math.random()*arr.length)
    ];

}

function getTime(){

    const now=new Date();

    return now.toLocaleTimeString("id-ID",{

        hour:"2-digit",

        minute:"2-digit"

    });

}

// ======================================================
// NOVA V2
// Script.js
// Tahap 2 / 6
// Bubble • Typing • Status • Message System
// ======================================================

// ======================================================
// STATUS
// ======================================================

function setStatus(text){

    if(!statusText) return;

    statusText.textContent=text;

}

// ======================================================
// SCROLL
// ======================================================

function scrollBottom(){

    chat.scrollTo({

        top:chat.scrollHeight,

        behavior:"smooth"

    });

}

// ======================================================
// TYPING
// ======================================================

function showTyping(){

    nova.typing=true;

    typing.classList.remove("hidden");

    setStatus("sedang mengetik...");

    scrollBottom();

}

function hideTyping(){

    nova.typing=false;

    typing.classList.add("hidden");

    setStatus("online");

}

// ======================================================
// MESSAGE
// ======================================================

function createBubble(type,text){

    const bubble=document.createElement("div");

    bubble.className=`msg ${type}`;

    bubble.innerHTML=`

        <div class="text">${text}</div>

        <div class="time">${getTime()}</div>

    `;

    chat.appendChild(bubble);

    requestAnimationFrame(()=>{

        bubble.classList.add("show");

    });

    scrollBottom();

    return bubble;

}

function addBot(text){

    createBubble("bot",text);

}

function addUser(text){

    createBubble("user",text);

}

// ======================================================
// NOVA SPEAK
// ======================================================



// ======================================================
// CHOICES
// ======================================================

function clearChoices(){

    choices.innerHTML="";

}

function showChoices(){

    clearChoices();

    const current=conversation[app.step];

    const list=Object.keys(current.options);

    list.forEach((option,index)=>{

        const button=document.createElement("button");

        button.className="choice";

        button.textContent=option;

        button.style.animationDelay=`${index*0.08}s`;

        button.onclick=()=>handleChoice(option);

        choices.appendChild(button);

    });

}

// ======================================================
// INTRO
// ======================================================

async function playIntro(){

    await speak(intro);

    await speak([

        random(filler),

        adaptiveQuestion()

    ]);

    showChoices();

}

// ======================================================
// MEMORY
// ======================================================

function remember(key,value){

    app.memory[key]=value;

}

function recall(key){

    return app.memory[key];

}

// ======================================================
// NOVA V2
// Script.js
// Tahap 3 / 6
// Conversation Flow
// ======================================================

// ======================================================
// HANDLE CHOICE
// ======================================================

async function handleChoice(option){

    if(app.locked) return;

    app.locked=true;

    clearChoices();

    addUser(option);

    remember(`step_${app.step}`,option);

    reactMemory();

    const current=conversation[app.step];

    const reply=[...current.options[option]];

    // ==================================================
    // LITTLE MEMORIES
    // ==================================================

    if(app.step===1){

        const place=recall("step_0");

        if(place==="di kamar"){

            reply.push(
                "di kamar pasti lebih enak buat makan santai ya 😊"
            );

        }

        if(place==="di luar"){

            reply.push(
                "kalau lagi di luar jangan lupa cari makan juga ya 🤍"
            );

        }

    }

    if(app.step===2){

        const eat=recall("step_1");

        if(eat==="belum"){

            reply.push(
                "aku masih kepikiran soal kamu yang belum makan tadi 🥺"
            );

        }

        if(eat==="udah"){

            reply.push(
                "untung tadi kamu udah makan 😊"
            );

        }

    }

    // ==================================================
    // TRANSITION
    // ==================================================

    if(current.next){

        reply.push("");

        reply.push(current.next);

    }

    await speak(reply);

    app.step++;

    // ==================================================
    // NEXT QUESTION
    // ==================================================

    if(app.step<conversation.length){

        await speak([

            adaptiveQuestion()
        ]);

        showChoices();

        app.locked=false;

        return;

    }

    // ==================================================
    // END CHAT
    // ==================================================

    await ending();

    app.locked=false;

}

// ======================================================
// ENDING
// ======================================================

async function ending(){

    let last="";

    const comfort=recall("step_5");

    if(comfort==="nyaman"){

        last="hehe... itu bikin aku senyum sendiri 😊";

    }

    else if(comfort==="lumayan"){

        last="pelan-pelan aja ya... aku seneng kok 🤍";

    }

    else if(comfort==="biasa aja"){

        last="semoga nanti kita bisa lebih akrab ya 🌸";

    }

    else{

        last="makasih ya udah jujur sama aku 😊";

    }

    await speak([

        last,

        "ternyata ngobrol sama kamu enak juga.",

        "makasih ya udah nemenin aku hari ini 🤍",

        "semoga habis ini harimu jadi sedikit lebih baik 🌸",

        "kalau nanti kamu balik lagi...",

        "aku bakal tetap di sini 😊"

    ]);

    const restart=document.createElement("button");

    restart.className="choice";

    restart.textContent="💬 ngobrol lagi";

    restart.onclick=restartChat;

    choices.appendChild(restart);

}

// ======================================================
// NOVA V2
// Script.js
// Tahap 4 / 6
// Home • Restart • Music • Init
// ======================================================

// ======================================================
// START CHAT
// ======================================================

async function startChat(){

    home.classList.add("hidden");

    chatScreen.classList.remove("hidden");

    app.step=0;

    app.locked=true;

    app.queue=Promise.resolve();

    app.memory={};

    chat.innerHTML="";

    clearChoices();

    hideTyping();

    await playIntro();

    app.locked=false;

}

// ======================================================
// RESTART
// ======================================================

async function restartChat(){

    app.step=0;

    app.locked=true;

    app.queue=Promise.resolve();

    app.memory={};

    chat.innerHTML="";

    clearChoices();

    hideTyping();

    await speak([

        "hehe... 😊",

        "seneng kamu balik lagi 🤍",

        "kita ngobrol dari awal lagi yuk."

    ]);

    await speak([

        conversation[0].question

    ]);

    showChoices();

    app.locked=false;

}

// ======================================================
// HOME
// ======================================================

function goHome(){

    home.classList.remove("hidden");

    chatScreen.classList.add("hidden");

    app.step=0;

    app.locked=false;

    app.queue=Promise.resolve();

    app.memory={};

    chat.innerHTML="";

    clearChoices();

    hideTyping();

    if(app.music){

        fadeOut();

    }

}

// ======================================================
// MUSIC
// ======================================================

function fadeIn(){

    bgm.volume=0;

    bgm.play().catch(()=>{});

    let volume=0;

    const timer=setInterval(()=>{

        volume+=0.02;

        if(volume>=0.35){

            volume=0.35;

            clearInterval(timer);

        }

        bgm.volume=volume;

    },60);

}

function fadeOut(){

    let volume=bgm.volume;

    const timer=setInterval(()=>{

        volume-=0.02;

        if(volume<=0){

            volume=0;

            bgm.volume=0;

            bgm.pause();

            clearInterval(timer);

            return;

        }

        bgm.volume=volume;

    },60);

    app.music=false;

    musicBtn.textContent="♪";

}

musicBtn.addEventListener("click",()=>{

    app.music=!app.music;

    if(app.music){

        fadeIn();

        musicBtn.textContent="♫";

        return;

    }

    fadeOut();

});

// ======================================================
// AUTO SCROLL
// ======================================================

const observer=new MutationObserver(()=>{

    scrollBottom();

});

observer.observe(chat,{

    childList:true

});

// ======================================================
// SHORTCUT
// ======================================================

document.addEventListener("keydown",(e)=>{

    if(home.classList.contains("hidden")) return;

    if(e.key==="Enter"){

        startChat();

    }

});

// ======================================================
// FIRST LOAD
// ======================================================

hideTyping();

setStatus("online");

// ======================================================
// NOVA V2
// Script.js
// TAHAP 5 / 6
// Emotion + Memory Upgrade
// ======================================================

// ======================================================
// EMOTION ENGINE
// ======================================================

function setMood(mood){

    nova.mood = mood;

    const moodMap = {
        happy: "online",
        sad: "sedikit tenang...",
        care: "fokus ke kamu...",
        excited: "aktif ✨"
    };

    setStatus(moodMap[mood] || "online");
}

// ======================================================
// MEMORY REACTION SYSTEM
// ======================================================

function reactMemory(){

    const m = app.memory;

    if(m.step_1 === "belum") setMood("care");

    if(m.step_0 === "di luar") setMood("happy");

    if(m.step_5 === "nyaman") setMood("happy");

    if(m.step_5 === "agak risih") setMood("sad");

}

// ======================================================
// NOVA V2
// Script.js
// TAHAP 6 / 6
// Spontaneous Engine + Adaptive Speech
// ======================================================

// ======================================================
// RANDOM SPONTANEOUS RESPONSE
// ======================================================

function maybeInject(){

    const chance = Math.random();

    if(chance < 0.3){

        return random(filler);

    }

    return null;
}

// ======================================================
// UPGRADED SPEAK SYSTEM
// ======================================================

async function speak(lines){

    app.queue = app.queue.then(async () => {

        for(const line of lines){

            const extra = maybeInject();

            if(extra){

                showTyping();
                await wait(500);
                hideTyping();
                addBot(extra);
                await wait(300);
            }

            showTyping();

            await wait(700 + Math.random() * 500);

            hideTyping();

            if(line !== "") addBot(line);

            await wait(420);
        }
    });

    return app.queue;
}

// ======================================================
// ADAPTIVE QUESTION SYSTEM
// ======================================================

function adaptiveQuestion(){

    const mood = nova.mood;
    const step = app.step;

    const base = conversation[step].question;

    if(mood === "care"){
        return base + " (aku ngerasa kamu lagi pengen dipahami ya 🥺)";
    }

    if(mood === "sad"){
        return base + " (pelan-pelan aja ya 🤍)";
    }

    return base;
}

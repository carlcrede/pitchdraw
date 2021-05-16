const playButton = document.getElementById("play-button");
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const spaceBtn = document.getElementById('space_btn');
const clearBtn = document.getElementById('clear_btn');

let coordinates = {x: 0, y: 0};
let paint = false;

const sound = new Howl({
    src: ['./space.ogg']
});


/* TONE.JS */

// SYNTH
const synth = new Tone.DuoSynth({
    vibratoAmount: 0.5,
    vibratoRate: 5,
    portamento: 0.1,
    harmonicity: 1.005,
    volume: 5,
    voice0: {
        oscillator: {
            type: "sawtooth"
        },
        filter: {
            Q: 1,
            type: "lowpass",
            rolloff: -24
        },
        envelope: {
            attack: 0.01,
            decay: 0.25,
            sustain: 0.4,
            release: 1.2
        },
        filterEnvelope: {
            attack: 0.001,
            decay: 0.05,
            sustain: 0.3,
            release: 2,
            baseFrequency: 100,
            octaves: 4
        }
    },
    voice1: {
        oscillator: {
            type: "sawtooth"
        },
        filter: {
            Q: 2,
            type: "bandpass",
            rolloff: -12
        },
        envelope: {
            attack: 0.25,
            decay: 4,
            sustain: 0.1,
            release: 0.8
        },
        filterEnvelope: {
            attack: 0.05,
            decay: 0.05,
            sustain: 0.7,
            release: 2,
            baseFrequency: 5000,
            octaves: -1.5
        }
    }
}).toDestination();

const synthNotes = ["C2", "E2", "G2", "A2",
			"C3", "D3", "E3", "G3", "A3", "B3",
			"C4", "D4", "E4", "G4", "A4", "B4", "C5"];

function move( x, y ) {
    const note = synthNotes[Math.round(x * (synthNotes.length - 1))];
    synth.setNote(note);
    synth.vibratoAmount.value = y;
}

function triggerAttack( x, y ) {
    const note = synthNotes[Math.round(x * (synthNotes.length - 1))];
    synth.triggerAttack(note);
    synth.vibratoAmount.value = y;
}

// Tone.js

/* EVENT LISTENERS */

window.onload = () => {
    canvas.style.cursor = "url('/cursor.png'), auto";
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;   
}

spaceBtn.onclick = () => {
    sound.playing() ? sound.stop() : sound.play();
}

clearBtn.onclick = () => {
    ctx.clearRect(0,0, canvas.width, canvas.height);
}

canvas.addEventListener('mousemove', (event) => {
    let mouse = getMousePos(canvas, event);
    sketch(mouse);
    move(mouse.x/canvas.width, mouse.y/canvas.height);
});

canvas.addEventListener('mousedown', (event) => {
    let mouse = getMousePos(canvas, event);
    startPainting(mouse);
    triggerAttack(mouse.x/canvas.width, mouse.y/canvas.height);
});

canvas.addEventListener('mouseup', () => {
    stopPainting();
    synth.triggerRelease();
});

// eventlisteners


/*
**  PAINT
*/

function getMousePos(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

function setMousePos(pos) {
    coordinates.x = pos.x;
    coordinates.y = pos.y;
}

function startPainting(mouse) {
    paint = true;
    setMousePos(mouse);
}

function stopPainting() {
    paint = false;
}

function sketch(pos) {
    if (!paint) return;
    
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.moveTo(coordinates.x, coordinates.y);
    setMousePos(pos);
    ctx.lineTo(coordinates.x, coordinates.y);
    ctx.stroke();
}

// Paint
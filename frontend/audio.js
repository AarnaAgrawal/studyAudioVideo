let currentUtterance = null;
let lastText = "";
let isPaused = false;
// CLEAN TEXT
function cleanText(text) {
  return text
    .replace(/[#*_`]/g, "")
    .replace(/\n+/g, ". ")
    .replace(/•/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
// GENERATE
document.getElementById("convert").addEventListener("click", async () => {
  speechSynthesis.cancel();
  const notes = document.getElementById("notesEnter").value;
  document.getElementById("status").textContent = "Generating...";
  const res = await fetch("http://localhost:3000/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notes })
  });
  const data = await res.json();
  document.getElementById("status").textContent = "";
  const clean = cleanText(data.result);
  lastText = clean;
  document.getElementById("output").textContent = clean;
  // NEW UTTERANCE
  currentUtterance = new SpeechSynthesisUtterance(clean);
  currentUtterance.rate = 0.95;
  isPaused = false;
  speechSynthesis.speak(currentUtterance);
});


// ▶ PLAY / RESUME
document.getElementById("play").addEventListener("click", () => {
  if (!lastText) return;

  // if paused → resume instead of restart
  if (isPaused) {
    speechSynthesis.resume();
    isPaused = false;
    return;
  }

  // only restart if nothing is playing
  if (!speechSynthesis.speaking) {
    currentUtterance = new SpeechSynthesisUtterance(lastText);
    currentUtterance.rate = 0.95;
    speechSynthesis.speak(currentUtterance);
  }
});


// ⏸ STOP (pause, NOT cancel)
document.getElementById("stop").addEventListener("click", () => {
  if (speechSynthesis.speaking) {
    speechSynthesis.pause();
    isPaused = true;
  }
});

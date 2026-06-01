let currentUtterance = null;
let lastTranscript = "";
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
  const status = document.getElementById("status");

  status.textContent = "Generating...";

  try {
    const res = await fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes })
    });

    const data = await res.json();

    status.textContent = "";

    // UI updates
    document.getElementById("episodeTitle").textContent = data.title;
    document.getElementById("episodeLength").textContent = `${data.length} min lesson`;
    document.getElementById("cover").src = data.cover;

    const clean = cleanText(data.transcript);
    lastTranscript = clean;

    document.getElementById("output").textContent = clean;

    speak(clean);

  } catch (err) {
    console.error(err);
    status.textContent = "Error generating lesson";
  }
});


// ▶ PLAY / RESUME
document.getElementById("play").addEventListener("click", () => {
  if (!lastTranscript) return;

  if (isPaused) {
    speechSynthesis.resume();
    isPaused = false;
    return;
  }

  if (!speechSynthesis.speaking) {
    speak(lastTranscript);
  }
});


// ⏸ STOP (pause)
document.getElementById("stop").addEventListener("click", () => {
  if (speechSynthesis.speaking) {
    speechSynthesis.pause();
    isPaused = true;
  }
});


// SPEECH ENGINE
function speak(text) {
  speechSynthesis.cancel();

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.rate = 0.95;

  currentUtterance.onend = () => {
    isPaused = false;
  };

  speechSynthesis.speak(currentUtterance);
}

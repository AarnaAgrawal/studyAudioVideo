document.getElementById("convert").addEventListener("click", async () => {
    speechSynthesis.cancel();
    const notes = document.getElementById("notesEnter").value;
  
    const res = await fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ notes })
    });
  
    const data = await res.json();
  
    console.log(data.result);
    document.getElementById("transcript").textContent = data.result;

    const text = data.result;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;   // speed
    utterance.pitch = 1;  // voice tone

    speechSynthesis.speak(utterance);
  });

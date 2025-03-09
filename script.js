const timeline = document.getElementById("timeline");
const moodSelect = document.getElementById("moodSelect");

// Define Punjabi moods
const moodsPunjabi = [
    "ਖੁਸ਼ Happy", "ਉਦਾਸ Sad", "ਗੁੱਸੇ Angry", "ਰੋਮਾਂਟਿਕ Romantic",
    "ਵਿਚਾਰਸ਼ੀਲ Reflective", "ਉਤਸ਼ਾਹਿਤ Excited", "ਸ਼ਾਂਤ Calm",
    "ਆਸਵੰਦ Hopeful", "ਭਾਵੁਕ Nostalgic", "ਧੰਨਵਾਦੀ Grateful",
    "ਪਿਆਰ ਕਰਨ ਵਾਲਾ Loving", "ਇਕੱਲਾ Lonely", "ਚਿੰਤਤ Anxious",
    "ਸ਼ਾਂਤੀਪੂਰਨ Peaceful", "ਮੂਰਖ Silly", "ਪ੍ਰੇਰਿਤ Inspired",
    "ਮਲਾਲ Melancholic", "ਕ੍ਰੋਧਿਤ Furious", "ਜਜ਼ਬਾਤੀ Passionate"
];

// Populate dropdown dynamically
moodsPunjabi.forEach(mood => {
    const option = document.createElement("option");
    option.value = mood;
    option.text = mood;
    moodSelect.appendChild(option);
});

// Function to generate poetry
async function createPoetry() {
    const mood = moodSelect.value;
    if (!mood) {
        alert("Please select a mood.");
        return;
    }

    try {
        const response = await fetch(`https://pbkv.netlify.app/.netlify/functions/generatePoetry?mood=${encodeURIComponent(mood)}`);
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        const generatedPoem = data.poem;
        const timestamp = new Date().toLocaleString();

        const entry = document.createElement("div");
        entry.className = "thought-entry";
        entry.innerHTML = `<p>${mood}<br><br>${generatedPoem}</p><div class="timestamp">${timestamp}</div>`;

        timeline.prepend(entry);
    } catch (error) {
        console.error("Error:", error);
        alert("Error generating poem: " + error.message);
    }
}

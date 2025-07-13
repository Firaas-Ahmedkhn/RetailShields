let typingEvents = [];

export function initTypingTracker(inputRef) {
  typingEvents = [];

  const input = inputRef.current;
  if (!input) return;

  console.log("✅ Typing tracker initialized");

  input.addEventListener("keydown", handleKeyDown);
  input.addEventListener("keyup", handleKeyUp);
}

export function cleanupTypingTracker(inputRef) {
  const input = inputRef.current;
  if (!input) return;

  input.removeEventListener("keydown", handleKeyDown);
  input.removeEventListener("keyup", handleKeyUp);

  console.log("🧹 Typing tracker cleaned up");
}

export function resetTypingTracker() {
  typingEvents = [];
  console.log("🔁 Typing events reset");
}

function handleKeyDown(e) {
  if (e.key.length === 1 || e.key === "Backspace" || e.key === "Enter") {
    typingEvents.push({ key: e.key, event: "down", time: performance.now() });
    console.log("⬇️ Key down:", e.key);
    console.log("📊 Total typing events so far:", typingEvents.length);
  }
}

function handleKeyUp(e) {
  if (e.key.length === 1 || e.key === "Backspace" || e.key === "Enter") {
    typingEvents.push({ key: e.key, event: "up", time: performance.now() });
    console.log("⬆️ Key up:", e.key);
    console.log("📊 Total typing events so far:", typingEvents.length);
  }
}

export function extractFeatures(password) {
  console.log("🔍 Extracting features for password:", password);
  console.log("📜 Final typing events count:", typingEvents.length);

  const downs = typingEvents
    .filter(e => e.event === "down" && e.key.length === 1)
    .slice(0, password.length);

  const ups = typingEvents
    .filter(e => e.event === "up" && e.key.length === 1)
    .slice(0, password.length);

  console.log("⬇️ Downs:", downs);
  console.log("⬆️ Ups:", ups);

  if (downs.length !== password.length || ups.length !== password.length) {
    console.warn("⛔ Not enough typing events captured for full password");
    return [];
  }

  const hold = ups.map((u, i) => u.time - downs[i].time);

  const dd = [];
  const ud = [];

  for (let i = 0; i < downs.length - 1; i++) {
    dd.push(downs[i + 1].time - downs[i].time);
    ud.push(downs[i + 1].time - ups[i].time);
  }

  const totalDuration = ups[ups.length - 1].time - downs[0].time;
  const avgHold = hold.reduce((a, b) => a + b, 0) / hold.length;
  const avgDD = dd.reduce((a, b) => a + b, 0) / dd.length;

  const featureVector = [...hold, ...dd, ...ud, totalDuration, avgHold, avgDD];

  console.log("🧠 Feature Vector (Length:", featureVector.length, "):", featureVector);

  return featureVector;
}

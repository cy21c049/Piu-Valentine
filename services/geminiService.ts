
// We don't need the API key anymore!
// We will use a pre-set list of romantic messages instead.

const LOVE_NOTES = [
  "You mean the world to me! 🌎",
  "My heart beats only for you! 💓",
  "You are my favorite person! 🥰",
  "Every day is better with you! ☀️",
  "You are the love of my life! 💑",
  "Forever isn't long enough! ⏳",
  "You make my soul happy! ✨",
  "I love you more than words! 📝",
  "You are my greatest adventure! 🚀",
  "My heart is yours, always! 🔒"
];

export const generateValentinePoem = async (): Promise<string> => {
  // Simulate a short delay to make it feel like the app is "thinking"
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Pick a random note from the list
  const randomNote = LOVE_NOTES[Math.floor(Math.random() * LOVE_NOTES.length)];
  return randomNote;
};

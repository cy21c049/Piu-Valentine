
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateValentinePoem = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Write exactly one complete romantic sentence. It must be between 4 and 6 words long. Do not cut off. Example: You mean the world to me.",
      config: {
        maxOutputTokens: 100, // Increased to guarantee no cutoff
        temperature: 0.6, // Lower temperature for more stable, complete sentences
      }
    });
    
    let text = response.text?.trim();
    
    // Safety check: If the text is empty, too short, or looks like a fragment (less than 3 words)
    // we return a fallback to ensure the user never sees "You are..." again.
    if (!text || text.length < 10 || text.split(/\s+/).length < 3) {
        return "You are my forever love! ❤️";
    }
    
    return text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "You are my everything! ❤️";
  }
};

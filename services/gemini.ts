import { GoogleGenAI } from "@google/genai";

export const generateDescription = async (productName: string): Promise<string> => {
  // Fix: Directly initializing GoogleGenAI with process.env.API_KEY as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate an engaging, SEO-friendly, and high-converting product description for an e-commerce item named "${productName}" specifically for the Pakistani market. 
      Requirements:
      - Use persuasive language that appeals to local shoppers (value-oriented).
      - Focus on reliability and quality.
      - Include relevant keywords naturally.
      - Length must be between 150 and 250 characters.
      - Do not use hashtags or emojis.
      - Assume the audience prefers clear, direct benefits.`,
      config: {
        temperature: 0.8,
        topP: 0.95,
      },
    });

    // Fix: Using the .text property directly for string output extraction
    return response.text?.trim() || "No description generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate AI description.";
  }
};
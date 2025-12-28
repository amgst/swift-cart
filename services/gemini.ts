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

export const analyzeProductImage = async (imageBase64: string): Promise<{ name: string; description: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: "Analyze this product image and generate a catchy Product Name (max 5 words) and a high-converting Description (max 2 sentences) for a Pakistani e-commerce store. Return strictly valid JSON in this format: { \"name\": \"...\", \"description\": \"...\" }" },
            { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) return { name: '', description: '' };

    // Clean up markdown code blocks if present
    const cleanJson = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return { name: '', description: '' };
  }
};
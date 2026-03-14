import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateTryOn(personImageBase64: string, clothingDescription: string) {
  const model = ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: {
      parts: [
        {
          inlineData: {
            data: personImageBase64.split(",")[1],
            mimeType: "image/png",
          },
        },
        {
          text: `This is a photo of a person. Please generate a highly realistic image of this exact person virtually trying on the following clothing item: ${clothingDescription}. Maintain the person's pose, facial features, and background as much as possible, but replace their current upper body clothing with the specified item. The result should look like a professional fashion catalog photo.`,
        },
      ],
    },
  });

  const response = await model;
  
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Failed to generate try-on image");
}

import { GoogleGenAI, Type } from "@google/genai";
import { InterpretationResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const interpretScreenshots = async (
  images: { base64: string; mimeType: string }[]
): Promise<InterpretationResult[]> => {
  try {
    const imageParts = images.map((img) => ({
      inlineData: {
        mimeType: img.mimeType,
        data: img.base64,
      },
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          ...imageParts,
          {
            text: `Analyze these ${images.length} screenshots containing Cantonese text. 
            For EACH image, extract the Cantonese text precisely and translate it into natural, idiomatic English.
            The order of the results MUST match the order of the provided images.
            
            Return the result as a strictly valid JSON ARRAY, where each item matches this schema:
            {
              "cantonese": "The transcribed original text",
              "english": "The English translation",
              "notes": "Any context or slang explanation (optional, can be empty string)"
            }`
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              cantonese: {
                type: Type.STRING,
                description: "The original Cantonese text found in the image.",
              },
              english: {
                type: Type.STRING,
                description: "The English interpretation/translation.",
              },
              notes: {
                type: Type.STRING,
                description: "Contextual notes, slang explanations, or tone indicators.",
              },
            },
            required: ["cantonese", "english"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini.");
    }

    return JSON.parse(text) as InterpretationResult[];
  } catch (error) {
    console.error("Gemini Interpretation Error:", error);
    throw error;
  }
};

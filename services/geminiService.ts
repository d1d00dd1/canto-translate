import { GoogleGenAI, Type } from "@google/genai";
import { InterpretationResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const interpretScreenshot = async (
  base64Image: string,
  mimeType: string
): Promise<InterpretationResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: `Analyze this screenshot containing Cantonese text. 
            Extract the Cantonese text precisely.
            Translate it into natural, idiomatic English.
            Provide brief context notes if there are slang terms, cultural references, or ambiguity.
            
            Return the result in strictly valid JSON format matching this schema:
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
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini.");
    }

    return JSON.parse(text) as InterpretationResult;
  } catch (error) {
    console.error("Gemini Interpretation Error:", error);
    throw error;
  }
};

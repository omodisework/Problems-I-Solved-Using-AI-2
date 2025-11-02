import { GoogleGenAI, GenerateContentResponse, Tool, GoogleSearch } from "@google/genai";
import { SearchResult, GroundingChunk } from '../types';
import { GEMINI_MODEL } from '../constants';

interface GeminiServiceConfig {
  apiKey: string;
  onError: (error: string) => void;
}

// The AIStudio interface is now declared globally in types.ts
// so these local declarations are no longer needed.

const extractGroundingChunks = (response: GenerateContentResponse): GroundingChunk[] => {
  const chunks: GroundingChunk[] = [];
  const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
  if (groundingMetadata?.groundingChunks) {
    for (const chunk of groundingMetadata.groundingChunks) {
      chunks.push(chunk as GroundingChunk);
    }
  }
  return chunks;
};

export const searchDesigners = async (
  prompt: string,
  country: string | null,
  onError: (error: string) => void,
): Promise<SearchResult | null> => {
  // Always create a new GoogleGenAI instance right before an API call
  // to ensure the latest API key is used, especially after a user selects one.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const fullPrompt = country
      ? `${prompt} in ${country}. Focus on agencies or public portfolios.`
      : prompt;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: fullPrompt,
      config: {
        tools: [{ googleSearch: {} } as Tool], // Use Google Search grounding
      },
    });

    if (response.text) {
      const groundingChunks = extractGroundingChunks(response);
      return {
        text: response.text,
        groundingChunks: groundingChunks,
      };
    }
    return null;
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    if (error.message && error.message.includes("Requested entity was not found.")) {
      onError("API Key error: Requested entity was not found. Please select your API key.");
    } else {
      onError(`Failed to search for designers: ${error.message || 'Unknown error'}`);
    }
    return null;
  }
};

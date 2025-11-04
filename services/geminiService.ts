import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { COLORING_BOOK_PROMPT } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateColoringPage = async (base64ImageData: string, mimeType: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: COLORING_BOOK_PROMPT,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return part.inlineData.data;
        }
    }
    
    throw new Error('Nenhum dado de imagem encontrado na resposta da API.');

  } catch (error) {
    console.error('Gemini API call failed:', error);
    throw new Error('Falha ao gerar a página para colorir da API Gemini.');
  }
};
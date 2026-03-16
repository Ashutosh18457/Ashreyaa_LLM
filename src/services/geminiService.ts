import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, AssistantCategory } from "../types";
import { ASSISTANT_CONFIGS } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async *chatStream(
    messages: Message[],
    category: AssistantCategory = 'general'
  ) {
    const config = ASSISTANT_CONFIGS[category];
    
    const contents = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [
        ...(msg.attachments?.map(att => ({
          inlineData: {
            mimeType: att.type,
            data: att.base64 || ''
          }
        })) || []),
        { text: msg.content }
      ]
    }));

    const responseStream = await this.ai.models.generateContentStream({
      model: config.model,
      contents,
      config: {
        systemInstruction: config.systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    for await (const chunk of responseStream) {
      yield chunk as GenerateContentResponse;
    }
  }
}

export const geminiService = new GeminiService();

import { Message, AssistantCategory } from "../types";

export class GeminiService {
  constructor() {}

  async chat(
    messages: Message[],
    userId: string,
    category: AssistantCategory = 'general'
  ): Promise<string> {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, messages, category })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate response');
      }

      return data.text;
    } catch (error: any) {
      console.error("[GeminiService] Proxy request failed:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();

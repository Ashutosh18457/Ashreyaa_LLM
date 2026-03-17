import { GoogleGenAI } from "@google/genai";
import { Message, AssistantCategory } from "../types";
import { ASSISTANT_CONFIGS } from "../constants";
import { db } from "../firebase";
import { doc, getDoc, setDoc, increment, serverTimestamp } from "firebase/firestore";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
  }

  async chat(
    messages: Message[],
    userId: string | null,
    category: AssistantCategory = 'general'
  ): Promise<string> {
    try {
      // 1. Check User Plan
      let plan = "unauthenticated";
      let usageCount = 0;
      let usageRef: any = null;

      if (db && userId) {
        try {
          const userDoc = await getDoc(doc(db, "users", userId));
          const userData = userDoc.data();
          plan = userData?.plan || "free";

          // 2. Check Usage Limits
          const today = new Date().toISOString().split("T")[0];
          usageRef = doc(db, "users", userId, "usage", today);
          const usageDoc = await getDoc(usageRef);
          const data = usageDoc.data() as { count: number } | undefined;
          usageCount = usageDoc.exists() ? data?.count || 0 : 0;
        } catch (err) {
          console.warn("Firestore usage check failed, proceeding with free tier limits.", err);
        }
      }

      const LIMIT = plan === "premium" ? 1000 : (plan === "unauthenticated" ? 5 : 10);

      if (usageCount >= LIMIT && userId) {
        throw new Error(`Daily limit reached. Please upgrade to premium.`);
      }

      // 3. Select Model based on plan
      const config = ASSISTANT_CONFIGS[category];
      const modelName = plan === "premium" ? "gemini-3.1-pro-preview" : "gemini-3-flash-preview";

      const dynamicSystemInstruction = `${config.systemInstruction}\n\nCURRENT USER STATUS: The user is currently ${plan === 'unauthenticated' ? 'NOT logged in' : `logged in with a ${plan.toUpperCase()} subscription`}.`;

      // 4. Generate Content
      const result = await this.ai.models.generateContent({
        model: modelName,
        contents: messages.map((m: any) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: dynamicSystemInstruction,
          tools: [{ googleSearch: {} }]
        }
      });

      // 5. Update Usage (Atomic)
      if (usageRef) {
        try {
          await setDoc(usageRef, {
            count: increment(1),
            updatedAt: serverTimestamp()
          }, { merge: true });
        } catch (err) {
          console.warn("Failed to update usage count.", err);
        }
      }

      return result.text || "No response generated.";
    } catch (error: any) {
      console.error("[GeminiService] Request failed:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();

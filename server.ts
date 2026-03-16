import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { readFileSync } from "fs";
import Stripe from "stripe";
import { GoogleGenAI } from "@google/genai";
import bodyParser from "body-parser";

dotenv.config();

let firebaseConfig: any = null;
try {
  firebaseConfig = JSON.parse(
    readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf8")
  );
} catch (error) {
  console.warn("firebase-applet-config.json not found. Falling back to environment variables.");
  firebaseConfig = {
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    firestoreDatabaseId: process.env.VITE_FIRESTORE_DATABASE_ID
  };
}

let genAI: GoogleGenAI | null = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

async function startServer() {
  // Initialize Firebase Admin
  if (!admin.apps.length) {
    admin.initializeApp(
      firebaseConfig.projectId ? { projectId: firebaseConfig.projectId } : undefined
    );
  }

  const db = admin.firestore();
  if (firebaseConfig.firestoreDatabaseId) {
    // @ts-ignore
    db.settings({ databaseId: firebaseConfig.firestoreDatabaseId });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy_key_to_prevent_crash");

  const app = express();
  const PORT = 3000;

  // Stripe Webhook needs raw body
  app.post("/api/webhooks/stripe", bodyParser.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      
      if (userId) {
        await db.collection("users").doc(userId).update({
          plan: "premium",
          stripeCustomerId: session.customer as string,
          subscriptionId: session.subscription as string,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`User ${userId} upgraded to premium`);
      }
    }

    res.json({ received: true });
  });

  app.use(cors());
  app.use(express.json());

  // Stripe Checkout
  app.post("/api/billing/create-checkout", async (req, res) => {
    const { userId, email } = req.body;
    
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Ashreya AI Premium",
                description: "Unlimited high-performance AI access",
              },
              unit_amount: 4900, // $49.00
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.APP_URL}/?payment=success`,
        cancel_url: `${process.env.APP_URL}/?payment=cancel`,
        client_reference_id: userId,
        customer_email: email,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Secure AI Proxy
  app.post("/api/ai/chat", async (req, res) => {
    const { userId, messages, category } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
      // 1. Check User Plan
      const userDoc = await db.collection("users").doc(userId).get();
      const userData = userDoc.data();
      const plan = userData?.plan || "free";

      // 2. Check Usage Limits
      const today = new Date().toISOString().split("T")[0];
      const usageRef = db.collection("users").doc(userId).collection("usage").doc(today);
      const usageDoc = await usageRef.get();
      const usageCount = usageDoc.exists ? usageDoc.data()?.count || 0 : 0;

      const LIMIT = plan === "premium" ? 1000 : 10; // Free limit: 10 per day

      if (usageCount >= LIMIT) {
        return res.status(429).json({ 
          error: "Daily limit reached", 
          plan,
          limit: LIMIT 
        });
      }

      // 3. Select Model based on plan
      const modelName = plan === "premium" ? "gemini-3.1-pro-preview" : "gemini-3-flash-preview";

      // 4. Update Usage (Atomic)
      await usageRef.set({
        count: admin.firestore.FieldValue.increment(1),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      // 5. Generate Content
      const result = await getGenAI().models.generateContent({
        model: modelName,
        contents: messages.map((m: any) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }]
        }))
      });

      res.json({ text: result.text });

    } catch (error: any) {
      console.error("AI Proxy Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

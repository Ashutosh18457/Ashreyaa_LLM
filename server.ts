import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { readFileSync } from "fs";
import Stripe from "stripe";
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

async function startServer() {
  // Initialize Firebase Admin
  if (!admin.apps.length) {
    try {
      admin.initializeApp(
        firebaseConfig.projectId ? { projectId: firebaseConfig.projectId } : undefined
      );
    } catch (error) {
      console.warn("Firebase Admin initialization failed. Firestore backend features will not work.", error);
    }
  }

  let db: admin.firestore.Firestore | null = null;
  try {
    db = admin.firestore();
    if (firebaseConfig.firestoreDatabaseId) {
      // @ts-ignore
      db.settings({ databaseId: firebaseConfig.firestoreDatabaseId });
    }
  } catch (error) {
    console.warn("Firestore initialization failed.", error);
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy_key_to_prevent_crash");

  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

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
      
      if (userId && db) {
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

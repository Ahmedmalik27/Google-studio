import express from "express";
import cors from "cors";
import "isomorphic-fetch";
import { GoogleGenAI, Type } from "@google/genai";

export const app = express();

// Enable CORS for all origins - critical for global functionality
app.use(cors({
  origin: true, // Reflect request origin
  credentials: true
}));

app.use(express.json());

const getApiKey = () => {
  return process.env.GEMINI_API_KEY || 
         process.env.GOOGLE_API_KEY || 
         process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
         process.env.WHALE_API_KEY || 
         process.env.WHALES_API_KEY;
};

const getGeminiClient = (apiKey: string) => {
  return new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
  });
};

const generateBlogWithGemini = async (apiKey: string, count: number) => {
  const ai = getGeminiClient(apiKey);
  
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: `Generate ${count} professional blog post objects for an enterprise software solution company called "Whales". 
    The company specializes in digital transformation, high-scale cloud architecture, and AI-driven business intelligence.
    
    CRITICAL: For the "coverImage" field, use high-quality, professional architectural or high-tech imagery from Unsplash. 
    Construct the URL using this pattern: https://images.unsplash.com/[IMAGE_ID]?auto=format&fit=crop&w=1200&q=80
    
    Ensure each post has a compelling title, slug, content (markdown, >300 words), excerpt, tags, SEO meta, and status "published".`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            slug: { type: Type.STRING },
            content: { type: Type.STRING },
            excerpt: { type: Type.STRING },
            status: { type: Type.STRING },
            metaTitle: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            coverImage: { type: Type.STRING }
          },
          required: ["title", "slug", "content", "excerpt", "status", "metaTitle", "metaDescription", "tags", "coverImage"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
};

const chatWithGemini = async (apiKey: string, messages: Array<{ role: string, content?: string, text?: string }>) => {
  const ai = getGeminiClient(apiKey);

  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: (m.content || m.text || "") as string }],
  }));

  const chat = ai.chats.create({
    model: "gemini-1.5-flash",
    history,
    config: {
      systemInstruction: "You are a human representative from Whales Solution. Behavior: Be extremely precise and conversational. Constraint: Keep responses short. Provide elaborate details ONLY when explicitly asked. Style: Talk like a busy, expert professional—not a chatbot. Objective: Help the user and eventually shift the conversation to WhatsApp (+44 7438 373644) for project finalization."
    }
  });
  
  const lastMessage = messages[messages.length - 1];
  const content = (lastMessage.content || lastMessage.text || "") as string;
  const result = await chat.sendMessage({ message: content });
  return result.text || "";
};

// Diagnostic endpoint
app.get("/api/ai/config-check", async (req, res) => {
  const apiKey = getApiKey();
  const diagInfo = { hasKey: !!apiKey, timestamp: new Date().toISOString() };

  if (req.query.test === 'true' && apiKey) {
    try {
      const text = await chatWithGemini(apiKey, [{ role: "user", content: "Diagnostic: Respond with 'Whale AI Online'" }]);
      return res.json({ ...diagInfo, testResult: text.trim() });
    } catch (err: unknown) {
      return res.status(500).json({ ...diagInfo, testError: err instanceof Error ? err.message : String(err) });
    }
  }
  res.json(diagInfo);
});

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    version: "1.0.3", // Version bump
    mode: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.post("/api/contact", async (req, res) => {
  try {
    const data = req.body;
    if (!data || !data.Email) {
      return res.status(400).json({ success: "false", message: "Invalid payload" });
    }

    console.log(`[Contact Proxy] Submitting to Web3Forms with key: ${process.env.WEB3FORMS_ACCESS_KEY ? 'User Key Detected' : 'Using Fallback'}`);

    const response = await fetch(`https://api.web3forms.com/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_ACCESS_KEY || "b2971b41-c5b6-4480-b327-1c765d944659",
        ...data,
        from_name: "Whales Solution Contact Form",
        subject: `New Inquiry from ${data.Name || 'Client'}`
      })
    });

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();
      if (!response.ok) {
        console.error("[Contact Proxy] Web3Forms Error:", result);
        return res.status(response.status).json({
          success: "false",
          message: result.message || "Priority transmission failed at provider",
          details: result
        });
      }
      return res.status(200).json(result);
    } else {
      const text = await response.text();
      console.warn("[Contact Proxy] Non-JSON response from provider:", text.substring(0, 200));
      return res.status(response.status).json({ 
        success: "false", 
        message: response.status === 403 ? "Forbidden: Please check domain authorization in Web3Forms" : "Provider returned non-JSON response",
        status: response.status
      });
    }
  } catch (error: unknown) {
    console.error("[Contact Proxy] Error:", error);
    res.status(500).json({ success: "false", message: "Network transmission error" });
  }
});

app.post("/api/ai/generate-blog", async (req, res) => {
  const { count = 5 } = req.body;
  const apiKey = getApiKey();

  try {
    if (!apiKey) {
      return res.status(500).json({ error: "No AI API keys configured." });
    }
    const posts = await generateBlogWithGemini(apiKey, count);
    return res.json(posts);
  } catch (error: unknown) {
    console.error("Blog Generation Proxy Error:", error);
    const err = error as { status?: number; code?: number; message?: string; details?: unknown };
    const errorMessage = err.message || "Failed to generate blog content";
    const status = (err.status === 429 || err.code === 429 || errorMessage.includes("429")) ? 429 : 
                   (err.status === 503 || err.code === 503 || errorMessage.toLowerCase().includes("overloaded")) ? 503 : 500;

    res.status(status).json({ 
      error: errorMessage, 
      code: status,
      advice: status === 429 ? "AI Quota exhausted. You can upgrade to a higher tier in the Settings > Secrets panel (Paid Model Flow)." : "",
      details: err.details || err 
    });
  }
});

app.post("/api/ai/chat", async (req, res) => {
  const { messages } = req.body;
  const apiKey = getApiKey();

  try {
    if (!apiKey) {
      return res.status(500).json({ error: "No AI API keys configured." });
    }
    const text = await chatWithGemini(apiKey, messages);
    return res.json({ text });
  } catch (error: unknown) {
    console.error("Whale AI Proxy Error:", error);
    const err = error as { status?: number; code?: number; message?: string; details?: unknown };
    const errorMessage = err.message || "Failed to get AI response";
    const status = (err.status === 429 || err.code === 429 || errorMessage.includes("429")) ? 429 : 
                   (err.status === 503 || err.code === 503 || errorMessage.toLowerCase().includes("overloaded")) ? 503 : 500;

    res.status(status).json({ 
      error: errorMessage, 
      code: status,
      advice: status === 429 ? "AI Quota exhausted. You can upgrade to a higher tier in the Settings > Secrets panel (Paid Model Flow)." : "",
      details: err.details || err 
    });
  }
});

export default app;

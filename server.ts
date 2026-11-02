import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve public static assets (including the user video in /public/assets/aistudio)
app.use(express.static(path.join(__dirname, 'public')));

// Server-side Gemini client with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: AI Real Estate Concierge Chat with High Thinking support
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, useHighThinking = true, propertyContext } = req.body;

    const systemInstruction = `You are the digital real estate concierge for Marina Art, a licensed real estate agent (REALTOR®) with Premier Haus Realty, LLC serving Houston and Katy, Texas.
Marina Art provides dedicated residential real estate guidance across Greater Houston, Katy (Cinco Ranch, Grand Lakes, Elyson), Memorial, River Oaks, The Heights, and surrounding Texas communities.
Key verified facts about Marina Art:
- Brokerage: Premier Haus Realty, LLC.
- Background: Brings a unique background in interior design, helping home buyers visualize layout potential and helping home sellers stage their properties for maximum aesthetic appeal.
- Languages: Fluent in English and Russian.
- Professional focus: Residential home buying, selling, and leasing with personalized client attention.
${propertyContext ? `Current Property Context (Demo Concept): ${JSON.stringify(propertyContext)}` : ''}
Tone: Warm, highly professional, knowledgeable about Houston and Katy neighborhoods, local school districts (like Katy ISD), and design/staging considerations. Always clearly clarify that displayed listings on this demo site are conceptual samples.`;

    if (useHighThinking) {
      // Use gemini-4-argon with high thinking
      const contents = (messages || []).map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-4-argon',
        contents,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        },
      });

      return res.json({ text: response.text || '' });
    } else {
      // Fast mode with gemini-3.8-flash
      const contents = (messages || []).map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
        },
      });

      return res.json({ text: response.text || '' });
    }
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to process concierge inquiry' });
  }
});

// Endpoint: Google Maps Grounding for Prime Locations & Elite Surroundings
app.post('/api/maps-grounding', async (req, res) => {
  try {
    const { query, latitude = 29.7858, longitude = -95.8245 } = req.body; // Default Katy / Houston, TX

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Provide an informative community, neighborhood and amenities guide for residential areas in: "${query}". Mention local parks, top school districts (like Katy ISD or Spring Branch ISD), dining, shopping centers, and transportation access in the Houston/Katy, Texas region.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: Number(latitude),
              longitude: Number(longitude),
            },
          },
        },
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    res.json({
      text: response.text || '',
      groundingChunks,
    });
  } catch (error: any) {
    console.error('Maps Grounding error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch maps grounding data' });
  }
});

// Endpoint: High-Quality Architectural Visualization Image Generation (1K, 2K, 4K)
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, imageSize = '1K', aspectRatio = '16:9' } = req.body;

    const luxuryPrompt = `Cinematic ultra-luxury architectural photography: ${prompt}. Minimalist cantilevered glass, warm glowing champagne lighting, dark emerald forest landscaping, reflective infinity water basin, twilight atmospheric mist, 8k resolution, architectural digest cover quality, no distortions.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: luxuryPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as '16:9' | '1:1' | '4:3',
          imageSize: imageSize as '1K' | '2K' | '4K',
        },
      },
    });

    let imageUrl = '';
    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      throw new Error('No image was returned from the model.');
    }

    res.json({ imageUrl });
  } catch (error: any) {
    console.error('Image Generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate architectural visualization' });
  }
});

// Endpoint: Microphone Audio Transcription for VIP Enquiries
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'No audio data provided' });
    }

    // Strip data URL prefix if present
    const cleanBase64 = audioBase64.replace(/^data:audio\/\w+;base64,/, '');

    const audioPart = {
      inlineData: {
        mimeType: mimeType,
        data: cleanBase64,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          {
            text: 'Transcribe this voice message accurately into clear text. Do not add commentary or introductory words, output only the transcribed speech.',
          },
        ],
      },
    });

    res.json({ transcription: response.text || '' });
  } catch (error: any) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: error.message || 'Failed to transcribe audio' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Luxury Real Estate server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

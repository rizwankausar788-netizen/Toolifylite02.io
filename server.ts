import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Initialize Gemini API client on the server side
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    try {
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (err) {
      console.error('Failed to initialize GoogleGenAI client:', err);
    }
  }

  // In-memory newsletter subscribers list
  const subscribers: { email: string; frequency: string; categories: string[]; createdAt: string }[] = [];

  // API: Newsletter subscription
  app.post('/api/newsletter/subscribe', (req, res) => {
    const { email, frequency = 'weekly', categories = [] } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const exists = subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase());
    if (!exists) {
      subscribers.push({
        email: email.trim().toLowerCase(),
        frequency,
        categories,
        createdAt: new Date().toISOString(),
      });
    }

    return res.json({
      success: true,
      message: `Successfully subscribed ${email}! You'll receive our ${frequency} AI intelligence digest.`,
      subscriberCount: 120400 + subscribers.length,
    });
  });

  // API: AI Tool Comparison Deep Dive
  app.post('/api/ai/compare', async (req, res) => {
    const { tools } = req.body;
    if (!tools || !Array.isArray(tools) || tools.length < 2) {
      return res.status(400).json({ error: 'Please provide at least 2 tools to compare.' });
    }

    const toolSummaries = tools
      .map(
        (t: any) =>
          `- ${t.name}: Category: ${t.category}, Pricing: ${t.pricing} (${t.pricingDetails}), Monthly Visits: ${t.monthlyVisits}, Rating: ${t.rating}/5. Tagline: ${t.tagline}. Description: ${t.description}. Features: ${(t.features || []).join(', ')}`
      )
      .join('\n');

    if (ai) {
      try {
        const prompt = `You are a world-class AI software analyst and product architect for ToolVerse directory.
Compare the following ${tools.length} AI tools with objective, high-utility rigor:

${toolSummaries}

Provide a structured, unbiased comparative breakdown formatted in clean markdown:
1. **Executive Verdict**: 2-sentence summary comparing their primary philosophies and standout strengths.
2. **Feature & Capability Matrix**: Key differences in features, workflow speed, and output quality.
3. **Pricing & Value Analysis**: Value proposition of their free tiers vs paid plans.
4. **Who Should Choose Which**:
${tools.map((t: any) => `   - **Choose ${t.name} if**: specific user profile or scenario`).join('\n')}
5. **Final Recommendation**: Clear closing recommendation for individual developers/creators vs enterprise teams.

Keep tone practical, authoritative, scan-friendly, and avoid generic filler.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        return res.json({
          analysis: response.text,
          model: 'gemini-3.8-flash',
          isLiveAI: true,
        });
      } catch (err: any) {
        console.error('Gemini compare error:', err);
      }
    }

    // Fallback comparison synthesis if Gemini API key is missing or encounters a network issue
    const toolNames = tools.map((t: any) => t.name).join(' vs ');
    const fallbackAnalysis = `### Executive Comparison: ${toolNames}

**Executive Verdict**:
${tools[0].name} and ${tools[1].name} represent distinct approaches in the ${tools[0].category} ecosystem. While **${tools[0].name}** focuses on high velocity with ${tools[0].monthlyVisits} monthly visits, **${tools[1].name}** offers targeted capabilities with a ${tools[1].pricing} pricing structure.

**Key Differences & Strengths**:
- **${tools[0].name}**: Excels in ${tools[0].tagline}. Key features include ${tools[0].features?.slice(0, 2).join(' and ') || 'rapid iteration'}.
- **${tools[1].name}**: Excels in ${tools[1].tagline}. Highlights include ${tools[1].features?.slice(0, 2).join(' and ') || 'flexible integration'}.

**Pricing & ROI**:
- **${tools[0].name}**: ${tools[0].pricingDetails}
- **${tools[1].name}**: ${tools[1].pricingDetails}

**Recommendation**:
- Choose **${tools[0].name}** for established workflows, high community adoption, and deep integration.
- Choose **${tools[1].name}** if you need alternative licensing, specialized features, or cost-effective scaling.`;

    return res.json({
      analysis: fallbackAnalysis,
      model: 'rule-based-fallback',
      isLiveAI: false,
    });
  });

  // API: AI Tool Matchmaker / Stack Advisor
  app.post('/api/ai/matchmaker', async (req, res) => {
    const { problem, budget, role, catalogTools } = req.body;
    if (!problem || typeof problem !== 'string') {
      return res.status(400).json({ error: 'Please describe the problem you want to solve.' });
    }

    if (ai) {
      try {
        const availableCatalog = (catalogTools || [])
          .slice(0, 25)
          .map((t: any) => `${t.name} (${t.category}, ${t.pricing}, ${t.tagline})`)
          .join('; ');

        const prompt = `You are the AI Stack Architect at ToolVerse AI Directory.
User Problem: "${problem}"
Role / Context: "${role || 'Creator / Tech Professional'}"
Budget Constraint: "${budget || 'Any'}"

Available Directory Tools:
${availableCatalog}

Provide a concrete, actionable recommendation tailored to the user's brief. Format in markdown:
1. **Recommended Primary Tool**: The single best tool for their exact need, why it fits, and how to start.
2. **Complete AI Workflow Recipe**: 2 to 3 tools combined in sequence to solve this end-to-end.
3. **Cost & Efficiency Breakdown**: How to execute this within their budget.
4. **Pro Tip for Maximum Productivity**: One practical expert tip for using this stack.

Keep the advice direct, specific, and immediately executable.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        return res.json({
          recommendation: response.text,
          model: 'gemini-3.8-flash',
          isLiveAI: true,
        });
      } catch (err: any) {
        console.error('Gemini matchmaker error:', err);
      }
    }

    // Fallback recommendation
    const fallbackRecommendation = `### Recommended AI Stack for Your Goal

**Primary Recommended Tool**:
Based on your goal to "${problem.slice(0, 80)}...", we recommend starting with a high-rated tool in our directory that offers a generous Free or Freemium tier.

**Suggested 3-Step AI Workflow Recipe**:
1. **Ideation & Text Strategy**: Draft specifications and prompts using frontier models like **Claude 3.7** or **ChatGPT**.
2. **Production & Execution**: Use specialized generative tools (e.g., **Cursor** for code, **Flux.1** or **Midjourney** for visuals, or **Runway Gen-3** for motion).
3. **Refinement & Polish**: Automate cleanups with **Granola** or **ElevenLabs** for synthetic narration.

**Budget Strategy**:
All suggested tools have free tiers or low entry tiers, keeping total monthly spend under $20.`;

    return res.json({
      recommendation: fallbackRecommendation,
      model: 'catalog-heuristic',
      isLiveAI: false,
    });
  });

  // API: AI Smart Semantic Search & Intent Parser
  app.post('/api/ai/smart-search', async (req, res) => {
    const { query, availableTools } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required.' });
    }

    if (ai) {
      try {
        const toolsList = (availableTools || []).slice(0, 30).map((t: any) => ({
          id: t.id,
          name: t.name,
          category: t.category,
          tagline: t.tagline,
        }));

        const prompt = `Given the user search query: "${query}", analyze the intent and return a JSON list of the top matching tool IDs from this list:
${JSON.stringify(toolsList)}

Respond ONLY with valid JSON:
{
  "matchedIds": ["id1", "id2", ...],
  "reasoning": "brief 1-sentence explanation of what user is seeking and why these match"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json({
          matchedIds: parsed.matchedIds || [],
          reasoning: parsed.reasoning || '',
          isLiveAI: true,
        });
      } catch (err) {
        console.error('Smart search error:', err);
      }
    }

    // Fallback: simple text match
    const q = query.toLowerCase();
    const matched = (availableTools || [])
      .filter((t: any) => t.name.toLowerCase().includes(q) || t.tagline.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))
      .map((t: any) => t.id);

    return res.json({
      matchedIds: matched,
      reasoning: `Matched ${matched.length} tools based on keyword presence.`,
      isLiveAI: false,
    });
  });

  // Dev server or Production static serving
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ToolVerse Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
});

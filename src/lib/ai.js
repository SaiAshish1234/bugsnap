const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash"
];

async function askGemini(prompt) {
  let lastError;

  for (const model of MODELS) {
    try {
      const url =
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message || `HTTP ${response.status}`
        );
      }

      return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (err) {
      console.warn(`Model failed: ${model}`, err);
      lastError = err;
    }
  }

  throw lastError;
}

export async function analyzeError(errorText, language) {
  const prompt = `
Return ONLY valid JSON.

Schema:
{
  "what": string,
  "why": string,
  "fix": string,
  "code": string,
  "language": string,
  "severity": "low" | "medium" | "high" | "critical"
}

Analyze this ${language} error:

${errorText}
`;

  const text = await askGemini(prompt);

  try {
    const clean = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(clean);
  } catch {
    return {
      what: 'Could not parse the error.',
      why: 'The AI response was not in the expected format.',
      fix: 'Please try again.',
      code: '',
      language,
      severity: 'medium',
    };
  }
}

export function detectLanguage(errorText) {
  const text = errorText.toLowerCase();
  if (text.includes('typeerror') || text.includes('referenceerror') || text.includes('syntaxerror') || text.includes('.jsx') || text.includes('.js')) return 'JavaScript';
  if (text.includes('traceback') || text.includes('nameerror') || text.includes('indentationerror') || text.includes('.py')) return 'Python';
  if (text.includes('nullpointerexception') || text.includes('classnotfoundexception') || text.includes('.java')) return 'Java';
  if (text.includes('cannot find module') || text.includes('module not found')) return 'Node.js';
  if (text.includes('.tsx') || text.includes('react')) return 'React';
  if (text.includes('undefined method') || text.includes('.rb')) return 'Ruby';
  return 'Auto';
}
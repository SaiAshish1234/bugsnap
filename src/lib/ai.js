const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

async function askGemini(prompt) {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export async function analyzeError(errorText, language) {
  const text = await askGemini(`
    You are an expert software debugger. Analyze this ${language} error and respond ONLY with a JSON object — no markdown, no backticks, no explanation outside the JSON.

    Error:
    "${errorText}"

    Respond with exactly this structure:
    {
      "what": "1-2 sentence plain English explanation of what went wrong",
      "why": "1-2 sentence explanation of the root cause",
      "fix": "1-2 sentence explanation of how to fix it",
      "code": "the actual fix as a code snippet (2-5 lines max)",
      "language": "detected programming language",
      "severity": "low | medium | high | critical"
    }
  `);

  try {
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return {
      what: 'Could not parse the error. Try rephrasing or adding more context.',
      why: 'The AI response was not in the expected format.',
      fix: 'Please try again with a cleaner error message.',
      code: '',
      language: language,
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
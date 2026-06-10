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
Return ONLY valid JSON. No markdown, no backticks, no extra text.

Schema:
{
  "what": string,
  "why": string,
  "fix": string,
  "code": string,
  "language": string,
  "severity": "low" | "medium" | "high" | "critical"
}

You are an expert ${language} developer. Analyze this ${language} error and provide:
- "what": A plain English explanation of what went wrong (1-2 sentences)
- "why": The root cause of the error (1-2 sentences)  
- "fix": Step-by-step fix instructions (2-3 sentences)
- "code": A working code fix example in ${language} (just the code, no explanation)
- "language": The programming language detected
- "severity": How severe this error is

Error to analyze:
${errorText}
`;

  const text = await askGemini(prompt);

  try {
    const match = text.match(/\{[\s\S]*\}/);
    const clean = match ? match[0] : text.replace(/```json/g, '').replace(/```/g, '').trim();
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

  // JavaScript / TypeScript
  if (text.includes('typeerror') || text.includes('referenceerror') || text.includes('syntaxerror')) return 'JavaScript';
  if (text.includes('.tsx') || text.includes('.ts')) return 'TypeScript';
  if (text.includes('.jsx') || text.includes('.js')) return 'JavaScript';

  // Python
  if (text.includes('traceback') || text.includes('nameerror') || text.includes('indentationerror') || text.includes('.py')) return 'Python';

  // Java / Kotlin
  if (text.includes('nullpointerexception') || text.includes('classnotfoundexception') || text.includes('.java')) return 'Java';
  if (text.includes('.kt') || text.includes('kotlin')) return 'Kotlin';

  // Node.js
  if (text.includes('cannot find module') || text.includes('module not found')) return 'Node.js';

  // React
  if (text.includes('.tsx') || text.includes('react') || text.includes('useeffect') || text.includes('usestate')) return 'React';

  // Go
  if (text.includes('goroutine') || text.includes('panic:') || text.includes('.go')) return 'Go';

  // Rust
  if (text.includes('borrow checker') || text.includes('ownership') || text.includes('.rs') || text.includes('cannot borrow')) return 'Rust';

  // C++
  if (text.includes('segmentation fault') || text.includes('undefined reference') || text.includes('.cpp') || text.includes('std::')) return 'C++';

  // C#
  if (text.includes('nullreferenceexception') || text.includes('.cs') || text.includes('system.')) return 'C#';

  // PHP
  if (text.includes('fatal error') || text.includes('.php') || text.includes('undefined variable')) return 'PHP';

  // Ruby
  if (text.includes('undefined method') || text.includes('.rb') || text.includes('nomethoderror')) return 'Ruby';

  // Swift
  if (text.includes('.swift') || text.includes('fatal error: unexpectedly found nil')) return 'Swift';

  // SQL
  if (text.includes('syntax error at') || text.includes('relation') || text.includes('column') && text.includes('does not exist')) return 'SQL';

  // Bash
  if (text.includes('command not found') || text.includes('permission denied') || text.includes('.sh')) return 'Bash';

  return 'Unknown';
}
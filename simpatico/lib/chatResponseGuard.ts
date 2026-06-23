const FORBIDDEN_TECHNICAL_PATTERNS = [
  /detalhes\s+tecnicos\s+e\s+api/i,
  /\bapi\b/i,
  /\bendpoint\b/i,
  /\bpayload\b/i,
  /\/api\//i,
  /groq/i,
  /gpt/i,
  /llm/i,
  /variavel\s+de\s+ambiente/i,
  /chave\s+de\s+api/i,
  /token/i,
];

const NON_TECHNICAL_FALLBACK =
  "Posso ajudar com duvidas de estudo e uso do tutor, mas nao posso fornecer detalhes tecnicos da implementacao.";

export const removeTechnicalLines = (content: string) => {
  const sanitized = content
    .split("\n")
    .filter((line) => {
      const normalized = line.trim();
      if (!normalized) return true;
      return !FORBIDDEN_TECHNICAL_PATTERNS.some((pattern) => pattern.test(normalized));
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return sanitized;
};

export const guardAssistantResponse = (content: string) => {
  const normalized = content.trim();
  const hasForbiddenContent = FORBIDDEN_TECHNICAL_PATTERNS.some((pattern) =>
    pattern.test(normalized),
  );

  if (hasForbiddenContent) {
    return NON_TECHNICAL_FALLBACK;
  }

  return normalized;
};

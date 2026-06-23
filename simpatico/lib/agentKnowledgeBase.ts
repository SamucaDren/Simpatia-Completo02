import fs from "fs";
import path from "path";
import { removeTechnicalLines } from "@/lib/chatResponseGuard";

const KB_SECTIONS = [
  { file: "visao-geral.md", title: "Visao geral" },
  { file: "funcionalidades.md", title: "Funcionalidades e regras" },
  { file: "operacao.md", title: "Operacao e uso correto" },
  { file: "faq.md", title: "FAQ" },
  { file: "erros-comuns.md", title: "Erros comuns" },
  { file: "limites.md", title: "Limites" },
  { file: "exemplos.md", title: "Exemplos" },
];

let cachedContext: string | null = null;

const readSection = (basePath: string, file: string) => {
  const fullPath = path.join(basePath, file);
  try {
    const rawContent = fs.readFileSync(fullPath, "utf8").trim();
    return removeTechnicalLines(rawContent);
  } catch (error) {
    console.warn(`Nao foi possivel ler a base de conhecimento: ${fullPath}`, error);
    return "";
  }
};

export const getKnowledgeBaseContext = () => {
  if (cachedContext) return cachedContext;

  const basePath = path.join(process.cwd(), "knowledge-base");
  const sections = KB_SECTIONS.map(({ file, title }) => {
    const content = readSection(basePath, file);
    if (!content) return null;
    return `## ${title}\n${content}`;
  }).filter(Boolean) as string[];

  cachedContext = sections.join("\n\n");
  return cachedContext;
};

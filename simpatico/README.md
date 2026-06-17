# 🎓 SIMPÁTICO IA

<div align="center">
  <img src="https://scjmnsuidsjcnerccxhe.supabase.co/storage/v1/object/public/images/public/2hwlg68xd6b.png" alt="Simpático IA Logo" width="120"/>
  
  ### Plataforma de Tutoria Inteligente para Estudantes Universitários
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.3.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Material-UI](https://img.shields.io/badge/Material--UI-7.0.2-0081CB?style=for-the-badge&logo=mui)](https://mui.com/)
</div>

---

> **⚠️ ATENÇÃO: CONFIGURAÇÃO OBRIGATÓRIA**  
> Este projeto requer uma **chave de API do Groq** para funcionar.  
> Siga as instruções na seção [⚙ Configuração](#%EF%B8%8F-configuração) antes de executar o projeto.  
> 🔑 [Obter chave de API gratuita aqui]((https://console.groq.com/keys))

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [⚙ Configuração](#%EF%B8%8F-configuração) **← LEIA ISTO PRIMEIRO**
- [Como Usar](#-como-usar)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Arquitetura](#-arquitetura)
- [Cursos e Disciplinas](#-cursos-e-disciplinas)
- [API e Integração](#-api-e-integração)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🚀 Sobre o Projeto

**SIMPÁTICO IA** é uma plataforma educacional desenvolvida para auxiliar estudantes universitários em suas disciplinas através de inteligência artificial. O projeto utiliza o modelo **Google Gemini 2.0 Flash** para fornecer tutoria personalizada e interativa, adaptada ao curso e disciplina específica de cada aluno.

Desenvolvido para a UNIFENAS (Universidade José do Rosário Vellano), o Simpático IA oferece uma experiência de aprendizado moderna, responsiva e acessível, com interface intuitiva e respostas didáticas em tempo real.

### 🎯 Objetivos

- Fornecer suporte acadêmico personalizado 24/7
- Facilitar o aprendizado através de explicações didáticas e exemplos práticos
- Integrar tecnologia de IA de ponta ao ambiente educacional
- Melhorar o desempenho e engajamento dos estudantes

---

## ✨ Funcionalidades

### 🤖 Chat Inteligente
- Conversas contextualizadas por curso e disciplina
- Respostas em formato Markdown para melhor formatação
- Histórico de mensagens em tempo real
- Interface responsiva e amigável

### 📚 Seleção de Curso e Disciplina
- Sistema de seleção intuitivo com autocomplete
- Validação de campos obrigatórios
- Cursos disponíveis:
  - **Ciência da Computação**
  - **Medicina**
  - **Arquitetura e Urbanismo**

### 💬 Tutoria Personalizada
- Apresentação automática do tutor ao iniciar conversa
- Respostas adaptadas ao nível e contexto do aluno
- Exemplos práticos e incentivo ao aprendizado
- Limite de tokens otimizado para respostas concisas

### 🎨 Interface Moderna
- Design responsivo (mobile-first)
- Tema customizado com Material-UI
- Animações e transições suaves
- Componentes reutilizáveis e modulares

---

## 🛠 Tecnologias Utilizadas

### **Frontend**

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| [Next.js](https://nextjs.org/) | 15.3.0 | Framework React com Server Side Rendering |
| [React](https://reactjs.org/) | 19.1.0 | Biblioteca para construção de interfaces |
| [TypeScript](https://www.typescriptlang.org/) | 5.8.3 | Superset JavaScript com tipagem estática |
| [Material-UI](https://mui.com/) | 7.0.2 | Biblioteca de componentes UI |
| [Tailwind CSS](https://tailwindcss.com/) | 3.3.0 | Framework CSS utilitário |
| [Emotion](https://emotion.sh/) | 11.14.0 | Biblioteca CSS-in-JS |

### **AI e SDK**

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| [Google Gemini AI](https://ai.google.dev/) | 0.24.1 | Modelo de linguagem Google Gemini 2.0 Flash |
| [Vercel AI SDK](https://sdk.vercel.ai/) | 5.0.74 | SDK para integração com modelos de IA |
| [AI SDK React](https://sdk.vercel.ai/docs) | 2.0.75 | Hooks React para streaming de IA |
| [AI SDK OpenAI](https://sdk.vercel.ai/providers/openai) | 1.3.24 | Provedor OpenAI para Vercel AI SDK |
| [AI SDK Google](https://sdk.vercel.ai/providers/google) | 2.0.23 | Provedor Google para Vercel AI SDK |

### **Utilidades e Ferramentas**

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| [React Markdown](https://github.com/remarkjs/react-markdown) | 10.1.0 | Renderização de Markdown em React |
| [Remark GFM](https://github.com/remarkjs/remark-gfm) | 4.0.1 | Suporte a GitHub Flavored Markdown |
| [UUID](https://github.com/uuidjs/uuid) | 11.1.0 | Geração de identificadores únicos |
| [Zod](https://zod.dev/) | 3.24.3 | Validação de schemas TypeScript |
| [Styled Components](https://styled-components.com/) | 6.1.17 | Estilização de componentes |

---

## 📁 Estrutura do Projeto

```
simpatico/
├── app/                          # App Router do Next.js 13+
│   ├── api/                      # Rotas de API
│   │   └── chat/
│   │       └── route.ts          # Endpoint de chat com Gemini
│   ├── chat_simpatico/
│   │   └── page.tsx              # Página do chat
│   ├── selecionar_disciplina/
│   │   └── page.tsx              # Seleção de curso/disciplina
│   ├── globals.css               # Estilos globais
│   ├── layout.tsx                # Layout raiz da aplicação
│   └── page.tsx                  # Página inicial (Hero)
│
├── components/                   # Componentes React reutilizáveis
│   ├── ChatInput/
│   │   └── ChatInput.tsx         # Input e lógica do chat
│   ├── Chats/
│   │   └── Chat.tsx              # Exibição de mensagens
│   ├── DisciplineForm/
│   │   └── DisciplineForm.tsx    # Formulário de seleção
│   ├── Header/
│   │   └── Header.tsx            # Cabeçalho da aplicação
│   ├── Hero/
│   │   └── Hero.tsx              # Seção hero da landing page
│   └── ThemeResistry/
│       └── ThemeResistry.tsx     # Provedor de tema MUI
│
├── lib/                          # Bibliotecas e utilitários
│   ├── context/
│   │   └── useCourse.tsx         # Context API para curso/disciplina
│   ├── hooks/
│   │   └── usePersistentState.ts # Hook para estado persistente
│   └── Cursos.ts                 # Dados de cursos e disciplinas
│
├── themes/
│   └── theme.ts                  # Configuração do tema MUI
│
├── types/
│   └── ChatInputData.ts          # Tipos TypeScript
│
├── public/                       # Arquivos estáticos
│
├── next.config.js                # Configuração do Next.js
├── tsconfig.json                 # Configuração do TypeScript
├── tailwind.config.js            # Configuração do Tailwind CSS
├── postcss.config.js             # Configuração do PostCSS
├── package.json                  # Dependências do projeto
└── README.md                     # Este arquivo
```

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **npm** (geralmente vem com Node.js) ou **yarn** ou **pnpm**
- **Git** - [Download](https://git-scm.com/)
- **Chave de API do Groq** - [Obter aqui]((https://console.groq.com/keys))

### Verificar instalações:

```bash
node --version
npm --version
git --version
```

---

## 📥 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/joaogabriel343/simpatico-atex.git
cd simpatico-atex
```

### 2. Instale as dependências

Escolha um gerenciador de pacotes:

**Com npm:**
```bash
npm install
```

**Com yarn:**
```bash
yarn install
```

**Com pnpm:**
```bash
pnpm install
```

---

## ⚙ Configuração

### ⚠️ CONFIGURAÇÃO OBRIGATÓRIA DA API

**IMPORTANTE:** Este projeto requer uma chave de API do Google Gemini para funcionar.

### 1. Obter Chave de API do Google Gemini

1. Acesse: [Groq](https://console.groq.com/keys)
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada

### 2. Criar arquivo de variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Windows (PowerShell)
New-Item -Path .env.local -ItemType File

# Linux/Mac
touch .env.local
```

### 3. Adicionar sua chave de API

Abra o arquivo `.env.local` que você acabou de criar e adicione:

```env
GROQ_API_KEY=sua_chave_api_aqui
```

**Substitua `sua_chave_api_aqui` pela sua chave real do Google Gemini:**

```env
GROQ_API_KEY=AIzaSyC-sua_chave_real_aqui
```

**⚠️ ATENÇÃO:** 
- ❌ **NUNCA** commite o arquivo `.env.local` no Git
- ❌ **NUNCA** compartilhe sua chave de API publicamente
- ✅ O arquivo `.env.local` já está no `.gitignore`
- 🔒 Mantenha sua chave de API em segredo

### 4. Verificar Configuração

Após adicionar a chave, inicie ou reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

Se tudo estiver correto, o chat funcionará normalmente. Se houver erro, verifique:
- ✅ A chave foi copiada corretamente (sem espaços extras)
- ✅ O arquivo se chama exatamente `.env.local` (com o ponto no início)
- ✅ O arquivo está na raiz do projeto (mesma pasta do `package.json`)
- ✅ O nome da variável é exatamente `GEMINI_API_KEY`
- ✅ Você reiniciou o servidor após criar o arquivo

---

## 🎮 Como Usar

### 1. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em: **http://localhost:3000**

### 2. Fluxo de uso da aplicação

1. **Página Inicial:** Acesse a landing page e clique em "Começar"
2. **Seleção de Curso:** Escolha seu curso na lista disponível
3. **Seleção de Disciplina:** Selecione a disciplina que deseja estudar
4. **Chat:** Interaja com o Simpático IA fazendo suas perguntas
5. **Alternar Disciplina:** Use o botão no header para mudar de disciplina

### 3. Exemplo de uso

```
👤 Usuário: "O que são estruturas de dados?"

🤖 Simpático: "Estruturas de dados são formas de organizar e 
armazenar dados na memória do computador de maneira eficiente. 
Elas permitem que você realize operações como inserção, remoção 
e busca de dados de forma otimizada..."
```

---

## 📜 Scripts Disponíveis

No diretório do projeto, você pode executar:

### `npm run dev`
Inicia o servidor de desenvolvimento.
- Abre em: http://localhost:3000
- Hot reload ativo
- Mostra erros em tempo real

### `npm run build`
Cria uma build otimizada para produção.
- Gera arquivos estáticos otimizados
- Minifica código JavaScript/CSS
- Otimiza imagens e assets

### `npm run start`
Inicia o servidor de produção.
- Requer `npm run build` antes
- Serve a aplicação otimizada

### `npm run lint`
Executa o ESLint para verificar problemas no código.
- Identifica erros de sintaxe
- Verifica padrões de código
- Sugere melhorias

---

## 🏗 Arquitetura

### Fluxo de Dados

```
┌─────────────┐
│   Usuário   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  ChatInput.tsx      │ ◄── Captura mensagem do usuário
│  (Frontend)         │
└──────┬──────────────┘
       │
       │ POST /api/chat
       ▼
┌─────────────────────┐
│  route.ts           │ ◄── Processa requisição
│  (API Route)        │     Monta prompt contextualizado
└──────┬──────────────┘
       │
       │ HTTP Request
       ▼
┌─────────────────────┐
│     GROQ API        │ ◄── Gera resposta com IA
│                     │
└──────┬──────────────┘
       │
       │ Response
       ▼
┌─────────────────────┐
│  Chat.tsx           │ ◄── Renderiza resposta em Markdown
│  (Frontend)         │
└─────────────────────┘
```

### Context API

O projeto utiliza React Context para gerenciar estado global:

```typescript
<CourseProvider>
  - selectedCourse: string
  - selectedDiscipline: string
  - setSelectedCourse()
  - setSelectedDiscipline()
</CourseProvider>
```

### Componentes Principais

#### 1. **ChatInput.tsx**
- Gerencia estado das mensagens
- Envia requisições à API
- Controla loading e erros
- Scroll automático para novas mensagens

#### 2. **DisciplineForm.tsx**
- Formulário com Autocomplete (MUI)
- Validação de campos
- Navegação programática
- Persistência via Context

#### 3. **Header.tsx**
- Logo e branding
- Links de navegação
- Avatar do usuário
- Responsivo

#### 4. **route.ts (API)**
- Recebe dados do chat
- Constrói prompt contextualizado
- Chama API do Gemini
- Retorna resposta formatada

---

## 📚 Cursos e Disciplinas

### Cursos Disponíveis

#### 🖥️ **Ciência da Computação**
- Estrutura de Dados
- Redes
- Computação e Sociedade

#### 🏥 **Medicina**
- Biologia Celular I
- Fisiologia I
- Anatomia I

#### 🏛️ **Arquitetura e Urbanismo**
- História e Estética da Arte
- Teoria da Arquitetura e Urbanismo
- Desenho Arquitetônico

### Adicionar Novos Cursos

Edite o arquivo `lib/Cursos.ts`:

```typescript
const Cursos = [
  {
    nome: "Nome do Novo Curso",
    disciplinas: ["Disciplina 1", "Disciplina 2", "Disciplina 3"],
  },
];
```

---

## 🔌 API e Integração

### Endpoint: `/api/chat`

**Método:** `POST`

**Body da Requisição:**
```typescript
{
  "id": "uuid-do-usuario",
  "nome": "Nome do Aluno",
  "curso": "Ciência da Computação",
  "materia": "Estrutura de Dados",
  "mensagem_usuario": "O que são listas ligadas?"
}
```

**Resposta:**
```typescript
"Resposta do Gemini em formato Markdown..."
```

### Configuração da API Gemini

```typescript
generationConfig: {
  temperature: 0.7,      
  topK: 40,              
  topP: 0.95,           
  maxOutputTokens: 400  
}
```

### Tratamento de Erros

A API implementa tratamento robusto de erros:

- ✅ Validação de campos obrigatórios
- ✅ Logs detalhados de erros
- ✅ Mensagens de erro amigáveis
- ✅ Status codes HTTP apropriados

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga estas etapas:

### 1. Fork o projeto

```bash
```

### 2. Crie uma branch para sua feature

```bash
git checkout -b feature/MinhaNovaFeature
```

### 3. Commit suas mudanças

```bash
git commit -m "Add: Nova funcionalidade X"
```

### 4. Push para a branch

```bash
git push origin feature/MinhaNovaFeature
```

### 5. Abra um Pull Request

Descreva suas mudanças detalhadamente no PR.

### 📝 Convenções de Commit

Use commits semânticos:

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração de código
- `test:` Testes
- `chore:` Tarefas gerais

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👥 Autores

- **Equipe ATEX - UNIFENAS**
- [João Gabriel](https://github.com/joaogabriel343)

---

## 🙏 Agradecimentos

- [UNIFENAS](https://www.unifenas.br/) - Universidade José do Rosário Vellano
- [Google](https://ai.google.dev/) - Google Gemini AI
- [Vercel](https://vercel.com/) - Hospedagem e AI SDK
- [Material-UI](https://mui.com/) - Biblioteca de componentes
- Todos os contribuidores do projeto

---

## 📞 Suporte

Encontrou um bug ou tem alguma sugestão?

- 🐛 [Reportar Bug](https://github.com/joaogabriel343/simpatico-atex/issues)
- 💡 [Solicitar Feature](https://github.com/joaogabriel343/simpatico-atex/issues)
- 📧 Email: suporte@unifenas.br

---

## 🔗 Links Úteis

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Material-UI](https://mui.com/material-ui/getting-started/)
- [Google Gemini AI](https://ai.google.dev/)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

<div align="center">
  <p>Feito com ❤️ pela equipe ATEX - UNIFENAS</p>
  <p>© 2025 Simpático IA. Todos os direitos reservados.</p>
</div>

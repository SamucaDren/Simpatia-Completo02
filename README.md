# Simpatia

## Pré-requisitos

Antes de executar o projeto, certifique-se de possuir:

- Docker instalado e configurado.
- Uma conta no Groq para utilização da API de IA.

---

## Configuração da API do Groq

### 1. Criar uma conta no Groq

Acesse:

https://groq.com/

e crie sua conta.

### 2. Gerar uma chave de API

Após criar a conta, acesse:

https://console.groq.com/keys

e gere uma nova chave de API.

### 3. Configurar a variável de ambiente

Navegue até o diretório:

```text
Simpatia-Completo02/simpatia_/backend/
```

Crie um arquivo chamado `.env` e adicione o seguinte conteúdo:

```env
GROQ_API_KEY=sua-chave-api-do-groq
```

Substitua `sua-chave-api-do-groq` pela chave gerada no painel do Groq.

---

## Build da Aplicação

Abra um terminal e navegue até:

```bash
cd Simpatia-Completo02/simpatia_
```

Execute o comando abaixo para gerar a imagem Docker:

```bash
docker build -t simpatia .
```

Aguarde a conclusão do processo.

---

## Executando a Aplicação

Após o build, execute:

```bash
docker run -p 3000:3000 simpatia
```

Caso a aplicação utilize uma porta diferente, ajuste o mapeamento conforme necessário.

---

## Estrutura Esperada

```text
Simpatia-Completo02/
└── simpatia_/
    ├── backend/
    │   └── .env
    ├── frontend/
    └── Dockerfile
```

---

## Resumo Rápido

1. Criar conta em https://groq.com/
2. Gerar chave em https://console.groq.com/keys
3. Criar o arquivo:

```text
Simpatia-Completo02/simpatia_/backend/.env
```

4. Adicionar:

```env
GROQ_API_KEY=sua-chave-api-do-groq
```

5. Executar:

```bash
cd Simpatia-Completo02/simpatia_
docker build -t simpatia .
docker run -p 3000:3000 simpatia
```

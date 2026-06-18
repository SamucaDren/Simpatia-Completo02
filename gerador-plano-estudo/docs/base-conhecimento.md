# Base de Conhecimento — Assistente SIMPATIA

## 1. Sobre o SIMPATIA

O SIMPATIA é um Sistema de Mídias Pedagógicas para Atividades com Inteligência Artificial. Neste projeto, o módulo implementado é o Gerador de Plano de Estudo Inteligente.

## 2. Função do módulo

O Gerador de Plano de Estudo cria um plano personalizado com base nas informações fornecidas pelo usuário:

- Disciplina.
- Horas disponíveis por dia.
- Nível de conhecimento.
- Existência ou não de data limite.
- Objetivo principal do estudo.

## 3. Fluxo de uso

1. Acessar a página do gerador.
2. Selecionar a disciplina.
3. Informar as horas diárias de estudo.
4. Selecionar o nível de conhecimento.
5. Informar se existe prazo.
6. Selecionar o objetivo principal.
7. Clicar em **Gerar Plano de Estudo**.
8. Revisar o plano gerado.
9. Exportar em PDF, se necessário.

## 4. Disciplinas disponíveis

- Cálculo I
- Robótica
- Programação Web
- Banco de Dados
- Engenharia de Software
- Estatística
- Fisiologia Humana
- Bioquímica
- Microbiologia
- Patologia Geral
- Farmacologia
- Fundamentos de Enfermagem
- Enfermagem em Saúde Pública
- Enfermagem Obstétrica
- Enfermagem Pediátrica
- Enfermagem em Unidade de Terapia Intensiva
- Direito Constitucional
- Direito Civil
- Direito Penal
- Direito Administrativo
- Teoria Geral do Direito
- Mecânica dos Materiais
- Topografia
- Materiais de Construção
- Hidráulica
- Resistência dos Materiais

## 5. Regras de adaptação do plano

- 1 dia: 1 módulo ultra concentrado.
- 2 a 3 dias: até 2 módulos intensivos.
- 4 a 7 dias: até 3 módulos focados.
- 8 a 14 dias: 3 a 4 módulos completos.
- 15 dias ou mais: 4 a 5 módulos detalhados.

## 6. Perguntas frequentes

### Como uso o gerador?
Preencha disciplina, horas diárias, nível, prazo e objetivo. Depois clique em **Gerar Plano de Estudo**.

### O sistema salva meu plano?
Não. O usuário deve exportar o plano em PDF ou copiar o conteúdo.

### Posso digitar qualquer disciplina?
Não. O protótipo utiliza uma lista fixa de disciplinas.

### O plano substitui professor?
Não. O plano é uma sugestão de apoio aos estudos.

### O chatbot responde qualquer assunto?
Não. Ele responde somente dúvidas sobre o SIMPATIA e o módulo de plano de estudo.

## 7. Erros comuns

### GROQ_API_KEY não configurada
A variável de ambiente do servidor não foi definida.

### Chave inválida
A chave da Groq pode estar errada, expirada ou sem permissão.

### Limite de requisições
O usuário deve aguardar alguns minutos antes de tentar novamente.

### Campos obrigatórios vazios
O usuário deve preencher disciplina, horas diárias, nível e objetivo.

### Data no passado
O usuário deve selecionar uma data futura ou usar estudo contínuo.

## 8. Limitações conhecidas

- O sistema depende da API da Groq.
- A geração pode falhar por instabilidade externa.
- O protótipo não salva histórico permanente.
- O agente não realiza busca na internet.
- O plano gerado precisa de revisão crítica do usuário.

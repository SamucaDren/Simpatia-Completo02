export async function ChatMensagem(pergunta, specialties) {
  try {
    const response = await fetch("https://backend-simpatia.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pergunta, specialties }),
    });

    if (!response.ok) {
      throw new Error("Erro na requisição");
    }

    const data = await response.json();

    return data.resposta;
  } catch (error) {
    console.error("Erro ao consultar backend:", error);
    return "Erro ao consultar a IA.";
  }
}

const DEFAULT_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido." });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "A chave da API não está configurada no servidor." });
  }

  const { systemPrompt, messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Envie pelo menos uma mensagem." });
  }

  // Limita o histórico e valida os papéis para evitar payloads inesperados.
  const safeMessages = messages.slice(-30)
    .filter((item) =>
      item &&
      (item.role === "user" || item.role === "assistant") &&
      typeof item.content === "string"
    )
    .map((item) => ({ role: item.role, content: item.content.slice(0, 12000) }));

  if (!safeMessages.length) {
    return res.status(400).json({ error: "O histórico de mensagens é inválido." });
  }

  try {
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: "system", content: typeof systemPrompt === "string" ? systemPrompt.slice(0, 12000) : "Você é um assistente útil." },
          ...safeMessages
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const data = await groqResponse.json();
    if (!groqResponse.ok) {
      console.error("Erro Groq:", data?.error?.message || groqResponse.status);
      return res.status(502).json({ error: "O serviço de IA não conseguiu responder. Tente novamente." });
    }

    const reply = data?.choices?.[0]?.message?.content;
    if (typeof reply !== "string") {
      return res.status(502).json({ error: "A resposta recebida da IA é inválida." });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Falha na chamada Groq:", error.message);
    return res.status(500).json({ error: "Erro interno ao contactar o serviço de IA." });
  }
}

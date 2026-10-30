import { useEffect, useRef, useState } from "react";
import Head from "next/head";

const FALLBACK_DESCRIPTION = "Assistente inteligente FocoPrime";

export async function getServerSideProps({ params }) {
  const slug = String(params.slug || "");
  const databaseUrl = process.env.FIREBASE_DATABASE_URL ||
    "https://focoplataforms-default-rtdb.europe-west1.firebasedatabase.app";

  try {
    const safeSlug = encodeURIComponent(slug);
    const response = await fetch(`${databaseUrl.replace(/\/$/, "")}/assistants/${safeSlug}.json`);
    if (!response.ok) throw new Error(`Firebase respondeu com ${response.status}`);

    const assistant = await response.json();
    if (!assistant || typeof assistant !== "object") {
      return { props: { error: true, slug } };
    }

    const publicAssistant = {
      name: assistant.name || "Assistente FocoPrime",
      description: assistant.description || "",
      logoUrl: assistant.logoUrl || "",
      themeColor: assistant.themeColor || "#6366f1",
      welcomeMessage: assistant.welcomeMessage || "",
      systemPrompt: assistant.systemPrompt || "Você é um assistente útil."
    };

    return { props: { error: false, slug, assistant: publicAssistant } };
  } catch (error) {
    console.error("Erro ao carregar assistente:", error.message);
    return { props: { error: true, slug } };
  }
}

export default function PublicChat({ error, slug, assistant }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (assistant?.welcomeMessage) {
      setMessages([{ role: "assistant", content: assistant.welcomeMessage }]);
    }
  }, [assistant]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Função para iniciar nova conversa com animação no botão +
  function handleNewChat() {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 400);

    if (assistant?.welcomeMessage) {
      setMessages([{ role: "assistant", content: assistant.welcomeMessage }]);
    } else {
      setMessages([]);
    }
    setInput("");
  }

  async function sendMessage(event) {
    event.preventDefault();
    const userText = input.trim();
    if (!userText || loading) return;

    const nextMessages = [...messages, { role: "user", content: userText }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          systemPrompt: assistant.systemPrompt,
          messages: nextMessages
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível obter uma resposta.");
      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
    } catch (error) {
      setMessages([
        ...nextMessages,
        { role: "assistant", content: error.message || "Desculpe, ocorreu um erro ao processar sua resposta." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (error || !assistant) {
    return (
      <>
        <Head><title>Assistente não encontrado | FocoPrime</title></Head>
        <main className="not-found">
          <div>
            <div className="not-found-mark">!</div>
            <h1>Assistente não encontrado</h1>
            <p>O agente de IA solicitado não existe ou foi desativado.</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{assistant.name}</title>
        <meta name="description" content={assistant.description || FALLBACK_DESCRIPTION} />
        {assistant.logoUrl ? <link rel="icon" href={assistant.logoUrl} /> : null}
        <meta name="theme-color" content={assistant.themeColor} />
      </Head>

      <main className="page-shell" style={{ "--primary": assistant.themeColor }}>
        <section className="chat-container">
          {/* Cabeçalho fixo com logótipo no lado esquerdo */}
          <header className="chat-header">
            {assistant.logoUrl ? (
              <img src={assistant.logoUrl} alt="" className="chat-avatar" />
            ) : (
              <div className="chat-avatar avatar-fallback">{assistant.name?.charAt(0)?.toUpperCase() || "F"}</div>
            )}
            <div className="chat-info">
              <h1>{assistant.name}</h1>
              <p>{assistant.description || "Online"}</p>
            </div>
            <span className="online-indicator" aria-label="Online" />
          </header>

          {/* Área de mensagens */}
          <div className="chat-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${index}-${message.role}`} className={`message ${message.role === "user" ? "user" : "ai"}`}>
                {message.content}
              </div>
            ))}
            {loading && <div className="message ai typing">A escrever<span>...</span></div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Barra de mensagem fixa com botão + à esquerda e enviar à direita */}
          <div className="chat-input-wrapper">
            <form onSubmit={sendMessage} className="chat-input-area">
              <button
                type="button"
                onClick={handleNewChat}
                className={`plus-btn ${isRotating ? "animate" : ""}`}
                aria-label="Nova conversa"
                title="Nova conversa"
              >
                <i className="fi fi-rr-plus" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Digite sua mensagem..."
                className="chat-input"
                aria-label="Mensagem"
                disabled={loading}
              />
              <button type="submit" className="send-btn" disabled={!input.trim() || loading} aria-label="Enviar mensagem">
                <i className="fi fi-rr-paper-plane" />
              </button>
            </form>
            <footer className="chat-footer">powered by <strong>FocoPrime</strong></footer>
          </div>
        </section>
      </main>
    </>
  );
}

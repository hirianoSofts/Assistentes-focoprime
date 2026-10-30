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
      themeColor: assistant.themeColor || "#da7756",
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
  const [isSpinning, setIsSpinning] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (assistant?.welcomeMessage) {
      setMessages([{ role: "assistant", content: assistant.welcomeMessage }]);
    }
  }, [assistant]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleNewChat = () => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 500);
    if (assistant?.welcomeMessage) {
      setMessages([{ role: "assistant", content: assistant.welcomeMessage }]);
    } else {
      setMessages([]);
    }
  };

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

      <div className="chat-layout" style={{ "--primary": assistant.themeColor }}>
        {/* Cabeçalho Fixo no Topo */}
        <header className="chat-header-fixed">
          <div className="header-left">
            {assistant.logoUrl ? (
              <img src={assistant.logoUrl} alt="Logo" className="chat-logo" />
            ) : (
              <div className="chat-logo avatar-fallback">
                {assistant.name?.charAt(0)?.toUpperCase() || "F"}
              </div>
            )}
            <span className="assistant-title">{assistant.name}</span>
          </div>
          <button className="icon-btn" aria-label="Opções">
            <i className="fi fi-rr-menu-dots-vertical"></i>
          </button>
        </header>

        {/* Área de Conversa centralizada e rolável */}
        <main className="chat-body">
          {messages.length === 0 && (
            <div className="welcome-heading">
              <span className="brand-sparkle">✴</span>
              <h1>Olá, como posso ajudar?</h1>
            </div>
          )}

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={`${index}-${message.role}`}
                className={`message ${message.role === "user" ? "user" : "ai"}`}
              >
                {message.content}
              </div>
            ))}
            {loading && (
              <div className="message ai typing">
                A escrever<span>...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Rodapé e Barra de Entrada Fixo */}
        <footer className="chat-footer-fixed">
          <form onSubmit={sendMessage} className="chat-input-box">
            {/* Botão de + no lado esquerdo com Animação */}
            <button
              type="button"
              onClick={handleNewChat}
              className={`action-btn new-chat-btn ${isSpinning ? "spin" : ""}`}
              title="Nova conversa"
              aria-label="Nova conversa"
            >
              <i className="fi fi-rr-plus"></i>
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="chat-input"
              disabled={loading}
            />

            {/* Botão de Enviar no lado direito */}
            <button
              type="submit"
              className="action-btn send-btn"
              disabled={!input.trim() || loading}
              aria-label="Enviar mensagem"
            >
              <i className="fi fi-rr-paper-plane"></i>
            </button>
          </form>

          {/* Marca d'água */}
          <div className="watermark">
            powered by <strong>FocoPrime</strong>
          </div>
        </footer>
      </div>
    </>
  );
}

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
      themeColor: assistant.themeColor || "#e05638",
      welcomeMessage: assistant.welcomeMessage || "",
      systemPrompt: assistant.systemPrompt || "Você é um assistente útil.",
      model: assistant.model || "Foco Wanga 3.0"
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
    // Mantém o chat limpo inicialmente para exibir apenas a saudação centralizada
    setMessages([]);
  }, [assistant]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleNewChat = () => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 500);
    setMessages([]);
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
        <main className="not-found" style={{ display: 'grid', placeItems: 'center', height: '100vh', textAlign: 'center', padding: '20px' }}>
          <div>
            <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Assistente não encontrado</h1>
            <p style={{ color: '#64748b' }}>O agente de IA solicitado não existe ou foi desativado.</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{assistant.name} | FocoPrime</title>
        <meta name="description" content={assistant.description || FALLBACK_DESCRIPTION} />
        {assistant.logoUrl ? <link rel="icon" href={assistant.logoUrl} /> : null}
        <meta name="theme-color" content={assistant.themeColor} />
      </Head>

      <div className="chat-layout" style={{ "--primary": assistant.themeColor }}>
        {/* Cabeçalho Fixo */}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              className="icon-btn" 
              aria-label="Nova conversa" 
              onClick={handleNewChat} 
              title="Nova conversa"
            >
              <i className={`fi fi-rr-refresh ${isSpinning ? "spin" : ""}`}></i>
            </button>
          </div>
        </header>

        {/* Corpo / Mensagens */}
        <main className="chat-body">
          {messages.length === 0 ? (
            <div className="welcome-container">
              <h1 className="brand-sparkle-heading">
                <span className="brand-sparkle">✴</span>
                {assistant.welcomeMessage ? assistant.welcomeMessage : "Que bom ter você aqui!"}
              </h1>
            </div>
          ) : null}

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

        {/* Rodapé com Input */}
        <footer className="chat-footer-fixed">
          <form onSubmit={sendMessage} className="chat-input-box">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              placeholder="Olá, em que posso ser útil..."
              className="chat-input"
              rows={1}
              disabled={loading}
            />

            <div className="chat-input-actions">
              <div className="actions-left">
                <button type="button" className="action-tool-btn" title="Adicionar anexo">
                  <i className="fi fi-rr-plus"></i>
                </button>
                <div className="model-selector-badge" title="Modelo de IA ativo">
                  <i className="fi fi-rr-magic-wand" style={{ fontSize: '12px' }}></i>
                  <span>{assistant.model}</span>
                </div>
              </div>

              <div className="actions-right">
                <button type="button" className="action-tool-btn" title="Comando de voz">
                  <i className="fi fi-rr-microphone"></i>
                </button>
                <button
                  type="submit"
                  className="send-btn"
                  disabled={!input.trim() || loading}
                  aria-label="Enviar mensagem"
                >
                  <i className="fi fi-rr-paper-plane" style={{ fontSize: '12px' }}></i>
                </button>
              </div>
            </div>
          </form>

          <div className="watermark">
            powered by <a href="https://focoprime.online" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontWeight: '600' }}>FocoPrime</a>
          </div>
        </footer>
      </div>
    </>
  );
}

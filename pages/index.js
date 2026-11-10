import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: 'Olá! Sou a assistente virtual da FocoPrime. Como posso ajudar o seu negócio hoje?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputMessage
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulação de resposta do assistente
    setTimeout(() => {
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Obrigado pelo seu contato! Em breve nosso assistente de IA ou equipe comercial estará te respondendo.'
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      <Head>
        <title>Assistentes FocoPrime | Inteligência Artificial para seu Negócio</title>
        <meta name="description" content="Assistentes Virtuais e Automação com Inteligência Artificial pela FocoPrime." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Favicon apontando para o diretório /public */}
        <link rel="icon" href="/assets/favicon-new.png" />

        {/* Metatags Open Graph (OG) usando imagem de /public */}
        <meta property="og:title" content="Assistentes FocoPrime" />
        <meta property="og:description" content="Soluções inteligentes em IA para otimizar seus atendimentos e processos." />
        <meta property="og:image" content="/assets/og-imagem.png" />
      </Head>

      <div className="app-container">
        {/* Header Principal */}
        <header className="main-header">
          <div className="header-content">
            <div className="logo-container">
              <Image
                src="/assets/logo.png"
                alt="FocoPrime Logo"
                width={160}
                height={40}
                priority
              />
            </div>
            <nav className="main-nav">
              <a href="#recursos">Recursos</a>
              <a href="#demonstracao">Demonstração</a>
              <a href="#contato" className="btn-primary-sm">Falar Conosco</a>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-text">
            <h1>Transforme seu Atendimento com Assistentes Virtuais de IA</h1>
            <p>
              Automatize processos, responda clientes instantaneamente e aumente a eficiência da sua empresa com as soluções inteligentes da FocoPrime.
            </p>
          </div>
        </section>

        {/* Área de Demonstração / Chat */}
        <section id="demonstracao" className="chat-section">
          <div className="chat-card">
            <div className="chat-header">
              <div className="bot-avatar">
                <Image
                  src="/assets/1.svg"
                  alt="Assistente Avatar"
                  width={36}
                  height={36}
                />
              </div>
              <div className="bot-info">
                <h3>Assistente FocoPrime</h3>
                <span className="status-online">Online</span>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}
                >
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div className="message-bubble bot-bubble typing-indicator">
                  Assistente digitando...
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="chat-input-form">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button type="submit" className="btn-send">
                Enviar
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}

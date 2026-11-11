import React, { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#8F00FF" />
        <meta name="color-scheme" content="light" />

        {/* SEO & Metatags */}
        <title>FocoPrime Studio</title>
        <meta
          name="description"
          content="Plataforma de inteligência artificial da FocoPrime. Crie, customize e escale assistentes virtuais e APIs de IA em tempo real."
        />
        <link rel="canonical" href="https://focoprime.online/" />

        {/* Open Graph / Facebook / WhatsApp / LinkedIn */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://focoprime.online/" />
        <meta property="og:title" content="FocoPrime Studio" />
        <meta
          property="og:description"
          content="Plataforma de inteligência artificial da FocoPrime. Crie, customize e escale assistentes virtuais e APIs de IA em tempo real."
        />
        <meta property="og:image" content="https://dashboard.focoprime.online/assets/og-imagem.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:site_name" content="FocoPrime Studio" />

        {/* Twitter / X Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://focoprime.online/" />
        <meta name="twitter:title" content="FocoPrime Studio" />
        <meta
          name="twitter:description"
          content="Plataforma de inteligência artificial da FocoPrime. Crie, customize e escale assistentes virtuais e APIs de IA em tempo real."
        />
        <meta name="twitter:image" content="https://dashboard.focoprime.online/assets/og-imagem.png" />

        {/* Favicon */}
        <link
          rel="icon"
          type="image/png"
          href="https://dashboard.focoprime.online/assets/favicon-new.png"
        />

        {/* Fontes & Ícones */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/2.1.0/uicons-regular-rounded/css/uicons-regular-rounded.css"
        />

        {/* Estilos Globais mantidos na pasta /public */}
        <link rel="stylesheet" href="/style.css" />
        <link rel="stylesheet" href="/css/promo.css" />
        <link rel="stylesheet" href="/css/menu.css" />
        <link rel="stylesheet" href="/css/footer.css" />
        <link rel="stylesheet" href="/css/parceiros.css" />
        <link rel="stylesheet" href="/css/news.css" />
      </Head>

      <div className="app-container">
        {/* Barra Promocional Fixa (Topo Absoluto) */}
        <div className="promo-bar">
          <span>
            Conheça os recursos do modelo <strong>Foco Wan 3.1</strong> e automações de alto desempenho.
          </span>
          <a href="https://dashboard.focoprime.online" className="promo-link">
            Experimentar <i className="fi fi-rr-arrow-right"></i>
          </a>
        </div>

        {/* Navbar Minimalista Fixa */}
        <header className="studio-navbar">
          <div className="nav-container">
            <a href="#">
              <img src="/assets/logo.png" alt="FocoPrime Logo" className="brand-logo-img" />
            </a>

            <div className="desktop-nav-actions">
              <a href="https://dashboard.focoprime.online/auth/login/" className="nav-btn-login">
                Entrar
              </a>
              <a href="https://dashboard.focoprime.online/auth/cadastro/" className="nav-btn-signup">
                Cadastrar-se
              </a>
            </div>

            <button
              className="menu-toggle-btn"
              id="menuToggleBtn"
              aria-label="Abrir Menu"
              onClick={toggleMenu}
            >
              <i className={isMenuOpen ? "fi fi-rr-cross" : "fi fi-rr-menu-burger"} id="menuIcon"></i>
            </button>
          </div>
        </header>

        {/* Menu Dropdown Animado (Mobile) */}
        <div className={`mobile-dropdown-menu ${isMenuOpen ? 'active' : ''}`} id="mobileDropdownMenu">
          <nav className="mobile-nav-links">
            <a href="#" className="mobile-dropdown-link">
              <i className="fi fi-rr-home"></i> Início
            </a>
            <a href="#sobre" className="mobile-dropdown-link">
              <i className="fi fi-rr-info"></i> Sobre Nós
            </a>
            <a href="#servicos" className="mobile-dropdown-link">
              <i className="fi fi-rr-apps"></i> Serviços
            </a>
            <a href="#precos" className="mobile-dropdown-link">
              <i className="fi fi-rr-dollar"></i> Preços
            </a>
            <a href="#contacto" className="mobile-dropdown-link">
              <i className="fi fi-rr-envelope"></i> Contacto
            </a>
          </nav>
          <div className="mobile-buttons-row">
            <a href="https://dashboard.focoprime.online/auth/login/" className="mobile-dropdown-item mobile-btn-login">
              Entrar
            </a>
            <a href="https://dashboard.focoprime.online/auth/cadastro/" className="mobile-dropdown-item mobile-btn-signup">
              Cadastrar
            </a>
          </div>
        </div>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-visual-wrapper">
            <div className="ai-wave-glow"></div>
            <div className="ai-nodes-container">
              <div className="node-pill node-bottom-left" title="Visão & Imagem">
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80"
                  alt="IA Vision"
                />
              </div>
              <div className="node-pill node-top" title="Código & Texto">
                <img
                  src="https://dashboard.focoprime.online/assets/favicon-new.png"
                  alt="IA Code"
                />
              </div>
              <div className="node-pill node-bottom-right" title="Áudio em Tempo Real">
                <img
                  src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=150&auto=format&fit=crop&q=80"
                  alt="IA Audio"
                />
              </div>
            </div>
          </div>

          <h1 className="hero-title">FocoPrime Live AI</h1>
          <p className="hero-subtitle">Crie experiências de IA em tempo real</p>

          <div className="hero-buttons hero-actions">
            <a href="https://dashboard.focoprime.online/auth/cadastro/" className="btn-get-started">
              <i className="fi fi-rr-sign-in-alt"></i>
              <span>Começar</span>
            </a>
            <a href="#documentacao" className="btn-docs">
              <i className="fi fi-rr-document"></i>
              <span>Docs</span>
            </a>
          </div>

          <div className="models-bar">
            <div className="models-bar-left">
              <div className="models-avatars">
                <img src="https://dashboard.focoprime.online/assets/favicon-new.png" alt="Avatar IA 1" />
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwf78kmIrlVG8lqCC-f4hmnfb-MBJAhew7A4BwMy9-Tg&s=10"
                  alt="Avatar IA 2"
                />
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk4a-5BvBpDBSzT4BiRGW3Ec1jLWDH1TexNA&s"
                  alt="Avatar IA 3"
                />
              </div>
              <div className="models-info">
                <span className="models-title">Modelos</span>
                <span className="models-desc">
                  Foco wan 3.1, gpt 20b <a href="#" className="models-more">ver mais</a>
                </span>
              </div>
            </div>
            <a href="https://dashboard.focoprime.online" className="models-action-btn" aria-label="Abrir modelos">
              <i className="fi fi-rr-arrow-right"></i>
            </a>
          </div>
        </section>

        {/* Barra de Parceiros de Ponta a Ponta */}
        <section className="partners-section">
          <div className="partners-slider">
            <div className="partners-track">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" alt="BMW" className="partner-logo" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="partner-logo" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="partner-logo" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="partner-logo" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" alt="Microsoft" className="partner-logo" />
              <img src="https://vilataxi.me/assets/vilataxi-logo.png" alt="VilaTaxi" className="partner-logo" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg" alt="Nvidia" className="partner-logo" />

              <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" alt="BMW" className="partner-logo" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="partner-logo" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="partner-logo" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="partner-logo" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" alt="Microsoft" className="partner-logo" />
              <img src="https://vilataxi.me/assets/vilataxi-logo.png" alt="VilaTaxi" className="partner-logo" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg" alt="Nvidia" className="partner-logo" />
            </div>
          </div>
        </section>

        {/* Recursos */}
        <section className="features-section" id="documentacao">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fi fi-rr-bolt"></i>
              </div>
              <h3>Latência Ultra-Baixa</h3>
              <p>Respostas em milissegundos para automação conversacional e streaming contínuo.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fi fi-rr-cpu"></i>
              </div>
              <h3>Modelos Avançados</h3>
              <p>Acesse o Foco Wan 3.1 e modelos integrados para processamento de contexto denso.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fi fi-rr-shield-check"></i>
              </div>
              <h3>Escalabilidade Empresarial</h3>
              <p>Infraestrutura pronta para produção com segurança corporativa e chaves de API flexíveis.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

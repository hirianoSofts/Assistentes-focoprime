import React from 'react';
import Head from 'next/head';
// Se você tiver componentes na pasta components (ou public/components)
// import Header from '../components/Header';
// import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Meu Portfólio | HirianoDevs</title>
        <meta name="description" content="Portfólio profissional desenvolvido com Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Mantendo os caminhos de estilos vindos do public */}
        <link rel="stylesheet" href="/styles/style.css" />
        <link rel="icon" href="/assets/favicon-new.png" />
      </Head>

      {/* Conteúdo do Portfólio convertido de HTML para JSX */}
      <div className="portfolio-container">
        {/* Cabeçalho */}
        <header className="header">
          <div className="logo-container">
            <img src="/assets/logo.png" alt="Logo" className="logo" />
          </div>
          <nav className="nav-menu">
            <a href="#sobre">Sobre</a>
            <a href="#projetos">Projetos</a>
            <a href="#contato">Contato</a>
          </nav>
        </header>

        {/* Seção Hero / Apresentação */}
        <main className="main-content">
          <section className="hero-section">
            <h1>Olá, sou o Desenvolvedor</h1>
            <p>Criando soluções web, mobile e aplicações modernas.</p>
            <a href="#projetos" className="btn-primary">Ver Projetos</a>
          </section>

          {/* Exemplo de uso de assets adicionais */}
          <section id="projetos" className="projects-section">
            <h2>Meus Projetos</h2>
            <div className="project-card">
              <img src="/assets/1.svg" alt="Projeto 1" />
              <h3>VilaTáxi / FocoAI</h3>
              <p>Plataforma de mobilidade urbana e inteligência artificial.</p>
            </div>
          </section>
        </main>

        {/* Rodapé */}
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} - Todos os direitos reservados.</p>
        </footer>
      </div>
    </>
  );
}

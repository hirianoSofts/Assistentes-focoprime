import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head><title>FocoPrime</title><meta name="description" content="Plataforma FocoPrime" /></Head>
      <main className="home">
        <h1>FocoPrime</h1>
        <p>A plataforma está online.</p>
        <p>Para abrir um assistente, acesse <code>/chat/slug-do-assistente</code>.</p>
      </main>
    </>
  );
}

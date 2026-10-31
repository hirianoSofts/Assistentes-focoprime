import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // Seu domínio principal
  const rootDomain = 'focoprime.online';

  // Verifica se a requisição está vindo de um subdomínio (ex: fotosa.focoprime.online)
  if (hostname.endsWith(`.${rootDomain}`)) {
    const subdomain = hostname.replace(`.${rootDomain}`, '');

    // Ignora subdomínios reservados como 'www'
    if (subdomain && subdomain !== 'www') {
      // Reescreve internamente para a pasta /chat/[slug] mantendo a URL limpa no navegador
      return NextResponse.rewrite(
        new URL(`/chat/${subdomain}${url.pathname}${url.search}`, req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

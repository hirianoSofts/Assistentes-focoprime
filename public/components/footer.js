class StudioFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="studio-footer">
        <div class="footer-container">
          
          <!-- Coluna 1: Marca & Descrição -->
          <div class="footer-col footer-col-brand">
            <a href="#" class="footer-brand-link">
              <img src="assets/logo.png" alt="FocoPrime Logo" class="footer-brand-logo">
            </a>
            <p class="footer-brand-desc">
              Plataforma e ecossistema de inteligência artificial voltado para a criação, automação e escalabilidade de assistentes inteligentes em tempo real.
            </p>
            <div class="footer-social-links">
              <a href="#" aria-label="WhatsApp" class="footer-social-link"><i class="fi fi-brands-whatsapp"></i></a>
              <a href="#" aria-label="LinkedIn" class="footer-social-link"><i class="fi fi-brands-linkedin"></i></a>
              <a href="#" aria-label="GitHub" class="footer-social-link"><i class="fi fi-brands-github"></i></a>
            </div>
          </div>

          <!-- Coluna 2: Navegação -->
          <div class="footer-col">
            <h4 class="footer-heading">Navegação</h4>
            <ul class="footer-links-list">
              <li><a href="#">Início</a></li>
              <li><a href="#documentacao">Recursos</a></li>
              <li><a href="https://dashboard.focoprime.online">Painel Dashboard</a></li>
              <li><a href="#">Modelos de IA</a></li>
            </ul>
          </div>

          <!-- Coluna 3: Produtos & Recursos -->
          <div class="footer-col">
            <h4 class="footer-heading">Recursos</h4>
            <ul class="footer-links-list">
              <li><a href="#">FocoAI Studio</a></li>
              <li><a href="#">Documentação da API</a></li>
              <li><a href="#">Preços & Planos</a></li>
              <li><a href="#">Status do Sistema</a></li>
            </ul>
          </div>

          <!-- Coluna 4: Contato & Suporte -->
          <div class="footer-col">
            <h4 class="footer-heading">Contato & Suporte</h4>
            <ul class="footer-contact-list">
              <li><i class="fi fi-rr-envelope"></i> suporte@focoprime.online</li>
              <li><i class="fi fi-rr-marker"></i> Vilankulos, Moçambique</li>
            </ul>
          </div>

        </div>

        <!-- Linha Inferior com Copyright -->
        <div class="footer-bottom">
          <span>&copy; 2026 FocoPrime. Todos os direitos reservados.</span>
          <div class="footer-legal-links">
            <a href="#">Privacidade</a>
            <span>•</span>
            <a href="#">Termos de Uso</a>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('studio-footer', StudioFooter);

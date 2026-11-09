class StudioNews extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="news-section" id="noticias">
        <div class="news-container">
          
          <!-- Primeira Seção: Carrossel Horizontal com Imagens e Título Sobreposto (Estilo da Imagem) -->
          <div class="runway-hero-carousel-wrapper">
            <button class="runway-arrow-btn prev" aria-label="Rolar para esquerda"><i class="fi fi-rr-angle-small-left"></i></button>
            <div class="runway-hero-track" id="runwayHeroTrack">
              
              <div class="runway-image-card">
                <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80" alt="Refazer o seu produto">
                <div class="runway-card-overlay"></div>
                <h3 class="runway-card-title">Refazer o seu produto</h3>
              </div>

              <div class="runway-image-card">
                <img src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&auto=format&fit=crop&q=80" alt="Criar criativos a partir de...">
                <div class="runway-card-overlay"></div>
                <h3 class="runway-card-title">Criar criativos a partir de...</h3>
              </div>

              <div class="runway-image-card">
                <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80" alt="Estúdio de IA em Tempo Real">
                <div class="runway-card-overlay"></div>
                <h3 class="runway-card-title">Estúdio de IA em Tempo Real</h3>
              </div>

            </div>
            <button class="runway-arrow-btn next" aria-label="Rolar para direita"><i class="fi fi-rr-angle-small-right"></i></button>
          </div>

          <!-- Título da Seção Inferior -->
          <div class="news-main-title">
            <h2>Novidades no FocoPrime</h2>
          </div>

          <!-- Segunda Seção: Cards Horizontais (Texto à esquerda, Thumbnail à direita, Botão Preto) -->
          <div class="news-runway-list">
            
            <article class="news-runway-item">
              <div class="news-runway-content">
                <span class="news-runway-tag">Foco Wan Ads</span>
                <h3>Crie Mais Anúncios Vencedores</h3>
                <p>Transforme um anúncio vencedor em novas variantes alinhadas à sua marca e publique-as diretamente pelo FocoPrime.</p>
                <a href="https://dashboard.focoprime.online" class="news-black-btn">Experimentar o Foco Wan Ads</a>
              </div>
              <div class="news-runway-thumb">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80" alt="Gráfico de Conversões">
              </div>
            </article>

            <article class="news-runway-item">
              <div class="news-runway-content">
                <span class="news-runway-tag">Foco MCP</span>
                <h3>Com Claude & Foco Wan 3.1</h3>
                <p>Integre fluxos de trabalho de raciocínio complexo diretamente nas suas aplicações em tempo real.</p>
                <a href="https://dashboard.focoprime.online" class="news-black-btn">Experimentar o Foco MCP</a>
              </div>
              <div class="news-runway-thumb">
                <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80" alt="Claude MCP">
              </div>
            </article>

          </div>

        </div>
      </section>
    `;

    // Interatividade de scroll horizontal para o carrossel superior
    const track = this.querySelector('#runwayHeroTrack');
    const btnPrev = this.querySelector('.runway-arrow-btn.prev');
    const btnNext = this.querySelector('.runway-arrow-btn.next');

    if (track && btnPrev && btnNext) {
      btnPrev.addEventListener('click', () => {
        track.scrollBy({ left: -320, behavior: 'smooth' });
      });
      btnNext.addEventListener('click', () => {
        track.scrollBy({ left: 320, behavior: 'smooth' });
      });
    }
  }
}
customElements.define('studio-news', StudioNews);

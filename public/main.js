document.addEventListener('DOMContentLoaded', () => {
  const menuToggleBtn = document.getElementById('menuToggleBtn');

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', () => {
      // Adicione aqui ações interativas para o menu se necessário
      console.log('Menu alternado');
    });
  }
});




document.addEventListener('DOMContentLoaded', () => {
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const mobileDropdownMenu = document.getElementById('mobileDropdownMenu');
  const menuIcon = document.getElementById('menuIcon');
  const mobileNavLinks = document.querySelectorAll('.mobile-dropdown-link');

  if (menuToggleBtn && mobileDropdownMenu) {
    menuToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileDropdownMenu.classList.toggle('active');
      
      if (mobileDropdownMenu.classList.contains('active')) {
        menuIcon.className = 'fi fi-rr-cross';
      } else {
        menuIcon.className = 'fi fi-rr-menu-burger';
      }
    });

    // Fecha o menu ao clicar em qualquer link de navegação
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDropdownMenu.classList.remove('active');
        menuIcon.className = 'fi fi-rr-menu-burger';
      });
    });

    // Fecha o menu ao clicar fora dele
    document.addEventListener('click', (e) => {
      if (!mobileDropdownMenu.contains(e.target) && !menuToggleBtn.contains(e.target)) {
        mobileDropdownMenu.classList.remove('active');
        menuIcon.className = 'fi fi-rr-menu-burger';
      }
    });
  }
});

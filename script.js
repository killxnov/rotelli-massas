document.addEventListener("DOMContentLoaded", function() {
    
/* ----- OBSERVER ANIMACAO FADE ----- */

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visivel');
        } else {
          entry.target.classList.remove('visivel');
        }
      });
    }, {
      threshold: 0.1
    });

    const elementosEscondidos = document.querySelectorAll('.efeito-fade');
    elementosEscondidos.forEach((el) => observer.observe(el));

/* ----- NAVEGAÇÃO ATIVA NO SCROLL ----- */

    const secoes = document.querySelectorAll("section[id], header[id], div[id]");
    const linksMenu = document.querySelectorAll(".nav-link");

    function atualizaLinhaMenu() {
      let scrollY = window.pageYOffset;
      let idAtual = "";

      secoes.forEach((secao) => {
        const alturaSecao = secao.offsetHeight;
        const topoSecao = secao.offsetTop - 150; 

        if (scrollY >= topoSecao && scrollY < topoSecao + alturaSecao) {
          idAtual = secao.getAttribute("id");
        }
      });

      if (idAtual !== "") {
        linksMenu.forEach((link) => {
          link.classList.remove("ativo");
          if (link.getAttribute("href") === "#" + idAtual) {
            link.classList.add("ativo");
          }
        });
      }
    }

    window.addEventListener("scroll", atualizaLinhaMenu);
    atualizaLinhaMenu(); 

/* ----- CARROSSEL DE PRODUTOS ----- */

    const track = document.getElementById('track-massas');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const wrapper = document.querySelector('.carousel-wrapper');
    
    let autoScrollTimer;

    function scrollCarousel(direcao) {
      if(!track) return; // Evita erro se a seção não existir
      const larguraRolagem = track.clientWidth; 
      const scrollMaximo = track.scrollWidth - track.clientWidth;

      if (direcao === 'next') {
        if (track.scrollLeft >= scrollMaximo - 10) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: larguraRolagem, behavior: 'smooth' });
        }
      } else if (direcao === 'prev') {
        if (track.scrollLeft <= 10) {
          track.scrollTo({ left: scrollMaximo, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: -larguraRolagem, behavior: 'smooth' });
        }
      }
    }

    function startAutoScroll() {
      clearInterval(autoScrollTimer); 
      autoScrollTimer = setInterval(() => {
        scrollCarousel('next');
      }, 5000);
    }

    function stopAutoScroll() {
      clearInterval(autoScrollTimer);
    }

    function acaoBotao(direcao) {
      scrollCarousel(direcao);
      startAutoScroll(); 
    }

    if(nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => acaoBotao('next'));
        prevBtn.addEventListener('click', () => acaoBotao('prev'));
        
        wrapper.addEventListener('mouseenter', stopAutoScroll); 
        wrapper.addEventListener('mouseleave', startAutoScroll); 
        wrapper.addEventListener('touchstart', stopAutoScroll, { passive: true });  
        wrapper.addEventListener('touchend', startAutoScroll, { passive: true });   
        
        startAutoScroll();
    }

/* ----- MODAL DE PRODUTOS ----- */

    const modal = document.getElementById('modal-produto');
    const btnFechar = document.querySelector('.fechar-modal');
    const cartoesMassa = document.querySelectorAll('.massa-card');

    const modalImg = document.getElementById('modal-img');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalDescricao = document.getElementById('modal-descricao');
    const modalRecheios = document.getElementById('modal-recheios-container');

    if(modal) {
        cartoesMassa.forEach(cartao => {
          cartao.addEventListener('click', function() {
            modalImg.src = cartao.querySelector('.massa-img').src;
            modalTitulo.innerText = cartao.querySelector('.massa-titulo').innerText;
            modalDescricao.innerText = cartao.querySelector('.massa-descricao').innerText;
            modalRecheios.innerHTML = cartao.querySelector('.recheios-escondidos').innerHTML;

            modal.classList.add('ativo');
            document.body.style.overflow = 'hidden'; 
          });
        });

        btnFechar.addEventListener('click', () => {
          modal.classList.remove('ativo');
          document.body.style.overflow = 'auto'; 
        });

        modal.addEventListener('click', (evento) => {
          if (evento.target === modal) {
            modal.classList.remove('ativo');
            document.body.style.overflow = 'auto';
          }
        });
    }
});
document.addEventListener("DOMContentLoaded", function() {
    
/* ----- OBSERVER ANIMACAO FADE ----- */

    const observerFade = new IntersectionObserver((entries) => {
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
    elementosEscondidos.forEach((el) => observerFade.observe(el));

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

/* ----- CARROSSEL DE PRODUTOS: VARIÁVEIS ----- */

    const track = document.getElementById('track-massas');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const wrapper = document.querySelector('.carousel-wrapper');
    const dotsContainer = document.querySelector('.carousel-dots');
    const sectionCardapio = document.getElementById('cardapio');
    
    let autoScrollTimer;

/* ----- LÓGICA DE DOTS INTELIGENTES (PAGINAÇÃO) ----- */

    function gerarDotsInteligentes() {
        if (!dotsContainer || !track) return;
        
        dotsContainer.innerHTML = ''; 
        const larguraVisivel = track.clientWidth;
        const larguraTotal = track.scrollWidth;
        
        // Calcula quantas "páginas" existem baseadas no tamanho da tela
        const numPaginas = Math.ceil(larguraTotal / larguraVisivel);

        for (let i = 0; i < numPaginas; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('ativo');
            
            dot.addEventListener('click', () => {
                track.scrollTo({ left: i * larguraVisivel, behavior: 'smooth' });
                reiniciarAutoScroll();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function atualizarDotAtivo() {
        const dots = document.querySelectorAll('.dot');
        if (!dots.length) return;

        const larguraVisivel = track.clientWidth;
        // O índice é baseado na posição da borda esquerda do carrossel
        const indicePagina = Math.round(track.scrollLeft / larguraVisivel);

        dots.forEach((dot, i) => {
            dot.classList.toggle('ativo', i === indicePagina);
        });
    }

/* ----- CONTROLE DE MOVIMENTO ----- */

    function scrollCarousel(direcao) {
      if(!track) return;
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

    function reiniciarAutoScroll() {
      stopAutoScroll();
      startAutoScroll(); 
    }

    if(nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            scrollCarousel('next');
            reiniciarAutoScroll();
        });
        prevBtn.addEventListener('click', () => {
            scrollCarousel('prev');
            reiniciarAutoScroll();
        });
        
        wrapper.addEventListener('mouseenter', stopAutoScroll); 
        wrapper.addEventListener('mouseleave', startAutoScroll); 
        wrapper.addEventListener('touchstart', stopAutoScroll, { passive: true });  
        wrapper.addEventListener('touchend', startAutoScroll, { passive: true });   
    }

    // Eventos de Scroll e Resize para os dots
    track.addEventListener('scroll', atualizarDotAtivo);
    window.addEventListener('resize', () => {
        gerarDotsInteligentes();
        atualizarDotAtivo();
    });

    // Inicializa os dots
    gerarDotsInteligentes();

/* ----- SENSOR INTELIGENTE DE TELA ----- */

    if (sectionCardapio) {
        const observerVisibilidade = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startAutoScroll();
                } else {
                    stopAutoScroll();
                }
            });
        }, { threshold: 0.2 }); 

        observerVisibilidade.observe(sectionCardapio);
    } else {
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
            stopAutoScroll(); 
          });
        });

        const fecharModalFunc = () => {
            modal.classList.remove('ativo');
            document.body.style.overflow = 'auto'; 
            startAutoScroll();
        };

        btnFechar.addEventListener('click', fecharModalFunc);
        modal.addEventListener('click', (evento) => {
          if (evento.target === modal) fecharModalFunc();
        });
    }
});
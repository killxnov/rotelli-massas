document.addEventListener("DOMContentLoaded", function() {
    
/* ----- OBSERVER ANIMACAO FADE (EFEITO NÉVOA) ----- */
    const observerFade = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visivel');
        } else {
          // Quando sai da zona de foco, ele volta a embaçar
          entry.target.classList.remove('visivel'); 
        }
      });
    }, {
      // Cria uma "janela de foco" no meio da tela. 
      // Ignora os 20% do topo e os 20% da base do navegador.
      rootMargin: "-30% 0px -30% 0px", 
      threshold: 0 
    });

    const elementosEscondidos = document.querySelectorAll('.efeito-fade');
    elementosEscondidos.forEach((el) => observerFade.observe(el));

/* ----- NAVEGAÇÃO ATIVA E CENTRALIZAÇÃO DE SCROLL ----- */

    const secoes = document.querySelectorAll("section[id], header[id], div[id]");
    const linksMenu = document.querySelectorAll(".nav-link");
    const navbar = document.querySelector(".navbar");

    // 1. CLIQUE SUAVE E CENTRALIZADO
    linksMenu.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault(); // Desativa o pulo padrão do HTML
            
            const targetId = this.getAttribute("href").substring(1);
            const targetSecao = document.getElementById(targetId);

            if (targetSecao) {
                const headerHeight = navbar.offsetHeight;
                
                // Calcula onde é o meio da seção e o meio da área visível da tela
                const meioDaSecao = targetSecao.offsetTop + (targetSecao.offsetHeight / 2);
                const meioDaTelaUsavel = (window.innerHeight / 2) + (headerHeight / 2);
                
                let posicaoScroll = meioDaSecao - meioDaTelaUsavel;

                // Regra especial: se clicar em "Início" (hero), joga exatamente pro topo 0
                if (targetId === "hero") {
                    posicaoScroll = 0;
                }

                window.scrollTo({
                    top: posicaoScroll,
                    behavior: "smooth"
                });
            }
        });
    });

    // 2. RADAR DA BARRINHA VERMELHA (SCROLL SPY)
    function atualizaLinhaMenu() {
      let scrollY = window.pageYOffset;
      const headerHeight = navbar.offsetHeight;
      
      // Cria uma linha imaginária que corta o meio exato da tela que o usuário está vendo
      const linhaDoMeio = scrollY + (window.innerHeight / 2) + (headerHeight / 2);
      
      let idAtual = "";

      secoes.forEach((secao) => {
        const topoSecao = secao.offsetTop;
        const baseSecao = topoSecao + secao.offsetHeight;

        // Se a linha do meio da tela estiver dentro desta seção, ela ganha o foco!
        if (linhaDoMeio >= topoSecao && linhaDoMeio < baseSecao) {
          idAtual = secao.getAttribute("id");
        }
      });

      // Tratamento extra: se o usuário rolou tudo lá pro topo, força o botão Início a acender
      if (scrollY < 50) {
          idAtual = "hero";
      }

      // Acende a linha correspondente no menu
      if (idAtual !== "") {
        linksMenu.forEach((link) => {
          link.classList.remove("ativo");
          if (link.getAttribute("href") === "#" + idAtual) {
            link.classList.add("ativo");
          }
        });
      }
    }

    // Ouve a rolagem e atualiza a barrinha em tempo real
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
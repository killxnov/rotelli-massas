document.addEventListener("DOMContentLoaded", function() {
    
/* =========================================
   ANIMAÇÕES DE ENTRADA COM SCROLLREVEAL
   ========================================= */

// 1. Configuração Padrão
const sr = ScrollReveal({
    origin: 'bottom',      
    distance: '50px',      
    duration: 1000,        
    delay: 150,            
    reset: true           
});

// 2. Animando a Seção Hero
sr.reveal('.hero-content h1', { origin: 'top', distance: '30px' });
sr.reveal('.hero-content p', { delay: 300 });
sr.reveal('.hero-content .btn-primario, .btn-secundario', { delay: 500, origin: 'bottom' });

// 3. Animando a Seção Sobre
sr.reveal('.sobre-imagem', { origin: 'left', distance: '60px' });
sr.reveal('.sobre-texto', { origin: 'right', distance: '60px' });

// 4. Animando o Segredo
sr.reveal('.segredo-container', { scale: 0.9, duration: 1200 });

// 5. Animando a Seção de Produtos
sr.reveal('.section-header', { origin: 'top' });
sr.reveal('.carousel-wrapper', { delay: 200, origin: 'bottom', distance: '40px' });

sr.reveal('.media-container', { scale: 0.9, duration: 1200 });


/* ----- NAVEGAÇÃO ATIVA E CENTRALIZAÇÃO DE SCROLL ----- */

    const secoes = document.querySelectorAll("section[id], header[id], div[id]");
    const linksMenu = document.querySelectorAll(".nav-link");
    const navbar = document.querySelector(".navbar");

    // 1. CLIQUE SUAVE E CENTRALIZADO
    linksMenu.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault(); 
            
            const targetId = this.getAttribute("href").substring(1);
            const targetSecao = document.getElementById(targetId);

            if (targetSecao) {
                const headerHeight = navbar.offsetHeight;
                const meioDaSecao = targetSecao.offsetTop + (targetSecao.offsetHeight / 2);
                const meioDaTelaUsavel = (window.innerHeight / 2) + (headerHeight / 2);
                let posicaoScroll = meioDaSecao - meioDaTelaUsavel;

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
      const linhaDoMeio = scrollY + (window.innerHeight / 2) + (headerHeight / 2);
      let idAtual = "";

      secoes.forEach((secao) => {
        const topoSecao = secao.offsetTop;
        const baseSecao = topoSecao + secao.offsetHeight;

        if (linhaDoMeio >= topoSecao && linhaDoMeio < baseSecao) {
          idAtual = secao.getAttribute("id");
        }
      });

      if (scrollY < 50) {
          idAtual = "hero";
      }

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
    const dotsContainer = document.querySelector('.carousel-dots');
    const sectionCardapio = document.getElementById('cardapio');
    
    let autoScrollTimer;

    function gerarDotsInteligentes() {
        if (!dotsContainer || !track) return;
        
        dotsContainer.innerHTML = ''; 
        const larguraVisivel = track.clientWidth;
        const larguraTotal = track.scrollWidth;
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
        const indicePagina = Math.round(track.scrollLeft / larguraVisivel);

        dots.forEach((dot, i) => {
            dot.classList.toggle('ativo', i === indicePagina);
        });
    }

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

    track.addEventListener('scroll', atualizarDotAtivo);
    window.addEventListener('resize', () => {
        gerarDotsInteligentes();
        atualizarDotAtivo();
    });
    gerarDotsInteligentes();

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

/* =========================================
   SISTEMA DE MODAL INTELIGENTE
   ========================================= */

    const modaisCards = document.querySelectorAll('.massa-card');
    const modalProduto = document.getElementById('modal-produto');
    const btnFecharModal = document.querySelector('.fechar-modal');

    if (modalProduto) {
        modaisCards.forEach(card => {
            card.addEventListener('click', () => {
                // Pega dados do HTML
                const titulo = card.querySelector('.massa-titulo').innerText;
                const desc = card.querySelector('.massa-descricao').innerText;
                const imgSrc = card.querySelector('.massa-img').src;
                const idMassa = card.getAttribute('data-id');
                const preco = card.getAttribute('data-preco');

                // Preenche o Modal
                document.getElementById('modal-titulo').innerText = titulo;
                document.getElementById('modal-descricao').innerText = desc;
                document.getElementById('modal-img').src = imgSrc;

                // Lógica dos Recheios
                const recheiosNomes = card.querySelectorAll('.recheio-nome');
                const containerSelect = document.getElementById('modal-select-container');
                const btnComprar = document.getElementById('btn-modal-comprar');

                if (containerSelect) containerSelect.innerHTML = ''; 

                let temVariedade = recheiosNomes.length > 0 && 
                    recheiosNomes[0].innerText !== "Tradicional" && 
                    recheiosNomes[0].innerText !== "Lâminas Frescas" && 
                    recheiosNomes[0].innerText !== "Folhas Clássicas" && 
                    recheiosNomes[0].innerText !== "Rolo Tradicional";

                if (temVariedade) {
                    let selectHTML = `<label for="modal-recheio" style="font-weight: bold; display: block; margin-bottom: 5px; color: var(--texto-forte);">Escolha a Opção:</label>
                                      <select id="modal-recheio" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ccc; margin-bottom: 15px; font-family: 'Gantari', sans-serif;">`;
                    
                    recheiosNomes.forEach(recheio => {
                        selectHTML += `<option value="${recheio.innerText}">${recheio.innerText}</option>`;
                    });
                    selectHTML += `</select>`;
                    containerSelect.innerHTML = selectHTML;

                    if (btnComprar) btnComprar.setAttribute('onclick', `adicionarAoCarrinho('${idMassa}', '${titulo}', ${preco}, 'modal-recheio')`);
                } else {
                    if (btnComprar) btnComprar.setAttribute('onclick', `adicionarAoCarrinho('${idMassa}', '${titulo}', ${preco})`);
                }

                // Caixinhas de Recheio embaixo (opcional)
                const boxRecheios = document.getElementById('modal-recheios-container');
                if (boxRecheios) {
                    const infoRecheioHtml = card.querySelector('.recheios-escondidos');
                    boxRecheios.innerHTML = infoRecheioHtml ? infoRecheioHtml.innerHTML : '';
                }

                // Abre o Modal (Sem trava de scroll)
                modalProduto.classList.add('ativo');
                stopAutoScroll(); 
            });
        });

        const fecharModalFunc = () => {
            modalProduto.classList.remove('ativo');
            startAutoScroll();
        };

        if(btnFecharModal) btnFecharModal.addEventListener('click', fecharModalFunc);
        modalProduto.addEventListener('click', (evento) => {
          if (evento.target === modalProduto) fecharModalFunc();
        });
    }

/* =========================================
   SMART NAVBAR (ESCONDE NO SCROLL MOBILE)
   ========================================= */
    let ultimoScroll = 0;
    const navbarSmart = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 992) {
            let scrollAtual = window.pageYOffset || document.documentElement.scrollTop;
            
            if (Math.abs(scrollAtual - ultimoScroll) <= 10) return;

            if (scrollAtual > ultimoScroll && scrollAtual > 100) {
                navbarSmart.classList.add('navbar-escondida');
            } else if (scrollAtual < ultimoScroll) {
                navbarSmart.classList.remove('navbar-escondida');
            }
            
            ultimoScroll = scrollAtual <= 0 ? 0 : scrollAtual; 
        } else {
            navbarSmart.classList.remove('navbar-escondida');
        }
    });

/* =========================================
   MOTOR DO CARRINHO & NOTIFICAÇÕES
   ========================================= */

    // 1. Função da Notificação (Toast)
    window.mostrarNotificacao = function(mensagem) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${mensagem}</span>`;
        container.appendChild(toast);

        // Animação de entrada
        setTimeout(() => toast.classList.add('mostrar'), 10);
        
        // Some e apaga do código após 3 segundos
        setTimeout(() => {
            toast.classList.remove('mostrar');
            setTimeout(() => toast.remove(), 400); 
        }, 3000);
    };

    // 2. Resgata os itens do navegador (LocalStorage)
    let carrinhoItens = JSON.parse(localStorage.getItem('rotelli_carrinho')) || [];

    // 3. Função Principal: Pinta os itens na tela
    function atualizarCarrinho() {
        const itemsContainer = document.getElementById('cart-items');
        const totalPriceEl = document.getElementById('cart-total-price');
        const countEl = document.getElementById('cart-count');
        
        if(!itemsContainer) return; // Trava de segurança

        itemsContainer.innerHTML = '';
        let total = 0;
        let qtdTotal = 0;

        if (carrinhoItens.length === 0) {
            itemsContainer.innerHTML = '<p style="text-align:center; color: #666; margin-top: 20px;">Seu carrinho está vazio.</p>';
        }

        carrinhoItens.forEach(item => {
            total += item.preco * item.quantidade;
            qtdTotal += item.quantidade;

            itemsContainer.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4 style="color: var(--texto-forte); margin: 0 0 5px 0;">${item.nome}</h4>
                        <p style="color: var(--cor-primaria); font-weight: bold; margin: 0;">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div class="cart-item-controls" style="display:flex; gap: 10px; align-items:center;">
                        <button style="background: var(--cor-secundaria); color: white; border: none; width: 25px; height: 25px; border-radius: 5px; cursor: pointer;" onclick="mudarQtd('${item.id}', -1)">-</button>
                        <span style="font-weight: bold;">${item.quantidade}</span>
                        <button style="background: var(--cor-secundaria); color: white; border: none; width: 25px; height: 25px; border-radius: 5px; cursor: pointer;" onclick="mudarQtd('${item.id}', 1)">+</button>
                    </div>
                </div>
            `;
        });

        // Atualiza preço final e bolinha do header
        if (totalPriceEl) totalPriceEl.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
        if (countEl) {
            countEl.innerText = qtdTotal;
            countEl.style.display = qtdTotal > 0 ? 'flex' : 'none';
        }
        
        // Salva qualquer mudança
        localStorage.setItem('rotelli_carrinho', JSON.stringify(carrinhoItens));
    }

    // 4. FORÇA A ATUALIZAÇÃO IMEDIATA! (Isso corrige o bug de sumir ao dar F5)
    atualizarCarrinho();

    // 5. Funções de Clique (Globais)
    window.adicionarAoCarrinho = function(idMassa, nomeMassa, precoBase, idDoSelectRecheio) {
        let recheio = '';
        if (idDoSelectRecheio) {
            const select = document.getElementById(idDoSelectRecheio);
            if (select) recheio = select.value;
        }

        const nomeFinal = recheio ? `${nomeMassa} (${recheio})` : nomeMassa;
        const idFinal = recheio ? `${idMassa}-${recheio.toLowerCase()}` : idMassa;

        let item = carrinhoItens.find(i => i.id === idFinal);
        if (item) {
            item.quantidade++;
        } else {
            carrinhoItens.push({ id: idFinal, nome: nomeFinal, preco: parseFloat(precoBase), quantidade: 1 });
        }
        
        atualizarCarrinho();
        window.mostrarNotificacao(`${nomeFinal} adicionado ao carrinho!`);
    };

    window.mudarQtd = function(id, delta) {
        let item = carrinhoItens.find(i => i.id === id);
        if (item) {
            item.quantidade += delta;
            if (item.quantidade <= 0) {
                carrinhoItens = carrinhoItens.filter(i => i.id !== id);
            }
            atualizarCarrinho();
        }
    };

    window.abrirCarrinho = function() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        if(sidebar && overlay) {
            sidebar.classList.add('aberto');
            overlay.classList.add('ativo');
        }
    };

    window.fecharCarrinho = function() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        if(sidebar && overlay) {
            sidebar.classList.remove('aberto');
            overlay.classList.remove('ativo');
        }
    };

    window.finalizarWhatsApp = function() {
        if (carrinhoItens.length === 0) return alert('Adicione produtos antes de finalizar!');
        let texto = "*Novo Pedido - Rotelli Massas*%0A%0A";
        let total = 0;
        
        carrinhoItens.forEach(item => {
            texto += `▪ ${item.quantidade}x ${item.nome} (R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')})%0A`;
            total += item.preco * item.quantidade;
        });
        texto += `%0A*Total: R$ ${total.toFixed(2).replace('.', ',')}*%0A%0AOlá! Gostaria de confirmar este pedido.`;
        
        // Manda pro Whats
        window.open(`https://wa.me/5547991581015?text=${texto}`, '_blank');
        
        // Zera o carrinho pós-compra
        carrinhoItens = [];
        atualizarCarrinho();
        window.fecharCarrinho();
    };

    /* =========================================
   MENU HAMBÚRGUER (MOBILE)
   ========================================= */
    window.toggleMenuMobile = function() {
        const navMenu = document.getElementById('nav-menu');
        const iconeMenu = document.querySelector('.menu-hamburguer i');
        
        if(navMenu) {
            navMenu.classList.toggle('aberto');
            
            // Troca o ícone (Barras <-> X)
            if (navMenu.classList.contains('aberto')) {
                iconeMenu.classList.replace('fa-bars', 'fa-xmark');
            } else {
                iconeMenu.classList.replace('fa-xmark', 'fa-bars');
            }
        }
    };

    window.fecharMenuMobile = function() {
        const navMenu = document.getElementById('nav-menu');
        const iconeMenu = document.querySelector('.menu-hamburguer i');
        
        if (navMenu && navMenu.classList.contains('aberto')) {
            navMenu.classList.remove('aberto');
            iconeMenu.classList.replace('fa-xmark', 'fa-bars');
        }
    };
    
/* =========================================
   AVISO DE COOKIES (LGPD)
   ========================================= */
    const cookieBanner = document.getElementById('cookie-banner');
    const btnAceitarCookies = document.getElementById('btn-aceitar-cookies');
    const btnRejeitarCookies = document.getElementById('btn-rejeitar-cookies');
    const btnFecharCookies = document.getElementById('btn-fechar-cookies');

    if (cookieBanner) {
        // Verifica na memória do navegador se o cliente já respondeu antes
        const consentimento = localStorage.getItem('rotelli_cookie_consent');

        // Se ele nunca respondeu, mostra a barra com 1 segundo de atraso (para ficar elegante)
        if (!consentimento) {
            setTimeout(() => {
                cookieBanner.classList.add('mostrar');
            }, 1000);
        }

        // Função para esconder a barra e gravar a escolha
        function fecharBanner(escolha) {
            localStorage.setItem('rotelli_cookie_consent', escolha); // Salva 'aceito', 'rejeitado' ou 'fechado'
            cookieBanner.classList.remove('mostrar');
        }

        // Conecta os botões
        if (btnAceitarCookies) btnAceitarCookies.addEventListener('click', () => fecharBanner('aceito'));
        if (btnRejeitarCookies) btnRejeitarCookies.addEventListener('click', () => fecharBanner('rejeitado'));
        if (btnFecharCookies) btnFecharCookies.addEventListener('click', () => fecharBanner('fechado'));
    }

});
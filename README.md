# 🍝 Rotelli Massas | Landing Page & Sistema de Pedidos

Uma Landing Page premium e responsiva desenvolvida para a **Rotelli Massas**, uma fabricante de massas artesanais italianas focada em atender restaurantes, hotéis, eventos e o público final na região de Balneário Camboriú - SC.

O principal objetivo deste projeto é combinar um design elegante (que transmita a tradição e a qualidade do produto) com um **sistema de vendas direto e sem atritos**, convertendo visitantes em clientes através de uma integração inteligente com o WhatsApp.

## 🎯 Propósito do Projeto
* **Vitrine Digital:** Apresentar o catálogo completo de massas artesanais com fotos de alta qualidade e descrições atraentes.
* **Experiência do Usuário (UX):** Proporcionar uma navegação fluida, moderna e intuitiva em qualquer dispositivo (Mobile, Tablet ou Desktop).
* **Conversão Direta:** Eliminar etapas complexas de cadastro, permitindo que o cliente monte seu pedido no site e finalize a compra diretamente no WhatsApp da empresa com um único clique.

## 🚀 Principais Funcionalidades (Features)

Este site foi construído focado em alta performance, dispensando o uso de frameworks pesados e utilizando **Vanilla JavaScript** para criar sistemas robustos:

* **🛒 Carrinho de Compras Inteligente (LocalStorage):** * Sistema de gaveta lateral (Sidebar) para gerenciamento do pedido.
  * Os itens adicionados são salvos no cache do navegador (`LocalStorage`), garantindo que o cliente não perca o pedido caso atualize a página.
* **📱 Checkout via WhatsApp:** * O carrinho compila todos os itens, quantidades, variações e valor total em uma mensagem formatada e redireciona o usuário para o WhatsApp da loja.
* **⚙️ Modais Dinâmicos de Produtos:** * O JavaScript lê os atributos (`data-id`, `data-preco`) de cada card e monta a janela de detalhes sob demanda.
  * **Seleção de Recheios Dinâmica:** O sistema identifica se a massa possui variações (ex: Ravioli de Carne, Frango ou Queijo) e gera a caixa de seleção (`<select>`) automaticamente apenas quando necessário.
* **🍔 Navegação Responsiva & Smart Navbar:**
  * Efeito *Glassmorphism* (Acrílico) na barra de navegação superior.
  * Sistema *Smart Scroll*: A barra se esconde ao rolar para baixo (liberando espaço de leitura) e reaparece ao rolar para cima.
  * Menu Hambúrguer com animação lateral suave exclusivo para dispositivos móveis.
* **🍪 Banner de Cookies (LGPD) Customizado:** * Sistema de aceite de cookies construído do zero, sem dependência de plugins externos, gravando a preferência do usuário no navegador.
* **🔔 Notificações Toast:** * Avisos elegantes e não-intrusivos que descem do topo da tela ao adicionar produtos ao carrinho, desaparecendo automaticamente após 3 segundos.

## 🛠️ Tecnologias Utilizadas

* **HTML5:** Semântica voltada para acessibilidade e SEO.
* **CSS3:** Flexbox, CSS Grid, Variáveis de Cor (Custom Properties), Media Queries para responsividade e animações nativas.
* **JavaScript (ES6+):** Manipulação da DOM, LocalStorage, Timers, e formatação de strings para APIs externas.
* **ScrollReveal.js:** Biblioteca leve utilizada para criar as animações de entrada dos elementos enquanto o usuário desce a página.
* **FontAwesome:** Ícones vetorizados para redes sociais e botões de interface.

## 📂 Estrutura de Arquivos

```text
/
├── index.html           # Página principal (Landing Page e Loja)
├── privacidade.html     # Página de Política de Privacidade
├── README.md            # Documentação do projeto
├── script.js            # Lógica central (Carrinho, Modais, Menu, Animações)
└── css/
    ├── global.css       # Variáveis de cor, tipografia e reset
    ├── header.css       # Estilos da Navbar, Menu Mobile e Carrinho
    ├── hero.css         # Estilo da seção principal de impacto
    ├── sections.css     # Estilo das seções de texto e história
    ├── main.css         # Estilo do Carrossel e Cards de Produto
    └── footer.css       # Estilo do rodapé da página
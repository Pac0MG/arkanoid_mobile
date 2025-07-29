# 🎮 Arkanoid Mobile

Um jogo clássico de Arkanoid otimizado para dispositivos móveis, desenvolvido com HTML5, CSS3 e JavaScript. Jogue diretamente no seu browser sem necessidade de instalação!

## 🚀 Demo ao Vivo

**Jogue agora:** [https://pac0mg.github.io/arkanoid_mobile/](https://pac0mg.github.io/arkanoid_mobile/)

## 📱 Características

### 🎯 Gameplay
- **5 níveis progressivos** com dificuldade crescente
- **Sistema de pontuação** dinâmico (10 pontos × nível por tijolo)
- **Física realista** com ângulos de colisão baseados na posição de impacto
- **Velocidade crescente** entre níveis
- **Detecção de colisão** precisa para paddle, tijolos e paredes

### 🎨 Visual
- **Design responsivo** que se adapta a qualquer tamanho de ecrã
- **Fundo animado** com campo de estrelas em movimento
- **Efeitos visuais** com gradientes e glow effects
- **Cores vibrantes** com esquema de cores neon
- **Animações suaves** e transições modernas

### 🔊 Áudio
- **Sons de colisão** diferenciados para tijolos e paddle
- **Múltiplos fallbacks** de áudio para máxima compatibilidade
- **Web Audio API** para dispositivos que não suportam HTML5 audio
- **Sons programáticos** como último recurso

### 📱 Mobile-First
- **Controles tácteis** otimizados para dispositivos móveis
- **Suporte a mouse** para desktop
- **Redimensionamento automático** ao rodar o dispositivo
- **Performance otimizada** para dispositivos com recursos limitados

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura e Canvas API
- **CSS3** - Styling moderno com gradientes e animações
- **JavaScript ES6+** - Lógica do jogo e interações
- **Canvas 2D** - Renderização gráfica
- **Web Audio API** - Sistema de áudio robusto
- **Touch Events** - Controles móveis

## 📁 Estrutura do Projeto

```
arkanoid_mobile/
├── index.html          # Estrutura HTML principal
├── style.css           # Estilos e design responsivo  
├── script.js           # Lógica do jogo e controles
└── README.md           # Documentação do projeto
```

## 🎮 Como Jogar

### Controlos
- **Mobile:** Deslize o dedo horizontalmente na tela para mover a paddle
- **Desktop:** Mova o mouse horizontalmente para controlar a paddle

### Objetivo
1. **Destrua todos os tijolos** rebatendo a bola com a paddle
2. **Não deixe a bola cair** fora do ecrã
3. **Complete os 5 níveis** para ganhar o jogo
4. **Maximize sua pontuação** destruindo tijolos rapidamente

### Sistema de Pontuação
- **Pontos por tijolo:** 10 × nível atual
- **Bônus de velocidade:** Quanto mais rápido, maior a pontuação
- **Progressão de níveis:** Cada nível aumenta a velocidade da bola

## 🚀 Instalação Local

### Opção 1: Download Direto
1. Faça download dos ficheiros `index.html`, `style.css` e `script.js`
2. Coloque todos na mesma pasta
3. Abra `index.html` no seu browser

### Opção 2: Git Clone
```bash
git clone https://github.com/pac0mg/arkanoid_mobile.git
cd arkanoid_mobile
```

### Opção 3: GitHub Pages
O jogo está automaticamente hospedado via GitHub Pages e pode ser acedido diretamente no browser.

## 🔧 Características Técnicas

### Responsividade
- **Canvas dinâmico** que se ajusta ao viewport
- **Elementos reposicionados** automaticamente no resize
- **Controlos adaptativos** para diferentes tamanhos de ecrã

### Performance
- **RequestAnimationFrame** para animações suaves (60 FPS)
- **Renderização otimizada** com clear e redraw eficientes
- **Gestão de memória** adequada para dispositivos móveis

### Compatibilidade
- **Todos os browsers modernos** (Chrome, Firefox, Safari, Edge)
- **iOS Safari** e **Chrome Mobile** totalmente suportados
- **Fallbacks de áudio** para máxima compatibilidade
- **Sem dependências externas** - funciona offline

### Áudio
- **HTML5 Audio** como método principal
- **Web Audio API** como fallback
- **Sons programáticos** para compatibilidade total
- **Inicialização** apenas após interação do utilizador

## 🐛 Resolução de Problemas

### O jogo não carrega
- Verifique se todos os ficheiros estão na mesma pasta
- Teste num browser diferente
- Limpe o cache do browser

### Sem som
- Toque na tela antes de jogar (políticas de autoplay)
- Verifique se o volume do dispositivo está ligado
- O jogo criará sons programáticos como fallback

### Controles não respondem
- Certifique-se de que está a tocar na área do canvas
- Recarregue a página se necessário
- Teste com gestos mais lentos

## 🤝 Contribuições

Contribuições são bem-vindas! Para contribuir:

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Ideias para melhorias
- [ ] Power-ups especiais
- [ ] Mais níveis e padrões de tijolos
- [ ] Sistema de high scores persistente
- [ ] Modos de jogo alternativos
- [ ] Melhor sistema de partículas
- [ ] Vibração em dispositivos móveis

## 📄 Licença

Este projeto está sob a licença GMV

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ por [pac0mg](https://github.com/pac0mg)

## 🙏 Agradecimentos

- Inspirado no clássico jogo Arkanoid
- Canvas API e Web Audio API communities
- Todos os beta testers que ajudaram a identificar bugs

---

**⭐ Se gostaste do projeto, deixa uma estrela no GitHub!**

**🎮 Diverte-te a jogar!**

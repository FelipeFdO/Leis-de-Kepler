# 🪐 Leis de Kepler — Painel Interativo de Astrofísica

> **Aplicação pedagógica interativa para o ensino de Gravitação e Leis de Kepler no Ensino Médio.**  
> Desenvolvida com **HTML5 Canvas**, **CSS3 Moderno** e **JavaScript**, com física precisa e foco didático.

---

## 🚀 Como Executar

Não é necessário instalar nenhum programa, biblioteca ou compilador:
1. Abra a pasta `Leis de kepler` na sua área de trabalho.
2. Dê um **duplo clique no arquivo `index.html`**.
3. O painel abrirá instantaneamente em qualquer navegador moderno (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
4. *Opcional:* Também funciona perfeitamente em celulares, tablets ou projetado na lousa digital da sala de aula.

---

## 🔭 O que contém o Painel?

### 1. 🌌 Apresentação & Contexto Histórico
- Breve introdução à ruptura com os modelos aristotélicos e os círculos perfeitos de Copérnico.
- Papel das medições astronômicas de **Tycho Brahe** e a dedução matemática por **Johannes Kepler**.
- Visão geral das três leis e seus impactos.

---

### 2. 🔴 1ª Lei — Lei das Órbitas (Elipses & Focos)
> *"Os planetas descrevem órbitas elípticas ao redor do Sol, que ocupa um dos focos da elipse."*

- **Controle Dinâmico de Excentricidade ($e$):** Permite variar a elipse de $e = 0$ (círculo) até $0{,}85$ (elipse altamente alongada).
- **Predefinições Reais:** Botões rápidos com a excentricidade real de corpos celestes:
  - Círculo perfeito ($e = 0$)
  - Terra ($e \approx 0{,}017$ — demonstrando aos alunos que a órbita da Terra é quase circular)
  - Marte ($e \approx 0{,}093$ — o planeta cujos dados desafiaram Kepler)
  - Mercúrio ($e \approx 0{,}206$)
  - Cometa Halley e cometas periódicos
- **Elementos Geométricos comutáveis:**
  - Sol no Foco 1 e Foco 2 vazio.
  - Distância do centro a cada foco ($c = a \cdot e$).
  - Semi-eixo maior ($a$) e semi-eixo menor ($b$).
  - Periélio ($r_p = a(1-e)$) e Afélio ($r_a = a(1+e)$).
  - **Prova da Elipse em tempo real:** Demonstração visual de que $r_1 + r_2 = 2a$ para qualquer ponto da órbita.

---

### 3. 🟡 2ª Lei — Lei das Áreas (Velocidade & Conservação)
> *"O segmento de reta que une o Sol a um planeta varre áreas iguais em intervalos de tempo iguais."*

- **Física Rigorosa:** A simulação resolve numericamente a **Equação de Kepler** ($M = E - e \sin E$) via algoritmo de Newton-Raphson e calcula a velocidade em cada ponto pela equação de *Vis-Viva*.
- **Comprovação Visual de Áreas Iguais:**
  - Setor do Periélio (curto e largo) colorido em ciano.
  - Setor do Afélio (longo e estreito) colorido em âmbar/dourado.
  - Cálculo numérico em tempo real comprovando: $\Delta A_1 = \Delta A_2$ ($100\%$ iguais).
- **Vetores Físicos:**
  - Vetor velocidade orbital $\vec{v}$ (tangente à curva, variando em módulo com velocímetro dinâmico).
  - Vetor força gravitacional $\vec{F}_g$ (sempre apontando para o Sol, mais intenso no periélio).

---

### 4. 🔵 3ª Lei — Lei dos Períodos (Harmônica)
> *"O quadrado do período de revolução de um planeta é diretamente proporcional ao cubo do semi-eixo maior da sua órbita: $T^2 = k \cdot a^3$."*

- **Simulação da "Corrida dos Planetas":** Visualização simultânea em escala temporal dos planetas do Sistema Solar (Mercúrio, Vênus, Terra, Marte, Júpiter e Saturno).
- **Planeta Hipotético Interativo:**
  - O aluno escolhe uma distância média ($a$) em Unidades Astronômicas com um slider.
  - O simulador calcula instantaneamente $T = \sqrt{a^3}$, $a^3$, $T^2$ e adiciona o planeta na pista orbital e no gráfico.
- **Gráfico Interativo:**
  - Alternância entre Gráfico Linear ($T^2 \times a^3$, formando uma reta de inclinação 1) e Gráfico Direto ($T \times a$, demonstrando a curva exponencial).
- **Tabela Astronômica do Sistema Solar:** Comprova que a razão $T^2 / a^3 \approx 1{,}00$ é constante para todos os planetas conhecidos.

---

### 5. 🏆 Quiz / Desafio Interativo
- 6 questões conceituais focadas no raciocínio físico e nos erros comuns do Ensino Médio.
- Feedback pedagógico imediato explicando a resolução e a teoria de cada alternativa.
- Painel de pontuação e aproveitamento ao final.

---

### 6. 📖 Guia do Professor
- Roteiro estruturado de aula para 50 ou 100 minutos.
- Perguntas disparadoras para debater mitos astronômicos (ex.: relação entre as estações do ano e a excentricidade orbital da Terra).

---

## 📁 Estrutura de Arquivos

```text
Leis de kepler/
├── index.html        # Estrutura completa da aplicação, abas e cards
├── styles.css        # Estilos, tema espacial moderno e responsividade
├── physics.js        # Módulo de equações astrofísicas (Kepler, Vis-Viva, Elipse)
├── simulators.js     # Motores de renderização gráfica em HTML5 Canvas
├── quiz.js           # Banco de questões e lógica do desafio
├── app.js            # Inicialização, ciclo de vida e eventos de navegação
└── README.md         # Documentação e guia de uso
```

---

*Bons estudos e excelentes aulas de Física!* 🚀🪐

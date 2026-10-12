# 🪐 Leis de Kepler — Painel Interativo de Astrofísica

> **Aplicação pedagógica interativa para o ensino de Gravitação e Leis de Kepler no Ensino Médio.**  
> Desenvolvida com **HTML5 Canvas**, **CSS3 Moderno** e **JavaScript**, com física precisa e foco didático.

🔗 **Acesse online via GitHub Pages:**  
👉 **[https://felipefdo.github.io/Leis-de-Kepler/](https://felipefdo.github.io/Leis-de-Kepler/)**

---

## 🚀 Como Executar

### Opção 1: Diretamente pelo Navegador (Online)
Acesse o link público do GitHub Pages:
**[https://felipefdo.github.io/Leis-de-Kepler/](https://felipefdo.github.io/Leis-de-Kepler/)**

### Opção 2: Localmente (Offline)
Não é necessário instalar nenhum programa, biblioteca ou compilador:
1. Baixe ou clone este repositório.
2. Dê um **duplo clique no arquivo `index.html`**.
3. O painel abrirá instantaneamente em qualquer navegador moderno (Chrome, Edge, Firefox, Safari).
4. Funciona perfeitamente em computadores, tablets, celulares ou projetores de sala de aula.

---

## 🔭 O que contém o Painel?

### 1. 🌌 Apresentação & Contexto Histórico
- Breve introdução à ruptura com os modelos aristotélicos e os círculos perfeitos de Copérnico.
- Papel das medições astronômicas de **Tycho Brahe** e a dedução matemática por **Johannes Kepler**.
- Visão geral das três leis e seus impactos na física e na astronomia.

---

### 2. 🔴 1ª Lei — Lei das Órbitas (Elipses & Focos)
> *"Os planetas descrevem órbitas elípticas ao redor do Sol, que ocupa um dos focos da elipse."*

- **Controle Dinâmico de Excentricidade (_e_):** Permite variar a elipse de _e_ = 0 (círculo perfeito) até 0,85 (elipse altamente alongada).
- **Predefinições Reais:** Botões rápidos com a excentricidade real de corpos celestes:
  - Círculo perfeito (_e_ = 0)
  - Terra (_e_ ≈ 0,017 — demonstrando aos alunos que a órbita da Terra é quase circular)
  - Marte (_e_ ≈ 0,093 — o planeta cujos dados desafiaram Kepler)
  - Mercúrio (_e_ ≈ 0,206)
  - Cometa Halley e cometas periódicos
- **Elementos Geométricos comutáveis:**
  - Sol no Foco 1 e Foco 2 vazio.
  - Distância do centro a cada foco (_c_ = _a_ · _e_).
  - Semi-eixo maior (_a_) e semi-eixo menor (_b_).
  - Periélio [_r_<sub>p</sub> = _a_(1 − _e_)] e Afélio [_r_<sub>a</sub> = _a_(1 + _e_)].
  - **Prova da Elipse em tempo real:** Demonstração visual de que **_r_₁ + _r_₂ = 2_a_** para qualquer ponto da órbita.

---

### 3. 🟡 2ª Lei — Lei das Áreas (Velocidade & Conservação)
> *"O segmento de reta que une o Sol a um planeta varre áreas iguais em intervalos de tempo iguais: ΔA / Δt = constante."*

- **Física Rigorosa:** A simulação resolve numericamente a **Equação de Kepler** (_M_ = _E_ − _e_·sin _E_) via algoritmo de Newton-Raphson e calcula a velocidade instantânea pela equação de *Vis-Viva*.
- **Comprovação Visual de Áreas Iguais:**
  - Setor do Periélio (curto e largo) colorido em ciano.
  - Setor do Afélio (longo e estreito) colorido em âmbar/dourado.
  - Cálculo numérico em tempo real comprovando: **Δ_A_₁ = Δ_A_₂ (100% idênticas)**.
- **Vetores Físicos:**
  - Vetor velocidade orbital **_v⃗_** (tangente à curva, variando em magnitude com velocímetro dinâmico em km/s).
  - Vetor força gravitacional **_F⃗_<sub>g</sub>** (força central apontando sempre para o Sol, máxima no periélio).

---

### 4. 🔵 3ª Lei — Lei dos Períodos (Harmônica)
> *"O quadrado do período de revolução de um planeta é diretamente proporcional ao cubo do semi-eixo maior da sua órbita: T² = k · a³."*

- **Simulação da "Corrida dos Planetas":** Visualização simultânea em escala temporal dos planetas do Sistema Solar (Mercúrio, Vênus, Terra, Marte, Júpiter e Saturno).
- **Planeta Hipotético Interativo:**
  - O aluno escolhe uma distância média (_a_) em Unidades Astronômicas com um slider.
  - O simulador calcula instantaneamente **_T_ = √_a_³**, _a_³, _T_² e adiciona o planeta na pista orbital e no gráfico.
- **Gráfico Interativo:**
  - Alternância entre Gráfico Linear (**_T_² vs _a_³**, formando uma reta teórica de inclinação 1) e Gráfico Direto (**_T_ vs _a_**, demonstrando a curva exponencial).
- **Tabela Astronômica do Sistema Solar:** Comprova que a razão **_T_² / _a_³ ≈ 1,00** é constante para todos os planetas conhecidos.

---

### 5. 🏆 Quiz / Desafio Interativo
- 6 questões conceituais focadas no raciocínio físico e nos erros comuns do Ensino Médio.
- Feedback pedagógico imediato explicando a resolução e a teoria de cada alternativa.
- Painel de pontuação e aproveitamento ao final.

---

### 6. 📖 Guia do Professor
- Roteiro estruturado de aula para 50 ou 100 minutos.
- Perguntas disparadoras para debater mitos astronômicos (ex.: por que as estações do ano não são causadas pela distância da Terra ao Sol).

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

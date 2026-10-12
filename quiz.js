/**
 * quiz.js - Banco de Questões e Sistema Interativo de Desafio
 * Desenvolvido especificamente para o currículo de Física do Ensino Médio.
 * Notação matemática padronizada e limpa.
 */

(function (root, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else {
    root.KeplerQuiz = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const KeplerQuiz = [
    {
      id: 1,
      law: '1ª Lei de Kepler (Órbitas)',
      question: 'De acordo com a 1ª Lei de Kepler, a trajetória de um planeta ao redor do Sol é:',
      options: [
        { text: 'Um círculo perfeito com o Sol localizado exatamente no centro geométrico.', correct: false },
        { text: 'Uma elipse, com o Sol posicionado em um dos seus focos.', correct: true },
        { text: 'Uma parábola aberta que nunca se repete no espaço.', correct: false },
        { text: 'Uma elipse, com o Sol localizado no centro geométrico exato.', correct: false }
      ],
      explanation: 'Excelente! A 1ª Lei afirma que as órbitas são elípticas e que o Sol ocupa um dos focos da elipse (e não o centro geométrico). No outro foco não há nenhum corpo material.'
    },
    {
      id: 2,
      law: '1ª Lei de Kepler (Geometria)',
      question: 'O que acontece quando a excentricidade (<i>e</i>) de uma órbita é igual a zero (<i>e</i> = 0)?',
      options: [
        { text: 'A elipse se degenera em uma linha reta.', correct: false },
        { text: 'A órbita se torna uma circunferência perfeita com os dois focos coincidentes no centro.', correct: true },
        { text: 'O planeta colide instantaneamente com o Sol.', correct: false },
        { text: 'A distância do afélio se torna o dobro da distância do periélio.', correct: false }
      ],
      explanation: 'Correto! A circunferência é um caso particular da elipse onde a excentricidade é zero (<i>e</i> = 0) e a distância focal é nula (<i>c</i> = 0), fazendo os dois focos coincidirem no mesmo ponto central.'
    },
    {
      id: 3,
      law: '2ª Lei de Kepler (Áreas e Velocidade)',
      question: 'Em que ponto da órbita a velocidade de translação do planeta é MÁXIMA?',
      options: [
        { text: 'No Afélio, quando o planeta está mais afastado do Sol.', correct: false },
        { text: 'No Periélio, quando o planeta está mais próximo do Sol.', correct: true },
        { text: 'A velocidade é rigorosamente constante durante todo o ano.', correct: false },
        { text: 'Exatamente nos pontos que interceptam o semi-eixo menor.', correct: false }
      ],
      explanation: 'Muito bem! Para que a linha imaginária Sol-planeta varra áreas iguais em intervalos de tempo iguais, o planeta precisa percorrer um arco maior quando está mais perto do Sol. Por isso, a velocidade é máxima no periélio e mínima no afélio.'
    },
    {
      id: 4,
      law: '2ª Lei de Kepler (Varredura de Áreas)',
      question: 'Se um planeta demora 30 dias para percorrer o trecho A → B e outros 30 dias para percorrer o trecho C → D, o que podemos afirmar sobre as áreas varridas nesses trechos?',
      options: [
        { text: 'A área do trecho mais próximo do Sol é sempre o dobro da outra.', correct: false },
        { text: 'As áreas são rigorosamente iguais, pois os intervalos de tempo são idênticos.', correct: true },
        { text: 'A área no afélio é sempre maior porque o raio vetor é mais longo.', correct: false },
        { text: 'Não é possível saber sem conhecer a massa do planeta.', correct: false }
      ],
      explanation: 'Exato! A 2ª Lei estabelece a constância da velocidade areolar: <b>Δ<i>A</i> / Δ<i>t</i> = constante</b>. Intervalos de tempo iguais (Δ<i>t</i> = 30 dias) resultam obrigatoriamente em áreas varridas iguais (<b>Δ<i>A</i>₁ = Δ<i>A</i>₂</b>).'
    },
    {
      id: 5,
      law: '3ª Lei de Kepler (Períodos)',
      question: 'Um planeta hipotético orbita o Sol a uma distância média (semi-eixo maior) de 4 Unidades Astronômicas (UA). Qual é o período orbital deste planeta em anos terrestres?',
      options: [
        { text: '2 anos terrestres', correct: false },
        { text: '4 anos terrestres', correct: false },
        { text: '8 anos terrestres', correct: true },
        { text: '16 anos terrestres', correct: false }
      ],
      explanation: 'Perfeito! Pela 3ª Lei de Kepler: <b><i>T</i>² = <i>a</i>³</b>. Para <i>a</i> = 4 UA, temos <i>T</i>² = 4³ = 64. Logo, <b><i>T</i> = √64 = 8 anos terrestres</b>.'
    },
    {
      id: 6,
      law: '3ª Lei de Kepler (Sistema Solar)',
      question: 'Comparando o planeta Terra (<i>a</i> = 1 UA) com o planeta Marte (<i>a</i> ≈ 1,52 UA), podemos concluir que:',
      options: [
        { text: 'Marte completa uma volta ao redor do Sol em menos tempo que a Terra.', correct: false },
        { text: 'O período orbital de Marte é maior que 1 ano terrestre e sua velocidade orbital média é menor que a da Terra.', correct: true },
        { text: 'Ambos possuem o mesmo período de translação, mudando apenas a velocidade.', correct: false },
        { text: 'A gravidade de Marte não permite calcular seu período orbital.', correct: false }
      ],
      explanation: 'Isso aí! Como Marte tem um semi-eixo maior (<i>a</i> > 1 UA), seu período orbital é consideravelmente maior (<i>T</i> ≈ 1,88 anos). Além disso, quanto mais distante do Sol, menor é a velocidade orbital média do planeta.'
    }
  ];

  return KeplerQuiz;
});

/**
 * app.js - Ponto de Entrada da Aplicação
 * Gerencia a alternância de abas, ciclo de vida dos simuladores e redimensionamento.
 */

document.addEventListener('DOMContentLoaded', () => {
  let sim1 = null;
  let sim2 = null;
  let sim3 = null;
  let quiz = null;

  function initSimulators() {
    // 1ª Lei
    if (!sim1 && document.getElementById('canvas-law1') && window.Law1Simulator) {
      sim1 = new window.Law1Simulator('canvas-law1');
    }
    // 2ª Lei
    if (!sim2 && document.getElementById('canvas-law2') && window.Law2Simulator) {
      sim2 = new window.Law2Simulator('canvas-law2');
    }
    // 3ª Lei
    if (!sim3 && document.getElementById('canvas-law3-orbits') && document.getElementById('canvas-law3-graph') && window.Law3Simulator) {
      sim3 = new window.Law3Simulator('canvas-law3-orbits', 'canvas-law3-graph');
    }
    // Quiz
    if (!quiz && document.getElementById('quiz-mount') && window.QuizController) {
      quiz = new window.QuizController('quiz-mount');
    }
  }

  // Inicializa na carga
  initSimulators();

  // Gerenciamento de Troca de Abas
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.dataset.tab;

      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetTabId);
      if (targetPane) {
        targetPane.classList.add('active');
      }

      // Reinicializa/atualiza referências caso necessário
      initSimulators();

      // Dispara redimensionamento sutil para ajustar resolução dos Canvas após transição
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
    });
  });
});

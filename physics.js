/**
 * physics.js - Módulo de Física e Astrodinâmica para as Leis de Kepler
 * Implementações precisas para fins didáticos e científicos.
 * Compatível tanto com navegador direto (file://) quanto módulos.
 */

(function (root, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else {
    root.KeplerPhysics = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const KeplerPhysics = {
    // Constantes e dados astronômicos do Sistema Solar
    PLANETS: [
      { name: 'Mercúrio', a: 0.387, e: 0.2056, T: 0.241, color: '#a6a6a6', radius: 4 },
      { name: 'Vênus', a: 0.723, e: 0.0068, T: 0.615, color: '#e3bb76', radius: 6 },
      { name: 'Terra', a: 1.000, e: 0.0167, T: 1.000, color: '#4da6ff', radius: 6.5 },
      { name: 'Marte', a: 1.524, e: 0.0934, T: 1.881, color: '#e65c40', radius: 5 },
      { name: 'Júpiter', a: 5.204, e: 0.0484, T: 11.862, color: '#d99b66', radius: 11 },
      { name: 'Saturno', a: 9.537, e: 0.0542, T: 29.457, color: '#e8cb89', radius: 9 },
      { name: 'Urano', a: 19.191, e: 0.0472, T: 84.011, color: '#76d7ea', radius: 7.5 },
      { name: 'Netuno', a: 30.069, e: 0.0086, T: 164.79, color: '#4169e1', radius: 7.5 },
      { name: 'Cometa Halley', a: 17.834, e: 0.967, T: 75.32, color: '#a8e6cf', radius: 3 }
    ],

    /**
     * Resolve a Equação de Kepler: M = E - e * sin(E)
     * Encontra a Anomalia Excêntrica (E) a partir da Anomalia Média (M) e da Excentricidade (e)
     * Usa o método iterativo de Newton-Raphson com convergência rápida.
     */
    solveKepler: function (M, e) {
      M = ((M % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);

      let E = e > 0.8 ? Math.PI : M;
      const maxIter = 30;
      const tol = 1e-8;

      for (let i = 0; i < maxIter; i++) {
        const f = E - e * Math.sin(E) - M;
        const fPrime = 1 - e * Math.cos(E);
        const delta = f / fPrime;
        E -= delta;
        if (Math.abs(delta) < tol) break;
      }
      return E;
    },

    /**
     * Calcula as propriedades geométricas da elipse
     */
    getEllipseProperties: function (a, e) {
      const b = a * Math.sqrt(Math.max(0, 1 - e * e));
      const c = a * e;
      const rPerihelion = a * (1 - e);
      const rAphelion = a * (1 + e);
      const areaTotal = Math.PI * a * b;

      return {
        a: a,
        b: b,
        c: c,
        e: e,
        rPerihelion: rPerihelion,
        rAphelion: rAphelion,
        areaTotal: areaTotal
      };
    },

    /**
     * Calcula a posição cartesiana (x, y) e distância (r) em relação ao Sol (Foco 1)
     */
    getOrbitalPosition: function (a, e, E) {
      const b = a * Math.sqrt(Math.max(0, 1 - e * e));
      const x = a * (Math.cos(E) - e);
      const y = b * Math.sin(E);
      const r = a * (1 - e * Math.cos(E));

      const c = a * e;
      const xF2 = -2 * c;
      const r2 = Math.hypot(x - xF2, y);

      return { x: x, y: y, r: r, r2: r2, sumDistances: r + r2 };
    },

    /**
     * Calcula a velocidade orbital instantânea usando a equação de Vis-Viva
     */
    getOrbitalSpeed: function (a, e, r) {
      const mu = 1;
      const v = Math.sqrt(Math.max(0, mu * (2 / r - 1 / a)));
      const vMax = Math.sqrt(mu * (2 / (a * (1 - e)) - 1 / a));
      const vMin = Math.sqrt(mu * (2 / (a * (1 + e)) - 1 / a));
      return { v: v, vMax: vMax, vMin: vMin };
    },

    /**
     * 3ª Lei de Kepler: T = sqrt(a^3)
     */
    calculatePeriod: function (a) {
      return Math.sqrt(Math.pow(a, 3));
    },

    /**
     * Semi-eixo maior: a = T^(2/3)
     */
    calculateSemiMajorAxis: function (T) {
      return Math.cbrt(Math.pow(T, 2));
    },

    /**
     * Calcula a área de um setor elíptico delimitado pelo Sol e intervalo de tempo
     */
    calculateSectorArea: function (a, e, deltaM) {
      const b = a * Math.sqrt(Math.max(0, 1 - e * e));
      const areaTotal = Math.PI * a * b;
      return areaTotal * (deltaM / (2 * Math.PI));
    }
  };

  return KeplerPhysics;
});

/**
 * simulators.js - Gerenciamento dos Simuladores Gráficos em HTML5 Canvas
 * Renderização dinâmica, física precisa e controles interativos.
 * Compatível tanto com navegador direto (file://) quanto módulos.
 */

(function (root, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory(require('./physics.js'), require('./quiz.js'));
  } else {
    const exports = factory(root.KeplerPhysics, root.KeplerQuiz);
    root.Law1Simulator = exports.Law1Simulator;
    root.Law2Simulator = exports.Law2Simulator;
    root.Law3Simulator = exports.Law3Simulator;
    root.QuizController = exports.QuizController;
  }
})(typeof self !== 'undefined' ? self : this, function (KeplerPhysics, KeplerQuiz) {
  'use strict';

  // --- UTILITÁRIOS GERAIS DE CANVAS ---
  class CanvasHelper {
    static setupHiDPI(canvas) {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width || canvas.width || 800;
      const height = rect.height || canvas.height || 500;

      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
      }
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { ctx, width, height };
    }

    static drawStars(ctx, width, height, stars) {
      ctx.fillStyle = '#0a0d1a';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    static generateStarfield(count = 90) {
      const stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random(),
          y: Math.random(),
          size: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.7 + 0.2
        });
      }
      return stars;
    }
  }

  // ====================================================================
  // 1ª LEI DE KEPLER - SIMULADOR DAS ÓRBITAS
  // ====================================================================
  class Law1Simulator {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.stars = CanvasHelper.generateStarfield(80);

      this.a = 210;
      this.e = 0.55;
      this.meanAnomaly = 0;
      this.speed = 1.0;
      this.isPlaying = true;

      this.showFoci = true;
      this.showLines = true;
      this.showAxes = true;
      this.showPeriAphelion = true;
      this.showOrbitTrail = true;

      this.lastTime = 0;
      this.initControls();
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    }

    initControls() {
      const eccSlider = document.getElementById('law1-eccentricity');
      const eccVal = document.getElementById('law1-ecc-val');
      const speedSlider = document.getElementById('law1-speed');
      const speedVal = document.getElementById('law1-speed-val');
      const playBtn = document.getElementById('law1-play-btn');
      const resetBtn = document.getElementById('law1-reset-btn');

      if (eccSlider) {
        eccSlider.addEventListener('input', (e) => {
          this.e = parseFloat(e.target.value);
          if (eccVal) eccVal.textContent = this.e.toFixed(3);
          this.updateInfo();
        });
      }

      if (speedSlider) {
        speedSlider.addEventListener('input', (e) => {
          this.speed = parseFloat(e.target.value);
          if (speedVal) speedVal.textContent = `${this.speed.toFixed(1)}x`;
        });
      }

      if (playBtn) {
        playBtn.addEventListener('click', () => {
          this.isPlaying = !this.isPlaying;
          playBtn.innerHTML = this.isPlaying
            ? '<span>⏸</span> Pausar'
            : '<span>▶</span> Continuar';
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.meanAnomaly = 0;
        });
      }

      document.querySelectorAll('.law1-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetE = parseFloat(btn.dataset.ecc);
          this.e = targetE;
          if (eccSlider) eccSlider.value = targetE;
          if (eccVal) eccVal.textContent = targetE.toFixed(3);
          this.updateInfo();
        });
      });

      const bindToggle = (id, prop) => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('change', (ev) => {
            this[prop] = ev.target.checked;
          });
        }
      };

      bindToggle('law1-toggle-foci', 'showFoci');
      bindToggle('law1-toggle-lines', 'showLines');
      bindToggle('law1-toggle-axes', 'showAxes');
      bindToggle('law1-toggle-periaphelion', 'showPeriAphelion');

      this.updateInfo();
    }

    updateInfo() {
      const props = KeplerPhysics.getEllipseProperties(this.a, this.e);
      const setElem = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };

      setElem('law1-info-e', this.e.toFixed(3));
      setElem('law1-info-a', `${(this.a / 100).toFixed(2)} UA`);
      setElem('law1-info-b', `${(props.b / 100).toFixed(2)} UA`);
      setElem('law1-info-c', `${(props.c / 100).toFixed(2)} UA`);
      setElem('law1-info-rp', `${(props.rPerihelion / 100).toFixed(2)} UA`);
      setElem('law1-info-ra', `${(props.rAphelion / 100).toFixed(2)} UA`);
    }

    animate(timestamp) {
      if (!this.lastTime) this.lastTime = timestamp;
      const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
      this.lastTime = timestamp;

      if (this.isPlaying) {
        this.meanAnomaly += dt * 0.8 * this.speed;
      }

      // Renderiza se a aba estiver visível
      const pane = document.getElementById('tab-law1');
      if (pane && pane.classList.contains('active')) {
        this.render();
      }
      requestAnimationFrame(this.animate);
    }

    render() {
      const { ctx, width, height } = CanvasHelper.setupHiDPI(this.canvas);
      CanvasHelper.drawStars(ctx, width, height, this.stars);

      const centerX = width / 2;
      const centerY = height / 2;
      const props = KeplerPhysics.getEllipseProperties(this.a, this.e);

      const sunX = centerX + props.c;
      const sunY = centerY;
      const focus2X = centerX - props.c;
      const focus2Y = centerY;

      ctx.save();

      // 1. Eixos e Centro
      if (this.showAxes) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(centerX - this.a - 30, centerY);
        ctx.lineTo(centerX + this.a + 30, centerY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX, centerY - props.b - 20);
        ctx.lineTo(centerX, centerY + props.b + 20);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '11px sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Centro (C)', centerX - 26, centerY - 8);

        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`Semi-eixo a`, centerX + this.a / 2 - 25, centerY + 18);
        ctx.fillStyle = '#f472b6';
        ctx.fillText(`Semi-eixo b`, centerX + 8, centerY - props.b / 2);
      }

      // 2. Trajetória da Órbita
      if (this.showOrbitTrail) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, this.a, props.b, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 3. Focos
      if (this.showFoci) {
        ctx.fillStyle = '#93c5fd';
        ctx.beginPath();
        ctx.arc(focus2X, focus2Y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '11px sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText('Foco 2 (vazio)', focus2X - 35, focus2Y + 20);

        ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + 30);
        ctx.lineTo(sunX, centerY + 30);
        ctx.stroke();
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText(`c = ${(props.c / 100).toFixed(2)} UA`, centerX + (props.c / 2) - 20, centerY + 45);
      }

      // 4. Planeta e Distâncias
      const E = KeplerPhysics.solveKepler(this.meanAnomaly, this.e);
      const planetX = centerX + this.a * Math.cos(E);
      const planetY = centerY + props.b * Math.sin(E);

      const distSun = Math.hypot(planetX - sunX, planetY - sunY);
      const distF2 = Math.hypot(planetX - focus2X, planetY - focus2Y);
      const sumDist = distSun + distF2;

      const sumEl = document.getElementById('law1-info-sum');
      if (sumEl) {
        sumEl.innerHTML = `${(distSun / 100).toFixed(2)} + ${(distF2 / 100).toFixed(2)} = <strong style="color: #fef08a;">${(sumDist / 100).toFixed(2)} UA</strong> &nbsp;(2<i>a</i> = ${(2 * this.a / 100).toFixed(2)} UA)`;
      }

      // 5. Linhas dos Focos até o Planeta
      if (this.showLines) {
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.7)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(sunX, sunY);
        ctx.lineTo(planetX, planetY);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(147, 197, 253, 0.7)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(focus2X, focus2Y);
        ctx.lineTo(planetX, planetY);
        ctx.stroke();

        const midSunX = (sunX + planetX) / 2;
        const midSunY = (sunY + planetY) / 2;
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#fde047';
        ctx.fillText(`r₁ = ${(distSun / 100).toFixed(2)}`, midSunX + 6, midSunY - 6);

        const midF2X = (focus2X + planetX) / 2;
        const midF2Y = (focus2Y + planetY) / 2;
        ctx.fillStyle = '#bfdbfe';
        ctx.fillText(`r₂ = ${(distF2 / 100).toFixed(2)}`, midF2X - 35, midF2Y - 6);
      }

      // 6. Periélio e Afélio
      if (this.showPeriAphelion) {
        const periX = centerX + this.a;
        const aphelX = centerX - this.a;

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(periX, centerY, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fca5a5';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('Periélio', periX - 25, centerY - 14);

        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(aphelX, centerY, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#93c5fd';
        ctx.fillText('Afélio', aphelX - 18, centerY - 14);
      }

      // 7. Sol (Foco 1)
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 3, sunX, sunY, 18);
      sunGrad.addColorStop(0, '#ffffff');
      sunGrad.addColorStop(0.3, '#fef08a');
      sunGrad.addColorStop(0.7, '#eab308');
      sunGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.fillText('Sol (Foco 1)', sunX - 32, sunY + 28);

      // 8. Planeta
      const planetGrad = ctx.createRadialGradient(planetX, planetY, 2, planetX, planetY, 9);
      planetGrad.addColorStop(0, '#bae6fd');
      planetGrad.addColorStop(0.7, '#0284c7');
      planetGrad.addColorStop(1, '#0369a1');
      ctx.fillStyle = planetGrad;
      ctx.beginPath();
      ctx.arc(planetX, planetY, 7.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(planetX, planetY, 7.5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Planeta', planetX + 12, planetY + 4);

      ctx.restore();
    }
  }

  // ====================================================================
  // 2ª LEI DE KEPLER - SIMULADOR DAS ÁREAS
  // ====================================================================
  class Law2Simulator {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.stars = CanvasHelper.generateStarfield(80);

      this.a = 210;
      this.e = 0.58;
      this.meanAnomaly = 0;
      this.speed = 1.0;
      this.isPlaying = true;

      this.deltaM = Math.PI / 4; // 1/8 do período
      this.showSectors = true;
      this.showVelocityVector = true;
      this.showForceVector = true;
      this.showRadiusVector = true;

      this.lastTime = 0;
      this.initControls();
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    }

    initControls() {
      const eccSlider = document.getElementById('law2-eccentricity');
      const eccVal = document.getElementById('law2-ecc-val');
      const speedSlider = document.getElementById('law2-speed');
      const speedVal = document.getElementById('law2-speed-val');
      const playBtn = document.getElementById('law2-play-btn');
      const resetBtn = document.getElementById('law2-reset-btn');

      if (eccSlider) {
        eccSlider.addEventListener('input', (e) => {
          this.e = parseFloat(e.target.value);
          if (eccVal) eccVal.textContent = this.e.toFixed(3);
          this.updateSectorInfo();
        });
      }

      if (speedSlider) {
        speedSlider.addEventListener('input', (e) => {
          this.speed = parseFloat(e.target.value);
          if (speedVal) speedVal.textContent = `${this.speed.toFixed(1)}x`;
        });
      }

      if (playBtn) {
        playBtn.addEventListener('click', () => {
          this.isPlaying = !this.isPlaying;
          playBtn.innerHTML = this.isPlaying
            ? '<span>⏸</span> Pausar'
            : '<span>▶</span> Continuar';
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.meanAnomaly = 0;
        });
      }

      const bindToggle = (id, prop) => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('change', (ev) => {
            this[prop] = ev.target.checked;
          });
        }
      };

      bindToggle('law2-toggle-sectors', 'showSectors');
      bindToggle('law2-toggle-vel', 'showVelocityVector');
      bindToggle('law2-toggle-force', 'showForceVector');
      bindToggle('law2-toggle-radius', 'showRadiusVector');

      this.updateSectorInfo();
    }

    updateSectorInfo() {
      const area = KeplerPhysics.calculateSectorArea(this.a, this.e, this.deltaM);
      const props = KeplerPhysics.getEllipseProperties(this.a, this.e);
      const percentTotal = ((area / props.areaTotal) * 100).toFixed(1);

      const setElem = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = val;
      };

      setElem('law2-info-area1', `${(area / 1000).toFixed(2)} u² (${percentTotal}% da órbita)`);
      setElem('law2-info-area2', `${(area / 1000).toFixed(2)} u² (${percentTotal}% da órbita)`);
      setElem('law2-info-equality', 'Δ<i>A</i>₁ = Δ<i>A</i>₂ (100% Idênticas!)');
    }

    animate(timestamp) {
      if (!this.lastTime) this.lastTime = timestamp;
      const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
      this.lastTime = timestamp;

      if (this.isPlaying) {
        this.meanAnomaly += dt * 0.75 * this.speed;
      }

      const pane = document.getElementById('tab-law2');
      if (pane && pane.classList.contains('active')) {
        this.render();
      }
      requestAnimationFrame(this.animate);
    }

    drawSector(ctx, centerX, centerY, sunX, sunY, props, M_start, M_end, fillColor, strokeColor) {
      ctx.save();
      ctx.fillStyle = fillColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.8;

      ctx.beginPath();
      ctx.moveTo(sunX, sunY);

      const steps = 30;
      for (let i = 0; i <= steps; i++) {
        const m = M_start + (M_end - M_start) * (i / steps);
        const E = KeplerPhysics.solveKepler(m, this.e);
        const px = centerX + this.a * Math.cos(E);
        const py = centerY + props.b * Math.sin(E);
        ctx.lineTo(px, py);
      }

      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    render() {
      const { ctx, width, height } = CanvasHelper.setupHiDPI(this.canvas);
      CanvasHelper.drawStars(ctx, width, height, this.stars);

      const centerX = width / 2;
      const centerY = height / 2;
      const props = KeplerPhysics.getEllipseProperties(this.a, this.e);

      const sunX = centerX + props.c;
      const sunY = centerY;

      ctx.save();

      // 1. Órbita
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, this.a, props.b, 0, 0, Math.PI * 2);
      ctx.stroke();

      // 2. Setores de áreas iguais
      if (this.showSectors) {
        const s1_start = -this.deltaM / 2;
        const s1_end = this.deltaM / 2;
        this.drawSector(
          ctx, centerX, centerY, sunX, sunY, props,
          s1_start, s1_end,
          'rgba(56, 189, 248, 0.28)', '#38bdf8'
        );

        const s2_start = Math.PI - this.deltaM / 2;
        const s2_end = Math.PI + this.deltaM / 2;
        this.drawSector(
          ctx, centerX, centerY, sunX, sunY, props,
          s2_start, s2_end,
          'rgba(234, 179, 8, 0.28)', '#eab308'
        );

        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('Área 1 (Periélio)', centerX + this.a - 55, centerY - props.b * 0.45);
        ctx.font = '11px sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText('(Curto e Largo)', centerX + this.a - 50, centerY - props.b * 0.45 + 14);

        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#eab308';
        ctx.fillText('Área 2 (Afélio)', centerX - this.a + 10, centerY - props.b * 0.45);
        ctx.font = '11px sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText('(Longo e Estreito)', centerX - this.a + 10, centerY - props.b * 0.45 + 14);
      }

      // 3. Planeta e Posição
      const E = KeplerPhysics.solveKepler(this.meanAnomaly, this.e);
      const planetX = centerX + this.a * Math.cos(E);
      const planetY = centerY + props.b * Math.sin(E);

      const distToSun = Math.hypot(planetX - sunX, planetY - sunY);
      const rNorm = distToSun / this.a;
      const speedData = KeplerPhysics.getOrbitalSpeed(1.0, this.e, rNorm);

      const velText = document.getElementById('law2-info-current-v');
      const velBar = document.getElementById('law2-speed-bar');
      const distText = document.getElementById('law2-info-current-r');

      if (velText) {
        velText.textContent = `${(speedData.v * 30).toFixed(1)} km/s (Relativa: ${speedData.v.toFixed(2)})`;
      }
      if (distText) {
        distText.textContent = `${(distToSun / 100).toFixed(2)} UA`;
      }
      if (velBar) {
        const vPercent = ((speedData.v - speedData.vMin) / (speedData.vMax - speedData.vMin)) * 100;
        velBar.style.width = `${Math.max(5, Math.min(100, vPercent))}%`;
      }

      // 4. Raio Vetor
      if (this.showRadiusVector) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sunX, sunY);
        ctx.lineTo(planetX, planetY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 5. Vetor Velocidade
      if (this.showVelocityVector) {
        const vx = -this.a * Math.sin(E);
        const vy = props.b * Math.cos(E);
        const vMag = Math.hypot(vx, vy);
        const scaleV = speedData.v * 45;

        const uVx = (vx / vMag) * scaleV;
        const uVy = (vy / vMag) * scaleV;
        this.drawArrow(ctx, planetX, planetY, planetX + uVx, planetY + uVy, '#10b981', 'v');
      }

      // 6. Vetor Força Gravitacional
      if (this.showForceVector) {
        const fx = sunX - planetX;
        const fy = sunY - planetY;
        const fDist = Math.hypot(fx, fy);
        const fMag = Math.min(65, (18000 / (fDist * fDist)) * 10);
        const uFx = (fx / fDist) * fMag;
        const uFy = (fy / fDist) * fMag;
        this.drawArrow(ctx, planetX, planetY, planetX + uFx, planetY + uFy, '#ef4444', 'Fg');
      }

      // 7. Sol
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 3, sunX, sunY, 18);
      sunGrad.addColorStop(0, '#ffffff');
      sunGrad.addColorStop(0.3, '#fef08a');
      sunGrad.addColorStop(0.7, '#eab308');
      sunGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.fillText('Sol', sunX - 12, sunY + 26);

      // 8. Planeta
      const planetGrad = ctx.createRadialGradient(planetX, planetY, 2, planetX, planetY, 9);
      planetGrad.addColorStop(0, '#bae6fd');
      planetGrad.addColorStop(0.7, '#0284c7');
      planetGrad.addColorStop(1, '#0369a1');
      ctx.fillStyle = planetGrad;
      ctx.beginPath();
      ctx.arc(planetX, planetY, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(planetX, planetY, 8, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }

    drawArrow(ctx, fromX, fromY, toX, toY, color, label) {
      const headlen = 8;
      const angle = Math.atan2(toY - fromY, toX - fromX);

      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();

      if (label) {
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(label, toX + 6, toY + 4);
      }
      ctx.restore();
    }
  }

  // ====================================================================
  // 3ª LEI DE KEPLER - SIMULADOR DOS PERÍODOS (HARMÔNICA)
  // ====================================================================
  class Law3Simulator {
    constructor(orbitCanvasId, graphCanvasId) {
      this.orbitCanvas = document.getElementById(orbitCanvasId);
      this.graphCanvas = document.getElementById(graphCanvasId);
      if (!this.orbitCanvas || !this.graphCanvas) return;
      this.stars = CanvasHelper.generateStarfield(80);

      this.planets = [
        { name: 'Mercúrio', a: 0.387, color: '#a6a6a6', radius: 4 },
        { name: 'Vênus', a: 0.723, color: '#e3bb76', radius: 6 },
        { name: 'Terra', a: 1.000, color: '#38bdf8', radius: 6.5 },
        { name: 'Marte', a: 1.524, color: '#ef4444', radius: 5 },
        { name: 'Júpiter', a: 5.204, color: '#f59e0b', radius: 11 },
        { name: 'Saturno', a: 9.537, color: '#eab308', radius: 9 }
      ];

      this.planets.forEach(p => {
        p.T = KeplerPhysics.calculatePeriod(p.a);
        p.currentAngle = Math.random() * Math.PI * 2;
      });

      this.customPlanet = {
        name: 'Planeta Custom',
        a: 2.8,
        color: '#ec4899',
        radius: 6,
        currentAngle: 0,
        active: true
      };
      this.customPlanet.T = KeplerPhysics.calculatePeriod(this.customPlanet.a);

      this.speed = 1.0;
      this.isPlaying = true;
      this.graphMode = 'linear';

      this.lastTime = 0;
      this.initControls();
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    }

    initControls() {
      const customSlider = document.getElementById('law3-custom-a');
      const customVal = document.getElementById('law3-custom-a-val');
      const speedSlider = document.getElementById('law3-speed');
      const speedVal = document.getElementById('law3-speed-val');
      const playBtn = document.getElementById('law3-play-btn');
      const graphToggleBtn = document.getElementById('law3-graph-mode-btn');

      if (customSlider) {
        customSlider.addEventListener('input', (e) => {
          this.customPlanet.a = parseFloat(e.target.value);
          this.customPlanet.T = KeplerPhysics.calculatePeriod(this.customPlanet.a);
          if (customVal) customVal.textContent = `${this.customPlanet.a.toFixed(2)} UA`;
          this.updateCustomPlanetInfo();
          this.populateTable();
        });
      }

      if (speedSlider) {
        speedSlider.addEventListener('input', (e) => {
          this.speed = parseFloat(e.target.value);
          if (speedVal) speedVal.textContent = `${this.speed.toFixed(1)}x`;
        });
      }

      if (playBtn) {
        playBtn.addEventListener('click', () => {
          this.isPlaying = !this.isPlaying;
          playBtn.innerHTML = this.isPlaying
            ? '<span>⏸</span> Pausar'
            : '<span>▶</span> Continuar';
        });
      }

      if (graphToggleBtn) {
        graphToggleBtn.addEventListener('click', () => {
          this.graphMode = this.graphMode === 'linear' ? 'direct' : 'linear';
          graphToggleBtn.innerHTML = this.graphMode === 'linear'
            ? 'Alternar para <i>T</i> vs <i>a</i> (Curva)'
            : 'Alternar para <i>T</i>² vs <i>a</i>³ (Reta)';
        });
      }

      this.updateCustomPlanetInfo();
      this.populateTable();
    }

    updateCustomPlanetInfo() {
      const a = this.customPlanet.a;
      const T = this.customPlanet.T;
      const a3 = Math.pow(a, 3);
      const T2 = Math.pow(T, 2);
      const ratio = T2 / a3;

      const setElem = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };

      setElem('law3-info-custom-t', `${T.toFixed(3)} anos`);
      setElem('law3-info-custom-a3', `${a3.toFixed(3)} UA³`);
      setElem('law3-info-custom-t2', `${T2.toFixed(3)} anos²`);
      setElem('law3-info-custom-ratio', `${ratio.toFixed(3)} (Constante!)`);
    }

    populateTable() {
      const tbody = document.getElementById('law3-planets-table-body');
      if (!tbody) return;

      tbody.innerHTML = '';
      const all = [...this.planets, this.customPlanet];

      all.forEach(p => {
        const tr = document.createElement('tr');
        const a3 = Math.pow(p.a, 3);
        const T2 = Math.pow(p.T, 2);
        const ratio = T2 / a3;

        tr.innerHTML = `
          <td><span class="planet-dot" style="background:${p.color}"></span> ${p.name}</td>
          <td>${p.a.toFixed(3)}</td>
          <td>${p.T.toFixed(3)}</td>
          <td>${a3.toFixed(3)}</td>
          <td>${T2.toFixed(3)}</td>
          <td class="font-bold text-accent">${ratio.toFixed(3)}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    animate(timestamp) {
      if (!this.lastTime) this.lastTime = timestamp;
      const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
      this.lastTime = timestamp;

      if (this.isPlaying) {
        const baseEarthSpeed = 1.0 * this.speed;
        this.planets.forEach(p => {
          p.currentAngle += (baseEarthSpeed / p.T) * dt;
        });
        this.customPlanet.currentAngle += (baseEarthSpeed / this.customPlanet.T) * dt;
      }

      const pane = document.getElementById('tab-law3');
      if (pane && pane.classList.contains('active')) {
        this.renderOrbits();
        this.renderGraph();
      }
      requestAnimationFrame(this.animate);
    }

    renderOrbits() {
      const { ctx, width, height } = CanvasHelper.setupHiDPI(this.orbitCanvas);
      CanvasHelper.drawStars(ctx, width, height, this.stars);

      const centerX = width / 2;
      const centerY = height / 2;

      const scale = (Math.min(width, height) / 2 - 35) / Math.pow(10, 0.55);
      const getRadiusPx = (a) => Math.pow(a, 0.55) * scale;

      ctx.save();

      // Sol
      const sunGrad = ctx.createRadialGradient(centerX, centerY, 3, centerX, centerY, 18);
      sunGrad.addColorStop(0, '#ffffff');
      sunGrad.addColorStop(0.3, '#fef08a');
      sunGrad.addColorStop(0.7, '#eab308');
      sunGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
      ctx.fill();

      // Planetas do Sistema Solar
      this.planets.forEach(p => {
        const rPx = getRadiusPx(p.a);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, rPx, 0, Math.PI * 2);
        ctx.stroke();

        const px = centerX + rPx * Math.cos(p.currentAngle);
        const py = centerY + rPx * Math.sin(p.currentAngle);

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '10px sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(p.name, px + p.radius + 3, py + 3);
      });

      // Planeta Customizado
      if (this.customPlanet.active) {
        const customRPx = getRadiusPx(this.customPlanet.a);

        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, customRPx, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        const cpx = centerX + customRPx * Math.cos(this.customPlanet.currentAngle);
        const cpy = centerY + customRPx * Math.sin(this.customPlanet.currentAngle);

        ctx.fillStyle = 'rgba(236, 72, 153, 0.35)';
        ctx.beginPath();
        ctx.arc(cpx, cpy, this.customPlanet.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.arc(cpx, cpy, this.customPlanet.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#f472b6';
        ctx.fillText(`${this.customPlanet.name} (T = ${this.customPlanet.T.toFixed(1)}a)`, cpx + 10, cpy + 4);
      }

      ctx.restore();
    }

    renderGraph() {
      const { ctx, width, height } = CanvasHelper.setupHiDPI(this.graphCanvas);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      const padding = { top: 30, right: 30, bottom: 45, left: 60 };
      const graphW = width - padding.left - padding.right;
      const graphH = height - padding.top - padding.bottom;

      ctx.save();

      // Eixos X e Y
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padding.left, padding.top);
      ctx.lineTo(padding.left, height - padding.bottom);
      ctx.lineTo(width - padding.right, height - padding.bottom);
      ctx.stroke();

      // Grade sutil
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        const y = height - padding.bottom - (graphH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();

        const x = padding.left + (graphW / 4) * i;
        ctx.beginPath();
        ctx.moveTo(x, padding.top);
        ctx.lineTo(x, height - padding.bottom);
        ctx.stroke();
      }

      if (this.graphMode === 'linear') {
        const maxVal = 150;

        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('a³ (UA³)', width / 2 - 20, height - 12);

        ctx.save();
        ctx.translate(18, height / 2 + 30);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('T² (anos²)', 0, 0);
        ctx.restore();

        // Reta teórica
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(padding.left, height - padding.bottom);
        ctx.lineTo(padding.left + graphW, height - padding.bottom - graphH);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = '11px sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('Reta Teórica: T² = a³ (k = 1)', padding.left + 15, padding.top + 20);

        const plotPoint = (xVal, yVal, color, name, isCustom = false) => {
          if (xVal > maxVal) return;
          const px = padding.left + (xVal / maxVal) * graphW;
          const py = height - padding.bottom - (yVal / maxVal) * graphH;

          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(px, py, isCustom ? 6.5 : 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          ctx.font = '10px sans-serif';
          ctx.fillStyle = '#e2e8f0';
          ctx.fillText(name, px + 8, py - 4);
        };

        this.planets.forEach(p => {
          const a3 = Math.pow(p.a, 3);
          const T2 = Math.pow(p.T, 2);
          plotPoint(a3, T2, p.color, p.name);
        });

        const customA3 = Math.pow(this.customPlanet.a, 3);
        const customT2 = Math.pow(this.customPlanet.T, 2);
        plotPoint(customA3, customT2, this.customPlanet.color, this.customPlanet.name, true);

      } else {
        const maxA = 6.0;
        const maxT = 15.0;

        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('Semi-eixo a (UA)', width / 2 - 35, height - 12);

        ctx.save();
        ctx.translate(18, height / 2 + 25);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Período T (anos)', 0, 0);
        ctx.restore();

        ctx.strokeStyle = 'rgba(234, 179, 8, 0.7)';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        const steps = 60;
        for (let i = 0; i <= steps; i++) {
          const a = (i / steps) * maxA;
          const T = Math.pow(a, 1.5);
          const px = padding.left + (a / maxA) * graphW;
          const py = height - padding.bottom - (T / maxT) * graphH;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        this.planets.forEach(p => {
          if (p.a > maxA) return;
          const px = padding.left + (p.a / maxA) * graphW;
          const py = height - padding.bottom - (p.T / maxT) * graphH;

          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = '10px sans-serif';
          ctx.fillStyle = '#e2e8f0';
          ctx.fillText(p.name, px + 8, py - 4);
        });

        if (this.customPlanet.a <= maxA) {
          const cpx = padding.left + (this.customPlanet.a / maxA) * graphW;
          const cpy = height - padding.bottom - (this.customPlanet.T / maxT) * graphH;
          ctx.fillStyle = this.customPlanet.color;
          ctx.beginPath();
          ctx.arc(cpx, cpy, 6.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = 'bold 10px sans-serif';
          ctx.fillStyle = '#f472b6';
          ctx.fillText(this.customPlanet.name, cpx + 8, cpy - 4);
        }
      }

      ctx.restore();
    }
  }

  // ====================================================================
  // CONTROLADOR DO QUIZ INTERATIVO
  // ====================================================================
  class QuizController {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.answered = false;
      this.init();
    }

    init() {
      this.renderQuestion();
    }

    renderQuestion() {
      if (!this.container) return;

      if (this.currentQuestionIndex >= KeplerQuiz.length) {
        this.renderResults();
        return;
      }

      const q = KeplerQuiz[this.currentQuestionIndex];
      this.answered = false;

      this.container.innerHTML = `
        <div class="quiz-card">
          <div class="quiz-header">
            <span class="quiz-badge">${q.law}</span>
            <span class="quiz-step">Questão ${this.currentQuestionIndex + 1} de ${KeplerQuiz.length}</span>
          </div>
          <h3 class="quiz-question">${q.question}</h3>
          <div class="quiz-options">
            ${q.options.map((opt, idx) => `
              <button class="quiz-opt-btn" data-index="${idx}">
                <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
                <span class="opt-text">${opt.text}</span>
              </button>
            `).join('')}
          </div>
          <div id="quiz-feedback" class="quiz-feedback hidden"></div>
          <div class="quiz-footer">
            <button id="quiz-next-btn" class="btn btn-primary hidden">Próxima Questão →</button>
          </div>
        </div>
      `;

      this.container.querySelectorAll('.quiz-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (this.answered) return;
          const chosenIdx = parseInt(btn.dataset.index);
          this.checkAnswer(chosenIdx, q);
        });
      });

      const nextBtn = document.getElementById('quiz-next-btn');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          this.currentQuestionIndex++;
          this.renderQuestion();
        });
      }
    }

    checkAnswer(chosenIdx, q) {
      this.answered = true;
      const isCorrect = q.options[chosenIdx].correct;
      if (isCorrect) this.score++;

      const buttons = this.container.querySelectorAll('.quiz-opt-btn');
      buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (q.options[idx].correct) {
          btn.classList.add('correct');
        } else if (idx === chosenIdx) {
          btn.classList.add('incorrect');
        }
      });

      const feedback = document.getElementById('quiz-feedback');
      const nextBtn = document.getElementById('quiz-next-btn');

      if (feedback) {
        feedback.classList.remove('hidden');
        feedback.className = `quiz-feedback ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`;
        feedback.innerHTML = `
          <div class="feedback-title">${isCorrect ? '✅ Resposta Correta!' : '❌ Resposta Incorreta'}</div>
          <p>${q.explanation}</p>
        `;
      }

      if (nextBtn) {
        nextBtn.classList.remove('hidden');
      }
    }

    renderResults() {
      const total = KeplerQuiz.length;
      const percentage = Math.round((this.score / total) * 100);

      let message = '';
      let emoji = '';
      if (percentage === 100) {
        emoji = '🏆';
        message = 'Sensacional! Você dominou completamente as 3 Leis de Kepler!';
      } else if (percentage >= 70) {
        emoji = '🌟';
        message = 'Muito bem! Você tem um ótimo entendimento da gravitação e das órbitas!';
      } else {
        emoji = '🪐';
        message = 'Bom esforço! Experimente voltar aos simuladores para testar os parâmetros e tente novamente!';
      }

      this.container.innerHTML = `
        <div class="quiz-results-card">
          <div class="results-emoji">${emoji}</div>
          <h2>Desafio Concluído!</h2>
          <div class="score-circle">
            <span class="score-num">${this.score} / ${total}</span>
            <span class="score-pct">${percentage}% de acertos</span>
          </div>
          <p class="results-message">${message}</p>
          <button id="quiz-restart-btn" class="btn btn-primary">Tentar Novamente ↺</button>
        </div>
      `;

      document.getElementById('quiz-restart-btn')?.addEventListener('click', () => {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.renderQuestion();
      });
    }
  }

  return {
    Law1Simulator: Law1Simulator,
    Law2Simulator: Law2Simulator,
    Law3Simulator: Law3Simulator,
    QuizController: QuizController
  };
});

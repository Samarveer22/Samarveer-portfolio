/**
 * Dynamic HTML5 Canvas Background
 * Interactive Semiconductor Node & Circuit Trace Network
 * For: Samarveer Singh Mertia Portfolio
 */

(function () {
  'use strict';

  const canvas = document.getElementById('silicon-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Configuration
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 35 : 75;
  const connectionDistance = isMobile ? 100 : 140;
  const mouseInteractionRadius = isMobile ? 120 : 180;

  const getCyan = (alpha) => `rgba(6, 182, 212, ${alpha})`;
  const getAmber = (alpha) => `rgba(245, 158, 11, ${alpha})`;
  const getTrace = (alpha) => `rgba(51, 65, 85, ${alpha})`;

  // Mouse tracking
  const mouse = {
    x: -1000,
    y: -1000,
    active: false
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.active = true;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouse.active = false;
  });

  // Particle Node Class representing semiconductor junction / logic gate nodes
  class SemiconductorNode {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : (Math.random() > 0.5 ? -10 : height + 10);
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.baseRadius = Math.random() * 1.8 + 1.2;
      this.radius = this.baseRadius;
      this.type = Math.random() > 0.2 ? 'cyan' : 'amber'; // 80% cyan signal, 20% amber clock
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.02 + Math.random() * 0.02;
    }

    update() {
      if (!isReducedMotion) {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += this.pulseSpeed;

        // Wrap around boundaries smoothly
        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        if (this.y > height + 20) this.y = -20;
      }

      // Cursor reactive magnetism
      if (mouse.active) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dy + dy * dy);

        if (dist < mouseInteractionRadius && dist > 0) {
          const force = (mouseInteractionRadius - dist) / mouseInteractionRadius;
          const angle = Math.atan2(dy, dx);
          // Subtle attraction toward cursor
          this.x += Math.cos(angle) * force * 0.6;
          this.y += Math.sin(angle) * force * 0.6;
          this.radius = this.baseRadius + force * 1.8;
        } else {
          this.radius = this.baseRadius;
        }
      } else {
        this.radius = this.baseRadius;
      }
    }

    draw() {
      const alphaPulse = 0.35 + Math.sin(this.pulse) * 0.15;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

      if (this.type === 'cyan') {
        ctx.fillStyle = getCyan(alphaPulse);
        ctx.shadowColor = '#06B6D4';
      } else {
        ctx.fillStyle = getAmber(alphaPulse);
        ctx.shadowColor = '#F59E0B';
      }

      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow for performance
    }
  }

  // Instantiate nodes
  const nodes = [];
  for (let i = 0; i < particleCount; i++) {
    nodes.push(new SemiconductorNode());
  }

  // Connect nodes with circuit traces
  function drawCircuitTraces() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.16;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);

          // Render authentic right-angle step or direct PCB trace
          if (dist > connectionDistance * 0.5) {
            const midX = (nodes[i].x + nodes[j].x) / 2;
            ctx.lineTo(midX, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
          } else {
            ctx.lineTo(nodes[j].x, nodes[j].y);
          }

          ctx.strokeStyle = getTrace(alpha);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Cursor connection traces
      if (mouse.active) {
        const dx = mouse.x - nodes[i].x;
        const dy = mouse.y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseInteractionRadius) {
          const alpha = (1 - dist / mouseInteractionRadius) * 0.45;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = getCyan(alpha);
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }
  }

  // Animation Loop
  let animationFrameId;
  function animate() {
    ctx.clearRect(0, 0, width, height);

    drawCircuitTraces();

    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update();
      nodes[i].draw();
    }

    if (!isReducedMotion) {
      animationFrameId = requestAnimationFrame(animate);
    }
  }

  animate();

  // Resize handler with debounce
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // Re-center any node out of bounds
      nodes.forEach((n) => {
        if (n.x > width) n.x = Math.random() * width;
        if (n.y > height) n.y = Math.random() * height;
      });
      if (isReducedMotion) {
        ctx.clearRect(0, 0, width, height);
        drawCircuitTraces();
        nodes.forEach(n => n.draw());
      }
    }, 150);
  });
})();

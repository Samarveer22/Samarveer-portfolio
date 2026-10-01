/**
 * Interactive 3D Semiconductor Microchip
 * Handles CSS 3D tilt, specular lighting response, and signal pulse modulation
 * For: Samarveer Singh Mertia Portfolio
 */

(function () {
  'use strict';

  const chipContainer = document.getElementById('hero-chip-container');
  const chip = document.getElementById('interactive-microchip');
  if (!chipContainer || !chip) return;

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReducedMotion) return;

  let bounds = chipContainer.getBoundingClientRect();
  let mouseX = 0;
  let mouseY = 0;
  let currentRotateX = 0;
  let currentRotateY = 0;
  let targetRotateX = 0;
  let targetRotateY = 0;
  let isHovered = false;

  function updateBounds() {
    bounds = chipContainer.getBoundingClientRect();
  }

  window.addEventListener('resize', updateBounds);
  window.addEventListener('scroll', updateBounds, { passive: true });

  chipContainer.addEventListener('mouseenter', () => {
    isHovered = true;
  });

  chipContainer.addEventListener('mouseleave', () => {
    isHovered = false;
    targetRotateX = 0;
    targetRotateY = 0;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isHovered) {
      // Global subtle tilt based on screen cursor position
      const screenCenterX = window.innerWidth / 2;
      const screenCenterY = window.innerHeight / 2;
      const factorX = (e.clientX - screenCenterX) / screenCenterX;
      const factorY = (e.clientY - screenCenterY) / screenCenterY;
      targetRotateY = factorX * 12;
      targetRotateX = -factorY * 12;
      return;
    }

    // Direct cursor tracking within container bounds
    const rect = bounds;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;

    targetRotateY = normX * 24; // Up to 24 deg
    targetRotateX = -normY * 24;
  });

  // Touch support for mobile / tablet
  chipContainer.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const rect = bounds;
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      targetRotateY = ((x - centerX) / centerX) * 18;
      targetRotateX = -((y - centerY) / centerY) * 18;
    }
  }, { passive: true });

  // Spring physics render loop
  function render() {
    // Linear interpolation (lerp) for smooth weightiness
    currentRotateX += (targetRotateX - currentRotateX) * 0.1;
    currentRotateY += (targetRotateY - currentRotateY) * 0.1;

    const glowOffset = (currentRotateY / 24) * 15;
    const shadowIntensity = isHovered ? '0.45' : '0.25';

    chip.style.transform = `
      rotateX(${currentRotateX.toFixed(2)}deg) 
      rotateY(${currentRotateY.toFixed(2)}deg) 
      translateZ(20px)
    `;

    chip.style.boxShadow = `
      ${-glowOffset}px ${20 + Math.abs(currentRotateX)}px 45px -10px rgba(0, 0, 0, 0.85),
      ${glowOffset * 1.2}px 0 35px -5px rgba(6, 182, 212, ${shadowIntensity}),
      inset 0 0 0 1px rgba(255, 255, 255, 0.12)
    `;

    requestAnimationFrame(render);
  }

  render();
})();

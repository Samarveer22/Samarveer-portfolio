/**
 * Interactive Logic Gate Simulator
 * Supports AND, OR, XOR with dynamic SVG schematic wiring,
 * live Boolean evaluation, signal illumination, and truth-table tracking.
 * For: Samarveer Singh Mertia Portfolio
 */

(function () {
  'use strict';

  // DOM Elements
  const btnToggleA = document.getElementById('toggle-input-a');
  const btnToggleB = document.getElementById('toggle-input-b');
  const valDisplayA = document.getElementById('val-input-a');
  const valDisplayB = document.getElementById('val-input-b');

  const gateTabs = document.querySelectorAll('.gate-tab-btn');
  const gateNameDisplay = document.getElementById('active-gate-name');
  const gateFormulaDisplay = document.getElementById('active-gate-formula');

  const wireA = document.getElementById('wire-input-a');
  const wireB = document.getElementById('wire-input-b');
  const wireOut = document.getElementById('wire-output');
  const xorBackCurve = document.getElementById('xor-back-curve');
  const gateBody = document.getElementById('gate-body-element');

  const outputOrb = document.getElementById('logic-output-orb');
  const outputValDisplay = document.getElementById('logic-output-val');

  const truthTableBody = document.getElementById('truth-table-body');

  if (!btnToggleA || !btnToggleB || !outputOrb) return;

  // Simulator State
  let stateA = 0;
  let stateB = 0;
  let currentGate = 'AND'; // 'AND' | 'OR' | 'XOR'

  // Truth Table Definitions
  const truthTables = {
    AND: [
      { a: 0, b: 0, out: 0 },
      { a: 0, b: 1, out: 0 },
      { a: 1, b: 0, out: 0 },
      { a: 1, b: 1, out: 1 }
    ],
    OR: [
      { a: 0, b: 0, out: 0 },
      { a: 0, b: 1, out: 1 },
      { a: 1, b: 0, out: 1 },
      { a: 1, b: 1, out: 1 }
    ],
    XOR: [
      { a: 0, b: 0, out: 0 },
      { a: 0, b: 1, out: 1 },
      { a: 1, b: 0, out: 1 },
      { a: 1, b: 1, out: 0 }
    ]
  };

  // SVG Gate Path Definitions (Standard IEEE Logic Symbols)
  const gatePaths = {
    // AND Gate: Flat back, curved front
    AND: 'M 90 40 L 130 40 A 30 30 0 0 1 130 100 L 90 100 Z',
    // OR Gate: Curved back, pointed front
    OR: 'M 85 40 Q 110 70 85 100 Q 135 100 160 70 Q 135 40 85 40 Z',
    // XOR Gate: Curved back with extra input curve, pointed front
    XOR: 'M 95 40 Q 120 70 95 100 Q 140 100 160 70 Q 140 40 95 40 Z'
  };

  // Logic calculation
  function evaluateLogic(a, b, gate) {
    if (gate === 'AND') return (a && b) ? 1 : 0;
    if (gate === 'OR') return (a || b) ? 1 : 0;
    if (gate === 'XOR') return (a !== b) ? 1 : 0;
    return 0;
  }

  // Update simulator UI
  function updateSimulator() {
    const result = evaluateLogic(stateA, stateB, currentGate);

    // Update Input Button UI
    if (valDisplayA) valDisplayA.textContent = stateA;
    if (valDisplayB) valDisplayB.textContent = stateB;

    if (stateA === 1) {
      btnToggleA.classList.add('state-high');
      if (wireA) wireA.classList.add('wire-active');
    } else {
      btnToggleA.classList.remove('state-high');
      if (wireA) wireA.classList.remove('wire-active');
    }

    if (stateB === 1) {
      btnToggleB.classList.add('state-high');
      if (wireB) wireB.classList.add('wire-active');
    } else {
      btnToggleB.classList.remove('state-high');
      if (wireB) wireB.classList.remove('wire-active');
    }

    // Update Gate Body & Symbol
    if (gateBody && gatePaths[currentGate]) {
      gateBody.setAttribute('d', gatePaths[currentGate]);
      if (result === 1) {
        gateBody.classList.add('gate-active');
      } else {
        gateBody.classList.remove('gate-active');
      }
    }

    // Toggle XOR back curve
    if (xorBackCurve) {
      if (currentGate === 'XOR') {
        xorBackCurve.classList.remove('hidden');
        if (stateA === 1 || stateB === 1) {
          xorBackCurve.classList.add('wire-active');
        } else {
          xorBackCurve.classList.remove('wire-active');
        }
      } else {
        xorBackCurve.classList.add('hidden');
      }
    }

    // Update Output Wire & Orb
    if (outputValDisplay) outputValDisplay.textContent = result;

    if (result === 1) {
      if (wireOut) wireOut.classList.add('wire-active');
      outputOrb.classList.add('output-high');
      outputOrb.setAttribute('aria-label', `Output HIGH (1) for ${currentGate} gate`);
    } else {
      if (wireOut) wireOut.classList.remove('wire-active');
      outputOrb.classList.remove('output-high');
      outputOrb.setAttribute('aria-label', `Output LOW (0) for ${currentGate} gate`);
    }

    // Update Meta info
    if (gateNameDisplay) gateNameDisplay.textContent = currentGate;
    if (gateFormulaDisplay) {
      if (currentGate === 'AND') gateFormulaDisplay.textContent = 'Q = A · B  (A AND B)';
      if (currentGate === 'OR') gateFormulaDisplay.textContent = 'Q = A + B  (A OR B)';
      if (currentGate === 'XOR') gateFormulaDisplay.textContent = 'Q = A ⊕ B  (A XOR B)';
    }

    // Rebuild and highlight Truth Table
    renderTruthTable(currentGate, stateA, stateB);
  }

  function renderTruthTable(gate, curA, curB) {
    if (!truthTableBody) return;
    const tableData = truthTables[gate];
    truthTableBody.innerHTML = '';

    tableData.forEach((row) => {
      const isCurrent = (row.a === curA && row.b === curB);
      const tr = document.createElement('tr');
      if (isCurrent) {
        tr.className = 'current-eval';
      }

      tr.innerHTML = `
        <td><span class="font-mono ${row.a === 1 ? 'text-cyan-400 font-bold' : 'text-slate-400'}">${row.a}</span></td>
        <td><span class="font-mono ${row.b === 1 ? 'text-cyan-400 font-bold' : 'text-slate-400'}">${row.b}</span></td>
        <td><span class="font-mono ${row.out === 1 ? 'text-amber-400 font-bold' : 'text-slate-500'}">${row.out}</span></td>
      `;
      truthTableBody.appendChild(tr);
    });
  }

  // Event Listeners for Input Toggles
  btnToggleA.addEventListener('click', () => {
    stateA = stateA === 1 ? 0 : 1;
    btnToggleA.setAttribute('aria-pressed', stateA === 1 ? 'true' : 'false');
    updateSimulator();
  });

  btnToggleB.addEventListener('click', () => {
    stateB = stateB === 1 ? 0 : 1;
    btnToggleB.setAttribute('aria-pressed', stateB === 1 ? 'true' : 'false');
    updateSimulator();
  });

  // Gate Selector Tabs
  gateTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      gateTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      currentGate = tab.getAttribute('data-gate');
      updateSimulator();
    });
  });

  // Initial render
  updateSimulator();
})();

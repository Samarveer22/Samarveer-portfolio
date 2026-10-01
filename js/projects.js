/**
 * Featured Project Concepts, 3D Tilt Cards, Filtering & Modal Dialog
 * For: Samarveer Singh Mertia Portfolio
 */

(function () {
  'use strict';

  // Project Concepts Data (Strictly factual & honest)
  const projectsData = [
    {
      id: 'proj-01',
      number: 'CONCEPT 01',
      title: 'Smart Embedded Sensor System',
      category: 'Embedded Systems & Hardware',
      filterTags: ['hardware', 'embedded', 'software'],
      tech: ['Arduino / ESP32', 'Sensors', 'C/C++', 'Serial Comm', 'Embedded Systems'],
      status: 'Planned / Learning',
      statusClass: 'planned',
      shortDesc: 'An Arduino/ESP32-based embedded hardware system designed for collecting analog/digital environmental sensor telemetry and serial data communication.',
      objective: 'To design and implement a sensor telemetry node that reads analog/digital sensor outputs, filters environmental noise, and transmits formatted packets via serial communication.',
      concept: 'The system pairs microcontrollers (such as ESP32 or Arduino) with various sensor modules (temperature, ultrasonic, analog resistive transducers) to study real-time data acquisition, register-level I/O configuration, and embedded C firmware structure.',
      learningOutcomes: [
        'Interfacing peripheral hardware via GPIO, I2C, and UART protocols',
        'Writing modular, memory-efficient firmware in C/C++',
        'Understanding analog-to-digital converter (ADC) sampling and signal conditioning',
        'Debugging embedded hardware circuitry using breadboards and multimeters'
      ],
      futureImprovements: [
        'Incorporating low-power sleep modes for battery efficiency',
        'Implementing wireless telemetry (BLE / Wi-Fi UDP stream)',
        'Designing a dedicated printed circuit board (PCB) schematic'
      ],
      repoStatus: 'Repository — Coming Soon'
    },
    {
      id: 'proj-02',
      number: 'CONCEPT 02',
      title: 'Digital Logic Gate & Circuit Simulator',
      category: 'Digital Logic & Software',
      filterTags: ['digital-logic', 'software'],
      tech: ['Python', 'Boolean Logic', 'Digital Electronics', 'Algorithms', 'CLI & GUI'],
      status: 'Planned / Learning',
      statusClass: 'planned',
      shortDesc: 'A Python-based simulation engine for modeling combinatorial logic networks, truth-table generation, and timing state evaluations.',
      objective: 'To build a software-based logic synthesizer and evaluator in Python capable of taking arbitrary Boolean expressions or gate netlists and calculating propagation outputs.',
      concept: 'Utilizes graph algorithms where nodes represent standard logic gates (AND, OR, NOT, XOR, NAND, NOR) and directed edges model copper traces. Evaluates logic states hierarchically from inputs to outputs with truth-table synthesis.',
      learningOutcomes: [
        'Bridging pure Boolean algebra theorems with programmatic graph evaluations',
        'Deepening understanding of combinational logic design and timing verification',
        'Structuring scalable Python classes for circuit netlists',
        'Preparing foundational algorithms for eventual Verilog/VHDL parser studies'
      ],
      futureImprovements: [
        'Adding sequential logic support (Flip-flops, latches, clock dividers)',
        'Exporting simulated gate graphs to standard EDA netlist formats',
        'Developing a graphical user interface with visual drag-and-drop wire snapping'
      ],
      repoStatus: 'Repository — Coming Soon'
    },
    {
      id: 'proj-03',
      number: 'CONCEPT 03',
      title: 'Amplifier & Frequency Response Analysis',
      category: 'Analog Electronics & Simulation',
      filterTags: ['ltspice', 'hardware'],
      tech: ['LTspice', 'Circuit Analysis', 'AC Analysis', 'Frequency Response', 'BJT/FET Models'],
      status: 'Planned / Learning',
      statusClass: 'planned',
      shortDesc: 'An LTspice circuit exploration modeling transistor biasing, small-signal AC gain, cutoff frequencies, and Bode plot characteristics.',
      objective: 'To simulate and analyze common-emitter and operational amplifier circuits in LTspice, examining how active and passive components govern bandwidth, phase margin, and stability.',
      concept: 'Through systematic SPICE simulations, this project examines DC operating point bias stability, small-signal AC frequency response, and transient step responses for discrete transistor amplifier stages.',
      learningOutcomes: [
        'Mastering SPICE netlist syntax and GUI schematic capture in LTspice',
        'Analyzing upper and lower -3dB cutoff frequencies influenced by parasitic and coupling capacitances',
        'Correlating theoretical manual calculations with simulation Bode plot curves',
        'Evaluating harmonic distortion and gain-bandwidth product limitations'
      ],
      futureImprovements: [
        'Simulating complementary metal-oxide-semiconductor (CMOS) differential pairs',
        'Physical breadboard assembly and oscilloscope measurement cross-verification',
        'Investigating thermal sensitivity and noise figure performance'
      ],
      repoStatus: 'Repository — Coming Soon'
    }
  ];

  // DOM Containers
  const gridContainer = document.getElementById('projects-grid');
  const filterButtons = document.querySelectorAll('.project-category-btn');
  const modal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  // Modal Fields
  const modalNum = document.getElementById('modal-proj-num');
  const modalTitle = document.getElementById('modal-proj-title');
  const modalCategory = document.getElementById('modal-proj-category');
  const modalStatus = document.getElementById('modal-proj-status');
  const modalObjective = document.getElementById('modal-proj-objective');
  const modalConcept = document.getElementById('modal-proj-concept');
  const modalTechList = document.getElementById('modal-proj-tech');
  const modalOutcomes = document.getElementById('modal-proj-outcomes');
  const modalImprovements = document.getElementById('modal-proj-improvements');
  const modalRepoText = document.getElementById('modal-proj-repo-status');

  if (!gridContainer) return;

  // Render Project Cards
  function renderProjects(filter = 'all') {
    gridContainer.innerHTML = '';

    const filtered = projectsData.filter((p) => {
      if (filter === 'all') return true;
      return p.filterTags.includes(filter);
    });

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div class="col-span-full py-12 text-center text-slate-400 font-mono">
          No project concepts found for this filter category.
        </div>
      `;
      return;
    }

    filtered.forEach((project) => {
      const card = document.createElement('article');
      card.className = 'glass-panel p-6 sm:p-8 tilt-card flex flex-col justify-between relative overflow-hidden group';
      card.setAttribute('data-id', project.id);

      const techBadgesHtml = project.tech
        .map(t => `<span class="px-2.5 py-1 text-xs font-mono rounded bg-slate-800/80 border border-slate-700/50 text-cyan-300">${t}</span>`)
        .join('');

      card.innerHTML = `
        <div class="tilt-card-content">
          <div class="flex items-center justify-between mb-4">
            <span class="font-mono text-xs font-bold tracking-widest text-cyan-400">${project.number}</span>
            <span class="status-badge ${project.statusClass}">
              ${project.status}
            </span>
          </div>

          <p class="font-mono text-xs text-amber-400/90 tracking-wide uppercase mb-1">${project.category}</p>
          <h3 class="text-xl sm:text-2xl font-bold font-display text-white mb-3 group-hover:text-cyan-300 transition-colors">
            ${project.title}
          </h3>

          <p class="text-slate-300 text-sm leading-relaxed mb-6">
            ${project.shortDesc}
          </p>

          <div class="flex flex-wrap gap-1.5 mb-8">
            ${techBadgesHtml}
          </div>
        </div>

        <div class="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 tilt-card-content">
          <span class="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            ${project.repoStatus}
          </span>

          <button type="button" class="view-details-btn inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-semibold rounded-lg bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all" data-id="${project.id}">
            View Details
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      `;

      gridContainer.appendChild(card);
    });

    attachTiltEffects();
    attachDetailsListeners();
  }

  // 3D Tilt Effect on mouse movement
  function attachTiltEffects() {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion || window.innerWidth < 1024) return;

    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -9;
        const rotateY = ((x - centerX) / centerX) * 9;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  // Modal Open / Close logic
  function openModal(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project || !modal) return;

    modalNum.textContent = project.number;
    modalTitle.textContent = project.title;
    modalCategory.textContent = project.category;
    modalStatus.textContent = project.status;
    modalObjective.textContent = project.objective;
    modalConcept.textContent = project.concept;
    modalRepoText.textContent = project.repoStatus;

    // Tech List
    modalTechList.innerHTML = project.tech
      .map(t => `<li class="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 text-cyan-300 border border-slate-700">${t}</li>`)
      .join('');

    // Learning outcomes
    modalOutcomes.innerHTML = project.learningOutcomes
      .map(o => `<li class="flex items-start gap-2 text-sm text-slate-300"><span class="text-cyan-400 font-bold">›</span> <span>${o}</span></li>`)
      .join('');

    // Future improvements
    modalImprovements.innerHTML = project.futureImprovements
      .map(i => `<li class="flex items-start gap-2 text-sm text-slate-300"><span class="text-amber-400 font-bold">›</span> <span>${i}</span></li>`)
      .join('');

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    modalCloseBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function attachDetailsListeners() {
    const buttons = document.querySelectorAll('.view-details-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        openModal(id);
      });
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  // Filter button handlers
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      const filter = btn.getAttribute('data-filter');
      renderProjects(filter);
    });
  });

  // Initial render
  renderProjects('all');
})();

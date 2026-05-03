/**
 * ==============================================
 * MAIN.JS - Application Controller & Animation Engine
 * CPU Scheduling Visualizer | BCSE303L | 23BDS0017
 * ==============================================
 * 
 * Central controller that manages:
 * - UI interactions and event listeners
 * - Animation state and frame-by-frame rendering
 * - Process management and scheduling
 * - Statistics calculation and display
 * - Export functionality
 */

// ============================================
// APPLICATION STATE
// ============================================

const AppState = {
    processes: [],
    schedule: [],
    currentFrame: -1,
    isPlaying: false,
    animationSpeed: 5,
    processColors: {},
    statistics: null,
    quantum: 2,
    selectedAlgorithm: 'fcfs',
    animationInterval: null
};

// ============================================
// DOM ELEMENTS
// ============================================

const DOM = {
    // Inputs
    algorithm: null,
    quantum: null,
    quantumGroup: null,
    processId: null,
    arrivalTime: null,
    burstTime: null,
    priority: null,
    priorityGroup: null,
    
    // Buttons
    addProcess: null,
    clearProcesses: null,
    loadSample: null,
    play: null,
    pause: null,
    stepForward: null,
    stepBackward: null,
    reset: null,
    exportScreenshot: null,
    exportTrace: null,
    
    // Controls
    speed: null,
    speedValue: null,
    timeline: null,
    timelineValue: null,
    
    // Display
    processList: null,
    processCount: null,
    ganttCanvas: null,
    ctx: null,
    statsTable: null,
    currentTime: null,
    currentProcess: null,
    readyQueue: null,
    colorLegend: null
};

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize the application
 */
function initApp() {
    // Get DOM elements
    cacheDOMElements();
    
    // Setup canvas
    setupCanvas();
    
    // Attach event listeners
    attachEventListeners();
    
    // Load default settings
    updateQuantumVisibility();
    updatePriorityVisibility();
    
    // Generate initial process ID
    generateNextProcessId();
    
    console.log('CPU Scheduling Visualizer initialized');
}

/**
 * Cache all DOM elements for performance
 */
function cacheDOMElements() {
    // Inputs
    DOM.algorithm = document.getElementById('algorithm');
    DOM.quantum = document.getElementById('quantum');
    DOM.quantumGroup = document.getElementById('quantum-group');
    DOM.processId = document.getElementById('processId');
    DOM.arrivalTime = document.getElementById('arrivalTime');
    DOM.burstTime = document.getElementById('burstTime');
    DOM.priority = document.getElementById('priority');
    DOM.priorityGroup = document.getElementById('priority-group');
    
    // Buttons
    DOM.addProcess = document.getElementById('addProcess');
    DOM.clearProcesses = document.getElementById('clearProcesses');
    DOM.loadSample = document.getElementById('loadSample');
    DOM.play = document.getElementById('play');
    DOM.pause = document.getElementById('pause');
    DOM.stepForward = document.getElementById('stepForward');
    DOM.stepBackward = document.getElementById('stepBackward');
    DOM.reset = document.getElementById('reset');
    DOM.exportScreenshot = document.getElementById('exportScreenshot');
    DOM.exportTrace = document.getElementById('exportTrace');
    
    // Controls
    DOM.speed = document.getElementById('speed');
    DOM.speedValue = document.getElementById('speedValue');
    DOM.timeline = document.getElementById('timeline');
    DOM.timelineValue = document.getElementById('timelineValue');
    
    // Display
    DOM.processList = document.getElementById('processList');
    DOM.processCount = document.getElementById('processCount');
    DOM.ganttCanvas = document.getElementById('ganttCanvas');
    DOM.ctx = DOM.ganttCanvas.getContext('2d');
    DOM.statsTable = document.getElementById('statsTable');
    DOM.currentTime = document.getElementById('currentTime');
    DOM.currentProcess = document.getElementById('currentProcess');
    DOM.readyQueue = document.getElementById('readyQueue');
    DOM.colorLegend = document.getElementById('colorLegend');
}

/**
 * Setup canvas dimensions
 */
function setupCanvas() {
    const container = DOM.ganttCanvas.parentElement;
    DOM.ganttCanvas.width = container.clientWidth - 20;
    DOM.ganttCanvas.height = 380;
}

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Attach all event listeners
 */
function attachEventListeners() {
    // Algorithm change
    DOM.algorithm.addEventListener('change', handleAlgorithmChange);
    
    // Process management
    DOM.addProcess.addEventListener('click', handleAddProcess);
    DOM.clearProcesses.addEventListener('click', handleClearProcesses);
    DOM.loadSample.addEventListener('click', handleLoadSample);
    
    // Animation controls
    DOM.play.addEventListener('click', handlePlay);
    DOM.pause.addEventListener('click', handlePause);
    DOM.stepForward.addEventListener('click', () => stepFrame(1));
    DOM.stepBackward.addEventListener('click', () => stepFrame(-1));
    DOM.reset.addEventListener('click', handleReset);
    
    // Speed control
    DOM.speed.addEventListener('input', handleSpeedChange);
    
    // Timeline control
    DOM.timeline.addEventListener('input', handleTimelineChange);
    
    // Export
    DOM.exportScreenshot.addEventListener('click', handleExportScreenshot);
    DOM.exportTrace.addEventListener('click', handleExportTrace);
    
    // Enter key on inputs
    [DOM.processId, DOM.arrivalTime, DOM.burstTime, DOM.priority].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAddProcess();
        });
    });
    
    // Window resize
    window.addEventListener('resize', debounce(() => {
        setupCanvas();
        render();
    }, 250));
}

// ============================================
// EVENT HANDLERS
// ============================================

/**
 * Handle algorithm selection change
 */
function handleAlgorithmChange() {
    AppState.selectedAlgorithm = DOM.algorithm.value;
    updateQuantumVisibility();
    updatePriorityVisibility();
    
    // Reset animation if schedule exists
    if (AppState.schedule.length > 0) {
        handleReset();
        runScheduling();
    }
}

/**
 * Update quantum input visibility
 */
function updateQuantumVisibility() {
    DOM.quantumGroup.style.display = 
        AppState.selectedAlgorithm === 'rr' ? 'block' : 'none';
}

/**
 * Update priority input visibility
 */
function updatePriorityVisibility() {
    DOM.priorityGroup.style.display = 
        AppState.selectedAlgorithm === 'priority' ? 'block' : 'none';
}

/**
 * Handle add process
 */
function handleAddProcess() {
    const id = DOM.processId.value.trim();
    const arrivalTime = parseInt(DOM.arrivalTime.value);
    const burstTime = parseInt(DOM.burstTime.value);
    const priority = parseInt(DOM.priority.value);
    
    // Validate
    const validation = validateProcess(id, arrivalTime, burstTime, priority);
    if (!validation.valid) {
        showToast(validation.errors.join(', '), 'error');
        return;
    }
    
    // Check duplicate ID
    if (AppState.processes.some(p => p.id === id)) {
        showToast('Process ID already exists', 'error');
        return;
    }
    
    // Add process
    const process = {
        id,
        arrivalTime,
        burstTime,
        priority: AppState.selectedAlgorithm === 'priority' ? priority : undefined
    };
    
    AppState.processes.push(process);
    
    // Assign color
    if (!AppState.processColors[id]) {
        const colors = generateColors(AppState.processes.length);
        AppState.processes.forEach((p, i) => {
            if (!AppState.processColors[p.id]) {
                AppState.processColors[p.id] = colors[i];
            }
        });
    }
    
    // Update UI
    renderProcessList();
    updateColorLegend();
    
    // Clear inputs and generate next ID
    DOM.arrivalTime.value = arrivalTime;
    DOM.burstTime.value = 1;
    DOM.priority.value = 1;
    generateNextProcessId();
    
    showToast(`Process ${id} added successfully`, 'success');
    
    // Auto-run if already scheduled
    if (AppState.schedule.length > 0) {
        handleReset();
        runScheduling();
    }
}

/**
 * Handle clear all processes
 */
function handleClearProcesses() {
    if (AppState.processes.length === 0) {
        showToast('No processes to clear', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear all processes?')) {
        AppState.processes = [];
        AppState.schedule = [];
        AppState.processColors = {};
        AppState.statistics = null;
        AppState.currentFrame = -1;
        
        stopAnimation();
        renderProcessList();
        updateColorLegend();
        render();
        clearStatistics();
        
        generateNextProcessId();
        showToast('All processes cleared', 'info');
    }
}

/**
 * Handle load sample data
 */
function handleLoadSample() {
    const sampleProcesses = generateSampleProcesses();
    
    AppState.processes = sampleProcesses;
    
    // Generate colors
    const colors = generateColors(AppState.processes.length);
    AppState.processes.forEach((p, i) => {
        AppState.processColors[p.id] = colors[i];
    });
    
    renderProcessList();
    updateColorLegend();
    
    showToast('Sample processes loaded', 'success');
    
    // Auto-run scheduling
    setTimeout(() => {
        runScheduling();
        handlePlay();
    }, 500);
}

/**
 * Handle play animation
 */
function handlePlay() {
    if (AppState.processes.length === 0) {
        showToast('Add processes first', 'error');
        return;
    }
    
    // Run scheduling if not done
    if (AppState.schedule.length === 0) {
        runScheduling();
    }
    
    if (AppState.currentFrame >= AppState.schedule.length - 1) {
        AppState.currentFrame = -1;
    }
    
    startAnimation();
    
    DOM.play.style.display = 'none';
    DOM.pause.style.display = 'inline-flex';
}

/**
 * Handle pause animation
 */
function handlePause() {
    stopAnimation();
    DOM.play.style.display = 'inline-flex';
    DOM.pause.style.display = 'none';
}

/**
 * Handle reset
 */
function handleReset() {
    stopAnimation();
    AppState.currentFrame = -1;
    DOM.timeline.value = 0;
    DOM.timelineValue.textContent = '0';
    render();
    
    DOM.play.style.display = 'inline-flex';
    DOM.pause.style.display = 'none';
}

/**
 * Handle speed change
 */
function handleSpeedChange() {
    AppState.animationSpeed = parseInt(DOM.speed.value);
    DOM.speedValue.textContent = `${AppState.animationSpeed}x`;
    
    // Restart animation if playing
    if (AppState.isPlaying) {
        stopAnimation();
        startAnimation();
    }
}

/**
 * Handle timeline scrubber change
 */
function handleTimelineChange() {
    const frame = parseInt(DOM.timeline.value);
    AppState.currentFrame = frame;
    DOM.timelineValue.textContent = frame;
    render();
}

/**
 * Handle export screenshot
 */
function handleExportScreenshot() {
    if (AppState.schedule.length === 0) {
        showToast('No chart to export', 'error');
        return;
    }
    
    exportCanvasAsImage(
        DOM.ganttCanvas,
        `gantt-${AppState.selectedAlgorithm}-${Date.now()}.png`
    );
    showToast('Screenshot exported', 'success');
}

/**
 * Handle export trace
 */
function handleExportTrace() {
    if (!AppState.statistics || AppState.schedule.length === 0) {
        showToast('No data to export', 'error');
        return;
    }
    
    exportTrace(
        AppState.statistics,
        AppState.schedule,
        getAlgorithmName(AppState.selectedAlgorithm),
        AppState.selectedAlgorithm === 'rr' ? AppState.quantum : null
    );
    showToast('Trace exported', 'success');
}

// ============================================
// SCHEDULING & ANIMATION
// ============================================

/**
 * Run the selected scheduling algorithm
 */
function runScheduling() {
    if (AppState.processes.length === 0) {
        return;
    }
    
    // Get quantum for RR
    AppState.quantum = parseInt(DOM.quantum.value) || 2;
    
    // Execute algorithm
    AppState.schedule = executeScheduling(
        AppState.selectedAlgorithm,
        AppState.processes,
        AppState.quantum
    );
    
    // Calculate statistics
    AppState.statistics = calculateStatistics(AppState.processes, AppState.schedule);
    
    // Update UI
    renderStatistics();
    
    // Setup timeline
    DOM.timeline.max = AppState.schedule.length - 1;
    DOM.timeline.value = 0;
    
    // Render
    render();
}

/**
 * Start animation loop
 */
function startAnimation() {
    stopAnimation(); // Clear any existing interval
    
    AppState.isPlaying = true;
    
    const baseDelay = 1000; // 1 second base
    const delay = baseDelay / AppState.animationSpeed;
    
    AppState.animationInterval = setInterval(() => {
        if (AppState.currentFrame >= AppState.schedule.length - 1) {
            stopAnimation();
            DOM.play.style.display = 'inline-flex';
            DOM.pause.style.display = 'none';
            return;
        }
        
        stepFrame(1);
    }, delay);
}

/**
 * Stop animation
 */
function stopAnimation() {
    if (AppState.animationInterval) {
        clearInterval(AppState.animationInterval);
        AppState.animationInterval = null;
    }
    AppState.isPlaying = false;
}

/**
 * Step animation frame
 * @param {number} direction - 1 for forward, -1 for backward
 */
function stepFrame(direction) {
    const newFrame = AppState.currentFrame + direction;
    
    if (newFrame < 0 || newFrame >= AppState.schedule.length) {
        return;
    }
    
    AppState.currentFrame = newFrame;
    DOM.timeline.value = newFrame;
    DOM.timelineValue.textContent = newFrame;
    
    render();
}

// ============================================
// RENDERING
// ============================================

/**
 * Main render function
 */
function render() {
    // Render Gantt chart
    drawGanttChart(
        DOM.ctx,
        AppState.schedule,
        AppState.processColors,
        AppState.currentFrame
    );
    
    // Update status display
    updateStatus();
}

/**
 * Update status panel
 */
function updateStatus() {
    if (AppState.currentFrame < 0 || AppState.schedule.length === 0) {
        DOM.currentTime.textContent = '0';
        DOM.currentProcess.textContent = 'None';
        DOM.readyQueue.textContent = '[]';
        return;
    }
    
    const currentSlot = AppState.schedule[AppState.currentFrame];
    
    DOM.currentTime.textContent = currentSlot.start;
    DOM.currentProcess.textContent = currentSlot.process;
    
    // Calculate ready queue
    const queue = getReadyQueueAtTime(
        AppState.processes,
        AppState.schedule,
        currentSlot.start,
        AppState.selectedAlgorithm
    );
    DOM.readyQueue.textContent = `[${queue.join(', ')}]`;
}

/**
 * Render process list
 */
function renderProcessList() {
    DOM.processCount.textContent = AppState.processes.length;
    
    if (AppState.processes.length === 0) {
        DOM.processList.innerHTML = '<p style="text-align: center; color: #64748b; padding: 20px;">No processes added</p>';
        return;
    }
    
    DOM.processList.innerHTML = AppState.processes
        .map(p => `
            <div class="process-item" style="border-left-color: ${AppState.processColors[p.id]}">
                <div class="process-info">
                    <span><strong>ID:</strong> ${p.id}</span>
                    <span><strong>AT:</strong> ${p.arrivalTime}</span>
                    <span><strong>BT:</strong> ${p.burstTime}</span>
                    ${p.priority !== undefined ? `<span><strong>Priority:</strong> ${p.priority}</span>` : ''}
                </div>
                <button class="btn-remove" onclick="removeProcess('${p.id}')">✕</button>
            </div>
        `)
        .join('');
}

/**
 * Render statistics table
 */
function renderStatistics() {
    if (!AppState.statistics || AppState.statistics.processes.length === 0) {
        DOM.statsTable.innerHTML = '<p style="color: #64748b;">No statistics available</p>';
        return;
    }
    
    const stats = AppState.statistics;
    
    let html = '<table class="stats-table">';
    html += '<thead><tr>';
    html += '<th>Process</th>';
    html += '<th>Arrival Time</th>';
    html += '<th>Burst Time</th>';
    html += '<th>Completion Time</th>';
    html += '<th>Turnaround Time</th>';
    html += '<th>Waiting Time</th>';
    html += '</tr></thead>';
    html += '<tbody>';
    
    stats.processes.forEach(p => {
        html += `<tr>
            <td><strong>${p.id}</strong></td>
            <td>${p.arrivalTime}</td>
            <td>${p.burstTime}</td>
            <td>${p.completionTime}</td>
            <td>${p.turnaroundTime}</td>
            <td>${p.waitingTime}</td>
        </tr>`;
    });
    
    html += `<tr class="avg-row">
        <td colspan="4"><strong>Average</strong></td>
        <td><strong>${stats.avgTAT}</strong></td>
        <td><strong>${stats.avgWT}</strong></td>
    </tr>`;
    
    html += '</tbody></table>';
    
    DOM.statsTable.innerHTML = html;
}

/**
 * Clear statistics display
 */
function clearStatistics() {
    DOM.statsTable.innerHTML = '<p style="color: #64748b;">Run scheduling to see statistics</p>';
}

/**
 * Update color legend
 */
function updateColorLegend() {
    if (AppState.processes.length === 0) {
        DOM.colorLegend.innerHTML = '<p style="color: #64748b;">No processes to display</p>';
        return;
    }
    
    DOM.colorLegend.innerHTML = AppState.processes
        .map(p => `
            <div class="legend-item">
                <div class="legend-color" style="background: ${AppState.processColors[p.id]}"></div>
                <span class="legend-label">${p.id}</span>
            </div>
        `)
        .join('');
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate next process ID
 */
function generateNextProcessId() {
    const lastNum = AppState.processes.length > 0
        ? Math.max(...AppState.processes.map(p => {
            const match = p.id.match(/\d+/);
            return match ? parseInt(match[0]) : 0;
        }))
        : 0;
    
    DOM.processId.value = `P${lastNum + 1}`;
}

/**
 * Remove a process
 * @param {string} id - Process ID to remove
 */
function removeProcess(id) {
    const index = AppState.processes.findIndex(p => p.id === id);
    if (index !== -1) {
        AppState.processes.splice(index, 1);
        delete AppState.processColors[id];
        
        // Reset animation
        AppState.schedule = [];
        AppState.currentFrame = -1;
        AppState.statistics = null;
        
        stopAnimation();
        renderProcessList();
        updateColorLegend();
        render();
        clearStatistics();
        
        showToast(`Process ${id} removed`, 'info');
    }
}

/**
 * Debounce function for performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
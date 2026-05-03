/**
 * ==============================================
 * ALGORITHMS.JS - CPU Scheduling Algorithms
 * CPU Scheduling Visualizer | BCSE303L | 23BDS0017
 * ==============================================
 * 
 * Implements the following scheduling algorithms:
 * 1. First Come First Serve (FCFS)
 * 2. Shortest Job First (SJF) - Non-preemptive
 * 3. Round Robin (RR)
 * 4. Priority Scheduling - Non-preemptive
 * 
 * Each function returns a Gantt chart schedule
 * Format: [{ process: 'P1', start: 0, end: 5 }, ...]
 */

// ============================================
// 1. FIRST COME FIRST SERVE (FCFS)
// ============================================

/**
 * FCFS Scheduling Algorithm
 * Processes are executed in order of arrival time
 * Non-preemptive
 * 
 * @param {Array} processes - Array of process objects
 * @returns {Array} Gantt chart schedule
 */
function fcfsScheduling(processes) {
    if (!processes || processes.length === 0) {
        return [];
    }
    
    // Sort processes by arrival time
    const sortedProcesses = [...processes].sort((a, b) => 
        a.arrivalTime - b.arrivalTime || a.id.localeCompare(b.id)
    );
    
    const schedule = [];
    let currentTime = 0;
    
    sortedProcesses.forEach(process => {
        // If CPU is idle, add idle time
        if (currentTime < process.arrivalTime) {
            schedule.push({
                process: 'IDLE',
                start: currentTime,
                end: process.arrivalTime
            });
            currentTime = process.arrivalTime;
        }
        
        // Execute process
        schedule.push({
            process: process.id,
            start: currentTime,
            end: currentTime + process.burstTime
        });
        
        currentTime += process.burstTime;
    });
    
    return schedule;
}

// ============================================
// 2. SHORTEST JOB FIRST (SJF)
// ============================================

/**
 * SJF Scheduling Algorithm (Non-preemptive)
 * At each decision point, select process with shortest burst time
 * among all processes that have arrived
 * 
 * @param {Array} processes - Array of process objects
 * @returns {Array} Gantt chart schedule
 */
function sjfScheduling(processes) {
    if (!processes || processes.length === 0) {
        return [];
    }
    
    const schedule = [];
    const remainingProcesses = processes.map(p => ({ ...p }));
    let currentTime = 0;
    let completed = 0;
    const n = processes.length;
    
    while (completed < n) {
        // Find all processes that have arrived
        const available = remainingProcesses.filter(p => 
            p.arrivalTime <= currentTime && p.burstTime > 0
        );
        
        if (available.length === 0) {
            // CPU is idle - jump to next arrival
            const nextArrival = Math.min(
                ...remainingProcesses
                    .filter(p => p.burstTime > 0)
                    .map(p => p.arrivalTime)
            );
            
            if (nextArrival > currentTime) {
                schedule.push({
                    process: 'IDLE',
                    start: currentTime,
                    end: nextArrival
                });
                currentTime = nextArrival;
            }
            continue;
        }
        
        // Select process with shortest burst time
        available.sort((a, b) => 
            a.burstTime - b.burstTime || 
            a.arrivalTime - b.arrivalTime ||
            a.id.localeCompare(b.id)
        );
        
        const selectedProcess = available[0];
        
        // Execute the process completely (non-preemptive)
        schedule.push({
            process: selectedProcess.id,
            start: currentTime,
            end: currentTime + selectedProcess.burstTime
        });
        
        currentTime += selectedProcess.burstTime;
        
        // Mark process as completed
        const index = remainingProcesses.findIndex(p => p.id === selectedProcess.id);
        remainingProcesses[index].burstTime = 0;
        completed++;
    }
    
    return schedule;
}

// ============================================
// 3. ROUND ROBIN (RR)
// ============================================

/**
 * Round Robin Scheduling Algorithm
 * Each process gets a time quantum in circular order
 * Preemptive
 * 
 * @param {Array} processes - Array of process objects
 * @param {number} quantum - Time quantum
 * @returns {Array} Gantt chart schedule
 */
function roundRobinScheduling(processes, quantum = 2) {
    if (!processes || processes.length === 0) {
        return [];
    }
    
    if (quantum <= 0) {
        quantum = 2; // Default
    }
    
    const schedule = [];
    const readyQueue = [];
    
    // Create working copy with remaining time
    const processList = processes.map(p => ({
        ...p,
        remainingTime: p.burstTime,
        inQueue: false
    }));
    
    let currentTime = 0;
    let completed = 0;
    const n = processes.length;
    
    // Add processes that arrive at time 0
    processList.forEach(p => {
        if (p.arrivalTime === 0) {
            readyQueue.push(p);
            p.inQueue = true;
        }
    });
    
    while (completed < n) {
        if (readyQueue.length === 0) {
            // CPU idle - jump to next arrival
            const nextProcess = processList
                .filter(p => p.remainingTime > 0 && !p.inQueue)
                .sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
            
            if (nextProcess) {
                schedule.push({
                    process: 'IDLE',
                    start: currentTime,
                    end: nextProcess.arrivalTime
                });
                currentTime = nextProcess.arrivalTime;
                readyQueue.push(nextProcess);
                nextProcess.inQueue = true;
            }
            continue;
        }
        
        // Get next process from queue
        const currentProcess = readyQueue.shift();
        currentProcess.inQueue = false;
        
        // Execute for quantum time or remaining time (whichever is smaller)
        const executionTime = Math.min(quantum, currentProcess.remainingTime);
        
        schedule.push({
            process: currentProcess.id,
            start: currentTime,
            end: currentTime + executionTime
        });
        
        currentTime += executionTime;
        currentProcess.remainingTime -= executionTime;
        
        // Add newly arrived processes to queue
        processList.forEach(p => {
            if (p.arrivalTime <= currentTime && 
                p.remainingTime > 0 && 
                !p.inQueue && 
                p.id !== currentProcess.id) {
                readyQueue.push(p);
                p.inQueue = true;
            }
        });
        
        // If current process is not finished, add it back to queue
        if (currentProcess.remainingTime > 0) {
            readyQueue.push(currentProcess);
            currentProcess.inQueue = true;
        } else {
            completed++;
        }
    }
    
    return schedule;
}

// ============================================
// 4. PRIORITY SCHEDULING
// ============================================

/**
 * Priority Scheduling Algorithm (Non-preemptive)
 * Lower priority number = Higher priority
 * At each decision point, select highest priority process
 * 
 * @param {Array} processes - Array of process objects
 * @returns {Array} Gantt chart schedule
 */
function priorityScheduling(processes) {
    if (!processes || processes.length === 0) {
        return [];
    }
    
    const schedule = [];
    const remainingProcesses = processes.map(p => ({ ...p }));
    let currentTime = 0;
    let completed = 0;
    const n = processes.length;
    
    while (completed < n) {
        // Find all processes that have arrived
        const available = remainingProcesses.filter(p => 
            p.arrivalTime <= currentTime && p.burstTime > 0
        );
        
        if (available.length === 0) {
            // CPU is idle - jump to next arrival
            const nextArrival = Math.min(
                ...remainingProcesses
                    .filter(p => p.burstTime > 0)
                    .map(p => p.arrivalTime)
            );
            
            if (nextArrival > currentTime) {
                schedule.push({
                    process: 'IDLE',
                    start: currentTime,
                    end: nextArrival
                });
                currentTime = nextArrival;
            }
            continue;
        }
        
        // Select process with highest priority (lowest number)
        // If priorities are equal, use FCFS (arrival time)
        available.sort((a, b) => {
            if (a.priority !== b.priority) {
                return a.priority - b.priority;
            }
            if (a.arrivalTime !== b.arrivalTime) {
                return a.arrivalTime - b.arrivalTime;
            }
            return a.id.localeCompare(b.id);
        });
        
        const selectedProcess = available[0];
        
        // Execute the process completely (non-preemptive)
        schedule.push({
            process: selectedProcess.id,
            start: currentTime,
            end: currentTime + selectedProcess.burstTime
        });
        
        currentTime += selectedProcess.burstTime;
        
        // Mark process as completed
        const index = remainingProcesses.findIndex(p => p.id === selectedProcess.id);
        remainingProcesses[index].burstTime = 0;
        completed++;
    }
    
    return schedule;
}

// ============================================
// ALGORITHM DISPATCHER
// ============================================

/**
 * Execute the selected scheduling algorithm
 * 
 * @param {string} algorithm - Algorithm name (fcfs, sjf, rr, priority)
 * @param {Array} processes - Array of processes
 * @param {number} quantum - Time quantum (for RR)
 * @returns {Array} Schedule
 */
function executeScheduling(algorithm, processes, quantum = 2) {
    // Deep copy processes to avoid mutation
    const processClone = JSON.parse(JSON.stringify(processes));
    
    switch (algorithm.toLowerCase()) {
        case 'fcfs':
            return fcfsScheduling(processClone);
        
        case 'sjf':
            return sjfScheduling(processClone);
        
        case 'rr':
            return roundRobinScheduling(processClone, quantum);
        
        case 'priority':
            return priorityScheduling(processClone);
        
        default:
            console.error('Unknown algorithm:', algorithm);
            return [];
    }
}

// ============================================
// HELPER: GET ALGORITHM NAME
// ============================================

/**
 * Get full algorithm name
 * @param {string} algorithm - Algorithm code
 * @returns {string} Full name
 */
function getAlgorithmName(algorithm) {
    const names = {
        'fcfs': 'First Come First Serve (FCFS)',
        'sjf': 'Shortest Job First (SJF)',
        'rr': 'Round Robin (RR)',
        'priority': 'Priority Scheduling'
    };
    return names[algorithm.toLowerCase()] || algorithm;
}

// ============================================
// HELPER: GET READY QUEUE AT TIME
// ============================================

/**
 * Calculate which processes are in ready queue at given time
 * Useful for visualization
 * 
 * @param {Array} processes - All processes
 * @param {Array} schedule - Gantt chart
 * @param {number} time - Current time
 * @param {string} algorithm - Algorithm being used
 * @returns {Array} Process IDs in ready queue
 */
function getReadyQueueAtTime(processes, schedule, time, algorithm) {
    const readyQueue = [];
    
    // Find which processes have arrived but not completed
    const completionTimes = {};
    schedule.forEach(slot => {
        if (slot.process !== 'IDLE') {
            completionTimes[slot.process] = slot.end;
        }
    });
    
    processes.forEach(p => {
        const arrived = p.arrivalTime <= time;
        const notCompleted = !completionTimes[p.id] || completionTimes[p.id] > time;
        const notCurrentlyRunning = !schedule.some(
            slot => slot.process === p.id && slot.start <= time && slot.end > time
        );
        
        if (arrived && notCompleted && notCurrentlyRunning) {
            readyQueue.push(p.id);
        }
    });
    
    return readyQueue;
}
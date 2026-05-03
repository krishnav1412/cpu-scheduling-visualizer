/**
 * ==============================================
 * UTILS.JS - Helper Functions & Utilities
 * CPU Scheduling Visualizer | BCSE303L | 23BDS0017
 * ==============================================
 * 
 * Contains utility functions for:
 * - Color generation and management
 * - Statistics calculations (WT, TAT)
 * - Canvas rendering helpers
 * - Data validation and formatting
 * - Export functionality
 */

// ============================================
// COLOR MANAGEMENT
// ============================================

/**
 * Generate vibrant, distinct colors for processes
 * @param {number} count - Number of colors needed
 * @returns {Array<string>} Array of hex color codes
 */
function generateColors(count) {
    const colors = [];
    const goldenRatio = 0.618033988749895;
    let hue = Math.random(); // Start with random hue
    
    for (let i = 0; i < count; i++) {
        hue += goldenRatio;
        hue %= 1;
        
        // Convert HSL to RGB for vibrant colors
        const color = hslToHex(hue * 360, 70, 60);
        colors.push(color);
    }
    
    return colors;
}

/**
 * Convert HSL to Hex color
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {string} Hex color code
 */
function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    
    let r = 0, g = 0, b = 0;
    
    if (h >= 0 && h < 60) {
        r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
        r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
        r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
        r = x; g = 0; b = c;
    } else {
        r = c; g = 0; b = x;
    }
    
    const toHex = (val) => {
        const hex = Math.round((val + m) * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ============================================
// STATISTICS CALCULATIONS
// ============================================

/**
 * Calculate Waiting Time and Turnaround Time for processes
 * @param {Array} processes - Array of process objects
 * @param {Array} schedule - Gantt chart schedule
 * @returns {Object} Statistics including WT, TAT, and averages
 */
function calculateStatistics(processes, schedule) {
    const stats = {
        processes: [],
        avgWT: 0,
        avgTAT: 0,
        totalWT: 0,
        totalTAT: 0,
        throughput: 0,
        cpuUtilization: 0
    };
    
    if (!processes.length || !schedule.length) {
        return stats;
    }
    
    // Calculate completion time for each process
    const completionTimes = {};
    const startTimes = {};
    
    schedule.forEach(slot => {
        if (slot.process !== 'IDLE') {
            if (!(slot.process in startTimes)) {
                startTimes[slot.process] = slot.start;
            }
            completionTimes[slot.process] = slot.end;
        }
    });
    
    // Calculate WT and TAT for each process
    processes.forEach(process => {
        const pid = process.id;
        const arrivalTime = process.arrivalTime;
        const burstTime = process.burstTime;
        const completionTime = completionTimes[pid] || 0;
        
        // Turnaround Time = Completion Time - Arrival Time
        const turnaroundTime = completionTime - arrivalTime;
        
        // Waiting Time = Turnaround Time - Burst Time
        const waitingTime = turnaroundTime - burstTime;
        
        stats.processes.push({
            id: pid,
            arrivalTime,
            burstTime,
            completionTime,
            turnaroundTime,
            waitingTime,
            priority: process.priority || 'N/A'
        });
        
        stats.totalWT += waitingTime;
        stats.totalTAT += turnaroundTime;
    });
    
    // Calculate averages
    const n = processes.length;
    stats.avgWT = (stats.totalWT / n).toFixed(2);
    stats.avgTAT = (stats.totalTAT / n).toFixed(2);
    
    // Calculate throughput (processes per unit time)
    const totalTime = Math.max(...Object.values(completionTimes));
    stats.throughput = (n / totalTime).toFixed(3);
    
    // Calculate CPU utilization
    const idleTime = schedule
        .filter(slot => slot.process === 'IDLE')
        .reduce((sum, slot) => sum + (slot.end - slot.start), 0);
    stats.cpuUtilization = (((totalTime - idleTime) / totalTime) * 100).toFixed(2);
    
    return stats;
}

// ============================================
// CANVAS RENDERING HELPERS
// ============================================

/**
 * Draw Gantt Chart on canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Array} schedule - Gantt chart schedule
 * @param {Object} processColors - Process ID to color mapping
 * @param {number} currentFrame - Current animation frame
 */
function drawGanttChart(ctx, schedule, processColors, currentFrame = -1) {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (!schedule.length) {
        // Draw empty state
        ctx.fillStyle = '#64748b';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No schedule generated. Add processes and click Play.', width / 2, height / 2);
        return;
    }
    
    // Calculate dimensions
    const chartHeight = 80;
    const chartY = 100;
    const timelineY = chartY + chartHeight + 40;
    const labelY = chartY - 20;
    
    // Find total time
    const totalTime = schedule[schedule.length - 1].end;
    const pixelsPerUnit = Math.min((width - 100) / totalTime, 60); // Max 60px per unit
    const chartWidth = totalTime * pixelsPerUnit;
    
    // Adjust canvas width if needed
    if (chartWidth + 100 > width) {
        canvas.width = chartWidth + 100;
    }
    
    // Draw title
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Gantt Chart', 20, 30);
    
    // Draw legend
    ctx.font = '12px Arial';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Time Units →', 20, 55);
    
    // Draw each process block
    schedule.forEach((slot, index) => {
        const x = 50 + slot.start * pixelsPerUnit;
        const blockWidth = (slot.end - slot.start) * pixelsPerUnit;
        
        // Determine color
        let color = '#cbd5e1'; // Default for IDLE
        if (slot.process !== 'IDLE') {
            color = processColors[slot.process] || '#3b82f6';
        }
        
        // Highlight current frame
        const isCurrentFrame = index === currentFrame;
        
        // Draw block
        ctx.fillStyle = color;
        if (isCurrentFrame) {
            // Pulsing effect for current block
            ctx.shadowBlur = 15;
            ctx.shadowColor = color;
        }
        ctx.fillRect(x, chartY, blockWidth, chartHeight);
        ctx.shadowBlur = 0;
        
        // Draw border
        ctx.strokeStyle = isCurrentFrame ? '#1e293b' : '#ffffff';
        ctx.lineWidth = isCurrentFrame ? 3 : 2;
        ctx.strokeRect(x, chartY, blockWidth, chartHeight);
        
        // Draw process label
        ctx.fillStyle = slot.process === 'IDLE' ? '#64748b' : '#ffffff';
        ctx.font = isCurrentFrame ? 'bold 14px Arial' : 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(slot.process, x + blockWidth / 2, chartY + chartHeight / 2 + 5);
        
        // Draw time markers at boundaries
        ctx.fillStyle = '#1e293b';
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        
        // Start time
        ctx.fillText(slot.start, x, timelineY);
        
        // End time (only for last block or before different process)
        if (index === schedule.length - 1 || schedule[index + 1].start !== slot.end) {
            ctx.fillText(slot.end, x + blockWidth, timelineY);
        }
    });
    
    // Draw timeline
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, timelineY - 15);
    ctx.lineTo(50 + chartWidth, timelineY - 15);
    ctx.stroke();
    
    // Draw ticks
    for (let i = 0; i <= totalTime; i++) {
        const x = 50 + i * pixelsPerUnit;
        ctx.beginPath();
        ctx.moveTo(x, timelineY - 20);
        ctx.lineTo(x, timelineY - 10);
        ctx.stroke();
    }
}

/**
 * Draw process queue visualization
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Array} queue - Current ready queue
 * @param {Object} processColors - Process colors
 * @param {number} y - Y position
 */
function drawQueue(ctx, queue, processColors, y = 250) {
    ctx.font = '14px Arial';
    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'left';
    ctx.fillText('Ready Queue:', 20, y);
    
    if (queue.length === 0) {
        ctx.fillStyle = '#64748b';
        ctx.fillText('[Empty]', 150, y);
        return;
    }
    
    let x = 150;
    queue.forEach((pid, index) => {
        const color = processColors[pid] || '#3b82f6';
        
        // Draw box
        ctx.fillStyle = color;
        ctx.fillRect(x, y - 20, 60, 30);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y - 20, 60, 30);
        
        // Draw label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(pid, x + 30, y);
        
        // Arrow
        if (index < queue.length - 1) {
            ctx.fillStyle = '#64748b';
            ctx.fillText('→', x + 65, y);
        }
        
        x += 80;
    });
}

// ============================================
// VALIDATION & FORMATTING
// ============================================

/**
 * Validate process input
 * @param {string} id - Process ID
 * @param {number} arrivalTime - Arrival time
 * @param {number} burstTime - Burst time
 * @param {number} priority - Priority value
 * @returns {Object} Validation result
 */
function validateProcess(id, arrivalTime, burstTime, priority) {
    const errors = [];
    
    if (!id || id.trim() === '') {
        errors.push('Process ID is required');
    }
    
    if (isNaN(arrivalTime) || arrivalTime < 0) {
        errors.push('Arrival time must be a non-negative number');
    }
    
    if (isNaN(burstTime) || burstTime <= 0) {
        errors.push('Burst time must be a positive number');
    }
    
    if (priority !== undefined && (isNaN(priority) || priority <= 0)) {
        errors.push('Priority must be a positive number');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Format time for display
 * @param {number} time - Time value
 * @returns {string} Formatted time
 */
function formatTime(time) {
    return time.toFixed(2);
}

// ============================================
// EXPORT FUNCTIONALITY
// ============================================

/**
 * Export canvas as image
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {string} filename - Output filename
 */
function exportCanvasAsImage(canvas, filename = 'gantt-chart.png') {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

/**
 * Export statistics and trace as text file
 * @param {Object} stats - Statistics object
 * @param {Array} schedule - Schedule array
 * @param {string} algorithm - Algorithm name
 * @param {number} quantum - Time quantum (for RR)
 */
function exportTrace(stats, schedule, algorithm, quantum = null) {
    let content = '='.repeat(60) + '\n';
    content += 'CPU SCHEDULING SIMULATION TRACE\n';
    content += '='.repeat(60) + '\n\n';
    
    content += `Algorithm: ${algorithm}\n`;
    if (quantum) {
        content += `Time Quantum: ${quantum}\n`;
    }
    content += `Date: ${new Date().toLocaleString()}\n\n`;
    
    content += '--- GANTT CHART ---\n';
    schedule.forEach(slot => {
        content += `[${slot.start}-${slot.end}] ${slot.process}\n`;
    });
    
    content += '\n--- PROCESS STATISTICS ---\n';
    content += 'PID\tAT\tBT\tCT\tTAT\tWT\n';
    content += '-'.repeat(60) + '\n';
    
    stats.processes.forEach(p => {
        content += `${p.id}\t${p.arrivalTime}\t${p.burstTime}\t${p.completionTime}\t${p.turnaroundTime}\t${p.waitingTime}\n`;
    });
    
    content += '\n--- AVERAGE METRICS ---\n';
    content += `Average Waiting Time: ${stats.avgWT}\n`;
    content += `Average Turnaround Time: ${stats.avgTAT}\n`;
    content += `Throughput: ${stats.throughput} processes/unit\n`;
    content += `CPU Utilization: ${stats.cpuUtilization}%\n`;
    
    // Download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trace-${algorithm}-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
}

// ============================================
// SAMPLE DATA GENERATOR
// ============================================

/**
 * Generate sample process data
 * @returns {Array} Sample processes
 */
function generateSampleProcesses() {
    return [
        { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2 },
        { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
        { id: 'P3', arrivalTime: 2, burstTime: 8, priority: 3 },
        { id: 'P4', arrivalTime: 3, burstTime: 6, priority: 2 },
        { id: 'P5', arrivalTime: 4, burstTime: 4, priority: 1 }
    ];
}

// ============================================
// DOM HELPERS
// ============================================

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type (success, error, info)
 */
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS animations
if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
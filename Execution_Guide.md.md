# 📘 Execution Guide
## CPU Scheduling Visualizer - Complete User Manual

**BCSE303L - Operating Systems | DA1 Assignment | 23BDS0017**

---

## 📑 Table of Contents

1. [Getting Started](#getting-started)
2. [User Interface Overview](#user-interface-overview)
3. [Step-by-Step Usage](#step-by-step-usage)
4. [Algorithm-Specific Instructions](#algorithm-specific-instructions)
5. [Animation Controls](#animation-controls)
6. [Understanding the Visualization](#understanding-the-visualization)
7. [Statistics & Metrics](#statistics--metrics)
8. [Export Features](#export-features)
9. [Troubleshooting](#troubleshooting)
10. [Tips & Best Practices](#tips--best-practices)

---

## 🚀 Getting Started

### System Requirements

**Minimum Requirements:**
- Modern web browser (released within last 2 years)
- Screen resolution: 1024x768 or higher
- JavaScript enabled
- No internet connection required (runs offline)

**Recommended Setup:**
- Desktop/Laptop for best experience
- Screen resolution: 1920x1080 or higher
- Latest version of Chrome, Firefox, or Edge

### Opening the Application

**Method 1: Direct Open**
1. Navigate to the project folder
2. Double-click `index.html`
3. Application opens in default browser

**Method 2: Right-Click Open**
1. Right-click on `index.html`
2. Select "Open with" → Choose your browser
3. Application loads automatically

**Method 3: Local Server (Optional)**
```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Then visit: http://localhost:8000
```

---

## 🎨 User Interface Overview

### Main Sections

The application is divided into 5 main sections:

#### 1. **Header**
- Application title and description
- Always visible at the top

#### 2. **Configuration Panel** (Left Side)
- Algorithm selector
- Time quantum input (for Round Robin)
- Process input form
- Process queue list

#### 3. **Visualization Section** (Center/Right)
- Animation control buttons
- Gantt chart canvas
- Timeline scrubber
- Current status display

#### 4. **Statistics Section**
- Performance metrics table
- Average waiting time and turnaround time
- Export buttons

#### 5. **Color Legend**
- Process color identification
- Visual reference for Gantt chart

---

## 📝 Step-by-Step Usage

### Phase 1: Setup

**Step 1.1: Select Scheduling Algorithm**
```
Location: Top of Configuration Panel
Options: 
  - First Come First Serve (FCFS)
  - Shortest Job First (SJF)
  - Round Robin (RR)
  - Priority Scheduling

Action: Click dropdown → Select algorithm
```

**Step 1.2: Configure Algorithm Parameters** (if needed)
```
For Round Robin:
  - Time Quantum field appears
  - Default: 2
  - Range: 1-10
  - Recommended: 2-4 for balanced visualization
```

### Phase 2: Add Processes

**Step 2.1: Enter Process Details**

| Field | Description | Validation | Example |
|-------|-------------|------------|---------|
| **Process ID** | Unique identifier | Required, no duplicates | P1, P2, Process1 |
| **Arrival Time** | When process arrives | Non-negative integer | 0, 1, 2 |
| **Burst Time** | CPU time needed | Positive integer | 5, 3, 8 |
| **Priority** | Process priority* | Positive integer | 1, 2, 3 |

*Only visible for Priority Scheduling (lower number = higher priority)

**Step 2.2: Add to Queue**
```
Method 1: Click "➕ Add Process" button
Method 2: Press Enter key while in any input field

Result: Process appears in Process Queue list below
```

**Step 2.3: Repeat for Multiple Processes**
```
Recommended: Add 3-5 processes for clear visualization
Maximum: No hard limit, but 10+ may slow animation
```

**Quick Option: Load Sample Data**
```
Button: "📋 Load Sample"
Effect: Loads 5 pre-configured processes (P1-P5)
Use Case: Quick testing and demonstration
```

### Phase 3: Run Simulation

**Step 3.1: Start Animation**
```
Button: ▶️ Play
Location: Animation Controls section
Effect: 
  - Generates Gantt chart
  - Begins frame-by-frame animation
  - Shows statistics
```

**Step 3.2: Observe Animation**
```
Watch:
  - Gantt chart building block by block
  - Current process highlighted with pulse effect
  - Ready queue updating in real-time
  - Current time incrementing
```

### Phase 4: Analyze Results

**Step 4.1: Review Gantt Chart**
```
Each block shows:
  - Process ID (center of block)
  - Time boundaries (below block)
  - Color coding (unique per process)
  - IDLE periods (grey blocks)
```

**Step 4.2: Check Statistics**
```
Table shows for each process:
  - Arrival Time
  - Burst Time
  - Completion Time
  - Turnaround Time
  - Waiting Time

Bottom row shows:
  - Average Turnaround Time
  - Average Waiting Time
```

---

## 🔄 Algorithm-Specific Instructions

### FCFS (First Come First Serve)

**Configuration:**
- No special parameters needed

**Input Considerations:**
```
Process Order Matters:
  - Processes executed in arrival order
  - Earlier arrival = Earlier execution
  
Example:
  P1: AT=0, BT=5  → Executes 0-5
  P2: AT=1, BT=3  → Executes 5-8 (waits for P1)
  P3: AT=2, BT=4  → Executes 8-12
```

**Characteristics:**
- Simple and predictable
- May have long waiting times
- Convoy effect possible

---

### SJF (Shortest Job First)

**Configuration:**
- Non-preemptive implementation
- No special parameters

**Input Considerations:**
```
Burst Time is Critical:
  - Shortest burst time gets priority
  - Among arrived processes only
  
Example:
  At time 0:
    P1: BT=8, AT=0  → Waits
    P2: BT=4, AT=0  → Executes first (shorter)
    P3: BT=2, AT=1  → Executes after P2 arrives
```

**Best Practices:**
- Vary burst times significantly (e.g., 2, 5, 8, 12)
- Test with simultaneous arrivals
- Observe starvation potential

---

### Round Robin (RR)

**Configuration:**
```
Time Quantum Setting:
  - Small (1-2): More context switches, slower
  - Medium (3-4): Balanced
  - Large (5+): Approaches FCFS
  
Recommended: 2 or 3
```

**Input Considerations:**
```
Burst Time vs Quantum:
  - BT > Quantum: Process interrupted
  - BT ≤ Quantum: Process completes
  
Example (Quantum = 2):
  P1: BT=5 → Executes in 3 slices [0-2], [4-6], [8-9]
  P2: BT=2 → Executes once [2-4]
  P3: BT=3 → Executes twice [6-8], [9-10]
```

**Visualization Notes:**
- Watch process returning to queue after quantum
- Observe circular execution pattern
- Count context switches

---

### Priority Scheduling

**Configuration:**
- Priority field becomes visible
- Lower number = Higher priority

**Input Considerations:**
```
Priority Assignment:
  - 1 = Highest priority (executes first)
  - 2, 3, 4... = Lower priorities
  - Equal priorities: FCFS order
  
Example:
  P1: Priority=3, AT=0 → Waits
  P2: Priority=1, AT=0 → Executes first
  P3: Priority=2, AT=1 → Executes second
```

**Testing Scenarios:**
```
1. All different priorities: Clear hierarchy
2. Some equal priorities: Tie-breaking by arrival
3. Late high-priority: Test preemption (non-preemptive = waits)
```

---

## 🎮 Animation Controls

### Control Buttons Reference

| Button | Symbol | Function | Keyboard Shortcut |
|--------|--------|----------|-------------------|
| **Play** | ▶️ | Start/resume animation | Space (planned) |
| **Pause** | ⏸️ | Pause animation | Space (planned) |
| **Step Forward** | ⏭️ | Next frame | → Arrow |
| **Step Backward** | ⏮️ | Previous frame | ← Arrow |
| **Reset** | 🔄 | Return to start | R (planned) |

### Speed Control

**Speed Slider (1x - 10x):**
```
1x-3x: Slow, detailed observation
4x-6x: Normal speed (recommended)
7x-10x: Fast, quick overview

Adjustable during playback:
  - Drag slider while animation runs
  - Effect applies immediately
```

### Timeline Scrubber

**Purpose:** Jump to any point in execution

**Usage:**
```
1. Pause animation (recommended)
2. Drag timeline slider
3. Frame updates in real-time
4. View any execution point instantly
```

**Use Cases:**
- Compare process states at different times
- Review specific decision points
- Capture screenshots of particular frames

---

## 👁️ Understanding the Visualization

### Gantt Chart Elements

**Color Blocks:**
```
Each Block Represents:
  - One execution slice
  - Process ID (center label)
  - Start time (left number)
  - End time (right number)
  - Process color (from legend)
```

**Current Process Indicator:**
```
Active block shows:
  - Thicker border
  - Pulsing glow effect
  - Brighter appearance
  - Matches "Current Process" display
```

**IDLE Periods:**
```
Grey blocks indicate:
  - CPU idle (no ready process)
  - Wait for next arrival
  - Scheduling gap
```

### Status Panel Indicators

**Current Time:**
- Shows execution progress
- Matches timeline position
- Increments with animation

**Current Process:**
- ID of executing process
- "IDLE" during gaps
- "None" before start

**Ready Queue:**
- Processes waiting for CPU
- Updates dynamically
- Array format: [P1, P2, P3]

---

## 📊 Statistics & Metrics

### Understanding the Metrics Table

**Column Definitions:**

```
Process: Process identifier
AT (Arrival Time): When process entered system
BT (Burst Time): Required CPU time
CT (Completion Time): When process finished
TAT (Turnaround Time): CT - AT
WT (Waiting Time): TAT - BT
```

**Average Row (Bottom):**
- Blue background
- Shows mean values
- Key performance indicators

### Interpreting Results

**Good Performance Indicators:**
```
✅ Low Average Waiting Time
✅ High CPU Utilization (near 100%)
✅ Low variance in waiting times
✅ Minimal IDLE time
```

**Algorithm Comparison:**
```
Typical Results (may vary):

FCFS: 
  - Moderate waiting time
  - High utilization
  - Simple, predictable

SJF:
  - Lowest average waiting time
  - Optimal for batch systems
  - May have starvation

RR:
  - Fair waiting distribution
  - Good for interactive systems
  - More context switches

Priority:
  - Flexible performance
  - Can optimize important processes
  - May have starvation
```

---

## 💾 Export Features

### Screenshot Export

**Purpose:** Save Gantt chart as image

**Steps:**
```
1. Navigate to desired frame (pause if needed)
2. Click "📸 Export Screenshot"
3. File downloads automatically
4. Format: PNG
5. Filename: gantt-{algorithm}-{timestamp}.png
```

**Use Cases:**
- Assignment submission
- Documentation
- Comparison analysis
- Presentations

### Trace Export

**Purpose:** Detailed execution log

**Steps:**
```
1. Complete simulation
2. Click "📄 Export Trace"
3. Text file downloads
4. Contains:
   - Algorithm used
   - Gantt chart sequence
   - All statistics
   - Timestamp
```

**File Format:**
```
==========================================================
CPU SCHEDULING SIMULATION TRACE
==========================================================

Algorithm: Round Robin (RR)
Time Quantum: 2
Date: 10/31/2025, 10:30:00 AM

--- GANTT CHART ---
[0-2] P1
[2-4] P2
[4-6] P1
...

--- PROCESS STATISTICS ---
PID  AT  BT  CT  TAT  WT
P1   0   5   9   9    4
P2   1   3   7   6    3
...

--- AVERAGE METRICS ---
Average Waiting Time: 3.40
Average Turnaround Time: 7.60
Throughput: 0.250 processes/unit
CPU Utilization: 95.00%
```

---

## ⚠️ Troubleshooting

### Common Issues & Solutions

**Issue: Blank Screen**
```
Possible Causes:
  1. JavaScript disabled
  2. Old browser version
  3. File not loaded properly

Solutions:
  ✓ Enable JavaScript in browser settings
  ✓ Update browser to latest version
  ✓ Refresh page (Ctrl+F5)
  ✓ Check browser console for errors
```

**Issue: Animation Not Starting**
```
Checklist:
  ☐ Added at least one process?
  ☐ Valid arrival and burst times?
  ☐ Clicked Play button?
  ☐ Check for error toasts

Solution:
  ✓ Add valid processes first
  ✓ Check input validation
  ✓ Look for red error notifications
```

**Issue: Gantt Chart Looks Wrong**
```
Verification Steps:
  1. Confirm input data is correct
  2. Check algorithm selection
  3. Verify quantum setting (RR)
  4. Review process priorities
  5. Compare with manual calculation

Debug:
  ✓ Export trace for detailed analysis
  ✓ Use step-by-step mode
  ✓ Reset and re-run
```

**Issue: Slow Performance**
```
Optimization:
  ✓ Reduce number of processes (< 10)
  ✓ Close other browser tabs
  ✓ Lower animation speed
  ✓ Use modern browser
  ✓ Check system resources
```

**Issue: Export Not Working**
```
Checks:
  ☐ Pop-up blocker enabled?
  ☐ Download permissions?
  ☐ Sufficient disk space?

Solutions:
  ✓ Allow pop-ups for this page
  ✓ Check browser download settings
  ✓ Try different browser
```

---

## 💡 Tips & Best Practices

### For Learning

**Start Simple:**
```
1. Begin with FCFS (simplest)
2. Add 3 processes with different arrival times
3. Observe basic Gantt chart
4. Understand metrics
5. Progress to other algorithms
```

**Systematic Testing:**
```
Test Scenarios:
  □ All processes arrive at time 0
  □ Staggered arrivals (0, 1, 2, 3...)
  □ Mixed burst times (short and long)
  □ Equal vs different priorities
  □ Various time quantums (RR)
```

**Comparative Analysis:**
```
1. Use same process set for all algorithms
2. Export results for each
3. Compare average waiting times
4. Analyze context switches (RR)
5. Identify best algorithm for scenario
```

### For Presentations

**Preparation:**
```
1. Load sample data
2. Practice navigation
3. Prepare comparison scenarios
4. Export screenshots beforehand
5. Test on presentation laptop
```

**Live Demo Tips:**
```
✓ Use medium animation speed (4x-5x)
✓ Pause to explain key points
✓ Use step mode for detailed walkthrough
✓ Keep process count manageable (3-5)
✓ Have backup screenshots ready
```

### For Assignments

**Documentation:**
```
Include:
  □ Screenshots of all algorithms
  □ Exported trace files
  □ Comparison table
  □ Analysis of results
  □ Edge case testing
```

**Testing Checklist:**
```
☐ Test all four algorithms
☐ Various process configurations
☐ Edge cases (0 arrival, equal burst)
☐ Export functionality
☐ Animation controls
☐ Statistics accuracy
```

---

## 🎯 Example Workflows

### Workflow 1: Basic Demonstration

```
1. Select FCFS
2. Click "Load Sample"
3. Click Play ▶️
4. Observe full animation
5. Review statistics
6. Export screenshot
7. Repeat for other algorithms
```

**Time:** ~3 minutes per algorithm

---

### Workflow 2: Custom Analysis

```
1. Select algorithm
2. Manually add 4-5 processes:
   - Mix arrival times (0, 2, 4, 6)
   - Vary burst times (3, 7, 5, 2, 8)
   - Set priorities (if applicable)
3. Run simulation
4. Export trace
5. Analyze results manually
6. Verify calculations
```

**Time:** ~10 minutes

---

### Workflow 3: Algorithm Comparison

```
1. Create consistent process set
2. For each algorithm:
   a. Load same processes
   b. Run simulation
   c. Export screenshot + trace
   d. Note avg WT and TAT
3. Create comparison table
4. Identify best performer
```

**Time:** ~20 minutes

---

## 📚 Additional Resources

### Keyboard Shortcuts (Planned)

| Key | Action |
|-----|--------|
| Space | Play/Pause |
| → | Step Forward |
| ← | Step Backward |
| R | Reset |
| + | Increase Speed |
| - | Decrease Speed |

### Color Scheme

```
Process Colors: Auto-generated vibrant colors
IDLE Blocks: Light grey (#cbd5e1)
Current Frame: Highlighted with glow
Success Toast: Green (#10b981)
Error Toast: Red (#ef4444)
Info Toast: Blue (#3b82f6)
```

---

## 📞 Support & Feedback

**For Help:**
- Review this guide thoroughly
- Check README.md for overview
- Examine browser console for errors
- Test in different browser

**Bug Reports:**
- Document steps to reproduce
- Note browser and version
- Include screenshots if possible
- Check if issue persists after refresh

---

## ✅ Quick Reference

### Adding Your First Process
```
1. ID: P1
2. Arrival: 0
3. Burst: 5
4. Priority: 1 (if needed)
5. Click Add
```

### Running First Simulation
```
1. Add 3-5 processes
2. Select algorithm
3. Click Play ▶️
4. Watch animation
5. Review stats
```

### Comparing Algorithms
```
1. Load sample data
2. Note current results
3. Change algorithm
4. Click Reset
5. Compare metrics
```

---

**Document Version:** 1.0  
**Last Updated:** October 31, 2025  
**For:** BCSE303L - Operating Systems DA1

---

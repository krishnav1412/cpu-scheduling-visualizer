# 🖥️ CPU Scheduling Visualizer

**BCSE303L - Operating Systems | DA1 Assignment | 23BDS0017**

An interactive, client-side web application for visualizing and analyzing CPU scheduling algorithms with real-time animations and comprehensive performance metrics.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Algorithms Implemented](#algorithms-implemented)
- [Performance Metrics](#performance-metrics)
- [Browser Compatibility](#browser-compatibility)
- [Author](#author)
- [License](#license)

---

## 🎯 Overview

This project is a comprehensive visualization tool for understanding CPU scheduling algorithms in Operating Systems. It provides an interactive Gantt chart animation, detailed statistics, and supports multiple scheduling algorithms including FCFS, SJF, Round Robin, and Priority Scheduling.

**Key Highlights:**
- ✨ Real-time frame-by-frame animation
- 📊 Dynamic Gantt chart rendering using Canvas API
- 📈 Comprehensive performance metrics (WT, TAT, CPU Utilization)
- 🎨 Color-coded process visualization
- 💾 Export functionality (screenshots & trace files)
- 📱 Fully responsive design
- ⚡ 100% client-side - no backend required

---

## ✨ Features

### Core Functionality
- **Multiple Algorithms**: FCFS, SJF, Round Robin, Priority Scheduling
- **Interactive Input**: Add processes with custom arrival times, burst times, and priorities
- **Sample Data**: Quick load sample processes for testing
- **Process Management**: Add, remove, and clear processes dynamically

### Animation Controls
- **Play/Pause**: Control animation playback
- **Step Navigation**: Move forward/backward frame-by-frame
- **Speed Control**: Adjust animation speed (1x - 10x)
- **Timeline Scrubber**: Jump to any frame instantly
- **Reset**: Return to initial state

### Visualization
- **Gantt Chart**: Smooth Canvas-based rendering with color-coded processes
- **Process Highlighting**: Current executing process with pulsing effect
- **Ready Queue Display**: Real-time queue status
- **Current Time**: Live time tracking
- **IDLE Time Visualization**: Shows CPU idle periods

### Statistics & Metrics
- **Waiting Time (WT)**: Per-process and average
- **Turnaround Time (TAT)**: Per-process and average
- **Completion Time (CT)**: For each process
- **CPU Utilization**: Overall CPU usage percentage
- **Throughput**: Processes completed per unit time

### Export Options
- **Screenshot Export**: Save Gantt chart as PNG
- **Trace Export**: Download detailed execution trace as text file

### UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Clean Interface**: Modern, intuitive layout
- **Toast Notifications**: User-friendly feedback
- **Color Legend**: Process identification guide
- **Form Validation**: Prevents invalid inputs

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Structure and semantic markup |
| **CSS3** | Styling, animations, responsive design |
| **JavaScript (ES6+)** | Application logic and interactivity |
| **Canvas API** | Gantt chart rendering and animations |

**No External Dependencies** - Pure vanilla JavaScript implementation!

---

## 📁 Project Structure

```
cpu-scheduling-visualizer/
│
├── index.html              # Main HTML structure
├── style.css               # Complete styling and responsive design
├── main.js                 # Application controller & animation engine
├── algorithms.js           # Scheduling algorithm implementations
├── utils.js                # Helper functions & utilities
├── README.md               # Project documentation (this file)
└── Execution_Guide.md      # Detailed user guide
```

### File Descriptions

**`index.html`** (UI Layer)
- Semantic HTML5 structure
- Input forms for process configuration
- Animation control panel
- Canvas element for Gantt chart
- Statistics display sections

**`style.css`** (Presentation Layer)
- Modern CSS with CSS custom properties
- Responsive grid and flexbox layouts
- Smooth transitions and animations
- Mobile-first responsive design
- Accessible color scheme

**`main.js`** (Controller Layer)
- Application state management
- Event handling and user interactions
- Animation loop controller
- DOM manipulation and rendering
- Process lifecycle management

**`algorithms.js`** (Logic Layer)
- FCFS implementation
- SJF (non-preemptive) implementation
- Round Robin implementation
- Priority scheduling implementation
- Algorithm dispatcher

**`utils.js`** (Helper Layer)
- Color generation for processes
- Statistics calculation functions
- Canvas rendering utilities
- Data validation
- Export functionality

---

## 🚀 Setup & Installation

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- No server or build tools required!

### Installation Steps

1. **Download/Clone the project:**
   ```bash
   git clone <repository-url>
   cd cpu-scheduling-visualizer
   ```

2. **Open in browser:**
   - Simply double-click `index.html`, or
   - Right-click → Open with → Your Browser, or
   - Use a local server (optional):
     ```bash
     python -m http.server 8000
     # Then visit http://localhost:8000
     ```

3. **Start using:**
   - No compilation or build steps needed
   - Works completely offline

---

## 📖 Usage

### Quick Start

1. **Select Algorithm**: Choose from FCFS, SJF, RR, or Priority
2. **Add Processes**: Enter process details (ID, arrival, burst, priority)
3. **Run Simulation**: Click the Play ▶️ button
4. **Observe**: Watch the animated Gantt chart
5. **Analyze**: View statistics and metrics

### Adding Processes

```
Process ID: P1
Arrival Time: 0
Burst Time: 5
Priority: 2 (for Priority Scheduling)
```

Click "➕ Add Process" to add to the queue.

### Animation Controls

- **▶️ Play**: Start animation
- **⏸️ Pause**: Pause current animation
- **⏭️ Step Forward**: Move to next frame
- **⏮️ Step Backward**: Move to previous frame
- **🔄 Reset**: Return to start

### Exporting Results

- **📸 Export Screenshot**: Saves Gantt chart as PNG
- **📄 Export Trace**: Downloads detailed execution log

For detailed instructions, see [Execution_Guide.md](./Execution_Guide.md)

---

## 🔄 Algorithms Implemented

### 1. First Come First Serve (FCFS)
- **Type**: Non-preemptive
- **Strategy**: Execute processes in order of arrival
- **Characteristics**: Simple, fair, but may cause convoy effect

### 2. Shortest Job First (SJF)
- **Type**: Non-preemptive
- **Strategy**: Execute shortest burst time process first
- **Characteristics**: Optimal average waiting time, may cause starvation

### 3. Round Robin (RR)
- **Type**: Preemptive
- **Strategy**: Each process gets a time quantum in circular order
- **Characteristics**: Fair, good for time-sharing systems
- **Parameter**: Time Quantum (adjustable)

### 4. Priority Scheduling
- **Type**: Non-preemptive
- **Strategy**: Execute highest priority process first
- **Characteristics**: Flexible, may cause starvation
- **Note**: Lower number = Higher priority

---

## 📊 Performance Metrics

The application calculates and displays:

### Per-Process Metrics
- **Arrival Time (AT)**: When process enters ready queue
- **Burst Time (BT)**: CPU time required
- **Completion Time (CT)**: When process finishes
- **Turnaround Time (TAT)**: CT - AT
- **Waiting Time (WT)**: TAT - BT

### System Metrics
- **Average Waiting Time**: Mean of all waiting times
- **Average Turnaround Time**: Mean of all turnaround times
- **CPU Utilization**: (Total Busy Time / Total Time) × 100%
- **Throughput**: Processes completed per unit time

---

## 🌐 Browser Compatibility

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Opera | 76+ | ✅ Fully Supported |

**Note**: Older browsers may have limited Canvas API support.

---

## 🎓 Educational Value

This project demonstrates:
- Operating System scheduling concepts
- Process state transitions
- Algorithm complexity analysis
- Real-time system visualization
- Performance metric calculation
- Web-based animation techniques

---

## 👨‍💻 Author

**[Your Name]**  
Roll No: [Your Roll Number]  
Course: BCSE303L - Operating Systems  
Batch: [Your Batch]  
Institution: [Your Institution]

---

## 📝 License

This project is developed as part of BCSE303L coursework. For educational purposes only.

---

## 🙏 Acknowledgments

- Course Instructor: [Instructor Name]
- Operating Systems Concepts (Silberschatz, Galvin, Gagne)
- MDN Web Docs for Canvas API reference

---

## 📞 Support

For issues, questions, or contributions:
- Email: agarwalkrishnav34@gmail.com
- Repository: N/A

---

**Last Updated**: October 31, 2025

Made for BCSE303L - Operating Systems

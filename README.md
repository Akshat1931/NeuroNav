# NeuroNav — Accessibility-First Assistive Technology Platform

<div align="center">

![NeuroNav Banner](https://img.shields.io/badge/NeuroNav-Accessibility%20Platform-8454EE?style=for-the-badge&logo=data:image/png;base64,)

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=flat&logo=mysql&logoColor=white)](https://mysql.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat)](LICENSE)

**An open-source, multi-modal assistive technology ecosystem that empowers people with physical, cognitive, and communication disabilities to navigate the digital world — using their eyes, voice, or face alone.**

</div>

---

## What is NeuroNav?

NeuroNav combines **eight distinct accessibility technologies** into a unified, locally-hosted web platform. It was built for people who cannot use traditional mouse/keyboard interfaces due to conditions like ALS, cerebral palsy, stroke, locked-in syndrome, or other motor/communication impairments.

Every feature runs **locally on your machine** — no cloud dependency for core access features. Face authentication never leaves the browser. Eye tracking uses your webcam only. Conversations are stored on your own disk.

---
## DEMO
https://youtu.be/Vb-8Ii7acao?si=TlNhTVfocouSptVw

---

## Features

### Biometric Login (Face Authentication)
- Log in using **facial recognition** — no password required
- Powered by [face-api.js](https://github.com/justadudewhohacks/face-api.js) running entirely in the browser
- All face data stays on-device; nothing is transmitted

### Eye Tracking Mouse Control
- Control the **cursor with your eyes** using any standard webcam
- **Left eye iris position** → cursor movement (MediaPipe FaceLandmarker landmarks)
- **Right eye blink** (while left eye is open) → left-click
- Both eyes closed simultaneously → ignored (natural blink)
- Auto-downloads the MediaPipe face landmark model (~5 MB) on first run
- Powered by OpenCV + MediaPipe FaceLandmarker Tasks APIs

### Voice Control (Speech-to-Text Navigation)
- Hands-free navigation using the **Web Speech API** (built into Chrome/Edge)
- Say a section name to scroll to it: *"sentiment", "chatbot", "therapist", "EEG", "blog", "games", "virtual"*
- Live transcript displayed while listening

### AI Mental Health Chatbot
- Empathetic conversational AI that listens, asks follow-up questions, and identifies emotional patterns
- Suggests personalised coping strategies
- All conversations logged locally for sentiment analysis
- Powered by Google Gemini API

### Sentiment Analysis
- Automatically analyses your chatbot conversation history **Used Natural library**
- Generates weekly charts for **mood, anxiety, depression, and stress** trends
- No manual input required — reads directly from the conversation log
- Powered by Flask backend + Recharts visualisation

### Disability-Friendly Therapist Video Call
- Accessible video calls with therapists via WebRTC
- Real-time **hand-gesture recognition** using TensorFlow.js:
  - 🖐️ **Open hand** → "Hello"
  - ✊ **Closed fist** → "Yes"
  - 👎 **Thumb down** → "No"
- Recognised gestures are converted to **spoken text** via text-to-speech

### Dynamic-Aura 3D Virtual World
- A navigable **Three.js 3D environment** with a controllable avatar
- Walk your character through labelled portals to reach each platform feature
- Controls: **Arrow keys or WASD**
- Built as an immersive alternative to traditional menus

### EEG Brain Monitoring
- Visualises **live brainwave data** from a USB EEG headset
- Detects mental states: Relaxed, Focused, Stressed
- Animated EEG waveform displayed on the dashboard

### Neural Games (Cognitive Training)
- **Space Shooter** — reflex and attention training
- **The Aviator** — smooth motor-control practice
- **VR World** — spatial awareness and exploration
- Playable with mouse, keyboard, eye tracking, or voice

###  Community Blog & Therapy Cards
- Community stories from people with disabilities using assistive tech
- Evidence-based therapy activity cards:
  -  Art Therapy ·  Breathing ·  Journaling ·  Mindfulness ·  Music ·  Movement

---

##  Architecture

```
Main/
├── hacknight-2.0/
│   ├── backend/          # Flask API — auth, eye tracking, sentiment analysis
│   └── frontend/         # React app — login, home, main dashboard
├── FaceAuthForDisabled/  # Vite + face-api.js biometric login
├── MentalHealthChatBot/
│   ├── server/           # Express + Gemini AI chatbot backend (port 5500)
│   └── client/           # React chatbot UI (port 3001)
├── TherapistVideoCallforDisabled/  # WebRTC + sign language (port 6002)
├── Dynamic-Aura/         # Three.js 3D virtual world (port 3002)
└── mysql-init/           # Database initialisation SQL
```

### Service Port Map

| Service | Port | Description |
|---------|------|-------------|
| Main App (React) | **3000** | Login → Home → Dashboard |
| Chatbot UI (React) | **3001** | Mental health chat interface |
| Dynamic-Aura (3D World) | **3002** | Three.js virtual environment |
| Flask API | **5000** | Auth, eye tracking, sentiment |
| Chatbot Server | **5500** | Express + Gemini AI backend |
| Therapist Video Call | **6002** | WebRTC + sign language |
| Face Auth (Vite) | **6004** | Biometric login |

---

## Prerequisites

Before setup, install the following:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | 18+ | https://nodejs.org |
| **Python** | 3.10+ | https://python.org |
| **MySQL** | 8+ | https://dev.mysql.com/downloads/installer/ |
| **Git** | Latest | https://git-scm.com |

---

##  Installation

### 1. Clone the repository

```bash
git clone https://github.com/Akshit222/NeuroNav.git
cd NeuroNav
```

### 2. Set up the MySQL database

Start MySQL and run the setup script:

```powershell
Get-Content "hacknight-2.0\backend\db_setup.sql" | mysql -u root -p
```

Enter your MySQL root password when prompted. This creates the `neuronav_db` database and `users` table.

### 3. Configure the Flask backend

Edit `hacknight-2.0/backend/.env`:

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DB=neuronav_db
FLASK_PORT=5000
```

### 4. Add your Gemini API key

Edit the root `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Also add it to `MentalHealthChatBot/server/.env`:

```env
API_KEY=your_gemini_api_key_here
```

> Get a free Gemini API key at: https://aistudio.google.com/app/apikey

### 5. Install Python dependencies

```powershell
cd hacknight-2.0\backend
pip install -r requirements.txt
```

**Python packages installed:**
```
flask
flask-cors
python-dotenv
mysql-connector-python
bcrypt
opencv-python
mediapipe
pyautogui
numpy
```

### 6. Install Node.js dependencies

Run this for each service (or just run `start-all.bat` which does it automatically):

```powershell
cd hacknight-2.0\frontend   && npm install
cd ..\..\FaceAuthForDisabled      && npm install
cd ..\MentalHealthChatBot\server  && npm install
cd ..\client                      && npm install
cd ..\..\TherapistVideoCallforDisabled && npm install
cd ..\Dynamic-Aura                && npm install
```

---

##  Running the App

From the project root (`Main/`), double-click or run:

```powershell
.\start-all.bat
```

This opens **7 separate terminal windows**, one per service. Wait ~30 seconds for all services to start, then open:

** http://localhost:3000** ← Start here (Login page)

---

##  User Flow

```
http://localhost:3000  (Login Page)
        │
        ├── Biometric Login → FaceAuth (localhost:6004) → Post-Login Options
        │
        └── Normal Login (username + password) → Post-Login Options
                    │
                    ├── Enable Eye Tracking → Home Page
                    │
                    └── Skip → Home Page (localhost:3000/home)
                                    │
                                    └── Go to Dashboard (localhost:3000/neuronavdashboard)
                                                │
                                                ├── Sentiment Analysis (auto-loads)
                                                ├── AI Chatbot → localhost:3001
                                                ├── Therapist Video Call → localhost:6002
                                                ├── EEG Monitoring (live)
                                                ├── 3D Virtual World → localhost:3002
                                                ├── Community Blog & Therapy Cards
                                                └── Neural Games
```

---

##  Eye Tracking Setup

On first use, the eye tracking module will **automatically download** the MediaPipe face landmark model (~5 MB).

1. Click **Start Eye Tracking** on the dashboard
2. A webcam window opens with a **calibration phase** — look slowly around all screen edges for ~10 seconds
3. After calibration:
   - **Left eye iris** position moves the cursor
   - **Right eye blink** (with left eye open) = left-click
   - Both eyes closed simultaneously = ignored

> **Requirements**: A standard USB or built-in webcam. Good lighting recommended.

---

##  Environment Variables Summary

| File | Variable | Description |
|------|----------|-------------|
| `hacknight-2.0/backend/.env` | `MYSQL_HOST` | MySQL host (usually `localhost`) |
| | `MYSQL_USER` | MySQL username |
| | `MYSQL_PASSWORD` | MySQL password |
| | `MYSQL_DB` | Database name (`neuronav_db`) |
| | `FLASK_PORT` | Flask port (`5000`) |
| `.env` (root) | `GEMINI_API_KEY` | Google Gemini API key |
| `MentalHealthChatBot/server/.env` | `API_KEY` | Same Gemini API key |

---


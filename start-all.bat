@echo off
set "ROOT=%~dp0"

echo.
echo  Starting all NeuroNav services...
echo.

:: Flask backend - auth + eye tracking
start "Flask Backend :5000" /D "%ROOT%hacknight-2.0\backend" cmd /k "pip install -r requirements.txt -q & python flask_server.py"
timeout /t 3 /nobreak > nul

:: Main NeuroNav frontend
start "Main App :3000" /D "%ROOT%hacknight-2.0\frontend" cmd /k "npm start"

:: FaceAuth biometric login
start "Face Auth :6004" /D "%ROOT%FaceAuthForDisabled" cmd /k "npm run dev"

:: Mental health chatbot server
start "Chat Server :5500" /D "%ROOT%MentalHealthChatBot\server" cmd /k "node server.js"

:: Mental health chatbot client
start "Chat Client :3001" /D "%ROOT%MentalHealthChatBot\client" cmd /k "npm start"

:: Therapist video call
start "Therapist Call :6002" /D "%ROOT%TherapistVideoCallforDisabled" cmd /k "npm start"

:: Dynamic-Aura 3D world
start "Dynamic Aura :3002" /D "%ROOT%Dynamic-Aura" cmd /k "npm start"

echo  All 7 services launched in separate windows!
echo.
echo  Service map:
echo    http://localhost:3000  - Main App  ^(start here^)
echo    http://localhost:6004  - Face Auth
echo    http://localhost:3001  - Mental Health Chat
echo    http://localhost:6002  - Therapist Video Call
echo    http://localhost:3002  - Dynamic-Aura 3D World
echo    http://localhost:5000  - Flask API
echo    http://localhost:5500  - Chat AI Server
echo.
pause

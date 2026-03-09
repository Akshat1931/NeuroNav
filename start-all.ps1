# ============================================================
#  NeuroNav — Start All Services
#  Run this from the Main folder:  .\start-all.ps1
# ============================================================

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Start-Service {
    param([string]$Title, [string]$Dir, [string]$Command)
    $fullDir = Join-Path $Root $Dir
    Start-Process powershell -ArgumentList '-NoExit', '-Command', "cd `'$fullDir`'; `$host.UI.RawUI.WindowTitle=`'$Title`'; Write-Host `'=== $Title ===`' -ForegroundColor Cyan; $Command"
}

Write-Host ""
Write-Host " Starting all NeuroNav services..." -ForegroundColor Green
Write-Host ""

# 1 — Flask backend (auth + eye tracking + sentiment)
Start-Service -Title 'Flask Backend :5000' -Dir 'hacknight-2.0\backend' -Command 'pip install -r requirements.txt -q; python flask_server.py'

Start-Sleep -Seconds 2

# 2 — NeuroNav main frontend
Start-Service -Title 'Main App :3000' -Dir 'hacknight-2.0\frontend' -Command 'npm start'

# 3 — FaceAuth (biometric login)
Start-Service -Title 'Face Auth :6004' -Dir 'FaceAuthForDisabled' -Command 'npm run dev'

# 4 — Mental health chatbot server
Start-Service -Title 'Chat Server :5500' -Dir 'MentalHealthChatBot\server' -Command 'node server.js'

# 5 — Mental health chatbot client
Start-Service -Title 'Chat Client :3001' -Dir 'MentalHealthChatBot\client' -Command 'npm start'

# 6 — Therapist video call
Start-Service -Title 'Therapist Call :6002' -Dir 'TherapistVideoCallforDisabled' -Command 'npm start'

# 7 — Dynamic-Aura 3D world
Start-Service -Title 'Dynamic Aura :3002' -Dir 'Dynamic-Aura' -Command 'npm start'

Write-Host ""
Write-Host " ✅  All 7 services launched in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host " Service map:" -ForegroundColor Yellow
Write-Host "   http://localhost:3000  — Main App (start here)" -ForegroundColor White
Write-Host "   http://localhost:6004  — Face Auth" -ForegroundColor White
Write-Host "   http://localhost:3001  — Mental Health Chat" -ForegroundColor White
Write-Host "   http://localhost:6002  — Therapist Video Call" -ForegroundColor White
Write-Host "   http://localhost:3002  — Dynamic-Aura 3D World" -ForegroundColor White
Write-Host "   http://localhost:5000  — Flask API" -ForegroundColor White
Write-Host "   http://localhost:5500  — Chat AI Server" -ForegroundColor White
Write-Host ""
Write-Host " NOTE: MySQL must be running locally." -ForegroundColor DarkYellow
Write-Host " To set up DB (first time only):" -ForegroundColor DarkYellow
Write-Host "   mysql -u root -p < hacknight-2.0\backend\db_setup.sql" -ForegroundColor DarkYellow
Write-Host ""
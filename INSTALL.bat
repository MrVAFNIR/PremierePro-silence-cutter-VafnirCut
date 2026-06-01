@echo off
chcp 65001 >nul
color 0B

echo ===================================================
echo   AUTOMATIC INSTALLATION: PYTHON ^& AI ENGINE
echo ===================================================
echo.

:: Checking for Administrator privileges
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] Administrator privileges confirmed.
) else (
    echo [ERROR] Please run this file as Administrator!
    pause
    exit
)

:: Checking if Python is already installed
python --version >nul 2>&1
if %errorLevel% == 0 (
    echo [INFO] Python is already installed. Skipping installation step...
    goto install_auto_editor
)

echo [1/3] Downloading official Python installer...
curl -L -o python_installer.exe https://www.python.org/ftp/python/3.11.8/python-3.11.8-amd64.exe

if not exist python_installer.exe (
    echo [ERROR] Failed to download the installer. Please check your internet connection.
    pause
    exit
)

echo.
echo [2/3] Installing Python in silent mode...
echo (This may take a few minutes, please wait...)
start /wait python_installer.exe /quiet InstallAllUsers=1 PrependPath=1 Include_test=0
del python_installer.exe

:install_auto_editor
echo.
echo [3/3] Installing auto-editor package...

set "PATH=%PATH%;%ProgramFiles%\Python311\;%ProgramFiles%\Python311\Scripts\"

if exist "%ProgramFiles%\Python311\python.exe" (
    "%ProgramFiles%\Python311\python.exe" -m pip install --upgrade pip
    "%ProgramFiles%\Python311\python.exe" -m pip install auto-editor
) else (
    python -m pip install --upgrade pip
    python -m pip install auto-editor
)

echo.
echo ===================================================
echo [SUCCESS] Core installation complete! 
echo.
echo IMPORTANT STEP BEFORE USING THE PLUGIN:
echo 1. Open Premiere Pro.
echo 2. Go to "Edit" -^> "Keyboard Shortcuts".
echo 3. Search for "Timeline" (Window -^> Timeline) and assign it to F8.
echo 4. Search for "Lift" and assign it to F7.
echo.
echo All set! The VafnirCut plugin will now work perfectly.
echo ===================================================
pause
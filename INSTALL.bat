@echo off
chcp 65001 >nul
color 0B

echo ===================================================
echo   АВТОМАТИЧЕСКАЯ УСТАНОВКА PYTHON И НЕЙРОСЕТИ
echo ===================================================
echo.

:: Проверка на права админа
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] Права администратора подтверждены.
) else (
    echo [ОШИБКА] Запусти файл от имени Администратора!
    pause
    exit
)

:: Проверяем, установлен ли Python уже, чтобы не качать заново
python --version >nul 2>&1
if %errorLevel% == 0 (
    echo [INFO] Python уже установлен в системе. Пропускаю шаг установки...
    goto install_auto_editor
)

echo [1/3] Скачиваю официальный установщик Python...
:: Добавлен флаг -L для следования перенаправлениям URL
curl -L -o python_installer.exe https://www.python.org/ftp/python/3.11.8/python-3.11.8-amd64.exe

if not exist python_installer.exe (
    echo [ОШИБКА] Не удалось скачать установщик. Проверьте интернет-соединение.
    pause
    exit
)

echo.
echo [2/3] Устанавливаю Python в скрытом режиме...
echo (Это может занять пару минут, ничего не нажимай)
:: Используем системную переменную %ProgramFiles% для надежности
start /wait python_installer.exe /quiet InstallAllUsers=1 PrependPath=1 Include_test=0

:: Удаляем установщик
del python_installer.exe

:install_auto_editor
echo.
echo [3/3] Устанавливаю пакет auto-editor...

:: Временное обновление путей для текущей сессии командной строки (с кавычками)
set "PATH=%PATH%;%ProgramFiles%\Python311\;%ProgramFiles%\Python311\Scripts\"

:: Безопасный вызов pip через модуль python с явным указанием пути
if exist "%ProgramFiles%\Python311\python.exe" (
    "%ProgramFiles%\Python311\python.exe" -m pip install --upgrade pip
    "%ProgramFiles%\Python311\python.exe" -m pip install auto-editor
) else (
    :: Если по какой-то причине путь отличается, пробуем стандартный вызов
    python -m pip install --upgrade pip
    python -m pip install auto-editor
)

echo Включаю поддержку плагина в Premiere Pro...
reg add "HKCU\Software\Adobe\CSXS.11" /v PlayerDebugMode /t REG_SZ /d "1" /f >nul
reg add "HKCU\Software\Adobe\CSXS.12" /v PlayerDebugMode /t REG_SZ /d "1" /f >nul
reg add "HKCU\Software\Adobe\CSXS.13" /v PlayerDebugMode /t REG_SZ /d "1" /f >nul
reg add "HKCU\Software\Adobe\CSXS.14" /v PlayerDebugMode /t REG_SZ /d "1" /f >nul
reg add "HKCU\Software\Adobe\CSXS.15" /v PlayerDebugMode /t REG_SZ /d "1" /f >nul
reg add "HKCU\Software\Adobe\CSXS.16" /v PlayerDebugMode /t REG_SZ /d "1" /f >nul

echo.
echo ===================================================
echo [УСПЕХ] Установка завершена! 
echo Рекомендуется перезагрузить компьютер (или перезапустить Premiere),
echo чтобы изменения путей вступили в силу.
echo ===================================================
pause
@echo off
rem Change to project directory
cd /d "%~dp0"

rem Activate virtual environment
call "%~dp0t_venv\Scripts\activate.bat"

rem Install requirements
pip install -r requirements.txt

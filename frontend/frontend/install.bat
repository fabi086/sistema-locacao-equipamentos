@echo off
echo ========================================
echo  Sistema de Locacao de Equipamentos
echo         Instalacao Automatica
echo ========================================
echo.

echo Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Instalando dependencias...
call npm run install-all

echo.
echo Configurando ambiente...
if not exist .env (
    copy .env.example .env
    echo Arquivo .env criado. Configure suas credenciais do MySQL.
)

echo.
echo ========================================
echo     Instalacao Concluida!
echo ========================================
echo.
echo Para iniciar: npm run dev
echo Acesse: http://localhost:3000
echo.
echo Login: admin@equipamentos.com
echo Senha: admin123
echo.
pause

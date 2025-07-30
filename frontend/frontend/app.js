console.log('🚀 Sistema de Locação carregando...');

// Variáveis globais
let isLoggedIn = false;
let currentUser = null;

// Dados de demonstração
const mockData = {
    totalEquipments: 25,
    availableEquipments: 18,
    rentedEquipments: 7,
    monthlyRevenue: 15750.00
};

// Função de login simplificada
function performLogin(email, password) {
    console.log('Tentativa de login:', email);
    
    // Credenciais válidas
    if (email === 'admin@equipamentos.com' && password === 'admin123') {
        isLoggedIn = true;
        currentUser = {
            name: 'Administrador Demo',
            email: email,
            role: 'admin'
        };
        
        // Salvar no localStorage
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Ocultar tela de login
        const loginScreen = document.getElementById('loginScreen');
        const dashboard = document.getElementById('dashboard');
        
        if (loginScreen) loginScreen.style.display = 'none';
        if (dashboard) dashboard.style.display = 'block';
        
        // Carregar dados do dashboard
        loadDashboardData();
        
        // Mostrar mensagem de sucesso
        showMessage('Login realizado com sucesso! Sistema em modo demonstração.', 'success');
        
        return true;
    } else {
        showMessage('Credenciais inválidas! Use: admin@equipamentos.com / admin123', 'error');
        return false;
    }
}

// Função logout
function logout() {
    isLoggedIn = false;
    currentUser = null;
    
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('currentUser');
    
    const loginScreen = document.getElementById('loginScreen');
    const dashboard = document.getElementById('dashboard');
    
    if (loginScreen) loginScreen.style.display = 'flex';
    if (dashboard) dashboard.style.display = 'none';
    
    showMessage('Logout realizado com sucesso!', 'info');
}

// Carregar dados do dashboard
function loadDashboardData() {
    console.log('Carregando dados do dashboard...');
    
    // Atualizar elementos do dashboard
    const elements = {
        'totalEquipments': mockData.totalEquipments,
        'availableEquipments': mockData.availableEquipments,
        'rentedEquipments': mockData.rentedEquipments
    };
    
    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = elements[id];
        }
    });
    
    // Atualizar receita mensal
    const revenueElement = document.querySelector('#dashboard .card-stat:last-child h3');
    if (revenueElement) {
        revenueElement.textContent = 'R$ ' + mockData.monthlyRevenue.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}

// Função para mostrar mensagens
function showMessage(message, type) {
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // Remover mensagens antigas
    const oldAlerts = document.querySelectorAll('.alert-message');
    oldAlerts.forEach(alert => alert.remove());
    
    // Criar nova mensagem
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show alert-message`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 500px;
    `;
    
    alertDiv.innerHTML = `
        <strong>${type === 'error' ? '❌ Erro!' : type === 'success' ? '✅ Sucesso!' : 'ℹ️ Info:'}</strong> ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}

// Verificar se já está logado
function checkLoginStatus() {
    const wasLoggedIn = localStorage.getItem('userLoggedIn');
    const userData = localStorage.getItem('currentUser');
    
    if (wasLoggedIn === 'true' && userData) {
        currentUser = JSON.parse(userData);
        isLoggedIn = true;
        
        const loginScreen = document.getElementById('loginScreen');
        const dashboard = document.getElementById('dashboard');
        
        if (loginScreen) loginScreen.style.display = 'none';
        if (dashboard) dashboard.style.display = 'block';
        
        loadDashboardData();
        showMessage(`Bem-vindo de volta, ${currentUser.name}!`, 'info');
    }
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM carregado - Inicializando sistema...');
    
    // Verificar login existente
    checkLoginStatus();
    
    // Configurar formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📝 Formulário de login submetido');
            
            const emailInput = document.getElementById('loginEmail');
            const passwordInput = document.getElementById('loginPassword');
            
            if (emailInput && passwordInput) {
                const email = emailInput.value.trim();
                const password = passwordInput.value.trim();
                
                if (email && password) {
                    performLogin(email, password);
                } else {
                    showMessage('Por favor, preencha email e senha.', 'error');
                }
            } else {
                console.error('Campos de login não encontrados');
                showMessage('Erro: Campos de login não encontrados.', 'error');
            }
        });
        
        console.log('✅ Event listener do formulário configurado');
    } else {
        console.error('Formulário de login não encontrado');
    }
    
    // Mostrar credenciais de demo após 2 segundos
    setTimeout(() => {
        if (!isLoggedIn) {
            showMessage('💡 DEMO: Use admin@equipamentos.com / admin123 para entrar', 'info');
        }
    }, 2000);
    
    console.log('🎉 Sistema inicializado com sucesso!');
});

// Verificar se há erros de carregamento
window.addEventListener('error', function(e) {
    console.error('Erro detectado:', e.message);
    showMessage('Erro no sistema. Verifique o console para detalhes.', 'error');
});

// Log de status
console.log('📄 Arquivo app.js carregado completamente');

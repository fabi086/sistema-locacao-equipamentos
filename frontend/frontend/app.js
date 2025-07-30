// API Configuration - Modo Demonstração para GitHub Pages
const API_BASE_URL = 'http://localhost:5000';
let authToken = localStorage.getItem('authToken');
let isDemo = true; // Modo demonstração ativo

// Dados simulados para demonstração
const demoData = {
    equipments: [
        { id: 1, name: 'Betoneira 400L', status: 'available', daily_price: 80.00, category: 'Betoneiras' },
        { id: 2, name: 'Furadeira Industrial', status: 'rented', daily_price: 45.00, category: 'Ferramentas' },
        { id: 3, name: 'Martelete Demolidor', status: 'maintenance', daily_price: 120.00, category: 'Martelos' },
        { id: 4, name: 'Compactador Solo', status: 'available', daily_price: 150.00, category: 'Compactadores' },
        { id: 5, name: 'Gerador 15KVA', status: 'available', daily_price: 200.00, category: 'Geradores' }
    ],
    clients: [
        { id: 1, name: 'Construtora ABC Ltda', email: 'contato@abc.com', phone: '(11) 98765-4321' },
        { id: 2, name: 'João Silva Construções', email: 'joao@silva.com', phone: '(11) 91234-5678' },
        { id: 3, name: 'Maria Santos', email: 'maria@email.com', phone: '(11) 99876-5432' }
    ]
};

// API Helper - Versão Demonstração
const api = {
    async request(endpoint, options = {}) {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
            if (isDemo) {
                // Retornar dados simulados baseado no endpoint
                return this.simulateAPI(endpoint, options);
            }
            
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            };

            if (authToken) {
                config.headers.Authorization = `Bearer ${authToken}`;
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro na requisição');
            }

            return data;
        } catch (error) {
            if (!isDemo) {
                showNotification('Modo demonstração ativado - Backend não disponível', 'info');
                isDemo = true;
                return this.simulateAPI(endpoint, options);
            }
            throw error;
        }
    },

    simulateAPI(endpoint, options) {
        // Simular respostas da API baseado no endpoint
        if (endpoint === '/auth/login') {
            return { 
                token: 'demo-token-123', 
                user: { id: 1, name: 'Administrador Demo', email: 'admin@equipamentos.com', role: 'admin' } 
            };
        } else if (endpoint === '/equipment') {
            return demoData.equipments;
        } else if (endpoint === '/clients') {
            return demoData.clients;
        } else if (endpoint === '/rentals/dashboard-stats') {
            return {
                total_equipment: demoData.equipments.length,
                available_equipment: demoData.equipments.filter(e => e.status === 'available').length,
                rented_equipment: demoData.equipments.filter(e => e.status === 'rented').length,
                monthly_revenue: 15750.00
            };
        }
        
        return { message: 'Endpoint simulado' };
    },

    async get(endpoint) {
        return this.request(endpoint);
    },

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
};

// Authentication - Versão corrigida
async function login(email, password) {
    try {
        showNotification('Conectando...', 'info');
        
        // Verificar credenciais de demonstração
        if (email === 'admin@equipamentos.com' && password === 'admin123') {
            const response = await api.post('/auth/login', { email, password });
            
            authToken = response.token;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            
            // Carregar dados do dashboard
            await loadDashboardData();
            
            showNotification(`Bem-vindo, ${response.user.name}! ${isDemo ? '(Modo Demonstração)' : ''}`, 'success');
        } else {
            throw new Error('Credenciais inválidas. Use: admin@equipamentos.com / admin123');
        }
    } catch (error) {
        showNotification('Erro no login: ' + error.message, 'error');
    }
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    authToken = null;
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    showNotification('Logout realizado com sucesso!', 'info');
}

// Carregar dados do dashboard
async function loadDashboardData() {
    try {
        const stats = await api.get('/rentals/dashboard-stats');
        
        document.getElementById('totalEquipments').textContent = stats.total_equipment;
        document.getElementById('availableEquipments').textContent = stats.available_equipment;
        document.getElementById('rentedEquipments').textContent = stats.rented_equipment;
        document.getElementById('monthlyRevenue').textContent = formatCurrency(stats.monthly_revenue);
        
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
    }
}

// Utility Functions
function showNotification(message, type) {
    // Remover notificações antigas
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show notification`;
    notification.innerHTML = `
        <strong>${type === 'error' ? 'Erro!' : type === 'success' ? 'Sucesso!' : 'Info:'}</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema de Locação de Equipamentos carregado!');
    console.log('📍 Modo:', isDemo ? 'Demonstração' : 'Produção');
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Adicionar indicador de carregamento
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
            submitBtn.disabled = true;
            
            try {
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                await login(email, password);
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Check if user is already logged in
    if (authToken) {
        const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        loadDashboardData();
        showNotification(`Bem-vindo de volta, ${userData.name || 'Usuário'}!`, 'info');
    }
    
    // Mostrar notificação de demonstração
    if (isDemo) {
        setTimeout(() => {
            showNotification('Este é um sistema de demonstração. Use: admin@equipamentos.com / admin123', 'info');
        }, 1000);
    }
});

// Prevenir erros de CORS no console
window.addEventListener('error', function(e) {
    if (e.message.includes('CORS') || e.message.includes('fetch')) {
        console.log('Modo demonstração ativo - Erros de rede são esperados');
        isDemo = true;
    }
});

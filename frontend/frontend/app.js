// API Configuration
const API_BASE_URL = 'http://localhost:5000';
let authToken = localStorage.getItem('authToken');

// API Helper
const api = {
    async request(endpoint, options = {}) {
        try {
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
            showNotification(error.message, 'error');
            throw error;
        }
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

// Authentication
async function login(email, password) {
    try {
        // Simulação de login para demonstração
        if (email === 'admin@equipamentos.com' && password === 'admin123') {
            authToken = 'demo-token-123';
            localStorage.setItem('authToken', authToken);
            
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            
            showNotification('Login realizado com sucesso!', 'success');
        } else {
            throw new Error('Credenciais inválidas');
        }
    } catch (error) {
        showNotification('Erro no login: ' + error.message, 'error');
    }
}

function logout() {
    localStorage.removeItem('authToken');
    authToken = null;
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    showNotification('Logout realizado com sucesso!', 'info');
}

// Utility Functions
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show notification`;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        await login(email, password);
    });
    
    // Check if user is already logged in
    if (authToken) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
    }
});

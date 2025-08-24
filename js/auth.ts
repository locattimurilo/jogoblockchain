// Configuração de usuários (mock)
var users = {
    'admin': { password: 'admin123', role: 'admin', name: 'Administrador' },
    'aluno': { password: 'aluno123', role: 'aluno', name: 'João Estudante' },
    'miner': { password: 'miner123', role: 'minerador', name: 'Minerador Alpha' }
};
// Autenticação
function login() {
    var username = document.getElementById('username').value.trim();
    var password = document.getElementById('password').value;
    var role = document.getElementById('userRole').value;
    var u = users[username];
    if (u && u.password === password && u.role === role) {
        currentUser = { username: username, role: u.role, name: u.name };
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainInterface').style.display = 'block';
        setupInterface();
        updateBlockchainInfo();
    }
    else {
        alert('Credenciais inválidas!');
    }
}
function logout() {
    currentUser = null;
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('mainInterface').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}
// Adicionar event listeners quando o DOM estiver carregado
// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', login);
  }
  
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
});
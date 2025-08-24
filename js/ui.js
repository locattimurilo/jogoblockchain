// Interface / Abas
function setupInterface(){
  document.getElementById('welcomeMessage').textContent = `Olá, ${currentUser.name}!`;
  document.getElementById('userRoleDisplay').textContent = `Logado como: ${currentUser.role}`;
  document.getElementById('userAvatar').textContent = currentUser.name.charAt(0);

  const tabsContainer = document.getElementById('tabsContainer');
  const tabContent = document.getElementById('tabContent');

  let tabs = [];
  if(currentUser.role === 'admin'){
    tabs = [
      { id: 'grades', name: 'Lançar Notas', icon: '📝' },
      { id: 'ledger', name: 'Ledger', icon: '📊' },
      { id: 'blockchain', name: 'Blockchain', icon: '🔗' },
      { id: 'management', name: 'Gerenciar', icon: '⚙️' },
      { id: 'mining', name: 'Mineração (Teste)', icon: '⛏️' }
    ];
  } else if(currentUser.role === 'minerador'){
    tabs = [
      { id: 'mining', name: 'Mineração', icon: '⛏️' },
      { id: 'rewards', name: 'Recompensas', icon: '💰' },
      { id: 'blockchain', name: 'Blockchain', icon: '🔗' }
    ];
  } else { // aluno
    tabs = [
      { id: 'consult', name: 'Consultar Notas', icon: '🔍' },
      { id: 'blockchain', name: 'Blockchain', icon: '🔗' }
    ];
  }

  tabsContainer.innerHTML = tabs.map((t, i) => (
    `<button class="tab ${i===0?'active':''}" onclick="switchTab('${t.id}')">${t.icon} ${t.name}</button>`
  )).join('');

  tabContent.innerHTML = tabs.map((t, i) => (
    `<div id="${t.id}" class="tab-content ${i===0?'active':''}">${getTabContent(t.id)}</div>`
  )).join('');

  // carregar dados específicos
  if(document.getElementById('ledgerTable')) loadLedger();
  if(document.getElementById('blockchainView')) renderBlockchain();
  if(document.getElementById('rewardsList')) renderRewards();
  if(document.getElementById('blockData')) updateMiningInterface();
}

function switchTab(tabId){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
  
  // Ativar a aba clicada
  const tabs = document.querySelectorAll('.tab');
  for (let tab of tabs) {
    if (tab.getAttribute('onclick').includes(tabId)) {
      tab.classList.add('active');
      break;
    }
  }
  
  document.getElementById(tabId).classList.add('active');

  if(tabId==='ledger') loadLedger();
  if(tabId==='blockchain') renderBlockchain();
  if(tabId==='rewards') renderRewards();
  if(tabId==='mining') updateMiningInterface();
}

function getTabContent(id){
  switch(id){
    case 'grades':
      return `
        <div class="card">
          <h2>📝 Lançar Nova Nota</h2>
          <div class="row">
            <div class="form-group">
              <label for="curso">Curso</label>
              <select id="curso">${cursos.map(c=>`<option value="${c}">${c}</option>`).join('')}</select>
            </div>
            <div class="form-group">
              <label for="estudante">Estudante (Chave)</label>
              <select id="estudante">${estudantes.map(s=>`<option value="${s}">${s}</option>`).join('')}</select>
            </div>
            <div class="form-group">
              <label for="nota">Nota</label>
              <select id="nota">
                <option value="A">A</option><option value="B">B</option><option value="C">C</option>
                <option value="D">D</option><option value="E">E</option><option value="F">F</option>
              </select>
            </div>
          </div>
          <button onclick="salvarNota()">Salvar Nota</button>
          <div id="gradeMessage"></div>
        </div>`;

    case 'ledger':
      return `
        <div class="card">
          <h2>📊 Ledger do Sistema</h2>
          <p class="muted" style="margin-bottom: 10px;">Registro de todas as transações pendentes e validadas.</p>
          <div id="ledgerTable"></div>
        </div>`;

    case 'consult':
      return `
        <div class="card">
          <h2>🔍 Consultar Suas Notas</h2>
          <div class="row">
            <div class="form-group">
              <label for="consultDisciplina">Disciplina</label>
              <select id="consultDisciplina">${cursos.map(c=>`<option value="${c}">${c}</option>`).join('')}</select>
            </div>
            <div class="form-group">
              <label for="chavePrivada">Sua Chave Privada</label>
              <input type="text" id="chavePrivada" placeholder="Digite sua chave privada" maxlength="6" />
            </div>
          </div>
          <button onclick="consultarNota()">Consultar Nota</button>
          <div id="consultResult"></div>
        </div>`;

    case 'mining':
      return `
        <div class="card">
          <h2>⛏️ Interface de Mineração</h2>
          <div class="mining-interface">
            <h3>Próximo Bloco para Minerar</h3>
            <div><strong>Bloco #<span id="currentBlockId">${nextBlockId}</span></strong></div>
            <div class="hash-display" id="blockData">Aguardando dados do bloco...</div>
            <div class="mining-controls">
              <div>
                <label>Nonce:</label>
                <input type="number" id="nonce" value="0" min="0" />
              </div>
              <button onclick="mineBlock()">Minerar (1 tentativa)</button>
            </div>
            <div style="margin-top:10px">
              <button onclick="autoMine(2000)">⏱️ Tentar automaticamente (2.000 tentativas)</button>
            </div>
            <div class="hash-display"><strong>Hash Resultado:</strong><div id="hashResult">—</div></div>
            <div id="miningMessage"></div>
          </div>
        </div>`;

    case 'management':
      return `
        <div class="card">
          <h2>⚙️ Gerenciamento do Sistema</h2>
          <div class="row">
            <button onclick="clearAllData()" style="background:#7c0a02">🗑️ Limpar Todos os Dados</button>
            <button onclick="exportData()" style="background:#0c5229">💾 Exportar Dados</button>
            <button onclick="importDataDialog()" style="background:#17a2b8">📥 Importar Dados</button>
            <button onclick="replicateData()" style="background:#ffc107; color:#333">🔄 Replicar para Mineradores</button>
          </div>
          <p id="managementMessage" class="muted" style="margin-top:10px"></p>
        </div>`;

    case 'blockchain':
      return `
        <div class="card">
          <h2>🔗 Visualizar Blockchain</h2>
          <p class="muted" style="margin-bottom: 10px;">Cadeia de blocos minerados</p>
          <div id="blockchainView"></div>
        </div>`;

    case 'rewards':
      return `
        <div class="card">
          <h2>💰 Recompensas de Mineração</h2>
          <div class="info-card" style="margin-bottom:20px"><h3>Blocos Minerados (você)</h3><div class="value" id="minedBlocks">0</div></div>
          <div id="rewardsList"></div>
        </div>`;

    default:
      return `<div class="card"><h2>Conteúdo não encontrado</h2></div>`;
  }
}

// Admin: salvar nota
function salvarNota(){
  const curso = document.getElementById('curso').value;
  const estudante = document.getElementById('estudante').value;
  const nota = document.getElementById('nota').value;

  const newEntry = {
    id: nextBlockId,
    curso, estudante, nota,
    timestamp: new Date().toISOString(),
    autor: currentUser.name,
    validated: false
  };

  ledgerData.push(newEntry);
  nextBlockId++;
  saveAll();

  document.getElementById('gradeMessage').innerHTML = `<div class="success-message">Nota salva com sucesso! Aguardando validação por mineração.</div>`;
  if(document.getElementById('ledgerTable')) loadLedger();
  updateMiningInterface();
  updateBlockchainInfo();
}

// Aluno: consultar nota
function consultarNota(){
  const disciplina = document.getElementById('consultDisciplina').value;
  const chave = document.getElementById('chavePrivada').value.trim();
  if(!chave){
    document.getElementById('consultResult').innerHTML = `<div class="error-message">Por favor, digite sua chave privada.</div>`;
    return;
  }

  const validated = blockchainData.find(b => b.data && b.data.curso===disciplina && b.data.estudante===chave);
  if(validated){
    document.getElementById('consultResult').innerHTML = `
      <div class="success-message">
        <strong>Nota:</strong> ${validated.data.nota}<br/>
        <strong>Curso:</strong> ${validated.data.curso}<br/>
        <strong>Bloco:</strong> #${validated.id}<br/>
        <strong>Hash:</strong> <span style="font-family:monospace;font-size:12px">${validated.hash}</span>
      </div>`;
    return;
  }

  const pending = ledgerData.find(e => e.curso===disciplina && e.estudante===chave && !e.validated);
  if(pending){
    document.getElementById('consultResult').innerHTML = `<div class="error-message">Nota encontrada, mas ainda não validada pela rede. Aguarde a mineração.</div>`;
  } else {
    document.getElementById('consultResult').innerHTML = `<div class="error-message">Nenhuma nota encontrada para esta disciplina e chave.</div>`;
  }
}

// Ledger / Blockchain views
function loadLedger(){
  const container = document.getElementById('ledgerTable');
  if(!container) return;

  if(ledgerData.length === 0){
    container.innerHTML = '<p class="muted">Nenhuma transação registrada.</p>';
    return;
  }

  const rows = ledgerData.map(e => `
    <tr>
      <td>${e.id}</td>
      <td>${e.curso}</td>
      <td>${e.estudante}</td>
      <td>${e.nota}</td>
      <td>${e.autor}</td>
      <td>${timestampFmt(e.timestamp)}</td>
      <td>${e.validated?'<span class="pill">validado</span>':'<span class="pill" style="background:#fee">pendente</span>'}</td>
    </tr>`).join('');

  container.innerHTML = `
    <table class="ledger-table">
      <thead><tr>
        <th>ID</th><th>Curso</th><th>Estudante</th><th>Nota</th><th>Autor</th><th>Data</th><th>Status</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function renderBlockchain(){
  const el = document.getElementById('blockchainView');
  if(!el) return;
  if(blockchainData.length===0){ el.innerHTML = '<p class="muted">Nenhum bloco minerado ainda.</p>'; return; }

  el.innerHTML = blockchainData.map(b => `
    <div class="card" style="border-left-color:#0c5229">
      <div class="row">
        <div><strong>#${b.id}</strong><br/><span class="muted">${timestampFmt(b.timestamp)}</span></div>
        <div>
          <div class="muted">Hash anterior</div>
          <div style="font-family:monospace;font-size:12px">${b.previousHash}</div>
        </div>
        <div>
          <div class="muted">Hash atual</div>
          <div style="font-family:monospace;font-size:12px">${b.hash}</div>
        </div>
        <div>
          <div class="muted">Nonce</div>
          <div>${b.nonce}</div>
        </div>
        <div>
          <div class="muted">Minerador</div>
          <div>${b.miner}</div>
        </div>
      </div>
      <div style="margin-top:12px">
        <div class="muted">Dados</div>
        <pre style="white-space:pre-wrap;background:#f7f7f7;border-radius:8px;padding:10px">${JSON.stringify(b.data, null, 2)}</pre>
      </div>
    </div>`).join('');
}

function updateBlockchainInfo(){
  document.getElementById('totalBlocks').textContent = blockchainData.length;
  document.getElementById('difficultyValue').textContent = DIFFICULTY;
  const last = blockchainData[blockchainData.length-1];
  document.getElementById('lastHash').textContent = last ? last.hash : '—';
  // mineradores ativos = todos com pelo menos 1 tentativa (aproximação): aqui usamos quem tem mined>0
  const active = Object.keys(minersStats).length || 1;
  document.getElementById('activeMiners').textContent = active;
}

// Recompensas
function renderRewards(){
  const me = minersStats[currentUser?.username]?.mined || 0;
  const meEl = document.getElementById('minedBlocks');
  if(meEl) meEl.textContent = me;
  const el = document.getElementById('rewardsList');
  if(!el) return;

  if(Object.keys(minersStats).length===0){ el.innerHTML = '<p class="muted">Nenhum minerador contabilizado.</p>'; return; }

  const items = Object.entries(minersStats)
    .sort((a,b)=>b[1].mined - a[1].mined)
    .map(([u,st]) => `<li><strong>${u}</strong>: ${st.mined} bloco(s)</li>`)
    .join('');
  el.innerHTML = `<ul>${items}</ul>`;
}

// Management
function clearAllData(){
  if(!confirm('Tem certeza que deseja limpar todos os dados?')) return;
  ledgerData = [];
  blockchainData = [];
  nextBlockId = 1;
  minersStats = {};
  replicationMarker = null;
  localStorage.clear();
  document.getElementById('managementMessage').textContent = 'Todos os dados foram apagados.';
  updateBlockchainInfo();
  if(document.getElementById('ledgerTable')) loadLedger();
  if(document.getElementById('blockchainView')) renderBlockchain();
  if(document.getElementById('rewardsList')) renderRewards();
  updateMiningInterface();
}

function exportData(){
  const data = { ledgerData, blockchainData, nextBlockId, minersStats, replicatedAt: replicationMarker };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `blockchain-educacional-export-${Date.now()}.json`;
  document.body.appendChild(a); 
  a.click(); 
  a.remove();
  URL.revokeObjectURL(url);
  document.getElementById('managementMessage').textContent = 'Exportação concluída.';
}

function importDataDialog(){
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.onchange = async (e)=>{
    const file = e.target.files[0];
    if(!file) return;
    const text = await file.text();
    try{
      const data = JSON.parse(text);
      ledgerData = data.ledgerData || [];
      blockchainData = data.blockchainData || [];
      nextBlockId = data.nextBlockId || 1;
      minersStats = data.minersStats || {};
      replicationMarker = data.replicatedAt || null;
      saveAll();
      document.getElementById('managementMessage').textContent = 'Importação concluída.';
      updateBlockchainInfo();
      if(document.getElementById('ledgerTable')) loadLedger();
      if(document.getElementById('blockchainView')) renderBlockchain();
      if(document.getElementById('rewardsList')) renderRewards();
      updateMiningInterface();
    }catch(err){
      alert('Arquivo inválido.');
    }
  };
  input.click();
}

function replicateData(){
  // No modelo independente (sem rede), a replicação é uma marcação
  replicationMarker = new Date().toISOString();
  saveAll();
  document.getElementById('managementMessage').textContent = `Dados "replicados" para mineradores/alunos em ${timestampFmt(replicationMarker)} (simulação local).`;

}
// Vincular eventos aos botões dinâmicos
function bindDynamicEvents() {
  // Botão de salvar nota
  const salvarNotaBtn = document.getElementById('salvarNotaBtn');
  if (salvarNotaBtn) {
    salvarNotaBtn.addEventListener('click', salvarNota);
  }
  
  // Botão de consultar nota
  const consultarNotaBtn = document.getElementById('consultarNotaBtn');
  if (consultarNotaBtn) {
    consultarNotaBtn.addEventListener('click', consultarNota);
  }
  
  // Botões de mineração
  const mineBlockBtn = document.getElementById('mineBlockBtn');
  if (mineBlockBtn) {
    mineBlockBtn.addEventListener('click', mineBlock);
  }
  
  const autoMineBtn = document.getElementById('autoMineBtn');
  if (autoMineBtn) {
    autoMineBtn.addEventListener('click', function() {
      autoMine(2000);
    });
  }
  
  // Botões de gerenciamento
  const clearDataBtn = document.getElementById('clearDataBtn');
  if (clearDataBtn) {
    clearDataBtn.addEventListener('click', clearAllData);
  }
  
  const exportDataBtn = document.getElementById('exportDataBtn');
  if (exportDataBtn) {
    exportDataBtn.addEventListener('click', exportData);
  }
  
  const importDataBtn = document.getElementById('importDataBtn');
  if (importDataBtn) {
    importDataBtn.addEventListener('click', importDataDialog);
  }
  
  const replicateDataBtn = document.getElementById('replicateDataBtn');
  if (replicateDataBtn) {
    replicateDataBtn.addEventListener('click', replicateData);
  }
}
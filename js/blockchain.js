// Estado do sistema (local)
let currentUser = null;
let ledgerData = JSON.parse(localStorage.getItem('ledgerData') || '[]');
let blockchainData = JSON.parse(localStorage.getItem('blockchainData') || '[]');
let nextBlockId = parseInt(localStorage.getItem('nextBlockId') || '1', 10);
let minersStats = JSON.parse(localStorage.getItem('minersStats') || '{}');
let replicationMarker = localStorage.getItem('replicatedAt') || null;

const cursos = ['Banco de Dados', 'Psicologia', 'História', 'Segurança do Trabalho', 'Engenharia'];
const estudantes = ['c67445','bd9ebc','da603d','fc45e2','ad59da','bde7af','e2dd8a'];
const DIFFICULTY = 4; // zeros iniciais

// Utilidades
async function sha256(message){
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2,'0')).join('');
}

function saveAll(){
  localStorage.setItem('ledgerData', JSON.stringify(ledgerData));
  localStorage.setItem('blockchainData', JSON.stringify(blockchainData));
  localStorage.setItem('nextBlockId', String(nextBlockId));
  localStorage.setItem('minersStats', JSON.stringify(minersStats));
  if(replicationMarker) localStorage.setItem('replicatedAt', replicationMarker);
}

function timestampFmt(ts){
  const d = new Date(ts);
  return d.toLocaleString();
}
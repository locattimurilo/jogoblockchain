// Mineração
function getPending(){
  return ledgerData.find(e => !e.validated) || null;
}

function updateMiningInterface(){
  const el = document.getElementById('blockData');
  if(!el) return;
  const pending = getPending();
  if(pending){
    document.getElementById('currentBlockId').textContent = pending.id;
    el.innerHTML = `
      <strong>Dados do Bloco:</strong><br/>
      ID: ${pending.id}<br/>
      Curso: ${pending.curso}<br/>
      Estudante: ${pending.estudante}<br/>
      Nota: ${pending.nota}<br/>
      Autor: ${pending.autor}<br/>
      Timestamp: ${timestampFmt(pending.timestamp)}
    `;
  } else {
    el.textContent = 'Nenhum bloco pendente para minerar.';
  }
}

async function mineOnce(nonce){
  const pending = getPending();
  if(!pending){
    document.getElementById('miningMessage').innerHTML = `<div class="error-message">Não há blocos pendentes para minerar.</div>`;
    return null;
  }

  const previousHash = blockchainData.length>0 ? blockchainData[blockchainData.length-1].hash : '0000000000000000';
  const payload = `${pending.id}|${previousHash}|${JSON.stringify(pending)}|${Date.now()}|${nonce}`;
  const hash = await sha256(payload);
  document.getElementById('hashResult').textContent = hash;
  return { pending, previousHash, hash, payload };
}

async function mineBlock(){
  const nonce = parseInt(document.getElementById('nonce').value || '0', 10);
  const result = await mineOnce(nonce);
  if(!result) return;

  const { pending, previousHash, hash } = result;
  if(hash.startsWith('0'.repeat(DIFFICULTY))){
    const block = {
      id: pending.id,
      previousHash,
      data: pending,
      timestamp: Date.now(),
      nonce,
      hash,
      miner: currentUser.name
    };
    blockchainData.push(block);
    pending.validated = true;

    // contabilizar minerador
    const key = currentUser.username;
    if(!minersStats[key]) minersStats[key] = { mined: 0 };
    minersStats[key].mined += 1;

    saveAll();
    document.getElementById('miningMessage').innerHTML = `
      <div class="success-message">🎉 Bloco minerado com sucesso!<br/>
        <strong>Hash:</strong> <span style="font-family:monospace">${hash}</span><br/>
        <strong>Nonce:</strong> ${nonce}
      </div>`;
    updateBlockchainInfo();
    updateMiningInterface();
    if(document.getElementById('rewardsList')) renderRewards();
    if(document.getElementById('blockchainView')) renderBlockchain();
  } else {
    document.getElementById('miningMessage').innerHTML = `
      <div class="error-message">Hash não atende à dificuldade (${DIFFICULTY} zeros). Tente outro nonce.</div>`;
  }
}

async function autoMine(limit=2000){
  const start = parseInt(document.getElementById('nonce').value || '0', 10);
  for(let i=0;i<limit;i++){
    document.getElementById('nonce').value = start + i;
    const res = await mineOnce(start + i);
    if(!res) return;
    if(res.hash.startsWith('0'.repeat(DIFFICULTY))){
      await mineBlock();
      return;
    }
  }
  document.getElementById('miningMessage').innerHTML = `<div class="error-message">Nenhum hash válido nas ${limit} tentativas. Continue tentando.</div>`;
}
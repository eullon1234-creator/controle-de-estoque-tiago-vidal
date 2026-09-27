const url = 'https://controle-de-estoque-tiago-vidal-eullon.aws-ap-northeast-1.turso.io/v2/pipeline';
const token = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTA1MzAzNzEsImlkIjoiMDFhMGUzZWMtMGYwMS03ZWQyLWEwNDctOTAzOTIzMTU4ZDg1Iiwia2lkIjoieVBrMDU1VFZmdmRERjRQQ0V6M2tLY1FjRm9QUW1QTUNXNXBiYWR4VTlaayIsInJpZCI6IjFjZmQzMjEyLWE5YmUtNDUyNi05MGNhLTIwNTQwNDk1OGFkOSJ9.jZalav1d9oUuLIbEE1o_OWhT6j6dZyeQ-WBfv2SYLI97Hv_LgAYY1gChB2MQKOrrezz60kSj1HtGolmsO5m5Cg';

function formatArg(val) {
  if (val === null || val === undefined) return { type: 'null' };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { type: 'integer', value: String(val) } : { type: 'float', value: val };
  }
  return { type: 'text', value: String(val) };
}

async function runStatements(stmts) {
  const requests = stmts.map(s => ({
    type: 'execute',
    stmt: { sql: s.sql, args: (s.args || []).map(formatArg) }
  }));
  requests.push({ type: 'close' });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests })
  });
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  return await res.json();
}

const FOTOS_PRODUTOS = {
  'Beliche Metálica Tubular Reforçada': 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
  'Colchão Solteiro Espuma D33 Antiácaro': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80',
  'Ar-Condicionado Split 12.000 BTUs Frio': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
  'Armário Metálico Vestiário 4 Portas c/ Chave': 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80',
  'Geladeira Duplex Frost Free 380L': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80',
  'Mesa de Refeição 6 Lugares c/ Cadeiras': 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=600&q=80',
  'Desinfetante Concentrado Pinho 5 Litros (Caixa c/ 4)': 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
  'Papel Higiênico Folha Dupla (Fardo c/ 64 rolos)': 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=600&q=80',
  'Água Sanitária 5 Litros (Galão)': 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=600&q=80',
  'Vassoura de Piaçava c/ Cabo Reforçado': 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80',
  'Saco de Lixo Reforçado 100L (Pacote c/ 100)': 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80',
  'Travesseiro Alojamento c/ Capa Impermeável': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
  'Lençol Solteiro com Elástico Percal': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
  'Lâmpada LED 15W Bivolt E27': 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=600&q=80',
  'Chuveiro Elétrico 220V 5500W Blindado': 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=600&q=80',
  'Fechadura Tubular para Porta com Chave': 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80'
};

const FOTOS_CASAS = {
  'casa-1': 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80',
  'casa-2': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
  'casa-3': 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80',
  'casa-4': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'
};

async function main() {
  console.log('🔄 Iniciando atualização de colunas de foto no Turso...');

  // 1. Tentar adicionar colunas foto_url caso ainda não existam
  try {
    await runStatements([{ sql: 'ALTER TABLE galpao_itens ADD COLUMN foto_url TEXT;' }]);
    console.log('✅ Coluna foto_url adicionada em galpao_itens');
  } catch (e) {
    console.log('ℹ️ Coluna foto_url já existe em galpao_itens');
  }

  try {
    await runStatements([{ sql: 'ALTER TABLE casa_moveis ADD COLUMN foto_url TEXT;' }]);
    console.log('✅ Coluna foto_url adicionada em casa_moveis');
  } catch (e) {
    console.log('ℹ️ Coluna foto_url já existe em casa_moveis');
  }

  try {
    await runStatements([{ sql: 'ALTER TABLE casas ADD COLUMN foto_url TEXT;' }]);
    console.log('✅ Coluna foto_url adicionada em casas');
  } catch (e) {
    console.log('ℹ️ Coluna foto_url já existe em casas');
  }

  // 2. Atualizar galpao_itens com fotos reais
  console.log('📦 Atualizando itens do Galpão com URLs de fotos...');
  const galpaoUpdates = [];
  for (const [nome, fotoUrl] of Object.entries(FOTOS_PRODUTOS)) {
    galpaoUpdates.push({
      sql: 'UPDATE galpao_itens SET foto_url = ? WHERE nome = ?',
      args: [fotoUrl, nome]
    });
  }
  await runStatements(galpaoUpdates);
  console.log(`✅ ${galpaoUpdates.length} itens do galpão atualizados com fotos.`);

  // 3. Atualizar casa_moveis com fotos
  console.log('🪑 Atualizando móveis das casas com URLs de fotos...');
  const moveisUpdates = [];
  for (const [nome, fotoUrl] of Object.entries(FOTOS_PRODUTOS)) {
    moveisUpdates.push({
      sql: 'UPDATE casa_moveis SET foto_url = ? WHERE item_nome = ?',
      args: [fotoUrl, nome]
    });
  }
  await runStatements(moveisUpdates);
  console.log(`✅ ${moveisUpdates.length} categorias de móveis das casas atualizadas com fotos.`);

  // 4. Atualizar casas com fotos
  console.log('🏠 Atualizando casas com fotos de fachada...');
  const casasUpdates = [];
  for (const [casaId, fotoUrl] of Object.entries(FOTOS_CASAS)) {
    casasUpdates.push({
      sql: 'UPDATE casas SET foto_url = ? WHERE id = ?',
      args: [fotoUrl, casaId]
    });
  }
  await runStatements(casasUpdates);
  console.log(`✅ ${casasUpdates.length} casas atualizadas com fotos.`);

  console.log('🎉 Migração de fotos no Turso finalizada com sucesso!');
}

main().catch(err => {
  console.error('❌ Falha na migração:', err);
  process.exit(1);
});

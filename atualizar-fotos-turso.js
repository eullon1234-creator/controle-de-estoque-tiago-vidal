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

// FOTOS EXATAS PESQUISADAS DIRETAMENTE PELO NOME DOS PRODUTOS REAIS
const FOTOS_PRODUTOS_EXATAS = {
  'Beliche Metálica Tubular Reforçada': 'https://brindustria.com.br/wp-content/uploads/2021/08/beliche-para-dormitorio-de-aco.jpg',
  'Colchão Solteiro Espuma D33 Antiácaro': 'https://moveisparaalojamento.com.br/wp-content/uploads/2024/06/colchao-solteiro-D33-selo-Inmetro.png',
  'Ar-Condicionado Split 12.000 BTUs Frio': 'https://sipolatti.vtexassets.com/arquivos/ids/215768/ar1.png',
  'Armário Metálico Vestiário 4 Portas c/ Chave': 'https://www.eliteaco.com.br/wp-content/uploads/2022/08/EA701CT-001-CINZA.jpg',
  'Geladeira Duplex Frost Free 380L': 'https://tfcz36.vtexassets.com/arquivos/ids/207712/917472_2.jpg.jpg',
  'Mesa de Refeição 6 Lugares c/ Cadeiras': 'https://cdn.awsli.com.br/600x450/1128/1128392/produto/96920479/whatsapp-image-2024-08-19-at-11-53-38--5--photoroom-twz3n4c2t7.jpg',
  'Desinfetante Concentrado Pinho 5 Litros (Caixa c/ 4)': 'https://superprobettanin.com.br/wp-content/uploads/2024/03/SP15565_DESINFETANTE-PINHO_2.jpg',
  'Papel Higiênico Folha Dupla (Fardo c/ 64 rolos)': 'https://milium.vtexassets.com/arquivos/ids/295801-800-450',
  'Água Sanitária 5 Litros (Galão)': 'https://fotos.oceanob2b.com/High/038546.jpg',
  'Vassoura de Piaçava c/ Cabo Reforçado': 'https://grupo3colinas.com.br/wp-content/uploads/2022/07/b7559a3661a9c8164341510d9062b7a0.png',
  'Saco de Lixo Reforçado 100L (Pacote c/ 100)': 'https://protelimp.com.br/wp-content/uploads/2022/04/saco-de-lixo-preto-100-litros-p5.png',
  'Travesseiro Alojamento c/ Capa Impermeável': 'https://images.tcdn.com.br/img/img_prod/452956/90_travesseiro_hospitalar_em_courvin_impermevel_50x70_1_20251111083100_472e282962c5.jpg',
  'Lençol Solteiro com Elástico Percal': 'https://precolandia.vtexassets.com/arquivos/ids/314111/Lenol-de-Solteiro-com-Elstico-Trigo---Tecebem.jpg',
  'Lâmpada LED 15W Bivolt E27': 'https://upload.wikimedia.org/wikipedia/commons/3/32/LED_bulb.jpg',
  'Chuveiro Elétrico 220V 5500W Blindado': 'https://chatuba.vtexassets.com/arquivos/ids/161809/Chuveiro-Maxi-Ducha-Branco-220V-4600W-Lorenzetti.jpg',
  'Fechadura Tubular para Porta com Chave': 'https://upload.wikimedia.org/wikipedia/commons/d/db/Door_lock.jpg'
};

const FOTOS_CASAS_EXATAS = {
  'casa-1': 'https://images.unsplash.com/photo-1590725140246-2015fa68f7b5?auto=format&fit=crop&w=600&q=80',
  'casa-2': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
  'casa-3': 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=600&q=80',
  'casa-4': 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=600&q=80'
};

async function main() {
  console.log('🔄 Atualizando fotos EXATAS no banco Turso...');

  const galpaoUpdates = [];
  for (const [nome, fotoUrl] of Object.entries(FOTOS_PRODUTOS_EXATAS)) {
    galpaoUpdates.push({
      sql: 'UPDATE galpao_itens SET foto_url = ? WHERE nome = ?',
      args: [fotoUrl, nome]
    });
  }
  await runStatements(galpaoUpdates);
  console.log(`✅ ${galpaoUpdates.length} produtos do Galpão atualizados com as fotos reais exatas.`);

  const moveisUpdates = [];
  for (const [nome, fotoUrl] of Object.entries(FOTOS_PRODUTOS_EXATAS)) {
    moveisUpdates.push({
      sql: 'UPDATE casa_moveis SET foto_url = ? WHERE item_nome = ?',
      args: [fotoUrl, nome]
    });
  }
  await runStatements(moveisUpdates);
  console.log(`✅ ${moveisUpdates.length} móveis das casas atualizados com as fotos reais exatas.`);

  const casasUpdates = [];
  for (const [casaId, fotoUrl] of Object.entries(FOTOS_CASAS_EXATAS)) {
    casasUpdates.push({
      sql: 'UPDATE casas SET foto_url = ? WHERE id = ?',
      args: [fotoUrl, casaId]
    });
  }
  await runStatements(casasUpdates);
  console.log(`✅ ${casasUpdates.length} casas atualizadas.`);

  console.log('🎉 Todas as fotos no Turso agora correspondem EXATAMENTE aos produtos!');
}

main().catch(err => {
  console.error('❌ Falha:', err);
  process.exit(1);
});

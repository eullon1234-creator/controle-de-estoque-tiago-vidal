const url = 'https://controle-de-estoque-tiago-vidal-eullon.aws-ap-northeast-1.turso.io/v2/pipeline';
const token = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTA1MzAzNzEsImlkIjoiMDFhMGUzZWMtMGYwMS03ZWQyLWEwNDctOTAzOTIzMTU4ZDg1Iiwia2lkIjoieVBrMDU1VFZmdmRERjRQQ0V6M2tLY1FjRm9QUW1QTUNXNXBiYWR4VTlaayIsInJpZCI6IjFjZmQzMjEyLWE5YmUtNDUyNi05MGNhLTIwNTQwNDk1OGFkOSJ9.jZalav1d9oUuLIbEE1o_OWhT6j6dZyeQ-WBfv2SYLI97Hv_LgAYY1gChB2MQKOrrezz60kSj1HtGolmsO5m5Cg';

function formatArg(val) {
  if (val === null || val === undefined) return { type: 'null' };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { type: 'integer', value: String(val) } : { type: 'float', value: val };
  }
  return { type: 'text', value: String(val) };
}

const GALPAO_SEEDS = [
  { id: 'item-1', nome: 'Beliche Metálica Tubular Reforçada', categoria: 'Móveis & Equipamentos', unidade: 'Unidade', saldoAtual: 10, estoqueMinimo: 4, localizacao: 'Setor Móveis - Pavilhão A', custoUnitario: 580.00, icone: 'fa-bed' },
  { id: 'item-2', nome: 'Colchão Solteiro Espuma D33 Antiácaro', categoria: 'Móveis & Equipamentos', unidade: 'Unidade', saldoAtual: 25, estoqueMinimo: 8, localizacao: 'Setor Móveis - Prateleira M1', custoUnitario: 240.00, icone: 'fa-mattress-pillow' },
  { id: 'item-3', nome: 'Ar-Condicionado Split 12.000 BTUs Frio', categoria: 'Móveis & Equipamentos', unidade: 'Unidade', saldoAtual: 8, estoqueMinimo: 3, localizacao: 'Setor Eletro - Box 02', custoUnitario: 1850.00, icone: 'fa-snowflake' },
  { id: 'item-4', nome: 'Armário Metálico Vestiário 4 Portas c/ Chave', categoria: 'Móveis & Equipamentos', unidade: 'Unidade', saldoAtual: 12, estoqueMinimo: 4, localizacao: 'Setor Móveis - Pavilhão B', custoUnitario: 420.00, icone: 'fa-door-closed' },
  { id: 'item-5', nome: 'Geladeira Duplex Frost Free 380L', categoria: 'Móveis & Equipamentos', unidade: 'Unidade', saldoAtual: 3, estoqueMinimo: 2, localizacao: 'Setor Eletro - Box 01', custoUnitario: 2600.00, icone: 'fa-refrigerator' },
  { id: 'item-6', nome: 'Mesa de Refeição 6 Lugares c/ Cadeiras', categoria: 'Móveis & Equipamentos', unidade: 'Unidade', saldoAtual: 4, estoqueMinimo: 2, localizacao: 'Setor Móveis - Pavilhão C', custoUnitario: 650.00, icone: 'fa-table' },
  { id: 'item-7', nome: 'Desinfetante Concentrado Pinho 5 Litros (Caixa c/ 4)', categoria: 'Produtos de Limpeza', unidade: 'Caixa', saldoAtual: 40, estoqueMinimo: 10, localizacao: 'Depósito Químicos - Prateleira C', custoUnitario: 54.00, icone: 'fa-spray-can-sparkles' },
  { id: 'item-8', nome: 'Papel Higiênico Folha Dupla (Fardo c/ 64 rolos)', categoria: 'Produtos de Limpeza', unidade: 'Fardo', saldoAtual: 60, estoqueMinimo: 15, localizacao: 'Pallet 01 - Almox Central', custoUnitario: 78.00, icone: 'fa-toilet-paper' },
  { id: 'item-9', nome: 'Água Sanitária 5 Litros (Galão)', categoria: 'Produtos de Limpeza', unidade: 'Galão', saldoAtual: 15, estoqueMinimo: 8, localizacao: 'Depósito Químicos - Prateleira B', custoUnitario: 16.50, icone: 'fa-bottle-droplet' },
  { id: 'item-10', nome: 'Vassoura de Piaçava c/ Cabo Reforçado', categoria: 'Produtos de Limpeza', unidade: 'Unidade', saldoAtual: 20, estoqueMinimo: 6, localizacao: 'Suporte Utilitários', custoUnitario: 18.00, icone: 'fa-broom' },
  { id: 'item-11', nome: 'Saco de Lixo Reforçado 100L (Pacote c/ 100)', categoria: 'Produtos de Limpeza', unidade: 'Pacote', saldoAtual: 18, estoqueMinimo: 5, localizacao: 'Prateleira Limpeza A', custoUnitario: 42.00, icone: 'fa-trash-can' },
  { id: 'item-12', nome: 'Travesseiro Alojamento c/ Capa Impermeável', categoria: 'Kits e Enxoval', unidade: 'Unidade', saldoAtual: 30, estoqueMinimo: 10, localizacao: 'Armário Têxtil 01', custoUnitario: 32.00, icone: 'fa-bed' },
  { id: 'item-13', nome: 'Lençol Solteiro com Elástico Percal', categoria: 'Kits e Enxoval', unidade: 'Unidade', saldoAtual: 50, estoqueMinimo: 15, localizacao: 'Armário Têxtil 02', custoUnitario: 28.00, icone: 'fa-rug' },
  { id: 'item-14', nome: 'Lâmpada LED 15W Bivolt E27', categoria: 'Manutenção Rápida', unidade: 'Unidade', saldoAtual: 50, estoqueMinimo: 15, localizacao: 'Gaveteiro Elétrica - Gaveta 1', custoUnitario: 9.50, icone: 'fa-lightbulb' },
  { id: 'item-15', nome: 'Chuveiro Elétrico 220V 5500W Blindado', categoria: 'Manutenção Rápida', unidade: 'Unidade', saldoAtual: 20, estoqueMinimo: 5, localizacao: 'Setor Hidráulica - Prateleira H', custoUnitario: 75.00, icone: 'fa-shower' },
  { id: 'item-16', nome: 'Fechadura Tubular para Porta com Chave', categoria: 'Manutenção Rápida', unidade: 'Unidade', saldoAtual: 12, estoqueMinimo: 4, localizacao: 'Gaveteiro Almoxarife - Gaveta 3', custoUnitario: 45.00, icone: 'fa-key' }
];

const CASAS_SEEDS = [
  {
    id: 'casa-1',
    nome: 'Casa 01',
    bloco: 'Bloco A',
    capacidade: 8,
    moradoresAtuais: 8,
    status: 'Ocupada',
    responsavelNome: 'Encarregado João Silva',
    responsavelEmpresa: 'Empreiteira Souza Alvenaria',
    responsavelTelefone: '(11) 98765-4321',
    responsavelQuarto: 'Quarto 01 - Cama A',
    dataCautela: '2026-09-10',
    observacoes: 'Alojamento da equipe de alvenaria e blocagem estrutural.'
  },
  {
    id: 'casa-2',
    nome: 'Casa 02',
    bloco: 'Bloco A',
    capacidade: 6,
    moradoresAtuais: 5,
    status: 'Ocupada',
    responsavelNome: 'Mestre Carlos Eduardo',
    responsavelEmpresa: 'Construtora Alfa Principal',
    responsavelTelefone: '(21) 99887-1122',
    responsavelQuarto: 'Quarto 01 - Cama B',
    dataCautela: '2026-09-12',
    observacoes: 'Equipe de armação pesada e carpinteiros.'
  },
  {
    id: 'casa-3',
    nome: 'Bloco B - Casa 03',
    bloco: 'Bloco B',
    capacidade: 6,
    moradoresAtuais: 6,
    status: 'Ocupada',
    responsavelNome: 'Encarregado Marcos Valério',
    responsavelEmpresa: 'Elétrica & Hidráulica Silva Ltda',
    responsavelTelefone: '(31) 97123-4567',
    responsavelQuarto: 'Quarto 02 - Cama A',
    dataCautela: '2026-09-15',
    observacoes: 'Equipe técnica de instalações elétricas e sanitárias.'
  },
  {
    id: 'casa-4',
    nome: 'Casa 04',
    bloco: 'Bloco C',
    capacidade: 4,
    moradoresAtuais: 2,
    status: 'Disponível',
    responsavelNome: 'Supervisor Roberto Mendes',
    responsavelEmpresa: 'Pintura & Acabamentos Express',
    responsavelTelefone: '(41) 98456-7890',
    responsavelQuarto: 'Quarto 01 - Cama A',
    dataCautela: '2026-09-18',
    observacoes: 'Possui 2 vagas livres disponíveis para novos alojados.'
  }
];

const CASA_MOVEIS_SEEDS = [
  // Casa 1
  { id: 'cm-1', casaId: 'casa-1', itemNome: 'Beliche Metálica Tubular Reforçada', categoria: 'Móveis & Equipamentos', quantidade: 4, estado: 'Bom', patrimonio: 'PAT-C01-01', observacoes: 'Beliches completas com escada de acesso' },
  { id: 'cm-2', casaId: 'casa-1', itemNome: 'Colchão Solteiro Espuma D33 Antiácaro', categoria: 'Móveis & Equipamentos', quantidade: 8, estado: 'Bom', patrimonio: 'PAT-C01-02', observacoes: 'Com capas impermeáveis' },
  { id: 'cm-3', casaId: 'casa-1', itemNome: 'Armário Metálico Vestiário 4 Portas c/ Chave', categoria: 'Móveis & Equipamentos', quantidade: 2, estado: 'Bom', patrimonio: 'PAT-C01-03', observacoes: 'Com todas as chaves e cadeados' },
  { id: 'cm-4', casaId: 'casa-1', itemNome: 'Geladeira Duplex Frost Free 380L', categoria: 'Móveis & Equipamentos', quantidade: 1, estado: 'Bom', patrimonio: 'PAT-C01-04', observacoes: 'Cozinha da casa 01' },
  { id: 'cm-5', casaId: 'casa-1', itemNome: 'Ar-Condicionado Split 12.000 BTUs Frio', categoria: 'Móveis & Equipamentos', quantidade: 2, estado: 'Bom', patrimonio: 'PAT-C01-05', observacoes: '1 no Quarto A, 1 no Quarto B' },
  { id: 'cm-6', casaId: 'casa-1', itemNome: 'Mesa de Refeição 6 Lugares c/ Cadeiras', categoria: 'Móveis & Equipamentos', quantidade: 1, estado: 'Regular', patrimonio: 'PAT-C01-06', observacoes: '2 cadeiras com desgaste nas borrachas' },

  // Casa 2
  { id: 'cm-7', casaId: 'casa-2', itemNome: 'Beliche Metálica Tubular Reforçada', categoria: 'Móveis & Equipamentos', quantidade: 3, estado: 'Bom', patrimonio: 'PAT-C02-01', observacoes: 'Em perfeito estado' },
  { id: 'cm-8', casaId: 'casa-2', itemNome: 'Colchão Solteiro Espuma D33 Antiácaro', categoria: 'Móveis & Equipamentos', quantidade: 6, estado: 'Bom', patrimonio: 'PAT-C02-02', observacoes: 'Higienizados recentemente' },
  { id: 'cm-9', casaId: 'casa-2', itemNome: 'Armário Metálico Vestiário 4 Portas c/ Chave', categoria: 'Móveis & Equipamentos', quantidade: 2, estado: 'Bom', patrimonio: 'PAT-C02-03', observacoes: '1 chave reserva no galpão' },
  { id: 'cm-10', casaId: 'casa-2', itemNome: 'Geladeira Duplex Frost Free 380L', categoria: 'Móveis & Equipamentos', quantidade: 1, estado: 'Bom', patrimonio: 'PAT-C02-04', observacoes: 'Funcionando 100%' },
  { id: 'cm-11', casaId: 'casa-2', itemNome: 'Ar-Condicionado Split 12.000 BTUs Frio', categoria: 'Móveis & Equipamentos', quantidade: 1, estado: 'Danificado - Solicitar Troca', patrimonio: 'PAT-C02-05', observacoes: 'Compressor parou de gelar no Quarto 01 - Troca urgente solicitada' },

  // Casa 3
  { id: 'cm-12', casaId: 'casa-3', itemNome: 'Beliche Metálica Tubular Reforçada', categoria: 'Móveis & Equipamentos', quantidade: 3, estado: 'Novo', patrimonio: 'PAT-C03-01', observacoes: 'Lote novo instalado em Setembro' },
  { id: 'cm-13', casaId: 'casa-3', itemNome: 'Colchão Solteiro Espuma D33 Antiácaro', categoria: 'Móveis & Equipamentos', quantidade: 6, estado: 'Novo', patrimonio: 'PAT-C03-02', observacoes: 'Novos lacrados' },
  { id: 'cm-14', casaId: 'casa-3', itemNome: 'Armário Metálico Vestiário 4 Portas c/ Chave', categoria: 'Móveis & Equipamentos', quantidade: 2, estado: 'Bom', patrimonio: 'PAT-C03-03', observacoes: 'Pintura epóxi intacta' },
  { id: 'cm-15', casaId: 'casa-3', itemNome: 'Geladeira Duplex Frost Free 380L', categoria: 'Móveis & Equipamentos', quantidade: 1, estado: 'Regular', patrimonio: 'PAT-C03-04', observacoes: 'Borracha da porta superior requer ajuste' },

  // Casa 4
  { id: 'cm-16', casaId: 'casa-4', itemNome: 'Beliche Metálica Tubular Reforçada', categoria: 'Móveis & Equipamentos', quantidade: 2, estado: 'Bom', patrimonio: 'PAT-C04-01', observacoes: 'Estrutura firme' },
  { id: 'cm-17', casaId: 'casa-4', itemNome: 'Colchão Solteiro Espuma D33 Antiácaro', categoria: 'Móveis & Equipamentos', quantidade: 4, estado: 'Bom', patrimonio: 'PAT-C04-02', observacoes: 'Todos ensacados com capa' },
  { id: 'cm-18', casaId: 'casa-4', itemNome: 'Armário Metálico Vestiário 4 Portas c/ Chave', categoria: 'Móveis & Equipamentos', quantidade: 1, estado: 'Bom', patrimonio: 'PAT-C04-03', observacoes: '4 portas com tranca' },
  { id: 'cm-19', casaId: 'casa-4', itemNome: 'Ar-Condicionado Split 12.000 BTUs Frio', categoria: 'Móveis & Equipamentos', quantidade: 1, estado: 'Regular', patrimonio: 'PAT-C04-04', observacoes: 'Filtro limpo recentemente' }
];

const CASA_ENTREGAS_SEEDS = [
  { id: 'ce-1', casaId: 'casa-1', itemNome: 'Desinfetante Concentrado Pinho 5 Litros', quantidade: 2, unidade: 'Galão', dataEntrega: '2026-09-20T10:00:00.000Z', responsavelEntrega: 'Carlos Almoxarife', responsavelRecebimento: 'João Silva', observacoes: 'Kit limpeza quinzenal' },
  { id: 'ce-2', casaId: 'casa-1', itemNome: 'Papel Higiênico Folha Dupla', quantidade: 1, unidade: 'Fardo', dataEntrega: '2026-09-20T10:05:00.000Z', responsavelEntrega: 'Carlos Almoxarife', responsavelRecebimento: 'João Silva', observacoes: 'Reposição para 8 colaboradores' },
  { id: 'ce-3', casaId: 'casa-2', itemNome: 'Desinfetante Concentrado Pinho 5 Litros', quantidade: 2, unidade: 'Galão', dataEntrega: '2026-09-22T14:30:00.000Z', responsavelEntrega: 'Carlos Almoxarife', responsavelRecebimento: 'Carlos Eduardo', observacoes: 'Limpeza geral da casa' },
  { id: 'ce-4', casaId: 'casa-3', itemNome: 'Saco de Lixo Reforçado 100L', quantidade: 1, unidade: 'Pacote', dataEntrega: '2026-09-24T09:15:00.000Z', responsavelEntrega: 'Carlos Almoxarife', responsavelRecebimento: 'Marcos Valério', observacoes: 'Uso na cozinha e banheiros' }
];

const MOVIMENTACOES_SEEDS = [
  { id: 'mov-101', tipo: 'ENTRADA', itemNome: 'Colchão Solteiro Espuma D33 Antiácaro', categoria: 'Móveis & Equipamentos', unidade: 'Unidade', quantidade: 25, casaId: null, casaNome: 'Galpão Central', responsavel: 'Carlos Almoxarife', empresa: 'Prefeitura do Canteiro', motivo: 'Compra de enxoval lote 04', dataHora: '2026-09-18T09:00:00.000Z', saldoAnterior: 0, saldoPosterior: 25, detalhes: 'NF-e 04819 Fornecedor Plumatex' },
  { id: 'mov-102', tipo: 'ENTRADA', itemNome: 'Beliche Metálica Tubular Reforçada', categoria: 'Móveis & Equipamentos', unidade: 'Unidade', quantidade: 10, casaId: null, casaNome: 'Galpão Central', responsavel: 'Carlos Almoxarife', empresa: 'Prefeitura do Canteiro', motivo: 'Recebimento de móveis novos para estoque reserva', dataHora: '2026-09-19T11:20:00.000Z', saldoAnterior: 0, saldoPosterior: 10, detalhes: 'NF-e 09283 Fornecedor AçoForte' },
  { id: 'mov-103', tipo: 'SAIDA_CASA', itemNome: 'Desinfetante Concentrado Pinho 5 Litros', categoria: 'Produtos de Limpeza', unidade: 'Galão', quantidade: 2, casaId: 'casa-1', casaNome: 'Casa 01', responsavel: 'João Silva', empresa: 'Empreiteira Souza Alvenaria', motivo: 'Reposição quinzenal de limpeza', dataHora: '2026-09-20T10:00:00.000Z', saldoAnterior: 42, saldoPosterior: 40, detalhes: 'Entregue com termo de cautela assinado' },
  { id: 'mov-104', tipo: 'SAIDA_CASA', itemNome: 'Papel Higiênico Folha Dupla', categoria: 'Produtos de Limpeza', unidade: 'Fardo', quantidade: 1, casaId: 'casa-1', casaNome: 'Casa 01', responsavel: 'João Silva', empresa: 'Empreiteira Souza Alvenaria', motivo: 'Consumo do alojamento', dataHora: '2026-09-20T10:05:00.000Z', saldoAnterior: 61, saldoPosterior: 60, detalhes: 'Fardo com 64 rolos' }
];

async function seed() {
  console.log('Populando dados realistas no Turso...');
  const requests = [];

  for (const item of GALPAO_SEEDS) {
    requests.push({
      type: 'execute',
      stmt: {
        sql: `INSERT OR REPLACE INTO galpao_itens (id, nome, categoria, unidade, saldo_atual, estoque_minimo, localizacao, custo_unitario, icone, data_cadastro)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          formatArg(item.id), formatArg(item.nome), formatArg(item.categoria), formatArg(item.unidade),
          formatArg(item.saldoAtual), formatArg(item.estoqueMinimo), formatArg(item.localizacao),
          formatArg(item.custoUnitario), formatArg(item.icone), formatArg(new Date().toISOString())
        ]
      }
    });
  }

  for (const c of CASAS_SEEDS) {
    requests.push({
      type: 'execute',
      stmt: {
        sql: `INSERT OR REPLACE INTO casas (id, nome, bloco, capacidade, moradores_atuais, status, responsavel_nome, responsavel_empresa, responsavel_telefone, responsavel_quarto, data_cautela, observacoes)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          formatArg(c.id), formatArg(c.nome), formatArg(c.bloco), formatArg(c.capacidade),
          formatArg(c.moradoresAtuais), formatArg(c.status), formatArg(c.responsavelNome),
          formatArg(c.responsavelEmpresa), formatArg(c.responsavelTelefone), formatArg(c.responsavelQuarto),
          formatArg(c.dataCautela), formatArg(c.observacoes)
        ]
      }
    });
  }

  for (const m of CASA_MOVEIS_SEEDS) {
    requests.push({
      type: 'execute',
      stmt: {
        sql: `INSERT OR REPLACE INTO casa_moveis (id, casa_id, item_nome, categoria, quantidade, estado, patrimonio, observacoes, data_instalacao)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          formatArg(m.id), formatArg(m.casaId), formatArg(m.itemNome), formatArg(m.categoria),
          formatArg(m.quantidade), formatArg(m.estado), formatArg(m.patrimonio), formatArg(m.observacoes),
          formatArg('2026-09-10')
        ]
      }
    });
  }

  for (const ce of CASA_ENTREGAS_SEEDS) {
    requests.push({
      type: 'execute',
      stmt: {
        sql: `INSERT OR REPLACE INTO casa_entregas (id, casa_id, item_nome, quantidade, unidade, data_entrega, responsavel_entrega, responsavel_recebimento, observacoes)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          formatArg(ce.id), formatArg(ce.casaId), formatArg(ce.itemNome), formatArg(ce.quantidade),
          formatArg(ce.unidade), formatArg(ce.dataEntrega), formatArg(ce.responsavelEntrega),
          formatArg(ce.responsavelRecebimento), formatArg(ce.observacoes)
        ]
      }
    });
  }

  for (const mov of MOVIMENTACOES_SEEDS) {
    requests.push({
      type: 'execute',
      stmt: {
        sql: `INSERT OR REPLACE INTO movimentacoes (id, tipo, item_nome, categoria, unidade, quantidade, casa_id, casa_nome, responsavel, empresa, motivo, data_hora, saldo_anterior, saldo_posterior, detalhes)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          formatArg(mov.id), formatArg(mov.tipo), formatArg(mov.itemNome), formatArg(mov.categoria),
          formatArg(mov.unidade), formatArg(mov.quantidade), formatArg(mov.casaId), formatArg(mov.casaNome),
          formatArg(mov.responsavel), formatArg(mov.empresa), formatArg(mov.motivo), formatArg(mov.dataHora),
          formatArg(mov.saldoAnterior), formatArg(mov.saldoPosterior), formatArg(mov.detalhes)
        ]
      }
    });
  }

  requests.push({ type: 'close' });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests })
  });

  const data = await res.json();
  console.log('DADOS REALISTAS INSERIDOS COM SUCESSO NO TURSO!', data.results?.length);
}

seed();

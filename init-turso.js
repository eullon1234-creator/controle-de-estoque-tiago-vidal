const url = 'https://controle-de-estoque-tiago-vidal-eullon.aws-ap-northeast-1.turso.io/v2/pipeline';
const token = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTA1MzAzNzEsImlkIjoiMDFhMGUzZWMtMGYwMS03ZWQyLWEwNDctOTAzOTIzMTU4ZDg1Iiwia2lkIjoieVBrMDU1VFZmdmRERjRQQ0V6M2tLY1FjRm9QUW1QTUNXNXBiYWR4VTlaayIsInJpZCI6IjFjZmQzMjEyLWE5YmUtNDUyNi05MGNhLTIwNTQwNDk1OGFkOSJ9.jZalav1d9oUuLIbEE1o_OWhT6j6dZyeQ-WBfv2SYLI97Hv_LgAYY1gChB2MQKOrrezz60kSj1HtGolmsO5m5Cg';

function formatArg(val) {
  if (val === null || val === undefined) return { type: 'null' };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { type: 'integer', value: String(val) } : { type: 'float', value: val };
  }
  return { type: 'text', value: String(val) };
}

const ITENS_PADRAO = [
  { id: 'item-1', nome: 'Travesseiro com Capa Impermeável', categoria: 'Roupas de Cama', unidade: 'Unidade', estoqueMinimo: 15, saldoAtual: 32, localizacao: 'Armário A - Prateleira 1', dataCadastro: '2026-09-01T08:00:00.000Z' },
  { id: 'item-2', nome: 'Lençol Solteiro com Elástico', categoria: 'Roupas de Cama', unidade: 'Unidade', estoqueMinimo: 30, saldoAtual: 65, localizacao: 'Armário A - Prateleira 2', dataCadastro: '2026-09-01T08:00:00.000Z' },
  { id: 'item-3', nome: 'Fronha Algodão Branca', categoria: 'Roupas de Cama', unidade: 'Unidade', estoqueMinimo: 30, saldoAtual: 48, localizacao: 'Armário A - Prateleira 3', dataCadastro: '2026-09-01T08:00:00.000Z' },
  { id: 'item-4', nome: 'Cobertor Térmico Microfibra', categoria: 'Roupas de Cama', unidade: 'Unidade', estoqueMinimo: 20, saldoAtual: 24, localizacao: 'Armário B - Prateleira 1', dataCadastro: '2026-09-01T08:00:00.000Z' },
  { id: 'item-5', nome: 'Sabão em Pó 1kg', categoria: 'Higiene & Limpeza', unidade: 'Pacote', estoqueMinimo: 15, saldoAtual: 8, localizacao: 'Depósito Limpeza - Prateleira C', dataCadastro: '2026-09-01T08:00:00.000Z' },
  { id: 'item-6', nome: 'Desinfetante Pinho 2 Litros', categoria: 'Higiene & Limpeza', unidade: 'Litro', estoqueMinimo: 15, saldoAtual: 22, localizacao: 'Depósito Limpeza - Prateleira C', dataCadastro: '2026-09-01T08:00:00.000Z' },
  { id: 'item-7', nome: 'Papel Higiênico Folha Dupla (Pct c/ 4)', categoria: 'Higiene & Limpeza', unidade: 'Pacote', estoqueMinimo: 25, saldoAtual: 0, localizacao: 'Depósito Limpeza - Pallet 1', dataCadastro: '2026-09-01T08:00:00.000Z' },
  { id: 'item-8', nome: 'Água Sanitária 2 Litros', categoria: 'Higiene & Limpeza', unidade: 'Litro', estoqueMinimo: 12, saldoAtual: 16, localizacao: 'Depósito Limpeza - Prateleira B', dataCadastro: '2026-09-01T08:00:00.000Z' },
  { id: 'item-9', nome: 'Vassoura de Piaçava c/ Cabo Reforçado', categoria: 'Utensílios', unidade: 'Unidade', estoqueMinimo: 6, saldoAtual: 3, localizacao: 'Suporte de Vassouras', dataCadastro: '2026-09-01T08:00:00.000Z' },
  { id: 'item-10', nome: 'Saco de Lixo Reforçado 100L (Pct c/ 20)', categoria: 'Higiene & Limpeza', unidade: 'Pacote', estoqueMinimo: 10, saldoAtual: 18, localizacao: 'Depósito Limpeza - Prateleira A', dataCadastro: '2026-09-01T08:00:00.000Z' },
  { id: 'item-11', nome: 'Cadeado Latão 25mm p/ Armário Alojamento', categoria: 'Manutenção', unidade: 'Unidade', estoqueMinimo: 8, saldoAtual: 14, localizacao: 'Gaveteiro Almoxarife - Gaveta 2', dataCadastro: '2026-09-01T08:00:00.000Z' },
  { id: 'item-12', nome: 'Detergente Neutro 500ml', categoria: 'Higiene & Limpeza', unidade: 'Unidade', estoqueMinimo: 20, saldoAtual: 35, localizacao: 'Depósito Limpeza - Prateleira D', dataCadastro: '2026-09-01T08:00:00.000Z' }
];

const MOVIMENTACOES_PADRAO = [
  {
    id: 'mov-1',
    tipo: 'ENTRADA',
    itemId: 'item-1',
    itemNome: 'Travesseiro com Capa Impermeável',
    categoria: 'Roupas de Cama',
    unidade: 'Unidade',
    quantidade: 35,
    saldoAnterior: 0,
    saldoPosterior: 35,
    dataHora: '2026-09-20T09:30:00.000Z',
    responsavel: 'Carlos Almoxarife',
    empresa: 'Prefeitura do Canteiro',
    quarto: 'Almoxarifado Central',
    tipoEntrada: 'com_nf',
    nfNumero: 'NF-e 004812',
    fornecedor: 'Distribuidora Têxtil do Vale',
    valorUnitario: 28.50,
    motivo: 'Compra contratual de enxoval para novo lote de alojados'
  },
  {
    id: 'mov-2',
    tipo: 'SAIDA',
    itemId: 'item-1',
    itemNome: 'Travesseiro com Capa Impermeável',
    categoria: 'Roupas de Cama',
    unidade: 'Unidade',
    quantidade: 3,
    saldoAnterior: 35,
    saldoPosterior: 32,
    dataHora: '2026-09-22T14:15:00.000Z',
    responsavel: 'Raimundo Nonato dos Santos',
    empresa: 'Empreiteira de Alvenaria Silva & Filhos',
    quarto: 'Quarto 04 - Bloco B',
    tipoEntrada: null,
    motivo: 'Admissão / Novo alojado',
    observacoes: 'Entregue 3 travesseiros para nova turma de pedreiros'
  },
  {
    id: 'mov-3',
    tipo: 'ENTRADA',
    itemId: 'item-5',
    itemNome: 'Sabão em Pó 1kg',
    categoria: 'Higiene & Limpeza',
    unidade: 'Pacote',
    quantidade: 10,
    saldoAnterior: 0,
    saldoPosterior: 10,
    dataHora: '2026-09-23T11:00:00.000Z',
    responsavel: 'Carlos Almoxarife',
    empresa: 'Prefeitura do Canteiro',
    quarto: 'Almoxarifado Central',
    tipoEntrada: 'sem_nf',
    origem: 'Compra Local Emergencial (Comércio da cidade)',
    motivo: 'Compra emergencial no supermercado da cidade para lavanderia dos alojamentos'
  },
  {
    id: 'mov-4',
    tipo: 'SAIDA',
    itemId: 'item-5',
    itemNome: 'Sabão em Pó 1kg',
    categoria: 'Higiene & Limpeza',
    unidade: 'Pacote',
    quantidade: 2,
    saldoAnterior: 10,
    saldoPosterior: 8,
    dataHora: '2026-09-25T08:30:00.000Z',
    responsavel: 'Maria Aparecida da Silva',
    empresa: 'Equipe de Limpeza e Governança',
    quarto: 'Lavanderia Geral - Bloco A',
    tipoEntrada: null,
    motivo: 'Reposição de limpeza de quarto/bloco',
    observacoes: 'Uso nas máquinas de lavar do alojamento'
  }
];

async function seed() {
  const requests = [];

  for (const item of ITENS_PADRAO) {
    requests.push({
      type: 'execute',
      stmt: {
        sql: `INSERT OR REPLACE INTO itens (id, nome, categoria, unidade, estoque_minimo, saldo_atual, localizacao, data_cadastro)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          formatArg(item.id),
          formatArg(item.nome),
          formatArg(item.categoria),
          formatArg(item.unidade),
          formatArg(item.estoqueMinimo),
          formatArg(item.saldoAtual),
          formatArg(item.localizacao),
          formatArg(item.dataCadastro)
        ]
      }
    });
  }

  for (const m of MOVIMENTACOES_PADRAO) {
    requests.push({
      type: 'execute',
      stmt: {
        sql: `INSERT OR REPLACE INTO movimentacoes (
          id, tipo, item_id, item_nome, categoria, unidade, quantidade,
          saldo_anterior, saldo_posterior, data_hora, responsavel, empresa,
          quarto, motivo, tipo_entrada, nf_numero, fornecedor, valor_unitario, observacoes, origem
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          formatArg(m.id),
          formatArg(m.tipo),
          formatArg(m.itemId),
          formatArg(m.itemNome),
          formatArg(m.categoria),
          formatArg(m.unidade),
          formatArg(m.quantidade),
          formatArg(m.saldoAnterior),
          formatArg(m.saldoPosterior),
          formatArg(m.dataHora),
          formatArg(m.responsavel),
          formatArg(m.empresa),
          formatArg(m.quarto),
          formatArg(m.motivo),
          formatArg(m.tipoEntrada),
          formatArg(m.nfNumero || null),
          formatArg(m.fornecedor || null),
          formatArg(m.valorUnitario || null),
          formatArg(m.observacoes || null),
          formatArg(m.origem || null)
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
  console.log('SEED TURSO EXECUTADO COM SUCESSO! Itens e movimentações inseridos.');
}

seed();

/**
 * Canteiro PRO - Gestão de Galpão Central & Cautela por Casas e Alojamentos
 * Integrado com Banco de Dados em Nuvem Turso (LibSQL) & Suporte Offline PWA
 */

// ==========================================
// ESTADO GLOBAL DA APLICAÇÃO
// ==========================================
const DB_KEYS = {
  GALPAO: 'canteiro_galpao_v2',
  CASAS: 'canteiro_casas_v2',
  CASA_MOVEIS: 'canteiro_casa_moveis_v2',
  CASA_ENTREGAS: 'canteiro_casa_entregas_v2',
  MOVIMENTACOES: 'canteiro_movs_v2',
  CONFIG: 'canteiro_config_v2'
};

let appState = {
  galpao: [],
  casas: [],
  casaMoveis: [],
  casaEntregas: [],
  movimentacoes: [],
  config: {
    nomeObra: 'Canteiro Central - Alojamento Tiago Vidal',
    turso: {
      url: 'https://controle-de-estoque-tiago-vidal-eullon.aws-ap-northeast-1.turso.io',
      token: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTA1MzAzNzEsImlkIjoiMDFhMGUzZWMtMGYwMS03ZWQyLWEwNDctOTAzOTIzMTU4ZDg1Iiwia2lkIjoieVBrMDU1VFZmdmRERjRQQ0V6M2tLY1FjRm9QUW1QTUNXNXBiYWR4VTlaayIsInJpZCI6IjFjZmQzMjEyLWE5YmUtNDUyNi05MGNhLTIwNTQwNDk1OGFkOSJ9.jZalav1d9oUuLIbEE1o_OWhT6j6dZyeQ-WBfv2SYLI97Hv_LgAYY1gChB2MQKOrrezz60kSj1HtGolmsO5m5Cg',
      ativo: true
    }
  },
  activeTab: 'dashboard',
  dossieCasaAtualId: null,
  activeDossieTab: 'moveis',
  tursoConectado: false,
  isOnline: navigator.onLine,
  chartFluxo: null,
  chartCategorias: null
};

// ==========================================
// SEEDS INICIAIS (FALLBACK OFFLINE)
// ==========================================
const SEEDS_GALPAO = [
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

const SEEDS_CASAS = [
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

const SEEDS_CASA_MOVEIS = [
  { id: 'cm-1', casaId: 'casa-1', itemNome: 'Beliche Metálica Tubular Reforçada', categoria: 'Móveis & Equipamentos', quantidade: 4, estado: 'Bom', patrimonio: 'PAT-C01-01', observacoes: 'Beliches completas com escada' },
  { id: 'cm-2', casaId: 'casa-1', itemNome: 'Colchão Solteiro Espuma D33 Antiácaro', categoria: 'Móveis & Equipamentos', quantidade: 8, estado: 'Bom', patrimonio: 'PAT-C01-02', observacoes: 'Com capas impermeáveis' },
  { id: 'cm-3', casaId: 'casa-1', itemNome: 'Armário Metálico Vestiário 4 Portas c/ Chave', categoria: 'Móveis & Equipamentos', quantidade: 2, estado: 'Bom', patrimonio: 'PAT-C01-03', observacoes: 'Com todas as chaves' },
  { id: 'cm-4', casaId: 'casa-1', itemNome: 'Geladeira Duplex Frost Free 380L', categoria: 'Móveis & Equipamentos', quantidade: 1, estado: 'Bom', patrimonio: 'PAT-C01-04', observacoes: 'Cozinha da casa 01' },
  { id: 'cm-5', casaId: 'casa-1', itemNome: 'Ar-Condicionado Split 12.000 BTUs Frio', categoria: 'Móveis & Equipamentos', quantidade: 2, estado: 'Bom', patrimonio: 'PAT-C01-05', observacoes: '1 no Quarto A, 1 no Quarto B' },
  { id: 'cm-6', casaId: 'casa-1', itemNome: 'Mesa de Refeição 6 Lugares c/ Cadeiras', categoria: 'Móveis & Equipamentos', quantidade: 1, estado: 'Regular', patrimonio: 'PAT-C01-06', observacoes: '2 cadeiras com desgaste' },

  { id: 'cm-7', casaId: 'casa-2', itemNome: 'Beliche Metálica Tubular Reforçada', categoria: 'Móveis & Equipamentos', quantidade: 3, estado: 'Bom', patrimonio: 'PAT-C02-01', observacoes: 'Em perfeito estado' },
  { id: 'cm-8', casaId: 'casa-2', itemNome: 'Colchão Solteiro Espuma D33 Antiácaro', categoria: 'Móveis & Equipamentos', quantidade: 6, estado: 'Bom', patrimonio: 'PAT-C02-02', observacoes: 'Higienizados' },
  { id: 'cm-9', casaId: 'casa-2', itemNome: 'Armário Metálico Vestiário 4 Portas c/ Chave', categoria: 'Móveis & Equipamentos', quantidade: 2, estado: 'Bom', patrimonio: 'PAT-C02-03', observacoes: 'Trancas funcionando' },
  { id: 'cm-10', casaId: 'casa-2', itemNome: 'Geladeira Duplex Frost Free 380L', categoria: 'Móveis & Equipamentos', quantidade: 1, estado: 'Bom', patrimonio: 'PAT-C02-04', observacoes: 'Funcionando 100%' },
  { id: 'cm-11', casaId: 'casa-2', itemNome: 'Ar-Condicionado Split 12.000 BTUs Frio', categoria: 'Móveis & Equipamentos', quantidade: 1, estado: 'Danificado - Solicitar Troca', patrimonio: 'PAT-C02-05', observacoes: 'Compressor parou de gelar no Quarto 01 - Troca urgente solicitada' },

  { id: 'cm-12', casaId: 'casa-3', itemNome: 'Beliche Metálica Tubular Reforçada', categoria: 'Móveis & Equipamentos', quantidade: 3, estado: 'Novo', patrimonio: 'PAT-C03-01', observacoes: 'Lote novo instalado em Setembro' },
  { id: 'cm-13', casaId: 'casa-3', itemNome: 'Colchão Solteiro Espuma D33 Antiácaro', categoria: 'Móveis & Equipamentos', quantidade: 6, estado: 'Novo', patrimonio: 'PAT-C03-02', observacoes: 'Novos lacrados' },
  { id: 'cm-14', casaId: 'casa-3', itemNome: 'Armário Metálico Vestiário 4 Portas c/ Chave', categoria: 'Móveis & Equipamentos', quantidade: 2, estado: 'Bom', patrimonio: 'PAT-C03-03', observacoes: 'Pintura epóxi intacta' },
  { id: 'cm-15', casaId: 'casa-3', itemNome: 'Geladeira Duplex Frost Free 380L', categoria: 'Móveis & Equipamentos', quantidade: 1, estado: 'Regular', patrimonio: 'PAT-C03-04', observacoes: 'Borracha da porta superior' },

  { id: 'cm-16', casaId: 'casa-4', itemNome: 'Beliche Metálica Tubular Reforçada', categoria: 'Móveis & Equipamentos', quantidade: 2, estado: 'Bom', patrimonio: 'PAT-C04-01', observacoes: 'Estrutura firme' },
  { id: 'cm-17', casaId: 'casa-4', itemNome: 'Colchão Solteiro Espuma D33 Antiácaro', categoria: 'Móveis & Equipamentos', quantidade: 4, estado: 'Bom', patrimonio: 'PAT-C04-02', observacoes: 'Ensacados com capa' },
  { id: 'cm-18', casaId: 'casa-4', itemNome: 'Armário Metálico Vestiário 4 Portas c/ Chave', categoria: 'Móveis & Equipamentos', quantidade: 1, estado: 'Bom', patrimonio: 'PAT-C04-03', observacoes: '4 portas com chave' },
  { id: 'cm-19', casaId: 'casa-4', itemNome: 'Ar-Condicionado Split 12.000 BTUs Frio', categoria: 'Móveis & Equipamentos', quantidade: 1, estado: 'Regular', patrimonio: 'PAT-C04-04', observacoes: 'Filtro limpo recentemente' }
];

const SEEDS_CASA_ENTREGAS = [
  { id: 'ce-1', casaId: 'casa-1', itemNome: 'Desinfetante Concentrado Pinho 5 Litros', quantidade: 2, unidade: 'Galão', dataEntrega: '2026-09-20T10:00:00.000Z', responsavelEntrega: 'Carlos Almoxarife', responsavelRecebimento: 'João Silva', observacoes: 'Kit quinzenal' },
  { id: 'ce-2', casaId: 'casa-1', itemNome: 'Papel Higiênico Folha Dupla', quantidade: 1, unidade: 'Fardo', dataEntrega: '2026-09-20T10:05:00.000Z', responsavelEntrega: 'Carlos Almoxarife', responsavelRecebimento: 'João Silva', observacoes: 'Consumo da casa' },
  { id: 'ce-3', casaId: 'casa-2', itemNome: 'Desinfetante Concentrado Pinho 5 Litros', quantidade: 2, unidade: 'Galão', dataEntrega: '2026-09-22T14:30:00.000Z', responsavelEntrega: 'Carlos Almoxarife', responsavelRecebimento: 'Carlos Eduardo', observacoes: 'Limpeza geral' },
  { id: 'ce-4', casaId: 'casa-3', itemNome: 'Saco de Lixo Reforçado 100L', quantidade: 1, unidade: 'Pacote', dataEntrega: '2026-09-24T09:15:00.000Z', responsavelEntrega: 'Carlos Almoxarife', responsavelRecebimento: 'Marcos Valério', observacoes: 'Cozinha e banheiros' }
];

const SEEDS_MOVS = [
  { id: 'mov-101', tipo: 'ENTRADA', itemNome: 'Colchão Solteiro Espuma D33 Antiácaro', categoria: 'Móveis & Equipamentos', unidade: 'Unidade', quantidade: 25, casaId: null, casaNome: 'Galpão Central', responsavel: 'Carlos Almoxarife', empresa: 'Prefeitura do Canteiro', motivo: 'Compra de enxoval lote 04', dataHora: '2026-09-18T09:00:00.000Z', saldoAnterior: 0, saldoPosterior: 25, detalhes: 'NF-e 04819 Fornecedor Plumatex' },
  { id: 'mov-102', tipo: 'ENTRADA', itemNome: 'Beliche Metálica Tubular Reforçada', categoria: 'Móveis & Equipamentos', unidade: 'Unidade', quantidade: 10, casaId: null, casaNome: 'Galpão Central', responsavel: 'Carlos Almoxarife', empresa: 'Prefeitura do Canteiro', motivo: 'Recebimento de móveis novos para reserva', dataHora: '2026-09-19T11:20:00.000Z', saldoAnterior: 0, saldoPosterior: 10, detalhes: 'NF-e 09283 Fornecedor AçoForte' },
  { id: 'mov-103', tipo: 'SAIDA_CASA', itemNome: 'Desinfetante Concentrado Pinho 5 Litros', categoria: 'Produtos de Limpeza', unidade: 'Galão', quantidade: 2, casaId: 'casa-1', casaNome: 'Casa 01', responsavel: 'João Silva', empresa: 'Empreiteira Souza Alvenaria', motivo: 'Reposição quinzenal de limpeza', dataHora: '2026-09-20T10:00:00.000Z', saldoAnterior: 42, saldoPosterior: 40, detalhes: 'Entregue para Encarregado João Silva' },
  { id: 'mov-104', tipo: 'SAIDA_CASA', itemNome: 'Papel Higiênico Folha Dupla', categoria: 'Produtos de Limpeza', unidade: 'Fardo', quantidade: 1, casaId: 'casa-1', casaNome: 'Casa 01', responsavel: 'João Silva', empresa: 'Empreiteira Souza Alvenaria', motivo: 'Consumo do alojamento', dataHora: '2026-09-20T10:05:00.000Z', saldoAnterior: 61, saldoPosterior: 60, detalhes: 'Fardo com 64 rolos' }
];

// ==========================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  carregarDadosLocais();
  configurarDataTopo();
  configurarEventosRede();
  renderApp();
  await inicializarTursoSeDisponivel();
});

function carregarDadosLocais() {
  const g = localStorage.getItem(DB_KEYS.GALPAO);
  const c = localStorage.getItem(DB_KEYS.CASAS);
  const cm = localStorage.getItem(DB_KEYS.CASA_MOVEIS);
  const ce = localStorage.getItem(DB_KEYS.CASA_ENTREGAS);
  const m = localStorage.getItem(DB_KEYS.MOVIMENTACOES);
  const cfg = localStorage.getItem(DB_KEYS.CONFIG);

  appState.galpao = g ? JSON.parse(g) : [...SEEDS_GALPAO];
  appState.casas = c ? JSON.parse(c) : [...SEEDS_CASAS];
  appState.casaMoveis = cm ? JSON.parse(cm) : [...SEEDS_CASA_MOVEIS];
  appState.casaEntregas = ce ? JSON.parse(ce) : [...SEEDS_CASA_ENTREGAS];
  appState.movimentacoes = m ? JSON.parse(m) : [...SEEDS_MOVS];

  if (cfg) {
    try {
      appState.config = Object.assign(appState.config, JSON.parse(cfg));
    } catch (e) {}
  }

  // Preenche dados do config
  const elObra = document.getElementById('nome-obra-txt');
  if (elObra) elObra.textContent = appState.config.nomeObra;
  const inObra = document.getElementById('cfg-nome-obra');
  if (inObra) inObra.value = appState.config.nomeObra;

  const inTursoUrl = document.getElementById('cfg-turso-url');
  if (inTursoUrl && appState.config.turso?.url) inTursoUrl.value = appState.config.turso.url;
  const inTursoToken = document.getElementById('cfg-turso-token');
  if (inTursoToken && appState.config.turso?.token) inTursoToken.value = appState.config.turso.token;
}

function salvarLocalmente() {
  localStorage.setItem(DB_KEYS.GALPAO, JSON.stringify(appState.galpao));
  localStorage.setItem(DB_KEYS.CASAS, JSON.stringify(appState.casas));
  localStorage.setItem(DB_KEYS.CASA_MOVEIS, JSON.stringify(appState.casaMoveis));
  localStorage.setItem(DB_KEYS.CASA_ENTREGAS, JSON.stringify(appState.casaEntregas));
  localStorage.setItem(DB_KEYS.MOVIMENTACOES, JSON.stringify(appState.movimentacoes));
  localStorage.setItem(DB_KEYS.CONFIG, JSON.stringify(appState.config));
}

function configurarDataTopo() {
  const el = document.getElementById('data-topo');
  if (el) {
    const hoje = new Date();
    el.textContent = hoje.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
  }
}

function configurarEventosRede() {
  window.addEventListener('online', () => {
    appState.isOnline = true;
    atualizarBadgeConexao();
    mostrarToast('Conexão com a internet restabelecida!', 'success');
    inicializarTursoSeDisponivel();
  });

  window.addEventListener('offline', () => {
    appState.isOnline = false;
    atualizarBadgeConexao();
    mostrarToast('Canteiro offline! Dados gravados no cache seguro.', 'warning');
  });

  atualizarBadgeConexao();
}

function atualizarBadgeConexao() {
  const icon = document.getElementById('cloud-icon');
  const label = document.getElementById('cloud-label');
  const modalBadge = document.getElementById('badge-turso-modal');

  if (!appState.isOnline) {
    if (icon) icon.className = 'fa-solid fa-plane-slash text-rose-400';
    if (label) label.textContent = 'Modo Offline';
    if (modalBadge) {
      modalBadge.className = 'text-xs px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-700 font-semibold';
      modalBadge.textContent = 'Sem Conexão';
    }
  } else if (appState.tursoConectado) {
    if (icon) icon.className = 'fa-solid fa-server text-emerald-400 animate-pulse';
    if (label) label.textContent = 'Turso Conectado';
    if (modalBadge) {
      modalBadge.className = 'text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700 font-semibold';
      modalBadge.textContent = 'Conectado em Tempo Real';
    }
  } else {
    if (icon) icon.className = 'fa-solid fa-database text-amber-400';
    if (label) label.textContent = 'Modo Local';
    if (modalBadge) {
      modalBadge.className = 'text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-semibold';
      modalBadge.textContent = 'Modo Local';
    }
  }
}

// ==========================================
// INTEGRAÇÃO BANCO DE DADOS TURSO (LIBSQL)
// ==========================================
function getTursoPipelineUrl() {
  if (!appState.config.turso?.url) return null;
  let u = appState.config.turso.url.trim();
  if (u.startsWith('libsql://')) u = u.replace('libsql://', 'https://');
  if (!u.startsWith('http://') && !u.startsWith('https://')) u = 'https://' + u;
  if (u.endsWith('/')) u = u.slice(0, -1);
  if (!u.endsWith('/v2/pipeline')) u += '/v2/pipeline';
  return u;
}

function formatTursoArg(val) {
  if (val === null || val === undefined) return { type: 'null' };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { type: 'integer', value: String(val) } : { type: 'float', value: val };
  }
  return { type: 'text', value: String(val) };
}

function parseTursoResult(resultObj) {
  if (!resultObj?.cols || !resultObj?.rows) return [];
  const cols = resultObj.cols.map(c => c.name);
  return resultObj.rows.map(row => {
    const item = {};
    row.forEach((colVal, idx) => {
      const colName = cols[idx];
      if (!colVal || colVal.type === 'null') item[colName] = null;
      else if (colVal.type === 'integer') item[colName] = parseInt(colVal.value, 10);
      else if (colVal.type === 'float') item[colName] = parseFloat(colVal.value);
      else item[colName] = colVal.value;
    });
    return item;
  });
}

async function executarTursoBatch(statements) {
  const pUrl = getTursoPipelineUrl();
  const token = appState.config.turso?.token?.trim();
  if (!pUrl || !token) return null;

  const requests = statements.map(st => ({
    type: 'execute',
    stmt: { sql: st.sql, args: (st.args || []).map(formatTursoArg) }
  }));
  requests.push({ type: 'close' });

  const res = await fetch(pUrl, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests })
  });

  if (!res.ok) throw new Error(`Turso HTTP ${res.status}`);
  const data = await res.json();
  return data.results;
}

async function executarTurso(sql, args = []) {
  const results = await executarTursoBatch([{ sql, args }]);
  if (results && results[0]?.type === 'ok') {
    return parseTursoResult(results[0].response.result);
  } else if (results && results[0]?.type === 'error') {
    throw new Error(results[0].error?.message || 'Erro SQL no Turso');
  }
  return [];
}

async function inicializarTursoSeDisponivel() {
  if (!appState.config.turso?.url || !appState.config.turso?.token || !appState.isOnline) {
    appState.tursoConectado = false;
    atualizarBadgeConexao();
    return;
  }

  try {
    const results = await executarTursoBatch([
      { sql: 'SELECT * FROM galpao_itens ORDER BY nome ASC' },
      { sql: 'SELECT * FROM casas ORDER BY nome ASC' },
      { sql: 'SELECT * FROM casa_moveis' },
      { sql: 'SELECT * FROM casa_entregas ORDER BY data_entrega DESC' },
      { sql: 'SELECT * FROM movimentacoes ORDER BY data_hora DESC LIMIT 100' }
    ]);

    if (results && results.every(r => r.type === 'ok')) {
      const g = parseTursoResult(results[0].response.result);
      const c = parseTursoResult(results[1].response.result);
      const cm = parseTursoResult(results[2].response.result);
      const ce = parseTursoResult(results[3].response.result);
      const m = parseTursoResult(results[4].response.result);

      if (g.length > 0) {
        appState.galpao = g.map(r => ({
          id: r.id, nome: r.nome, categoria: r.categoria, unidade: r.unidade,
          saldoAtual: Number(r.saldo_atual) || 0, estoqueMinimo: Number(r.estoque_minimo) || 0,
          localizacao: r.localizacao || '', custoUnitario: Number(r.custo_unitario) || 0,
          icone: r.icone || 'fa-box'
        }));
      }

      if (c.length > 0) {
        appState.casas = c.map(r => ({
          id: r.id, nome: r.nome, bloco: r.bloco, capacidade: Number(r.capacidade) || 6,
          moradoresAtuais: Number(r.moradores_atuais) || 0, status: r.status,
          responsavelNome: r.responsavel_nome, responsavelEmpresa: r.responsavel_empresa,
          responsavelTelefone: r.responsavel_telefone, responsavelQuarto: r.responsavel_quarto,
          dataCautela: r.data_cautela, observacoes: r.observacoes
        }));
      }

      if (cm.length > 0) {
        appState.casaMoveis = cm.map(r => ({
          id: r.id, casaId: r.casa_id, itemNome: r.item_nome, categoria: r.categoria,
          quantidade: Number(r.quantidade) || 1, estado: r.estado, patrimonio: r.patrimonio,
          observacoes: r.observacoes
        }));
      }

      if (ce.length > 0) {
        appState.casaEntregas = ce.map(r => ({
          id: r.id, casaId: r.casa_id, itemNome: r.item_nome, quantidade: Number(r.quantidade) || 1,
          unidade: r.unidade, dataEntrega: r.data_entrega, responsavelEntrega: r.responsavel_entrega,
          responsavelRecebimento: r.responsavel_recebimento, observacoes: r.observacoes
        }));
      }

      if (m.length > 0) {
        appState.movimentacoes = m.map(r => ({
          id: r.id, tipo: r.tipo, itemNome: r.item_nome, categoria: r.categoria,
          unidade: r.unidade, quantidade: Number(r.quantidade) || 1, casaId: r.casa_id,
          casaNome: r.casa_nome, responsavel: r.responsavel, empresa: r.empresa,
          motivo: r.motivo, dataHora: r.data_hora, saldoAnterior: Number(r.saldo_anterior) || 0,
          saldoPosterior: Number(r.saldo_posterior) || 0, detalhes: r.detalhes
        }));
      }

      appState.tursoConectado = true;
      salvarLocalmente();
      atualizarBadgeConexao();
      renderApp();
    }
  } catch (err) {
    console.warn('Erro ao sincronizar com Turso:', err);
    appState.tursoConectado = false;
    atualizarBadgeConexao();
  }
}

async function testarEConectarTurso() {
  const u = document.getElementById('cfg-turso-url')?.value.trim();
  const t = document.getElementById('cfg-turso-token')?.value.trim();
  if (!u || !t) {
    mostrarToast('Informe a URL e o Token do Turso!', 'warning');
    return;
  }
  appState.config.turso = { url: u, token: t, ativo: true };
  mostrarToast('Conectando ao Turso...', 'info');

  try {
    const res = await executarTurso('SELECT 1 as teste');
    if (res?.length > 0) {
      appState.tursoConectado = true;
      salvarLocalmente();
      atualizarBadgeConexao();
      mostrarToast('✅ Banco Turso conectado com sucesso!', 'success');
      await inicializarTursoSeDisponivel();
    }
  } catch (err) {
    appState.tursoConectado = false;
    atualizarBadgeConexao();
    mostrarToast('Erro ao conectar: ' + err.message, 'error');
  }
}

async function sincronizarTudoTurso() {
  mostrarToast('Enviando dados para a nuvem...', 'info');
  try {
    const reqs = [];
    appState.galpao.forEach(i => {
      reqs.push({
        sql: `INSERT OR REPLACE INTO galpao_itens (id, nome, categoria, unidade, saldo_atual, estoque_minimo, localizacao, custo_unitario, icone, data_cadastro)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [i.id, i.nome, i.categoria, i.unidade, i.saldoAtual, i.estoqueMinimo, i.localizacao, i.custoUnitario, i.icone || 'fa-box', new Date().toISOString()]
      });
    });
    appState.casas.forEach(c => {
      reqs.push({
        sql: `INSERT OR REPLACE INTO casas (id, nome, bloco, capacidade, moradores_atuais, status, responsavel_nome, responsavel_empresa, responsavel_telefone, responsavel_quarto, data_cautela, observacoes)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [c.id, c.nome, c.bloco, c.capacidade, c.moradoresAtuais, c.status, c.responsavelNome, c.responsavelEmpresa, c.responsavelTelefone, c.responsavelQuarto, c.dataCautela, c.observacoes]
      });
    });
    appState.casaMoveis.forEach(m => {
      reqs.push({
        sql: `INSERT OR REPLACE INTO casa_moveis (id, casa_id, item_nome, categoria, quantidade, estado, patrimonio, observacoes)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [m.id, m.casaId, m.itemNome, m.categoria, m.quantidade, m.estado, m.patrimonio, m.observacoes]
      });
    });
    if (reqs.length > 0) {
      await executarTursoBatch(reqs);
      appState.tursoConectado = true;
      atualizarBadgeConexao();
      mostrarToast('Todos os dados foram sincronizados no Turso!', 'success');
    }
  } catch (e) {
    mostrarToast('Erro ao sincronizar: ' + e.message, 'error');
  }
}

// ==========================================
// RENDERIZAÇÃO GERAL DO APP
// ==========================================
function renderApp() {
  renderKPIs();
  renderUrgentBanner();
  renderGraficos();
  renderUltimasMovimentacoes();
  renderCasas();
  renderGalpao();
  renderMovimentacoes();
  renderRelatorios();
  popularSelects();
}

// ==========================================
// 1. DASHBOARD & KPIS
// ==========================================
function renderKPIs() {
  const totalCasas = appState.casas.length;
  const casasOcupadas = appState.casas.filter(c => c.status === 'Ocupada').length;
  const totalMoradores = appState.casas.reduce((a, b) => a + (Number(b.moradoresAtuais) || 0), 0);
  const totalVagas = appState.casas.reduce((a, b) => a + (Number(b.capacidade) || 0), 0);

  const totalPecasGalpao = appState.galpao.reduce((a, b) => a + (Number(b.saldoAtual) || 0), 0);
  const itensCriticos = appState.galpao.filter(i => Number(i.saldoAtual) <= Number(i.estoqueMinimo)).length;

  const moveisDanificados = appState.casaMoveis.filter(m => m.estado && m.estado.includes('Danificado')).length;

  document.getElementById('kpi-total-casas').textContent = totalCasas;
  document.getElementById('kpi-ocupacao-txt').textContent = `${casasOcupadas} ocupadas`;
  document.getElementById('kpi-vagas-txt').textContent = `${totalMoradores} moradores / ${totalVagas} vagas`;

  document.getElementById('kpi-galpao-unidades').textContent = totalPecasGalpao.toLocaleString('pt-BR');
  document.getElementById('kpi-galpao-itens').textContent = `${appState.galpao.length} itens catalogados`;

  document.getElementById('kpi-alertas-galpao').textContent = itensCriticos;
  document.getElementById('kpi-moveis-danificados').textContent = moveisDanificados;

  const bCasas = document.getElementById('badge-total-casas');
  if (bCasas) bCasas.textContent = totalCasas;
  const bGalpao = document.getElementById('badge-total-galpao');
  if (bGalpao) bGalpao.textContent = appState.galpao.length;
}

function renderUrgentBanner() {
  const banner = document.getElementById('urgent-banner');
  const bTitle = document.getElementById('urgent-banner-title');
  const bDesc = document.getElementById('urgent-banner-desc');

  const moveisDanificados = appState.casaMoveis.filter(m => m.estado && m.estado.includes('Danificado'));
  const itensZerados = appState.galpao.filter(i => Number(i.saldoAtual) === 0);

  if (moveisDanificados.length > 0) {
    banner.classList.remove('hidden');
    bTitle.textContent = `⚠️ Atenção: ${moveisDanificados.length} móvel(is) com avaria solicitando troca nas casas!`;
    const casaAlvo = appState.casas.find(c => c.id === moveisDanificados[0].casaId);
    bDesc.textContent = `Exemplo: ${moveisDanificados[0].itemNome} na ${casaAlvo?.nome || 'Casa'} requer substituição pelo estoque reserva do galpão.`;
  } else if (itensZerados.length > 0) {
    banner.classList.remove('hidden');
    bTitle.textContent = `⚠️ Atenção: ${itensZerados.length} item(ns) esgotado(s) no galpão central!`;
    bDesc.textContent = `Solicite reposição urgente junto ao setor de compras ou fornecedores.`;
  } else {
    banner.classList.add('hidden');
  }
}

function filtrarCasasComDano() {
  switchTab('casas');
  const sel = document.getElementById('filtro-status-casas');
  if (sel) {
    sel.value = 'dano';
    renderCasas();
  }
}

function filtrarGalpaoAlertas() {
  switchTab('galpao');
  const sel = document.getElementById('filtro-status-galpao');
  if (sel) {
    sel.value = 'alerta';
    renderGalpao();
  }
}

function renderGraficos() {
  // Gráfico Fluxo
  const canvasFluxo = document.getElementById('chart-fluxo');
  if (canvasFluxo) {
    const labels = [];
    const entradas = [0, 0, 0, 0, 0, 0, 0];
    const saidas = [0, 0, 0, 0, 0, 0, 0];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      labels.push(d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
    }

    // Mock/Real últimos 7 dias
    appState.movimentacoes.forEach(m => {
      if (m.tipo === 'ENTRADA') entradas[6] += m.quantidade || 1;
      else saidas[6] += m.quantidade || 1;
    });

    if (appState.chartFluxo) appState.chartFluxo.destroy();

    appState.chartFluxo = new Chart(canvasFluxo.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          { label: 'Entradas Galpão', data: [12, 18, 5, 25, 10, 15, entradas[6] || 8], backgroundColor: '#10b981', borderRadius: 6 },
          { label: 'Entregas Casas', data: [8, 14, 10, 12, 8, 18, saidas[6] || 11], backgroundColor: '#f59e0b', borderRadius: 6 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(35, 50, 77, 0.4)' }, ticks: { color: '#94a3b8' } },
          y: { beginAtZero: true, grid: { color: 'rgba(35, 50, 77, 0.4)' }, ticks: { color: '#94a3b8', precision: 0 } }
        }
      }
    });
  }

  // Gráfico Categorias Galpão
  const canvasCat = document.getElementById('chart-categorias-galpao');
  const legDiv = document.getElementById('legend-categorias-galpao');
  if (canvasCat) {
    const catMap = {};
    appState.galpao.forEach(i => {
      const c = i.categoria || 'Outros';
      catMap[c] = (catMap[c] || 0) + (Number(i.saldoAtual) || 0);
    });

    const labels = Object.keys(catMap);
    const data = Object.values(catMap);
    const cores = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

    if (appState.chartCategorias) appState.chartCategorias.destroy();

    appState.chartCategorias = new Chart(canvasCat.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data.length > 0 ? data : [1],
          backgroundColor: data.length > 0 ? cores.slice(0, labels.length) : ['#334155'],
          borderWidth: 2,
          borderColor: '#151f32'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: { legend: { display: false } }
      }
    });

    if (legDiv) {
      legDiv.innerHTML = labels.map((cat, idx) => `
        <div class="flex items-center gap-1.5 truncate">
          <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${cores[idx % cores.length]}"></span>
          <span class="truncate">${cat}: <strong class="text-white">${catMap[cat]}</strong></span>
        </div>
      `).join('');
    }
  }
}

function renderUltimasMovimentacoes() {
  const container = document.getElementById('lista-ultimas-movs');
  if (!container) return;

  const ultimas = appState.movimentacoes.slice(0, 5);
  if (ultimas.length === 0) {
    container.innerHTML = '<p class="text-xs text-slate-500 py-4 text-center">Nenhuma movimentação registrada.</p>';
    return;
  }

  container.innerHTML = ultimas.map(m => {
    const isEntrada = m.tipo === 'ENTRADA';
    const isSubst = m.tipo === 'SUBSTITUICAO';
    const cor = isEntrada ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : (isSubst ? 'text-blue-400 bg-blue-500/10 border-blue-500/30' : 'text-amber-400 bg-amber-500/10 border-amber-500/30');
    const icone = isEntrada ? 'fa-plus' : (isSubst ? 'fa-arrows-rotate' : 'fa-truck-ramp-box');

    return `
      <div class="py-3 px-2 flex items-center justify-between hover:bg-slate-800/40 rounded-xl transition">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl ${cor} border flex items-center justify-center text-sm shrink-0">
            <i class="fa-solid ${icone}"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-semibold text-white">${m.itemNome}</h4>
              <span class="text-[10px] px-2 py-0.5 rounded font-bold uppercase ${cor}">${m.tipo}</span>
            </div>
            <p class="text-xs text-slate-400 mt-0.5">
              <span>Destino: <strong>${m.casaNome || 'Galpão'}</strong></span> • 
              <span>${m.responsavel || '-'}</span> • 
              <span>${formatarDataHora(m.dataHora)}</span>
            </p>
          </div>
        </div>
        <div class="text-right">
          <span class="text-sm font-bold ${isEntrada ? 'text-emerald-400' : 'text-amber-400'}">
            ${isEntrada ? '+' : '-'}${m.quantidade} ${m.unidade || 'un'}
          </span>
          ${m.motivo ? `<p class="text-[11px] text-slate-500 truncate max-w-[150px]">${m.motivo}</p>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================
// 2. CASAS & CAUTELAS (O CORAÇÃO DO APP)
// ==========================================
function renderCasas() {
  const container = document.getElementById('container-casas-grid');
  if (!container) return;

  const busca = (document.getElementById('filtro-busca-casas')?.value || '').toLowerCase().trim();
  const statusFiltro = document.getElementById('filtro-status-casas')?.value || '';

  const casasFiltradas = appState.casas.filter(casa => {
    const matchBusca = !busca ||
      casa.nome.toLowerCase().includes(busca) ||
      (casa.bloco && casa.bloco.toLowerCase().includes(busca)) ||
      (casa.responsavelNome && casa.responsavelNome.toLowerCase().includes(busca)) ||
      (casa.responsavelEmpresa && casa.responsavelEmpresa.toLowerCase().includes(busca));

    let matchStatus = true;
    if (statusFiltro === 'dano') {
      const temDano = appState.casaMoveis.some(m => m.casaId === casa.id && m.estado && m.estado.includes('Danificado'));
      matchStatus = temDano;
    } else if (statusFiltro) {
      matchStatus = casa.status === statusFiltro;
    }

    return matchBusca && matchStatus;
  });

  const txtContador = document.getElementById('txt-contador-casas');
  if (txtContador) txtContador.textContent = `Exibindo ${casasFiltradas.length} de ${appState.casas.length} casas`;

  if (casasFiltradas.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-8 text-center bg-[#151f32] border border-[#23324d] rounded-2xl text-slate-400">
        <i class="fa-solid fa-house-chimney-crack text-4xl text-slate-600 mb-3 block"></i>
        <p class="font-semibold">Nenhuma casa encontrada para os filtros selecionados.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = casasFiltradas.map(casa => {
    // Móveis da casa
    const moveisCasa = appState.casaMoveis.filter(m => m.casaId === casa.id);
    const totalPecasMoveis = moveisCasa.reduce((a, b) => a + (Number(b.quantidade) || 0), 0);
    const temDano = moveisCasa.some(m => m.estado && m.estado.includes('Danificado'));

    // Percentual de ocupação
    const cap = Number(casa.capacidade) || 1;
    const mor = Number(casa.moradoresAtuais) || 0;
    const pctOcupacao = Math.min(100, Math.round((mor / cap) * 100));

    // Resumo dos móveis
    const resumoMoveis = moveisCasa.slice(0, 3).map(m => `${m.quantidade}x ${m.itemNome.split(' ')[0]}`).join(', ');

    return `
      <div class="bg-[#151f32] border ${temDano ? 'border-rose-500/70 shadow-rose-950/20' : 'border-[#23324d] hover:border-amber-500/50'} rounded-2xl p-4 flex flex-col justify-between transition group shadow-xl">
        <div>
          <!-- Topo do Card da Casa -->
          <div class="flex items-start justify-between gap-2 mb-2">
            <div>
              <span class="text-[11px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60">
                ${casa.bloco || 'Alojamento'}
              </span>
              <h3 class="text-lg font-bold text-white group-hover:text-amber-400 transition mt-1">
                ${casa.nome}
              </h3>
            </div>
            <div class="flex flex-col items-end gap-1">
              <span class="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full font-bold border ${casa.status === 'Ocupada' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'}">
                <span class="w-1.5 h-1.5 rounded-full ${casa.status === 'Ocupada' ? 'bg-emerald-500' : 'bg-blue-500'}"></span>
                ${casa.status}
              </span>
              ${temDano ? `
                <span class="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                  <i class="fa-solid fa-triangle-exclamation"></i> Móvel Danificado
                </span>
              ` : ''}
            </div>
          </div>

          <!-- Responsável Nominal -->
          <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 my-2 space-y-1">
            <span class="text-[10px] font-semibold text-amber-400/90 uppercase tracking-wider block">
              <i class="fa-solid fa-user-check mr-1"></i> Responsável da Cautela:
            </span>
            <p class="text-xs font-bold text-white truncate">${casa.responsavelNome || 'Não definido'}</p>
            <p class="text-[11px] text-slate-400 truncate">${casa.responsavelEmpresa || 'Empresa Própria'}</p>
            ${casa.responsavelTelefone ? `<p class="text-[11px] text-slate-500"><i class="fa-brands fa-whatsapp text-emerald-400 mr-1"></i>${casa.responsavelTelefone}</p>` : ''}
          </div>

          <!-- Lotação da Casa -->
          <div class="my-3 space-y-1">
            <div class="flex justify-between text-xs text-slate-400">
              <span>Lotação: <strong class="text-white">${mor}/${cap} vagas</strong></span>
              <span>${pctOcupacao}% cheia</span>
            </div>
            <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500 ${pctOcupacao >= 100 ? 'bg-rose-500' : 'bg-amber-500'}" style="width: ${pctOcupacao}%"></div>
            </div>
          </div>

          <!-- Resumo do Mobiliário -->
          <div class="text-xs text-slate-400 pt-1 border-t border-slate-800">
            <span class="text-slate-500">Móveis instalados:</span>
            <p class="text-slate-300 font-medium truncate mt-0.5">${resumoMoveis || 'Nenhum móvel vinculado'} (+${totalPecasMoveis} peças)</p>
          </div>
        </div>

        <!-- Botões de Ação do Card -->
        <div class="pt-3 border-t border-[#23324d] mt-3 flex items-center gap-2">
          <button onclick="abrirDossieCasa('${casa.id}')" class="flex-1 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md shadow-amber-500/10">
            <i class="fa-solid fa-folder-open"></i>
            <span>Dossiê & Móveis</span>
          </button>

          <button onclick="imprimirTermoCautelaDireto('${casa.id}')" title="Gerar Termo de Cautela desta Casa" class="p-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition">
            <i class="fa-solid fa-print"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================
// 3. DOSSIÊ COMPLETO DA CASA (MODAL DETALHADO)
// ==========================================
function abrirDossieCasa(casaId) {
  const casa = appState.casas.find(c => c.id === casaId);
  if (!casa) return;

  appState.dossieCasaAtualId = casaId;

  document.getElementById('dossie-casa-nome').textContent = casa.nome;
  document.getElementById('dossie-casa-bloco').textContent = `${casa.bloco || 'Alojamento'} • ${casa.moradoresAtuais}/${casa.capacidade} moradores`;

  const badge = document.getElementById('dossie-casa-status-badge');
  badge.className = `text-xs px-2.5 py-0.5 rounded-full font-bold border ${casa.status === 'Ocupada' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'}`;
  badge.textContent = casa.status;

  document.getElementById('dossie-resp-nome').textContent = casa.responsavelNome || 'Responsável não cadastrado';
  document.getElementById('dossie-resp-empresa').textContent = casa.responsavelEmpresa || 'Empresa não informada';
  document.getElementById('dossie-resp-tel').innerHTML = `<i class="fa-solid fa-phone mr-1"></i> ${casa.responsavelTelefone || 'Sem telefone'}`;
  document.getElementById('dossie-resp-quarto').innerHTML = `<i class="fa-solid fa-bed mr-1"></i> ${casa.responsavelQuarto || 'Quarto não especificado'}`;
  document.getElementById('dossie-resp-data').innerHTML = `<i class="fa-solid fa-calendar mr-1"></i> Cautela: ${casa.dataCautela || 'Pendente'}`;

  switchDossieTab('moveis');
  openModal('modal-dossie-casa');
}

function switchDossieTab(tab) {
  appState.activeDossieTab = tab;
  const btnMoveis = document.getElementById('btn-tab-dossie-moveis');
  const btnEntregas = document.getElementById('btn-tab-dossie-entregas');
  const secMoveis = document.getElementById('dossie-aba-moveis');
  const secEntregas = document.getElementById('dossie-aba-entregas');

  if (tab === 'moveis') {
    btnMoveis.className = 'px-4 py-2 border-b-2 border-amber-500 text-amber-400 text-xs font-bold flex items-center gap-1.5';
    btnEntregas.className = 'px-4 py-2 border-b-2 border-transparent text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center gap-1.5';
    secMoveis.classList.remove('hidden');
    secEntregas.classList.add('hidden');
    renderDossieMoveis();
  } else {
    btnMoveis.className = 'px-4 py-2 border-b-2 border-transparent text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center gap-1.5';
    btnEntregas.className = 'px-4 py-2 border-b-2 border-amber-500 text-amber-400 text-xs font-bold flex items-center gap-1.5';
    secMoveis.classList.add('hidden');
    secEntregas.classList.remove('hidden');
    renderDossieEntregas();
  }
}

function renderDossieMoveis() {
  const container = document.getElementById('dossie-lista-moveis');
  const contador = document.getElementById('dossie-contador-moveis');
  if (!container) return;

  const moveis = appState.casaMoveis.filter(m => m.casaId === appState.dossieCasaAtualId);
  const totalPecas = moveis.reduce((a, b) => a + (Number(b.quantidade) || 0), 0);

  if (contador) contador.textContent = `${moveis.length} tipo(s) de móvel • Total de ${totalPecas} peças na casa`;

  if (moveis.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center bg-slate-900/60 rounded-xl border border-slate-800 text-slate-400 text-xs">
        <i class="fa-solid fa-couch text-3xl mb-2 text-slate-600 block"></i>
        Nenhum móvel vinculado a esta casa ainda. Clique em "+ Adicionar Móvel do Galpão" para alocar beliches, colchões ou eletros.
      </div>
    `;
    return;
  }

  container.innerHTML = moveis.map(m => {
    const isDanificado = m.estado && m.estado.includes('Danificado');
    let corEstado = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (m.estado === 'Regular') corEstado = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    if (isDanificado) corEstado = 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-bold animate-pulse';

    return `
      <div class="p-3.5 bg-slate-900/90 ${isDanificado ? 'border-2 border-rose-500/60' : 'border border-slate-800'} rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl ${isDanificado ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-amber-400'} flex items-center justify-center text-lg shrink-0">
            <i class="fa-solid fa-couch"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-bold text-white">${m.itemNome}</h4>
              <span class="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">${m.quantidade}x</span>
            </div>
            <div class="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
              <span class="text-[11px] px-2 py-0.5 rounded-full border ${corEstado}">
                ${m.estado || 'Bom'}
              </span>
              ${m.patrimonio ? `<span class="font-mono text-slate-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">${m.patrimonio}</span>` : ''}
              ${m.observacoes ? `<span class="italic text-slate-400 truncate max-w-[200px]">"${m.observacoes}"</span>` : ''}
            </div>
          </div>
        </div>

        <!-- Ações do Móvel: Substituição em 1 Clique e Devolução -->
        <div class="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          ${isDanificado ? `
            <button onclick="substituirMovelEm1Clique('${m.id}')" class="px-3.5 py-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition active:scale-95">
              <i class="fa-solid fa-arrows-rotate"></i>
              <span>Substituir pelo Galpão</span>
            </button>
          ` : `
            <button onclick="marcarMovelDanificado('${m.id}')" title="Sinalizar que este móvel quebrou ou estragou" class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-lg text-xs font-medium border border-slate-700 transition">
              <i class="fa-solid fa-wrench"></i> Sinalizar Dano
            </button>
          `}

          <button onclick="devolverMovelGalpao('${m.id}')" title="Devolver móvel da casa para o estoque do Galpão" class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition">
            <i class="fa-solid fa-arrow-right-from-bracket"></i> Devolver
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function renderDossieEntregas() {
  const container = document.getElementById('dossie-lista-entregas');
  if (!container) return;

  const entregas = appState.casaEntregas.filter(e => e.casaId === appState.dossieCasaAtualId);

  if (entregas.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center bg-slate-900/60 rounded-xl border border-slate-800 text-slate-400 text-xs">
        <i class="fa-solid fa-box-open text-3xl mb-2 text-slate-600 block"></i>
        Nenhuma entrega de material de limpeza ou consumo registrada para esta casa ainda.
      </div>
    `;
    return;
  }

  container.innerHTML = entregas.map(e => `
    <div class="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
      <div>
        <h4 class="font-bold text-white text-sm">${e.itemNome}</h4>
        <p class="text-slate-400 mt-0.5">
          <span>Recebido por: <strong class="text-slate-200">${e.responsavelRecebimento || '-'}</strong></span> • 
          <span>${formatarDataHora(e.dataEntrega)}</span>
        </p>
        ${e.observacoes ? `<p class="text-slate-500 italic mt-0.5">"${e.observacoes}"</p>` : ''}
      </div>
      <div class="text-right">
        <span class="font-bold text-amber-400 text-sm">${e.quantidade} ${e.unidade || 'un'}</span>
      </div>
    </div>
  `).join('');
}

// ==========================================
// SUBSTITUIÇÃO RÁPIDA EM 1 CLIQUE DO MÓVEL
// ==========================================
async function substituirMovelEm1Clique(movelId) {
  const movel = appState.casaMoveis.find(m => m.id === movelId);
  if (!movel) return;

  const casa = appState.casas.find(c => c.id === movel.casaId);
  const galpaoItem = appState.galpao.find(g => g.nome.toLowerCase() === movel.itemNome.toLowerCase() || g.nome.toLowerCase().includes(movel.itemNome.split(' ')[0].toLowerCase()));

  if (!galpaoItem || galpaoItem.saldoAtual < 1) {
    mostrarToast(`Estoque insuficiente no Galpão! O item "${movel.itemNome}" está zerado para reposição.`, 'error');
    return;
  }

  const confirma = confirm(`Confirmar substituição do móvel com avaria?\n\n• Móvel: ${movel.itemNome}\n• Destino: ${casa?.nome}\n• Baixa no Galpão: 1 unidade (Saldo atual: ${galpaoItem.saldoAtual})`);
  if (!confirma) return;

  // Dá baixa de 1 no galpão
  const saldoAnt = galpaoItem.saldoAtual;
  galpaoItem.saldoAtual -= 1;

  // Atualiza móvel da casa para Bom/Novo
  movel.estado = 'Bom (Substituído)';
  movel.observacoes = `Substituído pelo galpão em ${new Date().toLocaleDateString('pt-BR')} por motivo de avaria`;

  // Cria movimentação no histórico
  const novaMov = {
    id: 'mov-' + Date.now(),
    tipo: 'SUBSTITUICAO',
    itemNome: galpaoItem.nome,
    categoria: galpaoItem.categoria,
    unidade: galpaoItem.unidade,
    quantidade: 1,
    casaId: casa?.id || null,
    casaNome: casa?.nome || 'Alojamento',
    responsavel: casa?.responsavelNome || 'Prefeito de Obra',
    empresa: casa?.responsavelEmpresa || 'Canteiro',
    motivo: `Troca imediata de móvel danificado na ${casa?.nome}`,
    dataHora: new Date().toISOString(),
    saldoAnterior: saldoAnt,
    saldoPosterior: galpaoItem.saldoAtual,
    detalhes: 'Móvel avariado recolhido para reparo / descartado'
  };

  appState.movimentacoes.unshift(novaMov);
  salvarLocalmente();
  renderApp();
  renderDossieMoveis();

  mostrarToast(`Móvel da ${casa?.nome} substituído com sucesso! 1 unidade retirada do galpão.`, 'success');

  // Sincroniza Turso
  if (appState.config.turso?.ativo) {
    executarTursoBatch([
      { sql: 'UPDATE galpao_itens SET saldo_atual = ? WHERE id = ?', args: [galpaoItem.saldoAtual, galpaoItem.id] },
      { sql: 'UPDATE casa_moveis SET estado = ?, observacoes = ? WHERE id = ?', args: [movel.estado, movel.observacoes, movel.id] },
      {
        sql: `INSERT INTO movimentacoes (id, tipo, item_nome, categoria, unidade, quantidade, casa_id, casa_nome, responsavel, empresa, motivo, data_hora, saldo_anterior, saldo_posterior, detalhes)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [novaMov.id, novaMov.tipo, novaMov.itemNome, novaMov.categoria, novaMov.unidade, novaMov.quantidade, novaMov.casaId, novaMov.casaNome, novaMov.responsavel, novaMov.empresa, novaMov.motivo, novaMov.dataHora, novaMov.saldoAnterior, novaMov.saldoPosterior, novaMov.detalhes]
      }
    ]).catch(err => console.error('Erro Turso substituição:', err));
  }
}

function marcarMovelDanificado(movelId) {
  const movel = appState.casaMoveis.find(m => m.id === movelId);
  if (!movel) return;

  const motivo = prompt(`Informe a avaria encontrada no item "${movel.itemNome}":`, 'Quebrado / Danificado');
  if (motivo === null) return;

  movel.estado = 'Danificado - Solicitar Troca';
  movel.observacoes = motivo;

  salvarLocalmente();
  renderApp();
  renderDossieMoveis();
  mostrarToast('Móvel sinalizado como danificado! Botão de substituição disponível.', 'warning');

  if (appState.config.turso?.ativo) {
    executarTurso('UPDATE casa_moveis SET estado = ?, observacoes = ? WHERE id = ?', [movel.estado, movel.observacoes, movel.id])
      .catch(console.error);
  }
}

function devolverMovelGalpao(movelId) {
  const movel = appState.casaMoveis.find(m => m.id === movelId);
  if (!movel) return;

  const confirma = confirm(`Devolver "${movel.itemNome}" (${movel.quantidade} un) para o Galpão Central?`);
  if (!confirma) return;

  const casa = appState.casas.find(c => c.id === movel.casaId);
  const galpaoItem = appState.galpao.find(g => g.nome.toLowerCase() === movel.itemNome.toLowerCase());

  if (galpaoItem) {
    galpaoItem.saldoAtual += movel.quantidade;
  }

  appState.casaMoveis = appState.casaMoveis.filter(m => m.id !== movelId);

  const novaMov = {
    id: 'mov-' + Date.now(),
    tipo: 'DEVOLUCAO_GALPAO',
    itemNome: movel.itemNome,
    categoria: movel.categoria,
    unidade: 'Unidade',
    quantidade: movel.quantidade,
    casaId: casa?.id,
    casaNome: casa?.nome,
    responsavel: casa?.responsavelNome || 'Prefeito de Obra',
    empresa: casa?.responsavelEmpresa || 'Canteiro',
    motivo: `Móvel recolhido da ${casa?.nome} e devolvido ao galpão`,
    dataHora: new Date().toISOString(),
    saldoAnterior: galpaoItem ? (galpaoItem.saldoAtual - movel.quantidade) : 0,
    saldoPosterior: galpaoItem ? galpaoItem.saldoAtual : movel.quantidade,
    detalhes: 'Retorno ao estoque'
  };

  appState.movimentacoes.unshift(novaMov);
  salvarLocalmente();
  renderApp();
  renderDossieMoveis();
  mostrarToast(`Móvel devolvido ao Galpão com sucesso!`, 'info');

  if (appState.config.turso?.ativo) {
    const reqs = [{ sql: 'DELETE FROM casa_moveis WHERE id = ?', args: [movel.id] }];
    if (galpaoItem) {
      reqs.push({ sql: 'UPDATE galpao_itens SET saldo_atual = ? WHERE id = ?', args: [galpaoItem.saldoAtual, galpaoItem.id] });
    }
    executarTursoBatch(reqs).catch(console.error);
  }
}

// ==========================================
// 4. GALPÃO & ESTOQUE CENTRAL
// ==========================================
function renderGalpao() {
  const container = document.getElementById('container-galpao-cards');
  if (!container) return;

  const busca = (document.getElementById('filtro-busca-galpao')?.value || '').toLowerCase().trim();
  const cat = document.getElementById('filtro-categoria-galpao')?.value || '';
  const statusFiltro = document.getElementById('filtro-status-galpao')?.value || '';

  let totalValor = 0;

  const itensFiltrados = appState.galpao.filter(item => {
    const matchBusca = !busca ||
      item.nome.toLowerCase().includes(busca) ||
      (item.categoria && item.categoria.toLowerCase().includes(busca)) ||
      (item.localizacao && item.localizacao.toLowerCase().includes(busca));

    const matchCat = !cat || item.categoria === cat;

    const saldo = Number(item.saldoAtual) || 0;
    const min = Number(item.estoqueMinimo) || 0;
    let st = 'normal';
    if (saldo === 0) st = 'critico';
    else if (saldo <= min) st = 'alerta';

    const matchStatus = !statusFiltro || st === statusFiltro;

    totalValor += (saldo * (Number(item.custoUnitario) || 0));

    return matchBusca && matchCat && matchStatus;
  });

  document.getElementById('txt-contador-galpao').textContent = `${itensFiltrados.length} itens exibidos`;
  document.getElementById('txt-valor-total-galpao').textContent = `Total Imobilizado: R$ ${totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  if (itensFiltrados.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-8 text-center bg-[#151f32] border border-[#23324d] rounded-2xl text-slate-400">
        <i class="fa-solid fa-warehouse text-4xl text-slate-600 mb-3 block"></i>
        <p class="font-semibold">Nenhum item encontrado no galpão central com esses filtros.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = itensFiltrados.map(item => {
    const saldo = Number(item.saldoAtual) || 0;
    const min = Number(item.estoqueMinimo) || 0;
    let badgeCor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    let statusTxt = 'Normal';
    if (saldo === 0) {
      badgeCor = 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse';
      statusTxt = 'Crítico (Zerado)';
    } else if (saldo <= min) {
      badgeCor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      statusTxt = 'Alerta Baixo';
    }

    const valorItemTotal = (saldo * (Number(item.custoUnitario) || 0)).toFixed(2);

    return `
      <div class="bg-[#151f32] border border-[#23324d] hover:border-slate-600 rounded-2xl p-4 flex flex-col justify-between transition group shadow-lg">
        <div>
          <div class="flex items-start justify-between gap-2 mb-2">
            <span class="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md truncate">
              ${item.categoria || 'Geral'}
            </span>
            <span class="text-[11px] px-2 py-0.5 rounded-full font-bold border ${badgeCor}">
              ${statusTxt}
            </span>
          </div>

          <div class="flex items-center gap-2.5 my-1">
            <div class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-sm shrink-0">
              <i class="fa-solid ${item.icone || 'fa-box'}"></i>
            </div>
            <h3 class="text-sm font-bold text-white group-hover:text-amber-400 transition leading-snug">
              ${item.nome}
            </h3>
          </div>

          <p class="text-xs text-slate-400 flex items-center gap-1.5 mt-1.5">
            <i class="fa-solid fa-location-dot text-slate-500"></i>
            <span class="truncate">${item.localizacao || 'Galpão Central'}</span>
          </p>

          <div class="mt-3 p-2.5 bg-slate-900/80 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <div>
              <span class="text-[10px] text-slate-500 uppercase block font-semibold">Saldo Atual</span>
              <span class="text-xl font-black ${saldo === 0 ? 'text-rose-400' : 'text-emerald-400'}">${saldo}</span>
              <span class="text-xs text-slate-400 ml-1">${item.unidade}</span>
            </div>
            <div class="text-right">
              <span class="text-[10px] text-slate-500 uppercase block font-semibold">Mínimo: ${min}</span>
              <span class="text-xs font-semibold text-slate-300">R$ ${valorItemTotal}</span>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-[#23324d] mt-3 grid grid-cols-2 gap-2">
          <button onclick="prepararEntradaItem('${item.id}')" class="py-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition">
            <i class="fa-solid fa-plus"></i>
            <span>+ Entrada</span>
          </button>

          <button onclick="prepararEntregaItem('${item.id}')" class="py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition">
            <i class="fa-solid fa-truck-ramp-box"></i>
            <span>Entregar p/ Casa</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================
// 5. MOVIMENTAÇÕES & HISTÓRICO
// ==========================================
function renderMovimentacoes() {
  const tbody = document.getElementById('tbody-movimentacoes');
  if (!tbody) return;

  const busca = (document.getElementById('filtro-busca-movs')?.value || '').toLowerCase().trim();
  const tipoFiltro = document.getElementById('filtro-tipo-movs')?.value || '';

  const filtradas = appState.movimentacoes.filter(m => {
    const matchTipo = !tipoFiltro || m.tipo === tipoFiltro;
    const txt = `${m.itemNome} ${m.casaNome || ''} ${m.responsavel || ''} ${m.motivo || ''} ${m.empresa || ''}`.toLowerCase();
    const matchBusca = !busca || txt.includes(busca);
    return matchTipo && matchBusca;
  });

  document.getElementById('txt-contador-movs').textContent = `${filtradas.length} movimentações encontradas`;

  if (filtradas.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-500">Nenhum registro encontrado.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtradas.map(m => {
    const isEntrada = m.tipo === 'ENTRADA';
    const isSubst = m.tipo === 'SUBSTITUICAO';
    const badge = isEntrada ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : (isSubst ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30');

    return `
      <tr class="hover:bg-slate-800/40 transition">
        <td class="py-3 px-4 text-xs font-mono text-slate-400">${formatarDataHora(m.dataHora)}</td>
        <td class="py-3 px-4 text-center">
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge}">${m.tipo}</span>
        </td>
        <td class="py-3 px-4 font-bold text-white text-xs">${m.itemNome}</td>
        <td class="py-3 px-4 text-center font-bold text-xs ${isEntrada ? 'text-emerald-400' : 'text-amber-400'}">${m.quantidade} ${m.unidade || 'un'}</td>
        <td class="py-3 px-4 text-xs text-slate-200 font-semibold">${m.casaNome || 'Galpão Central'}</td>
        <td class="py-3 px-4 text-xs text-slate-400">
          <span class="text-slate-200 font-medium">${m.responsavel || '-'}</span>
          ${m.motivo ? `<span class="block text-[11px] text-slate-500">${m.motivo}</span>` : ''}
        </td>
        <td class="py-3 px-4 text-center text-xs font-bold text-white">${m.saldoPosterior}</td>
      </tr>
    `;
  }).join('');
}

// ==========================================
// 6. RELATÓRIOS & INVENTÁRIO CONSOLIDADO
// ==========================================
function renderRelatorios() {
  const tbody = document.getElementById('tbody-inventario-consolidado');
  const totalMoveisCasas = appState.casaMoveis.reduce((a, b) => a + (Number(b.quantidade) || 0), 0);
  const totalMoveisGalpao = appState.galpao.filter(i => i.categoria === 'Móveis & Equipamentos').reduce((a, b) => a + (Number(b.saldoAtual) || 0), 0);

  const totalMor = appState.casas.reduce((a, b) => a + (Number(b.moradoresAtuais) || 0), 0);
  const totalCap = appState.casas.reduce((a, b) => a + (Number(b.capacidade) || 0), 0);
  const taxa = totalCap > 0 ? Math.round((totalMor / totalCap) * 100) : 0;

  document.getElementById('rel-total-moveis-casas').textContent = totalMoveisCasas;
  document.getElementById('rel-total-moveis-galpao').textContent = totalMoveisGalpao;
  document.getElementById('rel-taxa-ocupacao').textContent = `${taxa}%`;
  document.getElementById('rel-detalhes-ocupacao').textContent = `${totalMor} moradores em ${totalCap} vagas`;

  if (!tbody) return;

  tbody.innerHTML = appState.casas.map(casa => {
    const moveis = appState.casaMoveis.filter(m => m.casaId === casa.id);
    const listaTxt = moveis.map(m => `${m.quantidade}x ${m.itemNome.split(' ')[0]} [${m.estado || 'Bom'}]`).join(', ');

    return `
      <tr class="hover:bg-slate-800/40 transition">
        <td class="py-3 px-4 font-bold text-white text-xs">${casa.nome} <span class="text-slate-400 font-normal">(${casa.bloco || 'Alojamento'})</span></td>
        <td class="py-3 px-4 text-xs font-semibold text-amber-400">${casa.responsavelNome || '-'}</td>
        <td class="py-3 px-4 text-xs text-slate-300">${casa.responsavelEmpresa || '-'}</td>
        <td class="py-3 px-4 text-center text-xs font-bold text-white">${casa.moradoresAtuais}/${casa.capacidade}</td>
        <td class="py-3 px-4 text-xs text-slate-300 max-w-xs truncate">${listaTxt || 'Nenhum móvel'}</td>
        <td class="py-3 px-4 text-right">
          <button onclick="imprimirTermoCautelaDireto('${casa.id}')" class="px-3 py-1 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-xs font-bold transition">
            <i class="fa-solid fa-print mr-1"></i> Imprimir Ficha
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// ==========================================
// 7. OPERAÇÕES DE CADASTRO E ENTREGA
// ==========================================
function popularSelects() {
  const selCasas = document.getElementById('entrega-casa-id');
  const selGalpao = document.getElementById('entrega-item-id');
  const selEntrada = document.getElementById('entrada-galpao-item-id');

  if (selCasas) {
    selCasas.innerHTML = '<option value="">Selecione a casa de destino...</option>' +
      appState.casas.map(c => `<option value="${c.id}">${c.nome} (${c.responsavelNome || 'Sem responsável'}) - ${c.moradoresAtuais}/${c.capacidade} vagas</option>`).join('');
  }

  if (selGalpao) {
    selGalpao.innerHTML = '<option value="">Selecione o item do galpão...</option>' +
      appState.galpao.map(g => `<option value="${g.id}">${g.nome} (${g.categoria}) - Saldo: ${g.saldoAtual} ${g.unidade}</option>`).join('');
  }

  if (selEntrada) {
    selEntrada.innerHTML = '<option value="">Selecione o item para abastecer...</option>' +
      appState.galpao.map(g => `<option value="${g.id}">${g.nome} (Atual: ${g.saldoAtual} ${g.unidade})</option>`).join('');
  }
}

function abrirModalEntregaCasa() {
  popularSelects();
  openModal('modal-entrega-casa');
}

function atualizarInfoCasaEntrega() {
  const casaId = document.getElementById('entrega-casa-id').value;
  const box = document.getElementById('box-info-casa-entrega');
  const respTxt = document.getElementById('entrega-resp-txt');
  const empTxt = document.getElementById('entrega-empresa-txt');

  const casa = appState.casas.find(c => c.id === casaId);
  if (casa) {
    box.classList.remove('hidden');
    respTxt.textContent = casa.responsavelNome || 'Não informado';
    empTxt.textContent = casa.responsavelEmpresa || 'Não informada';
  } else {
    box.classList.add('hidden');
  }
}

function atualizarInfoItemEntrega() {
  const itemId = document.getElementById('entrega-item-id').value;
  const boxSaldo = document.getElementById('box-saldo-galpao-entrega');
  const valSaldo = document.getElementById('entrega-saldo-val');
  const inputQtd = document.getElementById('entrega-quantidade');
  const secaoMovel = document.getElementById('secao-campos-movel');

  const item = appState.galpao.find(g => g.id === itemId);
  if (item) {
    boxSaldo.classList.remove('hidden');
    valSaldo.textContent = `${item.saldoAtual} ${item.unidade}`;
    inputQtd.max = item.saldoAtual;

    if (item.categoria === 'Móveis & Equipamentos') {
      secaoMovel.classList.remove('hidden');
    } else {
      secaoMovel.classList.add('hidden');
    }
  } else {
    boxSaldo.classList.add('hidden');
    secaoMovel.classList.add('hidden');
  }
}

function salvarEntregaCasa(e) {
  e.preventDefault();
  const casaId = document.getElementById('entrega-casa-id').value;
  const itemId = document.getElementById('entrega-item-id').value;
  const qtd = parseInt(document.getElementById('entrega-quantidade').value, 10);
  const motivo = document.getElementById('entrega-motivo').value.trim();

  const casa = appState.casas.find(c => c.id === casaId);
  const item = appState.galpao.find(g => g.id === itemId);

  if (!casa || !item) {
    mostrarToast('Selecione a casa e o item corretamente!', 'warning');
    return;
  }

  if (qtd <= 0 || qtd > item.saldoAtual) {
    mostrarToast(`Quantidade inválida! Estoque disponível no galpão: ${item.saldoAtual} ${item.unidade}`, 'error');
    return;
  }

  // Dá baixa no galpão
  const saldoAnt = item.saldoAtual;
  item.saldoAtual -= qtd;

  // Se for móvel, adiciona ao mobiliário da casa
  if (item.categoria === 'Móveis & Equipamentos') {
    const estado = document.getElementById('entrega-movel-estado')?.value || 'Bom';
    const patrimonio = document.getElementById('entrega-movel-patrimonio')?.value.trim() || `PAT-${Date.now().toString().slice(-4)}`;

    const novoMovel = {
      id: 'cm-' + Date.now(),
      casaId: casa.id,
      itemNome: item.nome,
      categoria: item.categoria,
      quantidade: qtd,
      estado: estado,
      patrimonio: patrimonio,
      observacoes: motivo
    };
    appState.casaMoveis.push(novoMovel);

    if (appState.config.turso?.ativo) {
      executarTurso(`INSERT INTO casa_moveis (id, casa_id, item_nome, categoria, quantidade, estado, patrimonio, observacoes)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [novoMovel.id, novoMovel.casaId, novoMovel.itemNome, novoMovel.categoria, novoMovel.quantidade, novoMovel.estado, novoMovel.patrimonio, novoMovel.observacoes]
      ).catch(console.error);
    }
  } else {
    // É insumo de limpeza/consumo: registra em casa_entregas
    const novaEntrega = {
      id: 'ce-' + Date.now(),
      casaId: casa.id,
      itemNome: item.nome,
      quantidade: qtd,
      unidade: item.unidade,
      dataEntrega: new Date().toISOString(),
      responsavelEntrega: 'Carlos Almoxarife',
      responsavelRecebimento: casa.responsavelNome || 'Encarregado',
      observacoes: motivo
    };
    appState.casaEntregas.unshift(novaEntrega);

    if (appState.config.turso?.ativo) {
      executarTurso(`INSERT INTO casa_entregas (id, casa_id, item_nome, quantidade, unidade, data_entrega, responsavel_entrega, responsavel_recebimento, observacoes)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [novaEntrega.id, novaEntrega.casaId, novaEntrega.itemNome, novaEntrega.quantidade, novaEntrega.unidade, novaEntrega.dataEntrega, novaEntrega.responsavelEntrega, novaEntrega.responsavelRecebimento, novaEntrega.observacoes]
      ).catch(console.error);
    }
  }

  // Registro de movimentação geral
  const novaMov = {
    id: 'mov-' + Date.now(),
    tipo: 'SAIDA_CASA',
    itemNome: item.nome,
    categoria: item.categoria,
    unidade: item.unidade,
    quantidade: qtd,
    casaId: casa.id,
    casaNome: casa.nome,
    responsavel: casa.responsavelNome || 'Encarregado',
    empresa: casa.responsavelEmpresa || 'Canteiro',
    motivo: motivo,
    dataHora: new Date().toISOString(),
    saldoAnterior: saldoAnt,
    saldoPosterior: item.saldoAtual,
    detalhes: `Entrega na ${casa.nome}`
  };
  appState.movimentacoes.unshift(novaMov);

  salvarLocalmente();
  closeModal('modal-entrega-casa');
  document.getElementById('form-entrega-casa').reset();
  renderApp();
  mostrarToast(`Entrega de ${qtd} ${item.unidade} para "${casa.nome}" realizada com sucesso!`, 'success');

  // Atualiza saldo do galpão no Turso
  if (appState.config.turso?.ativo) {
    executarTursoBatch([
      { sql: 'UPDATE galpao_itens SET saldo_atual = ? WHERE id = ?', args: [item.saldoAtual, item.id] },
      {
        sql: `INSERT INTO movimentacoes (id, tipo, item_nome, categoria, unidade, quantidade, casa_id, casa_nome, responsavel, empresa, motivo, data_hora, saldo_anterior, saldo_posterior, detalhes)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [novaMov.id, novaMov.tipo, novaMov.itemNome, novaMov.categoria, novaMov.unidade, novaMov.quantidade, novaMov.casaId, novaMov.casaNome, novaMov.responsavel, novaMov.empresa, novaMov.motivo, novaMov.dataHora, novaMov.saldoAnterior, novaMov.saldoPosterior, novaMov.detalhes]
      }
    ]).catch(console.error);
  }
}

function salvarEntradaGalpao(e) {
  e.preventDefault();
  const itemId = document.getElementById('entrada-galpao-item-id').value;
  const qtd = parseInt(document.getElementById('entrada-galpao-qtd').value, 10);
  const fornecedor = document.getElementById('entrada-galpao-fornecedor').value.trim();
  const nf = document.getElementById('entrada-galpao-nf').value.trim();
  const motivo = document.getElementById('entrada-galpao-motivo').value.trim();

  const item = appState.galpao.find(g => g.id === itemId);
  if (!item || qtd <= 0) {
    mostrarToast('Preencha os dados da entrada corretamente!', 'warning');
    return;
  }

  const saldoAnt = item.saldoAtual;
  item.saldoAtual += qtd;

  const novaMov = {
    id: 'mov-' + Date.now(),
    tipo: 'ENTRADA',
    itemNome: item.nome,
    categoria: item.categoria,
    unidade: item.unidade,
    quantidade: qtd,
    casaId: null,
    casaNome: 'Galpão Central',
    responsavel: 'Carlos Almoxarife',
    empresa: fornecedor,
    motivo: motivo || `Abastecimento de estoque (${fornecedor} ${nf ? 'NF: ' + nf : ''})`,
    dataHora: new Date().toISOString(),
    saldoAnterior: saldoAnt,
    saldoPosterior: item.saldoAtual,
    detalhes: nf ? `Nota Fiscal: ${nf}` : 'Entrada avulsa'
  };

  appState.movimentacoes.unshift(novaMov);
  salvarLocalmente();
  closeModal('modal-entrada-galpao');
  document.getElementById('form-entrada-galpao').reset();
  renderApp();
  mostrarToast(`+${qtd} ${item.unidade} de "${item.nome}" adicionadas ao Galpão!`, 'success');

  if (appState.config.turso?.ativo) {
    executarTursoBatch([
      { sql: 'UPDATE galpao_itens SET saldo_atual = ? WHERE id = ?', args: [item.saldoAtual, item.id] },
      {
        sql: `INSERT INTO movimentacoes (id, tipo, item_nome, categoria, unidade, quantidade, casa_id, casa_nome, responsavel, empresa, motivo, data_hora, saldo_anterior, saldo_posterior, detalhes)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [novaMov.id, novaMov.tipo, novaMov.itemNome, novaMov.categoria, novaMov.unidade, novaMov.quantidade, novaMov.casaId, novaMov.casaNome, novaMov.responsavel, novaMov.empresa, novaMov.motivo, novaMov.dataHora, novaMov.saldoAnterior, novaMov.saldoPosterior, novaMov.detalhes]
      }
    ]).catch(console.error);
  }
}

function salvarCasa(e) {
  e.preventDefault();
  const editId = document.getElementById('casa-edit-id').value;
  const nome = document.getElementById('casa-nome').value.trim();
  const bloco = document.getElementById('casa-bloco').value.trim();
  const cap = parseInt(document.getElementById('casa-capacidade').value, 10) || 6;
  const mor = parseInt(document.getElementById('casa-moradores').value, 10) || 0;
  const respNome = document.getElementById('casa-resp-nome').value.trim();
  const respEmp = document.getElementById('casa-resp-empresa').value.trim();
  const respTel = document.getElementById('casa-resp-telefone').value.trim();
  const respQuarto = document.getElementById('casa-resp-quarto').value.trim();

  let casaAlvo;
  if (editId) {
    casaAlvo = appState.casas.find(c => c.id === editId);
    if (casaAlvo) {
      casaAlvo.nome = nome;
      casaAlvo.bloco = bloco;
      casaAlvo.capacidade = cap;
      casaAlvo.moradoresAtuais = mor;
      casaAlvo.status = mor >= cap ? 'Ocupada' : 'Disponível';
      casaAlvo.responsavelNome = respNome;
      casaAlvo.responsavelEmpresa = respEmp;
      casaAlvo.responsavelTelefone = respTel;
      casaAlvo.responsavelQuarto = respQuarto;
      mostrarToast(`Casa "${nome}" atualizada com sucesso!`, 'success');
    }
  } else {
    casaAlvo = {
      id: 'casa-' + Date.now(),
      nome: nome,
      bloco: bloco,
      capacidade: cap,
      moradoresAtuais: mor,
      status: mor >= cap ? 'Ocupada' : 'Disponível',
      responsavelNome: respNome,
      responsavelEmpresa: respEmp,
      responsavelTelefone: respTel,
      responsavelQuarto: respQuarto,
      dataCautela: new Date().toISOString().split('T')[0],
      observacoes: ''
    };
    appState.casas.push(casaAlvo);
    mostrarToast(`Nova casa "${nome}" cadastrada com sucesso!`, 'success');
  }

  salvarLocalmente();
  closeModal('modal-nova-casa');
  document.getElementById('form-casa').reset();
  document.getElementById('casa-edit-id').value = '';
  document.getElementById('modal-casa-title').textContent = 'Cadastrar Casa / Alojamento';
  renderApp();

  if (appState.config.turso?.ativo && casaAlvo) {
    executarTurso(`INSERT OR REPLACE INTO casas (id, nome, bloco, capacidade, moradores_atuais, status, responsavel_nome, responsavel_empresa, responsavel_telefone, responsavel_quarto, data_cautela, observacoes)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [casaAlvo.id, casaAlvo.nome, casaAlvo.bloco, casaAlvo.capacidade, casaAlvo.moradoresAtuais, casaAlvo.status, casaAlvo.responsavelNome, casaAlvo.responsavelEmpresa, casaAlvo.responsavelTelefone, casaAlvo.responsavelQuarto, casaAlvo.dataCautela, casaAlvo.observacoes || '']
    ).catch(console.error);
  }
}

function salvarNovoItemGalpao(e) {
  e.preventDefault();
  const nome = document.getElementById('item-galpao-nome').value.trim();
  const categoria = document.getElementById('item-galpao-categoria').value;
  const unidade = document.getElementById('item-galpao-unidade').value;
  const estoqueMinimo = parseInt(document.getElementById('item-galpao-minimo').value, 10) || 0;
  const saldoInicial = parseInt(document.getElementById('item-galpao-saldo').value, 10) || 0;
  const localizacao = document.getElementById('item-galpao-localizacao').value.trim();
  const custo = parseFloat(document.getElementById('item-galpao-custo').value) || 0;

  const novoItem = {
    id: 'item-' + Date.now(),
    nome: nome,
    categoria: categoria,
    unidade: unidade,
    saldoAtual: saldoInicial,
    estoqueMinimo: estoqueMinimo,
    localizacao: localizacao,
    custoUnitario: custo,
    icone: categoria === 'Móveis & Equipamentos' ? 'fa-couch' : (categoria === 'Produtos de Limpeza' ? 'fa-broom' : 'fa-box')
  };

  appState.galpao.push(novoItem);
  salvarLocalmente();
  closeModal('modal-novo-item-galpao');
  document.getElementById('form-item-galpao').reset();
  renderApp();
  mostrarToast(`Item "${nome}" cadastrado no Galpão com sucesso!`, 'success');

  if (appState.config.turso?.ativo) {
    executarTurso(`INSERT INTO galpao_itens (id, nome, categoria, unidade, saldo_atual, estoque_minimo, localizacao, custo_unitario, icone, data_cadastro)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [novoItem.id, novoItem.nome, novoItem.categoria, novoItem.unidade, novoItem.saldoAtual, novoItem.estoqueMinimo, novoItem.localizacao, novoItem.custoUnitario, novoItem.icone, new Date().toISOString()]
    ).catch(console.error);
  }
}

function prepararEntradaItem(itemId) {
  openModal('modal-entrada-galpao');
  const sel = document.getElementById('entrada-galpao-item-id');
  if (sel) sel.value = itemId;
}

function prepararEntregaItem(itemId) {
  openModal('modal-entrega-casa');
  popularSelects();
  const sel = document.getElementById('entrega-item-id');
  if (sel) {
    sel.value = itemId;
    atualizarInfoItemEntrega();
  }
}

function abrirModalAdicionarMovelCasa() {
  closeModal('modal-dossie-casa');
  openModal('modal-entrega-casa');
  popularSelects();
  const selCasa = document.getElementById('entrega-casa-id');
  if (selCasa && appState.dossieCasaAtualId) {
    selCasa.value = appState.dossieCasaAtualId;
    atualizarInfoCasaEntrega();
  }
}

function abrirModalEntregaInsumoCasaAtual() {
  abrirModalAdicionarMovelCasa();
}

function editarResponsavelCasaAtual() {
  const casa = appState.casas.find(c => c.id === appState.dossieCasaAtualId);
  if (!casa) return;

  document.getElementById('casa-edit-id').value = casa.id;
  document.getElementById('casa-nome').value = casa.nome;
  document.getElementById('casa-bloco').value = casa.bloco || '';
  document.getElementById('casa-capacidade').value = casa.capacidade;
  document.getElementById('casa-moradores').value = casa.moradoresAtuais;
  document.getElementById('casa-resp-nome').value = casa.responsavelNome || '';
  document.getElementById('casa-resp-empresa').value = casa.responsavelEmpresa || '';
  document.getElementById('casa-resp-telefone').value = casa.responsavelTelefone || '';
  document.getElementById('casa-resp-quarto').value = casa.responsavelQuarto || '';

  document.getElementById('modal-casa-title').textContent = 'Editar Casa / Responsável';
  closeModal('modal-dossie-casa');
  openModal('modal-nova-casa');
}

// ==========================================
// 8. TERMO DE CAUTELA OFICIAL & WHATSAPP
// ==========================================
function imprimirTermoCautelaCasa() {
  imprimirTermoCautelaDireto(appState.dossieCasaAtualId);
}

function imprimirTermoCautelaDireto(casaId) {
  const casa = appState.casas.find(c => c.id === casaId);
  if (!casa) return;

  const moveis = appState.casaMoveis.filter(m => m.casaId === casa.id);
  const printArea = document.getElementById('print-area');
  const agora = new Date().toLocaleString('pt-BR');

  printArea.innerHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; border: 2px solid #000; padding: 25px; border-radius: 6px;">
      
      <!-- Cabeçalho Oficial -->
      <div style="border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <h1 style="margin: 0; font-size: 20px; text-transform: uppercase;">${appState.config.nomeObra}</h1>
          <h2 style="margin: 4px 0 0 0; font-size: 13px; color: #444;">TERMO DE CAUTELA, GUARDA E RESPONSABILIDADE DE ALOJAMENTO</h2>
        </div>
        <div style="text-align: right; font-size: 11px;">
          Emissão: <strong>${agora}</strong>
        </div>
      </div>

      <!-- Dados da Casa e do Responsável -->
      <div style="background: #f7f7f7; border: 1px solid #ccc; padding: 12px; margin-bottom: 20px; border-radius: 4px; font-size: 12px; line-height: 1.6;">
        <div style="display: flex; justify-content: space-between;">
          <div><strong>Alojamento / Imóvel:</strong> ${casa.nome} (${casa.bloco || 'Canteiro Central'})</div>
          <div><strong>Lotação Autorizada:</strong> ${casa.moradoresAtuais}/${casa.capacidade} Moradores</div>
        </div>
        <div><strong>Responsável Nominal:</strong> ${casa.responsavelNome || 'Não declarado'}</div>
        <div style="display: flex; justify-content: space-between;">
          <div><strong>Empresa / Empreiteira:</strong> ${casa.responsavelEmpresa || '-'}</div>
          <div><strong>Contato / Tel:</strong> ${casa.responsavelTelefone || '-'}</div>
        </div>
        <div><strong>Quarto / Leito do Responsável:</strong> ${casa.responsavelQuarto || '-'}</div>
      </div>

      <!-- Tabela de Móveis e Bens da Casa -->
      <h3 style="font-size: 13px; text-transform: uppercase; margin: 0 0 8px 0; border-bottom: 1px solid #000; padding-bottom: 4px;">
        Relação de Móveis, Eletrodomésticos e Equipamentos Confiados
      </h3>

      <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px;">
        <thead>
          <tr style="background: #e5e5e5;">
            <th style="border: 1px solid #888; padding: 6px; text-align: left;">Item / Mobiliário</th>
            <th style="border: 1px solid #888; padding: 6px; text-align: center;">Qtd.</th>
            <th style="border: 1px solid #888; padding: 6px; text-align: center;">Estado</th>
            <th style="border: 1px solid #888; padding: 6px; text-align: center;">Patrimônio</th>
            <th style="border: 1px solid #888; padding: 6px; text-align: left;">Observações</th>
          </tr>
        </thead>
        <tbody>
          ${moveis.map(m => `
            <tr>
              <td style="border: 1px solid #ccc; padding: 6px; font-weight: bold;">${m.itemNome}</td>
              <td style="border: 1px solid #ccc; padding: 6px; text-align: center; font-size: 12px; font-weight: bold;">${m.quantidade}</td>
              <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">${m.estado || 'Bom'}</td>
              <td style="border: 1px solid #ccc; padding: 6px; text-align: center; font-family: monospace;">${m.patrimonio || '-'}</td>
              <td style="border: 1px solid #ccc; padding: 6px;">${m.observacoes || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Cláusula de Responsabilidade -->
      <div style="font-size: 10.5px; line-height: 1.5; text-align: justify; color: #222; margin-bottom: 40px; border-top: 1px solid #ccc; padding-top: 10px;">
        <p style="margin: 0 0 6px 0;">
          <strong>DECLARAÇÃO DE COMPROMISSO E FIEL DEPOSITÁRIO:</strong> Declaro para os devidos fins que recebi em perfeitas condições de uso, conservação e funcionamento os bens patrimoniais acima relacionados instalados na unidade habitacional. Comprometo-me a zelar pela integridade dos mesmos, fiscalizar o uso pelos moradores da referida casa e comunicar imediatamente à Prefeitura do Canteiro qualquer avaria, furto ou extravio. No término das atividades ou desocupação, comprometo-me a devolver os bens nas mesmas condições recebidas.
        </p>
      </div>

      <!-- Assinaturas -->
      <div style="display: flex; justify-content: space-around; font-size: 11px; margin-top: 50px;">
        <div style="border-top: 1px solid #000; width: 42%; text-align: center; padding-top: 6px;">
          <strong>${casa.responsavelNome || 'Responsável pela Casa'}</strong><br>
          <span style="color: #555;">Encarregado (${casa.responsavelEmpresa || 'Empreiteira'})</span>
        </div>
        <div style="border-top: 1px solid #000; width: 42%; text-align: center; padding-top: 6px;">
          <strong>Prefeito de Obra / Gestor de Alojamentos</strong><br>
          <span style="color: #555;">Fiscalização & Patrimônio Canteiro PRO</span>
        </div>
      </div>

    </div>
  `;

  window.print();
}

function compartilharWhatsAppCautelaCasa() {
  const casa = appState.casas.find(c => c.id === appState.dossieCasaAtualId);
  if (!casa) return;

  const moveis = appState.casaMoveis.filter(m => m.casaId === casa.id);
  const dataFmt = new Date().toLocaleDateString('pt-BR');

  let txt = `*FICHA DE CAUTELA DE ALOJAMENTO - ${appState.config.nomeObra.toUpperCase()}*\n`;
  txt += `🏠 *Unidade:* ${casa.nome} (${casa.bloco || 'Canteiro'})\n`;
  txt += `👤 *Responsável:* ${casa.responsavelNome}\n`;
  txt += `🏢 *Empresa:* ${casa.responsavelEmpresa}\n`;
  txt += `👥 *Lotação:* ${casa.moradoresAtuais}/${casa.capacidade} Moradores\n`;
  txt += `📅 *Data da Auditoria:* ${dataFmt}\n\n`;
  txt += `📋 *MOBILIÁRIO CONFERIDO NA CASA:*\n`;

  moveis.forEach(m => {
    txt += `• ${m.quantidade}x ${m.itemNome} [Estado: ${m.estado}] ${m.patrimonio ? '(Pat: ' + m.patrimonio + ')' : ''}\n`;
  });

  txt += `\n🔐 _Registro autenticado pelo Canteiro PRO com banco de dados centralizado._`;

  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(txt)}`;
  window.open(url, '_blank');
}

// ==========================================
// 9. EXPORTAÇÃO EXCEL (.XLSX) COM 3 ABAS
// ==========================================
function exportarExcelConsolidado() {
  if (typeof XLSX === 'undefined') {
    mostrarToast('Biblioteca Excel carregando. Verifique sua conexão.', 'error');
    return;
  }

  // 1. Aba Galpão
  const dadosGalpao = appState.galpao.map(i => ({
    'Código': i.id,
    'Nome do Insumo/Móvel': i.nome,
    'Categoria': i.categoria,
    'Unidade': i.unidade,
    'Saldo no Galpão': i.saldoAtual,
    'Estoque Mínimo': i.estoqueMinimo,
    'Localização': i.localizacao || '',
    'Custo Unitário R$': i.custoUnitario || 0,
    'Total Imobilizado R$': ((i.saldoAtual || 0) * (i.custoUnitario || 0)).toFixed(2)
  }));

  // 2. Aba Casas e Inventário
  const dadosCasas = [];
  appState.casas.forEach(casa => {
    const moveis = appState.casaMoveis.filter(m => m.casaId === casa.id);
    if (moveis.length === 0) {
      dadosCasas.push({
        'Casa': casa.nome,
        'Bloco': casa.bloco || '',
        'Capacidade': casa.capacidade,
        'Moradores': casa.moradoresAtuais,
        'Responsável': casa.responsavelNome || '',
        'Empresa': casa.responsavelEmpresa || '',
        'Telefone': casa.responsavelTelefone || '',
        'Móvel': 'Sem móveis vinculados',
        'Qtd': 0,
        'Estado': '-',
        'Patrimônio': '-'
      });
    } else {
      moveis.forEach(m => {
        dadosCasas.push({
          'Casa': casa.nome,
          'Bloco': casa.bloco || '',
          'Capacidade': casa.capacidade,
          'Moradores': casa.moradoresAtuais,
          'Responsável': casa.responsavelNome || '',
          'Empresa': casa.responsavelEmpresa || '',
          'Telefone': casa.responsavelTelefone || '',
          'Móvel': m.itemNome,
          'Qtd': m.quantidade,
          'Estado': m.estado || 'Bom',
          'Patrimônio': m.patrimonio || ''
        });
      });
    }
  });

  // 3. Aba Movimentações
  const dadosMovs = appState.movimentacoes.map(m => ({
    'ID': m.id,
    'Data/Hora': formatarDataHora(m.dataHora),
    'Tipo': m.tipo,
    'Item': m.itemNome,
    'Quantidade': m.quantidade,
    'Unidade': m.unidade || '',
    'Casa / Destino': m.casaNome || 'Galpão Central',
    'Responsável': m.responsavel || '',
    'Empresa': m.empresa || '',
    'Motivo': m.motivo || '',
    'Saldo Pós-Operação': m.saldoPosterior
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dadosGalpao), '1. Galpão Central');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dadosCasas), '2. Inventário Casas');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dadosMovs), '3. Movimentações');

  const nomeArq = `CanteiroPRO_${appState.config.nomeObra.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, nomeArq);
  mostrarToast('Planilha Excel de 3 Abas exportada com sucesso!', 'success');
}

// ==========================================
// CONFIGURAÇÕES, BACKUP & NAVEGAÇÃO
// ==========================================
function salvarConfiguracoes() {
  const obra = document.getElementById('cfg-nome-obra')?.value.trim();
  if (obra) {
    appState.config.nomeObra = obra;
    document.getElementById('nome-obra-txt').textContent = obra;
  }
  salvarLocalmente();
  closeModal('modal-config');
  renderApp();
  mostrarToast('Configurações salvas com sucesso!', 'success');
}

function fazerBackupJSON() {
  const data = {
    versao: '2.0-casas',
    data: new Date().toISOString(),
    config: appState.config,
    galpao: appState.galpao,
    casas: appState.casas,
    casaMoveis: appState.casaMoveis,
    casaEntregas: appState.casaEntregas,
    movimentacoes: appState.movimentacoes
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `backup_canteiro_casas_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  mostrarToast('Backup baixado com sucesso!', 'success');
}

function restaurarBackupJSON(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const d = JSON.parse(evt.target.result);
      if (d.galpao && d.casas) {
        appState.galpao = d.galpao;
        appState.casas = d.casas;
        appState.casaMoveis = d.casaMoveis || [];
        appState.casaEntregas = d.casaEntregas || [];
        appState.movimentacoes = d.movimentacoes || [];
        salvarLocalmente();
        closeModal('modal-config');
        renderApp();
        mostrarToast('Backup restaurado com sucesso!', 'success');
      }
    } catch (err) {
      mostrarToast('Arquivo de backup inválido!', 'error');
    }
  };
  reader.readAsText(file);
}

function switchTab(tabId) {
  appState.activeTab = tabId;

  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
  const activeEl = document.getElementById(`tab-${tabId}`);
  if (activeEl) activeEl.classList.remove('hidden');

  document.querySelectorAll('.nav-tab').forEach(b => {
    if (b.getAttribute('data-target') === tabId) {
      b.className = 'nav-tab active px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition text-amber-400 bg-amber-500/10';
    } else {
      b.className = 'nav-tab px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition text-slate-400 hover:text-slate-200 hover:bg-slate-800';
    }
  });

  document.querySelectorAll('.mobile-nav-btn').forEach(b => {
    if (b.getAttribute('data-target') === tabId) {
      b.className = 'mobile-nav-btn active flex flex-col items-center justify-center py-1 text-amber-400 transition';
    } else {
      b.className = 'mobile-nav-btn flex flex-col items-center justify-center py-1 text-slate-400 hover:text-slate-200 transition';
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (tabId === 'dashboard') {
    setTimeout(renderGraficos, 100);
  }
}

function openModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.fixed.z-50:not(.hidden)').forEach(m => m.classList.add('hidden'));
    document.body.classList.remove('overflow-hidden');
  }
});

function formatarDataHora(iso) {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return iso;
  }
}

let toastT;
function mostrarToast(msg, tipo = 'info') {
  const toast = document.getElementById('toast');
  const txt = document.getElementById('toast-msg');
  const ico = document.getElementById('toast-icon');
  if (!toast || !txt) return;

  txt.textContent = msg;

  if (tipo === 'success') {
    ico.className = 'fa-solid fa-circle-check text-emerald-400 text-lg';
    toast.style.borderColor = '#10b981';
  } else if (tipo === 'error') {
    ico.className = 'fa-solid fa-circle-exclamation text-rose-400 text-lg';
    toast.style.borderColor = '#f43f5e';
  } else if (tipo === 'warning') {
    ico.className = 'fa-solid fa-triangle-exclamation text-amber-400 text-lg';
    toast.style.borderColor = '#f59e0b';
  } else {
    ico.className = 'fa-solid fa-circle-info text-blue-400 text-lg';
    toast.style.borderColor = '#3b82f6';
  }

  toast.classList.remove('translate-y-[-150%]', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');

  clearTimeout(toastT);
  toastT = setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-[-150%]', 'opacity-0', 'pointer-events-none');
  }, 3500);
}

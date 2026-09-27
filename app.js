/**
 * Almoxarifado Canteiro PRO - Aplicação de Gestão de Estoque para Canteiros de Obras
 * Arquitetura Mobile-First / PWA com suporte Offline & Sincronização Firebase Firestore
 */

// ==========================================
// ESTADO GLOBAL DA APLICAÇÃO
// ==========================================
const DB_KEYS = {
  ITENS: 'almox_itens_v1',
  MOVIMENTACOES: 'almox_movimentacoes_v1',
  CONFIG: 'almox_config_v1'
};

let appState = {
  itens: [],
  movimentacoes: [],
  config: {
    nomeObra: 'Canteiro Central - Alojamento Tiago Vidal',
    firebaseConfig: null,
    turso: {
      url: 'https://controle-de-estoque-tiago-vidal-eullon.aws-ap-northeast-1.turso.io',
      token: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTA1MzAzNzEsImlkIjoiMDFhMGUzZWMtMGYwMS03ZWQyLWEwNDctOTAzOTIzMTU4ZDg1Iiwia2lkIjoieVBrMDU1VFZmdmRERjRQQ0V6M2tLY1FjRm9QUW1QTUNXNXBiYWR4VTlaayIsInJpZCI6IjFjZmQzMjEyLWE5YmUtNDUyNi05MGNhLTIwNTQwNDk1OGFkOSJ9.jZalav1d9oUuLIbEE1o_OWhT6j6dZyeQ-WBfv2SYLI97Hv_LgAYY1gChB2MQKOrrezz60kSj1HtGolmsO5m5Cg',
      ativo: true
    }
  },
  tursoConectado: false,
  estoqueView: 'cards', // 'cards' ou 'table'
  activeTab: 'dashboard',
  tipoEntradaAtual: 'com_nf',
  fotoNfBase64: null,
  firestoreDb: null,
  isOnline: navigator.onLine,
  chartFluxo: null,
  chartCategorias: null,
  currentModalComprovanteId: null
};

// ==========================================
// SEED DATA (DADOS INICIAIS DE DEMONSTRAÇÃO)
// ==========================================
const ITENS_PADRAO = [
  {
    id: 'item-1',
    nome: 'Travesseiro com Capa Impermeável',
    categoria: 'Roupas de Cama',
    unidade: 'Unidade',
    estoqueMinimo: 15,
    saldoAtual: 32,
    localizacao: 'Armário A - Prateleira 1',
    dataCadastro: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 'item-2',
    nome: 'Lençol Solteiro com Elástico',
    categoria: 'Roupas de Cama',
    unidade: 'Unidade',
    estoqueMinimo: 30,
    saldoAtual: 65,
    localizacao: 'Armário A - Prateleira 2',
    dataCadastro: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 'item-3',
    nome: 'Fronha Algodão Branca',
    categoria: 'Roupas de Cama',
    unidade: 'Unidade',
    estoqueMinimo: 30,
    saldoAtual: 48,
    localizacao: 'Armário A - Prateleira 3',
    dataCadastro: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 'item-4',
    nome: 'Cobertor Térmico Microfibra',
    categoria: 'Roupas de Cama',
    unidade: 'Unidade',
    estoqueMinimo: 20,
    saldoAtual: 24,
    localizacao: 'Armário B - Prateleira 1',
    dataCadastro: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 'item-5',
    nome: 'Sabão em Pó 1kg',
    categoria: 'Higiene & Limpeza',
    unidade: 'Pacote',
    estoqueMinimo: 15,
    saldoAtual: 8, // Alerta!
    localizacao: 'Depósito Limpeza - Prateleira C',
    dataCadastro: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 'item-6',
    nome: 'Desinfetante Pinho 2 Litros',
    categoria: 'Higiene & Limpeza',
    unidade: 'Litro',
    estoqueMinimo: 15,
    saldoAtual: 22,
    localizacao: 'Depósito Limpeza - Prateleira C',
    dataCadastro: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 'item-7',
    nome: 'Papel Higiênico Folha Dupla (Pct c/ 4)',
    categoria: 'Higiene & Limpeza',
    unidade: 'Pacote',
    estoqueMinimo: 25,
    saldoAtual: 0, // Crítico!
    localizacao: 'Depósito Limpeza - Pallet 1',
    dataCadastro: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 'item-8',
    nome: 'Água Sanitária 2 Litros',
    categoria: 'Higiene & Limpeza',
    unidade: 'Litro',
    estoqueMinimo: 12,
    saldoAtual: 16,
    localizacao: 'Depósito Limpeza - Prateleira B',
    dataCadastro: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 'item-9',
    nome: 'Vassoura de Piaçava c/ Cabo Reforçado',
    categoria: 'Utensílios',
    unidade: 'Unidade',
    estoqueMinimo: 6,
    saldoAtual: 3, // Alerta!
    localizacao: 'Suporte de Vassouras',
    dataCadastro: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 'item-10',
    nome: 'Saco de Lixo Reforçado 100L (Pct c/ 20)',
    categoria: 'Higiene & Limpeza',
    unidade: 'Pacote',
    estoqueMinimo: 10,
    saldoAtual: 18,
    localizacao: 'Depósito Limpeza - Prateleira A',
    dataCadastro: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 'item-11',
    nome: 'Cadeado Latão 25mm p/ Armário Alojamento',
    categoria: 'Manutenção',
    unidade: 'Unidade',
    estoqueMinimo: 8,
    saldoAtual: 14,
    localizacao: 'Gaveteiro Almoxarife - Gaveta 2',
    dataCadastro: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 'item-12',
    nome: 'Detergente Neutro 500ml',
    categoria: 'Higiene & Limpeza',
    unidade: 'Unidade',
    estoqueMinimo: 20,
    saldoAtual: 35,
    localizacao: 'Depósito Limpeza - Prateleira D',
    dataCadastro: '2026-09-01T08:00:00.000Z'
  }
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
    motivo: 'Compra contratual de enxoval para novo lote de alojados',
    fotoNf: null,
    assinatura: null
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
    observacoes: 'Entregue 3 travesseiros para nova turma de pedreiros',
    fotoNf: null,
    assinatura: null
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
    motivo: 'Compra emergencial no supermercado da cidade para lavanderia dos alojamentos',
    fotoNf: null,
    assinatura: null
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
    observacoes: 'Uso nas máquinas de lavar do alojamento',
    fotoNf: null,
    assinatura: null
  }
];

// ==========================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  carregarDadosLocais();
  configurarDataTopo();
  configurarCanvasAssinatura();
  configurarEventosRede();
  inicializarFirebaseSeDisponivel();
  renderApp();
  await inicializarTursoSeDisponivel();
});

function carregarDadosLocais() {
  const itensStorage = localStorage.getItem(DB_KEYS.ITENS);
  const movStorage = localStorage.getItem(DB_KEYS.MOVIMENTACOES);
  const configStorage = localStorage.getItem(DB_KEYS.CONFIG);

  if (itensStorage) {
    try {
      appState.itens = JSON.parse(itensStorage);
    } catch (e) {
      appState.itens = [...ITENS_PADRAO];
    }
  } else {
    appState.itens = [...ITENS_PADRAO];
    salvarEstadoItens();
  }

  if (movStorage) {
    try {
      appState.movimentacoes = JSON.parse(movStorage);
    } catch (e) {
      appState.movimentacoes = [...MOVIMENTACOES_PADRAO];
    }
  } else {
    appState.movimentacoes = [...MOVIMENTACOES_PADRAO];
    salvarEstadoMovimentacoes();
  }

  if (configStorage) {
    try {
      appState.config = Object.assign(appState.config, JSON.parse(configStorage));
    } catch (e) {}
  }

  // Preenche dados no cabeçalho e configurações
  const elNomeObra = document.getElementById('cidade-obra-txt');
  if (elNomeObra) elNomeObra.textContent = appState.config.nomeObra;
  const inputNomeObra = document.getElementById('cfg-nome-obra');
  if (inputNomeObra) inputNomeObra.value = appState.config.nomeObra;

  // Preenche credenciais do Turso se disponíveis
  const inputTursoUrl = document.getElementById('cfg-turso-url');
  if (inputTursoUrl && appState.config.turso?.url) {
    inputTursoUrl.value = appState.config.turso.url;
  }
  const inputTursoToken = document.getElementById('cfg-turso-token');
  if (inputTursoToken && appState.config.turso?.token) {
    inputTursoToken.value = appState.config.turso.token;
  }

  const cfgFirebaseTextarea = document.getElementById('cfg-firebase-json');
  if (cfgFirebaseTextarea && appState.config.firebaseConfig) {
    cfgFirebaseTextarea.value = JSON.stringify(appState.config.firebaseConfig, null, 2);
  }
}

function salvarEstadoItens() {
  localStorage.setItem(DB_KEYS.ITENS, JSON.stringify(appState.itens));
  if (appState.firestoreDb) {
    sincronizarFirestore('itens', appState.itens);
  }
}

function salvarEstadoMovimentacoes() {
  localStorage.setItem(DB_KEYS.MOVIMENTACOES, JSON.stringify(appState.movimentacoes));
  if (appState.firestoreDb) {
    sincronizarFirestore('movimentacoes', appState.movimentacoes);
  }
}

function salvarEstadoConfig() {
  localStorage.setItem(DB_KEYS.CONFIG, JSON.stringify(appState.config));
}

function configurarDataTopo() {
  const el = document.getElementById('data-topo');
  if (el) {
    const hoje = new Date();
    const opcoes = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    el.textContent = hoje.toLocaleDateString('pt-BR', opcoes);
  }
}

function configurarEventosRede() {
  window.addEventListener('online', () => {
    appState.isOnline = true;
    atualizarBadgeConexao();
    mostrarToast('Conexão restabelecida!', 'success');
    inicializarTursoSeDisponivel();
  });

  window.addEventListener('offline', () => {
    appState.isOnline = false;
    atualizarBadgeConexao();
    mostrarToast('Canteiro sem internet! Modo Offline ativo.', 'warning');
  });

  atualizarBadgeConexao();
}

function atualizarBadgeConexao() {
  const cloudIcon = document.getElementById('cloud-icon');
  const cloudLabel = document.getElementById('cloud-label');
  const badgeFirebase = document.getElementById('badge-firebase-status');
  const badgeTurso = document.getElementById('badge-turso-status');
  const badgeTursoTxt = document.getElementById('badge-turso-txt');

  if (!appState.isOnline) {
    if (cloudIcon) {
      cloudIcon.className = 'fa-solid fa-plane-slash text-rose-400';
    }
    if (cloudLabel) cloudLabel.textContent = 'Sem Internet (Offline)';
    if (badgeTurso) {
      badgeTurso.className = 'text-xs px-2.5 py-0.5 rounded-full bg-rose-950/80 text-rose-400 border border-rose-700 font-semibold flex items-center gap-1.5';
    }
    if (badgeTursoTxt) badgeTursoTxt.textContent = 'Sem Conexão';
    if (badgeFirebase) {
      badgeFirebase.className = 'text-xs px-2 py-0.5 rounded-full bg-rose-900/60 text-rose-300 border border-rose-700';
      badgeFirebase.textContent = 'Offline (Cache local seguro)';
    }
  } else if (appState.tursoConectado) {
    if (cloudIcon) {
      cloudIcon.className = 'fa-solid fa-server text-emerald-400 animate-pulse';
    }
    if (cloudLabel) cloudLabel.textContent = 'Turso Conectado';
    if (badgeTurso) {
      badgeTurso.className = 'text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-600 font-semibold flex items-center gap-1.5';
    }
    if (badgeTursoTxt) badgeTursoTxt.textContent = 'Conectado em Tempo Real';
  } else if (appState.firestoreDb) {
    if (cloudIcon) {
      cloudIcon.className = 'fa-solid fa-cloud text-emerald-400 animate-pulse';
    }
    if (cloudLabel) cloudLabel.textContent = 'Firebase Conectado';
    if (badgeFirebase) {
      badgeFirebase.className = 'text-xs px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700';
      badgeFirebase.textContent = 'Conectado em Tempo Real';
    }
  } else {
    if (cloudIcon) {
      cloudIcon.className = 'fa-solid fa-database text-amber-400';
    }
    if (cloudLabel) cloudLabel.textContent = 'Modo Local';
    if (badgeTurso) {
      badgeTurso.className = 'text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-semibold flex items-center gap-1.5';
    }
    if (badgeTursoTxt) badgeTursoTxt.textContent = 'Não Conectado';
    if (badgeFirebase) {
      badgeFirebase.className = 'text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700';
      badgeFirebase.textContent = 'Modo Local (Offline)';
    }
  }
}

// ==========================================
// RENDERIZAÇÃO COMPLETA DA APLICAÇÃO
// ==========================================
function renderApp() {
  renderKPIs();
  renderUrgentBanner();
  renderGraficos();
  renderUltimasMovimentacoes();
  renderEstoque();
  renderKardex();
  renderRelatorios();
  popularSelectsItens();
}

// ==========================================
// 1. DASHBOARD & KPIS
// ==========================================
function renderKPIs() {
  const totalItens = appState.itens.length;
  const totalUnidades = appState.itens.reduce((acc, item) => acc + (Number(item.saldoAtual) || 0), 0);
  
  // Itens em alerta ou crítico
  const itensAlerta = appState.itens.filter(item => Number(item.saldoAtual) <= Number(item.estoqueMinimo));
  
  // Saídas do mês atual
  const agora = new Date();
  const mesAtual = agora.getMonth();
  const anoAtual = agora.getFullYear();

  const saidasMes = appState.movimentacoes.filter(m => {
    if (m.tipo !== 'SAIDA') return false;
    const d = new Date(m.dataHora);
    return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
  }).reduce((acc, m) => acc + (Number(m.quantidade) || 0), 0);

  document.getElementById('kpi-total-itens').textContent = totalItens;
  document.getElementById('kpi-total-unidades').textContent = totalUnidades.toLocaleString('pt-BR');
  document.getElementById('kpi-alertas-criticos').textContent = itensAlerta.length;
  document.getElementById('kpi-saidas-mes').textContent = saidasMes.toLocaleString('pt-BR');
  
  const badgeItensTotal = document.getElementById('badge-itens-total');
  if (badgeItensTotal) badgeItensTotal.textContent = totalItens;
}

function renderUrgentBanner() {
  const banner = document.getElementById('urgent-banner');
  const bannerTitle = document.getElementById('urgent-banner-title');
  const bannerDesc = document.getElementById('urgent-banner-desc');

  const itensCriticos = appState.itens.filter(i => Number(i.saldoAtual) === 0);
  const itensAlerta = appState.itens.filter(i => Number(i.saldoAtual) > 0 && Number(i.saldoAtual) <= Number(i.estoqueMinimo));

  if (itensCriticos.length > 0 || itensAlerta.length > 0) {
    banner.classList.remove('hidden');
    bannerTitle.textContent = `⚠️ Atenção: ${itensCriticos.length} item(ns) zerado(s) e ${itensAlerta.length} abaixo do estoque mínimo!`;
    bannerDesc.textContent = `Alojamento necessita de reposição urgente de insumos essenciais.`;
  } else {
    banner.classList.add('hidden');
  }
}

function filterEstoqueAlertas() {
  switchTab('estoque');
  const filtroStatus = document.getElementById('filtro-status');
  if (filtroStatus) {
    filtroStatus.value = 'alerta';
    renderEstoque();
  }
}

// ==========================================
// GRÁFICOS (CHART.JS)
// ==========================================
function renderGraficos() {
  renderChartFluxoSemanal();
  renderChartCategorias();
}

function renderChartFluxoSemanal() {
  const canvas = document.getElementById('chart-fluxo-semanal');
  if (!canvas) return;

  // Monta labels dos últimos 7 dias
  const labels = [];
  const entradasMap = {};
  const saidasMap = {};

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const diaMes = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    labels.push(diaMes);
    entradasMap[key] = 0;
    saidasMap[key] = 0;
  }

  // Preenche dados reais das movimentações
  appState.movimentacoes.forEach(m => {
    const key = m.dataHora.split('T')[0];
    if (key in entradasMap) {
      if (m.tipo === 'ENTRADA') {
        entradasMap[key] += Number(m.quantidade) || 0;
      } else if (m.tipo === 'SAIDA') {
        saidasMap[key] += Number(m.quantidade) || 0;
      }
    }
  });

  const dataEntradas = Object.values(entradasMap);
  const dataSaidas = Object.values(saidasMap);

  if (appState.chartFluxo) {
    appState.chartFluxo.destroy();
  }

  const ctx = canvas.getContext('2d');
  appState.chartFluxo = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Entradas (Abastecimento)',
          data: dataEntradas,
          backgroundColor: '#10b981',
          borderRadius: 6
        },
        {
          label: 'Saídas (Cautelas)',
          data: dataSaidas,
          backgroundColor: '#f59e0b',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#151f32',
          titleColor: '#f1f5f9',
          bodyColor: '#cbd5e1',
          borderColor: '#23324d',
          borderWidth: 1,
          padding: 10
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(35, 50, 77, 0.4)' },
          ticks: { color: '#94a3b8', font: { size: 11 } }
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(35, 50, 77, 0.4)' },
          ticks: { color: '#94a3b8', font: { size: 11 }, precision: 0 }
        }
      }
    }
  });
}

function renderChartCategorias() {
  const canvas = document.getElementById('chart-categorias');
  const legendDiv = document.getElementById('chart-legend-categorias');
  if (!canvas) return;

  const categoriasMap = {};
  appState.itens.forEach(item => {
    const cat = item.categoria || 'Outros';
    categoriasMap[cat] = (categoriasMap[cat] || 0) + (Number(item.saldoAtual) || 0);
  });

  const labels = Object.keys(categoriasMap);
  const data = Object.values(categoriasMap);
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#64748b'
  ];

  if (appState.chartCategorias) {
    appState.chartCategorias.destroy();
  }

  const ctx = canvas.getContext('2d');
  appState.chartCategorias = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data.length > 0 ? data : [1],
        backgroundColor: data.length > 0 ? colors.slice(0, labels.length) : ['#334155'],
        borderWidth: 2,
        borderColor: '#151f32'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: { display: false }
      }
    }
  });

  // Legenda customizada
  if (legendDiv) {
    legendDiv.innerHTML = labels.map((cat, idx) => `
      <div class="flex items-center gap-1.5 truncate">
        <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${colors[idx % colors.length]}"></span>
        <span class="truncate">${cat}: <strong class="text-white">${categoriasMap[cat]}</strong></span>
      </div>
    `).join('');
  }
}

function renderUltimasMovimentacoes() {
  const container = document.getElementById('lista-ultimas-movimentacoes');
  if (!container) return;

  const ultimas = [...appState.movimentacoes]
    .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))
    .slice(0, 5);

  if (ultimas.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-slate-500 text-sm">
        <i class="fa-solid fa-inbox text-3xl mb-2 block"></i>
        Nenhuma movimentação realizada ainda.
      </div>
    `;
    return;
  }

  container.innerHTML = ultimas.map(m => {
    const isEntrada = m.tipo === 'ENTRADA';
    const icone = isEntrada ? 'fa-truck-ramp-box' : 'fa-hand-holding-hand';
    const corBadge = isEntrada ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    const sinal = isEntrada ? '+' : '-';
    const dataFmt = formatarDataHora(m.dataHora);

    return `
      <div onclick="abrirModalComprovante('${m.id}')" class="py-3 px-2 flex items-center justify-between hover:bg-slate-800/40 rounded-xl transition cursor-pointer group">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl ${corBadge} border flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition">
            <i class="fa-solid ${icone}"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-semibold text-white group-hover:text-amber-400 transition">${m.itemNome}</h4>
              <span class="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${corBadge}">${m.tipo}</span>
            </div>
            <p class="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>${isEntrada ? (m.fornecedor || m.origem || 'Fornecedor Local') : (m.responsavel + ' (' + m.empresa + ')')}</span>
              <span>•</span>
              <span>${dataFmt}</span>
            </p>
          </div>
        </div>

        <div class="text-right">
          <span class="text-sm font-bold ${isEntrada ? 'text-emerald-400' : 'text-amber-400'}">
            ${sinal}${m.quantidade} ${m.unidade || 'un'}
          </span>
          <p class="text-[11px] text-slate-500">Saldo: ${m.saldoPosterior}</p>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================
// 2. CATÁLOGO & ESTOQUE DE ITENS
// ==========================================
function getStatusItem(item) {
  const saldo = Number(item.saldoAtual) || 0;
  const min = Number(item.estoqueMinimo) || 0;

  if (saldo === 0) {
    return {
      codigo: 'critico',
      label: 'Crítico (Zerado)',
      cor: 'rose',
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      dotClass: 'bg-rose-500'
    };
  } else if (saldo <= min) {
    return {
      codigo: 'alerta',
      label: 'Alerta (Abaixo do Mínimo)',
      cor: 'amber',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dotClass: 'bg-amber-500'
    };
  } else {
    return {
      codigo: 'normal',
      label: 'Normal (Saudável)',
      cor: 'emerald',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dotClass: 'bg-emerald-500'
    };
  }
}

function setEstoqueView(view) {
  appState.estoqueView = view;
  const btnCards = document.getElementById('btn-view-cards');
  const btnTable = document.getElementById('btn-view-table');

  if (view === 'cards') {
    btnCards.className = 'p-1.5 px-2.5 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950 transition';
    btnTable.className = 'p-1.5 px-2.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition';
    document.getElementById('container-estoque-cards').classList.remove('hidden');
    document.getElementById('container-estoque-table').classList.add('hidden');
  } else {
    btnCards.className = 'p-1.5 px-2.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition';
    btnTable.className = 'p-1.5 px-2.5 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950 transition';
    document.getElementById('container-estoque-cards').classList.add('hidden');
    document.getElementById('container-estoque-table').classList.remove('hidden');
  }
  renderEstoque();
}

function filtrarItens() {
  const busca = (document.getElementById('filtro-busca-item')?.value || '').toLowerCase().trim();
  const cat = document.getElementById('filtro-categoria')?.value || '';
  const statusFiltro = document.getElementById('filtro-status')?.value || '';

  return appState.itens.filter(item => {
    const matchBusca = !busca || 
      item.nome.toLowerCase().includes(busca) || 
      (item.categoria && item.categoria.toLowerCase().includes(busca)) ||
      (item.localizacao && item.localizacao.toLowerCase().includes(busca));

    const matchCat = !cat || item.categoria === cat;

    const status = getStatusItem(item);
    const matchStatus = !statusFiltro || status.codigo === statusFiltro;

    return matchBusca && matchCat && matchStatus;
  });
}

function renderEstoque() {
  const itensFiltrados = filtrarItens();
  const txtContador = document.getElementById('txt-contador-filtrados');
  if (txtContador) {
    txtContador.textContent = `Exibindo ${itensFiltrados.length} de ${appState.itens.length} itens`;
  }

  // Renderiza cards (mobile-friendly)
  const containerCards = document.getElementById('container-estoque-cards');
  if (containerCards) {
    if (itensFiltrados.length === 0) {
      containerCards.innerHTML = `
        <div class="col-span-full p-8 text-center bg-[#151f32] border border-[#23324d] rounded-2xl text-slate-400">
          <i class="fa-solid fa-box-open text-4xl text-slate-600 mb-3 block"></i>
          <p class="font-semibold">Nenhum item encontrado com os filtros aplicados.</p>
          <button onclick="limparFiltrosEstoque()" class="mt-3 text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-1.5 rounded-lg border border-[#23324d]">
            Limpar Filtros
          </button>
        </div>
      `;
    } else {
      containerCards.innerHTML = itensFiltrados.map(item => {
        const status = getStatusItem(item);
        const percentual = item.estoqueMinimo > 0 ? Math.min(100, Math.round((item.saldoAtual / item.estoqueMinimo) * 100)) : 100;

        return `
          <div class="bg-[#151f32] border border-[#23324d] hover:border-slate-600 rounded-2xl p-4 flex flex-col justify-between transition group shadow-lg">
            <div>
              <!-- Cabeçalho do Card -->
              <div class="flex items-start justify-between gap-2 mb-2">
                <span class="text-[11px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60 truncate">
                  ${item.categoria || 'Geral'}
                </span>
                <span class="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full font-medium border ${status.badgeClass} shrink-0">
                  <span class="w-1.5 h-1.5 rounded-full ${status.dotClass} ${status.codigo !== 'normal' ? 'animate-pulse' : ''}"></span>
                  ${status.label.split(' ')[0]}
                </span>
              </div>

              <!-- Nome do Item -->
              <h3 class="text-base font-bold text-white group-hover:text-amber-400 transition leading-snug">
                ${item.nome}
              </h3>

              <!-- Localização / Detalhes -->
              <p class="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <i class="fa-solid fa-location-dot text-slate-500"></i>
                <span class="truncate">${item.localizacao || 'Almoxarifado Central'}</span>
              </p>

              <!-- Barra de Nível Visual -->
              <div class="mt-4 mb-2">
                <div class="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Mínimo: <strong class="text-slate-300">${item.estoqueMinimo} ${item.unidade}</strong></span>
                  <span>Saldo: <strong class="text-white text-sm">${item.saldoAtual} ${item.unidade}</strong></span>
                </div>
                <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-500 ${status.dotClass}" style="width: ${percentual}%"></div>
                </div>
              </div>
            </div>

            <!-- Botões de Ação Rápida Mobile-Friendly -->
            <div class="pt-3 border-t border-[#23324d]/80 grid grid-cols-4 gap-1.5 mt-2">
              <button onclick="prepararSaidaItem('${item.id}')" title="Registrar Saída/Cautela deste item" class="py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition">
                <i class="fa-solid fa-arrow-up-from-bracket"></i>
                <span class="hidden sm:inline">Saída</span>
              </button>

              <button onclick="prepararEntradaItem('${item.id}')" title="Nova Entrada/Abastecimento" class="py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition">
                <i class="fa-solid fa-plus"></i>
                <span class="hidden sm:inline">Entrada</span>
              </button>

              <button onclick="editarItem('${item.id}')" title="Editar Detalhes" class="py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center transition">
                <i class="fa-solid fa-pen"></i>
              </button>

              <button onclick="confirmarExclusaoItem('${item.id}')" title="Excluir do Catálogo" class="py-2 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 rounded-xl text-xs font-semibold flex items-center justify-center transition">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Renderiza tabela (desktop)
  const tbody = document.getElementById('tbody-estoque');
  if (tbody) {
    if (itensFiltrados.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="py-8 text-center text-slate-500">
            Nenhum insumo encontrado.
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = itensFiltrados.map(item => {
        const status = getStatusItem(item);
        return `
          <tr class="hover:bg-slate-800/40 transition">
            <td class="py-3 px-4">
              <span class="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full font-medium border ${status.badgeClass}">
                <span class="w-1.5 h-1.5 rounded-full ${status.dotClass}"></span>
                ${status.label}
              </span>
            </td>
            <td class="py-3 px-4 font-semibold text-white">
              ${item.nome}
              <span class="block text-xs font-normal text-slate-400">${item.localizacao || 'Almoxarifado Central'}</span>
            </td>
            <td class="py-3 px-4 text-slate-300 text-xs">${item.categoria}</td>
            <td class="py-3 px-4 text-center text-xs text-slate-300">${item.unidade}</td>
            <td class="py-3 px-4 text-center text-xs font-medium text-slate-400">${item.estoqueMinimo}</td>
            <td class="py-3 px-4 text-center font-bold text-base ${status.codigo === 'critico' ? 'text-rose-400' : (status.codigo === 'alerta' ? 'text-amber-400' : 'text-emerald-400')}">
              ${item.saldoAtual}
            </td>
            <td class="py-3 px-4 text-right">
              <div class="flex items-center justify-end gap-1.5">
                <button onclick="prepararSaidaItem('${item.id}')" title="Registrar Saída" class="p-1.5 px-2 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-xs font-bold transition">
                  <i class="fa-solid fa-arrow-up-from-bracket"></i>
                </button>
                <button onclick="prepararEntradaItem('${item.id}')" title="Abastecer" class="p-1.5 px-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-xs font-bold transition">
                  <i class="fa-solid fa-plus"></i>
                </button>
                <button onclick="editarItem('${item.id}')" title="Editar" class="p-1.5 px-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs transition">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button onclick="confirmarExclusaoItem('${item.id}')" title="Excluir" class="p-1.5 px-2 bg-slate-800 text-slate-400 hover:text-rose-400 rounded-lg text-xs transition">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
  }
}

function limparFiltrosEstoque() {
  const b = document.getElementById('filtro-busca-item');
  const c = document.getElementById('filtro-categoria');
  const s = document.getElementById('filtro-status');
  if (b) b.value = '';
  if (c) c.value = '';
  if (s) s.value = '';
  renderEstoque();
}

function popularSelectsItens() {
  const selectSaida = document.getElementById('saida-item-id');
  const selectEntrada = document.getElementById('entrada-item-id');

  const options = appState.itens.map(item => `
    <option value="${item.id}">${item.nome} (${item.categoria}) - Saldo: ${item.saldoAtual} ${item.unidade}</option>
  `).join('');

  if (selectSaida) {
    selectSaida.innerHTML = '<option value="">Selecione o item para retirar...</option>' + options;
  }
  if (selectEntrada) {
    selectEntrada.innerHTML = '<option value="">Selecione o item para abastecer...</option>' + options;
  }
}

// ==========================================
// 3. MÓDULO DE SAÍDAS / CAUTELAS
// ==========================================
function prepararSaidaItem(itemId) {
  openModal('modal-saida');
  const select = document.getElementById('saida-item-id');
  if (select) {
    select.value = itemId;
    atualizarInfoItemSaida();
  }
}

function atualizarInfoItemSaida() {
  const select = document.getElementById('saida-item-id');
  const box = document.getElementById('saida-saldo-box');
  const val = document.getElementById('saida-saldo-val');
  const inputQtd = document.getElementById('saida-quantidade');

  const item = appState.itens.find(i => i.id === select.value);
  if (item) {
    box.classList.remove('hidden');
    val.textContent = `${item.saldoAtual} ${item.unidade}`;
    if (inputQtd) {
      inputQtd.max = item.saldoAtual;
    }
  } else {
    box.classList.add('hidden');
  }
}

function salvarSaida(e) {
  e.preventDefault();
  const itemId = document.getElementById('saida-item-id').value;
  const quantidade = parseInt(document.getElementById('saida-quantidade').value, 10);
  const colaborador = document.getElementById('saida-nome-colaborador').value.trim();
  const empresa = document.getElementById('saida-empresa').value.trim();
  const quarto = document.getElementById('saida-quarto').value.trim();
  const motivo = document.getElementById('saida-motivo').value;
  const observacoes = document.getElementById('saida-obs').value.trim();

  if (!itemId) {
    mostrarToast('Por favor, selecione um item para saída!', 'error');
    return;
  }

  const itemIndex = appState.itens.findIndex(i => i.id === itemId);
  if (itemIndex === -1) {
    mostrarToast('Item não localizado!', 'error');
    return;
  }

  const item = appState.itens[itemIndex];
  if (quantidade <= 0 || isNaN(quantidade)) {
    mostrarToast('Informe uma quantidade válida para a retirada!', 'error');
    return;
  }

  if (quantidade > item.saldoAtual) {
    mostrarToast(`Saldo insuficiente! Estoque atual: ${item.saldoAtual} ${item.unidade}.`, 'error');
    return;
  }

  // Captura assinatura se desenhada
  const assinaturaBase64 = obterAssinaturaBase64();

  const saldoAnterior = item.saldoAtual;
  const saldoPosterior = saldoAnterior - quantidade;

  // Atualiza saldo do item
  item.saldoAtual = saldoPosterior;

  // Cria registro no Kardex
  const novaMovimentacao = {
    id: 'mov-' + Date.now(),
    tipo: 'SAIDA',
    itemId: item.id,
    itemNome: item.nome,
    categoria: item.categoria,
    unidade: item.unidade,
    quantidade: quantidade,
    saldoAnterior: saldoAnterior,
    saldoPosterior: saldoPosterior,
    dataHora: new Date().toISOString(),
    responsavel: colaborador,
    empresa: empresa,
    quarto: quarto || 'Não informado',
    motivo: motivo,
    observacoes: observacoes,
    assinatura: assinaturaBase64,
    tipoEntrada: null
  };

  appState.movimentacoes.unshift(novaMovimentacao);

  salvarEstadoItens();
  salvarEstadoMovimentacoes();
  salvarSaidaTurso(novaMovimentacao, item);

  closeModal('modal-saida');
  document.getElementById('form-saida').reset();
  limparCanvasAssinatura();

  renderApp();
  mostrarToast(`Saída de ${quantidade} ${item.unidade} de "${item.nome}" registrada com sucesso!`, 'success');

  // Abre comprovante / cautela automaticamente para conferência ou impressão
  setTimeout(() => {
    abrirModalComprovante(novaMovimentacao.id);
  }, 400);
}

// ==========================================
// ASSINATURA DIGITAL TOUCH INTERATIVA
// ==========================================
let canvas, ctxAssinatura;
let isDrawing = false;
let canvasHasDrawing = false;

function configurarCanvasAssinatura() {
  canvas = document.getElementById('signature-canvas');
  if (!canvas) return;

  ctxAssinatura = canvas.getContext('2d');
  ctxAssinatura.lineWidth = 2.5;
  ctxAssinatura.lineCap = 'round';
  ctxAssinatura.lineJoin = 'round';
  ctxAssinatura.strokeStyle = '#f59e0b'; // Amber vibrante

  // Touch & Mouse Listeners
  const startDrawing = (e) => {
    isDrawing = true;
    canvasHasDrawing = true;
    document.getElementById('signature-hint')?.classList.add('hidden');
    ctxAssinatura.beginPath();
    const pos = getCanvasPos(e);
    ctxAssinatura.moveTo(pos.x, pos.y);
    e.preventDefault();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const pos = getCanvasPos(e);
    ctxAssinatura.lineTo(pos.x, pos.y);
    ctxAssinatura.stroke();
    e.preventDefault();
  };

  const stopDrawing = () => {
    isDrawing = false;
  };

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

  canvas.addEventListener('touchstart', startDrawing, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  canvas.addEventListener('touchend', stopDrawing);
}

function getCanvasPos(e) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  };
}

function limparCanvasAssinatura() {
  if (canvas && ctxAssinatura) {
    ctxAssinatura.clearRect(0, 0, canvas.width, canvas.height);
    canvasHasDrawing = false;
    document.getElementById('signature-hint')?.classList.remove('hidden');
  }
}

function obterAssinaturaBase64() {
  if (canvas && canvasHasDrawing) {
    return canvas.toDataURL('image/png');
  }
  return null;
}

// ==========================================
// 4. MÓDULO DE ENTRADAS / ABASTECIMENTO
// ==========================================
function prepararEntradaItem(itemId) {
  openModal('modal-entrada');
  const select = document.getElementById('entrada-item-id');
  if (select) select.value = itemId;
}

function setTipoEntrada(tipo) {
  appState.tipoEntradaAtual = tipo;
  const btnNf = document.getElementById('btn-tipo-nf');
  const btnAvulsa = document.getElementById('btn-tipo-avulsa');
  const secaoNf = document.getElementById('secao-nf');
  const secaoAvulsa = document.getElementById('secao-avulsa');

  if (tipo === 'com_nf') {
    btnNf.className = 'py-2 px-3 rounded-lg text-xs font-bold bg-emerald-600 text-white shadow-md flex items-center justify-center gap-2 transition';
    btnAvulsa.className = 'py-2 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-white flex items-center justify-center gap-2 transition';
    secaoNf.classList.remove('hidden');
    secaoAvulsa.classList.add('hidden');
  } else {
    btnNf.className = 'py-2 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-white flex items-center justify-center gap-2 transition';
    btnAvulsa.className = 'py-2 px-3 rounded-lg text-xs font-bold bg-amber-600 text-white shadow-md flex items-center justify-center gap-2 transition';
    secaoNf.classList.add('hidden');
    secaoAvulsa.classList.remove('hidden');
  }
}

function previewFotoNF(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      const maxDim = 1024;
      let width = img.width;
      let height = img.height;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      appState.fotoNfBase64 = canvas.toDataURL('image/jpeg', 0.75);

      document.getElementById('preview-nf-indicator').classList.remove('hidden');
      const container = document.getElementById('container-preview-nf');
      const imgPreview = document.getElementById('img-preview-nf');
      container.classList.remove('hidden');
      imgPreview.src = appState.fotoNfBase64;
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function removerFotoNF() {
  appState.fotoNfBase64 = null;
  document.getElementById('entrada-foto-nf').value = '';
  document.getElementById('preview-nf-indicator').classList.add('hidden');
  document.getElementById('container-preview-nf').classList.add('hidden');
}

function salvarEntrada(e) {
  e.preventDefault();
  const itemId = document.getElementById('entrada-item-id').value;
  const quantidade = parseInt(document.getElementById('entrada-quantidade').value, 10);
  const responsavel = document.getElementById('entrada-recebedor-obra').value.trim();

  if (!itemId) {
    mostrarToast('Por favor, selecione um item para entrada!', 'error');
    return;
  }

  const itemIndex = appState.itens.findIndex(i => i.id === itemId);
  if (itemIndex === -1) {
    mostrarToast('Item não encontrado!', 'error');
    return;
  }

  if (quantidade <= 0 || isNaN(quantidade)) {
    mostrarToast('Informe uma quantidade válida recebida!', 'error');
    return;
  }

  const item = appState.itens[itemIndex];
  const saldoAnterior = item.saldoAtual;
  const saldoPosterior = saldoAnterior + quantidade;

  let dadosExtras = {};
  if (appState.tipoEntradaAtual === 'com_nf') {
    const nfNumero = document.getElementById('entrada-nf-numero').value.trim();
    const fornecedor = document.getElementById('entrada-fornecedor').value.trim();
    const nfData = document.getElementById('entrada-nf-data').value;
    const valorUnitario = parseFloat(document.getElementById('entrada-valor-unitario').value) || null;

    if (!nfNumero || !fornecedor) {
      mostrarToast('Número da NF e Fornecedor são obrigatórios na entrada com NF!', 'error');
      return;
    }

    dadosExtras = {
      tipoEntrada: 'com_nf',
      nfNumero: nfNumero,
      fornecedor: fornecedor,
      nfData: nfData,
      valorUnitario: valorUnitario,
      fotoNf: appState.fotoNfBase64,
      motivo: `Abastecimento via NF ${nfNumero} - Fornecedor: ${fornecedor}`
    };
  } else {
    const origem = document.getElementById('entrada-origem-avulsa').value;
    const motivo = document.getElementById('entrada-motivo-avulsa').value.trim();

    if (!motivo) {
      mostrarToast('Descreva o motivo detalhado para a entrada avulsa!', 'error');
      return;
    }

    dadosExtras = {
      tipoEntrada: 'sem_nf',
      origem: origem,
      motivo: motivo,
      fotoNf: null
    };
  }

  // Atualiza saldo do item
  item.saldoAtual = saldoPosterior;

  // Cria movimentação no Kardex
  const novaMovimentacao = {
    id: 'mov-' + Date.now(),
    tipo: 'ENTRADA',
    itemId: item.id,
    itemNome: item.nome,
    categoria: item.categoria,
    unidade: item.unidade,
    quantidade: quantidade,
    saldoAnterior: saldoAnterior,
    saldoPosterior: saldoPosterior,
    dataHora: new Date().toISOString(),
    responsavel: responsavel,
    empresa: 'Prefeitura do Canteiro',
    quarto: 'Almoxarifado Central',
    ...dadosExtras
  };

  appState.movimentacoes.unshift(novaMovimentacao);

  salvarEstadoItens();
  salvarEstadoMovimentacoes();
  salvarEntradaTurso(novaMovimentacao, item);

  closeModal('modal-entrada');
  document.getElementById('form-entrada').reset();
  removerFotoNF();

  renderApp();
  mostrarToast(`Entrada de ${quantidade} ${item.unidade} de "${item.nome}" cadastrada com sucesso!`, 'success');
}

// ==========================================
// 5. CADASTRO & EDIÇÃO DE ITENS DO CATÁLOGO
// ==========================================
function salvarItem(e) {
  e.preventDefault();
  const editId = document.getElementById('item-edit-id').value;
  const nome = document.getElementById('item-nome').value.trim();
  const categoria = document.getElementById('item-categoria').value;
  const unidade = document.getElementById('item-unidade').value;
  const estoqueMinimo = parseInt(document.getElementById('item-estoque-minimo').value, 10) || 0;
  const estoqueInicial = parseInt(document.getElementById('item-estoque-inicial').value, 10) || 0;
  const localizacao = document.getElementById('item-localizacao').value.trim();

  if (!nome) {
    mostrarToast('Informe o nome do insumo!', 'error');
    return;
  }

  let itemParaSalvar = null;

  if (editId) {
    // Modo Edição
    const item = appState.itens.find(i => i.id === editId);
    if (item) {
      item.nome = nome;
      item.categoria = categoria;
      item.unidade = unidade;
      item.estoqueMinimo = estoqueMinimo;
      item.localizacao = localizacao;
      itemParaSalvar = item;
      mostrarToast(`Item "${nome}" atualizado com sucesso!`, 'success');
    }
  } else {
    // Modo Novo Item
    const novoItem = {
      id: 'item-' + Date.now(),
      nome: nome,
      categoria: categoria,
      unidade: unidade,
      estoqueMinimo: estoqueMinimo,
      saldoAtual: estoqueInicial,
      localizacao: localizacao,
      dataCadastro: new Date().toISOString()
    };
    appState.itens.push(novoItem);
    itemParaSalvar = novoItem;

    // Se começou com saldo > 0, cria entrada inicial de inventário no Kardex
    if (estoqueInicial > 0) {
      const movInicial = {
        id: 'mov-' + Date.now(),
        tipo: 'ENTRADA',
        itemId: novoItem.id,
        itemNome: novoItem.nome,
        categoria: novoItem.categoria,
        unidade: novoItem.unidade,
        quantidade: estoqueInicial,
        saldoAnterior: 0,
        saldoPosterior: estoqueInicial,
        dataHora: new Date().toISOString(),
        responsavel: 'Inventário Inicial',
        empresa: 'Prefeitura do Canteiro',
        quarto: 'Almoxarifado Central',
        tipoEntrada: 'sem_nf',
        origem: 'Ajuste de Saldo / Inventário Inicial',
        motivo: 'Saldo inicial cadastrado com o item'
      };
      appState.movimentacoes.unshift(movInicial);
      salvarEstadoMovimentacoes();
      salvarEntradaTurso(movInicial, novoItem);
    }

    mostrarToast(`Novo item "${nome}" cadastrado com sucesso!`, 'success');
  }

  salvarEstadoItens();
  if (itemParaSalvar) {
    salvarItemTurso(itemParaSalvar);
  }
  closeModal('modal-novo-item');
  document.getElementById('form-item').reset();
  document.getElementById('item-edit-id').value = '';
  document.getElementById('modal-item-title').textContent = 'Cadastrar Novo Item';
  renderApp();
}

function editarItem(itemId) {
  const item = appState.itens.find(i => i.id === itemId);
  if (!item) return;

  document.getElementById('item-edit-id').value = item.id;
  document.getElementById('item-nome').value = item.nome;
  document.getElementById('item-categoria').value = item.categoria;
  document.getElementById('item-unidade').value = item.unidade;
  document.getElementById('item-estoque-minimo').value = item.estoqueMinimo;
  document.getElementById('item-estoque-inicial').value = item.saldoAtual;
  document.getElementById('item-estoque-inicial').disabled = true; // Não edita saldo diretamente aqui
  document.getElementById('item-localizacao').value = item.localizacao || '';

  document.getElementById('modal-item-title').textContent = 'Editar Detalhes do Item';
  openModal('modal-novo-item');
}

function confirmarExclusaoItem(itemId) {
  const item = appState.itens.find(i => i.id === itemId);
  if (!item) return;

  const confirmar = confirm(`Tem certeza que deseja remover o item "${item.nome}" do catálogo?\n\nSaldo atual: ${item.saldoAtual} ${item.unidade}.`);
  if (!confirmar) return;

  appState.itens = appState.itens.filter(i => i.id !== itemId);
  salvarEstadoItens();
  excluirItemTurso(itemId);
  renderApp();
  mostrarToast(`Item "${item.nome}" removido do catálogo.`, 'warning');
}

// ==========================================
// 6. EXTRATO KARDEX DE MOVIMENTAÇÕES
// ==========================================
function renderKardex() {
  const tbody = document.getElementById('tbody-kardex');
  if (!tbody) return;

  const busca = (document.getElementById('filtro-busca-kardex')?.value || '').toLowerCase().trim();
  const tipoFiltro = document.getElementById('filtro-tipo-kardex')?.value || '';
  const periodoFiltro = document.getElementById('filtro-periodo-kardex')?.value || 'todos';

  const agora = new Date();
  const hojeStr = agora.toISOString().split('T')[0];

  const movsFiltradas = appState.movimentacoes.filter(m => {
    // Filtro por tipo
    if (tipoFiltro && m.tipo !== tipoFiltro) return false;

    // Filtro por busca
    if (busca) {
      const texto = `${m.itemNome} ${m.responsavel} ${m.empresa} ${m.quarto} ${m.motivo || ''} ${m.nfNumero || ''} ${m.fornecedor || ''}`.toLowerCase();
      if (!texto.includes(busca)) return false;
    }

    // Filtro por período
    if (periodoFiltro === 'hoje') {
      return m.dataHora.split('T')[0] === hojeStr;
    } else if (periodoFiltro === '7dias') {
      const dataM = new Date(m.dataHora);
      const diffDias = (agora - dataM) / (1000 * 60 * 60 * 24);
      return diffDias <= 7;
    } else if (periodoFiltro === 'mes') {
      const dataM = new Date(m.dataHora);
      return dataM.getMonth() === agora.getMonth() && dataM.getFullYear() === agora.getFullYear();
    }

    return true;
  });

  const txtContador = document.getElementById('txt-contador-kardex');
  if (txtContador) {
    txtContador.textContent = `${movsFiltradas.length} movimentações encontradas`;
  }

  if (movsFiltradas.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="py-8 text-center text-slate-500">
          Nenhuma movimentação registrada para os filtros selecionados.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = movsFiltradas.map(m => {
    const isEntrada = m.tipo === 'ENTRADA';
    const corBadge = isEntrada ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    const icone = isEntrada ? 'fa-arrow-down' : 'fa-arrow-up';
    const dataFmt = formatarDataHora(m.dataHora);

    return `
      <tr class="hover:bg-slate-800/40 transition">
        <td class="py-3 px-4 text-xs font-mono text-slate-400">${dataFmt}</td>
        <td class="py-3 px-4 text-center">
          <span class="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${corBadge}">
            <i class="fa-solid ${icone}"></i>
            ${m.tipo}
          </span>
        </td>
        <td class="py-3 px-4 font-semibold text-white text-xs">
          ${m.itemNome}
          <span class="block text-[11px] font-normal text-slate-400">${m.categoria}</span>
        </td>
        <td class="py-3 px-4 text-center font-bold text-xs ${isEntrada ? 'text-emerald-400' : 'text-amber-400'}">
          ${isEntrada ? '+' : '-'}${m.quantidade} ${m.unidade || 'un'}
        </td>
        <td class="py-3 px-4 text-xs text-slate-200">
          ${isEntrada ? (m.fornecedor || m.origem || 'Fornecedor Obra') : m.responsavel}
        </td>
        <td class="py-3 px-4 text-xs text-slate-300">
          ${m.empresa}
          ${m.quarto ? `<span class="block text-[11px] text-slate-500">${m.quarto}</span>` : ''}
        </td>
        <td class="py-3 px-4 text-center text-xs font-bold text-white">
          ${m.saldoPosterior} ${m.unidade || ''}
        </td>
        <td class="py-3 px-4 text-right">
          <button onclick="abrirModalComprovante('${m.id}')" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-white rounded-lg text-xs font-medium border border-[#23324d] transition flex items-center gap-1.5 ml-auto">
            <i class="fa-solid fa-receipt"></i>
            <span>Ver</span>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// ==========================================
// 7. COMPROVANTE & IMPRESSÃO DE CAUTELA
// ==========================================
function abrirModalComprovante(movId) {
  const mov = appState.movimentacoes.find(m => m.id === movId);
  if (!mov) return;

  appState.currentModalComprovanteId = movId;
  const container = document.getElementById('conteudo-comprovante');
  const isEntrada = mov.tipo === 'ENTRADA';
  const dataFmt = formatarDataHora(mov.dataHora);

  let secaoEspecifica = '';
  if (isEntrada) {
    if (mov.tipoEntrada === 'com_nf') {
      secaoEspecifica = `
        <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5 text-xs">
          <p class="text-emerald-400 font-bold uppercase tracking-wider">Dados da Nota Fiscal</p>
          <div class="grid grid-cols-2 gap-2 text-slate-300">
            <div><strong>Número NF:</strong> ${mov.nfNumero}</div>
            <div><strong>Fornecedor:</strong> ${mov.fornecedor}</div>
            ${mov.valorUnitario ? `<div><strong>Valor Unitário:</strong> R$ ${Number(mov.valorUnitario).toFixed(2)}</div>` : ''}
            <div><strong>Recebido por:</strong> ${mov.responsavel}</div>
          </div>
          ${mov.fotoNf ? `
            <div class="pt-2">
              <p class="font-bold text-slate-400 mb-1">Foto da NF:</p>
              <img src="${mov.fotoNf}" alt="Comprovante NF" class="max-h-40 rounded-lg border border-slate-700 object-contain">
            </div>
          ` : ''}
        </div>
      `;
    } else {
      secaoEspecifica = `
        <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5 text-xs">
          <p class="text-amber-400 font-bold uppercase tracking-wider">Entrada Avulsa / Sem NF</p>
          <p><strong>Origem:</strong> ${mov.origem}</p>
          <p><strong>Motivo:</strong> ${mov.motivo}</p>
          <p><strong>Recebido por:</strong> ${mov.responsavel}</p>
        </div>
      `;
    }
  } else {
    // Comprovante de Saída / Cautela de Alojamento
    secaoEspecifica = `
      <div class="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
        <p class="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
          <i class="fa-solid fa-file-signature"></i>
          Termo de Responsabilidade & Cautela
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
          <div><span class="text-slate-400">Retirado por:</span> <strong class="text-white">${mov.responsavel}</strong></div>
          <div><span class="text-slate-400">Empresa:</span> <strong class="text-white">${mov.empresa}</strong></div>
          <div><span class="text-slate-400">Alojamento/Destino:</span> <span class="text-slate-200">${mov.quarto || 'Geral'}</span></div>
          <div><span class="text-slate-400">Finalidade:</span> <span class="text-slate-200">${mov.motivo}</span></div>
        </div>
        ${mov.observacoes ? `<p class="text-slate-400 italic">"${mov.observacoes}"</p>` : ''}

        <!-- Assinatura Digital do Recebedor -->
        <div class="pt-2 border-t border-slate-800">
          <p class="text-[11px] font-semibold text-slate-400 mb-1">Assinatura Digital Coletada:</p>
          ${mov.assinatura ? `
            <div class="bg-slate-950 p-2 rounded-lg border border-slate-700 flex justify-center">
              <img src="${mov.assinatura}" alt="Assinatura" class="max-h-24">
            </div>
          ` : `
            <div class="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center text-slate-500 italic text-[11px]">
              Assinatura digital não coletada no momento da entrega (Registro presencial confirmado).
            </div>
          `}
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <!-- Topo do Comprovante -->
    <div class="text-center pb-3 border-b border-[#23324d]">
      <span class="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-full font-bold uppercase">
        ${isEntrada ? 'Recibo de Entrada no Almoxarifado' : 'Cautela de Retirada de Insumo'}
      </span>
      <h4 class="text-base font-bold text-white mt-2">${appState.config.nomeObra}</h4>
      <p class="text-xs text-slate-400">Identificador Único: <strong class="font-mono text-slate-300">${mov.id}</strong> • ${dataFmt}</p>
    </div>

    <!-- Dados do Item -->
    <div class="bg-[#0b1120] p-4 rounded-xl border border-[#23324d] flex items-center justify-between">
      <div>
        <p class="text-xs text-slate-400">Insumo / Material</p>
        <h3 class="text-base font-bold text-white">${mov.itemNome}</h3>
        <p class="text-xs text-slate-400">${mov.categoria}</p>
      </div>
      <div class="text-right">
        <p class="text-xs text-slate-400">Quantidade</p>
        <span class="text-2xl font-black ${isEntrada ? 'text-emerald-400' : 'text-amber-400'}">
          ${isEntrada ? '+' : '-'}${mov.quantidade}
        </span>
        <span class="text-xs text-slate-400 block">${mov.unidade || 'un'}</span>
      </div>
    </div>

    <!-- Seção Específica (NF ou Cautela) -->
    ${secaoEspecifica}

    <!-- Saldo após Operação -->
    <div class="flex items-center justify-between text-xs px-2 text-slate-400">
      <span>Saldo anterior: <strong>${mov.saldoAnterior}</strong></span>
      <span>Saldo atualizado após o evento: <strong class="text-white text-sm">${mov.saldoPosterior} ${mov.unidade || ''}</strong></span>
    </div>
  `;

  openModal('modal-comprovante');
}

function compartilharWhatsAppCautela() {
  const mov = appState.movimentacoes.find(m => m.id === appState.currentModalComprovanteId);
  if (!mov) return;

  const dataFmt = formatarDataHora(mov.dataHora);
  const isEntrada = mov.tipo === 'ENTRADA';

  let texto = `*COMPROVANTE DE ALMOXARIFADO - ${appState.config.nomeObra.toUpperCase()}*\n`;
  texto += `📋 *Tipo:* ${isEntrada ? 'ENTRADA (ABASTECIMENTO)' : 'SAÍDA (CAUTELA)'}\n`;
  texto += `📦 *Item:* ${mov.itemNome}\n`;
  texto += `🔢 *Quantidade:* ${mov.quantidade} ${mov.unidade || 'un'}\n`;
  texto += `📅 *Data/Hora:* ${dataFmt}\n`;

  if (isEntrada) {
    if (mov.tipoEntrada === 'com_nf') {
      texto += `🧾 *Nota Fiscal:* ${mov.nfNumero} - ${mov.fornecedor}\n`;
    } else {
      texto += `🚚 *Origem:* ${mov.origem}\n`;
    }
  } else {
    texto += `👤 *Recebedor:* ${mov.responsavel}\n`;
    texto += `🏢 *Empresa:* ${mov.empresa}\n`;
    texto += `🚪 *Destino:* ${mov.quarto || 'Alojamento'}\n`;
    texto += `📝 *Motivo:* ${mov.motivo}\n`;
  }

  texto += `📊 *Saldo Atual no Almoxarifado:* ${mov.saldoPosterior} ${mov.unidade || 'un'}\n`;
  texto += `🔐 *ID do Registro:* ${mov.id}`;

  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
}

function imprimirComprovante() {
  const mov = appState.movimentacoes.find(m => m.id === appState.currentModalComprovanteId);
  if (!mov) return;

  const printArea = document.getElementById('print-area');
  const dataFmt = formatarDataHora(mov.dataHora);
  const isEntrada = mov.tipo === 'ENTRADA';

  printArea.innerHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 750px; margin: 0 auto; border: 2px solid #000; padding: 25px; border-radius: 8px;">
      
      <!-- Cabeçalho -->
      <div style="border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2 style="margin: 0; font-size: 20px; text-transform: uppercase;">${appState.config.nomeObra}</h2>
          <p style="margin: 3px 0 0 0; font-size: 13px; color: #444;">Departamento de Almoxarifado & Prefeitura de Canteiro</p>
        </div>
        <div style="text-align: right;">
          <span style="border: 1px solid #000; padding: 4px 8px; font-weight: bold; font-size: 12px; text-transform: uppercase;">
            ${isEntrada ? 'Recibo de Entrada' : 'Termo de Cautela de Saída'}
          </span>
          <p style="margin: 5px 0 0 0; font-size: 11px;">Código: <strong>${mov.id}</strong></p>
        </div>
      </div>

      <!-- Tabela do Material -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
        <thead>
          <tr style="background: #eee;">
            <th style="border: 1px solid #000; padding: 8px; text-align: left;">Insumo / Material</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: left;">Categoria</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: center;">Qtd.</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: center;">Unidade</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: center;">Saldo Pós-Operação</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #000; padding: 10px; font-weight: bold;">${mov.itemNome}</td>
            <td style="border: 1px solid #000; padding: 10px;">${mov.categoria}</td>
            <td style="border: 1px solid #000; padding: 10px; text-align: center; font-size: 16px; font-weight: bold;">${mov.quantidade}</td>
            <td style="border: 1px solid #000; padding: 10px; text-align: center;">${mov.unidade || 'un'}</td>
            <td style="border: 1px solid #000; padding: 10px; text-align: center;">${mov.saldoPosterior}</td>
          </tr>
        </tbody>
      </table>

      <!-- Informações Nominais -->
      <div style="border: 1px solid #000; padding: 15px; margin-bottom: 25px; font-size: 13px; line-height: 1.6;">
        <p style="margin: 0 0 8px 0;"><strong>Data / Hora:</strong> ${dataFmt}</p>
        ${isEntrada ? `
          <p style="margin: 0 0 8px 0;"><strong>Tipo de Entrada:</strong> ${mov.tipoEntrada === 'com_nf' ? 'Com Nota Fiscal' : 'Entrada Avulsa'}</p>
          ${mov.nfNumero ? `<p style="margin: 0 0 8px 0;"><strong>Nota Fiscal:</strong> ${mov.nfNumero} - <strong>Fornecedor:</strong> ${mov.fornecedor}</p>` : ''}
          <p style="margin: 0 0 8px 0;"><strong>Recebedor na Obra:</strong> ${mov.responsavel}</p>
          <p style="margin: 0;"><strong>Motivo / Observações:</strong> ${mov.motivo}</p>
        ` : `
          <p style="margin: 0 0 8px 0;"><strong>Nome do Recebedor:</strong> ${mov.responsavel}</p>
          <p style="margin: 0 0 8px 0;"><strong>Empresa / Subempreiteira:</strong> ${mov.empresa}</p>
          <p style="margin: 0 0 8px 0;"><strong>Alojamento / Quarto:</strong> ${mov.quarto || 'Não especificado'}</p>
          <p style="margin: 0 0 8px 0;"><strong>Finalidade:</strong> ${mov.motivo}</p>
          ${mov.observacoes ? `<p style="margin: 0;"><strong>Observações:</strong> ${mov.observacoes}</p>` : ''}
        `}
      </div>

      <!-- Termo e Assinaturas -->
      ${!isEntrada ? `
        <p style="font-size: 11px; text-align: justify; margin-bottom: 25px; color: #333;">
          Declaro ter recebido os itens acima descritos em perfeito estado de conservação e higiene para uso no alojamento do canteiro de obras, comprometendo-me a zelar pela integridade dos materiais e devolvê-los ou substituí-los conforme regras do canteiro.
        </p>

        <div style="display: flex; justify-content: space-around; align-items: flex-end; margin-top: 40px;">
          <div style="text-align: center; width: 45%;">
            ${mov.assinatura ? `<img src="${mov.assinatura}" style="max-height: 60px; margin-bottom: 5px;">` : '<div style="height: 60px;"></div>'}
            <div style="border-top: 1px solid #000; padding-top: 5px;">
              <strong>${mov.responsavel}</strong><br>
              <span style="font-size: 11px;">Recebedor (${mov.empresa})</span>
            </div>
          </div>

          <div style="text-align: center; width: 45%;">
            <div style="height: 60px;"></div>
            <div style="border-top: 1px solid #000; padding-top: 5px;">
              <strong>Almoxarife Responsável</strong><br>
              <span style="font-size: 11px;">Prefeitura de Canteiro</span>
            </div>
          </div>
        </div>
      ` : ''}

    </div>
  `;

  window.print();
}

// ==========================================
// 8. RELATÓRIOS & CONSUMO POR EMPRESA/PESSOA
// ==========================================
function renderRelatorios() {
  renderConsumoEmpresas();
  renderConsumoPessoas();
  renderPrevisaoCompras();
}

function renderConsumoEmpresas() {
  const container = document.getElementById('lista-consumo-empresas');
  if (!container) return;

  const empresasMap = {};
  appState.movimentacoes
    .filter(m => m.tipo === 'SAIDA')
    .forEach(m => {
      const emp = m.empresa || 'Empresa Não Declarada';
      empresasMap[emp] = (empresasMap[emp] || 0) + (Number(m.quantidade) || 0);
    });

  const ordenado = Object.entries(empresasMap).sort((a, b) => b[1] - a[1]);

  if (ordenado.length === 0) {
    container.innerHTML = '<p class="text-xs text-slate-500 py-3">Nenhuma saída registrada para gerar ranking.</p>';
    return;
  }

  const maxTotal = ordenado[0][1] || 1;

  container.innerHTML = ordenado.map(([empresa, total], idx) => {
    const percent = Math.round((total / maxTotal) * 100);
    return `
      <div class="space-y-1">
        <div class="flex justify-between text-xs">
          <span class="font-medium text-slate-200 flex items-center gap-1.5">
            <span class="w-4 h-4 rounded-full bg-slate-800 text-[10px] text-amber-400 font-bold flex items-center justify-center">${idx + 1}</span>
            ${empresa}
          </span>
          <span class="font-bold text-amber-400">${total} itens</span>
        </div>
        <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div class="bg-amber-500 h-full rounded-full transition-all duration-500" style="width: ${percent}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

function renderConsumoPessoas() {
  const container = document.getElementById('lista-consumo-pessoas');
  if (!container) return;

  const pessoasMap = {};
  appState.movimentacoes
    .filter(m => m.tipo === 'SAIDA')
    .forEach(m => {
      const key = `${m.responsavel} (${m.empresa})`;
      pessoasMap[key] = (pessoasMap[key] || 0) + (Number(m.quantidade) || 0);
    });

  const ordenado = Object.entries(pessoasMap).sort((a, b) => b[1] - a[1]).slice(0, 6);

  if (ordenado.length === 0) {
    container.innerHTML = '<p class="text-xs text-slate-500 py-3">Nenhuma cautela registrada para gerar ranking.</p>';
    return;
  }

  container.innerHTML = ordenado.map(([nome, total], idx) => `
    <div class="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
          #${idx + 1}
        </div>
        <div>
          <h4 class="text-xs font-bold text-white">${nome}</h4>
        </div>
      </div>
      <span class="text-xs font-extrabold text-amber-400">${total} itens retirados</span>
    </div>
  `).join('');
}

function renderPrevisaoCompras() {
  const tbody = document.getElementById('tbody-previsao-compras');
  if (!tbody) return;

  // Itens cujo saldo está abaixo ou no limite mínimo
  const itensNecessarios = appState.itens
    .filter(i => Number(i.saldoAtual) <= Number(i.estoqueMinimo))
    .map(i => {
      // Sugestão: comprar para atingir pelo menos o dobro do mínimo ou quantidade segura
      const sugestaoCompra = Math.max(1, (Number(i.estoqueMinimo) * 2) - Number(i.saldoAtual));
      return { ...i, sugestaoCompra };
    });

  if (itensNecessarios.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="py-6 text-center text-emerald-400 text-xs">
          <i class="fa-solid fa-circle-check text-lg mb-1 block"></i>
          Todos os itens do alojamento estão com estoque seguro e acima do mínimo.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = itensNecessarios.map(item => {
    const status = getStatusItem(item);
    return `
      <tr class="hover:bg-slate-800/40 transition">
        <td class="py-2.5 px-4 font-semibold text-white text-xs">${item.nome}</td>
        <td class="py-2.5 px-4 text-xs text-slate-400">${item.categoria}</td>
        <td class="py-2.5 px-4 text-center text-xs font-bold ${status.codigo === 'critico' ? 'text-rose-400' : 'text-amber-400'}">${item.saldoAtual} ${item.unidade}</td>
        <td class="py-2.5 px-4 text-center text-xs text-slate-400">${item.estoqueMinimo} ${item.unidade}</td>
        <td class="py-2.5 px-4 text-center text-xs font-black text-amber-400">+${item.sugestaoCompra} ${item.unidade}</td>
        <td class="py-2.5 px-4 text-right">
          <span class="text-[11px] font-bold px-2 py-0.5 rounded-full border ${status.badgeClass}">
            ${status.label.split(' ')[0]}
          </span>
        </td>
      </tr>
    `;
  }).join('');
}

function copiarListaCompras() {
  const itensNecessarios = appState.itens
    .filter(i => Number(i.saldoAtual) <= Number(i.estoqueMinimo))
    .map(i => {
      const sugestao = Math.max(1, (Number(i.estoqueMinimo) * 2) - Number(i.saldoAtual));
      return `• ${i.nome}: Comprar +${sugestao} ${i.unidade} (Saldo atual: ${i.saldoAtual}, Mínimo: ${i.estoqueMinimo})`;
    });

  if (itensNecessarios.length === 0) {
    mostrarToast('O estoque está completo! Nada a comprar.', 'info');
    return;
  }

  const texto = `*PEDIDO DE REPOSIÇÃO DE ALMOXARIFADO - ${appState.config.nomeObra.toUpperCase()}*\n\n` + itensNecessarios.join('\n') + `\n\nEmitido em: ${new Date().toLocaleDateString('pt-BR')}`;

  navigator.clipboard.writeText(texto).then(() => {
    mostrarToast('Lista de compras copiada! Cole no WhatsApp da diretoria ou compras.', 'success');
  }).catch(() => {
    mostrarToast('Não foi possível copiar automaticamente.', 'warning');
  });
}

function gerarRelatorioPDF() {
  const printArea = document.getElementById('print-area');
  const agora = new Date().toLocaleString('pt-BR');

  const itensAlerta = appState.itens.filter(i => Number(i.saldoAtual) <= Number(i.estoqueMinimo));

  printArea.innerHTML = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <div style="border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <h1 style="margin: 0; font-size: 22px; text-transform: uppercase;">${appState.config.nomeObra}</h1>
          <h2 style="margin: 5px 0 0 0; font-size: 14px; color: #555;">RELATÓRIO OFICIAL DE ALMOXARIFADO E ALOJAMENTOS</h2>
        </div>
        <div style="text-align: right; font-size: 11px;">
          Emissão: <strong>${agora}</strong>
        </div>
      </div>

      <!-- Resumo Geral -->
      <div style="display: flex; justify-content: space-between; background: #f4f4f4; padding: 10px; margin-bottom: 20px; border-radius: 4px; font-size: 12px;">
        <div><strong>Total de Itens Cadastrados:</strong> ${appState.itens.length}</div>
        <div><strong>Total de Peças em Estoque:</strong> ${appState.itens.reduce((a,b)=>a+(Number(b.saldoAtual)||0),0)}</div>
        <div><strong>Itens Abaixo do Mínimo:</strong> ${itensAlerta.length}</div>
        <div><strong>Movimentações Registradas:</strong> ${appState.movimentacoes.length}</div>
      </div>

      <!-- Tabela de Itens -->
      <h3 style="font-size: 14px; text-transform: uppercase; margin-bottom: 8px;">Posição Atual de Estoque</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 25px;">
        <thead>
          <tr style="background: #ddd;">
            <th style="border: 1px solid #999; padding: 6px; text-align: left;">Item</th>
            <th style="border: 1px solid #999; padding: 6px; text-align: left;">Categoria</th>
            <th style="border: 1px solid #999; padding: 6px; text-align: center;">Unid.</th>
            <th style="border: 1px solid #999; padding: 6px; text-align: center;">Mínimo</th>
            <th style="border: 1px solid #999; padding: 6px; text-align: center;">Saldo Atual</th>
            <th style="border: 1px solid #999; padding: 6px; text-align: left;">Localização</th>
          </tr>
        </thead>
        <tbody>
          ${appState.itens.map(i => `
            <tr>
              <td style="border: 1px solid #ccc; padding: 5px; font-weight: ${i.saldoAtual <= i.estoqueMinimo ? 'bold' : 'normal'}; color: ${i.saldoAtual === 0 ? 'red' : 'black'};">${i.nome}</td>
              <td style="border: 1px solid #ccc; padding: 5px;">${i.categoria}</td>
              <td style="border: 1px solid #ccc; padding: 5px; text-align: center;">${i.unidade}</td>
              <td style="border: 1px solid #ccc; padding: 5px; text-align: center;">${i.estoqueMinimo}</td>
              <td style="border: 1px solid #ccc; padding: 5px; text-align: center; font-weight: bold;">${i.saldoAtual}</td>
              <td style="border: 1px solid #ccc; padding: 5px;">${i.localizacao || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Rodapé de Assinatura do Prefeito de Canteiro -->
      <div style="display: flex; justify-content: space-around; margin-top: 50px; font-size: 12px;">
        <div style="border-top: 1px solid #000; width: 40%; text-align: center; padding-top: 5px;">
          Prefeito da Obra / Almoxarife Geral
        </div>
        <div style="border-top: 1px solid #000; width: 40%; text-align: center; padding-top: 5px;">
          Engenheiro Residente / Gestor de Contrato
        </div>
      </div>
    </div>
  `;

  window.print();
}

// ==========================================
// 9. EXPORTAÇÃO EXCEL (.XLSX) VIA SHEETJS
// ==========================================
function exportarExcelKardex() {
  if (typeof XLSX === 'undefined') {
    mostrarToast('Biblioteca Excel não carregada. Verifique sua conexão.', 'error');
    return;
  }

  // 1. Aba Estoque
  const dadosEstoque = appState.itens.map(item => ({
    'Código': item.id,
    'Nome do Insumo': item.nome,
    'Categoria': item.categoria,
    'Unidade de Medida': item.unidade,
    'Estoque Mínimo': item.estoqueMinimo,
    'Saldo Atual': item.saldoAtual,
    'Status': getStatusItem(item).label,
    'Localização': item.localizacao || ''
  }));

  // 2. Aba Movimentações (Kardex)
  const dadosKardex = appState.movimentacoes.map(m => ({
    'ID': m.id,
    'Data/Hora': formatarDataHora(m.dataHora),
    'Tipo': m.tipo,
    'Item': m.itemNome,
    'Categoria': m.categoria,
    'Quantidade': m.quantidade,
    'Unidade': m.unidade || '',
    'Saldo Resultante': m.saldoPosterior,
    'Responsável / Recebedor': m.responsavel,
    'Empresa / Destino': m.empresa,
    'Alojamento / Quarto': m.quarto || '',
    'Motivo': m.motivo || '',
    'Tipo Entrada': m.tipoEntrada || '',
    'Número NF': m.nfNumero || '',
    'Fornecedor': m.fornecedor || '',
    'Valor Unitário R$': m.valorUnitario || ''
  }));

  const wb = XLSX.utils.book_new();
  const wsEstoque = XLSX.utils.json_to_sheet(dadosEstoque);
  const wsKardex = XLSX.utils.json_to_sheet(dadosKardex);

  XLSX.utils.book_append_sheet(wb, wsEstoque, 'Catálogo e Estoque');
  XLSX.utils.book_append_sheet(wb, wsKardex, 'Extrato Kardex');

  const nomeArquivo = `Almoxarifado_${appState.config.nomeObra.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, nomeArquivo);
  mostrarToast('Planilha Excel exportada com sucesso!', 'success');
}

function imprimirKardex() {
  switchTab('relatorios');
  gerarRelatorioPDF();
}

// ==========================================
// 10. SINCRONIZAÇÃO EM NUVEM FIREBASE FIRESTORE
// ==========================================
function inicializarFirebaseSeDisponivel() {
  if (!appState.config.firebaseConfig || typeof firebase === 'undefined') {
    return;
  }

  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(appState.config.firebaseConfig);
    }
    appState.firestoreDb = firebase.firestore();
    atualizarBadgeConexao();

    // Sincronização em Tempo Real (Escuta Firestore)
    escutarColecoesFirestore();
  } catch (err) {
    console.warn('Erro ao conectar Firebase:', err);
    appState.firestoreDb = null;
    atualizarBadgeConexao();
  }
}

function escutarColecoesFirestore() {
  if (!appState.firestoreDb) return;

  // Escuta documento de estoque
  appState.firestoreDb.collection('canteiro_almox').doc('dados_gerais').onSnapshot(doc => {
    if (doc.exists) {
      const data = doc.data();
      if (data.itens && Array.isArray(data.itens)) {
        appState.itens = data.itens;
        salvarEstadoItens();
      }
      if (data.movimentacoes && Array.isArray(data.movimentacoes)) {
        appState.movimentacoes = data.movimentacoes;
        salvarEstadoMovimentacoes();
      }
      renderApp();
    }
  }, err => {
    console.warn('Erro snapshot Firestore:', err);
  });
}

function sincronizarFirestore(colecao, dados) {
  if (!appState.firestoreDb || !appState.isOnline) return;

  try {
    appState.firestoreDb.collection('canteiro_almox').doc('dados_gerais').set({
      [colecao]: dados,
      ultimaAtualizacao: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true }).catch(err => {
      console.warn('Falha no upload Firestore:', err);
    });
  } catch (e) {}
}

function conectarFirebase() {
  const jsonStr = document.getElementById('cfg-firebase-json').value.trim();
  if (!jsonStr) {
    appState.config.firebaseConfig = null;
    appState.firestoreDb = null;
    salvarEstadoConfig();
    atualizarBadgeConexao();
    mostrarToast('Nuvem desativada. Sistema operando em Modo Local.', 'info');
    return;
  }

  try {
    const configObj = JSON.parse(jsonStr);
    appState.config.firebaseConfig = configObj;
    salvarEstadoConfig();
    inicializarFirebaseSeDisponivel();
    mostrarToast('Configuração do Firebase salva com sucesso!', 'success');
  } catch (err) {
    mostrarToast('JSON do Firebase inválido. Verifique as aspas e chaves.', 'error');
  }
}

// ==========================================
// INTEGRAÇÃO BANCO DE DADOS TURSO (LIBSQL)
// ==========================================
function getTursoPipelineUrl() {
  if (!appState.config.turso || !appState.config.turso.url) return null;
  let url = appState.config.turso.url.trim();
  if (url.startsWith('libsql://')) {
    url = url.replace('libsql://', 'https://');
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  if (!url.endsWith('/v2/pipeline')) {
    url += '/v2/pipeline';
  }
  return url;
}

function formatTursoArg(val) {
  if (val === null || val === undefined) return { type: 'null' };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { type: 'integer', value: String(val) } : { type: 'float', value: val };
  }
  return { type: 'text', value: String(val) };
}

function parseTursoResult(resultObj) {
  if (!resultObj || !resultObj.cols || !resultObj.rows) return [];
  const cols = resultObj.cols.map(c => c.name);
  return resultObj.rows.map(row => {
    const item = {};
    row.forEach((colVal, idx) => {
      const colName = cols[idx];
      if (!colVal || colVal.type === 'null') {
        item[colName] = null;
      } else if (colVal.type === 'integer') {
        item[colName] = parseInt(colVal.value, 10);
      } else if (colVal.type === 'float') {
        item[colName] = parseFloat(colVal.value);
      } else {
        item[colName] = colVal.value;
      }
    });
    return item;
  });
}

async function executarTursoBatch(statements) {
  const pipelineUrl = getTursoPipelineUrl();
  const token = appState.config.turso?.token?.trim();
  if (!pipelineUrl || !token) return null;

  const requests = statements.map(st => ({
    type: 'execute',
    stmt: {
      sql: st.sql,
      args: (st.args || []).map(formatTursoArg)
    }
  }));
  requests.push({ type: 'close' });

  const res = await fetch(pipelineUrl, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ requests })
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Erro HTTP ${res.status}: ${txt}`);
  }

  const data = await res.json();
  return data.results;
}

async function executarTurso(sql, args = []) {
  const results = await executarTursoBatch([{ sql, args }]);
  if (results && results[0] && results[0].type === 'ok') {
    return parseTursoResult(results[0].response.result);
  } else if (results && results[0] && results[0].type === 'error') {
    throw new Error(results[0].error?.message || 'Erro ao executar SQL no Turso');
  }
  return [];
}

async function inicializarTursoSeDisponivel() {
  if (!appState.config.turso || !appState.config.turso.url || !appState.config.turso.token) {
    appState.tursoConectado = false;
    atualizarBadgeConexao();
    return;
  }

  try {
    await carregarDadosTurso();
  } catch (err) {
    console.warn('Erro ao conectar Turso na inicialização:', err);
    appState.tursoConectado = false;
    atualizarBadgeConexao();
  }
}

async function carregarDadosTurso() {
  if (!appState.config.turso?.url || !appState.config.turso?.token || !appState.isOnline) {
    return false;
  }

  try {
    const results = await executarTursoBatch([
      { sql: 'SELECT * FROM itens ORDER BY nome ASC' },
      { sql: 'SELECT * FROM movimentacoes ORDER BY data_hora DESC' }
    ]);

    if (results && results[0]?.type === 'ok' && results[1]?.type === 'ok') {
      const rowsItens = parseTursoResult(results[0].response.result);
      const rowsMovs = parseTursoResult(results[1].response.result);

      if (rowsItens && rowsItens.length > 0) {
        appState.itens = rowsItens.map(r => ({
          id: r.id,
          nome: r.nome,
          categoria: r.categoria,
          unidade: r.unidade,
          estoqueMinimo: Number(r.estoque_minimo) || 0,
          saldoAtual: Number(r.saldo_atual) || 0,
          localizacao: r.localizacao || '',
          dataCadastro: r.data_cadastro || new Date().toISOString()
        }));
        localStorage.setItem(DB_KEYS.ITENS, JSON.stringify(appState.itens));
      }

      if (rowsMovs && rowsMovs.length > 0) {
        appState.movimentacoes = rowsMovs.map(r => ({
          id: r.id,
          tipo: r.tipo,
          itemId: r.item_id,
          itemNome: r.item_nome,
          categoria: r.categoria,
          unidade: r.unidade,
          quantidade: Number(r.quantidade) || 0,
          saldoAnterior: Number(r.saldo_anterior) || 0,
          saldoPosterior: Number(r.saldo_posterior) || 0,
          dataHora: r.data_hora,
          responsavel: r.responsavel,
          empresa: r.empresa,
          quarto: r.quarto,
          motivo: r.motivo,
          tipoEntrada: r.tipo_entrada,
          nfNumero: r.nf_numero,
          fornecedor: r.fornecedor,
          valorUnitario: r.valor_unitario ? Number(r.valor_unitario) : null,
          fotoNf: r.foto_nf,
          assinatura: r.assinatura,
          observacoes: r.observacoes,
          origem: r.origem
        }));
        localStorage.setItem(DB_KEYS.MOVIMENTACOES, JSON.stringify(appState.movimentacoes));
      }

      appState.tursoConectado = true;
      atualizarBadgeConexao();
      renderApp();
      return true;
    }
  } catch (err) {
    console.warn('Falha ao carregar do Turso:', err);
    appState.tursoConectado = false;
    atualizarBadgeConexao();
  }
  return false;
}

async function testarEConectarTurso() {
  const urlInput = document.getElementById('cfg-turso-url')?.value.trim();
  const tokenInput = document.getElementById('cfg-turso-token')?.value.trim();

  if (!urlInput || !tokenInput) {
    mostrarToast('Informe a URL do Turso e o Auth Token para testar!', 'warning');
    return;
  }

  appState.config.turso = {
    url: urlInput,
    token: tokenInput,
    ativo: true
  };
  salvarEstadoConfig();

  mostrarToast('Conectando ao Turso...', 'info');

  try {
    const res = await executarTurso('SELECT 1 as ping');
    if (res && res.length > 0) {
      appState.tursoConectado = true;
      atualizarBadgeConexao();
      mostrarToast('✅ Banco Turso conectado com sucesso em tempo real!', 'success');
      await carregarDadosTurso();
    } else {
      mostrarToast('Falha na resposta do Turso. Verifique o token.', 'error');
    }
  } catch (err) {
    console.error(err);
    appState.tursoConectado = false;
    atualizarBadgeConexao();
    mostrarToast('Erro ao conectar no Turso: ' + err.message, 'error');
  }
}

async function sincronizarTudoParaTurso() {
  if (!appState.config.turso?.url || !appState.config.turso?.token) {
    mostrarToast('Configure o Turso antes de sincronizar!', 'warning');
    return;
  }

  mostrarToast('Enviando dados locais para o Turso...', 'info');

  try {
    const requests = [];

    // Envia catálogo de itens
    for (const item of appState.itens) {
      requests.push({
        sql: `INSERT INTO itens (id, nome, categoria, unidade, estoque_minimo, saldo_atual, localizacao, data_cadastro)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(id) DO UPDATE SET
                nome = excluded.nome,
                categoria = excluded.categoria,
                unidade = excluded.unidade,
                estoque_minimo = excluded.estoque_minimo,
                saldo_atual = excluded.saldo_atual,
                localizacao = excluded.localizacao`,
        args: [
          item.id, item.nome, item.categoria, item.unidade, item.estoqueMinimo || 0,
          item.saldoAtual || 0, item.localizacao || '', item.dataCadastro || new Date().toISOString()
        ]
      });
    }

    // Envia movimentações
    for (const m of appState.movimentacoes) {
      requests.push({
        sql: `INSERT OR REPLACE INTO movimentacoes (
          id, tipo, item_id, item_nome, categoria, unidade, quantidade,
          saldo_anterior, saldo_posterior, data_hora, responsavel, empresa,
          quarto, motivo, tipo_entrada, nf_numero, fornecedor, valor_unitario,
          foto_nf, assinatura, observacoes, origem
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          m.id, m.tipo, m.itemId, m.itemNome, m.categoria, m.unidade, m.quantidade,
          m.saldoAnterior, m.saldoPosterior, m.dataHora, m.responsavel, m.empresa,
          m.quarto || '', m.motivo || '', m.tipoEntrada || null, m.nfNumero || null,
          m.fornecedor || null, m.valorUnitario || null, m.fotoNf || null,
          m.assinatura || null, m.observacoes || null, m.origem || null
        ]
      });
    }

    if (requests.length > 0) {
      await executarTursoBatch(requests);
      appState.tursoConectado = true;
      atualizarBadgeConexao();
      mostrarToast('Todos os dados foram enviados e sincronizados no Turso!', 'success');
    } else {
      mostrarToast('Nenhum dado local para enviar.', 'info');
    }
  } catch (err) {
    console.error('Erro ao sincronizar tudo para Turso:', err);
    mostrarToast('Falha na sincronização com Turso: ' + err.message, 'error');
  }
}

function toggleMostrarTokenTurso() {
  const input = document.getElementById('cfg-turso-token');
  const icone = document.getElementById('icone-ver-token');
  if (!input || !icone) return;

  if (input.type === 'password') {
    input.type = 'text';
    icone.className = 'fa-solid fa-eye-slash';
  } else {
    input.type = 'password';
    icone.className = 'fa-solid fa-eye';
  }
}

function salvarSaidaTurso(mov, item) {
  if (!appState.config.turso?.ativo || !appState.tursoConectado) return;

  executarTursoBatch([
    {
      sql: `INSERT INTO movimentacoes (
        id, tipo, item_id, item_nome, categoria, unidade, quantidade,
        saldo_anterior, saldo_posterior, data_hora, responsavel, empresa,
        quarto, motivo, observacoes, assinatura
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        mov.id, 'SAIDA', item.id, item.nome, item.categoria, item.unidade, mov.quantidade,
        mov.saldoAnterior, mov.saldoPosterior, mov.dataHora, mov.responsavel, mov.empresa,
        mov.quarto || '', mov.motivo, mov.observacoes || '', mov.assinatura || null
      ]
    },
    {
      sql: `UPDATE itens SET saldo_atual = ? WHERE id = ?`,
      args: [item.saldoAtual, item.id]
    }
  ]).catch(err => console.error('Erro ao gravar saída no Turso:', err));
}

function salvarEntradaTurso(mov, item) {
  if (!appState.config.turso?.ativo || !appState.tursoConectado) return;

  executarTursoBatch([
    {
      sql: `INSERT INTO movimentacoes (
        id, tipo, item_id, item_nome, categoria, unidade, quantidade,
        saldo_anterior, saldo_posterior, data_hora, responsavel, empresa,
        quarto, motivo, tipo_entrada, nf_numero, fornecedor, valor_unitario, foto_nf, origem
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        mov.id, 'ENTRADA', item.id, item.nome, item.categoria, item.unidade, mov.quantidade,
        mov.saldoAnterior, mov.saldoPosterior, mov.dataHora, mov.responsavel, mov.empresa,
        mov.quarto || '', mov.motivo, mov.tipoEntrada || null, mov.nfNumero || null,
        mov.fornecedor || null, mov.valorUnitario || null, mov.fotoNf || null, mov.origem || null
      ]
    },
    {
      sql: `UPDATE itens SET saldo_atual = ? WHERE id = ?`,
      args: [item.saldoAtual, item.id]
    }
  ]).catch(err => console.error('Erro ao gravar entrada no Turso:', err));
}

function salvarItemTurso(item) {
  if (!appState.config.turso?.ativo || !appState.tursoConectado) return;

  executarTurso(`
    INSERT INTO itens (id, nome, categoria, unidade, estoque_minimo, saldo_atual, localizacao, data_cadastro)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      nome = excluded.nome,
      categoria = excluded.categoria,
      unidade = excluded.unidade,
      estoque_minimo = excluded.estoque_minimo,
      saldo_atual = excluded.saldo_atual,
      localizacao = excluded.localizacao
  `, [
    item.id, item.nome, item.categoria, item.unidade, item.estoqueMinimo || 0,
    item.saldoAtual || 0, item.localizacao || '', item.dataCadastro || new Date().toISOString()
  ]).catch(err => console.error('Erro ao salvar item no Turso:', err));
}

function excluirItemTurso(itemId) {
  if (!appState.config.turso?.ativo || !appState.tursoConectado) return;

  executarTurso(`DELETE FROM itens WHERE id = ?`, [itemId])
    .catch(err => console.error('Erro ao remover item no Turso:', err));
}

function salvarConfiguracoesGerais() {
  const nomeObra = document.getElementById('cfg-nome-obra').value.trim();
  if (nomeObra) {
    appState.config.nomeObra = nomeObra;
    document.getElementById('cidade-obra-txt').textContent = nomeObra;
  }

  const tursoUrl = document.getElementById('cfg-turso-url')?.value.trim();
  const tursoToken = document.getElementById('cfg-turso-token')?.value.trim();
  if (tursoUrl && tursoToken) {
    appState.config.turso = {
      url: tursoUrl,
      token: tursoToken,
      ativo: true
    };
    inicializarTursoSeDisponivel();
  }

  salvarEstadoConfig();
  closeModal('modal-config');
  renderApp();
  mostrarToast('Configurações salvas!', 'success');
}

// ==========================================
// BACKUP E RESTAURAÇÃO DE DADOS JSON
// ==========================================
function fazerBackupJSON() {
  const backup = {
    versao: '1.0',
    data: new Date().toISOString(),
    config: appState.config,
    itens: appState.itens,
    movimentacoes: appState.movimentacoes
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_almoxarifado_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  mostrarToast('Backup exportado com sucesso!', 'success');
}

function restaurarBackupJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.itens && Array.isArray(data.itens)) {
        appState.itens = data.itens;
        appState.movimentacoes = data.movimentacoes || [];
        if (data.config) appState.config = Object.assign(appState.config, data.config);

        salvarEstadoItens();
        salvarEstadoMovimentacoes();
        salvarEstadoConfig();

        closeModal('modal-config');
        renderApp();
        mostrarToast('Backup restaurado com sucesso!', 'success');
      } else {
        mostrarToast('Arquivo de backup inválido.', 'error');
      }
    } catch (err) {
      mostrarToast('Erro ao ler arquivo de backup.', 'error');
    }
  };
  reader.readAsText(file);
}

function carregarDadosDemonstracao() {
  const confirmacao = confirm('Deseja recarregar o catálogo padrão de insumos de canteiro?\n(Itens e histórico prévios serão redefinidos para os valores padrão)');
  if (!confirmacao) return;

  appState.itens = [...ITENS_PADRAO];
  appState.movimentacoes = [...MOVIMENTACOES_PADRAO];
  salvarEstadoItens();
  salvarEstadoMovimentacoes();

  closeModal('modal-config');
  renderApp();
  mostrarToast('Dados padrão de canteiro recarregados com sucesso!', 'success');
}

// ==========================================
// CONTROLE DE NAVEGAÇÃO E MODAIS
// ==========================================
function switchTab(targetId) {
  appState.activeTab = targetId;

  // Atualiza conteúdo
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.add('hidden');
  });
  const activeTabEl = document.getElementById(`tab-${targetId}`);
  if (activeTabEl) {
    activeTabEl.classList.remove('hidden');
  }

  // Atualiza tabs Desktop
  document.querySelectorAll('.nav-tab').forEach(btn => {
    if (btn.getAttribute('data-target') === targetId) {
      btn.className = 'nav-tab active px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition text-amber-400 bg-amber-500/10';
    } else {
      btn.className = 'nav-tab px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition text-slate-400 hover:text-slate-200 hover:bg-slate-800';
    }
  });

  // Atualiza botões Bottom Nav (Mobile)
  document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
    if (btn.getAttribute('data-target') === targetId) {
      btn.className = 'mobile-nav-btn active flex flex-col items-center justify-center py-1 text-amber-400 transition';
    } else {
      btn.className = 'mobile-nav-btn flex flex-col items-center justify-center py-1 text-slate-400 hover:text-slate-200 transition';
    }
  });

  // Scroll suave ao topo
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-renderiza gráficos se for dashboard
  if (targetId === 'dashboard') {
    setTimeout(renderGraficos, 100);
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

function openConfigModal() {
  openModal('modal-config');
}

// Fechamento de modais com tecla ESC
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.fixed.z-50:not(.hidden)').forEach(modal => {
      modal.classList.add('hidden');
    });
    document.body.classList.remove('overflow-hidden');
  }
});

// ==========================================
// UTILITÁRIOS (FORMATAÇÃO & TOASTS)
// ==========================================
function formatarDataHora(isoString) {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return isoString;
  }
}

let toastTimeout;
function mostrarToast(mensagem, tipo = 'info') {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  const iconEl = document.getElementById('toast-icon');

  if (!toast || !msgEl) return;

  msgEl.textContent = mensagem;

  if (tipo === 'success') {
    iconEl.className = 'fa-solid fa-circle-check text-emerald-400 text-lg';
    toast.style.borderColor = '#10b981';
  } else if (tipo === 'error') {
    iconEl.className = 'fa-solid fa-circle-exclamation text-rose-400 text-lg';
    toast.style.borderColor = '#f43f5e';
  } else if (tipo === 'warning') {
    iconEl.className = 'fa-solid fa-triangle-exclamation text-amber-400 text-lg';
    toast.style.borderColor = '#f59e0b';
  } else {
    iconEl.className = 'fa-solid fa-circle-info text-blue-400 text-lg';
    toast.style.borderColor = '#3b82f6';
  }

  toast.classList.remove('translate-y-[-150%]', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-[-150%]', 'opacity-0', 'pointer-events-none');
  }, 3500);
}

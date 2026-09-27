# Canteiro PRO 🏗️🏠📦
### Gestão de Estoque, Galpão Central e Cautela Físico-Nominal por Casas/Alojamentos

> 🌐 **Acesse o Aplicativo Online (GitHub Pages):**  
> **[https://eullon1234-creator.github.io/controle-de-estoque-tiago-vidal/](https://eullon1234-creator.github.io/controle-de-estoque-tiago-vidal/)**

---

## 🎯 Visão Geral do Sistema
O **Canteiro PRO** é um aplicativo web progressivo (**PWA / Mobile-First**) moderno, de alto impacto visual e pronto para uso pelo **Prefeito da Obra / Gestor de Alojamentos**.

Desenvolvido para atender à rotina operacional de canteiros e frentes de obras, o sistema resolve dois gargalos críticos da prefeitura de canteiro:
1. **Controle Físico do Galpão Central:** Saldo de móveis reservas (beliches, colchões, ar-condicionados, armários), materiais de limpeza, enxoval/kits e manutenção.
2. **Cautela Físico-Nominal por Casa:** Acompanhamento minucioso de cada casa alugada/alojamento, com o responsável legal identificado (Nome, Empresa, Telefone, Quarto), lista completa de móveis com estado de conservação, histórico de entregas de insumos e termo de cautela assinado.
3. **Substituição de Móveis Quebrados em 1 Clique:** Mecanismo inteligente que abate a unidade reserva do Galpão Central e restaura o item na casa automaticamente, registrando a movimentação no histórico.

Conectado ao banco de dados em nuvem **Turso (LibSQL)** de alta performance e com suporte a funcionamento offline (**Offline-First** via LocalStorage).

---

## 🚀 Principais Funcionalidades

### 1. 🏠 Gestão Completa de Casas & Alojamentos
- **Cartões de Casas:** Exibição clara do endereço, responsável nominal, empresa contratada, telefone (com link direto de discagem/WhatsApp), vagas totais e ocupadas.
- **Badge de Alerta de Manutenção:** Sinalização visual imediata se a casa possui algum móvel com defeito (`1 Item Danificado`).
- **Dossiê da Casa (Modal Completo):**
  - **Aba Móveis & Equipamentos:** Relação de todos os bens (Ar-condicionado, Beliches, Colchões, Geladeiras, Fogões, etc.) com estado de conservação (`Novo`, `Bom`, `Regular`, `Danificado - Solicitar Troca`).
  - **Troca em 1 Clique:** Ao detectar um móvel danificado, o botão **"Substituir pelo Galpão"** retira 1 unidade do estoque de reserva do galpão, marca o móvel da casa como `Bom` e gera o registro no histórico de auditoria.
  - **Aba Histórico de Entregas:** Registro de cada fardo de limpeza, kit de cama ou produto entregue na casa, com data e responsável pelo recebimento.
  - **Adicionar Móvel e Nova Entrega:** Formulários integrados no próprio dossiê.

### 2. 📦 Galpão Central (Estoque de Reserva & Consumíveis)
- **Categorização:** Móveis & Eletros (Reserva), Kits & Enxoval, Limpeza & Higiene, Manutenção Predial.
- **Controle de Saldo e Nível Crítico:** Badges com status em tempo real (`Normal`, `Atenção`, `Crítico/Zerado`).
- **Entrada no Galpão:** Registro rápido de abastecimento por Fornecedor ou Nota Fiscal.
- **Saída / Entrega para Casa:** Abatimento direto com destinação para a casa selecionada.
- **Cadastro de Novos Itens:** Permite cadastrar qualquer novo material no estoque central.

### 3. 📄 Ficha / Termo de Cautela Oficial & WhatsApp
- **Impressão Formato A4:** Layout limpo e padronizado contendo o timbre da obra, dados da casa, do responsável, tabela de todos os móveis e insumos sob responsabilidade, e campos para assinatura física do Responsável da Casa e do Prefeito da Obra.
- **Envio Rápido via WhatsApp:** Gera um resumo textual formatado com um clique e abre o WhatsApp com a mensagem pronta para envio ao responsável.

### 4. 📊 Dashboard Gerencial & Gráficos
- **KPIs em Tempo Real:** Casas ativas, ocupação total de colaboradores, itens no galpão central e itens aguardando troca/manutenção.
- **Gráficos Interativos (Chart.js):**
  - Ocupação por Casa / Alojamento.
  - Distribuição das categorias de itens no galpão.

### 5. 📑 Relatórios e Exportação para Excel (.xlsx)
- **Exportação Multissheet Profissional (SheetJS):**
  - **Aba 1 - Galpão Central:** Saldo atual, categorias e status de reposição.
  - **Aba 2 - Inventário de Casas:** Relação de todas as casas, responsáveis e bens instalados.
  - **Aba 3 - Movimentações:** Extrato completo de substituições, entregas e entradas.

### 6. ☁️ Banco de Dados Turso (LibSQL Cloud)
- Dados persistidos com segurança e rapidez no banco Turso distribuído na nuvem.
- Seletor de sincronização com indicador visual `Turso Cloud Conectado`.
- Fallback automático para LocalStorage em caso de instabilidade na conexão.

---

## 💻 Como Rodar o Projeto

### Acesso Imediato pelo Navegador
👉 **[https://eullon1234-creator.github.io/controle-de-estoque-tiago-vidal/](https://eullon1234-creator.github.io/controle-de-estoque-tiago-vidal/)**

### Execução Local (Windows)
1. Dê dois cliques no arquivo **`iniciar.bat`**, ou
2. Execute no terminal:
```bash
node server.js
```
3. Abra seu navegador em: `http://localhost:3000`

---

## 🛠️ Tecnologias Utilizadas
- **HTML5 Semântico & Tailwind CSS (Design Mobile-First moderno)**
- **JavaScript Moderno (ES6+ / Vanilla)**
- **Turso Database / LibSQL HTTP Pipeline API**
- **Chart.js** (Gráficos visuais de ocupação e categorias)
- **SheetJS (xlsx.full.min.js)** (Exportação para planilhas Excel)
- **PWA (Manifest + Service Worker)** (Instalação no celular)

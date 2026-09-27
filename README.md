# Almoxarifado Canteiro PRO 🏗️📦
### Sistema de Controle de Estoque e Almoxarifado para Alojamentos (Prefeitura de Canteiro)

> 🌐 **Acesse o App Online (GitHub Pages):**  
> **[https://eullon1234-creator.github.io/controle-de-estoque-tiago-vidal/](https://eullon1234-creator.github.io/controle-de-estoque-tiago-vidal/)**

Um aplicativo web progressivo (**PWA / Mobile-First**) moderno, responsivo e completo, desenvolvido para o **Prefeito da Obra** e a equipe de almoxarifado gerenciarem com precisão insumos, enxovais, produtos de higiene, limpeza e utilidades do alojamento de canteiros de obras. Integrado com banco de dados em nuvem **Turso (LibSQL)**.

---

## 🚀 Funcionalidades Principais

### 1. 📋 Catálogo & Gestão de Itens
- **Pré-cadastrados:** Travesseiro com Capa, Lençol Solteiro c/ Elástico, Fronha, Cobertor Térmico, Sabão em Pó, Desinfetante, Papel Higiênico, Água Sanitária, Vassoura, Saco de Lixo 100L, Cadeados e Detergentes.
- **Categorias:** Roupas de Cama / Enxoval, Higiene & Limpeza, Manutenção Predial, Utensílios & Utilitários, Alimentação / Copa.
- **Indicadores Visuais de Status:**
  - 🟢 **Normal:** Estoque saudável (> estoque mínimo).
  - 🟡 **Alerta:** Estoque em nível de atenção (≤ estoque mínimo).
  - 🔴 **Crítico:** Item zerado sem peças no canteiro.
- **Visualização flexível:** Alternância com 1 clique entre **Cards** (otimizado para celular) e **Tabela** (desktop).

### 2. 🚚 Módulo de Entradas (Abastecimento)
- **Com Nota Fiscal (NF):** Número da NF, Fornecedor, Data de Emissão, Valor Unitário e upload/foto da NF física tirada com a câmera do celular.
- **Entrada Avulsa / Sem NF:** Origem (Compra local de urgência, Transferência de outra obra, Doação, Devolução ou Inventário) e justificativa detalhada.
- Atualização e soma automática no saldo do item com registro instantâneo no Kardex.

### 3. ✍️ Módulo de Saídas / Entregas (Cautela & Assinatura)
- Bloqueio imediato caso a quantidade solicitada seja maior que o saldo em estoque.
- **Identificação nominal obrigatória:**
  - Nome completo do colaborador.
  - Empresa / Subempreiteira (ex: Empreiteira de Alvenaria, Elétrica, Pintura, Equipe de Limpeza).
  - Quarto / Bloco de destino no alojamento (ex: Quarto 04 - Bloco B).
  - Motivo (Troca quinzenal de enxoval, Admissão/Novo alojado, Reposição de limpeza, etc.).
- **Assinatura Digital no Celular:** Canvas interativo touch-friendly para assinatura com o dedo ou caneta stylus.
- **Comprovante de Cautela:** Termo de responsabilidade gerado na hora, com opção de envio direto para o **WhatsApp** ou impressão em PDF.

### 4. 📊 Dashboard & Alertas de Reposição
- KPIs de total de itens, saldo de peças físicas, alertas críticos e retiradas no mês.
- Banner dinâmico de compras urgentes para itens que atingiram nível crítico.
- Gráfico comparativo de movimentações diárias (Entradas vs Saídas dos últimos 7 dias via Chart.js).
- Gráfico Doughnut de distribuição de estoque por categoria.

### 5. 📜 Extrato Kardex, Relatórios & Exportações
- Linha do tempo com saldo anterior e saldo após cada operação.
- Relatório de consumo por **Empresa/Subempreiteira** (ranking de quem mais consome materiais).
- Relatório de colaboradores que mais retiraram itens.
- Lista de compras sugerida calculada automaticamente com base no estoque mínimo.
- **Exportação para Excel (.xlsx):** Gera arquivo com abas separadas de Catálogo e Movimentações formatadas.
- **Impressão Oficial em PDF:** Layout limpo em folha A4 com cabeçalho de obra e campos de assinatura do Prefeito de Canteiro e Engenheiro Residente.

### 6. 📱 PWA (Progressive Web App) & Offline First
- Funciona 100% offline via LocalStorage / Service Worker.
- Botão "Instalar App" no celular para adicionar o ícone à tela inicial como um app nativo.
- Suporte a sincronização em nuvem em tempo real com **Firebase Firestore** (opcional via modal de configurações).
- Backup e Restauração completa de dados em arquivo `.json`.

---

## 🛠️ Como Executar

### 1. Online (Sem instalar nada):
Basta acessar o link do GitHub Pages:  
👉 **[https://eullon1234-creator.github.io/controle-de-estoque-tiago-vidal/](https://eullon1234-creator.github.io/controle-de-estoque-tiago-vidal/)**

### 2. Localmente no Windows:
Basta dar dois cliques no arquivo **`iniciar.bat`** ou executar no terminal:

```bash
# Com Node.js:
node server.js

# Ou com Python:
python -m http.server 3000
```

Acesse: `http://localhost:3000`

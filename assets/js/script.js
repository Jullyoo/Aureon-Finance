const extrato = document.getElementById("extrato")
const processarBtn = document.getElementById("processarBtn")
const limparBtn = document.getElementById("limparBtn")
const tabela = document.getElementById("tabelaTransacoes")

const receitasEl = document.getElementById("receitas")
const despesasEl = document.getElementById("despesas")
const saldoEl = document.getElementById("saldo")

const necessidadesEl = document.getElementById("necessidades")
const desejosEl = document.getElementById("desejos")
const investimentosEl = document.getElementById("investimentos")

const alertasEl = document.getElementById("alertas")

const rangeReducao = document.getElementById("rangeReducao")
const valorReducao = document.getElementById("valorReducao")
const resultadoSimulacao = document.getElementById("resultadoSimulacao")

const exportarBtn = document.getElementById("exportarBtn")

const arquivoExtrato = document.getElementById("arquivoExtrato")

const toggleTema = document.getElementById("toggleTema")

const metaMensal = document.getElementById("metaMensal")
const salvarMeta = document.getElementById("salvarMeta")
const resultadoMeta = document.getElementById("resultadoMeta")

let transacoes = []

let graficoPizza = null
let graficoBarras = null

let valorDesejosAtual = 0

const categorias = {
  transporte: ["UBER", "99", "COMBUSTIVEL", "POSTO"],
  delivery: ["IFOOD", "RAPPI", "LANCHONETE"],
  mercado: ["MERCADO", "EXTRA", "CARREFOUR", "ATACADAO"],
  moradia: ["ALUGUEL", "CONDOMINIO", "LUZ", "AGUA", "INTERNET"],
  lazer: ["NETFLIX", "SPOTIFY", "CINEMA", "STEAM"],
  saude: ["FARMACIA", "DROGARIA", "HOSPITAL"],
  investimento: ["INVESTIMENTO", "TESOURO", "NU INVEST"],
  salario: [
    "SALARIO",
    "SALÁRIO",
    "PAGAMENTO",
    "PIX RECEBIDO"
  ]
}

function formatarMoeda(valor) {

  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })
}

function identificarCategoria(texto) {

  texto = texto.toUpperCase()

  for (let categoria in categorias) {

    for (let palavra of categorias[categoria]) {

      if (texto.includes(palavra)) {
        return categoria
      }
    }
  }

  return "outros"
}

function identificarTipo(linha, categoria) {

  const texto = linha.toUpperCase()

  const palavrasReceita = [
    "RECEBIDO",
    "RECEBIDA",
    "CREDITO",
    "CRÉDITO",
    "SALARIO",
    "SALÁRIO",
    "PAGAMENTO RECEBIDO",
    "TRANSFERENCIA RECEBIDA",
    "TRANSFERÊNCIA RECEBIDA",
    "TED RECEBIDA",
    "PIX RECEBIDO",
    "DEPOSITO",
    "DEPÓSITO",
    "ENTRADA"
  ]

  const palavrasDespesa = [
    "DEBITO",
    "DÉBITO",
    "PAGAMENTO",
    "COMPRA",
    "SAQUE",
    "TRANSFERENCIA ENVIADA",
    "TRANSFERÊNCIA ENVIADA",
    "PIX ENVIADO",
    "BOLETO",
    "TARIFA"
  ]

  if (categoria === "investimento") {
    return "investimento"
  }

  if (
    texto.includes("-") ||
    texto.includes(" D ")
  ) {
    return "despesa"
  }

  if (
    texto.includes("+") ||
    texto.includes(" C ")
  ) {
    return "receita"
  }

  for (let palavra of palavrasReceita) {

    if (texto.includes(palavra)) {
      return "receita"
    }
  }

  for (let palavra of palavrasDespesa) {

    if (texto.includes(palavra)) {
      return "despesa"
    }
  }

  if (categoria === "salario") {
    return "receita"
  }

  return "despesa"
}

function processarExtrato() {

  if (!extrato.value.trim()) {
    alert("Cole ou importe um extrato.")
    return
  }

  const linhas = extrato.value.split("\n")

  transacoes = []

  linhas.forEach(linha => {

    const regexValor =
      /-?\d{1,3}(?:\.\d{3})*,\d{2}/

    const match = linha.match(regexValor)

    if (!match) return

    const valor = parseFloat(
      match[0]
        .replace(/\./g, "")
        .replace(",", ".")
    )

    const descricao = linha
      .replace(match[0], "")
      .trim()

    const categoria =
      identificarCategoria(descricao)

    const tipo =
      identificarTipo(linha, categoria)

    transacoes.push({
      descricao,
      categoria,
      valor,
      tipo
    })

  })

  atualizarInterface()

  detectarRecorrentes()
}

function atualizarInterface() {

  tabela.innerHTML = ""

  let receitas = 0
  let despesas = 0
  let investimentos = 0

  let necessidades = 0
  let desejos = 0

  transacoes.forEach(transacao => {

    const tr = document.createElement("tr")

    tr.innerHTML = `
      <td>${transacao.descricao}</td>
      <td>${transacao.categoria}</td>
      <td>${formatarMoeda(Math.abs(transacao.valor))}</td>
      <td>${transacao.tipo}</td>
    `

    tabela.appendChild(tr)

    if (transacao.tipo === "receita") {

      receitas += Math.abs(transacao.valor)

    }

    else if (transacao.tipo === "despesa") {

      despesas += Math.abs(transacao.valor)

      if (
        [
          "mercado",
          "moradia",
          "saude",
          "transporte"
        ].includes(transacao.categoria)
      ) {

        necessidades += Math.abs(transacao.valor)

      }

      else {

        desejos += Math.abs(transacao.valor)

      }

    }

    else if (transacao.tipo === "investimento") {

      investimentos += Math.abs(transacao.valor)

    }

  })

  valorDesejosAtual = desejos

  const saldo =
    receitas - despesas - investimentos

  receitasEl.textContent =
    formatarMoeda(receitas)

  despesasEl.textContent =
    formatarMoeda(despesas)

  saldoEl.textContent =
    formatarMoeda(saldo)

  const percNecessidades =
    receitas > 0
      ? ((necessidades / receitas) * 100).toFixed(1)
      : 0

  const percDesejos =
    receitas > 0
      ? ((desejos / receitas) * 100).toFixed(1)
      : 0

  const percInvestimentos =
    receitas > 0
      ? ((investimentos / receitas) * 100).toFixed(1)
      : 0

  necessidadesEl.textContent =
    percNecessidades + "%"

  desejosEl.textContent =
    percDesejos + "%"

  investimentosEl.textContent =
    percInvestimentos + "%"

  analisarRegra502030(
    receitas,
    necessidades,
    desejos,
    investimentos
  )

  atualizarSimulacao(valorDesejosAtual)

  atualizarGraficos()

  verificarMeta(
    despesas + investimentos
  )
}

function analisarRegra502030(
  receitas,
  necessidades,
  desejos,
  investimentos
) {

  alertasEl.innerHTML = ""

  const limiteNecessidades =
    receitas * 0.5

  const limiteDesejos =
    receitas * 0.3

  const metaInvestimentos =
    receitas * 0.2

  if (necessidades > limiteNecessidades) {

    criarAlerta(
      `⚠️ Necessidades acima da meta em ${formatarMoeda(
        necessidades - limiteNecessidades
      )}`
    )

  } else {

    criarAlerta(
      "✅ Necessidades dentro da regra 50-30-20"
    )
  }

  if (desejos > limiteDesejos) {

    criarAlerta(
      `⚠️ Desejos acima da meta em ${formatarMoeda(
        desejos - limiteDesejos
      )}`
    )

  } else {

    criarAlerta(
      "✅ Desejos dentro da regra 50-30-20"
    )
  }

  if (investimentos < metaInvestimentos) {

    criarAlerta(
      `⚠️ Faltam ${formatarMoeda(
        metaInvestimentos - investimentos
      )} para atingir os 20% de investimentos`
    )

  } else {

    criarAlerta(
      "✅ Meta de investimentos atingida"
    )
  }
}

function criarAlerta(texto) {

  const div = document.createElement("div")

  div.classList.add("alerta")

  div.textContent = texto

  alertasEl.appendChild(div)
}

function atualizarSimulacao(valorDesejos) {

  if (!rangeReducao) return

  const percentual =
    Number(rangeReducao.value)

  valorReducao.textContent =
    percentual + "%"

  const economiaMensal =
    valorDesejos * (percentual / 100)

  const economiaAnual =
    economiaMensal * 12

  resultadoSimulacao.textContent =
    formatarMoeda(economiaAnual)
}

function atualizarGraficos() {

  if (typeof Chart === "undefined") {
    console.error("Chart.js não carregado")
    return
  }

  const canvasPizza =
    document.getElementById("graficoCategorias")

  const canvasBarras =
    document.getElementById("graficoGastos")

  if (!canvasPizza || !canvasBarras) {
    return
  }

  const categoriasValores = {}

  transacoes.forEach(t => {

    if (
      t.tipo === "despesa" ||
      t.tipo === "investimento"
    ) {

      if (!categoriasValores[t.categoria]) {
        categoriasValores[t.categoria] = 0
      }

      categoriasValores[t.categoria] +=
        Math.abs(t.valor)
    }

  })

  const labels =
    Object.keys(categoriasValores)

  const valores =
    Object.values(categoriasValores)

  if (graficoPizza) {
    graficoPizza.destroy()
  }

  if (graficoBarras) {
    graficoBarras.destroy()
  }

  graficoPizza = new Chart(
    canvasPizza,
    {
      type: "pie",

      data: {
        labels,
        datasets: [{
          data: valores,
          backgroundColor: [
            "#ff6384",
            "#36a2eb",
            "#ffce56",
            "#4bc0c0",
            "#9966ff",
            "#ff9f40",
            "#8dd17e"
          ]
        }]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    }
  )

  graficoBarras = new Chart(
    canvasBarras,
    {
      type: "bar",

      data: {
        labels,
        datasets: [{
          label: "Gastos",
          data: valores,
          backgroundColor: "#36a2eb"
        }]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    }
  )
}

function verificarMeta(totalGastos) {

  const meta =
    Number(localStorage.getItem("metaMensal") || 0)

  if (!meta) {
    resultadoMeta.innerHTML = ""
    return
  }

  if (totalGastos <= meta) {

    resultadoMeta.innerHTML = `
      <span class="meta-ok">
        ✅ Você está dentro da meta financeira
      </span>
    `

  } else {

    resultadoMeta.innerHTML = `
      <span class="meta-ruim">
        ⚠️ Você ultrapassou sua meta financeira
      </span>
    `
  }
}

function exportarCSV() {

  if (transacoes.length === 0) {
    alert("Nenhuma transação para exportar.")
    return
  }

  let csv =
    "Descrição,Categoria,Valor,Tipo\n"

  transacoes.forEach(t => {

    csv +=
      `"${t.descricao}","${t.categoria}",${t.valor},"${t.tipo}"\n`

  })

  const blob = new Blob(
    [csv],
    { type: "text/csv;charset=utf-8;" }
  )

  const url =
    URL.createObjectURL(blob)

  const a =
    document.createElement("a")

  a.href = url

  a.download = "transacoes.csv"

  a.click()

  URL.revokeObjectURL(url)
}

function detectarRecorrentes() {

  const recorrentes = {}

  transacoes.forEach(t => {

    if (!recorrentes[t.descricao]) {
      recorrentes[t.descricao] = 0
    }

    recorrentes[t.descricao]++
  })

  console.log("Gastos recorrentes:")

  for (let item in recorrentes) {

    if (recorrentes[item] > 1) {
      console.log(item)
    }
  }
}

function importarArquivo(event) {

  const arquivo = event.target.files[0]

  if (!arquivo) return

  const leitor = new FileReader()

  leitor.onload = function(e) {

    extrato.value = e.target.result

    processarExtrato()
  }

  leitor.readAsText(arquivo)
}

function carregarTema() {

  const modoClaro =
    localStorage.getItem("modoClaro") === "true"

  if (modoClaro) {
    document.body.classList.add("light-mode")
  }
}

function limparTudo() {

  transacoes = []

  extrato.value = ""

  tabela.innerHTML = ""

  alertasEl.innerHTML = ""

  resultadoSimulacao.textContent = ""

  resultadoMeta.innerHTML = ""

  receitasEl.textContent = "R$ 0,00"
  despesasEl.textContent = "R$ 0,00"
  saldoEl.textContent = "R$ 0,00"

  necessidadesEl.textContent = "0%"
  desejosEl.textContent = "0%"
  investimentosEl.textContent = "0%"

  if (graficoPizza) {
    graficoPizza.destroy()
    graficoPizza = null
  }

  if (graficoBarras) {
    graficoBarras.destroy()
    graficoBarras = null
  }
}

if (arquivoExtrato) {

  arquivoExtrato.addEventListener(
    "change",
    importarArquivo
  )
}

if (processarBtn) {

  processarBtn.addEventListener(
    "click",
    processarExtrato
  )
}

if (limparBtn) {

  limparBtn.addEventListener(
    "click",
    limparTudo
  )
}

if (rangeReducao) {

  rangeReducao.addEventListener(
    "input",
    () => {
      atualizarSimulacao(valorDesejosAtual)
    }
  )
}

if (exportarBtn) {

  exportarBtn.addEventListener(
    "click",
    exportarCSV
  )
}

if (salvarMeta) {

  salvarMeta.addEventListener(
    "click",
    () => {

      localStorage.setItem(
        "metaMensal",
        metaMensal.value
      )

      atualizarInterface()
    }
  )
}

if (toggleTema) {

  toggleTema.addEventListener(
    "click",
    () => {

      document.body.classList.toggle(
        "light-mode"
      )

      const modoClaro =
        document.body.classList.contains(
          "light-mode"
        )

      localStorage.setItem(
        "modoClaro",
        modoClaro
      )
    }
  )
}

carregarTema()
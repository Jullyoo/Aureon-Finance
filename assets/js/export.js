import { state } from "./state.js"

export function exportCSV() {

  if (
    state.transactions.length === 0
  ) {
    alert(
      "Nenhuma transação encontrada."
    )

    return
  }

  let csv =
    "Descrição,Categoria,Tipo,Valor\n"

  state.transactions.forEach(t => {

    csv +=
      `"${t.description}",` +
      `"${t.category}",` +
      `"${t.type}",` +
      `"${t.value}"\n`

  })

  const blob =
    new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;"
      }
    )

  const url =
    URL.createObjectURL(blob)

  const link =
    document.createElement("a")

  link.href = url

  link.download =
    "transacoes.csv"

  link.click()

  URL.revokeObjectURL(url)
}
export const categories = {

  transporte: [
    "UBER",
    "99",
    "COMBUSTIVEL",
    "POSTO"
  ],

  delivery: [
    "IFOOD",
    "RAPPI"
  ],

  mercado: [
    "MERCADO",
    "EXTRA",
    "CARREFOUR"
  ],

  moradia: [
    "ALUGUEL",
    "CONDOMINIO",
    "LUZ",
    "AGUA",
    "INTERNET"
  ],

  lazer: [
    "NETFLIX",
    "SPOTIFY",
    "STEAM"
  ],

  saude: [
    "FARMACIA",
    "HOSPITAL"
  ],

  investimento: [
    "INVESTIMENTO",
    "TESOURO"
  ],

  salario: [
    "SALARIO",
    "SALÁRIO",
    "PAGAMENTO"
  ]
}

export function identifyCategory(text) {

  const upper =
    text.toUpperCase()

  for (const category in categories) {

    for (
      const keyword
      of categories[category]
    ) {

      if (
        upper.includes(keyword)
      ) {
        return category
      }

    }

  }

  return "outros"
}
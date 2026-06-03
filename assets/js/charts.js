import { state } from "./state.js";

const chartColors = [
  "#b91c1c",
  "#dc2626",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#14b8a6",
  "#a855f7",
  "#64748b",
  "#fb7185",
  "#991b1b"
];

export function updateCharts() {

  const expensesByCategory = {};
  const incomesBySource = {};

  state.transactions.forEach(transaction => {

    const value = Math.abs(transaction.value);

    if (transaction.type === "expense") {

      if (!expensesByCategory[transaction.category]) {
        expensesByCategory[transaction.category] = 0;
      }

      expensesByCategory[transaction.category] += value;
    }

    if (transaction.type === "income") {

      const source =
        transaction.description || "Receita";

      if (!incomesBySource[source]) {
        incomesBySource[source] = 0;
      }

      incomesBySource[source] += value;
    }
  });

  renderExpenseDistribution(
    Object.keys(expensesByCategory),
    Object.values(expensesByCategory)
  );

  renderExpenseRanking(
    expensesByCategory
  );

  renderIncomeRanking(
    incomesBySource
  );
}

function getChartOptions() {

  return {

    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      intersect: false,
      mode: "index"
    },

    plugins: {

      legend: {

        position: "top",

        labels: {

          color: "#94A3B8",

          padding: 20,

          usePointStyle: true,

          pointStyle: "circle",

          font: {
            size: 12,
            weight: "600"
          }
        }
      },

      tooltip: {

        backgroundColor: "#0F172A",

        titleColor: "#FFFFFF",

        bodyColor: "#E2E8F0",

        borderColor: "#334155",

        borderWidth: 1,

        padding: 12,

        cornerRadius: 12
      }
    }
  };
}

function renderExpenseDistribution(
  labels,
  values
) {

  const canvas =
    document.getElementById(
      "categoryChart"
    );

  if (!canvas) return;

  if (state.charts.category) {
    state.charts.category.destroy();
  }

  state.charts.category =
    new Chart(canvas, {

      type: "doughnut",

      data: {

        labels,

        datasets: [{
          data: values,
          backgroundColor: chartColors,
          borderColor: "#0F172A",
          borderWidth: 2,
          hoverOffset: 10
        }]
      },

      options: {

        ...getChartOptions(),

        plugins: {

          ...getChartOptions().plugins,

          title: {

            display: true,

            text:
              "Distribuição das Despesas",

            color:
              "#E2E8F0"
          }
        },

        cutout: "65%"
      }
    });
}

function renderExpenseRanking(
  expenses
) {

  const canvas =
    document.getElementById(
      "expenseChart"
    );

  if (!canvas) return;

  const sorted =
    Object.entries(expenses)
      .sort((a, b) => b[1] - a[1]);

  const labels =
    sorted.map(item => item[0]);

  const values =
    sorted.map(item => item[1]);

  if (state.charts.expense) {
    state.charts.expense.destroy();
  }

  state.charts.expense =
    new Chart(canvas, {

      type: "bar",

      data: {

        labels,

        datasets: [{
          label:
            "Despesas",

          data: values,

          backgroundColor:
            "rgba(220,38,38,.85)",

          borderRadius: 12,

          borderSkipped: false
        }]
      },

      options: {

        ...getChartOptions(),

        indexAxis: "y",

        plugins: {

          ...getChartOptions().plugins,

          title: {

            display: true,

            text:
              "Maiores Despesas",

            color:
              "#E2E8F0"
          }
        },

        scales: {

          x: {

            beginAtZero: true,

            ticks: {
              color: "#94A3B8"
            },

            grid: {
              color:
                "rgba(148,163,184,.1)"
            }
          },

          y: {

            ticks: {
              color: "#94A3B8"
            },

            grid: {
              display: false
            }
          }
        }
      }
    });
}

function renderIncomeRanking(
  incomes
) {

  const canvas =
    document.getElementById(
      "incomeChart"
    );

  if (!canvas) return;

  const sorted =
    Object.entries(incomes)
      .sort((a, b) => b[1] - a[1]);

  const labels =
    sorted.map(item => item[0]);

  const values =
    sorted.map(item => item[1]);

  if (state.charts.income) {
    state.charts.income.destroy();
  }

  state.charts.income =
    new Chart(canvas, {

      type: "bar",

      data: {

        labels,

        datasets: [{
          label:
            "Receitas",

          data: values,

          backgroundColor:
            "rgba(34,197,94,.85)",

          borderRadius: 12,

          borderSkipped: false
        }]
      },

      options: {

        ...getChartOptions(),

        indexAxis: "y",

        plugins: {

          ...getChartOptions().plugins,

          title: {

            display: true,

            text:
              "Fontes de Receita",

            color:
              "#E2E8F0"
          }
        },

        scales: {

          x: {

            beginAtZero: true,

            ticks: {
              color: "#94A3B8"
            },

            grid: {
              color:
                "rgba(148,163,184,.1)"
            }
          },

          y: {

            ticks: {
              color: "#94A3B8"
            },

            grid: {
              display: false
            }
          }
        }
      }
    });
}
const currencyFormatter = new Intl.NumberFormat("uk-UA", {
  style: "currency",
  currency: "UAH",
  maximumFractionDigits: 2
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

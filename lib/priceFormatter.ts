const priceFormatter = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

const formatPrice = (p: number) => priceFormatter.format(p)

export { priceFormatter, formatPrice, formatPrice as default }
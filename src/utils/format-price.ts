const formatPrice = (amount: number, currency = 'eur') => {
  let price = amount.toFixed(2);
  let numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });
  return numberFormat.format(Number(price));
};

export default formatPrice;

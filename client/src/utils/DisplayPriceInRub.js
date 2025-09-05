

const DisplayPriceInRub = (price) => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  }).format(price);
};


export default DisplayPriceInRub;
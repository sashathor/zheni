const axios = require('axios');
const functionResponse = require('./utils/function-response');

const DELIVERY_DISCOUNT = process.env.GATSBY_DELIVERY_DISCOUNT;

exports.handler = async ({ body }) => {
  const { code, weight } = body ? JSON.parse(body) : {};
  let response;

  if (code && weight) {
    try {
      const url = `https://api.posta.sk/private/pricelist/products?t=${code}&w=${
        Number(weight) / 1000
      }`;
      const deliveryResponse = await axios.get(url);
      const { products } = deliveryResponse.data;
      const product = products.find(
        ({ type }) => type === (code.toUpperCase() === 'SK' ? 'ba' : 'b'),
      );
      if (product) {
        const price = Number(
          (Number(product.price) - DELIVERY_DISCOUNT).toFixed(2),
        );
        response = {
          price: price > 0 ? price : 3,
          days: product.delivery,
        };
      }
    } catch (e) {
      return functionResponse({ statusCode: 500 });
    }
  }

  return functionResponse({ response });
};

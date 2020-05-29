const axios = require('axios');
const functionResponse = require('./utils/function-response');

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
        response = {
          price: Number(product.price) * 100,
          days: product.delivery,
        };
      }
    } catch (e) {
      return functionResponse({ statusCode: 500 });
    }
  }

  return functionResponse({ response });
};

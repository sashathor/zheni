import { Handler } from '@netlify/functions';
import axios from 'axios';
import { functionResponse } from './utils/function-response';

const DELIVERY_DISCOUNT: string | undefined =
  process.env.GATSBY_DELIVERY_DISCOUNT;

const handler: Handler = async ({ body }) => {
  const { code, weight }: { code: string; weight: string } = body
    ? JSON.parse(body)
    : {};
  let response;

  if (code && weight) {
    try {
      const url = `https://api.posta.sk/private/pricelist/products?t=${code}&w=${
        Number(weight) / 1000
      }`;
      const deliveryResponse = await axios.get(url);
      const { products } = deliveryResponse.data;
      const product = products.find(
        ({ type }: { type: string }) =>
          type === (code.toUpperCase() === 'SK' ? 'ba' : 'b'),
      );
      if (product) {
        const price = Number(
          (Number(product.price) - Number(DELIVERY_DISCOUNT)).toFixed(2),
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

export { handler };

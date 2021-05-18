import { Handler } from '@netlify/functions';
import { functionResponse } from './utils/function-response';

const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY, {
  maxNetworkRetries: process.env.GATSBY_STRIPE_NETWORK_RETRIES,
});

type StripeProductProps = {
  id: string;
};

const handler: Handler = async (event) => {
  const { body } = event;
  const bodyData = body && JSON.parse(body);
  let response;

  try {
    if (bodyData.ids) {
      const ids = bodyData.ids.split(',').filter((id: string) => id !== '');
      const { data } = await stripe.products.list({ ids, limit: 100 });

      response = ids.map((id: string) => ({
        id,
        status: ((product) => {
          if (product) {
            return product.active ? 'active' : 'archived';
          }
          return 'not_found';
        })(data.find((item: StripeProductProps) => item.id === id)),
      }));
    }
  } catch (error) {
    return functionResponse({ statusCode: 500, error });
  }

  return functionResponse({ response });
};

export { handler };

import { Handler } from '@netlify/functions';
import { functionResponse } from './utils/function-response';

const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY, {
  maxNetworkRetries: process.env.GATSBY_STRIPE_NETWORK_RETRIES,
});

const handler: Handler = async (event) => {
  const { body } = event;
  const bodyData = body && JSON.parse(body);
  let response;

  try {
    const code = bodyData.code;
    if (code) {
      const data = await stripe.coupons.retrieve(code);
      const { percent_off, valid, metadata } = data;
      response = { percent_off, valid, ...metadata };
    }
  } catch (error) {
    return functionResponse({ statusCode: 500, error });
  }

  return functionResponse({ response });
};

export { handler };

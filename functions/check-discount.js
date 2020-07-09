const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY, {
  maxNetworkRetries: process.env.GATSBY_STRIPE_NETWORK_RETRIES,
});
const functionResponse = require('./utils/function-response');

exports.handler = async ({ body }) => {
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

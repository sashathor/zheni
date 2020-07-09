const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY, {
  maxNetworkRetries: process.env.GATSBY_STRIPE_NETWORK_RETRIES,
});
const functionResponse = require('./utils/function-response');

exports.handler = async ({ body }) => {
  const bodyData = body && JSON.parse(body);
  let response;

  try {
    if (bodyData.ids) {
      const ids = bodyData.ids.split(',').filter((id) => id !== '');
      const { data } = await stripe.products.list({ ids, limit: 100 });
      response = ids.map((id) => ({
        id,
        status: ((product) => {
          if (product) {
            return product.active ? 'active' : 'archived';
          }
          return 'not_found';
        })(data.find((item) => item.id === id)),
      }));
    }
  } catch (error) {
    return functionResponse({ statusCode: 500, error });
  }

  return functionResponse({ response });
};

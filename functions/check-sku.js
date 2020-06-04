const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);
const functionResponse = require('./utils/function-response');

exports.handler = async ({ body }) => {
  const bodyData = body && JSON.parse(body);
  let response;

  try {
    const skus = bodyData.skus;
    if (skus) {
      const ids = skus.split(',').filter((sku) => sku !== '');
      const { data } = await stripe.skus.list({ ids });
      response = ids.map((id) => ({
        id,
        status: ((sku) => {
          if (sku) {
            return sku.active ? 'active' : 'archived';
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

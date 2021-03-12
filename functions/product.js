const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY, {
  maxNetworkRetries: process.env.GATSBY_STRIPE_NETWORK_RETRIES,
});
const functionResponse = require('./utils/function-response');

const processProduct = async ({ id, title, active }) => {
  let entity;

  try {
    entity = await stripe.products.retrieve(id);
  } catch (error) {
    console.error(error);
  }

  const productFields = {
    name: title['en-US'],
    active,
  };

  if (entity) {
    return await stripe.products.update(id, {
      ...productFields,
    });
  }

  return await stripe.products.create({
    ...productFields,
    id,
    type: 'good',
    attributes: ['name'],
  });
};

exports.handler = async (event) => {
  const { body, headers } = event;
  const data = body && JSON.parse(body);
  let response;

  if (
    headers['zheni-secret'] ===
      process.env.GATSBY_CONTENTFUL_WEBHOOK_SECRET_KEY &&
    data
  ) {
    try {
      const {
        sys: { contentType },
      } = data;

      if (contentType.sys.id === 'product') {
        const {
          sys: { id },
          fields: { title, price, status },
        } = data;

        const active = status['en-US'] !== 'Sold';

        await processProduct({ id, title, active });

        response = { status: true };
      }
    } catch (error) {
      return functionResponse({ statusCode: 500, error });
    }
  }

  return functionResponse({ response });
};

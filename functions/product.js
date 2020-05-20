const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);
const functionResponse = require('./utils/function-response');

const processProduct = async ({ id, title }) => {
  let entity;

  try {
    entity = await stripe.products.retrieve(id);
  } catch (e) {}

  const productFields = {
    name: title['en-US'],
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

const processSku = async ({ id, title, price }) => {
  let entity;

  try {
    entity = await stripe.skus.retrieve(id);
  } catch (e) {}

  const skuFields = {
    price: Number(price['en-US']) * 100,
    attributes: {
      name: title['en-US'],
    },
  };

  if (entity) {
    return await stripe.skus.update(id, { ...skuFields });
  }

  return await stripe.skus.create({
    ...skuFields,
    id,
    product: id,
    currency: 'eur',
    inventory: { type: 'infinite' },
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
          fields: { title, price },
        } = data;

        await processProduct({ id, title });
        await processSku({ id, title, price });

        response = { status: true };
      }
    } catch (e) {
      return functionResponse({ statusCode: 500 });
    }
  }

  return functionResponse({ response });
};

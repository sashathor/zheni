const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);
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

const processSku = async ({ id, title, price, active }) => {
  let entity;

  try {
    entity = await stripe.skus.retrieve(id);
  } catch (error) {
    console.error(error);
  }

  const skuFields = {
    price: Number(price['en-US']) * 100,
    active,
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

      console.log({ data });

      if (contentType.sys.id === 'product') {
        const {
          sys: { id },
          fields: { title, price, status },
        } = data;

        const active = status['en-US'] === 'Active';

        await processProduct({ id, title, active });
        await processSku({ id, title, price, active });

        response = { status: true };
      }
    } catch (error) {
      return functionResponse({ statusCode: 500, error });
    }
  }

  return functionResponse({ response });
};

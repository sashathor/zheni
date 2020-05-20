const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);

exports.handler = async ({ body }) => {
  let status = false;
  let response;

  // await [
  //   // 'sku_HHGRnesYAQ8haG',
  //   // 'sku_HCPl9bf0bJogDM',
  //   'sku_HAnrIJtAIJdVrI',
  // ].forEach(async (sku) => {
  //   await stripe.skus.update(sku, { active: false });
  // });
  // await request.post(process.env.GATSBY_REBUILD_WEBHOOK);

  // let productId;
  // try {
  //   response = await stripe.skus.retrieve('sku_HHGRnesYAQ8haG');
  //   productId = response.product;
  // } catch (e) {}

  // console.log({ productId });

  // const response = await stripe.products.create({
  //   name: 'Delivery',
  //   type: 'good',
  //   description: 'Delivery item',
  //   attributes: ['name', 'destination', 'url'],
  // });

  const id = 'prod_HM6KpsfKegIB0F';

  skuResponse = await stripe.skus.create({
    price: 1000,
    attributes: {
      name: 'AAAA',
    },
    id,
    currency: 'eur',
    product: id,
    inventory: { type: 'infinite' },
  });

  return {
    headers: {
      'Content-type': 'application/json',
    },
    statusCode: 200,
    body: JSON.stringify({ status, response }),
  };
};

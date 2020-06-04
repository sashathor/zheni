const axios = require('axios');
const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);
const functionResponse = require('./utils/function-response');
const STRIPE_DELIVERY_PRODUCT = process.env.GATSBY_STRIPE_DELIVERY_PRODUCT;

const processDelivery = async ({ price, code, country }) => {
  let deliveryProduct;

  try {
    deliveryProduct = await stripe.products.retrieve(STRIPE_DELIVERY_PRODUCT);
  } catch (e) {}

  if (!deliveryProduct) {
    deliveryProduct = await stripe.products.create({
      name: 'Delivery',
      id: STRIPE_DELIVERY_PRODUCT,
      type: 'good',
      attributes: ['name', 'destination'],
    });
  }

  return await stripe.skus.create({
    price,
    currency: 'eur',
    inventory: { type: 'infinite' },
    attributes: {
      name: `Delivery to ${country}`,
      destination: code,
    },
    product: STRIPE_DELIVERY_PRODUCT,
  });
};

exports.handler = async ({ body }) => {
  const data = body && JSON.parse(body);
  let response;

  if (data) {
    const { type } = data;

    if (type === 'zheni.checkout.delivery') {
      try {
        const deliverySku = await processDelivery(data);
        response = {
          deliverySku: deliverySku.id,
        };
      } catch (error) {
        return functionResponse({ statusCode: 500, error });
      }
    }

    if (type === 'checkout.session.completed') {
      try {
        const {
          data: {
            object: { display_items },
          },
        } = data;
        const items = display_items
          .filter(
            (item) => item.sku && item.sku.product !== STRIPE_DELIVERY_PRODUCT,
          )
          .map((item) => item.sku.id);

        let checkoutCompleted = [];
        if (items.length > 0) {
          try {
            checkoutCompleted = await Promise.all(
              items.map((sku) => stripe.skus.update(sku, { active: false })),
              items.map((sku) =>
                stripe.products.update(sku, { active: false }),
              ),
              axios.post(process.env.GATSBY_REBUILD_WEBHOOK),
            );
          } catch (e) {}
          response = {
            checkoutCompleted: checkoutCompleted.length,
          };
        }
      } catch (error) {
        return functionResponse({ statusCode: 500, error });
      }
    }
  }

  return functionResponse({ response });
};

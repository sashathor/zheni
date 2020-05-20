const axios = require('axios');
const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);
const functionResponse = require('./utils/function-response');

exports.handler = async ({ body }) => {
  const data = body && JSON.parse(body);
  let response;

  if (data) {
    const { type } = data;

    if (type === 'zheni.checkout.delivery') {
      try {
        const { price, code, country } = data;
        const deliverySku = await stripe.skus.create({
          price,
          currency: 'eur',
          inventory: { type: 'infinite' },
          attributes: {
            name: `Delivery to ${country}`,
            destination: code,
          },
          product: process.env.GATSBY_STRIPE_DELIVERY_PRODUCT,
        });
        response = {
          deliverySku: deliverySku.id,
        };
      } catch (e) {
        return functionResponse({ statusCode: 500 });
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
          .filter((item) => item.sku)
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
      } catch (e) {
        return functionResponse({ statusCode: 500 });
      }
    }
  }

  return functionResponse({ response });
};

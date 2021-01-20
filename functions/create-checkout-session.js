const axios = require('axios');
const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY, {
  maxNetworkRetries: process.env.GATSBY_STRIPE_NETWORK_RETRIES,
});
const functionResponse = require('./utils/function-response');
const STRIPE_DELIVERY_PRODUCT = process.env.GATSBY_STRIPE_DELIVERY_PRODUCT;

const processDelivery = async () => {
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
};

exports.handler = async ({ body, headers }) => {
  const data = body && JSON.parse(body);
  let response;

  const { order } = data;
  try {
    await processDelivery();
  } catch (error) {
    return functionResponse({ statusCode: 500, error });
  }

  try {
    const line_items = order.items.map(({ id, price }) => {
      let unitAmount = Number(price);
      if (order.discount && order.discount.discount) {
        unitAmount -= (unitAmount * order.discount.discount) / 100;
      }
      return {
        price_data: {
          product: id,
          currency: 'EUR',
          unit_amount: parseFloat(unitAmount).toFixed(2) * 100,
        },
        quantity: 1,
      };
    });

    if (!(order.discount && order.discount.free_delivery)) {
      line_items.push({
        price_data: {
          product: STRIPE_DELIVERY_PRODUCT,
          currency: 'EUR',
          unit_amount: Number(order.delivery.price) * 100,
        },
        quantity: 1,
      });
    }

    const sessionParams = {
      payment_method_types: ['card', 'sofort'],
      mode: 'payment',
      locale: 'en',
      line_items,
      success_url: `${headers.origin}/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${headers.origin}/order-error`,
      shipping_address_collection: {
        allowed_countries: [order.delivery.code],
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    response = { sessionId: session.id };
  } catch (error) {
    return functionResponse({ statusCode: 500, error });
  }

  return functionResponse({ response });
};

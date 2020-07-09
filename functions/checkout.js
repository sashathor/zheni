const axios = require('axios');
const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY, {
  maxNetworkRetries: process.env.GATSBY_STRIPE_NETWORK_RETRIES,
});
const functionResponse = require('./utils/function-response');

exports.handler = async ({ body }) => {
  const data = body && JSON.parse(body);
  let response;

  if (data && data.type === 'checkout.session.completed') {
    const sessionData = await stripe.checkout.sessions.retrieve(
      data.data.object.id,
      {
        expand: ['line_items'],
      },
    );

    try {
      const items = sessionData.line_items.data
        .filter(
          ({ price }) =>
            price.id &&
            price.product !== process.env.GATSBY_STRIPE_DELIVERY_PRODUCT,
        )
        .map(({ price }) => price.product);

      let checkoutCompleted = [];
      if (items.length > 0) {
        try {
          console.log('OK');
          checkoutCompleted = await Promise.all(
            items.map((id) => stripe.products.update(id, { active: false })),
            axios.post(process.env.GATSBY_REBUILD_WEBHOOK),
          );
        } catch (e) {
          console.log('error', e);
        }
        response = {
          checkoutCompleted: checkoutCompleted.length,
        };
      }
    } catch (error) {
      return functionResponse({ statusCode: 500, error });
    }
  }

  return functionResponse({ response });
};

import { Handler } from '@netlify/functions';
import axios from 'axios';
import { functionResponse } from './utils/function-response';

const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY, {
  maxNetworkRetries: process.env.GATSBY_STRIPE_NETWORK_RETRIES,
});

type PriceProps = {
  id: string;
  product: string;
};

const handler: Handler = async (event) => {
  const { body } = event;
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
          ({ price }: { price: PriceProps }) =>
            price.id &&
            price.product !== process.env.GATSBY_STRIPE_DELIVERY_PRODUCT,
        )
        .map(({ price }: { price: PriceProps }) => price.product);

      let checkoutCompleted = [];
      if (items.length > 0) {
        try {
          checkoutCompleted = await Promise.all(
            items.map((id: string) =>
              stripe.products.update(id, { active: false }),
            ),
            // @ts-ignore
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

export { handler };

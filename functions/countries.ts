import { Handler } from '@netlify/functions';
import axios from 'axios';
import { functionResponse } from './utils/function-response';

const stripeUnsupportedCountries = [
  'AS',
  'CX',
  'CC',
  'CU',
  'HM',
  'IR',
  'KP',
  'MH',
  'FM',
  'NF',
  'MP',
  'PW',
  'SD',
  'SY',
  'UM',
  'VI',
];

const handler: Handler = async () => {
  let response;

  try {
    const {
      data: { countries },
    } = await axios.get('https://api.posta.sk/private/pricelist/config');
    response = countries
      .filter(
        (item: string) =>
          stripeUnsupportedCountries.indexOf(item.toUpperCase()) === -1,
      )
      .map((item: string) => item.toUpperCase());
  } catch (e) {
    return functionResponse({ statusCode: 500 });
  }

  return functionResponse({ response });
};

export { handler };

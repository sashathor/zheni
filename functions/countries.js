const axios = require('axios');
const functionResponse = require('./utils/function-response');

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

exports.handler = async () => {
  let response;

  try {
    const {
      data: { countries },
    } = await axios.get('https://api.posta.sk/private/pricelist/config');
    response = countries
      .filter(
        (item) => stripeUnsupportedCountries.indexOf(item.toUpperCase()) === -1,
      )
      .map((item) => item.toUpperCase());
  } catch (e) {
    return functionResponse({ statusCode: 500 });
  }

  return functionResponse({ response });
};

'use strict';

// Live smoke test using the generated Voxgig SDK. Never print credentials.
const { WeatherapiSDK } = require('../generated/weatherapi/ts/dist/WeatherapiSDK.js');

async function main() {
  const key = process.env.WEATHERAPI_APIKEY;
  if (!key) throw new Error('Missing WEATHERAPI_APIKEY secret');
  const client = new WeatherapiSDK({ apikey: key });
  // The upstream specification declares key as a required query argument.
  const entity = await client.Current().load({ key, q: 'London' });
  const value = entity.data();
  // Depending on the model's result transform this may be 'current' directly.
  if (!value || typeof value !== 'object') throw new Error('Missing parsed weather result');
  console.log('LIVE_SDK_REQUEST: PASS (authenticated response received and parsed)');
}

main().catch(() => {
  console.error('LIVE_SDK_REQUEST: FAILED (request or response validation; credentials hidden)');
  process.exitCode = 1;
});

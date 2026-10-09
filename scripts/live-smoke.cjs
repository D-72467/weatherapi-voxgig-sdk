'use strict';

// Live smoke test for the generated Voxgig SDK. No credential is printed.
const { WeatherapiSDK } = require('../generated/weatherapi/ts/dist/WeatherapiSDK.js');

async function main() {
  const apikey = process.env.WEATHERAPI_APIKEY;
  if (!apikey) {
    throw new Error('Missing WEATHERAPI_APIKEY repository secret');
  }
  const client = new WeatherapiSDK({ apikey });
  // The generator follows WeatherAPI's current weather endpoint.
  const result = await client.Current().load({ q: 'London' });
  const value = result?.data?.() ?? {};
  if (!value.location?.name || typeof value.current?.temp_c !== 'number') {
    throw new Error('Live SDK response did not contain expected location and temperature fields');
  }
  console.log('PASS: generated SDK made authenticated live current-weather request');
  console.log('Response shape verified: location.name and current.temp_c');
}

main().catch(() => {
  console.error('FAIL: live SDK smoke test. Check Actions logs without exposing your API key.');
  process.exitCode = 1;
});

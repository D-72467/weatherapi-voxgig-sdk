'use strict';

// Safe, bounded, read-only live integration checks against WeatherAPI.com.
// This exercises the generated Voxgig SDK, not direct HTTP/fetch.
// No API key, request URL, or raw error message is ever logged.
const assert = require('node:assert/strict');
const { WeatherapiSDK } = require('../generated/weatherapi/ts/dist/WeatherapiSDK.js');

const key = process.env.WEATHERAPI_APIKEY;
if (!key) {
  console.error('CONFIGURATION ERROR: WEATHERAPI_APIKEY repository secret is missing.');
  process.exit(2);
}

const client = new WeatherapiSDK({ apikey: key });
const yesterday = new Date(Date.now() - 86400_000).toISOString().slice(0, 10);
const today = new Date().toISOString().slice(0, 10);

const cases = [
  ['current', async () => {
    const v = (await client.Current().load({ key, q: 'London' })).data();
    assert.equal(typeof v?.temp_c, 'number', 'temp_c must be numeric');
    assert.equal(typeof v?.humidity, 'number', 'humidity must be numeric');
    assert.equal(typeof v?.condition?.text, 'string', 'condition.text must be text');
  }],
  ['forecast-2-day', async () => {
    const v = (await client.Forecast().load({ key, q: 'London', days: 2 })).data();
    assert.ok(Array.isArray(v?.forecastday) && v.forecastday.length >= 1, 'forecastday array required');
    assert.equal(typeof v.forecastday[0]?.day?.avgtemp_c, 'number', 'forecast temperature required');
  }],
  ['location-search', async () => {
    const list = await client.Search().list({ key, q: 'Lond' });
    assert.ok(Array.isArray(list) && list.length > 0, 'search must return results');
    const row = typeof list[0]?.data === 'function' ? list[0].data() : list[0];
    assert.equal(typeof row?.name, 'string', 'location name required');
    assert.equal(typeof row?.lat, 'number', 'latitude required');
  }],
  ['time-zone', async () => {
    const v = (await client.Timezone().load({ key, q: 'London' })).data();
    assert.equal(typeof v?.tz_id, 'string', 'time zone id required');
    assert.equal(typeof v?.localtime, 'string', 'local time required');
  }],
  ['astronomy', async () => {
    const v = (await client.Astronomy().load({ key, q: 'London', dt: today })).data();
    assert.equal(typeof v?.astro?.sunrise, 'string', 'sunrise required');
    assert.equal(typeof v?.astro?.sunset, 'string', 'sunset required');
  }],
  ['ip-lookup', async () => {
    const v = (await client.Ipn().load({ key, q: '8.8.8.8' })).data();
    assert.equal(typeof v?.country_name, 'string', 'country name required');
    assert.equal(typeof v?.tz_id, 'string', 'time zone id required');
  }],
  ['history-yesterday', async () => {
    const v = (await client.History().load({ key, q: 'London', dt: yesterday })).data();
    assert.ok(Array.isArray(v?.forecast?.forecastday) && v.forecast.forecastday.length, 'historical daily weather required');
    assert.equal(typeof v.forecast.forecastday[0]?.day?.avgtemp_c, 'number', 'historical average temperature required');
  }],
  ['invalid-key-rejected', async () => {
    const badKey = 'invalid_demo_key_0000000';
    const badClient = new WeatherapiSDK({ apikey: badKey });
    let rejected = false;
    try {
      const result = await badClient.Current().load({ key: badKey, q: 'London' });
      // If no exception was raised, an invalid key must still not yield valid weather.
      const value = typeof result?.data === 'function' ? result.data() : null;
      rejected = !value || typeof value?.temp_c !== 'number';
    } catch {
      rejected = true;
    }
    assert.equal(rejected, true, 'invalid credentials unexpectedly accepted');
  }],
];

async function main() {
  let failures = 0;
  for (const [name, check] of cases) {
    try {
      await check();
      console.log('PASS ' + name);
    } catch {
      failures += 1;
      console.error('FAIL ' + name + ' (details omitted to avoid exposing credentials or URLs)');
    }
  }
  console.log('SUMMARY ' + (cases.length - failures) + '/' + cases.length + ' live checks passed');
  if (failures) process.exitCode = 1;
}

main().catch(() => {
  console.error('LIVE_VALIDATION: unexpected failure; details suppressed');
  process.exitCode = 1;
});

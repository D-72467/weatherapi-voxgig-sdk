

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { WeatherapiSDK, BaseFeature, config, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


loadEnvLocal(__dirname + '/../../../.env.local')


describe('HistoryEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when WEATHERAPI_TEST_LIVE=TRUE.
  afterEach(liveDelay('WEATHERAPI_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = WeatherapiSDK.test()
    const ent = testsdk.History()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = WeatherapiSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.History().load({"aqi":1,"dt":"x","key":"x","q":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.WEATHERAPI_TEST_LIVE
    for (const op of ['load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'history.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"alerts":{"a":true,"h":"Alerts","n":"alerts","r":false,"t":"`$OBJECT`","key$":"alerts","index$":0},"current":{"a":true,"h":"Current","n":"current","r":false,"t":"`$OBJECT`","key$":"current","index$":1},"forecast":{"a":true,"h":"Forecast","n":"forecast","r":false,"t":"`$OBJECT`","key$":"forecast","index$":2},"location":{"a":true,"h":"Location","n":"location","r":false,"sh":"Location metadata returned with every weather response.","t":"`$OBJECT`","key$":"location","index$":3}},"name":"history","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /history.json","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"no","k":"query","n":"aqi","or":"aqi","r":false,"t":"`$STRING`","index$":0},{"a":true,"ex":"2023-01-01","k":"query","n":"dt","or":"dt","r":true,"t":"`$STRING`","index$":1},{"a":true,"k":"query","n":"end_dt","or":"end_dt","r":false,"t":"`$STRING`","index$":2},{"a":true,"k":"query","n":"et0","or":"et0","r":false,"t":"`$STRING`","index$":3},{"a":true,"k":"query","n":"hour","or":"hour","r":false,"t":"`$INTEGER`","index$":4},{"a":true,"ex":"YOUR_API_KEY","k":"query","n":"key","or":"key","r":true,"t":"`$STRING`","index$":5},{"a":true,"ex":"fr","k":"query","n":"lang","or":"lang","r":false,"t":"`$STRING`","index$":6},{"a":true,"ex":"no","k":"query","n":"pollen","or":"pollen","r":false,"t":"`$STRING`","index$":7},{"a":true,"ex":"London","k":"query","n":"q","or":"q","r":true,"t":"`$STRING`","index$":8},{"a":true,"k":"query","n":"solar","or":"solar","r":false,"t":"`$STRING`","index$":9},{"a":true,"k":"query","n":"tp","or":"tp","r":false,"t":"`$INTEGER`","index$":10},{"a":true,"ex":1490227200,"k":"query","n":"unixdt","or":"unixdt","r":false,"t":"`$INTEGER`","index$":11},{"a":true,"k":"query","n":"unixend_dt","or":"unixend_dt","r":false,"t":"`$INTEGER`","index$":12},{"a":true,"k":"query","n":"wind100kph","or":"wind100kph","r":false,"t":"`$STRING`","index$":13},{"a":true,"k":"query","n":"wind100mph","or":"wind100mph","r":false,"t":"`$STRING`","index$":14}]},"k":"http","m":"GET","o":"/history.json","q":{"exist":["dt","key","q"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"history.json"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"history","name__orig":"history","Name":"History","name_":"history","name-":"history","NAME":"HISTORY","index$":6}, {"active":true,"entity":"history","key$":"BasicHistoryFlow","kind":"basic","name":"BasicHistoryFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"history_ref01","srcdatavar":"history_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-history_ref01"}}]}]}, 'History', {"GET /history.json":{"protocol":"http","parameters":[{"name":"key","in":"query","required":true,"description":"Your WeatherAPI.com API key.","schema":{"type":"string","example":"YOUR_API_KEY"},"x-ref":"#/components/parameters/key","index$":0},{"name":"q","in":"query","required":true,"description":"Location query. Accepts: city name, lat/lon, US zip, UK postcode, Canada postal code, METAR code (metar:EGLL), IATA (iata:DXB), auto:ip, IPv4/IPv6, or location ID (id:2801268).","schema":{"type":"string","example":"London"},"x-ref":"#/components/parameters/q","index$":1},{"name":"dt","in":"query","required":true,"description":"Date on or after 2010-01-01 in yyyy-MM-dd format.","schema":{"type":"string","format":"date","example":"2023-01-01"},"index$":2},{"name":"unixdt","in":"query","required":false,"description":"Unix timestamp equivalent of `dt`. Do not pass both.","schema":{"type":"integer","example":1490227200},"x-ref":"#/components/parameters/unixdt","index$":3},{"name":"end_dt","in":"query","required":false,"description":"End date for range (Pro+ and above). Max 30 days range. yyyy-MM-dd.","schema":{"type":"string","format":"date"},"index$":4},{"name":"unixend_dt","in":"query","required":false,"description":"Unix timestamp equivalent of `end_dt`. Do not pass both.","schema":{"type":"integer"},"x-ref":"#/components/parameters/unixend_dt","index$":5},{"name":"hour","in":"query","required":false,"description":"Restrict output to a specific hour (0–23) in 24-hour format.","schema":{"type":"integer","minimum":0,"maximum":23},"x-ref":"#/components/parameters/hour","index$":6},{"name":"aqi","in":"query","required":false,"description":"Include Air Quality Index (AQI) data in response.","schema":{"type":"string","enum":["yes","no"],"default":"no"},"x-ref":"#/components/parameters/aqi","index$":7},{"name":"pollen","in":"query","required":false,"description":"Include pollen data. Available on Pro+ and above.","schema":{"type":"string","enum":["yes","no"],"default":"no"},"x-ref":"#/components/parameters/pollen","index$":8},{"name":"tp","in":"query","required":false,"description":"Interval for data. Use tp=15 for 15-minute intervals (Enterprise only).","schema":{"type":"integer","enum":[15]},"x-ref":"#/components/parameters/tp","index$":9},{"name":"lang","in":"query","required":false,"description":"Language code for condition text. E.g.: fr, de, es, zh, ar. See full list in docs.","schema":{"type":"string","example":"fr"},"x-ref":"#/components/parameters/lang","index$":10},{"name":"solar","in":"query","required":false,"description":"Include solar irradiance data in History API. Enterprise only.","schema":{"type":"string","enum":["yes","no"]},"x-ref":"#/components/parameters/solar","index$":11},{"name":"et0","in":"query","required":false,"description":"Include evapotranspiration data. Business and Enterprise only.","schema":{"type":"string","enum":["yes","no"]},"x-ref":"#/components/parameters/et0","index$":12},{"name":"wind100mph","in":"query","required":false,"description":"Include wind speed at 100m height in mph. Enterprise only.","schema":{"type":"string","enum":["yes","no"]},"x-ref":"#/components/parameters/wind100mph","index$":13},{"name":"wind100kph","in":"query","required":false,"description":"Include wind speed at 100m height in kph. Enterprise only.","schema":{"type":"string","enum":["yes","no"]},"x-ref":"#/components/parameters/wind100kph","index$":14}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let history_ref01_data = Object.values(setup.data.existing.history)[0] as any

    // LOAD
    const history_ref01_ent = client.History()
    const history_ref01_match_dt0: any = {}
    const history_ref01_data_dt0 = (await history_ref01_ent.load(history_ref01_match_dt0)).data()
    assert(null != history_ref01_data_dt0)


  })
})



// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true

function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/history/HistoryTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = WeatherapiSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['history01','history02','history03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'WEATHERAPI_TEST_HISTORY_ENTID': idmap,
    'WEATHERAPI_TEST_LIVE': 'FALSE',
    'WEATHERAPI_TEST_EXPLAIN': 'FALSE',
    'WEATHERAPI_APIKEY': '',
  })

  idmap = env['WEATHERAPI_TEST_HISTORY_ENTID']

  const live = 'TRUE' === env.WEATHERAPI_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['WEATHERAPI_TEST_HISTORY_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new WeatherapiSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {
        apikey: env.WEATHERAPI_APIKEY,
      },
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
      // last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey
      // and server values above and handed the SDK undefined. Harmless
      // while there was nothing in that object; not harmless now.
      extra || {},
      { system: { fetch: transport.fetch } }
    ]))
  }

  const setup = {
    idmap,
    env,
    options,
    client,
    struct,
    data: entityData,
    explain: 'TRUE' === env.WEATHERAPI_TEST_EXPLAIN,
    live,
    transport,
    now: Date.now(),
  }

  return setup
}
  

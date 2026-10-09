

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


describe('CurrentEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when WEATHERAPI_TEST_LIVE=TRUE.
  afterEach(liveDelay('WEATHERAPI_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = WeatherapiSDK.test()
    const ent = testsdk.Current()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = WeatherapiSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Current().load({"aqi":1,"key":"x","q":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.WEATHERAPI_TEST_LIVE
    for (const op of ['load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'current.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"current":{"a":true,"h":"Current","n":"current","r":false,"t":"`$OBJECT`","key$":"current","index$":0},"location":{"a":true,"h":"Location","n":"location","r":false,"sh":"Location metadata returned with every weather response.","t":"`$OBJECT`","key$":"location","index$":1}},"name":"current","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /current.json","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"no","k":"query","n":"aqi","or":"aqi","r":false,"t":"`$STRING`","index$":0},{"a":true,"k":"query","n":"current_field","or":"current_fields","r":false,"t":"`$STRING`","index$":1},{"a":true,"ex":"YOUR_API_KEY","k":"query","n":"key","or":"key","r":true,"t":"`$STRING`","index$":2},{"a":true,"ex":"fr","k":"query","n":"lang","or":"lang","r":false,"t":"`$STRING`","index$":3},{"a":true,"ex":"no","k":"query","n":"pollen","or":"pollen","r":false,"t":"`$STRING`","index$":4},{"a":true,"ex":"London","k":"query","n":"q","or":"q","r":true,"t":"`$STRING`","index$":5}]},"k":"http","m":"GET","o":"/current.json","q":{"exist":["key","q"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"current.json"}],"t":{"req":"`reqdata`","res":"`body.current`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"current","name__orig":"current","Name":"Current","name_":"current","name-":"current","NAME":"CURRENT","index$":3}, {"active":true,"entity":"current","key$":"BasicCurrentFlow","kind":"basic","name":"BasicCurrentFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"current_ref01","srcdatavar":"current_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-current_ref01"}}]}]}, 'Current', {"GET /current.json":{"protocol":"http","parameters":[{"name":"key","in":"query","required":true,"description":"Your WeatherAPI.com API key.","schema":{"type":"string","example":"YOUR_API_KEY"},"x-ref":"#/components/parameters/key","index$":0},{"name":"q","in":"query","required":true,"description":"Location query. Accepts: city name, lat/lon, US zip, UK postcode, Canada postal code, METAR code (metar:EGLL), IATA (iata:DXB), auto:ip, IPv4/IPv6, or location ID (id:2801268).","schema":{"type":"string","example":"London"},"x-ref":"#/components/parameters/q","index$":1},{"name":"aqi","in":"query","required":false,"description":"Include Air Quality Index (AQI) data in response.","schema":{"type":"string","enum":["yes","no"],"default":"no"},"x-ref":"#/components/parameters/aqi","index$":2},{"name":"pollen","in":"query","required":false,"description":"Include pollen data. Available on Pro+ and above.","schema":{"type":"string","enum":["yes","no"],"default":"no"},"x-ref":"#/components/parameters/pollen","index$":3},{"name":"lang","in":"query","required":false,"description":"Language code for condition text. E.g.: fr, de, es, zh, ar. See full list in docs.","schema":{"type":"string","example":"fr"},"x-ref":"#/components/parameters/lang","index$":4},{"name":"current_fields","in":"query","required":false,"description":"Comma-separated list of fields to return in the current element, e.g. temp_c,wind_mph.","schema":{"type":"string"},"x-ref":"#/components/parameters/current_fields","index$":5}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let current_ref01_data = Object.values(setup.data.existing.current)[0] as any

    // LOAD
    const current_ref01_ent = client.Current()
    const current_ref01_match_dt0: any = {}
    const current_ref01_data_dt0 = (await current_ref01_ent.load(current_ref01_match_dt0)).data()
    assert(null != current_ref01_data_dt0)


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
      '../../../../.sdk/test/entity/current/CurrentTestData.json')

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
    ['current01','current02','current03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'WEATHERAPI_TEST_CURRENT_ENTID': idmap,
    'WEATHERAPI_TEST_LIVE': 'FALSE',
    'WEATHERAPI_TEST_EXPLAIN': 'FALSE',
    'WEATHERAPI_APIKEY': '',
  })

  idmap = env['WEATHERAPI_TEST_CURRENT_ENTID']

  const live = 'TRUE' === env.WEATHERAPI_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['WEATHERAPI_TEST_CURRENT_ENTID']
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
  

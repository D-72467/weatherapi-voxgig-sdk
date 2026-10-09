

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


describe('MarineEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when WEATHERAPI_TEST_LIVE=TRUE.
  afterEach(liveDelay('WEATHERAPI_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = WeatherapiSDK.test()
    const ent = testsdk.Marine()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = WeatherapiSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Marine().load({"day":"x","key":"x","q":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.WEATHERAPI_TEST_LIVE
    for (const op of ['load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'marine.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"forecast":{"a":true,"h":"Forecast","n":"forecast","r":false,"t":"`$OBJECT`","key$":"forecast","index$":0},"location":{"a":true,"h":"Location","n":"location","r":false,"sh":"Location metadata returned with every weather response.","t":"`$OBJECT`","key$":"location","index$":1}},"name":"marine","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /marine.json","source":"openapi3","version":2},"g":{"query":[{"a":true,"k":"query","n":"day","or":"days","r":true,"t":"`$INTEGER`","index$":0},{"a":true,"k":"query","n":"dt","or":"dt","r":false,"t":"`$STRING`","index$":1},{"a":true,"k":"query","n":"hour","or":"hour","r":false,"t":"`$INTEGER`","index$":2},{"a":true,"ex":"YOUR_API_KEY","k":"query","n":"key","or":"key","r":true,"t":"`$STRING`","index$":3},{"a":true,"ex":"London","k":"query","n":"q","or":"q","r":true,"t":"`$STRING`","index$":4},{"a":true,"k":"query","n":"tide","or":"tides","r":false,"t":"`$STRING`","index$":5}]},"k":"http","m":"GET","o":"/marine.json","q":{"exist":["day","key","q"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"marine.json"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"marine","name__orig":"marine","Name":"Marine","name_":"marine","name-":"marine","NAME":"MARINE","index$":8}, {"active":true,"entity":"marine","key$":"BasicMarineFlow","kind":"basic","name":"BasicMarineFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"marine_ref01","srcdatavar":"marine_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-marine_ref01"}}]}]}, 'Marine', {"GET /marine.json":{"protocol":"http","parameters":[{"name":"key","in":"query","required":true,"description":"Your WeatherAPI.com API key.","schema":{"type":"string","example":"YOUR_API_KEY"},"x-ref":"#/components/parameters/key","index$":0},{"name":"q","in":"query","required":true,"description":"Location query. Accepts: city name, lat/lon, US zip, UK postcode, Canada postal code, METAR code (metar:EGLL), IATA (iata:DXB), auto:ip, IPv4/IPv6, or location ID (id:2801268).","schema":{"type":"string","example":"London"},"x-ref":"#/components/parameters/q","index$":1},{"name":"days","in":"query","required":true,"description":"Number of forecast days (1–7 depending on plan).","schema":{"type":"integer","minimum":1,"maximum":7},"index$":2},{"name":"dt","in":"query","required":false,"description":"Restrict date output in yyyy-MM-dd format.","schema":{"type":"string","format":"date"},"x-ref":"#/components/parameters/dt","index$":3},{"name":"hour","in":"query","required":false,"description":"Restrict output to a specific hour (0–23) in 24-hour format.","schema":{"type":"integer","minimum":0,"maximum":23},"x-ref":"#/components/parameters/hour","index$":4},{"name":"tides","in":"query","required":false,"description":"Enable/disable tide data (Pro+ and above).","schema":{"type":"string","enum":["yes","no"]},"index$":5}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let marine_ref01_data = Object.values(setup.data.existing.marine)[0] as any

    // LOAD
    const marine_ref01_ent = client.Marine()
    const marine_ref01_match_dt0: any = {}
    const marine_ref01_data_dt0 = (await marine_ref01_ent.load(marine_ref01_match_dt0)).data()
    assert(null != marine_ref01_data_dt0)


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
      '../../../../.sdk/test/entity/marine/MarineTestData.json')

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
    ['marine01','marine02','marine03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'WEATHERAPI_TEST_MARINE_ENTID': idmap,
    'WEATHERAPI_TEST_LIVE': 'FALSE',
    'WEATHERAPI_TEST_EXPLAIN': 'FALSE',
    'WEATHERAPI_APIKEY': '',
  })

  idmap = env['WEATHERAPI_TEST_MARINE_ENTID']

  const live = 'TRUE' === env.WEATHERAPI_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['WEATHERAPI_TEST_MARINE_ENTID']
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
  

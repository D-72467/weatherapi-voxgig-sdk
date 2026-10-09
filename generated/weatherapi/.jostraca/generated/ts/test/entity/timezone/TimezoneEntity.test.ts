

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


describe('TimezoneEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when WEATHERAPI_TEST_LIVE=TRUE.
  afterEach(liveDelay('WEATHERAPI_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = WeatherapiSDK.test()
    const ent = testsdk.Timezone()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = WeatherapiSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Timezone().load({"key":1,"q":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.WEATHERAPI_TEST_LIVE
    for (const op of ['load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'timezone.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"country":{"a":true,"h":"Country","n":"country","r":false,"sh":"Country name","t":"`$STRING`","key$":"country","index$":0},"lat":{"a":true,"fo":"float","h":"Lat","n":"lat","r":false,"sh":"Latitude","t":"`$NUMBER`","key$":"lat","index$":1},"localtime":{"a":true,"h":"Localtime","n":"localtime","r":false,"sh":"Local date and time string","t":"`$STRING`","key$":"localtime","index$":2},"localtime_epoch":{"a":true,"h":"Localtime Epoch","n":"localtime_epoch","r":false,"sh":"Local time as Unix epoch","t":"`$INTEGER`","key$":"localtime_epoch","index$":3},"lon":{"a":true,"fo":"float","h":"Lon","n":"lon","r":false,"sh":"Longitude","t":"`$NUMBER`","key$":"lon","index$":4},"name":{"a":true,"h":"Name","n":"name","r":false,"sh":"Location name","t":"`$STRING`","key$":"name","index$":5},"region":{"a":true,"h":"Region","n":"region","r":false,"sh":"Region or state","t":"`$STRING`","key$":"region","index$":6},"tz_id":{"a":true,"h":"Tz Id","n":"tz_id","r":false,"sh":"IANA timezone ID, e.g.","t":"`$STRING`","key$":"tz_id","index$":7}},"name":"timezone","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /timezone.json","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"YOUR_API_KEY","k":"query","n":"key","or":"key","r":true,"t":"`$STRING`","index$":0},{"a":true,"ex":"London","k":"query","n":"q","or":"q","r":true,"t":"`$STRING`","index$":1}]},"k":"http","m":"GET","o":"/timezone.json","q":{"exist":["key","q"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"timezone.json"}],"t":{"req":"`reqdata`","res":"`body.location`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"timezone","name__orig":"timezone","Name":"Timezone","name_":"timezone","name-":"timezone","NAME":"TIMEZONE","index$":12}, {"active":true,"entity":"timezone","key$":"BasicTimezoneFlow","kind":"basic","name":"BasicTimezoneFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"timezone_ref01","srcdatavar":"timezone_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-timezone_ref01"}}]}]}, 'Timezone', {"GET /timezone.json":{"protocol":"http","parameters":[{"name":"key","in":"query","required":true,"description":"Your WeatherAPI.com API key.","schema":{"type":"string","example":"YOUR_API_KEY"},"x-ref":"#/components/parameters/key","index$":0},{"name":"q","in":"query","required":true,"description":"Location query. Accepts: city name, lat/lon, US zip, UK postcode, Canada postal code, METAR code (metar:EGLL), IATA (iata:DXB), auto:ip, IPv4/IPv6, or location ID (id:2801268).","schema":{"type":"string","example":"London"},"x-ref":"#/components/parameters/q","index$":1}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let timezone_ref01_data = Object.values(setup.data.existing.timezone)[0] as any

    // LOAD
    const timezone_ref01_ent = client.Timezone()
    const timezone_ref01_match_dt0: any = {}
    const timezone_ref01_data_dt0 = (await timezone_ref01_ent.load(timezone_ref01_match_dt0)).data()
    assert(null != timezone_ref01_data_dt0)


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
      '../../../../.sdk/test/entity/timezone/TimezoneTestData.json')

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
    ['timezone01','timezone02','timezone03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'WEATHERAPI_TEST_TIMEZONE_ENTID': idmap,
    'WEATHERAPI_TEST_LIVE': 'FALSE',
    'WEATHERAPI_TEST_EXPLAIN': 'FALSE',
    'WEATHERAPI_APIKEY': '',
  })

  idmap = env['WEATHERAPI_TEST_TIMEZONE_ENTID']

  const live = 'TRUE' === env.WEATHERAPI_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['WEATHERAPI_TEST_TIMEZONE_ENTID']
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
  

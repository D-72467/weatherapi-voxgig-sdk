

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


describe('IpnEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when WEATHERAPI_TEST_LIVE=TRUE.
  afterEach(liveDelay('WEATHERAPI_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = WeatherapiSDK.test()
    const ent = testsdk.Ipn()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = WeatherapiSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Ipn().load({"key":1,"q":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.WEATHERAPI_TEST_LIVE
    for (const op of ['load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'ipn.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"city":{"a":true,"h":"City","n":"city","r":false,"t":"`$STRING`","key$":"city","index$":0},"continent_code":{"a":true,"h":"Continent Code","n":"continent_code","r":false,"t":"`$STRING`","key$":"continent_code","index$":1},"continent_name":{"a":true,"h":"Continent Name","n":"continent_name","r":false,"t":"`$STRING`","key$":"continent_name","index$":2},"country_code":{"a":true,"h":"Country Code","n":"country_code","r":false,"t":"`$STRING`","key$":"country_code","index$":3},"country_name":{"a":true,"h":"Country Name","n":"country_name","r":false,"t":"`$STRING`","key$":"country_name","index$":4},"geoname_id":{"a":true,"h":"Geoname Id","n":"geoname_id","r":false,"t":"`$STRING`","key$":"geoname_id","index$":5},"ip":{"a":true,"h":"Ip","n":"ip","r":false,"t":"`$STRING`","key$":"ip","index$":6},"is_eu":{"a":true,"h":"Is Eu","n":"is_eu","r":false,"t":"`$BOOLEAN`","key$":"is_eu","index$":7},"lat":{"a":true,"h":"Lat","n":"lat","r":false,"t":"`$NUMBER`","key$":"lat","index$":8},"localtime":{"a":true,"h":"Localtime","n":"localtime","r":false,"t":"`$STRING`","key$":"localtime","index$":9},"localtime_epoch":{"a":true,"h":"Localtime Epoch","n":"localtime_epoch","r":false,"t":"`$INTEGER`","key$":"localtime_epoch","index$":10},"lon":{"a":true,"h":"Lon","n":"lon","r":false,"t":"`$NUMBER`","key$":"lon","index$":11},"region":{"a":true,"h":"Region","n":"region","r":false,"t":"`$STRING`","key$":"region","index$":12},"type":{"a":true,"h":"Type","n":"type","r":false,"t":"`$STRING`","key$":"type","index$":13},"tz_id":{"a":true,"h":"Tz Id","n":"tz_id","r":false,"t":"`$STRING`","key$":"tz_id","index$":14}},"name":"ipn","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /ip.json","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"YOUR_API_KEY","k":"query","n":"key","or":"key","r":true,"t":"`$STRING`","index$":0},{"a":true,"ex":"auto:ip","k":"query","n":"q","or":"q","r":true,"t":"`$STRING`","index$":1}]},"k":"http","m":"GET","o":"/ip.json","q":{"exist":["key","q"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"ip.json"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"ipn","name__orig":"ipn","Name":"Ipn","name_":"ipn","name-":"ipn","NAME":"IPN","index$":7}, {"active":true,"entity":"ipn","key$":"BasicIpnFlow","kind":"basic","name":"BasicIpnFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"ipn_ref01","srcdatavar":"ipn_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-ipn_ref01"}}]}]}, 'Ipn', {"GET /ip.json":{"protocol":"http","parameters":[{"name":"key","in":"query","required":true,"description":"Your WeatherAPI.com API key.","schema":{"type":"string","example":"YOUR_API_KEY"},"x-ref":"#/components/parameters/key","index$":0},{"name":"q","in":"query","required":true,"description":"IPv4, IPv6 address, or `auto:ip` for caller's IP.","schema":{"type":"string","example":"auto:ip"},"index$":1}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let ipn_ref01_data = Object.values(setup.data.existing.ipn)[0] as any

    // LOAD
    const ipn_ref01_ent = client.Ipn()
    const ipn_ref01_match_dt0: any = {}
    const ipn_ref01_data_dt0 = (await ipn_ref01_ent.load(ipn_ref01_match_dt0)).data()
    assert(null != ipn_ref01_data_dt0)


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
      '../../../../.sdk/test/entity/ipn/IpnTestData.json')

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
    ['ipn01','ipn02','ipn03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'WEATHERAPI_TEST_IPN_ENTID': idmap,
    'WEATHERAPI_TEST_LIVE': 'FALSE',
    'WEATHERAPI_TEST_EXPLAIN': 'FALSE',
    'WEATHERAPI_APIKEY': '',
  })

  idmap = env['WEATHERAPI_TEST_IPN_ENTID']

  const live = 'TRUE' === env.WEATHERAPI_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['WEATHERAPI_TEST_IPN_ENTID']
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
  



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


describe('SolarEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when WEATHERAPI_TEST_LIVE=TRUE.
  afterEach(liveDelay('WEATHERAPI_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = WeatherapiSDK.test()
    const ent = testsdk.Solar()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = WeatherapiSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Solar().load({"albedo":"x","capacity_kw":1,"key":"x","q":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.WEATHERAPI_TEST_LIVE
    for (const op of ['load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'solar.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"forecast":{"a":true,"h":"Forecast","n":"forecast","r":false,"t":"`$OBJECT`","key$":"forecast","index$":0},"location":{"a":true,"h":"Location","n":"location","r":false,"sh":"Location metadata returned with every weather response.","t":"`$OBJECT`","key$":"location","index$":1},"system":{"a":true,"h":"System","n":"system","r":false,"sh":"Settings used for the calculation, including any defaults applied.","t":"`$OBJECT`","key$":"system","index$":2}},"name":"solar","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /solar.json","source":"openapi3","version":2},"g":{"query":[{"a":true,"k":"query","n":"albedo","or":"albedo","r":false,"t":"`$NUMBER`","index$":0},{"a":true,"k":"query","n":"azimuth","or":"azimuth","r":false,"t":"`$NUMBER`","index$":1},{"a":true,"ex":4,"k":"query","n":"capacity_kw","or":"capacity_kw","r":true,"t":"`$NUMBER`","index$":2},{"a":true,"k":"query","n":"day","or":"days","r":false,"t":"`$INTEGER`","index$":3},{"a":true,"k":"query","n":"inverter_eff","or":"inverter_eff","r":false,"t":"`$NUMBER`","index$":4},{"a":true,"k":"query","n":"inverter_kw","or":"inverter_kw","r":false,"t":"`$NUMBER`","index$":5},{"a":true,"ex":"YOUR_API_KEY","k":"query","n":"key","or":"key","r":true,"t":"`$STRING`","index$":6},{"a":true,"k":"query","n":"loss","or":"losses","r":false,"t":"`$NUMBER`","index$":7},{"a":true,"k":"query","n":"module_type","or":"module_type","r":false,"t":"`$STRING`","index$":8},{"a":true,"ex":"London","k":"query","n":"q","or":"q","r":true,"t":"`$STRING`","index$":9},{"a":true,"k":"query","n":"tilt","or":"tilt","r":false,"t":"`$NUMBER`","index$":10},{"a":true,"k":"query","n":"tracking","or":"tracking","r":false,"t":"`$STRING`","index$":11}]},"k":"http","m":"GET","o":"/solar.json","q":{"exist":["capacity_kw","key","q"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"solar.json"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"solar","name__orig":"solar","Name":"Solar","name_":"solar","name-":"solar","NAME":"SOLAR","index$":10}, {"active":true,"entity":"solar","key$":"BasicSolarFlow","kind":"basic","name":"BasicSolarFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"solar_ref01","srcdatavar":"solar_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-solar_ref01"}}]}]}, 'Solar', {"GET /solar.json":{"protocol":"http","parameters":[{"name":"key","in":"query","required":true,"description":"Your WeatherAPI.com API key.","schema":{"type":"string","example":"YOUR_API_KEY"},"x-ref":"#/components/parameters/key","index$":0},{"name":"q","in":"query","required":true,"description":"Location query. Accepts: city name, lat/lon, US zip, UK postcode, Canada postal code, METAR code (metar:EGLL), IATA (iata:DXB), auto:ip, IPv4/IPv6, or location ID (id:2801268).","schema":{"type":"string","example":"London"},"x-ref":"#/components/parameters/q","index$":1},{"name":"days","in":"query","required":false,"description":"Number of forecast days (1–14). Default 1.","schema":{"type":"integer","minimum":1,"maximum":14},"index$":2},{"name":"capacity_kw","in":"query","required":true,"description":"Array (DC) size in kWp. Must be greater than 0.","schema":{"type":"number","exclusiveMinimum":0,"example":4},"index$":3},{"name":"tilt","in":"query","required":false,"description":"Panel tilt in degrees from horizontal. Default: absolute latitude.","schema":{"type":"number","minimum":0,"maximum":90},"index$":4},{"name":"azimuth","in":"query","required":false,"description":"Panel azimuth in degrees clockwise from north (180 = south). Default 180 in the northern hemisphere, 0 in the southern.","schema":{"type":"number","minimum":0,"maximum":360},"index$":5},{"name":"tracking","in":"query","required":false,"description":"Mounting type. Default fixed.","schema":{"type":"string","enum":["fixed","single_axis","dual_axis"]},"index$":6},{"name":"module_type","in":"query","required":false,"description":"Module type (sets temperature coefficient). Default standard.","schema":{"type":"string","enum":["standard","premium","thin_film"]},"index$":7},{"name":"losses","in":"query","required":false,"description":"System losses in %. Default 14.","schema":{"type":"number","minimum":0,"exclusiveMaximum":100},"index$":8},{"name":"inverter_kw","in":"query","required":false,"description":"Inverter AC rating in kW. Default capacity_kw / 1.2.","schema":{"type":"number","exclusiveMinimum":0},"index$":9},{"name":"inverter_eff","in":"query","required":false,"description":"Inverter efficiency in %. Default 96.","schema":{"type":"number","exclusiveMinimum":0,"maximum":100},"index$":10},{"name":"albedo","in":"query","required":false,"description":"Ground reflectance. Default 0.2.","schema":{"type":"number","minimum":0,"maximum":1},"index$":11}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let solar_ref01_data = Object.values(setup.data.existing.solar)[0] as any

    // LOAD
    const solar_ref01_ent = client.Solar()
    const solar_ref01_match_dt0: any = {}
    const solar_ref01_data_dt0 = (await solar_ref01_ent.load(solar_ref01_match_dt0)).data()
    assert(null != solar_ref01_data_dt0)


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
      '../../../../.sdk/test/entity/solar/SolarTestData.json')

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
    ['solar01','solar02','solar03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'WEATHERAPI_TEST_SOLAR_ENTID': idmap,
    'WEATHERAPI_TEST_LIVE': 'FALSE',
    'WEATHERAPI_TEST_EXPLAIN': 'FALSE',
    'WEATHERAPI_APIKEY': '',
  })

  idmap = env['WEATHERAPI_TEST_SOLAR_ENTID']

  const live = 'TRUE' === env.WEATHERAPI_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['WEATHERAPI_TEST_SOLAR_ENTID']
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
  

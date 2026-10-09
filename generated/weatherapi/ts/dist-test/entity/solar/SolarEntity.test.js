"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const Fs = __importStar(require("node:fs"));
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const live_runner_1 = require("../../live-runner");
const live_entity_1 = require("../../live-entity");
const __1 = require("../../..");
const utility_1 = require("../../utility");
(0, utility_1.loadEnvLocal)(__dirname + '/../../../.env.local');
(0, node_test_1.describe)('SolarEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when WEATHERAPI_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('WEATHERAPI_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.WeatherapiSDK.test();
        const ent = testsdk.Solar();
        (0, node_assert_1.default)(null != ent);
    });
    (0, node_test_1.test)('validate', async (t) => {
        if (null == __1.config.feature?.validate) {
            t.skip('feature not present in this SDK: validate');
            return;
        }
        const client = __1.WeatherapiSDK.test(undefined, { feature: { validate: { active: true } } });
        await node_assert_1.default.rejects(client.Solar().load({ "albedo": "x", "capacity_kw": 1, "key": "x", "q": "x" }), (err) => 'validate_failed' === err.code);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.WEATHERAPI_TEST_LIVE;
        for (const op of ['load']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'solar.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "forecast": { "a": true, "h": "Forecast", "n": "forecast", "r": false, "t": "`$OBJECT`", "key$": "forecast", "index$": 0 }, "location": { "a": true, "h": "Location", "n": "location", "r": false, "sh": "Location metadata returned with every weather response.", "t": "`$OBJECT`", "key$": "location", "index$": 1 }, "system": { "a": true, "h": "System", "n": "system", "r": false, "sh": "Settings used for the calculation, including any defaults applied.", "t": "`$OBJECT`", "key$": "system", "index$": 2 } }, "name": "solar", "op": { "load": { "input": "data", "name": "load", "points": [{ "a": true, "co": { "id": "GET /solar.json", "source": "openapi3", "version": 2 }, "g": { "query": [{ "a": true, "k": "query", "n": "albedo", "or": "albedo", "r": false, "t": "`$NUMBER`", "index$": 0 }, { "a": true, "k": "query", "n": "azimuth", "or": "azimuth", "r": false, "t": "`$NUMBER`", "index$": 1 }, { "a": true, "ex": 4, "k": "query", "n": "capacity_kw", "or": "capacity_kw", "r": true, "t": "`$NUMBER`", "index$": 2 }, { "a": true, "k": "query", "n": "day", "or": "days", "r": false, "t": "`$INTEGER`", "index$": 3 }, { "a": true, "k": "query", "n": "inverter_eff", "or": "inverter_eff", "r": false, "t": "`$NUMBER`", "index$": 4 }, { "a": true, "k": "query", "n": "inverter_kw", "or": "inverter_kw", "r": false, "t": "`$NUMBER`", "index$": 5 }, { "a": true, "ex": "YOUR_API_KEY", "k": "query", "n": "key", "or": "key", "r": true, "t": "`$STRING`", "index$": 6 }, { "a": true, "k": "query", "n": "loss", "or": "losses", "r": false, "t": "`$NUMBER`", "index$": 7 }, { "a": true, "k": "query", "n": "module_type", "or": "module_type", "r": false, "t": "`$STRING`", "index$": 8 }, { "a": true, "ex": "London", "k": "query", "n": "q", "or": "q", "r": true, "t": "`$STRING`", "index$": 9 }, { "a": true, "k": "query", "n": "tilt", "or": "tilt", "r": false, "t": "`$NUMBER`", "index$": 10 }, { "a": true, "k": "query", "n": "tracking", "or": "tracking", "r": false, "t": "`$STRING`", "index$": 11 }] }, "k": "http", "m": "GET", "o": "/solar.json", "q": { "exist": ["capacity_kw", "key", "q"] }, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "solar.json" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "load" } }, "relations": { "ancestors": [] }, "key$": "solar", "name__orig": "solar", "Name": "Solar", "name_": "solar", "name-": "solar", "NAME": "SOLAR", "index$": 10 }, { "active": true, "entity": "solar", "key$": "BasicSolarFlow", "kind": "basic", "name": "BasicSolarFlow", "param": {}, "step": [{ "a": true, "d": {}, "i": { "ref": "solar_ref01", "srcdatavar": "solar_ref01_data", "suffix": "_dt0" }, "m": {}, "o": "load", "s": [], "v": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-solar_ref01" } }] }] }, 'Solar', { "GET /solar.json": { "protocol": "http", "parameters": [{ "name": "key", "in": "query", "required": true, "description": "Your WeatherAPI.com API key.", "schema": { "type": "string", "example": "YOUR_API_KEY" }, "x-ref": "#/components/parameters/key", "index$": 0 }, { "name": "q", "in": "query", "required": true, "description": "Location query. Accepts: city name, lat/lon, US zip, UK postcode, Canada postal code, METAR code (metar:EGLL), IATA (iata:DXB), auto:ip, IPv4/IPv6, or location ID (id:2801268).", "schema": { "type": "string", "example": "London" }, "x-ref": "#/components/parameters/q", "index$": 1 }, { "name": "days", "in": "query", "required": false, "description": "Number of forecast days (1–14). Default 1.", "schema": { "type": "integer", "minimum": 1, "maximum": 14 }, "index$": 2 }, { "name": "capacity_kw", "in": "query", "required": true, "description": "Array (DC) size in kWp. Must be greater than 0.", "schema": { "type": "number", "exclusiveMinimum": 0, "example": 4 }, "index$": 3 }, { "name": "tilt", "in": "query", "required": false, "description": "Panel tilt in degrees from horizontal. Default: absolute latitude.", "schema": { "type": "number", "minimum": 0, "maximum": 90 }, "index$": 4 }, { "name": "azimuth", "in": "query", "required": false, "description": "Panel azimuth in degrees clockwise from north (180 = south). Default 180 in the northern hemisphere, 0 in the southern.", "schema": { "type": "number", "minimum": 0, "maximum": 360 }, "index$": 5 }, { "name": "tracking", "in": "query", "required": false, "description": "Mounting type. Default fixed.", "schema": { "type": "string", "enum": ["fixed", "single_axis", "dual_axis"] }, "index$": 6 }, { "name": "module_type", "in": "query", "required": false, "description": "Module type (sets temperature coefficient). Default standard.", "schema": { "type": "string", "enum": ["standard", "premium", "thin_film"] }, "index$": 7 }, { "name": "losses", "in": "query", "required": false, "description": "System losses in %. Default 14.", "schema": { "type": "number", "minimum": 0, "exclusiveMaximum": 100 }, "index$": 8 }, { "name": "inverter_kw", "in": "query", "required": false, "description": "Inverter AC rating in kW. Default capacity_kw / 1.2.", "schema": { "type": "number", "exclusiveMinimum": 0 }, "index$": 9 }, { "name": "inverter_eff", "in": "query", "required": false, "description": "Inverter efficiency in %. Default 96.", "schema": { "type": "number", "exclusiveMinimum": 0, "maximum": 100 }, "index$": 10 }, { "name": "albedo", "in": "query", "required": false, "description": "Ground reflectance. Default 0.2.", "schema": { "type": "number", "minimum": 0, "maximum": 1 }, "index$": 11 }] } }, { strict: LIVE_STRICT, t });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        let solar_ref01_data = Object.values(setup.data.existing.solar)[0];
        // LOAD
        const solar_ref01_ent = client.Solar();
        const solar_ref01_match_dt0 = {};
        const solar_ref01_data_dt0 = (await solar_ref01_ent.load(solar_ref01_match_dt0)).data();
        (0, node_assert_1.default)(null != solar_ref01_data_dt0);
    });
});
// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true;
function basicSetup(extra) {
    // TODO: fix test def options
    const options = {}; // null
    // TODO: needs test utility to resolve path
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/solar/SolarTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.WeatherapiSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['solar01', 'solar02', 'solar03'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'WEATHERAPI_TEST_SOLAR_ENTID': idmap,
        'WEATHERAPI_TEST_LIVE': 'FALSE',
        'WEATHERAPI_TEST_EXPLAIN': 'FALSE',
        'WEATHERAPI_APIKEY': '',
    });
    idmap = env['WEATHERAPI_TEST_SOLAR_ENTID'];
    const live = 'TRUE' === env.WEATHERAPI_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['WEATHERAPI_TEST_SOLAR_ENTID'];
        idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {};
        if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
            throw new Error('Live ENTID must be a JSON object');
        }
        client = new __1.WeatherapiSDK(merge([
            // FIRST, so the generated fields below win: sdk-test-control.json's
            // test.client.options adds to the live client, it does not redirect it.
            (0, utility_1.liveClientOptions)(),
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
        ]));
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
    };
    return setup;
}
//# sourceMappingURL=SolarEntity.test.js.map
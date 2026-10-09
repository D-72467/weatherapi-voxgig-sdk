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
(0, node_test_1.describe)('CurrentEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when WEATHERAPI_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('WEATHERAPI_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.WeatherapiSDK.test();
        const ent = testsdk.Current();
        (0, node_assert_1.default)(null != ent);
    });
    (0, node_test_1.test)('validate', async (t) => {
        if (null == __1.config.feature?.validate) {
            t.skip('feature not present in this SDK: validate');
            return;
        }
        const client = __1.WeatherapiSDK.test(undefined, { feature: { validate: { active: true } } });
        await node_assert_1.default.rejects(client.Current().load({ "aqi": 1, "key": "x", "q": "x" }), (err) => 'validate_failed' === err.code);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.WEATHERAPI_TEST_LIVE;
        for (const op of ['load']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'current.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "current": { "a": true, "h": "Current", "n": "current", "r": false, "t": "`$OBJECT`", "key$": "current", "index$": 0 }, "location": { "a": true, "h": "Location", "n": "location", "r": false, "sh": "Location metadata returned with every weather response.", "t": "`$OBJECT`", "key$": "location", "index$": 1 } }, "name": "current", "op": { "load": { "input": "data", "name": "load", "points": [{ "a": true, "co": { "id": "GET /current.json", "source": "openapi3", "version": 2 }, "g": { "query": [{ "a": true, "ex": "no", "k": "query", "n": "aqi", "or": "aqi", "r": false, "t": "`$STRING`", "index$": 0 }, { "a": true, "k": "query", "n": "current_field", "or": "current_fields", "r": false, "t": "`$STRING`", "index$": 1 }, { "a": true, "ex": "YOUR_API_KEY", "k": "query", "n": "key", "or": "key", "r": true, "t": "`$STRING`", "index$": 2 }, { "a": true, "ex": "fr", "k": "query", "n": "lang", "or": "lang", "r": false, "t": "`$STRING`", "index$": 3 }, { "a": true, "ex": "no", "k": "query", "n": "pollen", "or": "pollen", "r": false, "t": "`$STRING`", "index$": 4 }, { "a": true, "ex": "London", "k": "query", "n": "q", "or": "q", "r": true, "t": "`$STRING`", "index$": 5 }] }, "k": "http", "m": "GET", "o": "/current.json", "q": { "exist": ["key", "q"] }, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "current.json" }], "t": { "req": "`reqdata`", "res": "`body.current`" }, "index$": 0 }], "key$": "load" } }, "relations": { "ancestors": [] }, "key$": "current", "name__orig": "current", "Name": "Current", "name_": "current", "name-": "current", "NAME": "CURRENT", "index$": 3 }, { "active": true, "entity": "current", "key$": "BasicCurrentFlow", "kind": "basic", "name": "BasicCurrentFlow", "param": {}, "step": [{ "a": true, "d": {}, "i": { "ref": "current_ref01", "srcdatavar": "current_ref01_data", "suffix": "_dt0" }, "m": {}, "o": "load", "s": [], "v": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-current_ref01" } }] }] }, 'Current', { "GET /current.json": { "protocol": "http", "parameters": [{ "name": "key", "in": "query", "required": true, "description": "Your WeatherAPI.com API key.", "schema": { "type": "string", "example": "YOUR_API_KEY" }, "x-ref": "#/components/parameters/key", "index$": 0 }, { "name": "q", "in": "query", "required": true, "description": "Location query. Accepts: city name, lat/lon, US zip, UK postcode, Canada postal code, METAR code (metar:EGLL), IATA (iata:DXB), auto:ip, IPv4/IPv6, or location ID (id:2801268).", "schema": { "type": "string", "example": "London" }, "x-ref": "#/components/parameters/q", "index$": 1 }, { "name": "aqi", "in": "query", "required": false, "description": "Include Air Quality Index (AQI) data in response.", "schema": { "type": "string", "enum": ["yes", "no"], "default": "no" }, "x-ref": "#/components/parameters/aqi", "index$": 2 }, { "name": "pollen", "in": "query", "required": false, "description": "Include pollen data. Available on Pro+ and above.", "schema": { "type": "string", "enum": ["yes", "no"], "default": "no" }, "x-ref": "#/components/parameters/pollen", "index$": 3 }, { "name": "lang", "in": "query", "required": false, "description": "Language code for condition text. E.g.: fr, de, es, zh, ar. See full list in docs.", "schema": { "type": "string", "example": "fr" }, "x-ref": "#/components/parameters/lang", "index$": 4 }, { "name": "current_fields", "in": "query", "required": false, "description": "Comma-separated list of fields to return in the current element, e.g. temp_c,wind_mph.", "schema": { "type": "string" }, "x-ref": "#/components/parameters/current_fields", "index$": 5 }] } }, { strict: LIVE_STRICT, t });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        let current_ref01_data = Object.values(setup.data.existing.current)[0];
        // LOAD
        const current_ref01_ent = client.Current();
        const current_ref01_match_dt0 = {};
        const current_ref01_data_dt0 = (await current_ref01_ent.load(current_ref01_match_dt0)).data();
        (0, node_assert_1.default)(null != current_ref01_data_dt0);
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
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/current/CurrentTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.WeatherapiSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['current01', 'current02', 'current03'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'WEATHERAPI_TEST_CURRENT_ENTID': idmap,
        'WEATHERAPI_TEST_LIVE': 'FALSE',
        'WEATHERAPI_TEST_EXPLAIN': 'FALSE',
        'WEATHERAPI_APIKEY': '',
    });
    idmap = env['WEATHERAPI_TEST_CURRENT_ENTID'];
    const live = 'TRUE' === env.WEATHERAPI_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['WEATHERAPI_TEST_CURRENT_ENTID'];
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
//# sourceMappingURL=CurrentEntity.test.js.map
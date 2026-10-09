"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestDirect = void 0;
const apidef_1 = require("@voxgig/apidef");
const sdkgen_1 = require("@voxgig/sdkgen");
const utility_ts_1 = require("./utility_ts");
const TestDirect = (0, sdkgen_1.cmp)(function TestDirect(props) {
    const ctx$ = props.ctx$;
    const model = ctx$.model;
    const stdrep = ctx$.stdrep;
    const target = props.target;
    const entity = props.entity;
    const ff = (0, utility_ts_1.projectPath)('src/cmp/ts/fragment/');
    const strict = (0, sdkgen_1.liveStrict)(model, target.name);
    const PROJECTNAME = (0, sdkgen_1.envName)(model);
    const entidEnvVar = `${PROJECTNAME}_TEST_${(0, sdkgen_1.envToken)(entity.name)}_ENTID`;
    const authActive = (0, sdkgen_1.isAuthActive)(model);
    const authBasic = authActive && (0, sdkgen_1.isHttpBasicAuth)(model);
    const apikeyEnvEntry = authActive
        ? `\n    '${PROJECTNAME}_APIKEY': '',${authBasic ? `\n    '${PROJECTNAME}_SECRET': '',` : ''}`
        : '';
    const apikeyLiveField = authActive
        ? `
      apikey: env.${PROJECTNAME}_APIKEY,${authBasic ? `
      secret: env.${PROJECTNAME}_SECRET,` : ''}`
        : '';
    const svars = (0, sdkgen_1.serverVariables)(model);
    const serverEnvEntry = svars
        .map((v) => `\n    '${(0, sdkgen_1.serverVarEnv)(PROJECTNAME, v.name)}': ${JSON.stringify(v.dflt)},`).join('');
    const serverLiveField = 0 === svars.length ? '' : `
      server: {${svars
        .map((v) => `
        ${(0, sdkgen_1.jsKey)(v.name)}: ${(0, sdkgen_1.jsProp)('env', (0, sdkgen_1.serverVarEnv)(PROJECTNAME, v.name))},`).join('')}
      },`;
    const opnames = Object.keys(entity.op || {});
    const hasLoad = opnames.includes('load');
    const hasList = opnames.includes('list');
    if (!hasLoad && !hasList) {
        return;
    }
    (0, sdkgen_1.Folder)({ name: entity.name }, () => {
        (0, sdkgen_1.File)({ name: (0, apidef_1.nom)(entity, 'Name') + 'Direct.test.' + target.name }, () => {
            (0, sdkgen_1.Fragment)({
                from: ff + 'Direct.test.fragment.ts',
                replace: {
                    SdkName: (0, apidef_1.nom)(model.const, 'Name'),
                    EntityName: (0, apidef_1.nom)(entity, 'Name'),
                    entityname: entity.name,
                    PROJECTNAME,
                    ...stdrep,
                }
            }, () => {
                (0, sdkgen_1.Slot)({ name: 'directSetup' }, () => {
                    (0, sdkgen_1.Content)(`
${(0, sdkgen_1.liveStrictNote)(strict, '//')}
const LIVE_STRICT = ${strict}

function liveScenariosActive() { return ${(0, sdkgen_1.hasLiveScenarios)(model)} && process.env.${PROJECTNAME}_TEST_LIVE === 'TRUE' }
function directSetup(mockres?: any) {
  const calls: any[] = []

  const env = envOverride({
    '${entidEnvVar}': {},
    '${PROJECTNAME}_TEST_LIVE': 'FALSE',${apikeyEnvEntry}${serverEnvEntry}
  })

  const live = 'TRUE' === env.${PROJECTNAME}_TEST_LIVE

  if (live) {
    const transport = createLiveTransport()
    // Merged so the generated fields win: sdk-test-control.json's
    // test.client.options adds to the live client, it does not redirect it.
    const client = new ${(0, apidef_1.nom)(model.const, 'Name')}SDK(
      Object.assign({}, liveClientOptions(), { system: { fetch: transport.fetch },${apikeyLiveField}${serverLiveField}
      }))

    let idmap: any = env['${entidEnvVar}']
    if ('string' === typeof idmap && idmap.startsWith('{')) {
      idmap = JSON.parse(idmap)
    }

    return { client, calls, live, idmap, transport }
  }

  const mockFetch = async (url: string, init: any) => {
    calls.push({ url, init })
    return {
      status: 200,
      statusText: 'OK',
      headers: {},
      json: async () => (null != mockres ? mockres : { id: 'direct01' }),
    }
  }

  const client = new ${(0, apidef_1.nom)(model.const, 'Name')}SDK({
    base: 'http://localhost:8080',
    system: { fetch: mockFetch },
  })

  return { client, calls, live, idmap: {} as any }
}

// direct() returns the raw response body. List endpoints often wrap the
// array in an envelope (e.g. { data: [...] }, { entities: [...] },
// { pagination, data: [...] }). The test transforms the raw body to
// extract the first array — either the body itself or the first array
// property of an envelope object.
function unwrapListData(data: any): any[] | null {
  if (Array.isArray(data)) return data
  if (data && 'object' === typeof data) {
    for (const v of Object.values(data)) {
      if (Array.isArray(v)) return v as any[]
    }
  }
  return null
}
  `);
                });
                (0, sdkgen_1.Slot)({ name: 'direct' }, () => {
                    if (hasLoad) {
                        generateDirectLoad(model, entity);
                    }
                    if (hasList) {
                        generateDirectList(model, entity);
                    }
                });
            });
        });
    });
});
exports.TestDirect = TestDirect;
function generateDirectGraphql(opname, entity, point) {
    const doc = point.gq.doc;
    const vars = point.gq.vars || [];
    const varLine = (target, key, v) => `      ${target}[${JSON.stringify(v.name)}] = ${key}`;
    const mockVarLines = vars.map((v, i) => varLine('variables', `'direct0${i + 1}'`, v)).join('\n');
    const liveVarLines = vars.map((v) => {
        const from = v.from || v.name;
        const key = ('id' === from ? entity.name : from.replace(/_id$/, '')) + '01';
        return varLine('variables', `setup.idmap['${key}']`, v);
    }).join('\n');
    const liveIdKeys = vars.map((v) => {
        const from = v.from || v.name;
        return ('id' === from ? entity.name : from.replace(/_id$/, '')) + '01';
    });
    const skipMissingLine = 0 < liveIdKeys.length
        ? `    if (skipIfMissingIds(t, setup, ${JSON.stringify(liveIdKeys)}, LIVE_STRICT)) return\n`
        : '';
    const varAsserts = vars.map((_v, i) => '      assert(calls[0].init.body.includes(\'direct0' + (i + 1) + '\'))\n').join('');
    const offlineChecks = `      assert(result.ok === true)
      assert(result.status === 200)
      assert(null != result.data)
      assert(calls.length === 1)
      assert(calls[0].init.method === 'POST')
${varAsserts}`;
    const checks = liveChecks(opname, 'null != result.data', 'no data', offlineChecks);
    (0, sdkgen_1.Content)(`
  test('direct-${opname}-${entity.name}', async (t: any) => {
    if (liveScenariosActive()) { t.skip('Covered by live operation scenarios'); return }
    const setup = directSetup()
    if (maybeSkipControl(t, 'direct', 'direct-${opname}-${entity.name}', setup.live)) return
${skipMissingLine}    const { client, calls } = setup

    const variables: any = {}
    if (setup.live) {
${liveVarLines || '      // no variables'}
    } else {
${mockVarLines || '      // no variables'}
    }

    const result: any = await client.graphql(${JSON.stringify(doc)}, variables)

${checks}
  })
`);
}
function generateDirectLoad(model, entity) {
    const loadOp = entity.op?.load;
    const loadPoint = loadOp?.points?.[0];
    if (null == loadPoint) {
        return;
    }
    if ('graphql' === loadPoint.kind) {
        generateDirectGraphql('load', entity, loadPoint);
        return;
    }
    const allLoadParams = loadPoint.g?.params || [];
    const loadPath = normalizePathParams((0, sdkgen_1.pointParts)(loadPoint), allLoadParams, loadPoint.r?.param);
    // Some upstream OpenAPI specs declare a parameter as `in: path` even when
    // that path has no `{name}` placeholder for it. Only path params that
    // actually appear in the URL template should drive direct-test path-param
    // setup and URL-substitution asserts; otherwise the SDK silently drops
    // them and the URL-includes assert fails.
    const pathPlaceholders = new Set();
    for (const part of (0, sdkgen_1.pointParts)(loadPoint)) {
        if (typeof part === 'string' && part.startsWith('{') && part.endsWith('}')) {
            pathPlaceholders.add(part.slice(1, -1));
        }
    }
    const renameMap = (loadPoint.r?.param || {});
    const renamedPlaceholders = new Set();
    for (const ph of pathPlaceholders) {
        renamedPlaceholders.add(ph);
        for (const [orig, renamed] of Object.entries(renameMap)) {
            if (renamed === ph)
                renamedPlaceholders.add(orig);
        }
    }
    const loadParams = allLoadParams.filter((p) => renamedPlaceholders.has(p.n) || renamedPlaceholders.has(p.or));
    // Required query params that the spec advertises an example value for.
    // Live mode needs these on the request or the API returns 4xx; mock mode
    // ignores them. Optional query params (e.g. `app`, `version`) are skipped
    // even when they have examples — only the strictly required ones are
    // necessary to satisfy the contract.
    const loadQuery = loadPoint.g?.query || [];
    const liveQueryEntries = loadQuery
        .filter((q) => q.r && undefined !== q.ex && null !== q.ex);
    const hasLiveQuery = liveQueryEntries.length > 0;
    const liveQueryLines = liveQueryEntries
        .map((q) => `      ${(0, sdkgen_1.jsProp)('query', q.n)} = ${JSON.stringify(q.ex)}`)
        .join('\n');
    const listOp = entity.op?.list;
    const listPoint = listOp?.points?.[0];
    const listParams = listPoint?.g?.params || [];
    const listPath = listPoint ? normalizePathParams((0, sdkgen_1.pointParts)(listPoint), listParams, listPoint.r?.param) : '';
    const hasList = null != listPoint;
    const ancestorParams = loadParams.filter((p) => p.n !== 'id');
    const paramAsserts = loadParams.map((p, i) => '      assert(calls[0].url.includes(\'direct0' + (i + 1) + '\'))\n').join('');
    const liveListParams = listParams.map((p) => {
        const key = p.n === 'id'
            ? entity.name + '01'
            : p.n.replace(/_id$/, '') + '01';
        return { name: p.n, key };
    });
    const liveAncestorParams = ancestorParams.map((p) => {
        const key = p.n.replace(/_id$/, '') + '01';
        return { name: p.n, key };
    });
    const liveQueryPrefix = liveQueryLines ? liveQueryLines + '\n' : '';
    // Path params with spec-provided examples — when present, prefer them
    // over list-bootstrap. The OpenAPI example values are by definition real
    // identifiers the API accepts (e.g. casa: "blue", fecha: "2024/01/01"),
    // so they avoid the brittleness of mapping list-response field names
    // back to load path-param names.
    const liveExampleParams = loadParams.filter((p) => undefined !== p.ex && null !== p.ex);
    const allLoadParamsHaveExamples = loadParams.length > 0 && liveExampleParams.length === loadParams.length;
    let liveIdKeys = [];
    let liveParamsBlock = '';
    if (allLoadParamsHaveExamples) {
        const exampleLines = loadParams.map((p) => `      ${(0, sdkgen_1.jsProp)('params', p.n)} = ${JSON.stringify(p.ex)}`).join('\n');
        liveParamsBlock = `    if (setup.live) {
${liveQueryPrefix}${exampleLines}
    } else {
${loadParams.map((p, i) => `      ${(0, sdkgen_1.jsProp)('params', p.n)} = 'direct0${i + 1}'`).join('\n')}
    }`;
    }
    else if (hasList) {
        // List-bootstrap pattern picks the load id from a list call's response,
        // so the test can succeed without ENTID env var. Ancestor params, if
        // any, still need ENTID overrides because the list call itself can need
        // them embedded.
        liveIdKeys = [...new Set([...liveListParams, ...liveAncestorParams].map((lp) => lp.key))];
        const listParamLines = liveListParams.map((lp) => `        ${lp.name}: setup.idmap['${lp.key}'],`).join('\n');
        const ancestorParamLines = liveAncestorParams.map((lp) => `      ${(0, sdkgen_1.jsProp)('params', lp.name)} = setup.idmap['${lp.key}']`).join('\n');
        const idParamName = loadParams.find((p) => p.n === 'id')
            ? 'id'
            : (loadParams[0]?.n ?? 'id');
        liveParamsBlock = `    if (setup.live) {
${liveQueryPrefix}      const listResult: any = await client.direct({
        path: '${listPath}',
        method: 'GET',
        params: {
${listParamLines}
        },
      })
      if (!listResult.ok || listResult.status < 200 || listResult.status >= 300) {
        return void liveMiss(t, LIVE_STRICT, 'Live list discovery failed: ' + describeLive(listResult))
      }
      const listArr = unwrapListData(listResult.data)
      if (null == listArr) {
        return void liveMiss(t, LIVE_STRICT, 'Live list discovery returned no list: ' + describeLive(listResult))
      }
      if (0 === listArr.length) {
        return void liveEmpty(t, 'The account has no ${entity.name} record to load')
      }
      const candidateId = ${(0, sdkgen_1.jsOptProp)('listArr[0]', idParamName)} ?? listArr[0]?.id
      if (null == candidateId) {
        return void liveMiss(t, LIVE_STRICT, 'Live load blocked: discovery returned no usable identity')
      }
      ${(0, sdkgen_1.jsProp)('params', idParamName)} = candidateId
${ancestorParamLines}
    } else {
${loadParams.map((p, i) => `      ${(0, sdkgen_1.jsProp)('params', p.n)} = 'direct0${i + 1}'`).join('\n')}
    }`;
    }
    else if (hasLiveQuery || loadParams.length > 0) {
        // With no examples and no list to discover from, the ids come from the
        // *_ENTID variable; without them the test is blocked.
        const liveLoadParams = loadParams.map((p) => ({
            name: p.n, key: p.n === 'id' ? entity.name + '01' : p.n.replace(/_id$/, '') + '01',
        }));
        liveIdKeys = liveLoadParams.map((lp) => lp.key);
        liveParamsBlock = `    if (setup.live) {
${liveQueryPrefix}${liveLoadParams.map((lp) => `      ${(0, sdkgen_1.jsProp)('params', lp.name)} = setup.idmap['${lp.key}']`).join('\n')}
    } else {
${loadParams.map((p, i) => `      ${(0, sdkgen_1.jsProp)('params', p.n)} = 'direct0${i + 1}'`).join('\n')}
    }`;
    }
    else {
        liveParamsBlock = '';
    }
    const skipMissingLine = liveIdKeys.length > 0
        ? `    if (skipIfMissingIds(t, setup, ${JSON.stringify(liveIdKeys)}, LIVE_STRICT)) return\n`
        : '';
    const offlineChecks = `      assert(result.ok === true)
      assert(result.status === 200)
      assert(null != result.data)
      assert(result.data.id === 'direct01')
      assert(calls.length === 1)
      assert(calls[0].init.method === 'GET')
${paramAsserts}`;
    const loadChecks = liveChecks('load', 'null != result.data', 'no data', offlineChecks);
    (0, sdkgen_1.Content)(`
  test('direct-load-${entity.name}', async (t: any) => {
    if (liveScenariosActive()) { t.skip('Covered by live operation scenarios'); return }
    const setup = directSetup({ id: 'direct01' })
    if (maybeSkipControl(t, 'direct', 'direct-load-${entity.name}', setup.live)) return
${skipMissingLine}    const { client, calls } = setup

    const params: any = {}
    const query: any = {}
${liveParamsBlock}

    const result: any = await client.direct({
      path: '${loadPath}',
      method: 'GET',
      params,
      query,
    })

${loadChecks}
  })
`);
}
function generateDirectList(model, entity) {
    const listOp = entity.op?.list;
    const listPoint = listOp?.points?.[0];
    if (null == listPoint) {
        return;
    }
    if ('graphql' === listPoint.kind) {
        generateDirectGraphql('list', entity, listPoint);
        return;
    }
    const listParams = listPoint.g?.params || [];
    const listPath = normalizePathParams((0, sdkgen_1.pointParts)(listPoint), listParams, listPoint.r?.param);
    const listQuery = listPoint.g?.query || [];
    const liveQueryLines = listQuery
        .filter((q) => q.r && undefined !== q.ex && null !== q.ex)
        .map((q) => `      ${(0, sdkgen_1.jsProp)('query', q.n)} = ${JSON.stringify(q.ex)}`)
        .join('\n');
    const liveParams = listParams.map((p) => {
        const key = p.n === 'id'
            ? entity.name + '01'
            : p.n.replace(/_id$/, '') + '01';
        return { name: p.n, key };
    });
    const paramAsserts = listParams.map((p, i) => '      assert(calls[0].url.includes(\'direct0' + (i + 1) + '\'))\n').join('');
    let paramsBlock = '';
    if (listParams.length > 0 || liveQueryLines) {
        const liveLines = [
            liveQueryLines,
            liveParams.map((lp) => `      ${(0, sdkgen_1.jsProp)('params', lp.name)} = setup.idmap['${lp.key}']`).join('\n'),
        ].filter(Boolean).join('\n');
        const mockLines = listParams.map((p, i) => `      ${(0, sdkgen_1.jsProp)('params', p.n)} = 'direct0${i + 1}'`).join('\n');
        paramsBlock = `    const params: any = {}
    const query: any = {}
    if (setup.live) {
${liveLines}
    }${mockLines ? ` else {
${mockLines}
    }` : ''}
`;
    }
    else {
        paramsBlock = `    const params: any = {}
    const query: any = {}
`;
    }
    const liveIdKeys = listParams.length > 0
        ? liveParams.map((lp) => lp.key)
        : [];
    const skipMissingLine = liveIdKeys.length > 0
        ? `    if (skipIfMissingIds(t, setup, ${JSON.stringify(liveIdKeys)}, LIVE_STRICT)) return\n`
        : '';
    const offlineChecks = `      assert(result.ok === true)
      assert(result.status === 200)
      assert(null != result.data)
      const listArr = unwrapListData(result.data)
      assert(Array.isArray(listArr))
      assert(listArr!.length === 2)
      assert(calls.length === 1)
      assert(calls[0].init.method === 'GET')
${paramAsserts}`;
    const listChecks = liveChecks('list', 'Array.isArray(unwrapListData(result.data))', 'no list', offlineChecks);
    (0, sdkgen_1.Content)(`
  test('direct-list-${entity.name}', async (t: any) => {
    if (liveScenariosActive()) { t.skip('Covered by live operation scenarios'); return }
    const setup = directSetup([{ id: 'direct01' }, { id: 'direct02' }])
    if (maybeSkipControl(t, 'direct', 'direct-list-${entity.name}', setup.live)) return
${skipMissingLine}    const { client, calls } = setup

${paramsBlock}
    const result: any = await client.direct({
      path: '${listPath}',
      method: 'GET',
      params,
      query,
    })

${listChecks}
  })
`);
}
// A live run asserts what any server answers, never the mock's own script
// (`direct01`, `calls`), and never a record count.
function liveChecks(opname, usable, unusable, offline) {
    return `    if (setup.live) {
      if (!result.ok || result.status < 200 || result.status >= 300) {
        return void liveMiss(t, LIVE_STRICT, 'Live ${opname} failed: ' + describeLive(result))
      }
      if (!(${usable})) {
        return void liveMiss(t, LIVE_STRICT, 'Live ${opname} returned ${unusable}: ' + describeLive(result))
      }
    } else {
${offline}    }`;
}
function normalizePathParams(parts, params, rename) {
    return parts.map((part) => {
        return part.replace(/\{([^}]+)\}/g, (match, rawName) => {
            const snaked = (0, sdkgen_1.snakify)(rawName);
            const depluralized = (0, apidef_1.depluralize)(snaked);
            // Prefer exact name match — orig matches can collide when one param's
            // original name was renamed to another param's current name (e.g. badge
            // load: param 'group_id' has orig 'id', and another param has name 'id').
            const param = params.find((p) => p.n === snaked || p.n === depluralized) ||
                params.find((p) => p.or === snaked || p.or === depluralized);
            if (param)
                return '{' + param.n + '}';
            // Reverse-lookup through rename mapping: if rawName is a renamed value
            // (e.g. "id"), find the original camelCase key (e.g. "closureId"),
            // snakify+depluralize it (e.g. "closure_id"), and match against params.
            if (rename) {
                for (const [origCamel, renamedTo] of Object.entries(rename)) {
                    if (renamedTo === rawName) {
                        const origSnaked = (0, sdkgen_1.snakify)(origCamel);
                        const origDepluralized = (0, apidef_1.depluralize)(origSnaked);
                        const renamedParam = params.find((p) => p.or === origSnaked || p.n === origSnaked ||
                            p.or === origDepluralized || p.n === origDepluralized);
                        if (renamedParam)
                            return '{' + renamedParam.n + '}';
                    }
                }
            }
            return match;
        });
    }).join('/');
}
//# sourceMappingURL=TestDirect_ts.js.map
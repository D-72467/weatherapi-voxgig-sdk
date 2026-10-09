"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestEntity = void 0;
const sdkgen_1 = require("@voxgig/sdkgen");
const sdkgen_2 = require("@voxgig/sdkgen");
const sdkgen_3 = require("@voxgig/sdkgen");
const struct_1 = require("@voxgig/struct");
const apidef_1 = require("@voxgig/apidef");
const sdkgen_4 = require("@voxgig/sdkgen");
const utility_ts_1 = require("./utility_ts");
const TestEntity = (0, sdkgen_4.cmp)(function TestEntity(props) {
    const ctx$ = props.ctx$;
    const model = ctx$.model;
    const stdrep = ctx$.stdrep;
    const target = props.target;
    const entity = props.entity;
    const PROJENVNAME = (0, sdkgen_4.envName)(model);
    const ENTENVNAME = (0, sdkgen_4.envToken)(entity.name);
    const authActive = (0, sdkgen_4.isAuthActive)(model);
    const authBasic = authActive && (0, sdkgen_4.isHttpBasicAuth)(model);
    const apikeyEnvEntry = authActive
        ? `\n    '${PROJENVNAME}_APIKEY': '',${authBasic ? `\n    '${PROJENVNAME}_SECRET': '',` : ''}`
        : '';
    const apikeyLiveField = authActive
        ? `
        apikey: env.${PROJENVNAME}_APIKEY,${authBasic ? `
        secret: env.${PROJENVNAME}_SECRET,` : ''}`
        : '';
    const svars = (0, sdkgen_4.serverVariables)(model);
    const serverEnvEntry = svars
        .map((v) => `\n    '${(0, sdkgen_4.serverVarEnv)(PROJENVNAME, v.name)}': ${JSON.stringify(v.dflt)},`).join('');
    const serverLiveField = 0 === svars.length ? '' : `
        server: {${svars
        .map((v) => `
          ${(0, sdkgen_4.jsKey)(v.name)}: ${(0, sdkgen_4.jsProp)('env', (0, sdkgen_4.serverVarEnv)(PROJENVNAME, v.name))},`).join('')}
        },`;
    const ff = (0, utility_ts_1.projectPath)('src/cmp/ts/fragment/');
    (0, sdkgen_4.Folder)({ name: entity.name }, () => {
        (0, sdkgen_4.File)({ name: (0, apidef_1.nom)(entity, 'Name') + 'Entity.test.' + target.name }, () => {
            (0, sdkgen_4.Fragment)({
                from: ff + 'Entity.test.fragment.ts',
                replace: {
                    SdkName: (0, apidef_1.nom)(model.const, 'Name'),
                    EntityName: (0, apidef_1.nom)(entity, 'Name'),
                    entityname: entity.name,
                    PROJECTNAME: PROJENVNAME,
                    ...stdrep,
                }
            }, () => {
                const basicflow = (0, apidef_1.getModelPath)(model, `main.${apidef_1.KIT}.flow.Basic${(0, apidef_1.nom)(entity, 'Name')}Flow`);
                const dobasic = basicflow && true === basicflow.active;
                const liveFacts = Object.fromEntries(Object.values(entity.op || {}).flatMap((op) => (op.points || []).map((point) => [point.m + ' ' + point.o, (0, sdkgen_1.boundedFacts)((0, sdkgen_1.pointFacts)(ctx$, point))])));
                if (!dobasic) {
                    return;
                }
                (0, sdkgen_4.Slot)({ name: 'failure' }, () => {
                    if ((0, sdkgen_3.opReachable)(entity.op?.list, [])) {
                        (0, sdkgen_4.Content)(failureTests(model, entity));
                    }
                    (0, sdkgen_4.Content)(validateTest(model, entity));
                });
                const indent = 2;
                const idlist = (0, sdkgen_2.buildIdNames)(entity, basicflow);
                (0, sdkgen_4.Slot)({ name: 'basicSetup' }, () => {
                    (0, sdkgen_4.Content)(`
${(0, sdkgen_4.liveStrictNote)((0, sdkgen_4.liveStrict)(model, target.name), '//')}
const LIVE_STRICT = ${(0, sdkgen_4.liveStrict)(model, target.name)}

function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // ${(0, struct_1.jsonify)(basicflow.test, { offset: indent - 2 })}

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/${entity.name}/${(0, apidef_1.nom)(entity, 'Name')}TestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = ${model.Name}SDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['${(0, struct_1.join)(idlist, '\',\'')}'],
    {
      '\`$PACK\`': ['', {
        '\`$KEY\`': '\`$COPY\`',
        '\`$VAL\`': ['\`$FORMAT\`', 'upper', '\`$COPY\`']
      }]
    })

  const env = envOverride({
    '${PROJENVNAME}_TEST_${ENTENVNAME}_ENTID': idmap,
    '${PROJENVNAME}_TEST_LIVE': 'FALSE',
    '${PROJENVNAME}_TEST_EXPLAIN': 'FALSE',${apikeyEnvEntry}${serverEnvEntry}
  })

  idmap = env['${PROJENVNAME}_TEST_${ENTENVNAME}_ENTID']

  const live = 'TRUE' === env.${PROJENVNAME}_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['${PROJENVNAME}_TEST_${ENTENVNAME}_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new ${model.Name}SDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {${apikeyLiveField}${serverLiveField}
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
    explain: 'TRUE' === env.${PROJENVNAME}_TEST_EXPLAIN,
    live,
    transport,
    now: Date.now(),
  }

  return setup
}
  `);
                });
                (0, sdkgen_4.Slot)({ name: 'basic' }, () => {
                    const flowHasCreate = Object.values((0, sdkgen_3.flowSteps)(basicflow)).some((s) => s.o === 'create');
                    // The basic test exercises a flow with one or more ops (load,
                    // list, create, update, remove, ...). The control file lets users
                    // skip per-op for an entity. Since the flow is sequential and
                    // dependent (e.g. update needs prior load), skipping ANY op the
                    // flow exercises skips the whole basic test.
                    const flowOps = Array.from(new Set((0, sdkgen_3.flowSteps)(basicflow).map((s) => s.o).filter(Boolean)));
                    const flowOpsLiteral = '[' + flowOps.map((o) => `'${o}'`).join(', ') + ']';
                    (0, sdkgen_4.Content)(`
    const live = 'TRUE' === process.env.${PROJENVNAME}_TEST_LIVE
    for (const op of ${flowOpsLiteral}) {
      if (!live && maybeSkipControl(t, 'entityOp', '${entity.name}.' + op, live)) return
    }

    ${(0, sdkgen_4.hasLiveScenarios)(model) ? `if (live) { t.skip('Covered by live operation scenarios'); return }` : ''}
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, ${JSON.stringify(entity)}, ${JSON.stringify(basicflow)}, '${(0, apidef_1.nom)(entity, 'Name')}', ${JSON.stringify(liveFacts)}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

`);
                    // When the flow has no create step, bootstrap the entity data variable
                    // from existing test data so that subsequent update/load/remove steps
                    // can reference it.
                    if (!flowHasCreate) {
                        const ref01 = entity.name + '_ref01';
                        (0, sdkgen_4.Content)(`    let ${ref01}_data = Object.values(setup.data.existing.${entity.name})[0] as any
`);
                    }
                    const genCtx = {
                        model, entity, flow: basicflow, PROJUPPER: PROJENVNAME,
                    };
                    (0, sdkgen_4.each)((0, sdkgen_3.flowSteps)(basicflow), (step, index) => {
                        // Never emit a REMOVE (or its removed-item verify LIST) without a
                        // preceding CREATE: a coherent CRUD flow only removes what it made,
                        // so a create-less remove would mutate pre-existing (live) data.
                        if (!flowHasCreate) {
                            if ('remove' === step.o) {
                                return;
                            }
                            if ('list' === step.o &&
                                (step.v || []).some((v) => 'ItemNotExists' === v.apply)) {
                                return;
                            }
                        }
                        const opgen = GENERATE_OP[step.o];
                        if (null != opgen) {
                            opgen(genCtx, step, index);
                            (0, sdkgen_4.Content)('\n');
                        }
                    });
                });
            });
        });
    });
});
exports.TestEntity = TestEntity;
const generateCreate = (ctx, step, index) => {
    const { entity, flow } = ctx;
    const ref = step.i.ref ?? entity.name + '_ref01';
    const entvar = step.i.entvar ?? ref + '_ent';
    const datavar = step.i.datavar ?? (ref + '_data' + (step.i.suffix ?? ''));
    const priorSteps = (0, sdkgen_3.flowSteps)(flow).slice(0, Number(index));
    const needsEnt = !priorSteps.some(s => ['create', 'list', 'load', 'update', 'remove'].includes(s.o));
    const hasDatvar = priorSteps.some(s => {
        if ('create' === s.o) {
            const priorRef = s.i.ref ?? entity.name + '_ref01';
            const priorDatvar = s.i.datavar ?? (priorRef + '_data' + (s.i.suffix ?? ''));
            return priorDatvar === datavar;
        }
        return false;
    });
    (0, sdkgen_4.Content)(`
    // CREATE
`);
    if (needsEnt) {
        (0, sdkgen_4.Content)(`    const ${entvar} = client.${(0, apidef_1.nom)(entity, 'Name')}()
`);
    }
    if (hasDatvar) {
        (0, sdkgen_4.Content)(`    ${datavar} = setup.data.new.${entity.name}['${ref}']
`);
    }
    else {
        (0, sdkgen_4.Content)(`    let ${datavar} = setup.data.new.${entity.name}['${ref}']
`);
    }
    (0, sdkgen_4.each)(step.m, (mi) => {
        (0, sdkgen_4.Content)(`    ${datavar}['${mi.key$}'] = setup.idmap['${mi.val$}']
`);
    });
    const hasEntIdC = null != entity.id;
    (0, sdkgen_4.Content)(`
    ${datavar} = (await ${entvar}.create(${datavar})).data()
`);
    if (hasEntIdC) {
        (0, sdkgen_4.Content)(`    assert(null != ${datavar}.id)
`);
    }
    else {
        (0, sdkgen_4.Content)(`    assert(null != ${datavar})
`);
    }
};
const generateList = (ctx, step, index) => {
    const { entity, flow } = ctx;
    const hasDataId = null != (0, sdkgen_4.entityDataIdField)(entity);
    const ref = step.i.ref ?? entity.name + '_ref01';
    const entvar = step.i.entvar ?? ref + '_ent';
    const matchvar = step.i.matchvar ?? (ref + '_match' + (step.i.suffix ?? ''));
    const listvar = step.i.listvar ?? (ref + '_list' + (step.i.suffix ?? ''));
    const priorSteps = (0, sdkgen_3.flowSteps)(flow).slice(0, Number(index));
    const needsEnt = !priorSteps.some(s => ['create', 'list', 'load', 'update', 'remove'].includes(s.o));
    (0, sdkgen_4.Content)(`
    // LIST
`);
    if (needsEnt) {
        (0, sdkgen_4.Content)(`    const ${entvar} = client.${(0, apidef_1.nom)(entity, 'Name')}()
`);
    }
    (0, sdkgen_4.Content)(`    const ${matchvar}: any = {}
`);
    (0, sdkgen_4.each)(step.m, (mi) => {
        (0, sdkgen_4.Content)(`    ${matchvar}['${mi.key$}'] = setup.idmap['${mi.val$}']
`);
    });
    (0, sdkgen_4.Content)(`
    const ${listvar} = (await ${entvar}.list(${matchvar})).map((e: any) => e.data())
`);
    const allSteps = (0, sdkgen_3.flowSteps)(flow);
    for (let vI = 0; vI < step.v.length; vI++) {
        const validator = step.v[vI];
        const validRef = validator.def?.ref;
        const hasRefData = validRef && allSteps.some(s => 'create' === s.o &&
            ((s.i.ref ?? entity.name + '_ref01') === validRef));
        if ('ItemExists' === validator.apply && hasRefData && hasDataId) {
            (0, sdkgen_4.Content)(`
    assert(!isempty(select(${listvar}, { id: ${validRef}_data.id })))
`);
        }
        else if ('ItemNotExists' === validator.apply && hasRefData && hasDataId) {
            (0, sdkgen_4.Content)(`
    assert(isempty(select(${listvar}, { id: ${validRef}_data.id })))
`);
        }
    }
};
const generateUpdate = (ctx, step, index) => {
    const { entity, flow } = ctx;
    const ref = step.i.ref ?? entity.name + '_ref01';
    const entvar = step.i.entvar ?? ref + '_ent';
    const datavar = step.i.datavar ?? (ref + '_data' + (step.i.suffix ?? ''));
    const resdatavar = step.i.resdatavar ?? (ref + '_resdata' + (step.i.suffix ?? ''));
    const markdefvar = step.i.markdefvar ?? (ref + '_markdef' + (step.i.suffix ?? ''));
    const srcdatavar = step.i.srcdatavar ?? (ref + '_data' + (step.i.suffix ?? ''));
    const priorSteps = (0, sdkgen_3.flowSteps)(flow).slice(0, Number(index));
    const needsEnt = !priorSteps.some(s => ['create', 'list', 'load', 'update', 'remove'].includes(s.o));
    const hasEntIdU = null != entity.id;
    (0, sdkgen_4.Content)(`
    // UPDATE
`);
    if (needsEnt) {
        (0, sdkgen_4.Content)(`    const ${entvar} = client.${(0, apidef_1.nom)(entity, 'Name')}()
`);
    }
    (0, sdkgen_4.Content)(`    const ${datavar}: any = {}
`);
    if (hasEntIdU) {
        (0, sdkgen_4.Content)(`    ${datavar}.id = ${srcdatavar}.id
`);
    }
    (0, sdkgen_4.each)(step.d, (mi) => {
        if ('id' !== mi.key$) {
            (0, sdkgen_4.Content)(`    ${datavar} ['${mi.key$}'] = setup.idmap['${mi.key$}']
`);
        }
    });
    for (let sI = 0; sI < step.s.length; sI++) {
        const spec = step.s[sI];
        if ('TextFieldMark' === spec.apply && null != step.i.textfield) {
            const fieldname = step.i.textfield;
            const fieldvalue = spec.def.mark;
            (0, sdkgen_4.Content)(`
    const ${markdefvar} = { name: '${fieldname}', value: '${fieldvalue}_' + setup.now }
    ;(${datavar} as any)[${markdefvar}.name] = ${markdefvar}.value
`);
        }
    }
    (0, sdkgen_4.Content)(`
    const ${resdatavar} = (await ${entvar}.update(${datavar})).data()
`);
    if (hasEntIdU) {
        (0, sdkgen_4.Content)(`    assert(${resdatavar}.id === ${datavar}.id)
`);
    }
    else {
        (0, sdkgen_4.Content)(`    assert(null != ${resdatavar})
`);
    }
    for (let sI = 0; sI < step.s.length; sI++) {
        const spec = step.s[sI];
        if ('TextFieldMark' === spec.apply && null != step.i.textfield) {
            (0, sdkgen_4.Content)(`
    assert((${resdatavar} as any)[${markdefvar}.name] === ${markdefvar}.value)
`);
        }
    }
};
const generateLoad = (ctx, step, index) => {
    const { entity, flow } = ctx;
    const ref = step.i.ref ?? entity.name + '_ref01';
    const entvar = step.i.entvar ?? ref + '_ent';
    const matchvar = step.i.matchvar ?? (ref + '_match' + (step.i.suffix ?? ''));
    const datavar = step.i.datavar ?? (ref + '_data' + (step.i.suffix ?? ''));
    const srcdatavar = step.i.srcdatavar ?? (ref + '_data' + (step.i.suffix ?? ''));
    const priorSteps = (0, sdkgen_3.flowSteps)(flow).slice(0, Number(index));
    const hasEntVar = priorSteps.some(s => ['create', 'list', 'load', 'update', 'remove'].includes(s.o));
    // Check if srcdatavar was declared by a prior create step or by the
    // preamble bootstrap (which runs when the flow has no create step)
    const flowHasCreate = (0, sdkgen_3.flowSteps)(flow).some(s => s.o === 'create');
    const preambleRef = entity.name + '_ref01';
    const hasSrcData = (!flowHasCreate && srcdatavar === preambleRef + '_data') ||
        priorSteps.some(s => {
            if ('create' === s.o) {
                const priorRef = s.i.ref ?? entity.name + '_ref01';
                const priorDatvar = s.i.datavar ?? (priorRef + '_data' + (s.i.suffix ?? ''));
                return priorDatvar === srcdatavar;
            }
            return false;
        });
    const hasEntId = null != entity.id;
    const loadOp = entity.op?.load;
    const loadPoint = loadOp?.points?.[0];
    const loadPathParams = loadPoint?.g?.params || [];
    const loadHasRequiredParams = loadPathParams.some((p) => p.r !== false);
    if (!hasEntId && loadHasRequiredParams) {
        if (!hasEntVar) {
            (0, sdkgen_4.Content)(`
    // LOAD: skipped — no entity id field and load requires path params.
    // Entity-var is declared here so later flow steps still compile.
    const ${entvar} = client.${(0, apidef_1.nom)(entity, 'Name')}()
`);
        }
        return;
    }
    (0, sdkgen_4.Content)(`
    // LOAD
`);
    if (!hasEntVar) {
        (0, sdkgen_4.Content)(`    const ${entvar} = client.${(0, apidef_1.nom)(entity, 'Name')}()
`);
    }
    if (!hasSrcData && hasEntId) {
        (0, sdkgen_4.Content)(`    const ${srcdatavar} = Object.values(setup.data.existing.${entity.name})[0] as any
`);
    }
    if (hasEntId) {
        (0, sdkgen_4.Content)(`    const ${matchvar}: any = {}
    ${matchvar}.id = ${srcdatavar}.id
    const ${datavar} = (await ${entvar}.load(${matchvar})).data()
    assert(${datavar}.id === ${srcdatavar}.id)
`);
    }
    else {
        (0, sdkgen_4.Content)(`    const ${matchvar}: any = {}
    const ${datavar} = (await ${entvar}.load(${matchvar})).data()
    assert(null != ${datavar})
`);
    }
};
const generateRemove = (ctx, step, index) => {
    const { entity, flow } = ctx;
    const ref = step.i.ref ?? entity.name + '_ref01';
    const entvar = step.i.entvar ?? ref + '_ent';
    const matchvar = step.i.matchvar ?? (ref + '_match' + (step.i.suffix ?? ''));
    const srcdatavar = step.i.srcdatavar ?? (ref + '_data');
    const priorSteps = (0, sdkgen_3.flowSteps)(flow).slice(0, Number(index));
    const needsEnt = !priorSteps.some(s => ['create', 'list', 'load', 'update', 'remove'].includes(s.o));
    // "Remove what you created" needs the created record's id. An entity with
    // no DATA id field (entityDataIdField null — e.g. Multichannel's Template)
    // returns records without `.id`, so `${srcdatavar}.id` is absent (a py
    // KeyError; a silent nil elsewhere). Skip the flow-remove step for those —
    // the remove op is still exercised by the direct() test.
    if (null == (0, sdkgen_4.entityDataIdField)(entity)) {
        return;
    }
    (0, sdkgen_4.Content)(`
    // REMOVE
`);
    if (needsEnt) {
        (0, sdkgen_4.Content)(`    const ${entvar} = client.${(0, apidef_1.nom)(entity, 'Name')}()
`);
    }
    // Always match the prior-created entity by id. The mock test feature
    // removes the first match in entmap, so without a specific id the
    // result depends on hash-sort order and flakes (see cheapshark).
    (0, sdkgen_4.Content)(`    const ${matchvar}: any = { id: ${srcdatavar}.id }
    await ${entvar}.remove(${matchvar})
  `);
};
const GENERATE_OP = {
    create: generateCreate,
    list: generateList,
    update: generateUpdate,
    load: generateLoad,
    remove: generateRemove,
};
// A failed operation rejects a stream as it rejects the operation: a
// transport failure, and a hook that rejects the call. A throwing hook fires
// PreUnexpected, and under throw false the call resolves to undefined. The
// caller's ctrl stays its own.
function failureTests(model, entity) {
    const SDK = model.Name + 'SDK';
    const Entity = (0, apidef_1.nom)(entity, 'Name');
    return `
  class FailHook extends BaseFeature {
    name = 'failhook'
    version = '0.0.1'
    active = true
    unexpected = 0
    init() { }
    PreSpec() { throw new Error('${entity.name} hook failed') }
    PreUnexpected() { this.unexpected++ }
  }

  test('stream-error', async () => {
    const offline = { net: { offline: true } }
    await assert.rejects(async () => {
      for await (const _item of ${SDK}.test(offline).${Entity}().stream('list')) { }
    }, /offline/)

    for await (const _item of ${SDK}.test(offline).${Entity}()
      .stream('list', undefined, { ctrl: { throw: false } })) { }

    if (null != (config as any).feature?.rbac) {
      const denied = ${SDK}.test(undefined, { feature: { rbac: { active: true, deny: true } } })
      await assert.rejects(async () => {
        for await (const _item of denied.${Entity}().stream('list')) { }
      }, (err: any) => 'rbac_denied' === err.code)
    }
  })

  test('stream-ctrl', async () => {
    const explain: any = {}
    const ctrl: any = { explain }
    for await (const _item of ${SDK}.test().${Entity}().stream('list', undefined, { ctrl })) { }
    assert.deepStrictEqual(Object.keys(ctrl), ['explain'])
    assert(explain === ctrl.explain && 0 < Object.keys(explain).length)
  })

  test('unexpected', async () => {
    const hook = new FailHook()
    const client = new ${SDK}({ feature: { test: { active: true } }, extend: [hook] })
    await assert.rejects(client.${Entity}().list(), /hook failed/)
    assert(0 < hook.unexpected)

    const fired = hook.unexpected
    assert.strictEqual(await client.${Entity}().list(undefined, { throw: false }), undefined)
    assert(fired < hook.unexpected)
  })
`;
}
// An invalid request fails with validate's own error, before it is sent.
function validateTest(model, entity) {
    const bad = (0, sdkgen_3.invalidRequest)(entity);
    if (null == bad) {
        return '';
    }
    const SDK = model.Name + 'SDK';
    return `
  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = ${SDK}.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.${(0, apidef_1.nom)(entity, 'Name')}().${bad.op}(${JSON.stringify(bad.args)} as any),
      (err: any) => 'validate_failed' === err.code)
  })
`;
}
//# sourceMappingURL=TestEntity_ts.js.map
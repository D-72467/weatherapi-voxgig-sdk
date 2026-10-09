"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadmeRef = void 0;
const sdkgen_1 = require("@voxgig/sdkgen");
const sdkgen_2 = require("@voxgig/sdkgen");
const apidef_1 = require("@voxgig/apidef");
const utility_ts_1 = require("./utility_ts");
const OP_SIGNATURES = {
    load: {
        sig: 'load(match: object, ctrl?: object)',
        returns: 'Promise<Entity>',
        desc: 'Load a single entity matching the given criteria. Resolves to the entity, whose record `data()` reads.',
    },
    list: {
        sig: 'list(match: object, ctrl?: object)',
        returns: 'Promise<Entity[]>',
        desc: 'List entities matching the given criteria. Resolves to an array of entities, one per record.',
    },
    create: {
        sig: 'create(data: object, ctrl?: object)',
        returns: 'Promise<Entity>',
        desc: 'Create a new entity with the given data. Resolves to the created entity.',
    },
    update: {
        sig: 'update(data: object, ctrl?: object)',
        returns: 'Promise<Entity>',
        desc: 'Update an existing entity. The data must include the entity `id`. Resolves to the updated entity.',
    },
    patch: {
        sig: 'patch(data: object, ctrl?: object)',
        returns: 'Promise<Entity>',
        desc: 'Change part of an existing entity: only the fields given are sent. The data must include the entity `id`. Resolves to the patched entity.',
    },
    remove: {
        sig: 'remove(match: object, ctrl?: object)',
        returns: 'Promise<Entity>',
        desc: 'Remove the entity matching the given criteria. Resolves to the entity, marked as deleted.',
    },
};
const ReadmeRef = (0, sdkgen_1.cmp)(function ReadmeRef(props) {
    const { target } = props;
    const { model } = props.ctx$;
    const entity = (0, apidef_1.getModelPath)(model, `main.${apidef_1.KIT}.entity`);
    const feature = (0, sdkgen_1.targetFeatures)(model, target);
    const publishedEntities = (0, sdkgen_1.each)(entity).filter((e) => e.active !== false);
    (0, sdkgen_1.File)({ name: 'REFERENCE.md' }, () => {
        (0, sdkgen_1.Content)(`# ${model.Name} ${target.title} SDK Reference

Complete API reference for the ${model.Name} ${target.title} SDK.


## ${model.Name}SDK

### Constructor

`);
        (0, sdkgen_1.Content)(`\`\`\`ts
new ${model.Name}SDK(options?: object)
\`\`\`

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| \`options\` | \`object\` | SDK configuration options. |
${(0, sdkgen_1.isAuthActive)(model) ? '| \`options.apikey\` | \`string\` | API key for authentication. |\n' : ''}${(0, sdkgen_1.isAuthActive)(model) && (0, sdkgen_1.isHttpBasicAuth)(model) ? '| \`options.secret\` | \`string\` | API secret for authentication. |\n' : ''}| \`options.base\` | \`string\` | Base URL for API requests. |
| \`options.prefix\` | \`string\` | URL prefix appended after base. |
| \`options.suffix\` | \`string\` | URL suffix appended after path. |
| \`options.headers\` | \`object\` | Custom headers for all requests. |
| \`options.feature\` | \`object\` | Feature configuration. |
| \`options.system\` | \`object\` | System overrides (e.g. custom fetch). |

`);
        (0, sdkgen_1.Content)(`
### Static Methods

`);
        (0, sdkgen_1.Content)(`#### \`${model.Name}SDK.test(testopts?, sdkopts?)\`

Create a test client with mock features active.

\`\`\`ts
const client = ${model.Name}SDK.test()
\`\`\`

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| \`testopts\` | \`object\` | Test feature options. |
| \`sdkopts\` | \`object\` | Additional SDK options merged with test defaults. |

**Returns:** \`${model.Name}SDK\` instance in test mode.

`);
        (0, sdkgen_1.Content)(`
### Instance Methods

`);
        // Entity factory methods
        publishedEntities.map((ent) => {
            (0, sdkgen_1.Content)(`#### \`${ent.Name}(data?: object)\`

Create a new \`${ent.Name}\` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| \`data\` | \`object\` | Initial entity data. |

**Returns:** \`${ent.Name}Entity\` instance.

`);
        });
        (0, sdkgen_1.Content)(`#### \`options()\`

Return a deep copy of the current SDK options.

**Returns:** \`object\`

#### \`utility()\`

Return a copy of the SDK utility object.

**Returns:** \`object\`

#### \`direct(fetchargs?: object)\`

Make a direct HTTP request to any API endpoint.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| \`fetchargs.path\` | \`string\` | URL path with optional \`{param}\` placeholders. |
| \`fetchargs.method\` | \`string\` | HTTP method (default: \`GET\`). |
| \`fetchargs.params\` | \`object\` | Path parameter values for \`{param}\` substitution. |
| \`fetchargs.query\` | \`object\` | Query string parameters. |
| \`fetchargs.headers\` | \`object\` | Request headers (merged with defaults). |
| \`fetchargs.body\` | \`any\` | Request body (objects are JSON-serialized). |
| \`fetchargs.ctrl\` | \`object\` | Control options (e.g. \`{ explain: true }\`). |
| \`fetchargs.ctrl.signal\` | \`AbortSignal\` | Aborts the request in flight: \`ok\` is then \`false\` and \`err.code\` is \`request_aborted\`. |

**Returns:** \`Promise<{ ok, status, headers, data }>\`. On a failure
\`ok\` is \`false\` and \`err\` holds the error.

#### \`prepare(fetchargs?: object)\`

Prepare a fetch definition without sending the request. Accepts the
same parameters as \`direct()\`.

**Returns:** \`Promise<{ url, method, headers, body } | Error>\`

#### \`tester(testopts?, sdkopts?)\`

Alias for \`${model.Name}SDK.test()\`.

**Returns:** \`${model.Name}SDK\` instance in test mode.

#### Cancelling a call

Every entity operation takes an optional \`ctrl\` object after its match or
data, and an \`AbortSignal\` in \`ctrl.signal\` cancels the request in flight.
The operation then rejects with an error whose \`code\` is
\`request_aborted\` and whose \`cause\` is the signal's reason. A request
whose signal has already aborted is not sent. \`stream()\` takes the signal
as \`callopts.signal\`, and ends when it aborts.

`);
        // Entity reference sections
        publishedEntities.map((ent) => {
            const opnames = Object.keys(ent.op || {});
            const fields = Object.values(ent.fields || {});
            // Model-driven id key: null when this entity has no id-like field, in
            // which case load/remove match on no argument and update omits the id.
            const idF = (0, sdkgen_1.entityIdField)(ent);
            const eVar = (0, sdkgen_1.exampleVarName)(ent.name, target.name);
            (0, sdkgen_1.Content)(`
---

## ${ent.Name}Entity

`);
            if (ent.short) {
                (0, sdkgen_1.Content)(`${ent.short}

`);
            }
            (0, sdkgen_1.Content)(`\`\`\`ts
const ${eVar} = client.${ent.Name}()
\`\`\`

`);
            // Field schema
            if (fields.length > 0) {
                (0, sdkgen_1.Content)(`### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
`);
                (0, sdkgen_1.each)(fields, (field) => {
                    const req = field.r ? 'Yes' : 'No';
                    const desc = field.sh || '';
                    (0, sdkgen_1.Content)(`| \`${field.n}\` | \`${(0, sdkgen_1.canonToType)(field.t, target.name)}\` | ${req} | ${desc} |
`);
                });
                (0, sdkgen_1.Content)(`
`);
                // Field operations breakdown
                const hasFieldOps = fields.some((f) => f.op && Object.keys(f.op).length > 0);
                if (hasFieldOps) {
                    // Only emit columns for operations this entity actually exposes —
                    // never advertise a create/update/remove column the entity lacks.
                    const opcols = ['load', 'list', 'create', 'update', 'patch', 'remove']
                        .filter((op) => opnames.includes(op) && ent.op[op]?.active !== false);
                    (0, sdkgen_1.Content)(`### Field Usage by Operation

| Field | ${opcols.join(' | ')} |
| --- | ${opcols.map(() => '---').join(' | ')} |
`);
                    (0, sdkgen_1.each)(fields, (field) => {
                        const fops = field.op || {};
                        const cols = opcols.map((op) => {
                            const fop = fops[op];
                            if (null == fop)
                                return '-';
                            if (fop.active === false)
                                return '-';
                            return 'Yes';
                        });
                        (0, sdkgen_1.Content)(`| \`${field.n}\` | ${cols.join(' | ')} |
`);
                    });
                    (0, sdkgen_1.Content)(`
`);
                }
            }
            const actions = (0, sdkgen_1.entityActions)(ent);
            if (0 < actions.length) {
                (0, sdkgen_1.Content)(`### Actions

This entity exposes custom API actions in addition to the standard
operations. Select one with \`$action\` in the call's argument; the
remaining keys are sent as that action's payload.

| Action | Route | Call |
| --- | --- | --- |
`);
                actions.forEach((a) => {
                    (0, sdkgen_1.Content)(`| \`${a.action}\` | \`${a.path}\` | \`client.${ent.Name}().${a.op}({ $action: '${a.action}', ... })\` |
`);
                });
                (0, sdkgen_1.Content)(`
An action returns that action's OWN response, which is not necessarily a
${ent.Name} record — check the API definition for its shape.

\`\`\`ts
const result = await client.${ent.Name}().${actions[0].op}({
  $action: '${actions[0].action}',
  /* ...the action's own arguments */
})
\`\`\`

`);
            }
            // Operation details
            if (opnames.length > 0) {
                (0, sdkgen_1.Content)(`### Operations

`);
                opnames.map((opname) => {
                    const info = OP_SIGNATURES[opname];
                    if (!info)
                        return;
                    (0, sdkgen_1.Content)(`#### \`${info.sig}\`

${info.desc}

`);
                    if ((0, sdkgen_1.opNeedsAction)(ent.op[opname])) {
                        return;
                    }
                    // Show example
                    if ('load' === opname || 'remove' === opname) {
                        // The id key plus every REQUIRED match key (parent path params
                        // like page_id) — the same shape that generates <Name><Op>Match,
                        // so the example always type-checks.
                        const matchItems = (0, sdkgen_1.opRequestShape)(ent, opname).items
                            .filter((it) => !it.optional || it.name === idF)
                            .sort((a, b) => (a.name === idF ? 0 : 1) - (b.name === idF ? 0 : 1));
                        const arg = 0 < matchItems.length
                            ? `{ ${matchItems.map((it) => `${(0, sdkgen_1.jsKey)(it.name)}: ${(0, utility_ts_1.exampleValue)(ent, ent.op && ent.op[opname], it.name, it.name === idF ? ent.name + '_id' : it.name)}`).join(', ')} }`
                            : '';
                        (0, sdkgen_1.Content)(`\`\`\`ts
const result = await client.${ent.Name}().${opname}(${arg})
\`\`\`

`);
                    }
                    else if ('list' === opname) {
                        (0, sdkgen_1.Content)(`\`\`\`ts
const results = await client.${ent.Name}().${opname}(${(0, sdkgen_1.listMatchArg)('ts', ent)})
\`\`\`

`);
                    }
                    else if ('create' === opname) {
                        // Members come from the SAME shape that generates
                        // <Name>CreateData (every required member appears), each with a
                        // type-correct example VALUE via exampleValue — a `name: /* type */`
                        // comment is not a value and yields invalid TS (TS1109).
                        const createItems = (0, sdkgen_1.opRequestShape)(ent, 'create').items
                            .filter((it) => !it.optional);
                        (0, sdkgen_1.Content)(`\`\`\`ts
const result = await client.${ent.Name}().create({
`);
                        createItems.map((it) => {
                            (0, sdkgen_1.Content)(`  ${(0, sdkgen_1.jsKey)(it.name)}: ${(0, utility_ts_1.exampleValue)(ent, ent.op && ent.op.create, it.name, 'example_' + it.name)},
`);
                        });
                        (0, sdkgen_1.Content)(`})
\`\`\`

`);
                    }
                    else if ('update' === opname || 'patch' === opname) {
                        // The id key plus every REQUIRED data member — the same shape
                        // that generates <Name>UpdateData — then the patch-fields note.
                        const updateItems = (0, sdkgen_1.opRequestShape)(ent, opname).items
                            .filter((it) => !it.optional || it.name === idF)
                            .sort((a, b) => (a.name === idF ? 0 : 1) - (b.name === idF ? 0 : 1));
                        const updateLines = updateItems.map((it) => `  ${(0, sdkgen_1.jsKey)(it.name)}: ${(0, utility_ts_1.exampleValue)(ent, ent.op && ent.op[opname], it.name, it.name === idF ? ent.name + '_id' : it.name)},\n`).join('');
                        (0, sdkgen_1.Content)(`\`\`\`ts
const result = await client.${ent.Name}().${opname}({
${updateLines}  // ${'patch' === opname ? 'Only the fields to change' : 'Fields to update'}
})
\`\`\`

`);
                    }
                    if ('create' === opname || 'update' === opname || 'patch' === opname) {
                        const note = (0, sdkgen_1.bodyNote)(ent.op[opname], {
                            values: 'a `Buffer`, `Uint8Array`, `ArrayBuffer`, `Blob`, stream or string',
                            once: 'a stream',
                        });
                        if ('' !== note)
                            (0, sdkgen_1.Content)(note);
                    }
                });
            }
            // Common methods
            (0, sdkgen_1.Content)(`### Common Methods

#### \`data(data?: object)\`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### \`match(match?: object)\`

Get or set the entity match criteria. Works the same as \`data()\`.

#### \`make()\`

Create a new \`${ent.Name}Entity\` instance with the same client and
options.

#### \`client()\`

Return the parent \`${model.Name}SDK\` instance.

#### \`entopts()\`

Return a copy of the entity options.

`);
        });
        // Features section
        const activeFeatures = (0, sdkgen_1.each)(feature).filter((f) => f.active);
        if (activeFeatures.length > 0) {
            (0, sdkgen_1.Content)(`
---

## Features

| Feature | Version | Description |
| --- | --- | --- |
`);
            activeFeatures.map((f) => {
                (0, sdkgen_1.Content)(`| \`${f.name}\` | ${f.version || '0.0.1'} | ${f.title || ''} |
`);
            });
            (0, sdkgen_1.Content)(`

Features are activated via the \`feature\` option:

`);
            (0, sdkgen_1.Content)(`\`\`\`ts
const client = new ${model.Name}SDK({
  feature: {
`);
            activeFeatures.map((f) => {
                (0, sdkgen_1.Content)(`    ${f.name}: { active: true },
`);
            });
            (0, sdkgen_1.Content)(`  }
})
\`\`\`

`);
            (0, sdkgen_2.ReadmeRefFeatures)({ target });
        }
    });
});
exports.ReadmeRef = ReadmeRef;
//# sourceMappingURL=ReadmeRef_ts.js.map
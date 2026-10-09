"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadmeModel = void 0;
const sdkgen_1 = require("@voxgig/sdkgen");
const apidef_1 = require("@voxgig/apidef");
const ReadmeModel = (0, sdkgen_1.cmp)(function ReadmeModel(props) {
    const { target, ctx$: { model } } = props;
    const entity = (0, apidef_1.getModelPath)(model, `main.${apidef_1.KIT}.entity`);
    const entityList = (0, sdkgen_1.each)(entity).filter((e) => e.active !== false);
    // Model-driven op rows for the shared entity interface: emit a
    // load/list/create/update/patch/remove row only for operations at least one active
    // entity actually exposes (a read-only entity has just list+load) — never
    // document an operation no entity has.
    const opUnion = new Set();
    entityList.forEach((e) => Object.keys(e.op || {})
        .forEach((o) => { if (e.op[o] && e.op[o].active !== false)
        opUnion.add(o); }));
    const opRowDefs = {
        load: '| `load` | `load(reqmatch?, ctrl?): Promise<Entity>` | Load a single entity by match criteria, and return it. |',
        list: '| `list` | `list(reqmatch?, ctrl?): Promise<Entity[]>` | List entities matching the criteria, one per record. |',
        create: '| `create` | `create(reqdata?, ctrl?): Promise<Entity>` | Create a new entity, and return it. |',
        update: '| `update` | `update(reqdata?, ctrl?): Promise<Entity>` | Update an existing entity, and return it. |',
        patch: '| `patch` | `patch(reqdata?, ctrl?): Promise<Entity>` | Change part of an existing entity, and return it. |',
        remove: '| `remove` | `remove(reqmatch?, ctrl?): Promise<Entity>` | Remove an entity, and return it marked as deleted. |',
    };
    const opRows = ['load', 'list', 'create', 'update', 'patch', 'remove']
        .filter((o) => opUnion.has(o)).map((o) => opRowDefs[o]).join('\n');
    const singleOps = ['load', 'create', 'update', 'patch'].filter((o) => opUnion.has(o))
        .map((o) => '`' + o + '`');
    const retBullets = [];
    if (singleOps.length) {
        const joined = singleOps.length > 1
            ? singleOps.slice(0, -1).join(', ') + ' and ' + singleOps[singleOps.length - 1]
            : singleOps[0];
        retBullets.push(`- ${joined} ${singleOps.length > 1 ? 'resolve' : 'resolves'} to a single entity object.`);
    }
    if (opUnion.has('list')) {
        retBullets.push('- `list` resolves to an **array** of entity objects (iterate it directly;\n  there is no `.data` and no `.ok`).');
    }
    if (opUnion.has('remove')) {
        retBullets.push('- `remove` resolves to the entity, marked as deleted.');
    }
    const returnBullets = retBullets.join('\n');
    const authActive = (0, sdkgen_1.isAuthActive)(model);
    const authBasic = authActive && (0, sdkgen_1.isHttpBasicAuth)(model);
    const apikeyOptionType = authActive ? `\n  apikey?: string` : '';
    const secretOptionType = authBasic ? `\n  secret?: string` : '';
    const apikeyOptionRow = authActive
        ? '| `apikey` | `string` | API key for authentication. |\n'
        : '';
    const secretOptionRow = authBasic
        ? '| `secret` | `string` | API secret for authentication. |\n'
        : '';
    // Server variables are not one option among many: without them the
    // constructor THROWS, because the base URL is a template. Documented
    // first for that reason, and named individually so a reader knows what
    // to supply without going back to the spec.
    const svars = (0, sdkgen_1.serverVariables)(model);
    const serverOptionType = 0 === svars.length ? '' :
        `\n  server?: { ${svars.map((v) => `${v.name}: string`).join(', ')} }`;
    const serverOptionRow = 0 === svars.length ? '' :
        '| `server` | `object` | **Required.** Values for the server-URL variables: ' +
            svars.map((v) => '`' + v.name + '`').join(', ') +
            '. The API base URL is a template over them. |\n';
    (0, sdkgen_1.Content)(`### ${model.const.Name}SDK

#### Constructor

\`\`\`ts
new ${model.const.Name}SDK(options?: {${apikeyOptionType}${secretOptionType}${serverOptionType}
  base?: string
  prefix?: string
  suffix?: string
  feature?: Record<string, { active: boolean }>
  extend?: Feature[]
})
\`\`\`

| Option | Type | Description |
| --- | --- | --- |
${serverOptionRow}${apikeyOptionRow}${secretOptionRow}| \`base\` | \`string\` | Base URL of the API server. |
| \`prefix\` | \`string\` | URL path prefix prepended to all requests. |
| \`suffix\` | \`string\` | URL path suffix appended to all requests. |
| \`feature\` | \`object\` | Feature activation flags (e.g. \`{ test: { active: true } }\`). |
| \`extend\` | \`Feature[]\` | Additional feature instances to load. |

#### Methods

| Method | Returns | Description |
| --- | --- | --- |
| \`options()\` | \`object\` | Deep copy of current SDK options. |
| \`utility()\` | \`Utility\` | Deep copy of the SDK utility object. |
| \`prepare(fetchargs?)\` | \`Promise<FetchDef>\` | Build an HTTP request definition without sending it. |
| \`direct(fetchargs?)\` | \`Promise<DirectResult>\` | Build and send an HTTP request. |
`);
    (0, sdkgen_1.each)(entityList, (ent) => {
        const article = /^[aeiou]/i.test(ent.Name) ? 'an' : 'a';
        (0, sdkgen_1.Content)(`| \`${ent.Name}(data?)\` | \`${ent.Name}Entity\` | Create ${article} ${ent.Name} entity instance. |
`);
    });
    (0, sdkgen_1.Content)(`| \`tester(testopts?, sdkopts?)\` | \`${model.const.Name}SDK\` | Create a test-mode client instance. |

#### Static methods

| Method | Returns | Description |
| --- | --- | --- |
| \`${model.const.Name}SDK.test(testopts?, sdkopts?)\` | \`${model.const.Name}SDK\` | Create a test-mode client. |

### Entity interface

All entities share the same interface.

#### Methods

| Method | Signature | Description |
| --- | --- | --- |
${opRows}
| \`data\` | \`data(data?: Partial<Entity>): Entity\` | Get or set entity data. |
| \`match\` | \`match(match?: Partial<Entity>): Partial<Entity>\` | Get or set entity match criteria. |
| \`make\` | \`make(): Entity\` | Create a new instance with the same options. |
| \`client\` | \`client(): ${model.const.Name}SDK\` | Return the parent SDK client. |
| \`entopts\` | \`entopts(): object\` | Return a copy of the entity options. |

#### Return values

Entity operations resolve to the entity itself — there is no result
envelope, and an entity's \`data()\` reads its record:

${returnBullets}

On a failed request these methods **throw**, so wrap calls in
\`try\`/\`catch\` to handle errors. Only \`direct()\` returns the result
envelope described below.

### DirectResult shape

The \`direct()\` method returns:

\`\`\`ts
{
  ok: boolean
  status: number
  headers: object
  data: any
}
\`\`\`

On error, \`ok\` is \`false\` and an \`err\` property contains the error.

### FetchDef shape

The \`prepare()\` method returns:

\`\`\`ts
{
  url: string
  method: string
  headers: Record<string, string>
  body?: any
}
\`\`\`

### Entities

`);
    (0, sdkgen_1.each)(entityList, (ent) => {
        const fields = Object.values(ent.fields || {});
        const opnames = Object.keys(ent.op || {});
        const ops = ent.op || {};
        const points = (0, sdkgen_1.each)(ops).map((op) => op.points ? (0, sdkgen_1.each)(op.points) : []).flat();
        const path = points.length > 0 ? points[0].o || '' : '';
        (0, sdkgen_1.Content)(`#### ${ent.Name}

| Field | Description |
| --- | --- |
`);
        (0, sdkgen_1.each)(fields, (field) => {
            (0, sdkgen_1.Content)(`| \`${field.n}\` | ${field.sh || ''} |
`);
        });
        (0, sdkgen_1.Content)(`
Operations: ${opnames.join(', ')}.

API path: \`${path}\`

`);
    });
});
exports.ReadmeModel = ReadmeModel;
//# sourceMappingURL=ReadmeModel_ts.js.map
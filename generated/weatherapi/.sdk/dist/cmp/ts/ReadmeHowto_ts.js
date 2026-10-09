"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadmeHowto = void 0;
const sdkgen_1 = require("@voxgig/sdkgen");
const apidef_1 = require("@voxgig/apidef");
const utility_ts_1 = require("./utility_ts");
const ReadmeHowto = (0, sdkgen_1.cmp)(function ReadmeHowto(props) {
    const { target, ctx$: { model } } = props;
    const entity = (0, apidef_1.getModelPath)(model, `main.${apidef_1.KIT}.entity`);
    const { entity: exampleEntity, primaryOp } = (0, sdkgen_1.pickExampleEntity)(entity);
    const eName = exampleEntity ? (0, apidef_1.nom)(exampleEntity, 'Name') : 'Entity';
    const eVar = (0, sdkgen_1.exampleVarName)(eName.toLowerCase(), 'ts');
    const primaryOpDef = exampleEntity && primaryOp && exampleEntity.op && exampleEntity.op[primaryOp];
    const isMatchOp = 'load' === primaryOp || 'remove' === primaryOp;
    // Model-driven id key: `idF` is the entity's id-like MATCH field name, or null
    // when it has none. `dataIdF` is the id on the RETURNED record's data type —
    // reading `.id` off a record whose data type has none is a TS2339.
    const idF = exampleEntity ? (0, sdkgen_1.entityIdField)(exampleEntity) : null;
    const dataIdF = exampleEntity ? (0, sdkgen_1.entityDataIdField)(exampleEntity) : null;
    const primaryArg = (idPlaceholder) => {
        if (!exampleEntity || !primaryOp)
            return '';
        if (isMatchOp || 'list' === primaryOp) {
            // Every REQUIRED match key (id first), not just idF — a composite-match
            // entity (e.g. Umbrella's FlatPermission, database_id + id) needs them all
            // to satisfy the typed <Name>LoadMatch. Mirrors ReadmeTopTest.
            const items = (isMatchOp ? (0, sdkgen_1.opRequestShape)(exampleEntity, primaryOp).items
                .filter((it) => !it.optional || it.name === idF) : (0, sdkgen_1.requiredItems)(exampleEntity, 'list'))
                .sort((a, b) => (a.name === idF ? 0 : 1) - (b.name === idF ? 0 : 1));
            if (0 === items.length)
                return '';
            const pairs = items.map((it) => `${(0, sdkgen_1.jsKey)(it.name)}: ${(0, utility_ts_1.exampleValue)(exampleEntity, primaryOpDef, it.name, it.name === idF ? idPlaceholder : 'example_' + it.name)}`);
            return `{ ${pairs.join(', ')} }`;
        }
        const isIdField = (it) => it.name === idF || it.name === 'id';
        const items = (0, sdkgen_1.opRequestShape)(exampleEntity, primaryOp).items
            .filter((it) => !isIdField(it) || !it.optional);
        const required = items.filter((it) => !it.optional);
        const chosen = required.length ? required : items.slice(0, 3);
        const pairs = chosen.map((it) => `${(0, sdkgen_1.jsKey)(it.name)}: ${(0, utility_ts_1.exampleValue)(exampleEntity, primaryOpDef, it.name, isIdField(it) ? idPlaceholder : 'example_' + it.name)}`);
        return `{ ${pairs.join(', ')} }`;
    };
    const testCallArg = primaryArg('test01');
    const stateCallArg = primaryArg('example');
    const stateDataLine = dataIdF
        ? `console.log(data.${dataIdF})`
        : `console.log(data)`;
    // The op-driven example lines, shown only when the SDK has an entity op.
    // A direct()-only SDK (no ops anywhere) shows a direct() test call instead.
    const testModeExample = 'list' === primaryOp
        ? `const ${eVar}s = await client.${eName}().list(${testCallArg})
// ${eVar}s is an array of ${eName} entities, one per mock record
console.log(${eVar}s.map((${eVar}) => ${eVar}.data()))`
        : primaryOp
            ? `const ${eVar} = await client.${eName}().${primaryOp}(${testCallArg})
// ${eVar} is the ${eName} entity; .data() reads its mock record
console.log(${eVar}.data())`
            : `const result = await client.direct({ path: '/api/resource', method: 'GET' })
console.log(result)`;
    const stateSection = primaryOp
        ? `### Retain entity state across calls

Entity instances remember their last match and data:

\`\`\`ts
const entity = client.${eName}()

// First call runs the operation and stores its result
await entity.${primaryOp}(${stateCallArg})

// Subsequent calls reuse the stored state
const data = entity.data()
${stateDataLine}
\`\`\`

`
        : '';
    const authActive = (0, sdkgen_1.isAuthActive)(model);
    const authBasic = authActive && (0, sdkgen_1.isHttpBasicAuth)(model);
    const apikeyTesterCtor = authActive
        ? `new ${model.const.Name}SDK({ apikey: '...'${authBasic ? `, secret: '...'` : ''} })`
        : `new ${model.const.Name}SDK()`;
    const apikeyExtendField = authActive
        ? `\n  apikey: '...',${authBasic ? `\n  secret: '...',` : ''}`
        : '';
    const apikeyEnvLine = authActive
        ? `\n${(0, sdkgen_1.envName)(model)}_APIKEY=<your-key>${authBasic ? `\n${(0, sdkgen_1.envName)(model)}_SECRET=<your-secret>` : ''}`
        : '';
    (0, sdkgen_1.Content)(`### Make a direct HTTP request

For endpoints not covered by entity methods:

\`\`\`ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example' },
})

if (result.ok) {
  console.log(result.status)  // 200
  console.log(result.data)    // response body
}
\`\`\`

### Prepare a request without sending it

\`\`\`ts
const fetchdef = await client.prepare({
  path: '/api/resource/{id}',
  method: 'DELETE',
  params: { id: 'example' },
})

// Inspect before sending
console.log(fetchdef.url)
console.log(fetchdef.method)
console.log(fetchdef.headers)
\`\`\`

### Use test mode

Create a mock client for unit testing \u2014 no server required:

\`\`\`ts
const client = ${model.const.Name}SDK.test()

${testModeExample}
\`\`\`

You can also use the instance method:

\`\`\`ts
const client = ${apikeyTesterCtor}
const testClient = client.tester()
\`\`\`

${stateSection}### Add custom middleware

Pass features via the \`extend\` option:

\`\`\`ts
const logger = {
  hooks: {
    PreRequest: (ctx: any) => {
      console.log('Requesting:', ctx.spec.method, ctx.spec.path)
    },
    PreResponse: (ctx: any) => {
      console.log('Status:', ctx.out.request?.status)
    },
  },
}

const client = new ${model.const.Name}SDK({${apikeyExtendField}
  extend: [logger],
})
\`\`\`

### Run live tests

Create a \`.env.local\` file at the project root:

\`\`\`
${(0, sdkgen_1.envName)(model)}_TEST_LIVE=TRUE${apikeyEnvLine}
\`\`\`

Then run:

\`\`\`bash
cd ts && npm test
\`\`\`

Live entity tests continue independent operations after errors and attempt
supported cleanup. Their final result reports failures and missing prerequisites
after the remaining work completes. The model and test inputs determine which
API operations the generated scenarios cover.

`);
});
exports.ReadmeHowto = ReadmeHowto;
//# sourceMappingURL=ReadmeHowto_ts.js.map
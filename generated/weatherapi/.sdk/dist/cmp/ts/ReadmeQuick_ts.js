"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadmeQuick = void 0;
const sdkgen_1 = require("@voxgig/sdkgen");
const apidef_1 = require("@voxgig/apidef");
const utility_ts_1 = require("./utility_ts");
const ReadmeQuick = (0, sdkgen_1.cmp)(function ReadmeQuick(props) {
    const { target, ctx$: { model } } = props;
    const entity = (0, apidef_1.getModelPath)(model, `main.${apidef_1.KIT}.entity`);
    const exampleEntity = Object.values(entity).find((e) => e.active !== false);
    const nestedEntity = Object.values(entity).find((e) => e.active !== false &&
        e.relations && e.relations.ancestors && 0 < e.relations.ancestors.length &&
        (0, sdkgen_1.entityOps)(e).includes('load') &&
        (0, sdkgen_1.opRequestShape)(e, 'load').items.some((it) => !it.optional && it.name !== (0, sdkgen_1.entityIdField)(e)));
    // Server variables (a templated server URL) are REQUIRED at construction
    // — makeOptions refuses rather than request a URL with a literal
    // `{account_id}` in it — so a quickstart that omits them is a quickstart
    // that throws on its first line.
    const svarLines = (0, sdkgen_1.serverVariables)(model)
        .map((v) => `\n    ${v.name}: '<${v.name}>',`).join('');
    const serverField = '' === svarLines ? '' :
        `\n  // Required: this API's server URL is templated on these.\n  server: {${svarLines}\n  },`;
    const ctorFields = ((0, sdkgen_1.isAuthActive)(model)
        ? `\n  apikey: process.env.${(0, sdkgen_1.envName)(model)}_APIKEY,${(0, sdkgen_1.isHttpBasicAuth)(model) ? `\n  secret: process.env.${(0, sdkgen_1.envName)(model)}_SECRET,` : ''}`
        : '') + serverField;
    const ctor = '' === ctorFields
        ? `new ${model.const.Name}SDK()`
        : `new ${model.const.Name}SDK({${ctorFields}\n})`;
    (0, sdkgen_1.Content)(`### 1. Create a client

\`\`\`ts
import { ${model.const.Name}SDK } from '${(0, sdkgen_1.packageName)(model, target.name)}'

const client = ${ctor}
\`\`\`

`);
    if (exampleEntity) {
        const eName = (0, apidef_1.nom)(exampleEntity, 'Name');
        const eVar = (0, sdkgen_1.exampleVarName)(eName.toLowerCase(), 'ts');
        const article = /^[aeiou]/i.test(eName) ? 'an' : 'a';
        const opnames = (0, sdkgen_1.entityOps)(exampleEntity);
        const idF = (0, sdkgen_1.entityIdField)(exampleEntity);
        // The id field on the RETURNED record's data type, or null. DISTINCT from
        // idF (the match key): an entity can key its load-match on an id it does not
        // carry as a data field, so `.id` off a returned record must be guarded on
        // this — reading `created.id` when the data type has no id is a TS2339.
        const dataIdF = (0, sdkgen_1.entityDataIdField)(exampleEntity);
        if (opnames.includes('list')) {
            (0, sdkgen_1.Content)(`### 2. List ${eName.toLowerCase()} records

\`list()\` resolves to an array of ${eName} ENTITIES — every operation
resolves to entities, not raw records. Iterate them directly, and call
\`.data()\` on one for the record it holds:

\`\`\`ts
const ${eVar}s = await client.${eName}().list(${(0, sdkgen_1.listMatchArg)('ts', exampleEntity)})

for (const ${eVar} of ${eVar}s) {
  console.log(${eVar}.data())
}
\`\`\`

`);
        }
        if (nestedEntity) {
            const neName = (0, apidef_1.nom)(nestedEntity, 'Name');
            const neVar = (0, sdkgen_1.exampleVarName)(neName.toLowerCase(), 'ts');
            const neArticle = /^[aeiou]/i.test(neName) ? 'an' : 'a';
            const loadOp = nestedEntity.op && nestedEntity.op.load;
            const neIdF = (0, sdkgen_1.entityIdField)(nestedEntity);
            const neRequired = (0, sdkgen_1.opRequestShape)(nestedEntity, 'load').items
                .filter((it) => !it.optional)
                .sort((a, b) => (a.name === neIdF ? 1 : 0) - (b.name === neIdF ? 1 : 0));
            const parentItem = neRequired.find((it) => it.name !== neIdF);
            const parentParam = parentItem && parentItem.name;
            const parentName = parentParam ? parentParam.replace(/_id$/, '') : 'its parent';
            const neMatchLines = neRequired.map((it) => `    ${(0, sdkgen_1.jsKey)(it.name)}: ${(0, utility_ts_1.exampleValue)(nestedEntity, loadOp, it.name, it.name === neIdF ? 'example_id' : 'example_' + it.name)},`);
            (0, sdkgen_1.Content)(`### 3. Load ${neArticle} ${neName.toLowerCase()}

${neName} is nested under ${parentName}, so provide the \`${parentParam}\`.
\`load()\` returns the entity and throws on failure; \`.data()\` reads its record:

\`\`\`ts
try {
  const ${neVar} = await client.${neName}().load({
${neMatchLines.join('\n')}
  })
  console.log(${neVar}.data())
} catch (err) {
  console.error('load failed:', err)
}
\`\`\`

`);
        }
        else if (opnames.includes('load')) {
            const loadRequired = (0, sdkgen_1.opRequestShape)(exampleEntity, 'load').items
                .filter((it) => !it.optional || it.name === idF)
                .sort((a, b) => (a.name === idF ? 0 : 1) - (b.name === idF ? 0 : 1));
            const loadArg = 0 < loadRequired.length
                ? `{ ${loadRequired.map((it) => `${(0, sdkgen_1.jsKey)(it.name)}: ${(0, utility_ts_1.exampleValue)(exampleEntity, exampleEntity.op && exampleEntity.op.load, it.name, it.name === idF ? 'example_id' : 'example_' + it.name)}`).join(', ')} }`
                : '';
            (0, sdkgen_1.Content)(`### 3. Load ${article} ${eName.toLowerCase()}

\`load()\` returns the entity and throws on failure; \`.data()\` reads its record:

\`\`\`ts
try {
  const ${eVar} = await client.${eName}().load(${loadArg})
  console.log(${eVar}.data())
} catch (err) {
  console.error('load failed:', err)
}
\`\`\`

`);
        }
        // CRUD operations. The create/update example payloads are derived from the
        // SAME op shapes that generate the <Name>CreateData / <Name>UpdateData types
        // (opRequestShape), so the snippet always type-checks. Prefer writable
        // non-id fields and render a type-correct literal per field via
        // exampleValue — never a hardcoded field the entity may not have.
        if (opnames.includes('create') || opnames.includes('update') || opnames.includes('patch') ||
            opnames.includes('remove')) {
            const exampleFields = (opname) => {
                const items = (0, sdkgen_1.opRequestShape)(exampleEntity, opname).items
                    .filter((it) => (it.name !== idF && it.name !== 'id') ||
                    ('create' === opname && !it.optional));
                const required = items.filter((it) => !it.optional);
                const optional = items.filter((it) => it.optional);
                const chosen = 'create' === opname
                    ? (required.length ? required : items.slice(0, 2))
                    : required.concat(optional).slice(0, Math.max(2, required.length));
                return chosen.map((it) => `  ${(0, sdkgen_1.jsKey)(it.name)}: ${(0, utility_ts_1.exampleValue)(exampleEntity, exampleEntity.op[opname], it.name, 'example_' + it.name)},`);
            };
            const dataFields = exampleEntity.fields ? (0, sdkgen_1.each)(exampleEntity.fields) : [];
            // A model field spells its type `t`; `type` is the older model shape.
            const dataIdField = dataIdF
                ? dataFields.find((f) => f && f.n === dataIdF)
                : null;
            const dataIdType = dataIdField ? (dataIdField.t ?? dataIdField.type) : null;
            // An unknown type is not evidence of compatibility: chain only on a
            // known match, since the literal example type-checks by construction.
            const usesCreatedId = (opname) => {
                if (null == dataIdF || !opnames.includes('create')) {
                    return false;
                }
                const matchItem = (0, sdkgen_1.opRequestShape)(exampleEntity, opname).items
                    .find((it) => it.name === idF);
                // OpShapeItem spells it `type`; only the raw model field uses `t`.
                const matchType = matchItem ? matchItem.type : null;
                return null != matchType && null != dataIdType && matchType === dataIdType;
            };
            const idValueFor = (opname) => usesCreatedId(opname)
                ? `created.data().${dataIdF}!`
                : (0, utility_ts_1.exampleValue)(exampleEntity, exampleEntity.op[opname], idF, 'example_id');
            (0, sdkgen_1.Content)(`### 4. Create, update, and remove

\`\`\`ts
`);
            if (opnames.includes('create')) {
                const createLines = exampleFields('create');
                const createBody = createLines.length ? '\n' + createLines.join('\n') + '\n' : '';
                (0, sdkgen_1.Content)(`// Create — returns the created ${eName} ENTITY (.data() for the record)
const created = await client.${eName}().create({${createBody}})

`);
            }
            if (opnames.includes('update')) {
                const updateLines = (idF ? [`  ${idF}: ${idValueFor('update')},`] : []).concat(exampleFields('update'));
                const updateBody = updateLines.length ? '\n' + updateLines.join('\n') + '\n' : '';
                (0, sdkgen_1.Content)(`// Update${usesCreatedId('update') ? ' — the id comes off the returned entity\'s data()' : ''}
const updated = await client.${eName}().update({${updateBody}})

`);
            }
            if (opnames.includes('patch')) {
                const patchLines = (idF ? [`  ${idF}: ${idValueFor('patch')},`] : []).concat(exampleFields('patch'));
                const patchBody = patchLines.length ? '\n' + patchLines.join('\n') + '\n' : '';
                (0, sdkgen_1.Content)(`// Patch — sends only the fields given${usesCreatedId('patch') ? '; the id comes off the returned entity\'s data()' : ''}
const patched = await client.${eName}().patch({${patchBody}})

`);
            }
            if (opnames.includes('remove')) {
                const removeLines = (0, sdkgen_1.opRequestShape)(exampleEntity, 'remove').items
                    .filter((it) => !it.optional || it.name === idF)
                    .sort((a, b) => (a.name === idF ? 0 : 1) - (b.name === idF ? 0 : 1))
                    .map((it) => it.name === idF
                    ? `  ${(0, sdkgen_1.jsKey)(it.name)}: ${idValueFor('remove')},`
                    : `  ${(0, sdkgen_1.jsKey)(it.name)}: ${(0, utility_ts_1.exampleValue)(exampleEntity, exampleEntity.op.remove, it.name, 'example_' + it.name)},`);
                (0, sdkgen_1.Content)(`// Remove
await client.${eName}().remove(${removeLines.length ? `{\n${removeLines.join('\n')}\n}` : ''})
`);
            }
            (0, sdkgen_1.Content)(`\`\`\`

`);
        }
    }
});
exports.ReadmeQuick = ReadmeQuick;
//# sourceMappingURL=ReadmeQuick_ts.js.map
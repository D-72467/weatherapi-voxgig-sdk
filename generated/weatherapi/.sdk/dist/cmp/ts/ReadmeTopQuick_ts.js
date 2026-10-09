"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadmeTopQuick = void 0;
const sdkgen_1 = require("@voxgig/sdkgen");
const apidef_1 = require("@voxgig/apidef");
const utility_ts_1 = require("./utility_ts");
const ReadmeTopQuick = (0, sdkgen_1.cmp)(function ReadmeTopQuick(props) {
    const { target, ctx$: { model } } = props;
    const entity = (0, apidef_1.getModelPath)(model, `main.${apidef_1.KIT}.entity`);
    const exampleEntity = Object.values(entity).find((e) => e.active !== false);
    const authActive = (0, sdkgen_1.isAuthActive)(model);
    // Server variables (a templated server URL) are REQUIRED at construction
    // - makeOptions refuses rather than request a URL with a literal
    // {account_id} in it - so a quickstart that omits them is a quickstart
    // that throws on its first line.
    const svarLines = (0, sdkgen_1.serverVariables)(model)
        .map((v) => `\n    ${v.name}: '<${v.name}>',`).join('');
    const serverField = '' === svarLines ? '' :
        `\n  // Required: this API's server URL is templated on these.\n  server: {${svarLines}\n  },`;
    const ctorFields = (authActive
        ? `\n  apikey: process.env.${(0, sdkgen_1.envName)(model)}_APIKEY,${(0, sdkgen_1.isHttpBasicAuth)(model) ? `\n  secret: process.env.${(0, sdkgen_1.envName)(model)}_SECRET,` : ''}`
        : '') + serverField;
    const ctor = '' === ctorFields
        ? `new ${model.const.Name}SDK()`
        : `new ${model.const.Name}SDK({${ctorFields}\n})`;
    (0, sdkgen_1.Content)(`\`\`\`ts
import { ${model.const.Name}SDK } from '${(0, sdkgen_1.packageName)(model, target.name)}'

const client = ${ctor}

`);
    if (exampleEntity) {
        const eName = (0, apidef_1.nom)(exampleEntity, 'Name');
        const eVar = (0, sdkgen_1.exampleVarName)(eName.toLowerCase(), 'ts');
        const opnames = (0, sdkgen_1.entityOps)(exampleEntity);
        let hasCall = false;
        if (opnames.includes('list')) {
            (0, sdkgen_1.Content)(`// List all ${eName.toLowerCase()}s (returns ${eName}Entity[], one entity per record)
const ${eVar}s = await client.${eName}().list(${(0, sdkgen_1.listMatchArg)('ts', exampleEntity)})
for (const ${eVar} of ${eVar}s) {
  console.log(${eVar}.data())
}
`);
            hasCall = true;
        }
        // Find a nested entity for a more interesting example: one with a parent
        // chain, an active load op of its OWN, and a required non-id load param
        // to demonstrate (the parent key, e.g. page_id).
        const nestedEntity = Object.values(entity).find((e) => e.active !== false &&
            e.relations && e.relations.ancestors && 0 < e.relations.ancestors.length &&
            (0, sdkgen_1.entityOps)(e).includes('load') &&
            (0, sdkgen_1.opRequestShape)(e, 'load').items.some((it) => !it.optional && it.name !== (0, sdkgen_1.entityIdField)(e)));
        if (nestedEntity) {
            const neName = (0, apidef_1.nom)(nestedEntity, 'Name');
            const neVar = (0, sdkgen_1.exampleVarName)(neName.toLowerCase(), 'ts');
            const loadOp = nestedEntity.op && nestedEntity.op.load;
            const neIdF = (0, sdkgen_1.entityIdField)(nestedEntity);
            const neMatchLines = (0, sdkgen_1.opRequestShape)(nestedEntity, 'load').items
                .filter((it) => !it.optional || it.name === neIdF)
                .sort((a, b) => (a.name === neIdF ? 1 : 0) - (b.name === neIdF ? 1 : 0))
                .map((it) => `  ${(0, sdkgen_1.jsKey)(it.name)}: ${(0, utility_ts_1.exampleValue)(nestedEntity, loadOp, it.name, it.name === neIdF ? 'example_id' : 'example_' + it.name)},`);
            (0, sdkgen_1.Content)(`
// Load a specific ${neName.toLowerCase()} (returns the entity, ${/^[aeiou]/i.test(neName) ? 'an' : 'a'} ${neName}Entity)
const ${neVar} = await client.${neName}().load({
${neMatchLines.join('\n')}
})
console.log(${neVar}.data())
`);
            hasCall = true;
        }
        if (!hasCall && opnames.includes('load')) {
            (0, sdkgen_1.Content)(`// Load a specific ${eName.toLowerCase()} (returns the entity, ${/^[aeiou]/i.test(eName) ? 'an' : 'a'} ${eName}Entity)
const ${eVar} = await client.${eName}().load()
console.log(${eVar}.data())
`);
            hasCall = true;
        }
    }
    (0, sdkgen_1.Content)(`\`\`\`
`);
});
exports.ReadmeTopQuick = ReadmeTopQuick;
//# sourceMappingURL=ReadmeTopQuick_ts.js.map
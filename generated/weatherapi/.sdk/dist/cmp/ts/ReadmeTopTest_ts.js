"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadmeTopTest = void 0;
const sdkgen_1 = require("@voxgig/sdkgen");
const apidef_1 = require("@voxgig/apidef");
const utility_ts_1 = require("./utility_ts");
const ReadmeTopTest = (0, sdkgen_1.cmp)(function ReadmeTopTest(props) {
    const { target, ctx$: { model } } = props;
    const entity = (0, apidef_1.getModelPath)(model, `main.${apidef_1.KIT}.entity`);
    // Pick an entity with a real op (prefer a read op) — never fabricate a
    // `load` on an op-less entity like Cloudsmith's `Abort`.
    const { entity: exampleEntity, primaryOp } = (0, sdkgen_1.pickExampleEntity)(entity);
    const seedEntity = exampleEntity ? (0, apidef_1.nom)(exampleEntity, 'name') : '';
    const seedFields = exampleEntity ?
        (0, sdkgen_1.opRequestShape)(exampleEntity, 'create').items
            .filter((it) => !it.optional)
            .slice(0, 3) : [];
    const seedId = 'test01';
    const idF = exampleEntity ? (0, sdkgen_1.entityIdField)(exampleEntity) : null;
    const isIdField = (it) => it.name === idF || it.name === 'id';
    // A list matches its required parameters against the record, so the seed
    // carries the values the call below sends, and an id is the record's key.
    const listItems = 'list' === primaryOp ? (0, sdkgen_1.requiredItems)(exampleEntity, 'list') : [];
    const listed = (it) => listItems.some((li) => li.name === it.name);
    const listLit = (it) => (0, utility_ts_1.exampleValue)(exampleEntity, exampleEntity.op.list, it.name, isIdField(it) ? seedId : 'example_' + it.name);
    const seedBody = [
        `${(0, sdkgen_1.jsKey)('id')}: '${seedId}'`,
        ...[...seedFields, ...listItems.filter((it) => !seedFields.some((sf) => sf.name === it.name))]
            .filter((it) => 'id' !== it.name)
            .map((it) => `${(0, sdkgen_1.jsKey)(it.name)}: ${listed(it) ? listLit(it) : (0, utility_ts_1.exampleValue)(exampleEntity, exampleEntity.op && exampleEntity.op.create, it.name, 'example_' + it.name)}`),
    ].join(', ');
    (0, sdkgen_1.Content)(`\`\`\`ts
// The offline mock starts EMPTY — seed it with the records the test needs.
// Shape: { entity: { <entity-name>: { <id>: <record> } } }
const client = ${model.const.Name}SDK.test({
  entity: {
    ${seedEntity}: {
      ${seedId}: { ${seedBody} },
    },
  },
})
`);
    if (exampleEntity && primaryOp) {
        const eName = (0, apidef_1.nom)(exampleEntity, 'Name');
        // A list() result is an array — name the variable accordingly.
        const eVar = (0, sdkgen_1.exampleVarName)(eName.toLowerCase(), 'ts') +
            ('list' === primaryOp ? 's' : '');
        const primaryOpDef = exampleEntity.op && exampleEntity.op[primaryOp];
        let arg = '';
        const isMatchOp = 'load' === primaryOp || 'remove' === primaryOp;
        if (isMatchOp || 'list' === primaryOp) {
            // Every REQUIRED match key (id first) — the same shape that generates
            // the op's Match type, so the block type-checks.
            const items = (isMatchOp ? (0, sdkgen_1.opRequestShape)(exampleEntity, primaryOp).items
                .filter((it) => !it.optional || it.name === idF) : [...listItems])
                .sort((a, b) => (a.name === idF ? 0 : 1) - (b.name === idF ? 0 : 1));
            const lit = (it) => isMatchOp
                ? (0, utility_ts_1.exampleValue)(exampleEntity, primaryOpDef, it.name, it.name === idF ? 'test01' : 'example_' + it.name)
                : listLit(it);
            arg = 0 < items.length
                ? `{ ${items.map((it) => `${(0, sdkgen_1.jsKey)(it.name)}: ${lit(it)}`).join(', ')} }`
                : '';
        }
        else if ('create' === primaryOp || 'update' === primaryOp || 'patch' === primaryOp) {
            const items = (0, sdkgen_1.opRequestShape)(exampleEntity, primaryOp).items
                .filter((it) => !isIdField(it) || !it.optional);
            const required = items.filter((it) => !it.optional);
            const chosen = required.length ? required : items.slice(0, 3);
            arg = `{ ${chosen.map((it) => 
            // A required id matches the record seeded into the mock above, so the
            // example reads as one coherent story rather than two.
            `${(0, sdkgen_1.jsKey)(it.name)}: ${(0, utility_ts_1.exampleValue)(exampleEntity, primaryOpDef, it.name, isIdField(it) ? seedId : 'example_' + it.name)}`).join(', ')} }`;
        }
        const one = (0, sdkgen_1.exampleVarName)(eName.toLowerCase(), 'ts');
        (0, sdkgen_1.Content)(`const ${eVar} = await client.${eName}().${primaryOp}(${arg})
${'list' === primaryOp
            ? `// ${eVar} is an array of ${eName} entities, one per mock record
console.log(${eVar}.map((${one}) => ${one}.data()))`
            : `// ${eVar} is the ${eName} entity; .data() reads its mock record
console.log(${eVar}.data())`}
`);
    }
    (0, sdkgen_1.Content)(`\`\`\`
`);
});
exports.ReadmeTopTest = ReadmeTopTest;
//# sourceMappingURL=ReadmeTopTest_ts.js.map
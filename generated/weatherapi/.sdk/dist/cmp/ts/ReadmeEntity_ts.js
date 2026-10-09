"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadmeEntity = void 0;
const sdkgen_1 = require("@voxgig/sdkgen");
const apidef_1 = require("@voxgig/apidef");
const utility_ts_1 = require("./utility_ts");
const OP_DESC = {
    load: { method: 'load(match)', desc: 'Load a single entity by match criteria.' },
    list: { method: 'list(match)', desc: 'List entities matching the criteria.' },
    create: { method: 'create(data)', desc: 'Create a new entity with the given data.' },
    update: { method: 'update(data)', desc: 'Update an existing entity.' },
    patch: { method: 'patch(data)', desc: 'Change part of an existing entity.' },
    remove: { method: 'remove(match)', desc: 'Remove the matching entity.' },
};
const ReadmeEntity = (0, sdkgen_1.cmp)(function ReadmeEntity(props) {
    const { target } = props;
    const { model } = props.ctx$;
    const entity = (0, apidef_1.getModelPath)(model, `main.${apidef_1.KIT}.entity`);
    const publishedEntities = (0, sdkgen_1.each)(entity)
        .filter((entity) => entity.active !== false);
    if (0 === publishedEntities.length) {
        return;
    }
    (0, sdkgen_1.Content)(`

## Entities

`);
    publishedEntities.map((entity) => {
        const opnames = Object.keys(entity.op || {});
        // An op that needs an action has no plain call to show.
        const callable = opnames.filter((o) => !(0, sdkgen_1.opNeedsAction)(entity.op[o]));
        const fields = Object.values(entity.fields || {});
        // Model-driven id key: null when this entity has no id-like field.
        const idF = (0, sdkgen_1.entityIdField)(entity);
        const eVar = (0, sdkgen_1.exampleVarName)(entity.name, target.name);
        (0, sdkgen_1.Content)(`
### ${entity.Name}

`);
        if (entity.short) {
            (0, sdkgen_1.Content)(`${entity.short}

`);
        }
        (0, sdkgen_1.Content)(`Create an instance: \`const ${eVar} = client.${entity.Name}()\`

`);
        if (opnames.length > 0) {
            (0, sdkgen_1.Content)(`#### Operations

| Method | Description |
| --- | --- |
`);
            opnames.map((opname) => {
                const info = OP_DESC[opname];
                if (info) {
                    (0, sdkgen_1.Content)(`| \`${info.method}\` | ${info.desc} |
`);
                }
            });
            (0, sdkgen_1.Content)(`
`);
        }
        if (fields.length > 0) {
            (0, sdkgen_1.Content)(`#### Fields

| Field | Type | Description |
| --- | --- | --- |
`);
            (0, sdkgen_1.each)(fields, (field) => {
                const desc = field.sh || '';
                (0, sdkgen_1.Content)(`| \`${field.n}\` | \`${(0, sdkgen_1.canonToType)(field.t, target.name)}\` | ${desc} |
`);
            });
            (0, sdkgen_1.Content)(`
`);
        }
        if (callable.includes('load')) {
            // The id key plus every REQUIRED match key (parent path params like
            // page_id) — the same shape that generates <Name>LoadMatch, so the
            // example always type-checks.
            const loadItems = (0, sdkgen_1.opRequestShape)(entity, 'load').items
                .filter((it) => !it.optional || it.name === idF)
                .sort((a, b) => (a.name === idF ? 0 : 1) - (b.name === idF ? 0 : 1));
            const loadArg = 0 < loadItems.length
                ? `{ ${loadItems.map((it) => `${(0, sdkgen_1.jsKey)(it.name)}: ${(0, utility_ts_1.exampleValue)(entity, entity.op && entity.op.load, it.name, it.name === idF ? entity.name + '_id' : it.name)}`).join(', ')} }`
                : '';
            (0, sdkgen_1.Content)(`#### Example: Load

\`\`\`ts
const ${eVar} = await client.${entity.Name}().load(${loadArg})
\`\`\`

`);
        }
        if (callable.includes('list')) {
            (0, sdkgen_1.Content)(`#### Example: List

\`\`\`ts
const ${eVar}s = await client.${entity.Name}().list(${(0, sdkgen_1.listMatchArg)('ts', entity)})
\`\`\`

`);
        }
        if (callable.includes('create')) {
            // Members come from the SAME shape that generates <Name>CreateData
            // (every required member appears), with a type-correct example VALUE
            // via exampleValue — a `name: /* type */` comment is not a value and
            // yields invalid TS (TS1109), so the example must carry a real literal.
            const createItems = (0, sdkgen_1.opRequestShape)(entity, 'create').items
                .filter((it) => !it.optional);
            (0, sdkgen_1.Content)(`#### Example: Create

\`\`\`ts
const ${eVar} = await client.${entity.Name}().create({
`);
            createItems.map((it) => {
                (0, sdkgen_1.Content)(`  ${(0, sdkgen_1.jsKey)(it.name)}: ${(0, utility_ts_1.exampleValue)(entity, entity.op && entity.op.create, it.name, 'example_' + it.name)},
`);
            });
            (0, sdkgen_1.Content)(`})
\`\`\`

`);
        }
    });
});
exports.ReadmeEntity = ReadmeEntity;
//# sourceMappingURL=ReadmeEntity_ts.js.map
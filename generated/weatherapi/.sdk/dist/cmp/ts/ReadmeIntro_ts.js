"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadmeIntro = void 0;
const sdkgen_1 = require("@voxgig/sdkgen");
const apidef_1 = require("@voxgig/apidef");
const ReadmeIntro = (0, sdkgen_1.cmp)(function ReadmeIntro(props) {
    const { target, ctx$: { model } } = props;
    const info = (0, sdkgen_1.modelText)(model);
    const tagline = info.tagline || '';
    const entity = (0, apidef_1.getModelPath)(model, `main.${apidef_1.KIT}.entity`);
    const exampleEntity = Object.values(entity).find((e) => e.active !== false);
    const eName = exampleEntity ? (0, apidef_1.nom)(exampleEntity, 'Name') : 'Entity';
    // Model-driven op list — only the operations the active entities actually
    // expose (a read-only entity has just list+load); never claim
    // create/update/remove exist when no entity has them.
    const CANON_OPS = ['list', 'load', 'create', 'update', 'patch', 'remove'];
    const opSet = new Set();
    Object.values(entity || {}).forEach((e) => {
        if (!e || e.active === false)
            return;
        Object.keys(e.op || {}).forEach((o) => {
            if (e.op[o] && e.op[o].active !== false)
                opSet.add(o);
        });
    });
    const opNames = CANON_OPS.filter((o) => opSet.has(o))
        .concat([...opSet].filter((o) => !CANON_OPS.includes(o)));
    const opList = (opNames.length ? opNames : ['list', 'load'])
        .map((o) => '`' + o + '`').join(', ');
    const targets = (0, apidef_1.getModelPath)(model, `main.${apidef_1.KIT}.target`) || {};
    const siblings = Object.entries(targets)
        .filter(([name, t]) => name !== target.name && false !== t.active)
        .map(([name]) => name)
        .sort();
    const siblingNote = 0 === siblings.length ? '' : `
> Also generated from this model: ${siblings.map((s) => '`' + s + '`').join(', ')} — see
> the [top-level README](../README.md).
`;
    (0, sdkgen_1.Content)(`# ${model.Name} ${target.title} SDK

${tagline}

The ${target.title} SDK for the ${model.Name} API — a type-safe, entity-oriented client with full async/await support.

The API is exposed as capitalised, semantic **Entities** — e.g.
\`client.${eName}()\` — each with a small set of operations (${opList})
instead of raw URL paths and query parameters. This keeps the surface
predictable and low-friction for both humans and AI agents.
${siblingNote}
`);
});
exports.ReadmeIntro = ReadmeIntro;
//# sourceMappingURL=ReadmeIntro_ts.js.map
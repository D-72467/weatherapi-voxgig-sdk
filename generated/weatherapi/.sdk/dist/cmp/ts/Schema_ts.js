"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const sdkgen_1 = require("@voxgig/sdkgen");
const Schema = (0, sdkgen_1.cmp)(async function Schema(props) {
    const ctx$ = props.ctx$;
    const target = props.target;
    const model = ctx$.model;
    const optspec = (0, sdkgen_1.optionSpec)(model, target.name);
    const entityspec = (0, sdkgen_1.entitySpecMap)(model, target.name) || {};
    (0, sdkgen_1.File)({ name: 'Schema.' + target.ext }, () => {
        (0, sdkgen_1.Content)(`// ${model.const.Name} ${target.Name} SDK: generated schemas. Do not edit.
//
// Generated from the model: \`main.kit.optspec\` and each feature's
// \`config.options\` for OPTSPEC; entity \`fields{}.type\` for ENTITYSPEC.

const OPTSPEC = ${JSON.stringify(optspec, null, 2)}

const ENTITYSPEC = ${JSON.stringify(entityspec, null, 2)}

export {
  OPTSPEC,
  ENTITYSPEC,
}
`);
    });
});
exports.Schema = Schema;
//# sourceMappingURL=Schema_ts.js.map
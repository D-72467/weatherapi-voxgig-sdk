"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityOperation = void 0;
const sdkgen_1 = require("@voxgig/sdkgen");
const utility_ts_1 = require("./utility_ts");
const EntityOperation = (0, sdkgen_1.cmp)(function Operation(props) {
    const { model } = props.ctx$;
    const { ff, opname, entity, entrep } = props;
    let { indent } = props;
    indent = indent.substring(2);
    if ('' == indent) {
        indent = undefined;
    }
    const entop = entity.op[opname];
    (0, sdkgen_1.Fragment)({
        from: ff + '/Entity' + (0, sdkgen_1.camelify)(opname) + 'Op.fragment.ts',
        eject: ['// EJECT-START', '// EJECT-END'],
        indent,
        replace: {
            ...entrep,
            SdkName: model.const.Name,
            EntityName: entity.Name,
            entityname: entity.name,
            // The CLASS token. Operations resolve to the entity instance, so their
            // declared return type must name the class — `Promise<PlanetEntity>`,
            // not `Promise<Planet>` (the data interface). A signature that says
            // the data type while the call resolves to an entity is a lie the
            // compiler cannot catch; see AGENTS.md.
            EntyClass: (0, sdkgen_1.entityClassName)(entity, (0, sdkgen_1.entityCollection)(model)),
            "['POINTS']": (0, utility_ts_1.formatJson)(entop.points, { margin: 6 }).trim(),
            '#Feature-Hook': ({ name, indent }) => (0, sdkgen_1.Content)({ indent }, `
fres = featureHook(ctx, '${name}')
if (fres instanceof Promise) { await fres }
`)
        }
    });
});
exports.EntityOperation = EntityOperation;
//# sourceMappingURL=EntityOperation_ts.js.map
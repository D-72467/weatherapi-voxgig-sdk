"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityTypes = void 0;
const sdkgen_1 = require("@voxgig/sdkgen");
const sdkgen_2 = require("@voxgig/sdkgen");
const apidef_1 = require("@voxgig/apidef");
const LANG = 'ts';
function propKey(name) {
    return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) ? name : JSON.stringify(name);
}
const EntityTypes = (0, sdkgen_1.cmp)(function EntityTypes(props) {
    const { model, log } = props.ctx$;
    const entity = (0, apidef_1.getModelPath)(model, `main.${apidef_1.KIT}.entity`, { only_active: false, required: false });
    // Emit for EVERY entity that gets generated entity code: the consumer
    // scaffold (create-sdkgen Root.ts) iterates entities WITHOUT an active
    // filter, so inactive entities still get class files referencing these
    // typed names. Filter on `name` (always present), NOT `active` — parity
    // with the go emitter's fix.
    const entityList = (0, sdkgen_2.deriveEntityNames)(entity);
    // Derive the PascalCase Name up-front — it is set LAZILY by names(), so an
    // entity not yet named (e.g. a fieldless placeholder) would otherwise read
    // `Name = undefined` below. Parity with the go emitter's fix.
    (0, sdkgen_2.warnEntityTypeCollisions)(entity, log, LANG);
    (0, sdkgen_1.File)({ name: model.const.Name + 'Types.' + LANG }, () => {
        (0, sdkgen_1.Content)(`// Typed models for the ${model.const.Name} SDK.
//
// GENERATED from the API model: main.${apidef_1.KIT}.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

`);
        entityList.forEach((ent) => {
            const Name = ent.Name;
            const TypeName = (0, sdkgen_2.tsTypeName)(ent, (0, sdkgen_2.entityCollection)(model));
            const fields = (ent.fields ? (0, sdkgen_1.each)(ent.fields) : [])
                .filter((f) => f.a !== false);
            (0, sdkgen_1.Content)(`export interface ${TypeName} {
`);
            fields.forEach((f) => {
                const opt = false === f.r ? '?' : '';
                (0, sdkgen_1.Content)(`  ${propKey(f.n)}${opt}: ${(0, sdkgen_2.canonToType)(f.t, LANG)}
`);
            });
            (0, sdkgen_1.Content)(`}

`);
            const ops = ent.op || {};
            ['load', 'list', 'create', 'update', 'patch', 'remove'].forEach((opname) => {
                if (null == ops[opname]) {
                    return;
                }
                const typeName = (0, sdkgen_2.opTypeName)(Name, opname);
                const { items } = (0, sdkgen_2.opRequestShape)(ent, opname);
                (0, sdkgen_1.Content)(`export interface ${typeName} {
`);
                items.forEach((it) => {
                    const opt = it.optional ? '?' : '';
                    (0, sdkgen_1.Content)(`  ${propKey(it.name)}${opt}: ${(0, sdkgen_2.canonToType)(it.type, LANG)}
`);
                });
                if (('create' === opname || 'update' === opname || 'patch' === opname) &&
                    null != (0, sdkgen_2.opRawBody)(ops[opname])) {
                    (0, sdkgen_1.Content)(`  $body?: Uint8Array | ArrayBuffer | Blob | ReadableStream | AsyncIterable<Uint8Array> | string
`);
                }
                const actions = (0, sdkgen_2.opActions)(ops[opname]);
                if (0 < actions.length) {
                    (0, sdkgen_1.Content)(`
  // Selects a custom action instead of the plain ${opname}:
  //   ${actions.map((a) => `'` + a.action + `'`).join(' | ')}
  // The remaining keys are that action's own payload.
  $action?: string
  [action: string]: any
`);
                }
                (0, sdkgen_1.Content)(`}

`);
            });
        });
    });
});
exports.EntityTypes = EntityTypes;
//# sourceMappingURL=EntityTypes_ts.js.map
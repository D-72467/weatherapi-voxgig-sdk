"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildSDK = void 0;
const struct_1 = require("@voxgig/struct");
const sdkgen_1 = require("@voxgig/sdkgen");
const jostraca_1 = require("jostraca");
const apidef_1 = require("@voxgig/apidef");
const BuildSDK = (0, sdkgen_1.cmp)(function BuildSDK(props) {
    const ctx$ = props.ctx$;
    const model = ctx$.model;
    const sdkBuildFolder = '.sdk';
    const entityMap = (0, apidef_1.getModelPath)(model, `main.${apidef_1.KIT}.entity`);
    (0, sdkgen_1.Folder)({ name: sdkBuildFolder }, () => {
        (0, sdkgen_1.each)(entityMap, (entity) => {
            (0, sdkgen_1.Folder)({ name: 'test' }, () => {
                (0, sdkgen_1.Folder)({ name: 'entity' }, () => {
                    (0, sdkgen_1.Folder)({ name: entity.name }, () => {
                        (0, sdkgen_1.File)({ name: (0, apidef_1.nom)(entity, 'Name') + 'TestData.json' }, () => {
                            const entityTestData = makeEntityTestData(model, entity);
                            (0, sdkgen_1.Content)(JSON.stringify(entityTestData, null, 2));
                        });
                    });
                });
            });
        });
    });
});
exports.BuildSDK = BuildSDK;
function makeEntityTestData(_model, entity) {
    const data = {
        existing: {
            [entity.name]: {}
        },
        new: {
            [entity.name]: {}
        }
    };
    const idcount = 3;
    const refs = [...Array(idcount).keys()].reduce((a, _x, i) => (a.push(`${entity.name}${String(i).padStart(2, "0")}`), a), []);
    const idmap = refs.reduce((a, ref) => (a[ref] = ref.toUpperCase(), a), {});
    // Path params required across the entity's ops (excluding the entity's own
    // id and any param renamed-to-id). The in-memory test mock's buildArgs
    // searches existing entities by these fields, so they need to be present
    // with values that match what the test code sends via setup.idmap.
    const pathParams = collectEntityPathParams(entity);
    const hasEntId = null != entity.id;
    const needsFixtureId = hasEntId || entityHasMutatingOp(entity);
    let i = 1;
    refs.map((ref) => {
        const id = idmap[ref];
        const ent = data.existing[entity.name][id] = {};
        makeEntityTestFields(entity, i++, ent);
        for (const [paramName, paramValue] of pathParams) {
            // Don't overwrite a real entity field with the same name.
            if (ent[paramName] === undefined) {
                ent[paramName] = paramValue;
            }
        }
        // Inject a fixture id when the spec models one for this entity (either
        // as a top-level field or as a path param). Read-only feeds with no id
        // at all leave fixtures bare so test generators don't synthesise bogus
        // id assertions.
        if (needsFixtureId) {
            ent.id = id;
        }
    });
    let id = entity.name + '_ref01';
    const ent = data.new[entity.name][id] = {};
    makeEntityTestFields(entity, i++, ent);
    delete ent.id;
    // WHICH operations this entity exposes, not what the specification says
    // about them. The facts are apidef's resolved definition, and copying them
    // here made the test data a second copy of the model's own copy of them.
    data.requests = {};
    for (const op of Object.values(entity.op || {}))
        for (const point of op.points || []) {
            if (point.co)
                data.requests[point.co.id] = {
                    provenance: 'operation-contract', version: point.co.version,
                    source: point.co.source,
                };
        }
    return data;
}
function entityHasMutatingOp(entity) {
    const ops = entity?.op || {};
    for (const opname of Object.keys(ops)) {
        if (opname !== 'list')
            return true;
    }
    return false;
}
function collectEntityPathParams(entity) {
    const out = new Map();
    const ops = entity?.op || {};
    for (const opname of Object.keys(ops)) {
        const op = ops[opname];
        const points = op?.points || [];
        for (const point of points) {
            const params = point?.g?.params || [];
            const renameMap = point?.r?.param || {};
            for (const param of params) {
                if (!param?.n)
                    continue;
                if ('id' === param.n)
                    continue;
                // Skip params that ARE the entity's own id under URL rename.
                const camel = (0, jostraca_1.lcf)((0, jostraca_1.camelify)(param.n));
                if ('id' === renameMap[camel])
                    continue;
                if (out.has(param.n))
                    continue;
                const baseName = param.n.replace(/_id$/, '');
                out.set(param.n, baseName.toUpperCase() + '01');
            }
        }
    }
    return Array.from(out.entries());
}
function makeEntityTestFields(entity, start, entdata) {
    entdata = entdata ?? {};
    let num = (start * (0, struct_1.size)(entity.fields) * 10);
    (0, sdkgen_1.each)(entity.fields, (field) => {
        entdata[field.n] =
            field.n.endsWith('_id') ?
                field.n.substring(0, field.n.length - 3).toUpperCase() + '01' :
                ['`$NUMBER`', '`$INTEGER`'].includes(field.t) ? num :
                    '`$BOOLEAN`' === field.t ? 0 === num % 2 :
                        '`$OBJECT`' === field.t ? {} :
                            '`$MAP`' === field.t ? {} :
                                '`$ARRAY`' === field.t ? [] :
                                    '`$LIST`' === field.t ? [] :
                                        's' + (num.toString(16));
        num++;
    });
    return entdata;
}
//# sourceMappingURL=BuildSDK.js.map
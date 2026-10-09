"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const Path = __importStar(require("node:path"));
const sdkgen_1 = require("@voxgig/sdkgen");
const EntityOperation_ts_1 = require("./EntityOperation_ts");
const Entity = (0, sdkgen_1.cmp)(function Entity(props) {
    const { model, stdrep } = props.ctx$;
    const { target, entity } = props;
    // Collision-free entity CLASS name (see entityClassName): normally
    // `<Name>Entity`, disambiguated when it would clash with another entity's
    // data-type name. The DATA type stays `<Name>`. The class file name and the
    // Main import path both use this, so they always agree.
    const entityColl = (0, sdkgen_1.entityCollection)(model);
    const cls = (0, sdkgen_1.entityClassName)(entity, entityColl);
    const entrep = {
        ...stdrep,
    };
    (0, sdkgen_1.names)(entrep, entity.Name, 'EntityName');
    // A TS/JS global (Record, Array, Promise, ...) would shadow itself for
    // the rest of the file — see tsTypeName. The runtime `this.Name`
    // string stays entity.Name; only the TYPE reference is ever renamed.
    const dataType = (0, sdkgen_1.tsTypeName)(entity, entityColl);
    const typeNames = [dataType];
    const opnamesAll = Object.keys(entity.op || {});
    ['load', 'list', 'create', 'update', 'patch', 'remove'].forEach((opname) => {
        if (opnamesAll.includes(opname)) {
            typeNames.push((0, sdkgen_1.opTypeName)(entity.Name, opname));
        }
    });
    const typeImport = 'import type {\n  ' + typeNames.join(',\n  ') +
        `,\n} from '../${model.const.Name}Types'`;
    const ff = Path.normalize(__dirname + '/../../../src/cmp/ts/fragment/');
    (0, sdkgen_1.Folder)({ name: 'src/entity' }, () => {
        (0, sdkgen_1.File)({ name: cls + '.' + target.name }, () => {
            const opnames = Object.keys(entity.op || {});
            const opfrags = (['load', 'list', 'create', 'update', 'patch', 'remove']
                .reduce((a, opname) => (a['#' + (0, sdkgen_1.camelify)(opname) + 'Op'] =
                !opnames.includes(opname) ? '' : ({ indent }) => {
                    (0, EntityOperation_ts_1.EntityOperation)({ ff, opname, indent, entity, entrep });
                }, a), {}));
            (0, sdkgen_1.Fragment)({
                from: ff + 'Entity.fragment.ts',
                replace: {
                    ...entrep,
                    entityname: entity.name,
                    SdkName: model.const.Name,
                    EntityName: entity.Name,
                    EntityDataType: dataType,
                    EntyClass: cls,
                    '#TypeImports': ({ indent }) => (0, sdkgen_1.Content)({ indent }, typeImport),
                    '#Feature-Hook': ({ name, indent }) => (0, sdkgen_1.Content)({ indent }, `
fres = featureHook(ctx, '${name}')
if (fres instanceof Promise) { await fres }
`.trim()),
                    ...opfrags,
                }
            });
        });
    });
});
exports.Entity = Entity;
//# sourceMappingURL=Entity_ts.js.map
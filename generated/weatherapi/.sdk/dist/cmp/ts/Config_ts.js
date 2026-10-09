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
exports.Config = void 0;
const Path = __importStar(require("node:path"));
const sdkgen_1 = require("@voxgig/sdkgen");
const apidef_1 = require("@voxgig/apidef");
const utility_ts_1 = require("./utility_ts");
const Config = (0, sdkgen_1.cmp)(async function Config(props) {
    const ctx$ = props.ctx$;
    const target = props.target;
    const model = ctx$.model;
    const entity = (0, apidef_1.getModelPath)(model, `main.${apidef_1.KIT}.entity`);
    const feature = (0, sdkgen_1.targetFeatures)(model, target);
    const ff = Path.normalize(__dirname + '/../../../src/cmp/ts/fragment/');
    const headers = (0, apidef_1.getModelPath)(model, `main.${apidef_1.KIT}.config.headers`) || {};
    const authActive = (0, sdkgen_1.isAuthActive)(model);
    const authPrefix = (0, sdkgen_1.resolveAuthPrefix)(model);
    const authBasic = (0, sdkgen_1.isHttpBasicAuth)(model);
    // `in` and `name` travel with the prefix now. They were resolved by
    // apidef all along and dropped here, so an apiKey-in-query API got an
    // Authorization header it does not read. Emitted only when they differ
    // from the defaults, so a header/Authorization SDK is byte-identical to
    // what it generated before.
    const authIn = (0, sdkgen_1.resolveAuthIn)(model);
    const authName = (0, sdkgen_1.resolveAuthName)(model);
    const authBlock = authActive
        ? `auth: {
      prefix: '${authPrefix}',${authBasic ? `
      basic: true,` : ''}${'header' === authIn ? '' : `
      in: '${authIn}',`}${'Authorization' === authName ? '' : `
      name: '${authName}',`}
    },

    `
        : '';
    const svars = (0, sdkgen_1.serverVariables)(model);
    const serverBlock = 0 === svars.length ? '' :
        'server: {\n' +
            svars.map((v) => `      ${JSON.stringify(v.name)}: ${JSON.stringify(v.dflt)},\n`).join('') +
            '    },\n\n    ';
    let baseUrl = '';
    try {
        baseUrl = (0, apidef_1.getModelPath)(model, `main.${apidef_1.KIT}.info.servers.0.url`);
    }
    catch (_e) { }
    const { def: configDef, json: configJson } = (0, sdkgen_1.configDefinition)(model, target.name);
    const asData = (0, sdkgen_1.isConfigData)(configJson, (0, sdkgen_1.configReprSetting)(model));
    (0, sdkgen_1.File)({ name: 'Config.' + target.ext }, () => {
        if (asData) {
            (0, sdkgen_1.Fragment)({
                from: ff + 'Config.data.fragment.ts',
                replace: {
                    '// #ImportFeatures': () => {
                        (0, sdkgen_1.each)(feature, (f) => {
                            (0, sdkgen_1.Line)(`import { ${(0, apidef_1.nom)(f, 'Name')}Feature } from ` +
                                `'./feature/${f.name}/${(0, apidef_1.nom)(f, 'Name')}Feature'`);
                        });
                        pluginImports(feature);
                    },
                    '// #FeatureClasses': () => {
                        (0, sdkgen_1.each)(feature, (f) => {
                            (0, sdkgen_1.Line)(` ${f.name}: ${(0, apidef_1.nom)(f, 'Name')}Feature,`);
                        });
                    },
                    '// #FeaturePlugins': () => pluginDefs(feature),
                    "'CONFIGJSON'": JSON.stringify(configJson),
                }
            });
            return;
        }
        (0, sdkgen_1.Fragment)({
            from: ff + 'Config.fragment.ts',
            replace: {
                "'BASEURL'": JSON.stringify(baseUrl),
                "'SERVERBLOCK'": serverBlock,
                "'AUTHBLOCK'": authBlock,
                "'HEADERS'": (0, sdkgen_1.indent)(JSON.stringify(headers, null, 2), 4).trim(),
                '// #ImportFeatures': () => {
                    (0, sdkgen_1.each)(feature, (f) => {
                        (0, sdkgen_1.Line)(`import { ${(0, apidef_1.nom)(f, 'Name')}Feature } from ` +
                            `'./feature/${f.name}/${(0, apidef_1.nom)(f, 'Name')}Feature'`);
                    });
                    pluginImports(feature);
                },
                // Values from configDefinition's def, not re-derived here, so the
                // literal rep and the data rep cannot disagree on identity.
                '// #MainMeta': () => {
                    (0, sdkgen_1.Line)(`    slug: ${JSON.stringify(configDef.main.slug)},`);
                    (0, sdkgen_1.Line)(`    version: ${JSON.stringify(configDef.main.version)},`);
                    (0, sdkgen_1.Line)(`    target: ${JSON.stringify(configDef.main.target)},`);
                },
                '// #FeatureClasses': () => {
                    (0, sdkgen_1.each)(feature, (f) => {
                        (0, sdkgen_1.Line)(` ${f.name}: ${(0, apidef_1.nom)(f, 'Name')}Feature,`);
                    });
                },
                '// #FeaturePlugins': () => pluginDefs(feature),
                // Rendered from configDefinition's def, not from f.config, so the
                // literal carries the feature's `transport` role (station design
                // §8.4) beside its options and cannot drift from the data rep.
                '// #FeatureConfigs': () => {
                    (0, sdkgen_1.each)(feature, (f) => {
                        (0, sdkgen_1.Line)(` ${f.name}: ${(0, utility_ts_1.formatJson)(configDef.feature[f.name], { margin: 4 })},`);
                    });
                },
                '// #EntityConfigs': () => {
                    (0, sdkgen_1.each)(entity, (entity) => {
                        (0, sdkgen_1.Content)(`
        ${entity.name}: {
        },
  `);
                    });
                },
                "'ENTITYMAP'": (0, utility_ts_1.formatJson)(configDef.entity, { margin: 2 }).trim(),
            }
        });
    });
});
exports.Config = Config;
function pluginImports(feature) {
    (0, sdkgen_1.each)(feature, (f) => {
        const bypath = {};
        (0, sdkgen_1.each)(f.plugin, (plugin) => {
            // Filter on `active` HERE rather than trusting the feature object to
            // arrive filtered. Whether a model path was read with `only_active`
            // varies by call site, and getting it wrong in this direction emits
            // an import for a module the trim just deleted — an SDK that does
            // not compile, rather than one that merely carries too much.
            if (false === plugin.active || null == plugin.active)
                return;
            for (const [sym, one] of Object.entries(plugin.def?.ts || {})) {
                const path = String(one);
                (bypath[path] = bypath[path] || []).push(sym);
            }
        });
        for (const path of Object.keys(bypath).sort()) {
            const spec = './' + path.replace(/^src\//, '').replace(/\.ts$/, '');
            (0, sdkgen_1.Line)(`import { ${bypath[path].sort().join(', ')} } from '${spec}'`);
        }
    });
}
function pluginDefs(feature) {
    (0, sdkgen_1.each)(feature, (f) => {
        const syms = [];
        (0, sdkgen_1.each)(f.plugin, (plugin) => {
            if (false === plugin.active || null == plugin.active)
                return;
            syms.push(...Object.keys(plugin.def?.ts || {}));
        });
        if (0 < syms.length) {
            (0, sdkgen_1.Line)(` ${f.name}: [${syms.sort().join(', ')}],`);
        }
    });
}
//# sourceMappingURL=Config_ts.js.map
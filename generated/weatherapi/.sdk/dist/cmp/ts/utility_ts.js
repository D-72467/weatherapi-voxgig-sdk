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
exports.clean = clean;
exports.formatJSONSrc = formatJSONSrc;
exports.formatJson = formatJson;
exports.projectPath = projectPath;
exports.exampleValue = exampleValue;
const Path = __importStar(require("node:path"));
const sdkgen_1 = require("@voxgig/sdkgen");
// The declared canon-type sentinel of a named parameter of an op — looked up
// in the op's `points[].g.params[]` exactly as the typed-model generator
// does. Falls back to the entity field of the same name (used when the op
// has no params and the generated match type is `Partial<Entity>`). Returns
// undefined when neither is present.
function paramCanonType(entity, op, paramName) {
    const params = op ? (0, sdkgen_1.each)((0, sdkgen_1.opParams)(op)) : [];
    const found = params.find((p) => p && p.n === paramName);
    if (found) {
        return found.t;
    }
    const field = (entity && entity.fields ? (0, sdkgen_1.each)(entity.fields) : [])
        .find((f) => f && f.n === paramName);
    return field && field.t;
}
function exampleValue(entity, op, paramName, placeholder) {
    // canonScalarKey, not canonKey: a nullable field's sentinel is the union
    // ['`$ONE`', ['`$NUMBER`','`$NULL`']], which canonKey stringifies into
    // nothing recognizable — so a `number | null` id fell through to the
    // quoted placeholder and the example failed to compile against the type
    // generated from that very sentinel.
    const key = (0, sdkgen_1.canonScalarKey)(paramCanonType(entity, op, paramName));
    if ('INTEGER' === key || 'NUMBER' === key) {
        return '1';
    }
    if ('BOOLEAN' === key) {
        return 'true';
    }
    if ('ARRAY' === key) {
        return '[]';
    }
    if ('OBJECT' === key) {
        return '{}';
    }
    if ('NULL' === key) {
        return 'null';
    }
    return (0, sdkgen_1.jsQuote)(placeholder);
}
function projectPath(suffix) {
    return Path.normalize(Path.join(__dirname, '../../..', suffix ?? ''));
}
function formatJSONSrc(jsonsrc) {
    return jsonsrc
        .replace(/([{:\[,])/g, '$1 ')
        .replace(/([}\]])/g, ' $1');
}
function formatJson(obj, flags) {
    const marginSize = flags?.margin ?? 0;
    const marginStr = ' '.repeat(marginSize);
    let json;
    if (flags?.line) {
        json = JSON.stringify(obj)
            .replace(/([{:\[,])/g, '$1 ')
            .replace(/([}\]])/g, ' $1');
    }
    else {
        json = JSON.stringify(obj, null, 2);
    }
    if (marginSize > 0) {
        json = json.split('\n').map(line => marginStr + line).join('\n');
    }
    return json;
}
const MODEL_META = ['index$', 'key$', 'val$'];
const CONFIG_DEFAULT = {
    active: true,
    req: false,
    reqd: false,
};
const PAYLOAD_KEYS = ['default', 'example', 'examples'];
function clean(o, dropDefaults) {
    const prune = (node, defaults) => {
        if (Array.isArray(node)) {
            return node.map((n) => prune(n, defaults));
        }
        if (null != node && 'object' === typeof node) {
            const out = {};
            for (const k of Object.keys(node)) {
                if (MODEL_META.includes(k)) {
                    continue;
                }
                if (defaults && k in CONFIG_DEFAULT && CONFIG_DEFAULT[k] === node[k]) {
                    continue;
                }
                out[k] = prune(node[k], defaults && !PAYLOAD_KEYS.includes(k));
            }
            return out;
        }
        return node;
    };
    return prune(o, true === dropDefaults);
}
//# sourceMappingURL=utility_ts.js.map
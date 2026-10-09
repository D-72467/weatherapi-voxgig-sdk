"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestLive = void 0;
const sdkgen_1 = require("@voxgig/sdkgen");
const apidef_1 = require("@voxgig/apidef");
const TestLive = (0, sdkgen_1.cmp)(function TestLive(props) {
    const model = props.ctx$.model;
    const plan = [];
    for (const entity of Object.values((0, sdkgen_1.entityCollection)(model))) {
        if (entity.active === false)
            continue;
        for (const [op, operation] of Object.entries(entity.op || {})) {
            for (const point of operation.points || []) {
                // Only what the runner reads, not the whole point.
                const all = (0, sdkgen_1.pointFacts)(props.ctx$, point);
                const facts = {
                    live: (0, sdkgen_1.liveHint)(point),
                    security: model.main.kit.info?.auth === false ? [] : all.security,
                    securitySource: all.securitySource,
                    responses: all.responses,
                };
                const same = operation.points.filter((p) => JSON.stringify(p.q || {}) === JSON.stringify(point.q || {}));
                plan.push({ entity: entity.name, accessor: (0, apidef_1.nom)(entity, 'Name'), op,
                    id: point.m + ' ' + point.o, contractVersion: 1, kind: point.k, graphql: point.gq, path: point.o, method: point.m,
                    action: point.q?.$action, rename: point.r, args: point.g, facts, reachable: same.length === 1 });
            }
        }
    }
    if (!plan.some(p => p.facts.live))
        return;
    const server = (0, sdkgen_1.serverVariables)(model).map((v) => JSON.stringify(v.name) + ': process.env[' + JSON.stringify((0, sdkgen_1.serverVarEnv)((0, sdkgen_1.envName)(model), v.name)) + '] ?? ' + JSON.stringify(v.dflt)).join(', ');
    (0, sdkgen_1.File)({ name: 'live.test.ts' }, () => (0, sdkgen_1.Content)(`import { test } from 'node:test'
import { SDK } from '..'
import { runLiveScenarios } from './live-scenarios'
import { loadEnvLocal } from './utility'
loadEnvLocal(__dirname + '/../.env.local')
${(0, sdkgen_1.liveStrictNote)((0, sdkgen_1.liveStrict)(model, props.target.name), '//')}
test('live operation coverage', { skip: process.env.${(0, sdkgen_1.envName)(model)}_TEST_LIVE !== 'TRUE' }, async (t) => {
  await runLiveScenarios(SDK, ${JSON.stringify(plan, null, 2)}, '${(0, sdkgen_1.envName)(model)}', { server: { ${server} }, secret: process.env.${(0, sdkgen_1.envName)(model)}_SECRET }, { strict: ${(0, sdkgen_1.liveStrict)(model, props.target.name)}, t })
})
`));
});
exports.TestLive = TestLive;
//# sourceMappingURL=TestLive_ts.js.map
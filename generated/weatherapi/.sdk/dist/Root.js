"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Root = exports.KIT = void 0;
const sdkgen_1 = require("@voxgig/sdkgen");
const apidef_1 = require("@voxgig/apidef");
Object.defineProperty(exports, "KIT", { enumerable: true, get: function () { return apidef_1.KIT; } });
const struct_1 = require("@voxgig/struct");
const jostraca_1 = require("jostraca");
const Top_1 = require("./Top");
const BuildSDK_1 = require("./BuildSDK");
const RootPlan_1 = require("./RootPlan");
const { buildPoints, SerialPoint, } = jostraca_1.PointUtil;
const Root = (0, sdkgen_1.cmp)(function Root(props) {
    const { model, ctx$ } = props;
    ctx$.util = ctx$.util || {};
    ctx$.util.makeFlow = makeFlow;
    model.const = { name: model.name };
    (0, sdkgen_1.names)(model.const, model.name);
    model.const.year = new Date().getFullYear();
    ctx$.model = model;
    const target = model.main[apidef_1.KIT].target || {};
    const feature = model.main[apidef_1.KIT].feature || {};
    const entity = model.main[apidef_1.KIT].entity || {};
    ctx$.log.debug({
        point: 'cmp-root', target, entity, feature, note: [
            '\ntarget: \n' + Object.keys(target).map(s => '  ' + s).join('\n'),
            '\nentity:\n' + Object.keys(entity).map(s => '  ' + s).join('\n'),
            '\nfeature:\n' + Object.keys(feature).map(s => '  ' + s).join('\n'),
        ].join('\n')
    });
    (0, sdkgen_1.names)(model, model.name);
    // Standard Replacements
    ctx$.stdrep = {};
    (0, sdkgen_1.names)(ctx$.stdrep, model.Name, 'Project' + 'Name');
    const plan = (0, RootPlan_1.rootPlan)(model.main[apidef_1.KIT], sdkgen_1.SdkGenError);
    (0, sdkgen_1.Project)({}, () => {
        if (plan.top) {
            (0, Top_1.Top)({});
        }
        if (plan.build) {
            (0, BuildSDK_1.BuildSDK)({});
        }
        (0, sdkgen_1.each)(target, (target) => {
            const place = plan.place[target.name];
            if (null == place) {
                return;
            }
            (0, sdkgen_1.names)(target, target.name);
            if ('root' === place) {
                targetPhases(target, entity, feature);
            }
            else {
                (0, sdkgen_1.Folder)({ name: target.name }, () => {
                    targetPhases(target, entity, feature);
                });
            }
        });
    });
});
exports.Root = Root;
function targetPhases(target, entity, feature) {
    const phase = target.phase || {};
    const phaseActive = (name) => false !== (phase[name] && phase[name].active);
    if (phaseActive('entity')) {
        (0, sdkgen_1.each)(entity).filter((entity) => entity.active).map((entity) => {
            (0, sdkgen_1.names)(entity, entity.name);
            (0, sdkgen_1.Entity)({ target, entity });
        });
    }
    if (phaseActive('feature')) {
        (0, sdkgen_1.each)(feature).filter((feature) => feature.active).map((feature) => {
            (0, sdkgen_1.names)(feature, feature.name);
            (0, sdkgen_1.Feature)({ target, feature });
        });
    }
    (0, sdkgen_1.Main)({ target });
    if (phaseActive('readme')) {
        (0, sdkgen_1.Readme)({ target });
    }
    // Per-target agent guides: <lang>/AGENTS.md + CLAUDE.md, and (driven
    // internally by AgentGuide) a guide per active feature under
    // <lang>/src/feature/<name>/. Placement mirrors Readme.
    if (phaseActive('agentguide')) {
        (0, sdkgen_1.AgentGuide)({ target });
    }
    if (phaseActive('test')) {
        (0, sdkgen_1.Test)({ target });
    }
}
function makeFlow(def, data, stepMakers) {
    const steps = {};
    (0, sdkgen_1.each)(stepMakers, (n) => {
        if ('function' === typeof n.val$) {
            steps[n.key$] = (id, pdef) => makeFlowStep(id(), pdef, n.val$);
        }
        else if ('string' === typeof n.val$) {
            steps[n.key$] = (id, pdef) => makeFlowStep(id(), pdef, (sd, pctx) => {
                (0, jostraca_1.Content)({
                    indent: pctx.data.indent,
                    extra: {
                        __stepdef: sd
                    },
                }, n.val$);
            });
        }
        else if (Array.isArray(n)) {
            steps[n.key$] =
                (id, pdef) => makeFlowStep(id(), pdef, (sd, pctx) => {
                    const extra = {
                        __stepdef: sd
                    };
                    for (let tmdef of n) {
                        let tmtxt;
                        if ('string' === typeof tmdef) {
                            tmtxt = tmdef;
                        }
                        else if (Array.isArray(tmdef)) {
                            let pass = true;
                            let cond = tmdef[0];
                            tmtxt = tmdef[1];
                            if ('string' === typeof cond) {
                                pass = (null != (0, sdkgen_1.getx)(extra, tmdef[0]) || null != (0, sdkgen_1.getx)(pctx.data.model, tmdef[0]));
                            }
                            else if ((0, struct_1.ismap)(cond)) {
                                let children = [{ ...pctx.data.model, ...extra }];
                                let found = (0, struct_1.select)(children, cond);
                                pass = 0 < found.length;
                            }
                            if (!pass) {
                                tmtxt = tmdef[2];
                            }
                        }
                        else if ('function' === typeof tmdef) {
                            tmdef(sd, pctx);
                        }
                        if (null != tmtxt) {
                            (0, jostraca_1.Content)({
                                indent: pctx.data.indent,
                                extra,
                            }, tmtxt);
                        }
                    }
                });
        }
    });
    (0, sdkgen_1.each)(def.step, (step) => {
        (0, sdkgen_1.names)(step, step.entity, 'entity');
    });
    const spec = (0, struct_1.transform)(def, {
        p: ['`$EACH`', 'step', {
                k: 'FlowStep',
                a: '`.`',
                p: [
                    { k: 'GetEntity', a: '`...`' },
                    { k: 'EntityMatch', a: '`...`' },
                    { k: 'EntityData', a: '`...`' },
                    { k: 'EntityAction', a: '`...`' },
                    { k: 'ExplainAction', a: '`...`' },
                    { k: 'ValidateAction', a: '`...`' },
                ]
            }]
    });
    const rootPoint = buildPoints(spec, steps);
    data = data || {};
    data.step = {};
    rootPoint.direct(data);
}
function makeFlowStep(id, pdef, before, after, _parent) {
    class FlowStep extends SerialPoint {
        constructor(id, pdef) {
            super(id);
            this.pdef = pdef;
        }
        async run(pctx) {
            const stepdef = pdef.a;
            if (stepdef.ref) {
                const refstep = pctx.data.step[stepdef.ref];
                stepdef.kind = refstep.kind;
                stepdef.entity = refstep.entity;
                stepdef._ref = stepdef.ref;
                delete stepdef.ref;
            }
            before.call(this, stepdef, pctx);
            super.run(pctx);
            after && after.call(this, stepdef, pctx);
        }
    }
    return new FlowStep(id, pdef);
}
//# sourceMappingURL=Root.js.map
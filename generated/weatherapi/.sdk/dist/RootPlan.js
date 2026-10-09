"use strict";
// Import-free, so the scaffold's own tests can load it without the toolchain.
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootPlan = rootPlan;
function rootPlan(kit, Fail = Error) {
    const phase = kit?.phase || {};
    const phaseActive = (name) => false !== (phase[name] && phase[name].active);
    const top = phaseActive('top');
    const build = phaseActive('build');
    const target = kit?.target || {};
    const place = {};
    for (const name of Object.keys(target).sort()) {
        if (null != target[name] && false !== target[name].active) {
            place[name] = true === target[name].output?.root ? 'root' : 'folder';
        }
    }
    const atRoot = Object.keys(place).filter((name) => 'root' === place[name]);
    if (1 < atRoot.length) {
        throw new Fail('Only one target can be generated at the project root, and ' +
            atRoot.length + ' declare `output: root: true`: ' + atRoot.join(', ') + '.');
    }
    if (1 === atRoot.length && top) {
        throw new Fail('Target "' + atRoot[0] + '" is generated at the project root, where the ' +
            'SDK repository files (README, LICENSE, Makefile, workflows) would ' +
            'overwrite its own. Declare `main: kit: phase: top: active: false` in ' +
            'model/project.aontu.');
    }
    return { top, build, place };
}
//# sourceMappingURL=RootPlan.js.map
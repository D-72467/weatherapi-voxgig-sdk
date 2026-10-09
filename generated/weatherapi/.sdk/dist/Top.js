"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Top = void 0;
const sdkgen_1 = require("@voxgig/sdkgen");
const Top = (0, sdkgen_1.cmp)(function Top(props) {
    (0, sdkgen_1.ReadmeTop)({});
    // Agent onboarding guides at the project root: AGENTS.md + a thin CLAUDE.md,
    // populated with the real target / feature / entity lists. Emitted outside
    // any target Folder (same placement rule as ReadmeTop / Deploy).
    (0, sdkgen_1.AgentGuideTop)({});
    (0, sdkgen_1.License)({});
    (0, sdkgen_1.Security)({});
    (0, sdkgen_1.Changelog)({});
    // Root deployment Makefile: per-target `make deploy-<t>` (publish with
    // credentials injected by the aql key vault) plus an all-targets
    // `make deploy-dry` rehearsal.
    (0, sdkgen_1.Deploy)({});
    (0, sdkgen_1.PublishWorkflow)({});
});
exports.Top = Top;
//# sourceMappingURL=Top.js.map
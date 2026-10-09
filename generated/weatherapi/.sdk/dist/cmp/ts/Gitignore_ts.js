"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gitignore = void 0;
const sdkgen_1 = require("@voxgig/sdkgen");
const Gitignore = (0, sdkgen_1.cmp)(async function Gitignore(_props) {
    (0, sdkgen_1.File)({ name: '.gitignore' }, () => {
        (0, sdkgen_1.Content)(`# Dependencies
node_modules/

# Build output
#
# dist/ and dist-test/ are COMMITTED, not ignored: the compiled SDK and the
# compiled test suite are part of the published repo, so a consumer can read
# and run them straight from a clone without a build step. Only the
# incremental-build bookkeeping is ignored.
*.tsbuildinfo

# Coverage
coverage/

# Logs
*.log
npm-debug.log*

# IDE / OS
.idea/
.vscode/
.DS_Store
`);
    });
});
exports.Gitignore = Gitignore;
//# sourceMappingURL=Gitignore_ts.js.map
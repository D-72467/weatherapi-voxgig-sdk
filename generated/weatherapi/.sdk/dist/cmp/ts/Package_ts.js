"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Package = void 0;
const sdkgen_1 = require("@voxgig/sdkgen");
const apidef_1 = require("@voxgig/apidef");
const Package = (0, sdkgen_1.cmp)(async function Package(props) {
    const ctx$ = props.ctx$;
    const target = props.target;
    const model = ctx$.model;
    // WHO WROTE THIS PACKAGE. Per target, falling back to the model-wide value
    // and then to the publisher — so a manifest cannot go on naming Voxgig
    // while the model names someone else, which is exactly what the hardcoded
    // constant here did.
    const author = (0, sdkgen_1.authorInfo)(model, target.name);
    // Gated by applicability: a feature that does not apply to this
    // target must not inject its deps into the generated manifest.
    const feature = (0, sdkgen_1.targetFeatures)(model, target);
    const only = (kind, deps) => (0, sdkgen_1.omap)(deps, ([k, v]) => [v.active && kind === v.kind ? k : undefined, v.version]);
    const deps = (0, sdkgen_1.each)(feature, (feature) => (0, sdkgen_1.omap)(feature.deps?.[target.name], ([k, v]) => [v.active ? k : undefined, v]))
        .reduce((a, deps) => ((0, sdkgen_1.each)(deps, (dep) => a[dep.kind][dep.key$] = dep.version), a), {
        prod: only('prod', target.deps),
        peer: only('peer', target.deps),
        dev: only('dev', target.deps),
    });
    const SdkName = (0, apidef_1.nom)(model, 'Name');
    const { repoUrl, issuesUrl } = (0, sdkgen_1.repoInfo)(model);
    const pkg = {
        name: (0, sdkgen_1.packageName)(model, target.name),
        version: (0, sdkgen_1.packageVersion)(model, target.name),
        description: (0, sdkgen_1.pkgDescription)(model, target.name),
        keywords: (0, sdkgen_1.keywords)(model),
        homepage: `${repoUrl}#readme`,
        repository: { type: 'git', url: `git+${repoUrl}.git` },
        bugs: { url: issuesUrl },
        main: `dist/${SdkName}SDK.js`,
        type: 'commonjs',
        types: `dist/${SdkName}SDK.d.ts`,
        files: ['dist', '!dist/**/*.tsbuildinfo', 'src', 'README.md', 'REFERENCE.md'],
        scripts: {
            ...((0, sdkgen_1.hasLiveScenarios)(model) ? {
                'test:live': 'npm run build && node ' +
                    (0, sdkgen_1.npmScriptEnv)((0, sdkgen_1.envName)(model) + '_TEST_LIVE', 'TRUE') + ' --test dist-test/live.test.js',
            } : {}),
            'pretest': 'npm run build',
            'test': 'node --enable-source-maps --test-concurrency=1 --test "dist-test/**/*.test.js"',
            'test-some': (0, sdkgen_1.npmScriptTestSome)(['--enable-source-maps', '--experimental-test-isolation=none'], 'dist-test/**/*.test.js'),
            'pretest-utility': 'npm run build',
            'test-utility': 'node --enable-source-maps --test "dist-test/utility/*.test.js"',
            'pretest-coverage': 'npm run build',
            'test-coverage': 'node --test-concurrency=1 --experimental-test-coverage ' +
                '--test-coverage-exclude="**/dist-test/**" ' +
                '--test-coverage-lines=85 --test-coverage-branches=68 --test-coverage-functions=88 ' +
                '--test "dist-test/**/*.test.js"',
            "watch": "tsc --build src test -w",
            // Prune compiled output before building: `tsc --build` is incremental and
            // never deletes .js for a removed source, so entity tests that the model
            // folds away would otherwise keep running from stale dist-test/ and fail.
            "build": (0, sdkgen_1.npmScriptRm)(['dist', 'dist-test']) + ' && tsc --build src test',
            "clean": (0, sdkgen_1.npmScriptRm)(['node_modules', 'yarn.lock', 'package-lock.json', 'dist', 'dist-test']),
            "reset": "npm run clean && npm i && npm run build && npm test",
        },
        author,
        license: 'MIT',
        // node:module strips the README examples' types under TypeScript 7.
        engines: { node: '>=22.13' },
        dependencies: deps.prod,
        peerDependencies: deps.peer,
        devDependencies: deps.dev,
    };
    (0, sdkgen_1.File)({ name: 'package.json' }, () => {
        (0, sdkgen_1.Content)(JSON.stringify(pkg, null, 2) + '\n');
    });
});
exports.Package = Package;
//# sourceMappingURL=Package_ts.js.map
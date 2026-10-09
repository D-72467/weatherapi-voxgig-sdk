"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadmeExplanation = void 0;
const sdkgen_1 = require("@voxgig/sdkgen");
const ReadmeExplanation = (0, sdkgen_1.cmp)(function ReadmeExplanation(props) {
    const { target, ctx$: { model } } = props;
    (0, sdkgen_1.Content)(`### Module structure

\`\`\`
${model.name}/
├── src/
│   ├── ${model.Name}SDK.ts        # Main SDK class
│   ├── entity/             # Entity implementations
│   ├── feature/            # Built-in features (Base, Test, Log)
│   └── utility/            # Utility functions
├── test/                   # Test suites
└── dist/                   # Compiled output
\`\`\`

Import the SDK from the package root:

\`\`\`ts
import { ${model.Name}SDK } from '${(0, sdkgen_1.packageName)(model, target.name)}'
\`\`\`

`);
});
exports.ReadmeExplanation = ReadmeExplanation;
//# sourceMappingURL=ReadmeExplanation_ts.js.map
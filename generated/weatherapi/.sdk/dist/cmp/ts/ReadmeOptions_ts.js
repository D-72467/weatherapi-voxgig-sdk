"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadmeOptions = void 0;
const sdkgen_1 = require("@voxgig/sdkgen");
const ReadmeOptions = (0, sdkgen_1.cmp)(function ReadmeOptions(props) {
    const { target } = props;
    const { model } = props.ctx$;
    const publishedOptions = (0, sdkgen_1.each)(target.options).filter((option) => option.publish && ('apikey' !== option.name || (0, sdkgen_1.isAuthActive)(model)));
    if (0 === publishedOptions.length) {
        return;
    }
    (0, sdkgen_1.Content)(`

## Options

Pass options when creating a client instance:

`);
    (0, sdkgen_1.Content)(`\`\`\`ts
const client = new ${model.Name}SDK({
`);
    publishedOptions.map((option) => {
        if ('apikey' === option.name) {
            (0, sdkgen_1.Content)(`  ${option.name}: process.env.${(0, sdkgen_1.envName)(model)}_APIKEY,
`);
        }
        else {
            (0, sdkgen_1.Content)(`  // ${option.name}: ${option.kind === 'string' ? "'...'" : '...'},
`);
        }
    });
    (0, sdkgen_1.Content)(`})
\`\`\`

`);
    (0, sdkgen_1.Content)(`| Option | Type | Description |
| --- | --- | --- |
`);
    publishedOptions.map((option) => {
        (0, sdkgen_1.Content)(`| \`${option.name}\` | \`${option.kind}\` | ${option.short} |
`);
    });
    (0, sdkgen_1.Content)(`
`);
});
exports.ReadmeOptions = ReadmeOptions;
//# sourceMappingURL=ReadmeOptions_ts.js.map
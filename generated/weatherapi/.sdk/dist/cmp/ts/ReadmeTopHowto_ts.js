"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadmeTopHowto = void 0;
const sdkgen_1 = require("@voxgig/sdkgen");
const ReadmeTopHowto = (0, sdkgen_1.cmp)(function ReadmeTopHowto(props) {
    const { target } = props;
    (0, sdkgen_1.Content)(`**TypeScript:**
\`\`\`ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example' },
})
if (result.ok) {
  console.log(result.data)
}
\`\`\`

`);
});
exports.ReadmeTopHowto = ReadmeTopHowto;
//# sourceMappingURL=ReadmeTopHowto_ts.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainEntity = void 0;
const sdkgen_1 = require("@voxgig/sdkgen");
const MainEntity = (0, sdkgen_1.cmp)(async function MainEntity(props) {
    const { entity } = props;
    const { model } = props.ctx$;
    // Return the collision-free class TYPE (entityClassName); the accessor METHOD
    // name (entity.Name) is unchanged so callers still write client.<Name>().
    const cls = (0, sdkgen_1.entityClassName)(entity, (0, sdkgen_1.entityCollection)(model));
    (0, sdkgen_1.Content)(`
  // Entity access: \`client.${entity.Name}().list()\` / \`client.${entity.Name}().load({ id })\`.
  // The argument is the entity OPTIONS object (passed to the entity
  // constructor as entopts), not initial entity data.
  ${entity.Name}(entopts?: Record<string, any>) {
    const self = this
    return new ${cls}(self, entopts)
  }

`);
});
exports.MainEntity = MainEntity;
//# sourceMappingURL=MainEntity_ts.js.map
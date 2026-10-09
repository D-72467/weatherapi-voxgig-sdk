"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Test = void 0;
const sdkgen_1 = require("@voxgig/sdkgen");
const TestLive_ts_1 = require("./TestLive_ts");
const TestDefinition_ts_1 = require("./TestDefinition_ts");
const TestClean_ts_1 = require("./TestClean_ts");
const TestDirect_ts_1 = require("./TestDirect_ts");
const TestEntity_ts_1 = require("./TestEntity_ts");
const ReadmeExampleTest_ts_1 = require("./ReadmeExampleTest_ts");
const ReadmeExamplesTest_ts_1 = require("./ReadmeExamplesTest_ts");
const Test = (0, sdkgen_1.cmp)(function Test(props) {
    const { model, stdrep } = props.ctx$;
    const { target } = props;
    (0, sdkgen_1.Folder)({ name: 'test' }, () => {
        // Write-once: a project's edited control file survives regeneration.
        (0, sdkgen_1.TestControl)({ target, dir: 'test' });
        (0, TestLive_ts_1.TestLive)({ target });
        (0, TestDefinition_ts_1.TestDefinition)({ target });
        (0, TestClean_ts_1.TestClean)({ target });
        (0, ReadmeExampleTest_ts_1.ReadmeExampleTest)({ target });
        (0, ReadmeExamplesTest_ts_1.ReadmeExamplesTest)({ target });
        (0, sdkgen_1.Folder)({ name: 'entity' }, () => {
            // entityCollection is the cached, UNFILTERED collection (AGENTS.md), so
            // the active filter the raw model read this replaced never applied is
            // written out here. Tests follow Main: an inactive entity has no source.
            const entity = (0, sdkgen_1.each)((0, sdkgen_1.entityCollection)(model))
                .filter((e) => false !== e.active);
            (0, sdkgen_1.each)(entity, (entity) => {
                (0, TestEntity_ts_1.TestEntity)({ target, entity });
                (0, TestDirect_ts_1.TestDirect)({ target, entity });
            });
        });
    });
});
exports.Test = Test;
//# sourceMappingURL=Test_ts.js.map
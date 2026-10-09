# Voxgig SDK generator — mini-task 1

**Author:** Dragos Ciprian Cislaru  
**API:** [WeatherAPI.com](https://www.weatherapi.com/)  
**Generated target:** TypeScript  
**Specification:** https://www.weatherapi.com/openapi.json  
**Generator:** [Voxgig create-sdkgen / sdkgen](https://github.com/voxgig/create-sdkgen)  
**Repository:** https://github.com/D-72467/weatherapi-voxgig-sdk  
**Licence:** MIT (repository). Generator and upstream files retain their own notices.

## What I did

I selected WeatherAPI.com after checking the Voxgig catalogue for a provider-specific SDK, then used the official `@voxgig/create-sdkgen` scaffold and `@voxgig/sdkgen` generation tooling in GitHub Actions.

The workflow downloads the upstream OpenAPI 3 specification, normalises one invalid fragment-style path, creates a TypeScript SDK with offline test support, compiles it, runs the generated tests and commits the output. The workflow and normalisation script are included in this repository so generation is reproducible.

## Results (GitHub Actions evidence)

**Initial attempt:** [failed run #37916460858](https://github.com/D-72467/weatherapi-voxgig-sdk/actions/runs/37916460858)
- OpenAPI download: **passed**.
- Scaffold and TypeScript SDK generation: **passed** (13 generated API entities/operations).
- TypeScript compilation: **passed**.
- Generated offline tests: **268 passed, 1 failed, 21 skipped** (290 tests in 51 suites).
- Failure: `bulk.create POST /current.json#bulk` — `credential not sent as the definition declares it` (expected query parameter `key`).

**Second attempt:** [successful run #37917130762](https://github.com/D-72467/weatherapi-voxgig-sdk/actions/runs/37917130762)
- Normalisation, scaffold, generation and compilation: **passed**.
- Generated offline tests: **269 passed, 0 failed, 21 skipped** (290 tests in 51 suites).
- Generated TypeScript SDK committed under `generated/weatherapi/`.

**Live authenticated smoke test:** [successful run #37918523974](https://github.com/D-72467/weatherapi-voxgig-sdk/actions/runs/37918523974)
- Rebuilt generated SDK and ran `scripts/live-smoke.cjs` with a WeatherAPI key supplied via a GitHub Actions secret.
- Called `WeatherapiSDK.Current().load({ key, q: 'London' })` through the generated client, using the real WeatherAPI service (rather than the offline test transport).
- The request completed without throwing; `entity.data()` yielded an object and the workflow printed `LIVE_SDK_REQUEST: PASS (authenticated response received and parsed)`.
- **Scope of this first smoke run only:** It did not assert the HTTP status or weather fields. A later, separately linked expanded live suite exercised additional endpoints, response fields, and an invalid-key scenario.


**Expanded live integration test:** [successful run #37919174589](https://github.com/D-72467/weatherapi-voxgig-sdk/actions/runs/37919174589)
- Eight checks passed, zero failed, via generated SDK methods using the encrypted `WEATHERAPI_APIKEY` GitHub Actions secret.
- Checked numeric temperature, humidity, textual conditions, forecast temperature, location-search fields, time-zone metadata, astronomy sunrise/sunset, IP-location metadata, and historical daily average temperature.
- An intentionally invalid API key did not yield valid weather data, exercising an error scenario.
- Scope: bounded read-only integration checks, **not** full coverage of every generated operation or plan tier; it does not inspect every response field and the negative test is not a strict HTTP-status assertion.

## Issue found: fragment in an OpenAPI path

The source definition used `/current.json#bulk` as an API path for a POST operation. The generator treated that full string as a request path. When an API key and other parameters were appended to the URL, they appeared after the `#` fragment marker rather than in the URL query. As a result, the test did not observe the declared `key` query credential.

To verify this, a standard URL parser applied to `.../current.json#bulk?key=example` produces `search === ""` and a fragment containing `key=example`.

**Workaround:** `scripts/normalise-openapi.mjs` moves the POST operation to the existing `/current.json` path, preserving the GET operation and checking for an HTTP-method collision. It is run before scaffolding, leaving the upstream URL/spec source unmodified. After that change, the generated tests passed.

**Generator improvement suggestion:** validate or reject OpenAPI path keys containing a URL fragment, or normalise these pseudo-routes with an explicit warning before generating SDK calls. Avoid silently producing a route whose query and authentication parameters are lost.

## Other developer experience observations

- The official scaffolder and generator were straightforward to automate once the OpenAPI definition was available.
- Offline tests run without a WeatherAPI key, which made it possible to check many operations quickly.
- The initial failed workflow still uploaded a generated-code artifact, useful for inspecting source and test failures.
- The generated TypeScript package metadata and generated README retain template defaults pointing to `https://github.com/voxgig-sdk/weatherapi-sdk` instead of this contributor-owned repository. The root README links to the correct repository; generated defaults are intentionally left as evidence and should be corrected via the project model before any npm release.
- Generated tests include optional/feature-gated skips. The 21 skipped tests should not be presented as passes.

## Limits and follow-up

- A first live current-weather SDK smoke request succeeded; a later eight-case suite verified representative data fields across several read-only endpoints and the rejection of a deliberately invalid key.
- No npm package was published; repository publication is source-only.
- WeatherAPI subscription tier limitations were not validated.
- A full review of every generated operation against the upstream service is still needed for production use.

## Human-work time

**Candidate-reported active-work window:** approximately **11:14–11:42 AM BST, 9 October 2026 (about 28 minutes)**. The first commit was at **11:14:16 AM BST** and the expanded live checks finished at approximately **11:41:57 AM BST**. The candidate reported starting the hands-on work around the first commit. AI assistance and GitHub Actions automation were used, as permitted by the task. This is an **estimate based on candidate-reported work time** with commit/run timestamps corroborating milestones, not an independent measurement of active human minutes. Subsequent report and administrative updates happened later and are excluded from that initial estimate.

## Assessment use

This work was produced as an independent open-source SDK-generation exercise using Voxgig's publicly available tools. The implementation and results may be referenced in the candidate's reply. It is not an official WeatherAPI.com SDK or an endorsed Voxgig catalogue entry.

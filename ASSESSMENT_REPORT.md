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
- Scaffold and TypeScript SDK generation: **passed** (13 API entities/endpoints identified).
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
- **Scope:** This is a successful live-request smoke test, but the test does **not** assert the HTTP status, expected location name, temperature value, or response-schema shape. It does not exercise other endpoints or invalid-key handling. Those remain unverified.


## Issue found: fragment in an OpenAPI path

The source definition used `/current.json#bulk` as an API path for a POST operation. The generator treated that full string as a request path. When an API key and other parameters were appended to the URL, they appeared after the `#` fragment marker rather than in the URL query. As a result, the test did not observe the declared `key` query credential.

To verify this, a standard URL parser applied to `.../current.json#bulk?key=example` produces `search === ""` and a fragment containing `key=example`.

**Workaround:** `scripts/normalise-openapi.mjs` moves the POST operation to the existing `/current.json` path, preserving the GET operation and checking for an HTTP-method collision. It is run before scaffolding, leaving the upstream URL/spec source unmodified. After that change, the generated tests passed.

**Generator improvement suggestion:** validate or reject OpenAPI path keys containing a URL fragment, or normalise these pseudo-routes with an explicit warning before generating SDK calls. Avoid silently producing a route whose query and authentication parameters are lost.

## Other developer experience observations

- The official scaffolder and generator were straightforward to automate once the OpenAPI definition was available.
- Offline tests run without a WeatherAPI key, which made it possible to check many operations quickly.
- The initial failed workflow still uploaded a generated-code artifact, useful for inspecting source and test failures.
- The generated TypeScript package metadata and README contain default upstream catalogue links such as `https://github.com/voxgig-sdk/weatherapi-sdk`, which do not point to this contributor-owned repository. They would need adjusting through the project model before packaging/publishing this as a standalone npm package.
- Generated tests include optional/feature-gated skips. The 21 skipped tests should not be presented as passes.

## Limits and follow-up

- A **live current-weather SDK request** succeeded using a GitHub Actions secret. The smoke test only checked that it returned an object; it did not validate individual weather fields or negative/error cases.
- No npm package was published; repository publication is source-only.
- WeatherAPI subscription tier limitations were not validated.
- A full review of every generated operation against the upstream service is still needed for production use.

## Human-work time

**Human duration not independently measured.** The candidate should enter only actual time spent reviewing, configuring access and the results. GitHub job durations and commit timestamps demonstrate machine events, **not** human work time. The mini-task was designed to respect Voxgig's 30-minute human-work limit, but this report does not claim proof that the total was below the limit.

## Assessment use

This work was produced as an independent open-source SDK-generation exercise using Voxgig's publicly available tools. The implementation and results may be referenced in the candidate's reply. It is not an official WeatherAPI.com SDK or an endorsed Voxgig catalogue entry.

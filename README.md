# WeatherAPI.com SDK — Voxgig mini-task 1

Independent, **MIT-licensed** TypeScript SDK-generation exercise using [Voxgig create-sdkgen](https://github.com/voxgig/create-sdkgen) and the [WeatherAPI.com OpenAPI specification](https://www.weatherapi.com/openapi.json).

**Author:** Dragos Ciprian Cislaru  
**Repository:** https://github.com/D-72467/weatherapi-voxgig-sdk  
**Status:** SDK generated, compiled and validated with offline tests and bounded live integration checks.

## Results

| Check | Verified result |
| --- | --- |
| Generation using Voxgig SDK tooling | Passed |
| TypeScript build | Passed |
| Generated offline tests | **269 passed, 0 failed, 21 skipped** |
| Live authenticated smoke test | Passed |
| Expanded live integration checks | **8 passed, 0 failed** |

- [Verified SDK generation run](https://github.com/D-72467/weatherapi-voxgig-sdk/actions/runs/37917130762)
- [Initial failing run and error evidence](https://github.com/D-72467/weatherapi-voxgig-sdk/actions/runs/37916460858)
- [Live smoke test](https://github.com/D-72467/weatherapi-voxgig-sdk/actions/runs/37918523974)
- [Expanded live checks](https://github.com/D-72467/weatherapi-voxgig-sdk/actions/runs/37919174589)
- [Detailed assessment report](ASSESSMENT_REPORT.md)

## What's in the repository

- [`generated/weatherapi/ts`](generated/weatherapi/ts) — Voxgig-generated TypeScript SDK with generated tests and reference documentation.
- [`generated/weatherapi/.sdk`](generated/weatherapi/.sdk) — Voxgig project model and generator configuration.
- [`scripts/normalise-openapi.mjs`](scripts/normalise-openapi.mjs) — input-spec workaround for the `/current.json#bulk` pseudo-route.
- [`scripts/live-smoke.cjs`](scripts/live-smoke.cjs) — authenticated smoke test.
- [`scripts/live-validation.cjs`](scripts/live-validation.cjs) — bounded field-level checks for read-only weather endpoints and negative-key handling.
- [`.github/workflows/`](.github/workflows) — automation for generation, tests and live validation.
- [`ASSESSMENT_REPORT.md`](ASSESSMENT_REPORT.md) — exact evidence, limitations, developer experience and candidate-reported time estimate.

## Reproduce the generator

Run [the generation workflow](.github/workflows/generate-sdk.yml), which downloads the provider's OpenAPI file, normalises the fragment-style pseudo-route, calls Voxgig's official generator, builds the TypeScript target and runs the offline tests.

For authenticated live testing, save an API key as an encrypted GitHub Actions repository secret named `WEATHERAPI_APIKEY`, then run [Live SDK smoke test](.github/workflows/live-smoke.yml). **Never commit credentials or paste them into issues or logs.**

The generator initially failed one offline authentication check because the upstream OpenAPI input contained `/current.json#bulk`. The documented preprocessing workaround resolves the issue for this test project without editing generated source. See the report for specifics.

## Scope and licensing

This repository is source-only; no npm package is published. The live checks validate representative read-only responses and an invalid-key scenario, not all generated operations or paid subscription tiers. Automatically generated package metadata may still contain Voxgig catalogue defaults; they are documented in the report and should be corrected through generator configuration before publishing a package.

Original contributions in this repository are MIT-licensed; upstream tooling and other third-party materials retain their respective rights and notices. This is an **unofficial** SDK exercise, not endorsed by WeatherAPI.com or Voxgig.

# Voxgig SDK generator — mini-task 1

**API:** WeatherAPI.com  
**Language:** TypeScript  
**Specification:** https://www.weatherapi.com/openapi.json  
**Generator:** https://voxgig.com/sdk  
**Human time:** Not independently timed. Record actual participant time; limit is 30 minutes.

## Purpose
Generate an MIT-licensed SDK for a SaaS API not already in the Voxgig catalogue and report practical generator experiences.

## Work performed
- Public repository created by candidate and access configured.
- Provider selected after checking Voxgig's weather-related SDKs; those inspected correspond to other providers.
- CI automation prepared using Voxgig's official `@voxgig/create-sdkgen` scaffold and `@voxgig/sdkgen` toolchain.

## Verification
No claims of successful generation, compilation, offline tests or live API access yet. Consult the GitHub Actions workflow run logs for precise results.

## Planned checks
- Fetch upstream OpenAPI spec and check parsability.
- Scaffold with Voxgig generator and create TypeScript target.
- Generate and compile SDK; run offline tests.
- If time and a private API key allow, test an authenticated WeatherAPI request.
- Record command failures, developer experience and remaining limitations.

## Developer experience observations
To be updated after actual tool use, including any problem with OpenAPI compatibility, authentication or the generation process.

## Known limitations
Live API testing requires a WeatherAPI key supplied privately and should never be committed. Offline tests by themselves cannot prove live behavior.

## Human work log
Record actual human engagement time honestly. Do not infer time worked from GitHub commit timestamps.

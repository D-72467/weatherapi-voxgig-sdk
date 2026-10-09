# WeatherAPI.com

> WeatherAPI.com provides real-time, forecast, historical, marine, future, solar PV energy, astronomy, air quality, pollen, sports, IP lookup, timezone, and geolocation data via a JSON/XML REST API. Trusted by 1M+ users worldwide. Average response time ~200ms.
>
> ## Authentication
> All endpoints require an API key passed as the `key` query parameter.
>
> ## Base URL
> `https://api.weatherapi.com/v1`
>
> ## Location Query (`q` parameter)
> Accepts: city name, lat/lon decimal, US zip, UK postcode, Canada postal code, METAR code (`metar:EGLL`), IATA airport code (`iata:DXB`), IP lookup (`auto:ip`), IPv4/IPv6 address, or location ID (`id:2801268`).
>
> ## Plans
> - **Free**: 100K calls/month, 3-day forecast, 1-day history
> - **Starter**: $7/mo, 3M calls, 7-day forecast, 7-day history
> - **Pro+**: $25/mo, 5M calls, 300-day future, 365-day history
> - **Business**: $65/mo, 10M calls, evapotranspiration
> - **Enterprise**: Custom, 15-min interval, pollen history, wind@100m, SLA

## Start here

This guide introduces the API, the client libraries, and the companion tools in this repository. Start with the API capabilities, choose a client for your application, and use the linked reference when you need exact request and response details.

The selected API surface contains 13 entities and 13 HTTP routes. There are 1 SDK targets.

An entity groups related API operations. An operation can have several routes with different inputs or authentication requirements. The SDK exposes the entity and its operations using the conventions of the selected language.

## What the API provides

### Alert

Results: Weather alerts.

SDK operations: `load`.

Key fields to recognise:

- `location`: Location metadata returned with every weather response.

### Astronomy

Results: Astronomy data.

SDK operations: `load`.

Key fields to recognise:

- `location`: Location metadata returned with every weather response.

### Bulk

Results: Bulk weather results.

SDK operations: `create`.

### Current

Results: Current weather data.

SDK operations: `load`.

Key fields to recognise:

- `location`: Location metadata returned with every weather response.

### Forecast

Results: Forecast weather data.

SDK operations: `load`.

Key fields to recognise:

- `location`: Location metadata returned with every weather response.

### Future

Results: Future weather data.

SDK operations: `load`.

Key fields to recognise:

- `location`: Location metadata returned with every weather response.

### History

Results: Historical weather data.

SDK operations: `load`.

Key fields to recognise:

- `location`: Location metadata returned with every weather response.

### Ipn

Results: IP geolocation data.

SDK operations: `load`.

### Marine

Results: Marine weather data.

SDK operations: `load`.

Key fields to recognise:

- `location`: Location metadata returned with every weather response.

### Search

Results: List of matching locations.

SDK operations: `list`.

Key fields to recognise:

- `url`: URL-safe location slug

### Solar

Results: Solar PV energy forecast.

SDK operations: `load`.

Key fields to recognise:

- `location`: Location metadata returned with every weather response.
- `system`: Settings used for the calculation, including any defaults applied.

### Sport

Results: Sports events.

SDK operations: `list`.

### Timezone

Results: Timezone data.

SDK operations: `load`.

Key fields to recognise:

- `country`: Country name
- `lat`: Latitude
- `localtime`: Local date and time string
- `localtime_epoch`: Local time as Unix epoch
- `lon`: Longitude

### Route map

Use this map to locate a capability. Consult the entity reference before supplying request data; routes for the same operation can require different fields.

| Entity | SDK operation | HTTP route | Authentication |
| --- | --- | --- | --- |
| Alert | `load` | `GET /alerts.json` | Required |
| Astronomy | `load` | `GET /astronomy.json` | Required |
| Bulk | `create` | `POST /current.json` | Required |
| Current | `load` | `GET /current.json` | Required |
| Forecast | `load` | `GET /forecast.json` | Required |
| Future | `load` | `GET /future.json` | Required |
| History | `load` | `GET /history.json` | Required |
| Ipn | `load` | `GET /ip.json` | Required |
| Marine | `load` | `GET /marine.json` | Required |
| Search | `list` | `GET /search.json` | Required |
| Solar | `load` | `GET /solar.json` | Required |
| Sport | `list` | `GET /sports.json` | Required |
| Timezone | `load` | `GET /timezone.json` | Required |

## Connect to the API

- Production (HTTPS): `https://api.weatherapi.com/v1`
- Production (HTTP): `http://api.weatherapi.com/v1`

The default credential is sent in the `key` query.

API key obtained from https://www.weatherapi.com/my/. Pass as `?key=YOUR_API_KEY` query parameter.

Check authentication for the route you plan to call. A route that declares no authentication can be used without credentials; this does not change the requirements of other routes. Keep credentials in environment variables or a configured secret provider, and keep them out of source control and logs.

## Make a first request

1. Choose the API server and an operation that matches your task.
2. Check the operation’s required input and authentication. Use values valid for your account and environment.
3. Send one request and inspect the returned data before adding retries, concurrency, or a larger batch.

For an SDK call, install or build the chosen client, create a client instance with its documented configuration, and call the required entity operation. Language references describe the argument shape, asynchronous behaviour, and returned values.

## Choose an SDK

Choose the language already used by your application or service. The clients represent the same API model, while package setup, naming, and return types follow each language. Check the selected client’s reference and tests before integrating it into an existing application.

| Client | Repository directory | Distribution |
| --- | --- | --- |
| TypeScript | `ts/` | Build from source |

Build-from-source entries are not marked as published in the project model. Follow the build instructions in that target’s README, then consume the resulting package using your language’s local dependency mechanism. Published entries give the installation command recorded for that client.

## Operational features

Features supply behaviour around API calls, such as request handling, diagnostics, or local testing. Inclusion in this project does not mean a feature is enabled at runtime. Check the selected SDK’s supported features and configuration defaults, then enable the behaviour your application needs.

- `test`: In-memory mock transport for testing without a live server

Start with the default client configuration. Add request limits and diagnostics as needed, test error paths, and review retry behaviour before using operations that change data. A retry can repeat an operation unless the API provides a suitable guarantee.

## Continue with the documentation

- Follow the first-call guide for the setup sequence.
- Read the authentication guide before using protected routes.
- Use the API reference for request schemas, response formats, and status codes.
- Check the chosen SDK or companion tool reference for its configuration and supported operations.


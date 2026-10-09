# Weatherapi TypeScript SDK



The TypeScript SDK for the Weatherapi API — a type-safe, entity-oriented client with full async/await support.

The API is exposed as capitalised, semantic **Entities** — e.g.
`client.Alert()` — each with a small set of operations (`list`, `load`, `create`)
instead of raw URL paths and query parameters. This keeps the surface
predictable and low-friction for both humans and AI agents.


## Install
This package is not yet published to npm. Install it from the GitHub
release tag (`ts/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/weatherapi-sdk/tags)), or from a
clone, which carries the compiled `dist/`:

```bash
git clone https://github.com/voxgig-sdk/weatherapi-sdk
npm install ./weatherapi-sdk/ts
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record. The client sends the API key as the `key` query parameter.

### 1. Create a client

```ts
import { WeatherapiSDK } from '@voxgig-sdk/weatherapi-sdk'

const client = new WeatherapiSDK({
  apikey: process.env.WEATHERAPI_APIKEY,
})
```

### 3. Load an alert

`load()` returns the entity and throws on failure; `.data()` reads its record:

```ts
try {
  const alert = await client.Alert().load({ key: 'example_key', q: 'example_q' })
  console.log(alert.data())
} catch (err) {
  console.error('load failed:', err)
}
```


## Error handling

Entity operations reject on failure, so wrap them in `try` / `catch`:

```ts
try {
  const future = await client.Future().load({ dt: "example", key: "example", q: "example" })
  console.log(future.data())
} catch (err) {
  console.error('load failed:', err)
}
```

The low-level `direct()` method does **not** throw — it returns the
result envelope. Branch on `ok`; on failure `status` holds the HTTP status
(for error responses) and `err` holds the error:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example_id' },
})

if (!result.ok) {
  console.error('request failed:', result.status, result.err)
}
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example' },
})

if (result.ok) {
  console.log(result.status)  // 200
  console.log(result.data)    // response body
}
```

### Prepare a request without sending it

```ts
const fetchdef = await client.prepare({
  path: '/api/resource/{id}',
  method: 'DELETE',
  params: { id: 'example' },
})

// Inspect before sending
console.log(fetchdef.url)
console.log(fetchdef.method)
console.log(fetchdef.headers)
```

### Use test mode

Create a mock client for unit testing — no server required:

```ts
const client = WeatherapiSDK.test()

const future = await client.Future().load({ dt: 'example_dt', key: 'example_key', q: 'example_q' })
// future is the Future entity; .data() reads its mock record
console.log(future.data())
```

You can also use the instance method:

```ts
const client = new WeatherapiSDK({ apikey: '...' })
const testClient = client.tester()
```

### Retain entity state across calls

Entity instances remember their last match and data:

```ts
const entity = client.Future()

// First call runs the operation and stores its result
await entity.load({ dt: 'example_dt', key: 'example_key', q: 'example_q' })

// Subsequent calls reuse the stored state
const data = entity.data()
console.log(data)
```

### Add custom middleware

Pass features via the `extend` option:

```ts
const logger = {
  hooks: {
    PreRequest: (ctx: any) => {
      console.log('Requesting:', ctx.spec.method, ctx.spec.path)
    },
    PreResponse: (ctx: any) => {
      console.log('Status:', ctx.out.request?.status)
    },
  },
}

const client = new WeatherapiSDK({
  apikey: '...',
  extend: [logger],
})
```

### Run live tests

Create a `.env.local` file at the project root:

```
WEATHERAPI_TEST_LIVE=TRUE
WEATHERAPI_APIKEY=<your-key>
```

Then run:

```bash
cd ts && npm test
```

Live entity tests continue independent operations after errors and attempt
supported cleanup. Their final result reports failures and missing prerequisites
after the remaining work completes. The model and test inputs determine which
API operations the generated scenarios cover.


## Reference

### WeatherapiSDK

#### Constructor

```ts
new WeatherapiSDK(options?: {
  apikey?: string
  base?: string
  prefix?: string
  suffix?: string
  feature?: Record<string, { active: boolean }>
  extend?: Feature[]
})
```

| Option | Type | Description |
| --- | --- | --- |
| `apikey` | `string` | API key for authentication. |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `object` | Feature activation flags (e.g. `{ test: { active: true } }`). |
| `extend` | `Feature[]` | Additional feature instances to load. |

#### Methods

| Method | Returns | Description |
| --- | --- | --- |
| `options()` | `object` | Deep copy of current SDK options. |
| `utility()` | `Utility` | Deep copy of the SDK utility object. |
| `prepare(fetchargs?)` | `Promise<FetchDef>` | Build an HTTP request definition without sending it. |
| `direct(fetchargs?)` | `Promise<DirectResult>` | Build and send an HTTP request. |
| `Alert(data?)` | `AlertEntity` | Create an Alert entity instance. |
| `Astronomy(data?)` | `AstronomyEntity` | Create an Astronomy entity instance. |
| `Bulk(data?)` | `BulkEntity` | Create a Bulk entity instance. |
| `Current(data?)` | `CurrentEntity` | Create a Current entity instance. |
| `Forecast(data?)` | `ForecastEntity` | Create a Forecast entity instance. |
| `Future(data?)` | `FutureEntity` | Create a Future entity instance. |
| `History(data?)` | `HistoryEntity` | Create a History entity instance. |
| `Ipn(data?)` | `IpnEntity` | Create an Ipn entity instance. |
| `Marine(data?)` | `MarineEntity` | Create a Marine entity instance. |
| `Search(data?)` | `SearchEntity` | Create a Search entity instance. |
| `Solar(data?)` | `SolarEntity` | Create a Solar entity instance. |
| `Sport(data?)` | `SportEntity` | Create a Sport entity instance. |
| `Timezone(data?)` | `TimezoneEntity` | Create a Timezone entity instance. |
| `tester(testopts?, sdkopts?)` | `WeatherapiSDK` | Create a test-mode client instance. |

#### Static methods

| Method | Returns | Description |
| --- | --- | --- |
| `WeatherapiSDK.test(testopts?, sdkopts?)` | `WeatherapiSDK` | Create a test-mode client. |

### Entity interface

All entities share the same interface.

#### Methods

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `load(reqmatch?, ctrl?): Promise<Entity>` | Load a single entity by match criteria, and return it. |
| `list` | `list(reqmatch?, ctrl?): Promise<Entity[]>` | List entities matching the criteria, one per record. |
| `create` | `create(reqdata?, ctrl?): Promise<Entity>` | Create a new entity, and return it. |
| `data` | `data(data?: Partial<Entity>): Entity` | Get or set entity data. |
| `match` | `match(match?: Partial<Entity>): Partial<Entity>` | Get or set entity match criteria. |
| `make` | `make(): Entity` | Create a new instance with the same options. |
| `client` | `client(): WeatherapiSDK` | Return the parent SDK client. |
| `entopts` | `entopts(): object` | Return a copy of the entity options. |

#### Return values

Entity operations resolve to the entity itself — there is no result
envelope, and an entity's `data()` reads its record:

- `load` and `create` resolve to a single entity object.
- `list` resolves to an **array** of entity objects (iterate it directly;
  there is no `.data` and no `.ok`).

On a failed request these methods **throw**, so wrap calls in
`try`/`catch` to handle errors. Only `direct()` returns the result
envelope described below.

### DirectResult shape

The `direct()` method returns:

```ts
{
  ok: boolean
  status: number
  headers: object
  data: any
}
```

On error, `ok` is `false` and an `err` property contains the error.

### FetchDef shape

The `prepare()` method returns:

```ts
{
  url: string
  method: string
  headers: Record<string, string>
  body?: any
}
```

### Entities

#### Alert

| Field | Description |
| --- | --- |
| `alerts` |  |
| `location` | Location metadata returned with every weather response. |

Operations: load.

API path: `/alerts.json`

#### Astronomy

| Field | Description |
| --- | --- |
| `astronomy` |  |
| `location` | Location metadata returned with every weather response. |

Operations: load.

API path: `/astronomy.json`

#### Bulk

| Field | Description |
| --- | --- |
| `bulk` |  |
| `locations` |  |

Operations: create.

API path: `/current.json`

#### Current

| Field | Description |
| --- | --- |
| `current` |  |
| `location` | Location metadata returned with every weather response. |

Operations: load.

API path: `/current.json`

#### Forecast

| Field | Description |
| --- | --- |
| `alerts` |  |
| `current` |  |
| `forecast` |  |
| `location` | Location metadata returned with every weather response. |

Operations: load.

API path: `/forecast.json`

#### Future

| Field | Description |
| --- | --- |
| `alerts` |  |
| `current` |  |
| `forecast` |  |
| `location` | Location metadata returned with every weather response. |

Operations: load.

API path: `/future.json`

#### History

| Field | Description |
| --- | --- |
| `alerts` |  |
| `current` |  |
| `forecast` |  |
| `location` | Location metadata returned with every weather response. |

Operations: load.

API path: `/history.json`

#### Ipn

| Field | Description |
| --- | --- |
| `city` |  |
| `continent_code` |  |
| `continent_name` |  |
| `country_code` |  |
| `country_name` |  |
| `geoname_id` |  |
| `ip` |  |
| `is_eu` |  |
| `lat` |  |
| `localtime` |  |
| `localtime_epoch` |  |
| `lon` |  |
| `region` |  |
| `type` |  |
| `tz_id` |  |

Operations: load.

API path: `/ip.json`

#### Marine

| Field | Description |
| --- | --- |
| `forecast` |  |
| `location` | Location metadata returned with every weather response. |

Operations: load.

API path: `/marine.json`

#### Search

| Field | Description |
| --- | --- |
| `country` |  |
| `id` |  |
| `lat` |  |
| `lon` |  |
| `name` |  |
| `region` |  |
| `url` | URL-safe location slug |

Operations: list.

API path: `/search.json`

#### Solar

| Field | Description |
| --- | --- |
| `forecast` |  |
| `location` | Location metadata returned with every weather response. |
| `system` | Settings used for the calculation, including any defaults applied. |

Operations: load.

API path: `/solar.json`

#### Sport

| Field | Description |
| --- | --- |
| `cricket` |  |
| `football` |  |
| `golf` |  |

Operations: list.

API path: `/sports.json`

#### Timezone

| Field | Description |
| --- | --- |
| `country` | Country name |
| `lat` | Latitude |
| `localtime` | Local date and time string |
| `localtime_epoch` | Local time as Unix epoch |
| `lon` | Longitude |
| `name` | Location name |
| `region` | Region or state |
| `tz_id` | IANA timezone ID, e.g. |

Operations: load.

API path: `/timezone.json`



## Entities


### Alert

Create an instance: `const alert = client.Alert()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `alerts` | `Record<string, any>` |  |
| `location` | `Record<string, any>` | Location metadata returned with every weather response. |

#### Example: Load

```ts
const alert = await client.Alert().load({ key: 'key', q: 'q' })
```


### Astronomy

Create an instance: `const astronomy = client.Astronomy()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `astronomy` | `Record<string, any>` |  |
| `location` | `Record<string, any>` | Location metadata returned with every weather response. |

#### Example: Load

```ts
const astronomy = await client.Astronomy().load({ dt: 'dt', key: 'key', q: 'q' })
```


### Bulk

Create an instance: `const bulk = client.Bulk()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `bulk` | `any[]` |  |
| `locations` | `any[]` |  |

#### Example: Create

```ts
const bulk = await client.Bulk().create({
  key: 'example_key',
  q: 'example_q',
  locations: [],
})
```


### Current

Create an instance: `const current = client.Current()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `current` | `Record<string, any>` |  |
| `location` | `Record<string, any>` | Location metadata returned with every weather response. |

#### Example: Load

```ts
const current = await client.Current().load({ key: 'key', q: 'q' })
```


### Forecast

Create an instance: `const forecast = client.Forecast()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `alerts` | `Record<string, any>` |  |
| `current` | `Record<string, any>` |  |
| `forecast` | `Record<string, any>` |  |
| `location` | `Record<string, any>` | Location metadata returned with every weather response. |

#### Example: Load

```ts
const forecast = await client.Forecast().load({ day: 1, key: 'key', q: 'q' })
```


### Future

Create an instance: `const future = client.Future()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `alerts` | `Record<string, any>` |  |
| `current` | `Record<string, any>` |  |
| `forecast` | `Record<string, any>` |  |
| `location` | `Record<string, any>` | Location metadata returned with every weather response. |

#### Example: Load

```ts
const future = await client.Future().load({ dt: 'dt', key: 'key', q: 'q' })
```


### History

Create an instance: `const history = client.History()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `alerts` | `Record<string, any>` |  |
| `current` | `Record<string, any>` |  |
| `forecast` | `Record<string, any>` |  |
| `location` | `Record<string, any>` | Location metadata returned with every weather response. |

#### Example: Load

```ts
const history = await client.History().load({ dt: 'dt', key: 'key', q: 'q' })
```


### Ipn

Create an instance: `const ipn = client.Ipn()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `city` | `string` |  |
| `continent_code` | `string` |  |
| `continent_name` | `string` |  |
| `country_code` | `string` |  |
| `country_name` | `string` |  |
| `geoname_id` | `string` |  |
| `ip` | `string` |  |
| `is_eu` | `boolean` |  |
| `lat` | `number` |  |
| `localtime` | `string` |  |
| `localtime_epoch` | `number` |  |
| `lon` | `number` |  |
| `region` | `string` |  |
| `type` | `string` |  |
| `tz_id` | `string` |  |

#### Example: Load

```ts
const ipn = await client.Ipn().load({ key: 'key', q: 'q' })
```


### Marine

Create an instance: `const marine = client.Marine()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `forecast` | `Record<string, any>` |  |
| `location` | `Record<string, any>` | Location metadata returned with every weather response. |

#### Example: Load

```ts
const marine = await client.Marine().load({ day: 1, key: 'key', q: 'q' })
```


### Search

Create an instance: `const search = client.Search()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `country` | `string` |  |
| `id` | `number` |  |
| `lat` | `number` |  |
| `lon` | `number` |  |
| `name` | `string` |  |
| `region` | `string` |  |
| `url` | `string` | URL-safe location slug |

#### Example: List

```ts
const searchs = await client.Search().list({ key: "example", q: "example" })
```


### Solar

Create an instance: `const solar = client.Solar()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `forecast` | `Record<string, any>` |  |
| `location` | `Record<string, any>` | Location metadata returned with every weather response. |
| `system` | `Record<string, any>` | Settings used for the calculation, including any defaults applied. |

#### Example: Load

```ts
const solar = await client.Solar().load({ capacity_kw: 1, key: 'key', q: 'q' })
```


### Sport

Create an instance: `const sport = client.Sport()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `cricket` | `any[]` |  |
| `football` | `any[]` |  |
| `golf` | `any[]` |  |

#### Example: List

```ts
const sports = await client.Sport().list({ key: "example", q: "example" })
```


### Timezone

Create an instance: `const timezone = client.Timezone()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `country` | `string` | Country name |
| `lat` | `number` | Latitude |
| `localtime` | `string` | Local date and time string |
| `localtime_epoch` | `number` | Local time as Unix epoch |
| `lon` | `number` | Longitude |
| `name` | `string` | Location name |
| `region` | `string` | Region or state |
| `tz_id` | `string` | IANA timezone ID, e.g. |

#### Example: Load

```ts
const timezone = await client.Timezone().load({ key: 'key', q: 'q' })
```

## Features

This SDK ships 1 optional features. Each is **inactive until you
switch it on**, so an SDK you have not configured behaves exactly as if none of
them existed — no retries, no cache, no logging, no measurable overhead.

Activate a feature by name in the client options, alongside the options shown
above:

| Feature | What it does |
|---|---|
| [`test`](#test) | Test transport |

### test

Test transport.

| Option | Default |
|---|---|
| `active` | `false` |

Set `feature.test.active` to enable it, then override any of the options above.


## Advanced

> The sections above cover everyday use. The material below explains the
> SDK's internals — useful when extending it with custom features, but not
> needed for normal use.

### The operation pipeline

Every entity operation follows a six-stage pipeline. Each stage fires a
feature hook before executing:

```
PrePoint → PreSpec → PreRequest → PreResponse → PreResult → PreDone
```

- **PrePoint**: Resolves which API endpoint to call based on the
  operation name and entity configuration.
- **PreSpec**: Builds the HTTP spec — URL, method, headers, body —
  from the resolved point and the caller's parameters.
- **PreRequest**: Sends the HTTP request. Features can intercept here
  to replace the transport (as TestFeature does with mocks).
- **PreResponse**: Parses the raw HTTP response.
- **PreResult**: Extracts the business data from the parsed response.
- **PreDone**: Final stage before returning to the caller. Entity
  state (match, data) is updated here.

If any stage errors, the pipeline short-circuits and the error surfaces
to the caller — see [Error handling](#error-handling) for how that looks
in this language.

### Features and hooks

Features are the extension mechanism. A feature is an object with a
`hooks` map. Each hook key is a pipeline stage name, and the value is
a function that receives the context.

The SDK ships with built-in features:

- **TestFeature**: Test transport

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Module structure

```
weatherapi/
├── src/
│   ├── WeatherapiSDK.ts        # Main SDK class
│   ├── entity/             # Entity implementations
│   ├── feature/            # Built-in features (Base, Test, Log)
│   └── utility/            # Utility functions
├── test/                   # Test suites
└── dist/                   # Compiled output
```

Import the SDK from the package root:

```ts
import { WeatherapiSDK } from '@voxgig-sdk/weatherapi-sdk'
```

### Entity state

Entity instances are stateful. After a successful `load`, the entity
stores the returned data and match criteria internally. Subsequent
calls on the same instance can rely on this state.

```ts
const future = client.Future()
await future.load({ dt: "example", key: "example", q: "example" })

// future.data() now returns the future data from the last `load`
// future.match() returns the last match criteria
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

The `direct` method gives full control over the HTTP request. Use it
for non-standard endpoints, bulk operations, or any path not modelled
as an entity. The `prepare` method is useful for debugging — it
shows exactly what `direct` would send.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.

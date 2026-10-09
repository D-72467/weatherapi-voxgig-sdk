# Weatherapi TypeScript SDK Reference

Complete API reference for the Weatherapi TypeScript SDK.


## WeatherapiSDK

### Constructor

```ts
new WeatherapiSDK(options?: object)
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `object` | SDK configuration options. |
| `options.apikey` | `string` | API key for authentication. |
| `options.base` | `string` | Base URL for API requests. |
| `options.prefix` | `string` | URL prefix appended after base. |
| `options.suffix` | `string` | URL suffix appended after path. |
| `options.headers` | `object` | Custom headers for all requests. |
| `options.feature` | `object` | Feature configuration. |
| `options.system` | `object` | System overrides (e.g. custom fetch). |


### Static Methods

#### `WeatherapiSDK.test(testopts?, sdkopts?)`

Create a test client with mock features active.

```ts
const client = WeatherapiSDK.test()
```

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `testopts` | `object` | Test feature options. |
| `sdkopts` | `object` | Additional SDK options merged with test defaults. |

**Returns:** `WeatherapiSDK` instance in test mode.


### Instance Methods

#### `Alert(data?: object)`

Create a new `Alert` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `AlertEntity` instance.

#### `Astronomy(data?: object)`

Create a new `Astronomy` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `AstronomyEntity` instance.

#### `Bulk(data?: object)`

Create a new `Bulk` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `BulkEntity` instance.

#### `Current(data?: object)`

Create a new `Current` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `CurrentEntity` instance.

#### `Forecast(data?: object)`

Create a new `Forecast` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `ForecastEntity` instance.

#### `Future(data?: object)`

Create a new `Future` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `FutureEntity` instance.

#### `History(data?: object)`

Create a new `History` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `HistoryEntity` instance.

#### `Ipn(data?: object)`

Create a new `Ipn` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `IpnEntity` instance.

#### `Marine(data?: object)`

Create a new `Marine` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `MarineEntity` instance.

#### `Search(data?: object)`

Create a new `Search` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `SearchEntity` instance.

#### `Solar(data?: object)`

Create a new `Solar` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `SolarEntity` instance.

#### `Sport(data?: object)`

Create a new `Sport` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `SportEntity` instance.

#### `Timezone(data?: object)`

Create a new `Timezone` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `TimezoneEntity` instance.

#### `options()`

Return a deep copy of the current SDK options.

**Returns:** `object`

#### `utility()`

Return a copy of the SDK utility object.

**Returns:** `object`

#### `direct(fetchargs?: object)`

Make a direct HTTP request to any API endpoint.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `fetchargs.path` | `string` | URL path with optional `{param}` placeholders. |
| `fetchargs.method` | `string` | HTTP method (default: `GET`). |
| `fetchargs.params` | `object` | Path parameter values for `{param}` substitution. |
| `fetchargs.query` | `object` | Query string parameters. |
| `fetchargs.headers` | `object` | Request headers (merged with defaults). |
| `fetchargs.body` | `any` | Request body (objects are JSON-serialized). |
| `fetchargs.ctrl` | `object` | Control options (e.g. `{ explain: true }`). |
| `fetchargs.ctrl.signal` | `AbortSignal` | Aborts the request in flight: `ok` is then `false` and `err.code` is `request_aborted`. |

**Returns:** `Promise<{ ok, status, headers, data }>`. On a failure
`ok` is `false` and `err` holds the error.

#### `prepare(fetchargs?: object)`

Prepare a fetch definition without sending the request. Accepts the
same parameters as `direct()`.

**Returns:** `Promise<{ url, method, headers, body } | Error>`

#### `tester(testopts?, sdkopts?)`

Alias for `WeatherapiSDK.test()`.

**Returns:** `WeatherapiSDK` instance in test mode.

#### Cancelling a call

Every entity operation takes an optional `ctrl` object after its match or
data, and an `AbortSignal` in `ctrl.signal` cancels the request in flight.
The operation then rejects with an error whose `code` is
`request_aborted` and whose `cause` is the signal's reason. A request
whose signal has already aborted is not sent. `stream()` takes the signal
as `callopts.signal`, and ends when it aborts.


---

## AlertEntity

```ts
const alert = client.Alert()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `alerts` | `Record<string, any>` | No |  |
| `location` | `Record<string, any>` | No | Location metadata returned with every weather response. |

### Operations

#### `load(match: object, ctrl?: object)`

Load a single entity matching the given criteria. Resolves to the entity, whose record `data()` reads.

```ts
const result = await client.Alert().load({ key: 'key', q: 'q' })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `AlertEntity` instance with the same client and
options.

#### `client()`

Return the parent `WeatherapiSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## AstronomyEntity

```ts
const astronomy = client.Astronomy()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `astronomy` | `Record<string, any>` | No |  |
| `location` | `Record<string, any>` | No | Location metadata returned with every weather response. |

### Operations

#### `load(match: object, ctrl?: object)`

Load a single entity matching the given criteria. Resolves to the entity, whose record `data()` reads.

```ts
const result = await client.Astronomy().load({ dt: 'dt', key: 'key', q: 'q' })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `AstronomyEntity` instance with the same client and
options.

#### `client()`

Return the parent `WeatherapiSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## BulkEntity

```ts
const bulk = client.Bulk()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `bulk` | `any[]` | No |  |
| `locations` | `any[]` | Yes |  |

### Operations

#### `create(data: object, ctrl?: object)`

Create a new entity with the given data. Resolves to the created entity.

```ts
const result = await client.Bulk().create({
  key: 'example_key',
  q: 'example_q',
  locations: [],
})
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `BulkEntity` instance with the same client and
options.

#### `client()`

Return the parent `WeatherapiSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## CurrentEntity

```ts
const current = client.Current()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `current` | `Record<string, any>` | No |  |
| `location` | `Record<string, any>` | No | Location metadata returned with every weather response. |

### Operations

#### `load(match: object, ctrl?: object)`

Load a single entity matching the given criteria. Resolves to the entity, whose record `data()` reads.

```ts
const result = await client.Current().load({ key: 'key', q: 'q' })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `CurrentEntity` instance with the same client and
options.

#### `client()`

Return the parent `WeatherapiSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## ForecastEntity

```ts
const forecast = client.Forecast()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `alerts` | `Record<string, any>` | No |  |
| `current` | `Record<string, any>` | No |  |
| `forecast` | `Record<string, any>` | No |  |
| `location` | `Record<string, any>` | No | Location metadata returned with every weather response. |

### Operations

#### `load(match: object, ctrl?: object)`

Load a single entity matching the given criteria. Resolves to the entity, whose record `data()` reads.

```ts
const result = await client.Forecast().load({ day: 1, key: 'key', q: 'q' })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `ForecastEntity` instance with the same client and
options.

#### `client()`

Return the parent `WeatherapiSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## FutureEntity

```ts
const future = client.Future()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `alerts` | `Record<string, any>` | No |  |
| `current` | `Record<string, any>` | No |  |
| `forecast` | `Record<string, any>` | No |  |
| `location` | `Record<string, any>` | No | Location metadata returned with every weather response. |

### Operations

#### `load(match: object, ctrl?: object)`

Load a single entity matching the given criteria. Resolves to the entity, whose record `data()` reads.

```ts
const result = await client.Future().load({ dt: 'dt', key: 'key', q: 'q' })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `FutureEntity` instance with the same client and
options.

#### `client()`

Return the parent `WeatherapiSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## HistoryEntity

```ts
const history = client.History()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `alerts` | `Record<string, any>` | No |  |
| `current` | `Record<string, any>` | No |  |
| `forecast` | `Record<string, any>` | No |  |
| `location` | `Record<string, any>` | No | Location metadata returned with every weather response. |

### Operations

#### `load(match: object, ctrl?: object)`

Load a single entity matching the given criteria. Resolves to the entity, whose record `data()` reads.

```ts
const result = await client.History().load({ dt: 'dt', key: 'key', q: 'q' })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `HistoryEntity` instance with the same client and
options.

#### `client()`

Return the parent `WeatherapiSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## IpnEntity

```ts
const ipn = client.Ipn()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `city` | `string` | No |  |
| `continent_code` | `string` | No |  |
| `continent_name` | `string` | No |  |
| `country_code` | `string` | No |  |
| `country_name` | `string` | No |  |
| `geoname_id` | `string` | No |  |
| `ip` | `string` | No |  |
| `is_eu` | `boolean` | No |  |
| `lat` | `number` | No |  |
| `localtime` | `string` | No |  |
| `localtime_epoch` | `number` | No |  |
| `lon` | `number` | No |  |
| `region` | `string` | No |  |
| `type` | `string` | No |  |
| `tz_id` | `string` | No |  |

### Operations

#### `load(match: object, ctrl?: object)`

Load a single entity matching the given criteria. Resolves to the entity, whose record `data()` reads.

```ts
const result = await client.Ipn().load({ key: 'key', q: 'q' })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `IpnEntity` instance with the same client and
options.

#### `client()`

Return the parent `WeatherapiSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## MarineEntity

```ts
const marine = client.Marine()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `forecast` | `Record<string, any>` | No |  |
| `location` | `Record<string, any>` | No | Location metadata returned with every weather response. |

### Operations

#### `load(match: object, ctrl?: object)`

Load a single entity matching the given criteria. Resolves to the entity, whose record `data()` reads.

```ts
const result = await client.Marine().load({ day: 1, key: 'key', q: 'q' })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `MarineEntity` instance with the same client and
options.

#### `client()`

Return the parent `WeatherapiSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## SearchEntity

```ts
const search = client.Search()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `country` | `string` | No |  |
| `id` | `number` | No |  |
| `lat` | `number` | No |  |
| `lon` | `number` | No |  |
| `name` | `string` | No |  |
| `region` | `string` | No |  |
| `url` | `string` | No | URL-safe location slug |

### Operations

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Resolves to an array of entities, one per record.

```ts
const results = await client.Search().list({ key: "example", q: "example" })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `SearchEntity` instance with the same client and
options.

#### `client()`

Return the parent `WeatherapiSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## SolarEntity

```ts
const solar = client.Solar()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `forecast` | `Record<string, any>` | No |  |
| `location` | `Record<string, any>` | No | Location metadata returned with every weather response. |
| `system` | `Record<string, any>` | No | Settings used for the calculation, including any defaults applied. |

### Operations

#### `load(match: object, ctrl?: object)`

Load a single entity matching the given criteria. Resolves to the entity, whose record `data()` reads.

```ts
const result = await client.Solar().load({ capacity_kw: 1, key: 'key', q: 'q' })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `SolarEntity` instance with the same client and
options.

#### `client()`

Return the parent `WeatherapiSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## SportEntity

```ts
const sport = client.Sport()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `cricket` | `any[]` | No |  |
| `football` | `any[]` | No |  |
| `golf` | `any[]` | No |  |

### Operations

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Resolves to an array of entities, one per record.

```ts
const results = await client.Sport().list({ key: "example", q: "example" })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `SportEntity` instance with the same client and
options.

#### `client()`

Return the parent `WeatherapiSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## TimezoneEntity

```ts
const timezone = client.Timezone()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `country` | `string` | No | Country name |
| `lat` | `number` | No | Latitude |
| `localtime` | `string` | No | Local date and time string |
| `localtime_epoch` | `number` | No | Local time as Unix epoch |
| `lon` | `number` | No | Longitude |
| `name` | `string` | No | Location name |
| `region` | `string` | No | Region or state |
| `tz_id` | `string` | No | IANA timezone ID, e.g. |

### Operations

#### `load(match: object, ctrl?: object)`

Load a single entity matching the given criteria. Resolves to the entity, whose record `data()` reads.

```ts
const result = await client.Timezone().load({ key: 'key', q: 'q' })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `TimezoneEntity` instance with the same client and
options.

#### `client()`

Return the parent `WeatherapiSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## Features

| Feature | Version | Description |
| --- | --- | --- |
| `test` | 0.0.1 | Test transport |


Features are activated via the `feature` option:

```ts
const client = new WeatherapiSDK({
  feature: {
    test: { active: true },
  }
})
```


### Configuring features

Each feature is inactive until switched on, and an SDK with no feature
configured does no feature work at all. Every option below keeps its default
unless you name it.

The array form of \`feature\` is significant: several features wrap the
transport, and the order you list them in is the order they nest.

#### `test`

Test transport.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |

| Option | Type |
|---|---|
| `entity` | map |
| `net` | map |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.test.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Attaches to pipeline hooks, not the transport, so activation order does
  not change what it observes.
- Installs the BASE transport that the wrapping features wrap, so it must be
  activated before them.
- Inactive by default: leaving it out costs nothing at runtime.


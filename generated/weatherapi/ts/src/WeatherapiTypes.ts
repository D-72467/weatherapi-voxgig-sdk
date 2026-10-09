// Typed models for the Weatherapi SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface Alert {
  alerts?: Record<string, any>
  location?: Record<string, any>
}

export interface AlertLoadMatch {
  key: string
  q: string
}

export interface Astronomy {
  astronomy?: Record<string, any>
  location?: Record<string, any>
}

export interface AstronomyLoadMatch {
  dt: string
  key: string
  q: string
}

export interface Bulk {
  bulk?: any[]
  locations: any[]
}

export interface BulkCreateData {
  aqi?: string
  key: string
  q: string
  bulk?: any[]
  locations: any[]
}

export interface Current {
  current?: Record<string, any>
  location?: Record<string, any>
}

export interface CurrentLoadMatch {
  aqi?: string
  current_field?: string
  key: string
  lang?: string
  pollen?: string
  q: string
}

export interface Forecast {
  alerts?: Record<string, any>
  current?: Record<string, any>
  forecast?: Record<string, any>
  location?: Record<string, any>
}

export interface ForecastLoadMatch {
  alert?: string
  aqi?: string
  day: number
  day_field?: string
  dt?: string
  et0?: string
  hour?: number
  hour_field?: string
  key: string
  lang?: string
  pollen?: string
  q: string
  tp?: number
  unixdt?: number
}

export interface Future {
  alerts?: Record<string, any>
  current?: Record<string, any>
  forecast?: Record<string, any>
  location?: Record<string, any>
}

export interface FutureLoadMatch {
  dt: string
  key: string
  lang?: string
  q: string
}

export interface History {
  alerts?: Record<string, any>
  current?: Record<string, any>
  forecast?: Record<string, any>
  location?: Record<string, any>
}

export interface HistoryLoadMatch {
  aqi?: string
  dt: string
  end_dt?: string
  et0?: string
  hour?: number
  key: string
  lang?: string
  pollen?: string
  q: string
  solar?: string
  tp?: number
  unixdt?: number
  unixend_dt?: number
  wind100kph?: string
  wind100mph?: string
}

export interface Ipn {
  city?: string
  continent_code?: string
  continent_name?: string
  country_code?: string
  country_name?: string
  geoname_id?: string
  ip?: string
  is_eu?: boolean
  lat?: number
  localtime?: string
  localtime_epoch?: number
  lon?: number
  region?: string
  type?: string
  tz_id?: string
}

export interface IpnLoadMatch {
  key: string
  q: string
}

export interface Marine {
  forecast?: Record<string, any>
  location?: Record<string, any>
}

export interface MarineLoadMatch {
  day: number
  dt?: string
  hour?: number
  key: string
  q: string
  tide?: string
}

export interface Search {
  country?: string
  id?: number
  lat?: number
  lon?: number
  name?: string
  region?: string
  url?: string
}

export interface SearchListMatch {
  key: string
  q: string
}

export interface Solar {
  forecast?: Record<string, any>
  location?: Record<string, any>
  system?: Record<string, any>
}

export interface SolarLoadMatch {
  albedo?: number
  azimuth?: number
  capacity_kw: number
  day?: number
  inverter_eff?: number
  inverter_kw?: number
  key: string
  loss?: number
  module_type?: string
  q: string
  tilt?: number
  tracking?: string
}

export interface Sport {
  cricket?: any[]
  football?: any[]
  golf?: any[]
}

export interface SportListMatch {
  key: string
  q: string
}

export interface Timezone {
  country?: string
  lat?: number
  localtime?: string
  localtime_epoch?: number
  lon?: number
  name?: string
  region?: string
  tz_id?: string
}

export interface TimezoneLoadMatch {
  key: string
  q: string
}


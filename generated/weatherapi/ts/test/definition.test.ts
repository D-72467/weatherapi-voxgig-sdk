import { describe, test } from 'node:test'
import { SDK } from '..'
import { runDefinitionPoint } from './definition-runner'
import { isControlSkipped } from './utility'


// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN: any[] = [
  {
    "entity": "alert",
    "accessor": "Alert",
    "op": "load",
    "method": "GET",
    "path": "/alerts.json",
    "args": [],
    "select": {
      "key": "YOUR_API_KEY",
      "q": "London"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "key",
      "q"
    ],
    "queryArgs": [
      {
        "name": "key",
        "wire": "key"
      },
      {
        "name": "q",
        "wire": "q"
      }
    ],
    "auth": [
      [
        {
          "in": "query",
          "name": "key"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "location": {
        "name": "x",
        "region": "x",
        "country": "x",
        "lat": 1,
        "lon": 1,
        "tz_id": "x",
        "localtime_epoch": 1,
        "localtime": "x"
      },
      "alerts": {
        "alert": [
          {
            "headline": "x",
            "msgtype": "x",
            "severity": "x",
            "urgency": "x",
            "areas": "x",
            "category": "x",
            "certainty": "x",
            "event": "x",
            "note": "x",
            "effective": "x",
            "expires": "x",
            "desc": "x",
            "instruction": "x"
          }
        ]
      }
    },
    "idField": "id",
    "ownQuery": "key"
  },
  {
    "entity": "astronomy",
    "accessor": "Astronomy",
    "op": "load",
    "method": "GET",
    "path": "/astronomy.json",
    "args": [],
    "select": {
      "dt": "2026-03-20",
      "key": "YOUR_API_KEY",
      "q": "London"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "key",
      "q",
      "dt"
    ],
    "queryArgs": [
      {
        "name": "dt",
        "wire": "dt"
      },
      {
        "name": "key",
        "wire": "key"
      },
      {
        "name": "q",
        "wire": "q"
      }
    ],
    "auth": [
      [
        {
          "in": "query",
          "name": "key"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "location": {
        "name": "x",
        "region": "x",
        "country": "x",
        "lat": 1,
        "lon": 1,
        "tz_id": "x",
        "localtime_epoch": 1,
        "localtime": "x"
      },
      "astronomy": {
        "astro": {
          "sunrise": "x",
          "sunset": "x",
          "moonrise": "x",
          "moonset": "x",
          "moon_phase": "x",
          "moon_illumination": 1,
          "is_moon_up": 1,
          "is_sun_up": 1
        }
      }
    },
    "idField": "id",
    "ownQuery": "key"
  },
  {
    "entity": "bulk",
    "accessor": "Bulk",
    "op": "create",
    "method": "POST",
    "path": "/current.json",
    "args": [],
    "select": {
      "key": "YOUR_API_KEY",
      "q": "v1",
      "aqi": "no"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "key",
      "q",
      "aqi"
    ],
    "queryArgs": [],
    "auth": [
      [
        {
          "in": "query",
          "name": "key"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "bulk": [
        {
          "query": {
            "custom_id": "x",
            "q": "x",
            "location": {
              "name": "x",
              "region": "x",
              "country": "x",
              "lat": 1,
              "lon": 1,
              "tz_id": "x",
              "localtime_epoch": 1,
              "localtime": "x"
            },
            "current": {
              "last_updated_epoch": 1,
              "last_updated": "x",
              "temp_c": 1,
              "temp_f": 1,
              "is_day": 1,
              "condition": {
                "text": "x",
                "icon": "x",
                "code": 1
              },
              "wind_mph": 1,
              "wind_kph": 1,
              "wind_degree": 1,
              "wind_dir": "x",
              "pressure_mb": 1,
              "pressure_in": 1,
              "precip_mm": 1,
              "precip_in": 1,
              "humidity": 1,
              "cloud": 1,
              "feelslike_c": 1,
              "feelslike_f": 1,
              "windchill_c": 1,
              "windchill_f": 1,
              "heatindex_c": 1,
              "heatindex_f": 1,
              "dewpoint_c": 1,
              "dewpoint_f": 1,
              "vis_km": 1,
              "vis_miles": 1,
              "uv": 1,
              "gust_mph": 1,
              "gust_kph": 1,
              "short_rad": 1,
              "diff_rad": 1,
              "air_quality": {
                "co": 1,
                "o3": 1,
                "no2": 1,
                "so2": 1,
                "pm2_5": 1,
                "pm10": 1,
                "us-epa-index": 1,
                "gb-defra-index": 1
              },
              "pollen": {
                "Hazel": 1,
                "Alder": 1,
                "Birch": 1,
                "Oak": 1,
                "Grass": 1,
                "Mugwort": 1,
                "Ragweed": 1
              }
            }
          }
        }
      ]
    },
    "idField": "id",
    "ownQuery": "key"
  },
  {
    "entity": "current",
    "accessor": "Current",
    "op": "load",
    "method": "GET",
    "path": "/current.json",
    "args": [],
    "select": {
      "key": "YOUR_API_KEY",
      "q": "London",
      "aqi": "no",
      "current_field": "v1",
      "lang": "fr",
      "pollen": "no"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "key",
      "q",
      "aqi",
      "pollen",
      "lang",
      "current_fields"
    ],
    "queryArgs": [
      {
        "name": "aqi",
        "wire": "aqi"
      },
      {
        "name": "current_field",
        "wire": "current_fields"
      },
      {
        "name": "key",
        "wire": "key"
      },
      {
        "name": "lang",
        "wire": "lang"
      },
      {
        "name": "pollen",
        "wire": "pollen"
      },
      {
        "name": "q",
        "wire": "q"
      }
    ],
    "auth": [
      [
        {
          "in": "query",
          "name": "key"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "location": {
        "name": "London",
        "region": "City of London, Greater London",
        "country": "United Kingdom",
        "lat": 51.52,
        "lon": -0.11,
        "tz_id": "Europe/London",
        "localtime_epoch": 1613896955,
        "localtime": "2021-02-21 8:42"
      },
      "current": {
        "last_updated": "2021-02-21 08:30",
        "temp_c": 11,
        "temp_f": 51.8,
        "is_day": 1,
        "condition": {
          "text": "Partly cloudy",
          "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png",
          "code": 1003
        },
        "wind_mph": 3.8,
        "wind_kph": 6.1,
        "humidity": 82,
        "uv": 1
      }
    },
    "idField": "id",
    "ownQuery": "key"
  },
  {
    "entity": "forecast",
    "accessor": "Forecast",
    "op": "load",
    "method": "GET",
    "path": "/forecast.json",
    "args": [],
    "select": {
      "day": "v1",
      "key": "YOUR_API_KEY",
      "q": "London",
      "alert": "no",
      "aqi": "no",
      "day_field": "v1",
      "dt": "v1",
      "et0": "v1",
      "hour": "v1",
      "hour_field": "v1",
      "lang": "fr",
      "pollen": "no",
      "tp": "v1",
      "unixdt": 1490227200
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "key",
      "q",
      "days",
      "dt",
      "unixdt",
      "hour",
      "alerts",
      "aqi",
      "pollen",
      "tp",
      "lang",
      "day_fields",
      "hour_fields",
      "et0"
    ],
    "queryArgs": [
      {
        "name": "alert",
        "wire": "alerts"
      },
      {
        "name": "aqi",
        "wire": "aqi"
      },
      {
        "name": "day",
        "wire": "days"
      },
      {
        "name": "day_field",
        "wire": "day_fields"
      },
      {
        "name": "dt",
        "wire": "dt"
      },
      {
        "name": "et0",
        "wire": "et0"
      },
      {
        "name": "hour",
        "wire": "hour"
      },
      {
        "name": "hour_field",
        "wire": "hour_fields"
      },
      {
        "name": "key",
        "wire": "key"
      },
      {
        "name": "lang",
        "wire": "lang"
      },
      {
        "name": "pollen",
        "wire": "pollen"
      },
      {
        "name": "q",
        "wire": "q"
      },
      {
        "name": "tp",
        "wire": "tp"
      },
      {
        "name": "unixdt",
        "wire": "unixdt"
      }
    ],
    "auth": [
      [
        {
          "in": "query",
          "name": "key"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "location": {
        "name": "x",
        "region": "x",
        "country": "x",
        "lat": 1,
        "lon": 1,
        "tz_id": "x",
        "localtime_epoch": 1,
        "localtime": "x"
      },
      "current": {
        "last_updated_epoch": 1,
        "last_updated": "x",
        "temp_c": 1,
        "temp_f": 1,
        "is_day": 1,
        "condition": {
          "text": "x",
          "icon": "x",
          "code": 1
        },
        "wind_mph": 1,
        "wind_kph": 1,
        "wind_degree": 1,
        "wind_dir": "x",
        "pressure_mb": 1,
        "pressure_in": 1,
        "precip_mm": 1,
        "precip_in": 1,
        "humidity": 1,
        "cloud": 1,
        "feelslike_c": 1,
        "feelslike_f": 1,
        "windchill_c": 1,
        "windchill_f": 1,
        "heatindex_c": 1,
        "heatindex_f": 1,
        "dewpoint_c": 1,
        "dewpoint_f": 1,
        "vis_km": 1,
        "vis_miles": 1,
        "uv": 1,
        "gust_mph": 1,
        "gust_kph": 1,
        "short_rad": 1,
        "diff_rad": 1,
        "air_quality": {
          "co": 1,
          "o3": 1,
          "no2": 1,
          "so2": 1,
          "pm2_5": 1,
          "pm10": 1,
          "us-epa-index": 1,
          "gb-defra-index": 1
        },
        "pollen": {
          "Hazel": 1,
          "Alder": 1,
          "Birch": 1,
          "Oak": 1,
          "Grass": 1,
          "Mugwort": 1,
          "Ragweed": 1
        }
      },
      "forecast": {
        "forecastday": [
          {
            "date": "2026-01-01",
            "date_epoch": 1,
            "day": {
              "maxtemp_c": 1,
              "maxtemp_f": 1,
              "mintemp_c": 1,
              "mintemp_f": 1,
              "avgtemp_c": 1,
              "avgtemp_f": 1,
              "maxwind_mph": 1,
              "maxwind_kph": 1,
              "totalprecip_mm": 1,
              "totalprecip_in": 1,
              "totalsnow_cm": 1,
              "avgvis_km": 1,
              "avgvis_miles": 1,
              "avghumidity": 1,
              "daily_will_it_rain": 1,
              "daily_chance_of_rain": 1,
              "daily_will_it_snow": 1,
              "daily_chance_of_snow": 1,
              "condition": {
                "text": "x",
                "icon": "x",
                "code": 1
              },
              "uv": 1,
              "air_quality": {
                "co": 1,
                "o3": 1,
                "no2": 1,
                "so2": 1,
                "pm2_5": 1,
                "pm10": 1,
                "us-epa-index": 1,
                "gb-defra-index": 1
              }
            },
            "astro": {
              "sunrise": "x",
              "sunset": "x",
              "moonrise": "x",
              "moonset": "x",
              "moon_phase": "x",
              "moon_illumination": 1,
              "is_moon_up": 1,
              "is_sun_up": 1
            },
            "hour": [
              {
                "time_epoch": 1,
                "time": "x",
                "temp_c": 1,
                "temp_f": 1,
                "is_day": 1,
                "condition": {},
                "wind_mph": 1,
                "wind_kph": 1,
                "wind_degree": 1,
                "wind_dir": "x",
                "pressure_mb": 1,
                "pressure_in": 1,
                "precip_mm": 1,
                "precip_in": 1,
                "snow_cm": 1,
                "humidity": 1,
                "cloud": 1,
                "feelslike_c": 1,
                "feelslike_f": 1,
                "windchill_c": 1,
                "windchill_f": 1,
                "heatindex_c": 1,
                "heatindex_f": 1,
                "dewpoint_c": 1,
                "dewpoint_f": 1,
                "will_it_rain": 1,
                "chance_of_rain": 1,
                "will_it_snow": 1,
                "chance_of_snow": 1,
                "vis_km": 1,
                "vis_miles": 1,
                "gust_mph": 1,
                "gust_kph": 1,
                "uv": 1,
                "short_rad": 1,
                "diff_rad": 1,
                "et0": 1,
                "air_quality": {},
                "pollen": {}
              }
            ]
          }
        ]
      },
      "alerts": {
        "alert": [
          {
            "headline": "x",
            "msgtype": "x",
            "severity": "x",
            "urgency": "x",
            "areas": "x",
            "category": "x",
            "certainty": "x",
            "event": "x",
            "note": "x",
            "effective": "x",
            "expires": "x",
            "desc": "x",
            "instruction": "x"
          }
        ]
      }
    },
    "idField": "id",
    "ownQuery": "key"
  },
  {
    "entity": "future",
    "accessor": "Future",
    "op": "load",
    "method": "GET",
    "path": "/future.json",
    "args": [],
    "select": {
      "dt": "2026-06-01",
      "key": "YOUR_API_KEY",
      "q": "London",
      "lang": "fr"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "key",
      "q",
      "dt",
      "lang"
    ],
    "queryArgs": [
      {
        "name": "dt",
        "wire": "dt"
      },
      {
        "name": "key",
        "wire": "key"
      },
      {
        "name": "lang",
        "wire": "lang"
      },
      {
        "name": "q",
        "wire": "q"
      }
    ],
    "auth": [
      [
        {
          "in": "query",
          "name": "key"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "location": {
        "name": "x",
        "region": "x",
        "country": "x",
        "lat": 1,
        "lon": 1,
        "tz_id": "x",
        "localtime_epoch": 1,
        "localtime": "x"
      },
      "current": {
        "last_updated_epoch": 1,
        "last_updated": "x",
        "temp_c": 1,
        "temp_f": 1,
        "is_day": 1,
        "condition": {
          "text": "x",
          "icon": "x",
          "code": 1
        },
        "wind_mph": 1,
        "wind_kph": 1,
        "wind_degree": 1,
        "wind_dir": "x",
        "pressure_mb": 1,
        "pressure_in": 1,
        "precip_mm": 1,
        "precip_in": 1,
        "humidity": 1,
        "cloud": 1,
        "feelslike_c": 1,
        "feelslike_f": 1,
        "windchill_c": 1,
        "windchill_f": 1,
        "heatindex_c": 1,
        "heatindex_f": 1,
        "dewpoint_c": 1,
        "dewpoint_f": 1,
        "vis_km": 1,
        "vis_miles": 1,
        "uv": 1,
        "gust_mph": 1,
        "gust_kph": 1,
        "short_rad": 1,
        "diff_rad": 1,
        "air_quality": {
          "co": 1,
          "o3": 1,
          "no2": 1,
          "so2": 1,
          "pm2_5": 1,
          "pm10": 1,
          "us-epa-index": 1,
          "gb-defra-index": 1
        },
        "pollen": {
          "Hazel": 1,
          "Alder": 1,
          "Birch": 1,
          "Oak": 1,
          "Grass": 1,
          "Mugwort": 1,
          "Ragweed": 1
        }
      },
      "forecast": {
        "forecastday": [
          {
            "date": "2026-01-01",
            "date_epoch": 1,
            "day": {
              "maxtemp_c": 1,
              "maxtemp_f": 1,
              "mintemp_c": 1,
              "mintemp_f": 1,
              "avgtemp_c": 1,
              "avgtemp_f": 1,
              "maxwind_mph": 1,
              "maxwind_kph": 1,
              "totalprecip_mm": 1,
              "totalprecip_in": 1,
              "totalsnow_cm": 1,
              "avgvis_km": 1,
              "avgvis_miles": 1,
              "avghumidity": 1,
              "daily_will_it_rain": 1,
              "daily_chance_of_rain": 1,
              "daily_will_it_snow": 1,
              "daily_chance_of_snow": 1,
              "condition": {
                "text": "x",
                "icon": "x",
                "code": 1
              },
              "uv": 1,
              "air_quality": {
                "co": 1,
                "o3": 1,
                "no2": 1,
                "so2": 1,
                "pm2_5": 1,
                "pm10": 1,
                "us-epa-index": 1,
                "gb-defra-index": 1
              }
            },
            "astro": {
              "sunrise": "x",
              "sunset": "x",
              "moonrise": "x",
              "moonset": "x",
              "moon_phase": "x",
              "moon_illumination": 1,
              "is_moon_up": 1,
              "is_sun_up": 1
            },
            "hour": [
              {
                "time_epoch": 1,
                "time": "x",
                "temp_c": 1,
                "temp_f": 1,
                "is_day": 1,
                "condition": {},
                "wind_mph": 1,
                "wind_kph": 1,
                "wind_degree": 1,
                "wind_dir": "x",
                "pressure_mb": 1,
                "pressure_in": 1,
                "precip_mm": 1,
                "precip_in": 1,
                "snow_cm": 1,
                "humidity": 1,
                "cloud": 1,
                "feelslike_c": 1,
                "feelslike_f": 1,
                "windchill_c": 1,
                "windchill_f": 1,
                "heatindex_c": 1,
                "heatindex_f": 1,
                "dewpoint_c": 1,
                "dewpoint_f": 1,
                "will_it_rain": 1,
                "chance_of_rain": 1,
                "will_it_snow": 1,
                "chance_of_snow": 1,
                "vis_km": 1,
                "vis_miles": 1,
                "gust_mph": 1,
                "gust_kph": 1,
                "uv": 1,
                "short_rad": 1,
                "diff_rad": 1,
                "et0": 1,
                "air_quality": {},
                "pollen": {}
              }
            ]
          }
        ]
      },
      "alerts": {
        "alert": [
          {
            "headline": "x",
            "msgtype": "x",
            "severity": "x",
            "urgency": "x",
            "areas": "x",
            "category": "x",
            "certainty": "x",
            "event": "x",
            "note": "x",
            "effective": "x",
            "expires": "x",
            "desc": "x",
            "instruction": "x"
          }
        ]
      }
    },
    "idField": "id",
    "ownQuery": "key"
  },
  {
    "entity": "history",
    "accessor": "History",
    "op": "load",
    "method": "GET",
    "path": "/history.json",
    "args": [],
    "select": {
      "dt": "2023-01-01",
      "key": "YOUR_API_KEY",
      "q": "London",
      "aqi": "no",
      "end_dt": "v1",
      "et0": "v1",
      "hour": "v1",
      "lang": "fr",
      "pollen": "no",
      "solar": "v1",
      "tp": "v1",
      "unixdt": 1490227200,
      "unixend_dt": "v1",
      "wind100kph": "v1",
      "wind100mph": "v1"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "key",
      "q",
      "dt",
      "unixdt",
      "end_dt",
      "unixend_dt",
      "hour",
      "aqi",
      "pollen",
      "tp",
      "lang",
      "solar",
      "et0",
      "wind100mph",
      "wind100kph"
    ],
    "queryArgs": [
      {
        "name": "aqi",
        "wire": "aqi"
      },
      {
        "name": "dt",
        "wire": "dt"
      },
      {
        "name": "end_dt",
        "wire": "end_dt"
      },
      {
        "name": "et0",
        "wire": "et0"
      },
      {
        "name": "hour",
        "wire": "hour"
      },
      {
        "name": "key",
        "wire": "key"
      },
      {
        "name": "lang",
        "wire": "lang"
      },
      {
        "name": "pollen",
        "wire": "pollen"
      },
      {
        "name": "q",
        "wire": "q"
      },
      {
        "name": "solar",
        "wire": "solar"
      },
      {
        "name": "tp",
        "wire": "tp"
      },
      {
        "name": "unixdt",
        "wire": "unixdt"
      },
      {
        "name": "unixend_dt",
        "wire": "unixend_dt"
      },
      {
        "name": "wind100kph",
        "wire": "wind100kph"
      },
      {
        "name": "wind100mph",
        "wire": "wind100mph"
      }
    ],
    "auth": [
      [
        {
          "in": "query",
          "name": "key"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "location": {
        "name": "x",
        "region": "x",
        "country": "x",
        "lat": 1,
        "lon": 1,
        "tz_id": "x",
        "localtime_epoch": 1,
        "localtime": "x"
      },
      "current": {
        "last_updated_epoch": 1,
        "last_updated": "x",
        "temp_c": 1,
        "temp_f": 1,
        "is_day": 1,
        "condition": {
          "text": "x",
          "icon": "x",
          "code": 1
        },
        "wind_mph": 1,
        "wind_kph": 1,
        "wind_degree": 1,
        "wind_dir": "x",
        "pressure_mb": 1,
        "pressure_in": 1,
        "precip_mm": 1,
        "precip_in": 1,
        "humidity": 1,
        "cloud": 1,
        "feelslike_c": 1,
        "feelslike_f": 1,
        "windchill_c": 1,
        "windchill_f": 1,
        "heatindex_c": 1,
        "heatindex_f": 1,
        "dewpoint_c": 1,
        "dewpoint_f": 1,
        "vis_km": 1,
        "vis_miles": 1,
        "uv": 1,
        "gust_mph": 1,
        "gust_kph": 1,
        "short_rad": 1,
        "diff_rad": 1,
        "air_quality": {
          "co": 1,
          "o3": 1,
          "no2": 1,
          "so2": 1,
          "pm2_5": 1,
          "pm10": 1,
          "us-epa-index": 1,
          "gb-defra-index": 1
        },
        "pollen": {
          "Hazel": 1,
          "Alder": 1,
          "Birch": 1,
          "Oak": 1,
          "Grass": 1,
          "Mugwort": 1,
          "Ragweed": 1
        }
      },
      "forecast": {
        "forecastday": [
          {
            "date": "2026-01-01",
            "date_epoch": 1,
            "day": {
              "maxtemp_c": 1,
              "maxtemp_f": 1,
              "mintemp_c": 1,
              "mintemp_f": 1,
              "avgtemp_c": 1,
              "avgtemp_f": 1,
              "maxwind_mph": 1,
              "maxwind_kph": 1,
              "totalprecip_mm": 1,
              "totalprecip_in": 1,
              "totalsnow_cm": 1,
              "avgvis_km": 1,
              "avgvis_miles": 1,
              "avghumidity": 1,
              "daily_will_it_rain": 1,
              "daily_chance_of_rain": 1,
              "daily_will_it_snow": 1,
              "daily_chance_of_snow": 1,
              "condition": {
                "text": "x",
                "icon": "x",
                "code": 1
              },
              "uv": 1,
              "air_quality": {
                "co": 1,
                "o3": 1,
                "no2": 1,
                "so2": 1,
                "pm2_5": 1,
                "pm10": 1,
                "us-epa-index": 1,
                "gb-defra-index": 1
              }
            },
            "astro": {
              "sunrise": "x",
              "sunset": "x",
              "moonrise": "x",
              "moonset": "x",
              "moon_phase": "x",
              "moon_illumination": 1,
              "is_moon_up": 1,
              "is_sun_up": 1
            },
            "hour": [
              {
                "time_epoch": 1,
                "time": "x",
                "temp_c": 1,
                "temp_f": 1,
                "is_day": 1,
                "condition": {},
                "wind_mph": 1,
                "wind_kph": 1,
                "wind_degree": 1,
                "wind_dir": "x",
                "pressure_mb": 1,
                "pressure_in": 1,
                "precip_mm": 1,
                "precip_in": 1,
                "snow_cm": 1,
                "humidity": 1,
                "cloud": 1,
                "feelslike_c": 1,
                "feelslike_f": 1,
                "windchill_c": 1,
                "windchill_f": 1,
                "heatindex_c": 1,
                "heatindex_f": 1,
                "dewpoint_c": 1,
                "dewpoint_f": 1,
                "will_it_rain": 1,
                "chance_of_rain": 1,
                "will_it_snow": 1,
                "chance_of_snow": 1,
                "vis_km": 1,
                "vis_miles": 1,
                "gust_mph": 1,
                "gust_kph": 1,
                "uv": 1,
                "short_rad": 1,
                "diff_rad": 1,
                "et0": 1,
                "air_quality": {},
                "pollen": {}
              }
            ]
          }
        ]
      },
      "alerts": {
        "alert": [
          {
            "headline": "x",
            "msgtype": "x",
            "severity": "x",
            "urgency": "x",
            "areas": "x",
            "category": "x",
            "certainty": "x",
            "event": "x",
            "note": "x",
            "effective": "x",
            "expires": "x",
            "desc": "x",
            "instruction": "x"
          }
        ]
      }
    },
    "idField": "id",
    "ownQuery": "key"
  },
  {
    "entity": "ipn",
    "accessor": "Ipn",
    "op": "load",
    "method": "GET",
    "path": "/ip.json",
    "args": [],
    "select": {
      "key": "YOUR_API_KEY",
      "q": "auto:ip"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "key",
      "q"
    ],
    "queryArgs": [
      {
        "name": "key",
        "wire": "key"
      },
      {
        "name": "q",
        "wire": "q"
      }
    ],
    "auth": [
      [
        {
          "in": "query",
          "name": "key"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "ip": "x",
      "type": "ipv4",
      "continent_code": "x",
      "continent_name": "x",
      "country_code": "x",
      "country_name": "x",
      "is_eu": true,
      "geoname_id": "x",
      "city": "x",
      "region": "x",
      "lat": 1,
      "lon": 1,
      "tz_id": "x",
      "localtime_epoch": 1,
      "localtime": "x"
    },
    "idField": "id",
    "ownQuery": "key"
  },
  {
    "entity": "marine",
    "accessor": "Marine",
    "op": "load",
    "method": "GET",
    "path": "/marine.json",
    "args": [],
    "select": {
      "day": "v1",
      "key": "YOUR_API_KEY",
      "q": "London",
      "dt": "v1",
      "hour": "v1",
      "tide": "v1"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "key",
      "q",
      "days",
      "dt",
      "hour",
      "tides"
    ],
    "queryArgs": [
      {
        "name": "day",
        "wire": "days"
      },
      {
        "name": "dt",
        "wire": "dt"
      },
      {
        "name": "hour",
        "wire": "hour"
      },
      {
        "name": "key",
        "wire": "key"
      },
      {
        "name": "q",
        "wire": "q"
      },
      {
        "name": "tide",
        "wire": "tides"
      }
    ],
    "auth": [
      [
        {
          "in": "query",
          "name": "key"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "location": {
        "name": "x",
        "region": "x",
        "country": "x",
        "lat": 1,
        "lon": 1,
        "tz_id": "x",
        "localtime_epoch": 1,
        "localtime": "x"
      },
      "forecast": {
        "forecastday": [
          {
            "date": "2026-01-01",
            "date_epoch": 1,
            "day": {
              "maxtemp_c": 1,
              "maxtemp_f": 1,
              "mintemp_c": 1,
              "mintemp_f": 1,
              "avgtemp_c": 1,
              "avgtemp_f": 1,
              "maxwind_mph": 1,
              "maxwind_kph": 1,
              "totalprecip_mm": 1,
              "totalprecip_in": 1,
              "totalsnow_cm": 1,
              "avgvis_km": 1,
              "avgvis_miles": 1,
              "avghumidity": 1,
              "daily_will_it_rain": 1,
              "daily_chance_of_rain": 1,
              "daily_will_it_snow": 1,
              "daily_chance_of_snow": 1,
              "condition": {
                "text": "x",
                "icon": "x",
                "code": 1
              },
              "uv": 1,
              "air_quality": {
                "co": 1,
                "o3": 1,
                "no2": 1,
                "so2": 1,
                "pm2_5": 1,
                "pm10": 1,
                "us-epa-index": 1,
                "gb-defra-index": 1
              }
            },
            "astro": {
              "sunrise": "x",
              "sunset": "x",
              "moonrise": "x",
              "moonset": "x",
              "moon_phase": "x",
              "moon_illumination": 1,
              "is_moon_up": 1,
              "is_sun_up": 1
            },
            "tides": [
              {
                "tide": []
              }
            ],
            "hour": [
              {}
            ]
          }
        ]
      }
    },
    "idField": "id",
    "ownQuery": "key"
  },
  {
    "entity": "search",
    "accessor": "Search",
    "op": "list",
    "method": "GET",
    "path": "/search.json",
    "args": [],
    "select": {
      "key": "YOUR_API_KEY",
      "q": "lond"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "key",
      "q"
    ],
    "queryArgs": [
      {
        "name": "key",
        "wire": "key"
      },
      {
        "name": "q",
        "wire": "q"
      }
    ],
    "auth": [
      [
        {
          "in": "query",
          "name": "key"
        }
      ]
    ],
    "status": 200,
    "sample": [
      {
        "id": 1,
        "name": "x",
        "region": "x",
        "country": "x",
        "lat": 1,
        "lon": 1,
        "url": "x"
      }
    ],
    "idField": "id",
    "ownQuery": "key"
  },
  {
    "entity": "solar",
    "accessor": "Solar",
    "op": "load",
    "method": "GET",
    "path": "/solar.json",
    "args": [],
    "select": {
      "capacity_kw": 4,
      "key": "YOUR_API_KEY",
      "q": "London",
      "albedo": "v1",
      "azimuth": "v1",
      "day": "v1",
      "inverter_eff": "v1",
      "inverter_kw": "v1",
      "loss": "v1",
      "module_type": "v1",
      "tilt": "v1",
      "tracking": "v1"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "key",
      "q",
      "days",
      "capacity_kw",
      "tilt",
      "azimuth",
      "tracking",
      "module_type",
      "losses",
      "inverter_kw",
      "inverter_eff",
      "albedo"
    ],
    "queryArgs": [
      {
        "name": "albedo",
        "wire": "albedo"
      },
      {
        "name": "azimuth",
        "wire": "azimuth"
      },
      {
        "name": "capacity_kw",
        "wire": "capacity_kw"
      },
      {
        "name": "day",
        "wire": "days"
      },
      {
        "name": "inverter_eff",
        "wire": "inverter_eff"
      },
      {
        "name": "inverter_kw",
        "wire": "inverter_kw"
      },
      {
        "name": "key",
        "wire": "key"
      },
      {
        "name": "loss",
        "wire": "losses"
      },
      {
        "name": "module_type",
        "wire": "module_type"
      },
      {
        "name": "q",
        "wire": "q"
      },
      {
        "name": "tilt",
        "wire": "tilt"
      },
      {
        "name": "tracking",
        "wire": "tracking"
      }
    ],
    "auth": [
      [
        {
          "in": "query",
          "name": "key"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "location": {
        "name": "x",
        "region": "x",
        "country": "x",
        "lat": 1,
        "lon": 1,
        "tz_id": "x",
        "localtime_epoch": 1,
        "localtime": "x"
      },
      "system": {
        "capacity_kw": 1,
        "tilt": 1,
        "azimuth": 1,
        "tracking": "fixed",
        "module_type": "standard",
        "temp_coefficient": 1,
        "losses": 1,
        "inverter_kw": 1,
        "inverter_eff": 1,
        "albedo": 1
      },
      "forecast": {
        "forecastday": [
          {
            "date": "2026-01-01",
            "date_epoch": 1,
            "day": {
              "energy_kwh": 1,
              "energy_dc_kwh": 1,
              "peak_power_kw": 1,
              "peak_sun_hours": 1,
              "performance_ratio": 1,
              "ghi_kwh_m2": 1,
              "poa_kwh_m2": 1
            },
            "hour": [
              {
                "time_epoch": 1,
                "time": "x",
                "period_hours": 1,
                "ghi": 1,
                "dni": 1,
                "dhi": 1,
                "poa_global": 1,
                "poa_direct": 1,
                "poa_diffuse": 1,
                "poa_ground": 1,
                "sun_elevation": 1,
                "sun_azimuth": 1,
                "angle_of_incidence": 1,
                "temp_c": 1,
                "wind_kph": 1,
                "cell_temp_c": 1,
                "power_dc_kw": 1,
                "power_ac_kw": 1,
                "energy_kwh": 1,
                "clipped_kwh": 1,
                "snow_cover": 0
              }
            ]
          }
        ]
      }
    },
    "idField": "id",
    "ownQuery": "key"
  },
  {
    "entity": "sport",
    "accessor": "Sport",
    "op": "list",
    "method": "GET",
    "path": "/sports.json",
    "args": [],
    "select": {
      "key": "YOUR_API_KEY",
      "q": "London"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "key",
      "q"
    ],
    "queryArgs": [
      {
        "name": "key",
        "wire": "key"
      },
      {
        "name": "q",
        "wire": "q"
      }
    ],
    "auth": [
      [
        {
          "in": "query",
          "name": "key"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "football": [
        {
          "stadium": "x",
          "country": "x",
          "region": "x",
          "tournament": "x",
          "start": "x",
          "match": "x"
        }
      ],
      "cricket": [
        {
          "stadium": "x",
          "country": "x",
          "region": "x",
          "tournament": "x",
          "start": "x",
          "match": "x"
        }
      ],
      "golf": [
        {
          "stadium": "x",
          "country": "x",
          "region": "x",
          "tournament": "x",
          "start": "x",
          "match": "x"
        }
      ]
    },
    "idField": "id",
    "ownQuery": "key"
  },
  {
    "entity": "timezone",
    "accessor": "Timezone",
    "op": "load",
    "method": "GET",
    "path": "/timezone.json",
    "args": [],
    "select": {
      "key": "YOUR_API_KEY",
      "q": "London"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "key",
      "q"
    ],
    "queryArgs": [
      {
        "name": "key",
        "wire": "key"
      },
      {
        "name": "q",
        "wire": "q"
      }
    ],
    "auth": [
      [
        {
          "in": "query",
          "name": "key"
        }
      ]
    ],
    "status": 200,
    "sample": {
      "location": {
        "name": "x",
        "region": "x",
        "country": "x",
        "lat": 1,
        "lon": 1,
        "tz_id": "x",
        "localtime_epoch": 1,
        "localtime": "x"
      }
    },
    "idField": "id",
    "ownQuery": "key"
  }
]


describe('definition', () => {
  for (const point of PLAN) {
    test(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
      const control = isControlSkipped('entityOp', point.entity + '.' + point.op, 'definition')
      if (control.skip) {
        t.skip(control.reason || 'skipped via sdk-test-control.json')
        return
      }
      await runDefinitionPoint(SDK, point)
    })
  }
})

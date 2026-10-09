"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEATURE_PLUGINS = exports.config = void 0;
const TestFeature_1 = require("./feature/test/TestFeature");
const FEATURE_CLASS = {
    test: TestFeature_1.TestFeature,
};
const FEATURE_PLUGINS = {};
exports.FEATURE_PLUGINS = FEATURE_PLUGINS;
class Config {
    makeFeature(fn) {
        const fc = FEATURE_CLASS[fn];
        const fi = new fc();
        return fi;
    }
    // False for a feature added at runtime via options.extend (station's
    // adopt path) - the constructor uses this to skip makeFeature for names
    // no generated class backs.
    hasFeature(fn) {
        return null != FEATURE_CLASS[fn];
    }
    main = {
        name: 'Weatherapi',
        slug: "weatherapi",
        version: "0.0.1",
        target: "ts",
    };
    feature = {
        test: {
            "options": {
                "active": false
            },
            "optspec": {
                "entity": "`$MAP`",
                "net": "`$MAP`"
            },
            "strict": false,
            "transport": "base"
        },
    };
    options = {
        base: "https://api.weatherapi.com/v1",
        auth: {
            prefix: '',
            in: 'query',
            name: 'key',
        },
        headers: {
            "content-type": "application/json"
        },
        entity: {
            alert: {},
            astronomy: {},
            bulk: {},
            current: {},
            forecast: {},
            future: {},
            history: {},
            ipn: {},
            marine: {},
            search: {},
            solar: {},
            sport: {},
            timezone: {},
        }
    };
    entity = {
        "alert": {
            "fields": [
                {
                    "name": "alerts",
                    "title": "Alerts",
                    "type": "`$OBJECT`"
                },
                {
                    "name": "location",
                    "title": "Location",
                    "type": "`$OBJECT`",
                    "short": "Location metadata returned with every weather response."
                }
            ],
            "name": "alert",
            "op": {
                "load": {
                    "input": "data",
                    "name": "load",
                    "points": [
                        {
                            "kind": "http",
                            "method": "GET",
                            "orig": "/alerts.json",
                            "segments": [
                                {
                                    "lit": "alerts.json"
                                }
                            ],
                            "parts": [
                                "alerts.json"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "args": {
                                "query": [
                                    {
                                        "name": "key",
                                        "orig": "key",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "YOUR_API_KEY"
                                    },
                                    {
                                        "name": "q",
                                        "orig": "q",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "London"
                                    }
                                ]
                            },
                            "select": {
                                "exist": [
                                    "key",
                                    "q"
                                ]
                            },
                            "response": {
                                "kind": "json",
                                "media": "application/json"
                            }
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        },
        "astronomy": {
            "fields": [
                {
                    "name": "astronomy",
                    "title": "Astronomy",
                    "type": "`$OBJECT`"
                },
                {
                    "name": "location",
                    "title": "Location",
                    "type": "`$OBJECT`",
                    "short": "Location metadata returned with every weather response."
                }
            ],
            "name": "astronomy",
            "op": {
                "load": {
                    "input": "data",
                    "name": "load",
                    "points": [
                        {
                            "kind": "http",
                            "method": "GET",
                            "orig": "/astronomy.json",
                            "segments": [
                                {
                                    "lit": "astronomy.json"
                                }
                            ],
                            "parts": [
                                "astronomy.json"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body.astronomy`"
                            },
                            "args": {
                                "query": [
                                    {
                                        "name": "dt",
                                        "orig": "dt",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "2026-03-20"
                                    },
                                    {
                                        "name": "key",
                                        "orig": "key",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "YOUR_API_KEY"
                                    },
                                    {
                                        "name": "q",
                                        "orig": "q",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "London"
                                    }
                                ]
                            },
                            "select": {
                                "exist": [
                                    "dt",
                                    "key",
                                    "q"
                                ]
                            },
                            "response": {
                                "kind": "json",
                                "media": "application/json"
                            }
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        },
        "bulk": {
            "fields": [
                {
                    "name": "bulk",
                    "title": "Bulk",
                    "type": "`$ARRAY`"
                },
                {
                    "name": "locations",
                    "title": "Locations",
                    "type": "`$ARRAY`",
                    "req": true
                }
            ],
            "name": "bulk",
            "op": {
                "create": {
                    "input": "data",
                    "name": "create",
                    "points": [
                        {
                            "kind": "http",
                            "method": "POST",
                            "orig": "/current.json",
                            "segments": [
                                {
                                    "lit": "current.json"
                                }
                            ],
                            "parts": [
                                "current.json"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body.bulk`"
                            },
                            "args": {
                                "query": [
                                    {
                                        "name": "aqi",
                                        "orig": "aqi",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "example": "no"
                                    },
                                    {
                                        "name": "key",
                                        "orig": "key",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "YOUR_API_KEY"
                                    },
                                    {
                                        "name": "q",
                                        "orig": "q",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true
                                    }
                                ]
                            },
                            "select": {
                                "exist": [
                                    "key",
                                    "q"
                                ]
                            },
                            "response": {
                                "kind": "json",
                                "media": "application/json"
                            }
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        },
        "current": {
            "fields": [
                {
                    "name": "current",
                    "title": "Current",
                    "type": "`$OBJECT`"
                },
                {
                    "name": "location",
                    "title": "Location",
                    "type": "`$OBJECT`",
                    "short": "Location metadata returned with every weather response."
                }
            ],
            "name": "current",
            "op": {
                "load": {
                    "input": "data",
                    "name": "load",
                    "points": [
                        {
                            "kind": "http",
                            "method": "GET",
                            "orig": "/current.json",
                            "segments": [
                                {
                                    "lit": "current.json"
                                }
                            ],
                            "parts": [
                                "current.json"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body.current`"
                            },
                            "args": {
                                "query": [
                                    {
                                        "name": "aqi",
                                        "orig": "aqi",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "example": "no"
                                    },
                                    {
                                        "name": "current_field",
                                        "orig": "current_fields",
                                        "type": "`$STRING`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "key",
                                        "orig": "key",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "YOUR_API_KEY"
                                    },
                                    {
                                        "name": "lang",
                                        "orig": "lang",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "example": "fr"
                                    },
                                    {
                                        "name": "pollen",
                                        "orig": "pollen",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "example": "no"
                                    },
                                    {
                                        "name": "q",
                                        "orig": "q",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "London"
                                    }
                                ]
                            },
                            "select": {
                                "exist": [
                                    "key",
                                    "q"
                                ]
                            },
                            "response": {
                                "kind": "json",
                                "media": "application/json"
                            }
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        },
        "forecast": {
            "fields": [
                {
                    "name": "alerts",
                    "title": "Alerts",
                    "type": "`$OBJECT`"
                },
                {
                    "name": "current",
                    "title": "Current",
                    "type": "`$OBJECT`"
                },
                {
                    "name": "forecast",
                    "title": "Forecast",
                    "type": "`$OBJECT`"
                },
                {
                    "name": "location",
                    "title": "Location",
                    "type": "`$OBJECT`",
                    "short": "Location metadata returned with every weather response."
                }
            ],
            "name": "forecast",
            "op": {
                "load": {
                    "input": "data",
                    "name": "load",
                    "points": [
                        {
                            "kind": "http",
                            "method": "GET",
                            "orig": "/forecast.json",
                            "segments": [
                                {
                                    "lit": "forecast.json"
                                }
                            ],
                            "parts": [
                                "forecast.json"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body.forecast`"
                            },
                            "args": {
                                "query": [
                                    {
                                        "name": "alert",
                                        "orig": "alerts",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "example": "no"
                                    },
                                    {
                                        "name": "aqi",
                                        "orig": "aqi",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "example": "no"
                                    },
                                    {
                                        "name": "day",
                                        "orig": "days",
                                        "type": "`$INTEGER`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": 3
                                    },
                                    {
                                        "name": "day_field",
                                        "orig": "day_fields",
                                        "type": "`$STRING`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "dt",
                                        "orig": "dt",
                                        "type": "`$STRING`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "et0",
                                        "orig": "et0",
                                        "type": "`$STRING`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "hour",
                                        "orig": "hour",
                                        "type": "`$INTEGER`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "hour_field",
                                        "orig": "hour_fields",
                                        "type": "`$STRING`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "key",
                                        "orig": "key",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "YOUR_API_KEY"
                                    },
                                    {
                                        "name": "lang",
                                        "orig": "lang",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "example": "fr"
                                    },
                                    {
                                        "name": "pollen",
                                        "orig": "pollen",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "example": "no"
                                    },
                                    {
                                        "name": "q",
                                        "orig": "q",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "London"
                                    },
                                    {
                                        "name": "tp",
                                        "orig": "tp",
                                        "type": "`$INTEGER`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "unixdt",
                                        "orig": "unixdt",
                                        "type": "`$INTEGER`",
                                        "kind": "query",
                                        "example": 1490227200
                                    }
                                ]
                            },
                            "select": {
                                "exist": [
                                    "day",
                                    "key",
                                    "q"
                                ]
                            },
                            "response": {
                                "kind": "json",
                                "media": "application/json"
                            }
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        },
        "future": {
            "fields": [
                {
                    "name": "alerts",
                    "title": "Alerts",
                    "type": "`$OBJECT`"
                },
                {
                    "name": "current",
                    "title": "Current",
                    "type": "`$OBJECT`"
                },
                {
                    "name": "forecast",
                    "title": "Forecast",
                    "type": "`$OBJECT`"
                },
                {
                    "name": "location",
                    "title": "Location",
                    "type": "`$OBJECT`",
                    "short": "Location metadata returned with every weather response."
                }
            ],
            "name": "future",
            "op": {
                "load": {
                    "input": "data",
                    "name": "load",
                    "points": [
                        {
                            "kind": "http",
                            "method": "GET",
                            "orig": "/future.json",
                            "segments": [
                                {
                                    "lit": "future.json"
                                }
                            ],
                            "parts": [
                                "future.json"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "args": {
                                "query": [
                                    {
                                        "name": "dt",
                                        "orig": "dt",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "2026-06-01"
                                    },
                                    {
                                        "name": "key",
                                        "orig": "key",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "YOUR_API_KEY"
                                    },
                                    {
                                        "name": "lang",
                                        "orig": "lang",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "example": "fr"
                                    },
                                    {
                                        "name": "q",
                                        "orig": "q",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "London"
                                    }
                                ]
                            },
                            "select": {
                                "exist": [
                                    "dt",
                                    "key",
                                    "q"
                                ]
                            },
                            "response": {
                                "kind": "json",
                                "media": "application/json"
                            }
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        },
        "history": {
            "fields": [
                {
                    "name": "alerts",
                    "title": "Alerts",
                    "type": "`$OBJECT`"
                },
                {
                    "name": "current",
                    "title": "Current",
                    "type": "`$OBJECT`"
                },
                {
                    "name": "forecast",
                    "title": "Forecast",
                    "type": "`$OBJECT`"
                },
                {
                    "name": "location",
                    "title": "Location",
                    "type": "`$OBJECT`",
                    "short": "Location metadata returned with every weather response."
                }
            ],
            "name": "history",
            "op": {
                "load": {
                    "input": "data",
                    "name": "load",
                    "points": [
                        {
                            "kind": "http",
                            "method": "GET",
                            "orig": "/history.json",
                            "segments": [
                                {
                                    "lit": "history.json"
                                }
                            ],
                            "parts": [
                                "history.json"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "args": {
                                "query": [
                                    {
                                        "name": "aqi",
                                        "orig": "aqi",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "example": "no"
                                    },
                                    {
                                        "name": "dt",
                                        "orig": "dt",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "2023-01-01"
                                    },
                                    {
                                        "name": "end_dt",
                                        "orig": "end_dt",
                                        "type": "`$STRING`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "et0",
                                        "orig": "et0",
                                        "type": "`$STRING`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "hour",
                                        "orig": "hour",
                                        "type": "`$INTEGER`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "key",
                                        "orig": "key",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "YOUR_API_KEY"
                                    },
                                    {
                                        "name": "lang",
                                        "orig": "lang",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "example": "fr"
                                    },
                                    {
                                        "name": "pollen",
                                        "orig": "pollen",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "example": "no"
                                    },
                                    {
                                        "name": "q",
                                        "orig": "q",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "London"
                                    },
                                    {
                                        "name": "solar",
                                        "orig": "solar",
                                        "type": "`$STRING`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "tp",
                                        "orig": "tp",
                                        "type": "`$INTEGER`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "unixdt",
                                        "orig": "unixdt",
                                        "type": "`$INTEGER`",
                                        "kind": "query",
                                        "example": 1490227200
                                    },
                                    {
                                        "name": "unixend_dt",
                                        "orig": "unixend_dt",
                                        "type": "`$INTEGER`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "wind100kph",
                                        "orig": "wind100kph",
                                        "type": "`$STRING`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "wind100mph",
                                        "orig": "wind100mph",
                                        "type": "`$STRING`",
                                        "kind": "query"
                                    }
                                ]
                            },
                            "select": {
                                "exist": [
                                    "dt",
                                    "key",
                                    "q"
                                ]
                            },
                            "response": {
                                "kind": "json",
                                "media": "application/json"
                            }
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        },
        "ipn": {
            "fields": [
                {
                    "name": "city",
                    "title": "City",
                    "type": "`$STRING`"
                },
                {
                    "name": "continent_code",
                    "title": "Continent Code",
                    "type": "`$STRING`"
                },
                {
                    "name": "continent_name",
                    "title": "Continent Name",
                    "type": "`$STRING`"
                },
                {
                    "name": "country_code",
                    "title": "Country Code",
                    "type": "`$STRING`"
                },
                {
                    "name": "country_name",
                    "title": "Country Name",
                    "type": "`$STRING`"
                },
                {
                    "name": "geoname_id",
                    "title": "Geoname Id",
                    "type": "`$STRING`"
                },
                {
                    "name": "ip",
                    "title": "Ip",
                    "type": "`$STRING`"
                },
                {
                    "name": "is_eu",
                    "title": "Is Eu",
                    "type": "`$BOOLEAN`"
                },
                {
                    "name": "lat",
                    "title": "Lat",
                    "type": "`$NUMBER`"
                },
                {
                    "name": "localtime",
                    "title": "Localtime",
                    "type": "`$STRING`"
                },
                {
                    "name": "localtime_epoch",
                    "title": "Localtime Epoch",
                    "type": "`$INTEGER`"
                },
                {
                    "name": "lon",
                    "title": "Lon",
                    "type": "`$NUMBER`"
                },
                {
                    "name": "region",
                    "title": "Region",
                    "type": "`$STRING`"
                },
                {
                    "name": "type",
                    "title": "Type",
                    "type": "`$STRING`"
                },
                {
                    "name": "tz_id",
                    "title": "Tz Id",
                    "type": "`$STRING`"
                }
            ],
            "name": "ipn",
            "op": {
                "load": {
                    "input": "data",
                    "name": "load",
                    "points": [
                        {
                            "kind": "http",
                            "method": "GET",
                            "orig": "/ip.json",
                            "segments": [
                                {
                                    "lit": "ip.json"
                                }
                            ],
                            "parts": [
                                "ip.json"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "args": {
                                "query": [
                                    {
                                        "name": "key",
                                        "orig": "key",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "YOUR_API_KEY"
                                    },
                                    {
                                        "name": "q",
                                        "orig": "q",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "auto:ip"
                                    }
                                ]
                            },
                            "select": {
                                "exist": [
                                    "key",
                                    "q"
                                ]
                            },
                            "response": {
                                "kind": "json",
                                "media": "application/json"
                            }
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        },
        "marine": {
            "fields": [
                {
                    "name": "forecast",
                    "title": "Forecast",
                    "type": "`$OBJECT`"
                },
                {
                    "name": "location",
                    "title": "Location",
                    "type": "`$OBJECT`",
                    "short": "Location metadata returned with every weather response."
                }
            ],
            "name": "marine",
            "op": {
                "load": {
                    "input": "data",
                    "name": "load",
                    "points": [
                        {
                            "kind": "http",
                            "method": "GET",
                            "orig": "/marine.json",
                            "segments": [
                                {
                                    "lit": "marine.json"
                                }
                            ],
                            "parts": [
                                "marine.json"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "args": {
                                "query": [
                                    {
                                        "name": "day",
                                        "orig": "days",
                                        "type": "`$INTEGER`",
                                        "kind": "query",
                                        "reqd": true
                                    },
                                    {
                                        "name": "dt",
                                        "orig": "dt",
                                        "type": "`$STRING`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "hour",
                                        "orig": "hour",
                                        "type": "`$INTEGER`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "key",
                                        "orig": "key",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "YOUR_API_KEY"
                                    },
                                    {
                                        "name": "q",
                                        "orig": "q",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "London"
                                    },
                                    {
                                        "name": "tide",
                                        "orig": "tides",
                                        "type": "`$STRING`",
                                        "kind": "query"
                                    }
                                ]
                            },
                            "select": {
                                "exist": [
                                    "day",
                                    "key",
                                    "q"
                                ]
                            },
                            "response": {
                                "kind": "json",
                                "media": "application/json"
                            }
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        },
        "search": {
            "fields": [
                {
                    "name": "country",
                    "title": "Country",
                    "type": "`$STRING`"
                },
                {
                    "name": "id",
                    "title": "Id",
                    "type": "`$INTEGER`"
                },
                {
                    "name": "lat",
                    "title": "Lat",
                    "type": "`$NUMBER`"
                },
                {
                    "name": "lon",
                    "title": "Lon",
                    "type": "`$NUMBER`"
                },
                {
                    "name": "name",
                    "title": "Name",
                    "type": "`$STRING`"
                },
                {
                    "name": "region",
                    "title": "Region",
                    "type": "`$STRING`"
                },
                {
                    "name": "url",
                    "title": "Url",
                    "type": "`$STRING`",
                    "short": "URL-safe location slug"
                }
            ],
            "id": {
                "field": "id",
                "name": "id"
            },
            "name": "search",
            "op": {
                "list": {
                    "input": "data",
                    "name": "list",
                    "points": [
                        {
                            "kind": "http",
                            "method": "GET",
                            "orig": "/search.json",
                            "segments": [
                                {
                                    "lit": "search.json"
                                }
                            ],
                            "parts": [
                                "search.json"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "args": {
                                "query": [
                                    {
                                        "name": "key",
                                        "orig": "key",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "YOUR_API_KEY"
                                    },
                                    {
                                        "name": "q",
                                        "orig": "q",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "lond"
                                    }
                                ]
                            },
                            "select": {
                                "exist": [
                                    "key",
                                    "q"
                                ]
                            },
                            "response": {
                                "kind": "json",
                                "media": "application/json"
                            }
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        },
        "solar": {
            "fields": [
                {
                    "name": "forecast",
                    "title": "Forecast",
                    "type": "`$OBJECT`"
                },
                {
                    "name": "location",
                    "title": "Location",
                    "type": "`$OBJECT`",
                    "short": "Location metadata returned with every weather response."
                },
                {
                    "name": "system",
                    "title": "System",
                    "type": "`$OBJECT`",
                    "short": "Settings used for the calculation, including any defaults applied."
                }
            ],
            "name": "solar",
            "op": {
                "load": {
                    "input": "data",
                    "name": "load",
                    "points": [
                        {
                            "kind": "http",
                            "method": "GET",
                            "orig": "/solar.json",
                            "segments": [
                                {
                                    "lit": "solar.json"
                                }
                            ],
                            "parts": [
                                "solar.json"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "args": {
                                "query": [
                                    {
                                        "name": "albedo",
                                        "orig": "albedo",
                                        "type": "`$NUMBER`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "azimuth",
                                        "orig": "azimuth",
                                        "type": "`$NUMBER`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "capacity_kw",
                                        "orig": "capacity_kw",
                                        "type": "`$NUMBER`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": 4
                                    },
                                    {
                                        "name": "day",
                                        "orig": "days",
                                        "type": "`$INTEGER`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "inverter_eff",
                                        "orig": "inverter_eff",
                                        "type": "`$NUMBER`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "inverter_kw",
                                        "orig": "inverter_kw",
                                        "type": "`$NUMBER`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "key",
                                        "orig": "key",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "YOUR_API_KEY"
                                    },
                                    {
                                        "name": "loss",
                                        "orig": "losses",
                                        "type": "`$NUMBER`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "module_type",
                                        "orig": "module_type",
                                        "type": "`$STRING`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "q",
                                        "orig": "q",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "London"
                                    },
                                    {
                                        "name": "tilt",
                                        "orig": "tilt",
                                        "type": "`$NUMBER`",
                                        "kind": "query"
                                    },
                                    {
                                        "name": "tracking",
                                        "orig": "tracking",
                                        "type": "`$STRING`",
                                        "kind": "query"
                                    }
                                ]
                            },
                            "select": {
                                "exist": [
                                    "capacity_kw",
                                    "key",
                                    "q"
                                ]
                            },
                            "response": {
                                "kind": "json",
                                "media": "application/json"
                            }
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        },
        "sport": {
            "fields": [
                {
                    "name": "cricket",
                    "title": "Cricket",
                    "type": "`$ARRAY`"
                },
                {
                    "name": "football",
                    "title": "Football",
                    "type": "`$ARRAY`"
                },
                {
                    "name": "golf",
                    "title": "Golf",
                    "type": "`$ARRAY`"
                }
            ],
            "name": "sport",
            "op": {
                "list": {
                    "input": "data",
                    "name": "list",
                    "points": [
                        {
                            "kind": "http",
                            "method": "GET",
                            "orig": "/sports.json",
                            "segments": [
                                {
                                    "lit": "sports.json"
                                }
                            ],
                            "parts": [
                                "sports.json"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "args": {
                                "query": [
                                    {
                                        "name": "key",
                                        "orig": "key",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "YOUR_API_KEY"
                                    },
                                    {
                                        "name": "q",
                                        "orig": "q",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "London"
                                    }
                                ]
                            },
                            "select": {
                                "exist": [
                                    "key",
                                    "q"
                                ]
                            },
                            "response": {
                                "kind": "json",
                                "media": "application/json"
                            }
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        },
        "timezone": {
            "fields": [
                {
                    "name": "country",
                    "title": "Country",
                    "type": "`$STRING`",
                    "short": "Country name"
                },
                {
                    "name": "lat",
                    "title": "Lat",
                    "type": "`$NUMBER`",
                    "short": "Latitude",
                    "format": "float"
                },
                {
                    "name": "localtime",
                    "title": "Localtime",
                    "type": "`$STRING`",
                    "short": "Local date and time string"
                },
                {
                    "name": "localtime_epoch",
                    "title": "Localtime Epoch",
                    "type": "`$INTEGER`",
                    "short": "Local time as Unix epoch"
                },
                {
                    "name": "lon",
                    "title": "Lon",
                    "type": "`$NUMBER`",
                    "short": "Longitude",
                    "format": "float"
                },
                {
                    "name": "name",
                    "title": "Name",
                    "type": "`$STRING`",
                    "short": "Location name"
                },
                {
                    "name": "region",
                    "title": "Region",
                    "type": "`$STRING`",
                    "short": "Region or state"
                },
                {
                    "name": "tz_id",
                    "title": "Tz Id",
                    "type": "`$STRING`",
                    "short": "IANA timezone ID, e.g."
                }
            ],
            "name": "timezone",
            "op": {
                "load": {
                    "input": "data",
                    "name": "load",
                    "points": [
                        {
                            "kind": "http",
                            "method": "GET",
                            "orig": "/timezone.json",
                            "segments": [
                                {
                                    "lit": "timezone.json"
                                }
                            ],
                            "parts": [
                                "timezone.json"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body.location`"
                            },
                            "args": {
                                "query": [
                                    {
                                        "name": "key",
                                        "orig": "key",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "YOUR_API_KEY"
                                    },
                                    {
                                        "name": "q",
                                        "orig": "q",
                                        "type": "`$STRING`",
                                        "kind": "query",
                                        "reqd": true,
                                        "example": "London"
                                    }
                                ]
                            },
                            "select": {
                                "exist": [
                                    "key",
                                    "q"
                                ]
                            },
                            "response": {
                                "kind": "json",
                                "media": "application/json"
                            }
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        }
    };
}
const config = new Config();
exports.config = config;
//# sourceMappingURL=Config.js.map
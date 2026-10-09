import { WeatherapiEntityBase } from '../WeatherapiEntityBase';
import type { WeatherapiSDK } from '../WeatherapiSDK';
import type { Control } from '../types';
import type { Forecast, ForecastLoadMatch } from '../WeatherapiTypes';
declare class ForecastEntity extends WeatherapiEntityBase<Forecast> {
    constructor(client: WeatherapiSDK, entopts: any);
    make(this: ForecastEntity): ForecastEntity;
    load(this: any, reqmatch?: ForecastLoadMatch, ctrl?: Control): Promise<ForecastEntity>;
}
export { ForecastEntity };

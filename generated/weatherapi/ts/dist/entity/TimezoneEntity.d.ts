import { WeatherapiEntityBase } from '../WeatherapiEntityBase';
import type { WeatherapiSDK } from '../WeatherapiSDK';
import type { Control } from '../types';
import type { Timezone, TimezoneLoadMatch } from '../WeatherapiTypes';
declare class TimezoneEntity extends WeatherapiEntityBase<Timezone> {
    constructor(client: WeatherapiSDK, entopts: any);
    make(this: TimezoneEntity): TimezoneEntity;
    load(this: any, reqmatch?: TimezoneLoadMatch, ctrl?: Control): Promise<TimezoneEntity>;
}
export { TimezoneEntity };

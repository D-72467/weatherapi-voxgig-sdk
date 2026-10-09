import { WeatherapiEntityBase } from '../WeatherapiEntityBase';
import type { WeatherapiSDK } from '../WeatherapiSDK';
import type { Control } from '../types';
import type { Solar, SolarLoadMatch } from '../WeatherapiTypes';
declare class SolarEntity extends WeatherapiEntityBase<Solar> {
    constructor(client: WeatherapiSDK, entopts: any);
    make(this: SolarEntity): SolarEntity;
    load(this: any, reqmatch?: SolarLoadMatch, ctrl?: Control): Promise<SolarEntity>;
}
export { SolarEntity };

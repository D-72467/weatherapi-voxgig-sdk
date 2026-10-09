import { WeatherapiEntityBase } from '../WeatherapiEntityBase';
import type { WeatherapiSDK } from '../WeatherapiSDK';
import type { Control } from '../types';
import type { Marine, MarineLoadMatch } from '../WeatherapiTypes';
declare class MarineEntity extends WeatherapiEntityBase<Marine> {
    constructor(client: WeatherapiSDK, entopts: any);
    make(this: MarineEntity): MarineEntity;
    load(this: any, reqmatch?: MarineLoadMatch, ctrl?: Control): Promise<MarineEntity>;
}
export { MarineEntity };

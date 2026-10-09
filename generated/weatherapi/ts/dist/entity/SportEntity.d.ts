import { WeatherapiEntityBase } from '../WeatherapiEntityBase';
import type { WeatherapiSDK } from '../WeatherapiSDK';
import type { Control } from '../types';
import type { Sport, SportListMatch } from '../WeatherapiTypes';
declare class SportEntity extends WeatherapiEntityBase<Sport> {
    constructor(client: WeatherapiSDK, entopts: any);
    make(this: SportEntity): SportEntity;
    list(this: any, reqmatch?: SportListMatch, ctrl?: Control): Promise<SportEntity[]>;
}
export { SportEntity };

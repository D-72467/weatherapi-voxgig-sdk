import { WeatherapiEntityBase } from '../WeatherapiEntityBase';
import type { WeatherapiSDK } from '../WeatherapiSDK';
import type { Control } from '../types';
import type { Astronomy, AstronomyLoadMatch } from '../WeatherapiTypes';
declare class AstronomyEntity extends WeatherapiEntityBase<Astronomy> {
    constructor(client: WeatherapiSDK, entopts: any);
    make(this: AstronomyEntity): AstronomyEntity;
    load(this: any, reqmatch?: AstronomyLoadMatch, ctrl?: Control): Promise<AstronomyEntity>;
}
export { AstronomyEntity };

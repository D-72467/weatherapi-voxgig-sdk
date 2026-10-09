import { WeatherapiEntityBase } from '../WeatherapiEntityBase';
import type { WeatherapiSDK } from '../WeatherapiSDK';
import type { Control } from '../types';
import type { Current, CurrentLoadMatch } from '../WeatherapiTypes';
declare class CurrentEntity extends WeatherapiEntityBase<Current> {
    constructor(client: WeatherapiSDK, entopts: any);
    make(this: CurrentEntity): CurrentEntity;
    load(this: any, reqmatch?: CurrentLoadMatch, ctrl?: Control): Promise<CurrentEntity>;
}
export { CurrentEntity };

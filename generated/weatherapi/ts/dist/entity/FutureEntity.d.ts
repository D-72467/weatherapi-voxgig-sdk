import { WeatherapiEntityBase } from '../WeatherapiEntityBase';
import type { WeatherapiSDK } from '../WeatherapiSDK';
import type { Control } from '../types';
import type { Future, FutureLoadMatch } from '../WeatherapiTypes';
declare class FutureEntity extends WeatherapiEntityBase<Future> {
    constructor(client: WeatherapiSDK, entopts: any);
    make(this: FutureEntity): FutureEntity;
    load(this: any, reqmatch?: FutureLoadMatch, ctrl?: Control): Promise<FutureEntity>;
}
export { FutureEntity };

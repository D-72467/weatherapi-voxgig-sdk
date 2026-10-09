import { WeatherapiEntityBase } from '../WeatherapiEntityBase';
import type { WeatherapiSDK } from '../WeatherapiSDK';
import type { Control } from '../types';
import type { History, HistoryLoadMatch } from '../WeatherapiTypes';
declare class HistoryEntity extends WeatherapiEntityBase<History> {
    constructor(client: WeatherapiSDK, entopts: any);
    make(this: HistoryEntity): HistoryEntity;
    load(this: any, reqmatch?: HistoryLoadMatch, ctrl?: Control): Promise<HistoryEntity>;
}
export { HistoryEntity };

import { WeatherapiEntityBase } from '../WeatherapiEntityBase';
import type { WeatherapiSDK } from '../WeatherapiSDK';
import type { Control } from '../types';
import type { Search, SearchListMatch } from '../WeatherapiTypes';
declare class SearchEntity extends WeatherapiEntityBase<Search> {
    constructor(client: WeatherapiSDK, entopts: any);
    make(this: SearchEntity): SearchEntity;
    list(this: any, reqmatch?: SearchListMatch, ctrl?: Control): Promise<SearchEntity[]>;
}
export { SearchEntity };

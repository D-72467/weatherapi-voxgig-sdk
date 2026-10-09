import { WeatherapiEntityBase } from '../WeatherapiEntityBase';
import type { WeatherapiSDK } from '../WeatherapiSDK';
import type { Control } from '../types';
import type { Bulk, BulkCreateData } from '../WeatherapiTypes';
declare class BulkEntity extends WeatherapiEntityBase<Bulk> {
    constructor(client: WeatherapiSDK, entopts: any);
    make(this: BulkEntity): BulkEntity;
    create(this: any, reqdata?: BulkCreateData, ctrl?: Control): Promise<BulkEntity>;
}
export { BulkEntity };

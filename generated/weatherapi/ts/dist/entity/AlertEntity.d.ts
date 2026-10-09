import { WeatherapiEntityBase } from '../WeatherapiEntityBase';
import type { WeatherapiSDK } from '../WeatherapiSDK';
import type { Control } from '../types';
import type { Alert, AlertLoadMatch } from '../WeatherapiTypes';
declare class AlertEntity extends WeatherapiEntityBase<Alert> {
    constructor(client: WeatherapiSDK, entopts: any);
    make(this: AlertEntity): AlertEntity;
    load(this: any, reqmatch?: AlertLoadMatch, ctrl?: Control): Promise<AlertEntity>;
}
export { AlertEntity };

type Place = 'folder' | 'root';
type RootPlan = {
    top: boolean;
    build: boolean;
    place: Record<string, Place>;
};
type Fail = new (message: string) => Error;
declare function rootPlan(kit: any, Fail?: Fail): RootPlan;
export type { Place, RootPlan, };
export { rootPlan, };

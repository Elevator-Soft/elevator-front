export interface Build {
    id: string;
    buildConfigId: string;
    logs?: Array<string>;
    finishTime?: string;
    buildStatus: number;
    startedByUserId: string;
}

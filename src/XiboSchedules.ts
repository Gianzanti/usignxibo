import { Xibo } from './Xibo'
import { XiboComponent, Criteria } from './XiboComponent'

export interface ScheduleInsert {
    displayGroup?: string;
    description?: string;
    tags?: string;
    isDynamic: number;
    dynamicCriteria: string;
}

export interface Schedule {
    displayGroupId: number;
    displayGroup: string;
    description: string;
    isDisplaySpecific: number;
    isDynamic: number;
    dynamicCriteria: string;
    dynamicCriteriaTags: string;
    userId: number;
    tags: string;
    tagValues: string;
    bandwidthLimit: string;
}

interface ScheduleCriteria extends Criteria {
    displayGroupId?: number;
    displayGroup?: string;
    displayId?: number;
    nestedDisplayId?: number;
    dynamicCriteria?: string;
    isDisplaySpecific?: number;
    forSchedule?: number;
}

export class Schedules extends XiboComponent<Schedule, ScheduleCriteria, null, ScheduleInsert> {
    public constructor(server: Xibo) {
        super('/displaygroup', server)
    }
}

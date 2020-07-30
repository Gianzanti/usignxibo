import { Xibo } from './Xibo'
import { XiboComponent, Criteria } from './XiboComponent'

export interface DisplayGroupInsert {
    displayGroup?: string;
    description?: string;
    tags?: string;
    isDynamic: number;
    dynamicCriteria: string;
}

export interface DisplayGroup {
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

interface DisplayGroupCriteria extends Criteria {
    displayGroupId?: number;
    displayGroup?: string;
    displayId?: number;
    nestedDisplayId?: number;
    dynamicCriteria?: string;
    isDisplaySpecific?: number;
    forSchedule?: number;
}

export class DisplayGroups extends XiboComponent<DisplayGroup, DisplayGroupCriteria, null, DisplayGroupInsert> {
    public constructor(server: Xibo) {
        super('/displaygroup', server)
    }
}

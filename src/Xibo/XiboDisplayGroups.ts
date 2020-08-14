import { Xibo } from './Xibo'
import { XiboComponent } from './XiboComponent'
import { Tag } from './XiboTags'

export interface DisplayGroupInsert {
    displayGroup?: string;
    description?: string;
    tags?: string;
    isDynamic: number;
    dynamicCriteria: string;
}

export interface DisplayGroup {
    /** The displayGroup Id */
    displayGroupId: number;

    /** The displayGroup Name */
    displayGroup: string;

    /** The displayGroup Description */
    description: string;

    /** A flag indicating whether this displayGroup is a single display displayGroup */
    isDisplaySpecific: number;

    /** A flag indicating whether this displayGroup is dynamic */
    isDynamic: number;

    /** Criteria for this dynamic group. A comma separated set of regular expressions to apply */
    dynamicCriteria: string;

    /** Criteria for this dynamic group. A comma separated set of tags to apply */
    dynamicCriteriaTags: string;

    /** The UserId who owns this display group */
    userId: number;

    /** Tags associated with this DisplayGroup */
    tags: string;

    tagValues: string;

    /** The display bandwidth limit */
    bandwidthLimit: number;

}

interface DisplayGroupCriteria {
    displayGroupId?: number;
    displayGroup?: string;
    displayId?: number;
    nestedDisplayId?: number;
    dynamicCriteria?: string;
    isDisplaySpecific?: number;
    forSchedule?: number;
}

export class DisplayGroups extends XiboComponent<DisplayGroup, DisplayGroupCriteria, DisplayGroupInsert> {
    public constructor(server: Xibo) {
        super({
            endPoint: '/displaygroup',
            server: server,
        })
    }
}

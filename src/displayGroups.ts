import { Xibo } from './Xibo'
import { Entity, CMSResponse } from './entity'

export interface DisplayGroupInsert {
    /** The Display Group Name */
    displayGroup: string;

    /** The Display Group Description */
    description?: string;

    /** A comma separated list of tags for this item */
    tags?: string;

    /** Flag indicating whether this DisplayGroup is Dynamic */
    isDynamic: 0 | 1;

    /** The filter criteria for this dynamic group. 
     * A comma separated set of regular expressions to apply */
    dynamicCriteria?: string;
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


    /** Function to delete current entity */
    delete: () => Promise<boolean>;

    /** Function to update current entity */
    save: (newData: DisplayGroup|DisplayGroupInsert) => Promise<DisplayGroup>;

    addDisplays: (displayIDs: number[]) => Promise<boolean>;

    removeDisplays: (displayIDs: number[]) => Promise<boolean>;

    addDisplayGroups: (displayGroupIDs: number[]) => Promise<boolean>;

    removeDisplayGroups: (displayGroupIDs: number[]) => Promise<boolean>;
}

interface DisplayGroupCriteria {
    /** Filter by DisplayGroup Id */
    displayGroupId?: number;

    /** Filter by DisplayGroup Name */
    displayGroup?: string;

    /** Filter by DisplayGroups containing a specific display */
    displayId?: number;

    /** Filter by DisplayGroups containing a specific display in there nesting */
    nestedDisplayId?: number;

    /** Filter by DisplayGroups containing a specific dynamic criteria */
    dynamicCriteria?: string;

    /** Filter by whether the Display Group belongs to a Display or is user created */
    isDisplaySpecific?: number;

    /** Should the list be refined for only those groups the User can Schedule against? */
    forSchedule?: number;
}

export class DisplayGroups extends Entity<DisplayGroup, DisplayGroupCriteria, DisplayGroupInsert> {
    public constructor(server: Xibo) {
        super({
            endPoint: '/displaygroup',
            server: server,
        })
    }

    /**
     * Add entity functions to returned object
     * 
     * @param data - DisplayGroup Object
     */
    protected transformData (data: DisplayGroup): DisplayGroup {
        return {
            ...data,
            
            delete: () => super.remove(data.displayGroupId),
            
            save: (newData: DisplayGroup|DisplayGroupInsert) => super.update(data.displayGroupId, newData),
            
            addDisplays: async (displayIDs: number[]) => {
                const ep = `${this.endpoint}/${data.displayGroupId}/display/assign`
                const resp = await this.server.api.post<CMSResponse<DisplayGroup>, number[]>(ep, displayIDs)
                if (resp.data.success) {
                    console.log('addDisplays:', resp.data.message)
                    return true
                }
                this.dealWithError(resp)
            },

            removeDisplays: async (displayIDs: number[]) => {
                const ep = `${this.endpoint}/${data.displayGroupId}/display/unassign`
                const resp = await this.server.api.post<CMSResponse<DisplayGroup>, number[]>(ep, displayIDs)
                if (resp.data.success) {
                    console.log('removeDisplays:', resp.data.message)
                    return true
                }
                this.dealWithError(resp)
            },

            addDisplayGroups: async (displayGroupIDs: number[]) => {
                const ep = `${this.endpoint}/${data.displayGroupId}/displayGroup/assign`
                const resp = await this.server.api.post<CMSResponse<DisplayGroup>, number[]>(ep, displayGroupIDs)
                if (resp.data.success) {
                    console.log('addDisplayGroups:', resp.data.message)
                    return true
                }
                this.dealWithError(resp)
            },

            removeDisplayGroups: async (displayGroupIDs: number[]) => {
                const ep = `${this.endpoint}/${data.displayGroupId}/displayGroup/unassign`
                const resp = await this.server.api.post<CMSResponse<DisplayGroup>, number[]>(ep, displayGroupIDs)
                if (resp.data.success) {
                    console.log('removeDisplayGroups:', resp.data.message)
                    return true
                }
                this.dealWithError(resp)
            }

        }
    }
}

/* eslint-disable no-undef */
import { Xibo } from './Xibo'
import { XiboComponent, USignResponse, CMSResponse, Pagination } from './XiboComponent'
import { Campaign } from './XiboCampaign'
import { DisplayGroup } from './XiboDisplayGroups'
import { Layout } from './XiboLayout'

// export interface ScheduleInsert {

// }
export interface Event {
    eventId: number;
    eventTypeId: number;
    campaignId: number;
    commandId: number;
    // displayGroups: string;
    scheduleReminders: string;
    userId: number;
    fromDt: number;
    toDt: number;
    isPriority: number;
    displayOrder: number;
    recurrenceType: string; //enum: [None,Minute,Hour,Day,Week,Month,Year]
    recurrenceDetail: number;
    recurrenceRange: number;
    recurrenceRepeatsOn: string;
    recurrenceMonthlyRepeatsOn: number;
    campaign: string;
    command: string;
    dayPartId: number;
    isAlways: number;
    isCustom: number;
    syncEvent: number;
    syncTimezone: number;
    shareOfVoice: number;
    isGeoAware: number;
    geoLocation: string;
    intermediateDisplayGroupIds: string[];
    layoutId: number;
    displayGroupId: number;
}

export interface Schedule {
    campaigns: Campaign[];
    displaygroups: DisplayGroup[];
    events: Event[];
    layouts: Layout[];
}

interface ScheduleCriteria {
    displayGroupId?: number;
    date?: string; //Date in Y-m-d H:i:s
}

export class Schedules extends XiboComponent<Schedule, ScheduleCriteria, null> {
    public constructor(server: Xibo) {
        super({
            endPoint: '/schedule',
            server: server,
        })
    }

    /**
     * Mount the response to uSign, in the desired format
     * 
     * @param resp - a response from axios
     * @param offset - the current data offset
     * @param pageSize - the current pageSize
     */
    private mountScheduleResponse(resp: CMSResponse<Schedule>, offset = 0, pageSize = 10): USignResponse<Event> {
        const totalRecords = resp.data.events.length
        const currentRecords = resp.data.events.length
        const page = Math.ceil((offset + currentRecords) / pageSize)
        const pages = Math.ceil(totalRecords / pageSize)
        return {
            data: resp.data.events,
            pages,
            page,
            total: totalRecords
        }
    }

    public async listEvents(criteria: ScheduleCriteria & Pagination): Promise<USignResponse<Event>> {
        const ep = `${this.endpoint}/${criteria.displayGroupId}/events`
        const resp = await this.server.api.get<CMSResponse<Schedule>, ScheduleCriteria & Pagination>(ep, criteria)
        if (resp.data.success) {
            return this.mountScheduleResponse(resp.data, criteria && criteria.start, criteria && criteria.length)
        }
        super.threatError(resp)
    }
}

import { Xibo } from './Xibo'
import { XiboComponent, Criteria, XiboResponse, XiboComponentDTO } from './XiboComponent'
import { Campaign } from './XiboCampaing'
import { DisplayGroup } from './XiboDisplayGroups'
import { Layout } from './XiboLayout'

// export interface ScheduleInsert {

// }
export interface Event {
    eventId: number;
    eventTypeId: number;
    campaignId: number;
    commandId: number;
    displayGroups: string;
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
}

export interface Schedule {
    campaigns: Campaign[];
    displaygroups: DisplayGroup[];
    events: Event[];
    layouts: Layout[];
}

interface ScheduleCriteria extends Criteria {
    displayGroupId: number;
    date: string; //Date in Y-m-d H:i:s
}

export class Schedules extends XiboComponent<Schedule, ScheduleCriteria, null> {
    public constructor(server: Xibo) {
        super({
            endPoint: '/schedule',
            server: server,
            gridExpected: false
        })
    }

    public async listEvents(criteria: ScheduleCriteria): Promise<XiboResponse<Schedule>> {
        return super.list(criteria, `${this.endpoint}/${criteria.displayGroupId}/events`)
    }

}

import { Xibo } from './Xibo'
import { XiboComponent, Criteria, XiboCMSResponse } from './XiboComponent'

// export interface ScheduleInsert {

// }

export interface Schedule {
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

interface ScheduleCriteria extends Criteria {
    displayGroupId: number;
    date: string; //Date in Y-m-d H:i:s
}

export class Schedules extends XiboComponent<Schedule, ScheduleCriteria, null, null> {
    public constructor(server: Xibo) {
        super('/schedule', server)
    }

    public async listEvents(criteria: ScheduleCriteria): Promise<XiboCMSResponse<Schedule>> {
        return super.list(criteria, `${this.endpoint}/${criteria.displayGroupId}/events`)
    }

}

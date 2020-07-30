export interface Campaign {
    //The Campaign Id,
    campaignId: number;
    //The userId of the User that owns this Campaign,
    ownerId: number;
    //The name of the Campaign,
    campaign: string;
    //A 0|1 flag to indicate whether this is a Layout specific Campaign or not.,
    isLayoutSpecific: number;
    //The number of Layouts associated with this Campaign,
    numberLayouts: number;
    //The total duration of the campaign (sum of layout's durations),
    totalDuration: number;
}

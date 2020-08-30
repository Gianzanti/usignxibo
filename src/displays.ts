import { Xibo } from './Xibo'
import { Entity } from './entity'

export interface DisplayInsert {
    displayId?: number;
    display?: string;
    description?: string;
    tags?: string;
    auditingUntil?: number;
    defaultLayoutId?: number;
    licensed?: number;
    license?: string;
    incSchedule?: number;
    emailAlert?: number;
    alertTimeout?: number;
    wakeOnLanEnabled?: number;
    wakeOnLanTime?: string;
    broadCastAddress?: string;
    secureOn?: string;
    cidr?: string;
    latitude?: number;
    longitude?: number;
    timeZone?: string;
    displayProfileId?: number;
    clearCachedData?: number;
    rekeyXmr?: number;
    teamViewerSerial?: string;
    webkeySerial?: string;
}

export interface Display {
    displayId: number;
    auditingUntil: number;
    display: string;
    description: string;
    defaultLayoutId: number;
    license: string;
    licensed: number;
    loggedIn: number;
    lastAccessed: string;
    incSchedule: number;
    emailAlert: number;
    alertTimeout: number;
    clientAddress: string;
    mediaInventoryStatus: number;
    macAddress: string;
    lastChanged: string;
    numberOfMacAddressChanges: number;
    lastWakeOnLanCommandSent: string;
    wakeOnLanEnabled: number;
    wakeOnLanTime: string;
    broadCastAddress: string;
    secureOn: string;
    cidr: string;
    latitude: number;
    longitude: number;
    clientType: string;
    clientVersion: string;
    clientCode: number;
    displayProfileId: number;
    currentLayoutId: number;
    screenShotRequested: number;
    storageAvailableSpace: string;
    storageTotalSpace: string;
    displayGroupId: number;
    currentLayout: string;
    defaultLayout: string;
    xmrChannel: string;
    xmrPubKey: string;
    lastCommandSuccess: number;
    deviceName: string;
    timeZone: string;
    tags: string;
    tagValues: string;
    bandwidthLimit: number;
    newCmsAddress: string;
    newCmsKey: string;
    orientation: string;
    resolution: string;
    commercialLicence: number;
    bandwidthLimitFormatted: string;
}

export interface DisplayCriteria {
    displayId?: number;
    displayGroupId?: number;
    display?: string;
    macAddress?: string;
    hardwareKey?: string;
    clientVersion?: string;
    clientType?: string;
    clientCode?: number;
    embed?: string;
    authorised?: number;
    displayProfileId?: number;
    mediaInventoryStatus?: number; //Filter by Display Status ( 1 - up to date, 2 - downloading, 3 - Out of date)",
    loggedIn?: number;
    lastAccessed?: string;
}

export class Displays extends Entity<Display, DisplayCriteria, DisplayInsert> {
    public constructor(server: Xibo) {
        super({
            endPoint: '/display',
            server: server,
        })
    }
}

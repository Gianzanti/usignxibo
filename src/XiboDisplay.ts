import { Xibo } from './Xibo'
import { ScalaComponent } from './ScalaComponent'

// export interface DisplayInsert {
//     name: string;
// }
// export interface Display extends DisplayInsert {
//     id: number;
// }

export interface Display{
    // The ID of this Displaynterface XiboDisplay{
    displayId: number,

    // Flag indicating whether this Display is recording Auditing Information from XMDS
    auditingUntil: number,

    // The Name of this Display
    display: string,

    // The Description of this Display
    description: string,

    // The ID of the Default Layout
    defaultLayoutId: number,

    // The Display Unique Identifier also called hardware key
    license: string,

    // A flag indicating whether this Display is licensed or not
    licensed: number,

    // A flag indicating whether this Display is currently logged in
    loggedIn: number,

    // A timestamp in CMS time for the last time the Display accessed XMDS
    lastAccessed: number,

    // A flag indicating whether the default layout is interleaved with the Schedule
    incSchedule: number,

    // A flag indicating whether the Display will send email alerts.
    emailAlert: number,

    // A timeout in seconds for the Display to send email alerts.
    alertTimeout: number,

    // The MAC Address of the Display
    clientAddress: string,

    // The media inventory status of the Display
    mediaInventoryStatus: number,

    // The current Mac Address of the Player
    macAddress: string,

    // A timestamp indicating the last time the Mac Address changed
    lastChanged: number,

    // A count of Mac Address changes
    numberOfMacAddressChanges: number,

    // A timestamp indicating the last time a WOL command was sent
    lastWakeOnLanCommandSent: number,

    // A flag indicating whether Wake On Lan is enabled
    wakeOnLanEnabled: number,

    // A h:i string indicating the time to send a WOL command
    wakeOnLanTime: string,

    // The broad cast address for this Display
    broadCastAddress: string,

    // The secureOn WOL settings for this display.
    secureOn: string,

    // The CIDR WOL settings for this display
    cidr: string,

    // The display Latitude
    latitude: number,

    // The display longitude
    longitude: number,

    // A string representing the player type
    clientType: string,

    // A string representing the player version
    clientVersion: string,

    // A number representing the Player version code
    clientCode: number,

    // The display settings profile ID for this Display
    displayProfileId: number,

    // The current layout ID reported via XMDS
    currentLayoutId: number,

    // A flag indicating that a screen shot should be taken by the Player
    screenShotRequested: number,

    // The number of bytes of storage available on the device.
    storageAvailableSpace: number,

    // The number of bytes of storage in total on the device
    storageTotalSpace: number,

    // The ID of the Display Group for this Device
    displayGroupId: number,

    // The current layout
    currentLayout: string,

    // The default layout
    defaultLayout: string,

    // iytri
    // displayGroups: [...],

    // The Player Subscription Channel
    xmrChannel: string,

    // The Player Public Key
    xmrPubKey: string,

    // The last command success, 0 = failure, 1 = success, 2 = unknown
    lastCommandSuccess: number,

    // The Device Name for the device hardware associated with this Display
    deviceName: string,

    // The Display Timezone, or empty to use the CMS timezone
    timeZone: string,

    // overrideConfig: {...},
    // tags: [...],

    // The display bandwidth limit
    bandwidthLimit: number,

    // The new CMS Address
    newCmsAddress: string,

    // The new CMS Key
    newCmsKey: string,

    // The orientation of the Display, either landscape or portrait
    orientation: string,

    // The resolution of the Display expressed as a string in the format WxH
    resolution: string,

    // Status of the commercial licence for this Display. 0 - Not licensed, 1 - licensed, 2 - trial licence, 3 - not applicable
    commercialLicence: number,
}

export class Displays extends ScalaComponent<Display, null, null> {
  public constructor (server: Xibo) {
    super('/display', server)
  }
}

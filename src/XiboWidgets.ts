import { WidgetOption } from './XiboWidgetOption'
import { WidgetAudio } from './XiboWidgetAudio'
import { Permission } from './XiboPermission'
import { XiboComponent } from './XiboComponent'
import { Xibo } from './Xibo'

export interface Widget {
    /** The Widget ID */
    widgetId: number;
    /** The ID of the Playlist this Widget belongs to */
    playlistId: number;
    /** The ID of the User that owns this Widget */
    ownerId: number;
    /** The Module Type Code */
    type: string;
    /** The duration in seconds this widget should be shown */
    duration: number;
    /** The display order of this widget */
    displayOrder: number;
    /** Flag indicating if this widget has a duration that should be used */
    useDuration: 0 | 1;
    /** Calculated Duration of this widget after taking into account the useDuration flag */
    calculatedDuration: number;
    /** The datetime the Layout was created */
    createdDt: string;
    /** The datetime the Layout was last modified */
    modifiedDt: string;
    /** Widget From Date */
    fromDt: number;
    /** Widget To Date */
    toDt: number;
    /** Transition Type In */
    transitionIn: number;
    /** Transition Type out */
    transitionOut: number;
    /** Transition duration in */
    transitionDurationIn: number;
    /** Transition duration out */
    transitionDurationOut: number;
    /** An array of Widget Options */
    widgetOptions: WidgetOption[];
    /** An array of MediaIds this widget is linked to */
    mediaIds: number[];
    /** An array of Audio MediaIds this widget is linked to */
    audio: WidgetAudio[];
    /** An array of permissions for this widget */
    permissions: Permission[];
    /** The Module Object for this Widget */
    module: string;
    /** The name of the Playlist this Widget is on */
    playlist: string;

    name: string;
}

export interface WidgetWebpageInsert {
    // /** The WidgetId to Edit */
    // widgetId: number;
    
    /** Optional Widget Name */
    name?: string;
    
    /** The Web page Duration */
    duration?: number;
    
    /** (0, 1) Select 1 only if you will provide duration parameter as well */
    useDuration?: 0 | 1;
    
    // /** The option (On, Off, Inherit) to enable the collection of Widget Proof of Play statistics */
    // enableStat?: 'On' | 'Off' | 'Inherit';
    
    // /** flag (0,1) should the HTML be shown with a transparent background? */
    // transparency?: 0 | 1;
    
    /** string containing the location (URL) of the web page */
    uri: string;
    
    // /** For Manual position the percentage to scale the Web page (0-100) */
    // scaling?: number;
    
    // /** For Manual position, the starting point from the left in pixels */
    // offsetLeft?: number;
    
    // /** For Manual position, the starting point from the Top in pixels */
    // offsetTop?: number;
    
    // /** For Manual Position and Best Fit, The width of the page - if empty it will use region width */
    // pageWidth?: number;
    
    // /** For Manual Position and Best Fit, The height of the page - if empty it will use region height */
    // pageHeight?: number;
    
    /** The mode option for Web page, 1- Open Natively, 2- Manual Position, 3- Best Ft */
    modeId: 1 | 2 | 3;

    /** The display order of this widget - ADDED TO MAKE IT COMPATIBLE WITH USIGN*/
    displayOrder: number;
}

export class Widgets extends XiboComponent<Widget, null, WidgetWebpageInsert> {
    public constructor(server: Xibo) {
        super({
            endPoint: '/playlist/widget',
            server: server,
        })
    }
}
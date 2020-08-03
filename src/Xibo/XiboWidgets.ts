import { WidgetOption } from './XiboWidgetOption'
import { WidgetAudio } from './XiboWidgetAudio'
import { Permission } from './XiboPermission'

export interface Widgets {
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
    useDuration: number;
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
}

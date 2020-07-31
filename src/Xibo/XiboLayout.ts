import { Region } from './XiboRegion'
import { Tag } from './XiboTags'
import { XiboComponent } from './XiboComponent'
import { Xibo } from './Xibo'

export interface Layout {
    /** The layoutId */
    layoutId: number;

    /** The userId of the Layout Owner */
    ownerId: number;

    /** The id of the Layout's dedicated Campaign */
    campaignId: number;

    /** The parentId, if this Layout has a draft */
    parentId: number;

    /** The Status Id */
    publishedStatusId: number;

    /** The Published Status (Published, Draft or Pending Approval */
    publishedStatus: string;

    /** The Published Date */
    publishedDate: string;

    /** The id of the image media set as the background */
    backgroundImageId: number;

    /** The XLF schema version */
    schemaVersion: number;

    /** The name of the Layout */
    layout: string;

    /** The description of the Layout */
    description: string;

    /** A HEX string representing the Layout background color */
    backgroundColor: string;

    /** The datetime the Layout was created */
    createdDt: string;

    /** The datetime the Layout was last modified */
    modifiedDt: string;

    /** Flag indicating the Layout status */
    status: number;

    /** Flag indicating whether the Layout is retired */
    retired: number;

    /** The Layer that the background should occupy */
    backgroundzIndex: number;

    /** The Layout Width */
    width: number;

    /** The Layout Height */
    height: number;

    /** If this Layout has been requested by Campaign, then this is the display order of the Layout within the Campaign */
    displayOrder: number;

    /** A read-only estimate of this Layout's total duration in seconds. This is equal to the longest region duration and is valid when the layout status is 1 or 2. */
    duration: number;

    /** A status message detailing any errors with the layout */
    statusMessage: string;

    /** Flag indicating whether the Layout stat is enabled */
    enableStat: number;

    /** Flag indicating whether the default transitions should be applied to this Layout */
    autoApplyTransitions: number;

    /** An array of Regions belonging to this Layout */
    regions: Region[];

    /** An array of Tags belonging to this Layout */
    tags: Tag[];
}

interface LayoutFunctions {
    checkOut: () => Promise<void>;
}

export interface LayoutCriteria {
    /** Filter by Layout Id */
    layoutId?: number;
    /** Filter by parent Id */
    parentId?: number;
    /** Flag indicating whether to show drafts */
    showDrafts?: number;
    /** Filter by partial Layout name */
    layout?: string;
    /** Filter by user Id */
    userId?: number;
    /** Filter by retired flag */
    retired?: number;
    /** Filter by Tags */
    tags?: string;
    /** A flag indicating whether to treat the tags filter as an exact match */
    exactTags?: number;
    /** users in this UserGroupId */
    ownerUserGroupId?: number;
    /** published status id, 1 - Published, 2 - Draft */
    publishedStatusId?: number;
    /** Embed related data such as regions, playlists, widgets, tags, campaigns, permissions */
    embed?: string;
    /** Get all Layouts for a given campaignId */
    campaignId?: number;
}

export class Layouts extends XiboComponent<Layout, LayoutCriteria, null> {
    public constructor(server: Xibo) {
        super({
            endPoint: '/layout',
            server: server,
        })
    }
}

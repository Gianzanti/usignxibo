import { Xibo } from './Xibo'
import { XiboComponent, Criteria } from './XiboComponent'

export interface TagInsert {
    name?: string;
    isRequired?: number;
    options?: string[] | string;
}

export interface Tag {
    /** The Tag ID */
    tagId: number;

    /** The Tag Name */
    tag: string;

    /** Flag, whether the tag is a system tag */
    isSystem: 0 | 1;

    /** Flag, whether the tag requires additional values */
    isRequired: 0 | 1;

    /** An array of options assigned to this Tag */
    options: string[];

    /** An array of layoutID and values pairs with this Tag */
    layouts: string[];

    /** An array of playlistIDs and values with this Tag */
    playlists: string[];

    /** An array of campaignIDs and values with this Tag */
    campaigns: string[];

    /** An array of mediaIds and values with this Tag */
    medias: string[];

    /** An array of displayGroupIds and values with this Tag */
    displayGroups: string[];

    /** The Tag Value */
    value: string;
}

/** 
 * Search Criteria for tags viewable by current user 
 * 
 */
interface TagCriteria extends Criteria {
    /** Filter by Tag Id */
    tagId?: number;

    /** Filter by partial Tag */
    tag?: string;

    /** Filter by exact Tag */
    exactTag?: string;

    /** Filter by isSystem flag */
    isSystem?: 0 | 1;

    /** Filter by isRequired flag */
    isRequired?: 0 | 1;

    /** Set to 1 to show only results that have options set */
    haveOptions?: 0 | 1;
}

export class Tags extends XiboComponent<Tag, TagCriteria, TagInsert> {
    public constructor(server: Xibo) {
        super({
            endPoint: '/tag',
            server: server,
        })
    }

    public parseData (data: Tag): Tag {
        if (data.options) {
            return {
                ...data,
                options: data.options ? JSON.parse(data.options as unknown as string) : undefined
            }
        }
        return data
    }
}

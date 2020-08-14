import { Xibo } from './Xibo'
import { XiboComponent } from './XiboComponent'

export interface TagInsert {
    /** Tag name */
    name: string;
    /** A flag indicating whether value selection on assignment is required */
    isRequired?: 0 | 1;
    /** A comma separated string of Tag options */
    options?: string[];
}

/**
 * Tag Xibo Component
 */
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
    // /** An array of layoutID and values pairs with this Tag */
    // layouts: string[];
    // /** An array of playlistIDs and values with this Tag */
    // playlists: string[];
    // /** An array of campaignIDs and values with this Tag */
    // campaigns: string[];
    // /** An array of mediaIds and values with this Tag */
    // medias: string[];
    // /** An array of displayGroupIds and values with this Tag */
    // displayGroups: string[];
    /** The Tag Value */
    value: string;
}

/** 
 * Search Criteria for tags viewable by current user 
 */
interface TagCriteria {
    /** Filter by Tag Id */
    tagId?: number;
    /** Filter by partial Tag */
    tag?: string;
    /** Filter by exact Tag (isn't working in the current version [2.3.5]) */
    exactTag?: string;
    /** Filter by isSystem flag */
    isSystem?: 0 | 1;
    /** Filter by isRequired flag */
    isRequired?: 0 | 1;
    /** Set to 1 to show only results that have options set */
    haveOptions?: 0 | 1;
}

/**
 * Manage Xibo tags
 * 
 * @example to list all tags
 * ```
 * // to list all tags
 * const tags = await xibo.tags.list()
 * 
 * // to search for an specific tagId
 * // can use any TagCriteria to search for
 * const tags = await xibo.tags.list({tagId: 5})
 * 
 * // to insert a tag
 * const tagToInsert: TagInsert = {
 *       name: 'TagName',
 *       isRequired: 0,
 *       options: ['some', 'options', 'comma', 'separated']
 * }
 * const inserted = await xibo.tags.insert(tagToInsert)
 * 
 * // to update a tag
 * const newTag = {
 *     ...inserted,
 *     name: 'TagNameChanged'
 * }
 * const toUpdate = await xibo.tags.update(newTag.tagId, newTag)
 * 
 * // to delete a tag
 * xibo.tags.remove(toUpdate.tagId)
 * ```
 */
export class Tags extends XiboComponent<Tag, TagCriteria, TagInsert> {
    
    public constructor(server: Xibo) {
        super({
            endPoint: '/tag',
            server: server,
        })
    }

    /**
     * Transform the options of tag from string to array
     * 
     * @param data - Tag Object
     */
    protected transformData (data: Tag): Tag {
        if (data.options) {
            const newOptions = this.tryParse(data.options as unknown as string)
            if (Array.isArray(newOptions)) {
                return {
                    ...data,
                    options: newOptions
                }
            }
            return {
                ...data,
                options: (data.options as unknown as string).split(',')
            }
        }
        return data
    }

    /**
     * This exists for trying to serialize the value back to JSON.
     * If it cannot serialize it, then it was a string value given.
     * 
     * @param value - the value you wish to try to parse
     */
    protected tryParse(value: string): string[] | string {
        try {
            return JSON.parse(value)
        } catch {
            return value
        }
    }
}

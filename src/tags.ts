import { Xibo } from './Xibo'
import { Entity } from './entity'

export interface TagInsert {
    /** Tag name */
    name: string;

    /** A flag indicating whether value selection on assignment is required */
    isRequired?: 0 | 1;

    /** An array of strings of Tag options */
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

    /** The Tag Value */
    value: string;

    /** Function to delete current tag */
    delete: () => Promise<boolean>;

    /** Function to update current tag */
    save: (newData: Tag|TagInsert) => Promise<Tag>;

    
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
}

/** 
 * Search Criteria for tags viewable by current user 
 */
interface TagCriteria {
    /** Filter by Tag Id */
    tagId?: number;

    /** Filter by partial Tag */
    tag?: string;

    /** Filter by exact Tag (isn't working in the current version [2.3.6]) */
    // exactTag?: string;

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
 * const tags = await xibo.tags.list() 
 * ```
 * 
 * @example to search using any TagCriteria as parameter
 * const tags = await xibo.tags.list(\{tagId: 5\})
 * 
 * @example to insert a tag
 * const inserted = await xibo.tags.insert(\{
 *       name: 'TagName',
 *       isRequired: 0,
 *       options: ['some', 'options', 'comma', 'separated']
 * \})
 * 
 * @example to update a tag
 * const updated = await inserted.save(\{
 *     ...inserted,
 *     name: 'TagNameChanged'
 * \})
 * 
 * @example to delete a tag
  * const removed = await updated.delete()
 */
export class Tags extends Entity<Tag, TagCriteria, TagInsert> {
    
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
        const newTag = {
            ...data,
            delete: () => super.remove(data.tagId),
            save: (newData: Tag|TagInsert) => super.update(data.tagId, newData)
        }

        if (data.options) {
            const newOptions = this.tryParse(data.options as unknown as string)
            if (Array.isArray(newOptions)) {
                return {
                    ...newTag,
                    options: newOptions
                }
            }
            return {
                ...newTag,
                options: (data.options as unknown as string).split(',')
            }
        }
        return newTag
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

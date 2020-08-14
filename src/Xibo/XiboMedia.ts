import { Tag } from './XiboTags'
import { XiboComponent, CMSResponse } from './XiboComponent'
import { Xibo } from './Xibo'
import { XiboError } from './XiboError'

export interface Media {
    /** The Media ID */
    mediaId: number;

    /** The ID of the User that owns this Media */
    ownerId: number;

    /** The Parent ID of this Media if it has been revised */
    parentId: number;

    /** The Name of this Media */
    name: string;

    /** The module type of this Media */
    mediaType: string;

    /** The file name of the media as stored in the library */
    storedAs: string;

    /** The original file name as it was uploaded */
    fileName: string;

    /** Tags associated with this Media */
    tags: Tag[];

    /** The file size in bytes */
    fileSize: number;

    /** The duration to use when assigning this media to a Layout widget */
    duration: number;

    /** Flag indicating whether this media is valid. */
    valid: number;

    /** Flag indicating whether this media is a system file or not */
    moduleSystemFile: number;

    /** Timestamp indicating when this media should expire */
    expires: number;

    /** Flag indicating whether this media is retired */
    retired: number;

    /** Flag indicating whether this media has been edited and replaced with a newer file */
    isEdited: number;

    /** A MD5 checksum of the stored media file */
    md5: string;

    /** The username of the User that owns this media */
    owner: string;

    /** A comma separated list of groups/users with permissions to this Media */
    groupsWithPermissions: string;

    /** A flag indicating whether this media has been released */
    released: number;

    /** An API reference */
    apiRef: string;

    /** The datetime the Media was created */
    createdDt: string;

    /** The datetime the Media was last modified */
    modifiedDt: string;

    /** The option to enable the collection of Media Proof of Play statistics */
    enableStat: string;
}

export interface MediaCriteria {
    /** Filter by Media Id */
    mediaId?: number;

    /** Filter by Media Name */
    media?: string;

    /** Filter by Media Type */
    type?: string;

    /** Filter by Owner Id */
    ownerId?: number;

    /** Filter by Retired */
    retired?: number;

    /** Filter by Tags - comma seperated */
    tags?: string;

    /** A flag indicating whether to treat the tags filter as an exact match */
    exactTags?: number;

    /** Filter by Duration - a number or less-than,greater-than,less-than-equal or great-than-equal followed by a | followed by a number */
    duration?: string;

    /** Filter by File Size - a number or less-than,greater-than,less-than-equal or great-than-equal followed by a | followed by a number */
    fileSize?: string;

    /** Filter by users in this UserGroupId */
    ownerUserGroupId?: number;
}

export interface MediaInsert {
    /** The url to the media */
    url: string;

    /** The type of the media, image, video etc */
    type: string;

    /** Optional extension of the media, jpg, png etc. If not set in the request it will be retrieved from the headers */
    extension?: string;

    /** The option to enable the collection of Media Proof of Play statistics, On, Off or Inherit. */
    enableStat?: string;

    /** An optional name for this media file, if left empty it will default to the file name */
    optionalName?: string;

    /** Date in Y-m-d H:i:s format, will set expiration date on the Media item */
    expires?: string;
}

export class Medias extends XiboComponent<Media, MediaCriteria, MediaInsert> {
    public constructor(server: Xibo) {
        super({
            endPoint: '/library',
            server: server,
        })
    }

    public async insert(content: MediaInsert): Promise<Media> {
        const endPoint = '/library/uploadUrl'
        const resp = await this.server.api.post<CMSResponse<Media>, MediaInsert>(endPoint, content)
        if (!resp.data.success) {
            if (resp.data.message) {
                throw new XiboError(resp.data.message)
            }
            throw new XiboError(resp.statusText)
        }
        // console.log(resp.data.message)
        return resp.data.data
    }
}
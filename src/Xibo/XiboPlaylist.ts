import { Tag } from './XiboTags'
import { Widget } from './XiboWidgets'
import { XiboComponent, CMSResponse } from './XiboComponent'

import { Xibo } from './Xibo'
import { Permission } from './XiboPermission'

export interface Playlist {

    //The ID of this Playlist,  
    playlistId: number;

    //The userId of the User that owns this Playlist,
    ownerId: number;

    //The Name of the Playlist,
    name: string;

    //The RegionId if this Playlist is specific to a Region,
    regionId: number;

    //Flag indicating if this is a dynamic Playlist,
    isDynamic: number;

    //Filter Name for a Dynamic Playlist,
    filterMediaName: string;

    //Filter Tags for a Dynamic Playlist,
    filterMediaTags: string;

    //The datetime the Layout was created,
    createdDt: string;

    //The datetime the Layout was last modified,
    modifiedDt: string;

    //A read-only estimate of this Layout's total duration in seconds. This is equal to the longest region duration and is valid when the layout status is 1 or 2.,
    duration: number;

    //Flag indicating whether this Playlists requires a duration update,
    requiresDurationUpdate: number;

    //The option to enable the collection of Playlist Proof of Play statistics,
    enableStat: string;

    //An array of Tags,
    tags: Tag[];

    //An array of Widgets assigned to this Playlist,
    widgets: Widget[];

    //An array of permissions,
    permissions: Permission[];

}

export interface PlaylistCriteria {
    //The ID of this Playlist,  
    playlistId?: number;

    embed?: 'widgets';
}
interface MediaInsert {
    'media[]': string;
    duration?: number;
    displayOrder?: number;
}

export class Playlists extends XiboComponent<Playlist, PlaylistCriteria, null> {
    public constructor(server: Xibo) {
        super({
            endPoint: '/playlist',
            server: server,
        })
    }

    public async addMedia(playlistId: number, mediaId: number, position: number | undefined = undefined): Promise<Playlist> {
        const endPoint = `${this.endpoint}/library/assign/${playlistId}`
        const arrMedias: MediaInsert = {'media[]': mediaId.toString(), displayOrder: position}
        const resp = await this.server.api.post<CMSResponse<Playlist>, MediaInsert>(endPoint, arrMedias)
        if (resp.data.success) {
            // console.log(resp.data)
            return resp.data.data
        }
        super.threatError(resp)
    }

}

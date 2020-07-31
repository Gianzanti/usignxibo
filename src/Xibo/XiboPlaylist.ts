import { Permission } from './XiboPermission'
import { Tag } from './XiboTags'
import { Widgets } from './XiboWidgets'
import { XiboComponent, XiboCMSResponse, XiboCMSData } from './XiboComponent'

import { Xibo } from './Xibo'
import { XiboError } from './XiboError'

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
    widgets: Widgets[];

    //An array of permissions,
    permissions: Permission[];

}

export class Playlists extends XiboComponent<Playlist, null, null> {
    public constructor(server: Xibo) {
        super({
            endPoint: '/playlist',
            server: server,
        })
    }

    public async addMedia(playlistId: number, mediaId: number): Promise<void> {
        const endPoint = `${this.endpoint}/library/assign/${playlistId}`
        const resp = await this.server.api.post<XiboCMSResponse<XiboCMSData<Permission>>, number[]>(endPoint, [mediaId])
        if (!resp.data.success) {
            if (resp.data.message) {
                throw new XiboError(resp.data.message)
            }
            throw new XiboError(resp.statusText)
        }
        console.log(resp.data)
    }

    // public async set(entityType: string, objectId: number): Promise<void> {
    //     const endPoint = `${this.endpoint}/library/assign/${entityType}/${objectId}`
    //     const resp = await this.server.api.post<XiboCMSResponse<XiboCMSData<Permission>>>(endPoint)
    //     if (!resp.data.success) {
    //         if (resp.data.message) {
    //             throw new XiboError(resp.data.message)
    //         }
    //         throw new XiboError(resp.statusText)
    //     }
    //     // console.log(resp.data.data.data)
    //     return
    // }
}

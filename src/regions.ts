import { RegionOption } from './regionOptions'
import { Permission } from './permissions'
import { Playlist } from './playlists'

export interface Region {
    //The ID of this region,  
    regionId: number;

    //The Layout ID this region belongs to,
    layoutId: number;

    //The userId of the User that owns this Region,
    ownerId: number;

    //The name of this Region,
    name: string;

    //Width of the region,
    width: number;

    //Height of the Region,
    height: number;

    //The top coordinate of the Region,
    top: number;

    //The left coordinate of the Region,
    left: number;

    //The z-index of the Region to control Layering,
    zIndex: number;

    //An array of Region Options,
    regionOptions: RegionOption[];

    //An array of Permissions,
    permissions: Permission[];

    //A read-only estimate of this region's total duration in seconds. This is valid when the parent layout status is 1 or 2.,
    duration: number;

    //This Regions Playlist - null if getPlaylist() has not been called.,
    regionPlaylist: Playlist;

}



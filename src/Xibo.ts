import { AxiosResponse } from 'axios'
import { XiboAPI  } from './XiboAPI'
import { XiboError } from './XiboError'
import { Tags } from './XiboTags'
import { DisplayGroups } from './XiboDisplayGroups'
import { Displays } from './XiboDisplays'
import { Schedules } from './XiboSchedules'
import { CMSResponse } from './XiboComponent'
import { Playlists } from './XiboPlaylist'
import { Layouts } from './XiboLayout'
import { Medias } from './XiboMedia'
import { Permissions } from './XiboPermission'
import { Widgets } from './XiboWidgets'

interface XiboCredentials {
    /** Client ID provided by Application settings in Xibo Server */
    client_id: string;

    /** Client Secret provided by Application settings in Xibo Server */
    client_secret: string;

    /** Grant Type is always client_credentials */
    grant_type: 'client_credentials';
}

interface XiboDTO extends XiboCredentials {
    /** Xibo server url */
    url: string;
}

interface XiboAuth {
    /** Bearer token to use in all requests */
    access_token: string;

    /** Token type */
    token_type: string;

    /** Time to expire, in minutes */
    expires_in: number;
}

interface XiboAbout {
    /** Xibo server version */
    version: string;
}

interface XiboClock {
    time: string;
}

export interface XiboDef {
    tags: Tags;
    displaygroups: DisplayGroups;
    displays: Displays;
    schedules: Schedules;
    playlists: Playlists;
    layouts: Layouts;
    medias: Medias;
    permissions: Permissions;
    widgets: Widgets
}

export class Xibo implements XiboDef {
    private credentials: XiboCredentials;
    public api: XiboAPI;
    public tags: Tags;
    public displaygroups: DisplayGroups
    public displays: Displays
    public schedules: Schedules
    public playlists: Playlists
    public layouts: Layouts
    public medias: Medias
    public permissions: Permissions
    public widgets: Widgets

    public constructor({ url, ...credentials }: XiboDTO) {
        this.api = new XiboAPI(url)
        this.credentials = credentials
        this.tags = new Tags(this)
        this.displaygroups = new DisplayGroups(this)
        this.displays = new Displays(this)
        this.schedules = new Schedules(this)
        this.playlists = new Playlists(this)
        this.layouts = new Layouts(this)
        this.medias = new Medias(this)
        this.permissions = new Permissions(this)
        this.widgets = new Widgets(this)
    }

    /**
     * Authenticate in the server with the credentials
     * provided in the class constructor
     */
    public async authenticate(): Promise<boolean> {
        if (this.api.getToken()) return true

        const endPoint = '/authorize/access_token'
        
        const resp = await this.api.postNoEnvelope<
            XiboAuth,
            XiboCredentials
        >(endPoint, this.credentials)

        if (resp.status === 200) {
            this.api.setToken(resp.data.access_token)
            return true
        }
        this.threatError(resp)
    }

    /**
     * Brings information about this API, such as version code
     */
    public async about(): Promise<XiboAbout> {
        return await this.requestGet('/about')
    }

    /**
     * Brings the current CMS time
     */
    public async clock(): Promise<XiboClock> {
        return await this.requestGet('/clock')
    }

    /**
     * Request api to perform a get in the endPoint supplied
     * 
     * @typeParam R - the type of Response expected
     * 
     * @param endPoint - the endPoint address to request a get
     */
    private async requestGet<R>(endPoint: string): Promise<R> {
        const resp = await this.api.get<CMSResponse<R>>(endPoint)
        if (resp.data.success) return resp.data.data
        this.threatError(resp)
    }

    /**
     * Throw errors based on the axios response
     * 
     * @param resp - The failed axios response 
     */
    private threatError(resp: AxiosResponse): never {
        if (resp.data.message) throw new XiboError(resp.data.message)
        throw new XiboError(resp.statusText)
    }
}

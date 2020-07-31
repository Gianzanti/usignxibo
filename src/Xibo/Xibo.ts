import { XiboAPI  } from './XiboAPI'
import { XiboError } from './XiboError'
import { Tags } from './XiboTags'
import { DisplayGroups } from './XiboDisplayGroups'
import { Displays } from './XiboDisplays'
import { Schedules } from './XiboSchedules'
import { XiboCMSResponse } from './XiboComponent'
import { Playlists } from './XiboPlaylist'
import { Layouts } from './XiboLayout'
import { Medias } from './XiboMedia'
import { Permissions } from './XiboPermission'

interface XiboCredentials {
    /** Client ID provided by Application settings in Xibo Server */
    client_id: string;

    /** Client Secret provided by Application settings in Xibo Server */
    client_secret: string;

    /** Grant Type is always client_credentials */
    grant_type: string;
}

interface XiboDTO extends XiboCredentials {
    /** Xibo server url */
    url: string;
}

interface XiboAuth {
    /** Bearer token to use in all requests */
    access_token: string;

    /** Toekn type */
    token_type: string;

    /** Time to expire, in minutes */
    expires_in: number;
}

interface XiboAbout {
    /** Xibo server version */
    version: string;

    /** not used */
    sourceUrl: string;
}

interface XiboClock {
    time: string;
}

export class Xibo {
    public api: XiboAPI;
    private credentials: XiboCredentials;
    public tags: Tags;
    public displaygroups: DisplayGroups
    public displays: Displays
    public schedules: Schedules
    public playlists: Playlists
    public layouts: Layouts
    public medias: Medias
    public permissions: Permissions

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
    }

    /**
     * Authenticate in the server with the credentials
     * provided in the class constructor
     */
    public async authenticate(): Promise<boolean> {
        if (this.api.getToken()) return true

        const endPoint = '/authorize/access_token'
        const resp = await this.api.cleanPost<
            XiboAuth,
            XiboCredentials
        >(endPoint, this.credentials)

        if (resp.status !== 200) {
            if (resp.data.error && resp.data.error.message) {
                throw new XiboError(resp.data.error.message)
            }
            throw new XiboError(resp.statusText)
        }

        if (resp.data.token_type === 'Bearer') {
            this.api.setToken(resp.data.access_token)
            return true
        }

        throw new XiboError('Invalid token')
    }

    /**
     * Brings information about this API, such as version code
     * 
     */
    public async about(): Promise<XiboAbout> {
        return await this.getData('/about')
    }

    /**
     * Brings the current CMS time
     * 
     */
    public async clock(): Promise<XiboClock> {
        return await this.getData('/clock')
    }

    async getData<T>(endPoint: string): Promise<T> {
        const resp = await this.api.get<XiboCMSResponse<T>>(endPoint)
        if (!resp.data.success) {
            if (resp.data.message) {
                throw new XiboError(resp.data.message)
            }
            throw new XiboError(resp.statusText)
        }
        return resp.data.data
    }
}

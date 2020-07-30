import { XiboAPI  } from './XiboAPI'
import { XiboError } from './XiboError'
import { Tags } from './XiboTags'
import { DisplayGroups } from './XiboDisplayGroups'
import { Displays } from './XiboDisplays'
import { Schedules } from './XiboSchedules'
import { XiboCMSResponse } from './XiboComponent'

interface XiboCredentials {
    client_id: string;
    client_secret: string;
    grant_type: string;
}

interface XiboDTO extends XiboCredentials {
    url: string;
}

interface XiboAuth {
    access_token: string;
    token_type: string;
    expires_in: number;
}

interface XiboAbout {
    version: string;
    sourceUrl: string;
}
type XiboAboutResponse = XiboCMSResponse<XiboAbout>

interface XiboClock {
    time: string;
}
type XiboClockResponse = XiboCMSResponse<XiboClock>

export class Xibo {
    public api: XiboAPI;
    private credentials: XiboCredentials;
    public tags: Tags;
    public displaygroups: DisplayGroups
    public displays: Displays
    public schedules: Schedules

    public constructor({ url, ...credentials }: XiboDTO) {
        this.api = new XiboAPI(url)
        this.credentials = credentials
        this.tags = new Tags(this)
        this.displaygroups = new DisplayGroups(this)
        this.displays = new Displays(this)
        this.schedules = new Schedules(this)
    }

    /**
     * Authenticate in the server with the credentials
     * provided in the class constructor if the system hasn't
     * a token yet
     * 
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
        if (!this.api.getToken()) {
            await this.authenticate()
        }

        const endPoint = '/about'
        const resp = await this.api.get<XiboAboutResponse>(endPoint)
        if (!resp.data.success) {
            if (resp.data.message) {
                throw new XiboError(resp.data.message)
            }
            throw new XiboError(resp.statusText)
        }
        return resp.data.data
    }

    /**
     * Brings the current CMS time
     * 
     */
    public async clock(): Promise<XiboClock> {
        if (!this.api.getToken()) {
            await this.authenticate()
        }

        const endPoint = '/clock'
        const resp = await this.api.get<XiboClockResponse>(endPoint)
        if (!resp.data.success) {
            if (resp.data.message) {
                throw new XiboError(resp.data.message)
            }
            throw new XiboError(resp.statusText)
        }
        return resp.data.data
    }
}

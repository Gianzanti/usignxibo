import { XiboAPI, XiboErrorResponse } from './XiboAPI'
import { XiboError } from './XiboError'
import { Tags } from './XiboTags'
import { DisplayGroups } from './XiboDisplayGroups'
import { Displays } from './XiboDisplays'

interface XiboCredentials {
    client_id: string;
    client_secret: string;
    grant_type: string;
}

interface XiboDTO extends XiboCredentials {
    url: string;
}

interface XiboAuthResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

interface XiboAboutResponse {
    version: string;
    sourceUrl: string;
}

interface XiboClockResponse {
    time: string;
}

export class Xibo {
    public api: XiboAPI;
    private credentials: XiboCredentials;
    public tags: Tags;
    public displaygroups: DisplayGroups
    public displays: Displays

    public constructor({ url, ...credentials }: XiboDTO) {
        this.api = new XiboAPI(url)
        this.credentials = credentials
        this.tags = new Tags(this)
        this.displaygroups = new DisplayGroups(this)
        this.displays = new Displays(this)
    }

    public async authenticate(): Promise<void> {
        if (this.api.getToken()) return

        const endPoint = '/authorize/access_token'
        const resp = await this.api.post<
            XiboAuthResponse & XiboErrorResponse,
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
            // console.log('Token setted')
            return
        }

        throw new XiboError('Invalid token')
    }

    public async about(): Promise<XiboAboutResponse> {
        if (!this.api.getToken()) {
            await this.authenticate()
        }

        const endPoint = '/about'
        const resp = await this.api.get<
            XiboAboutResponse & XiboErrorResponse,
            null
        >(endPoint)

        if (resp.status !== 200) {
            if (resp.data.error && resp.data.error.message) {
                throw new XiboError(resp.data.error.message)
            }
            throw new XiboError(resp.statusText)
        }

        //   console.log('Version:', resp.data.version)
        return resp.data
    }

    public async clock(): Promise<XiboClockResponse> {
        if (!this.api.getToken()) {
            await this.authenticate()
        }

        const endPoint = '/clock'
        const resp = await this.api.get<
            XiboClockResponse & XiboErrorResponse,
            null
        >(endPoint)

        if (resp.status !== 200) {
            if (resp.data.error && resp.data.error.message) {
                throw new XiboError(resp.data.error.message)
            }
            throw new XiboError(resp.statusText)
        }
        //   console.log('Clock:', resp.data.time)
        return resp.data
    }
}

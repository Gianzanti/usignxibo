import { XiboAPI, XiboErrorResponse } from './XiboAPI'
import { XiboError } from './XiboError'
import { Tags } from './XiboTags'

interface XiboCredentials {
    'client_id': string;
    'client_secret': string;
    'grant_type': string;
}

interface XiboDTO extends XiboCredentials {
    url: string;
}

interface XiboAuthResponse {
    'access_token': string;
    'token_type': string;
    'expires_in': number;
}

interface XiboAboutResponse {
    version: string,
    sourceUrl: string
}

interface XiboClockResponse {
    time: string
}

export class Xibo {
    public api: XiboAPI;
    private credentials: XiboCredentials;
    public tags: Tags

    public constructor ({ url, ...credentials }: XiboDTO) {
      this.api = new XiboAPI(url)
      this.credentials = credentials
      this.tags = new Tags(this)
    }

    public async authenticate () {
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
        console.log('Token setted')
        return
      }

      throw new XiboError('Invalid token')
    }

    public async about () {
      if (!this.api.getToken()) return

      const endPoint = '/about'
      const resp = await this.api.get<XiboAboutResponse & XiboErrorResponse, null>(endPoint)

      if (resp.status !== 200) {
        if (resp.data.error && resp.data.error.message) {
          throw new XiboError(resp.data.error.message)
        }
        throw new XiboError(resp.statusText)
      }

      console.log('Version:', resp.data.version)
    }

    public async clock () {
      if (!this.api.getToken()) return

      const endPoint = '/clock'
      const resp = await this.api.get<XiboClockResponse & XiboErrorResponse, null>(endPoint)

      if (resp.status !== 200) {
        if (resp.data.error && resp.data.error.message) {
          throw new XiboError(resp.data.error.message)
        }
        throw new XiboError(resp.statusText)
      }

      console.log('Clock:', resp.data.time)
    }
}

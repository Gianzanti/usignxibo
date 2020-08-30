import axios, { AxiosInstance, AxiosPromise } from 'axios'
import qs from 'qs'

interface XiboErrorData {
    [property: string]: string;
}

export interface XiboErrorResponse {
    error: {
        message: string;
        code: number;
        data: XiboErrorData;
    };
}

export class API {
    /** A private instance of AXIOS */
    private ax: AxiosInstance;

    /**
     * Sets the default parameters for the current axios instance
     *
     * @param baseURL - Defines the baseURL that we'll connect to
     */
    public constructor(baseURL: string) {
        this.ax = axios.create({
            baseURL,
            timeout: 10000,
            headers: {
                common: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json'
                },
            },
            validateStatus: (status) => {
                return status < 500
            }
        })

        // this.ax.interceptors.response.use(res => {
        //     // eslint-disable-next-line no-console
        //     console.log(res.request._header)
        //     // eslint-disable-next-line no-console
        //     // console.log(res);
        //     return res;
        // }, error => Promise.reject(error) );

        //   this.ax.interceptors.request.use(config => {
        //     // eslint-disable-next-line no-console
        //     console.log('Request:', config)
        //     return config
        //   }, error => Promise.reject(error))
    }

    public setToken(token: string): void {
        this.ax.defaults.headers.common.Authorization = `Bearer ${token}`
    }

    public getToken(): string {
        return this.ax.defaults.headers.common.Authorization
    }

    public removeToken(): void {
        delete this.ax.defaults.headers.common['Authorization']
    }

    /**
     * Performs a GET action in the provided url with the
     * params as C. The expected response will be of
     * the type provided as R
     * 
     * @typeParam R - Defines the return type
     * @typeParam C - Defines the search criteria type
     * 
     * @param url - the endpoint to point the get action
     * @param criteria - optional criteria to get items
     */
    public get<R, C = null>(url: string, criteria?: C): AxiosPromise<R> {
        const envelope = {
            ...criteria,
            envelope: 1
        }
        return this.ax({
            method: 'GET',
            url: `${url}?${qs.stringify(envelope, { encode: false, skipNulls: true })}`,
        })
    }

    /**
     * Performs a POST action in the provided url with the
     * data of type D. The expected response will be of
     * the type provided as R
     * 
     * @typeParam R - Defines the return type
     * @typeParam D - Defines the type of the data sent
     * 
     * @param url - the endpoint to point the POST action
     * @param data - optional information to send in the POST
     */
    public post<R, D = null>(url: string, data?: D): AxiosPromise<R> {
        return this.ax({
            method: 'POST',
            url,
            params: { envelope: 1 },
            data: qs.stringify(data, { arrayFormat: 'comma' }) || undefined
        })
    }

    /**
     * Performs a clean POST (without envelope) action in the provided url with the
     * data of type D. The expected response will be of
     * the type provided as R
     * 
     * @typeParam R - Defines the return type
     * @typeParam D - Defines the type of the information sent
     * 
     * @param url - the endpoint to point the POST action
     * @param data - optional information to send in the POST
     */
    public postNoEnvelope<R, D = null>(url: string, data?: D): AxiosPromise<R & XiboErrorResponse> {
        return this.ax({
            method: 'POST',
            url,
            data: qs.stringify(data) || undefined
        })
    }

    /**
   * Performs a PUT action in the provided url with the
   * data of type D. The expected response will be of
   * the type provided as R
   * 
   * @typeParam R - Defines the return type
   * @typeParam D - Defines the type of the information sent
   * 
   * @param url - the endpoint to point the PUT action
   * @param data - optional information to send in the PUT
   */
    public put<R, D>(url: string, data: D): AxiosPromise<R> {
        return this.ax({
            method: 'PUT',
            url,
            params: { envelope: 1 },
            data: qs.stringify(data, { arrayFormat: 'comma' })
        })
    }

    /**
   * Performs a DELETE action in the provided url
   * 
   * @typeParam R - Defines the return type
   * @param url - the endpoint to point the PUT action
   */
    public delete<R>(url: string): AxiosPromise<R> {
        return this.ax({
            method: 'DELETE',
            url,
            params: { envelope: 1 },
        })
    }
}

export default API

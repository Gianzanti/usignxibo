import axios, { AxiosInstance, AxiosPromise } from 'axios'
import qs from 'qs'

interface XiboErrorData {
    [property: string]: string ;
}

export interface XiboErrorResponse {
    error: {
        message: string;
        code: number;
        data: XiboErrorData;
    };
}

export class XiboAPI {
    /** A private instance of AXIOS */
    private ax: AxiosInstance;

    /** A model to set the token as a header in the
     * current axios call
     * */
    // private headerToken = {
    //     common: {
    //         Authorization: ''
    //     }
    // };

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
        // this.headerToken.common.Authorization = `Bearer ${token}`
        this.ax.defaults.headers.common.Authorization = `Bearer ${token}`
    }

    public getToken(): string {
        // return this.headerToken.common.Authorization
        return this.ax.defaults.headers.common.Authorization
    }

    public removeToken(): void {
        delete this.ax.defaults.headers.common['Authorization']
        // this.headerToken.common.Authorization = ''
    }

    /**
     * Performs a GET action in the provided url with the
     * params as TCriteria. The expected response will be of
     * the type provided as TReturn
     * @typeParam TReturn - Defines the return type
     * @typeParam TCriteria - Defines the search criteria type
     * @param url - the endpoint to point the get action
     * @param criteria - optional criteria to get items
     */
    public get<TReturn, TCriteria = null>(url: string, criteria?: TCriteria): AxiosPromise<TReturn> {
        const envelope = {
            ...criteria,
            envelope: 1
        }
        return this.ax({
            // headers: this.headerToken,
            method: 'GET',
            url,
            params: envelope
        })
    }

    /**
     * Performs a POST action in the provided url with the
     * data of type TData. The expected response will be of
     * the type provided as TReturn
     * @typeParam TReturn - Defines the return type
     * @typeParam TData - Defines the type of the data sent
     * @param url - the endpoint to point the POST action
     * @param data - optional information to send in the POST
     * @returns Returns an Axios Promise of `TReturn`
     */
    public post<TReturn, TData = null>(url: string, data?: TData): AxiosPromise<TReturn> {
        const envelope = {
            envelope: 1
        }
        return this.ax({
            // headers: this.headerToken,
            method: 'POST',
            url,
            params: envelope,
            data: qs.stringify(data, { arrayFormat: 'comma' }) || undefined
        })
    }

    /**
     * Performs a clean POST action in the provided url with the
     * data of type TData. The expected response will be of
     * the type provided as TReturn
     * @typeParam TReturn - Defines the return type
     * @typeParam TData - Defines the type of the information sent
     * @param url - the endpoint to point the POST action
     * @param data - optional information to send in the POST
     */
    public cleanPost<TReturn, TData = null>(url: string, data?: TData): AxiosPromise<TReturn & XiboErrorResponse> {
        return this.ax({
            // headers: this.headerToken,
            method: 'POST',
            url,
            data: qs.stringify(data) || undefined
        })
    }

    /**
   * Performs a PUT action in the provided url with the
   * data of type TData. The expected response will be of
   * the type provided as TReturn
   * @typeParam TReturn - Defines the return type
   * @typeParam TData - Defines the type of the information sent
   * @param url - the endpoint to point the PUT action
   * @param data - optional information to send in the PUT
   */
    public put<TReturn, TData>(url: string, data: TData): AxiosPromise<TReturn> {
        const envelope = {
            envelope: 1
        }
        return this.ax({
            // headers: this.headerToken,
            method: 'PUT',
            url,
            params: envelope,
            data: qs.stringify(data, { arrayFormat: 'comma' }) || undefined
        })
    }

    /**
   * Performs a DELETE action in the provided url
   * @typeParam TReturn - Defines the return type
   * @param url - the endpoint to point the PUT action
   */
    public delete<TReturn>(url: string): AxiosPromise<TReturn> {
        return this.ax({
            // headers: this.headerToken,
            method: 'DELETE',
            url,
            params: {envelope:1},
        })
    }
}

export default XiboAPI

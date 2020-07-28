import axios, { AxiosInstance, AxiosPromise } from 'axios'
import FormData from 'form-data'
import qs from 'qs'

export interface XiboErrorResponse {
    error: {
        message: string;
        code: number;
        data: string[];
    };
}

export class XiboAPI {
    /** A private instance of AXIOS */
    private ax: AxiosInstance;

    /** A model to set the token as a header in the
     * current axios call
     * */
    private headerToken = {
        common: {
            Authorization: ''
        }
    };

    /**
     * Sets the default parameters for the current axios instance
     *
     * @param baseURL Defines the baseURL that we'll connect to
     */
    public constructor(baseURL: string) {
        this.ax = axios.create({
            baseURL,
            timeout: 10000,
            headers: {
                common: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                post: {
                    'Content-Type': 'multipart/form-data'
                },
                put: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
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
        this.headerToken.common.Authorization = `Bearer ${token}`
    }

    public getToken(): string {
        return this.headerToken.common.Authorization
    }

    public removeToken(): void {
        this.headerToken.common.Authorization = ''
    }

    /**
     * Performs a GET action in the provided url with the
     * params as Criteria. The expected response will be of
     * the type provided as R
     * @template R Defines the return type
     * @param url the endpoint to point the get action
     * @param criteria optional criteria to get items
     */
    public get<R, C>(url: string, criteria?: C): AxiosPromise<R> {
        // public get<R> (url: string, criteria?: Criteria): AxiosPromise<R> {
        return this.ax({
            headers: {
                ...this.headerToken
            },
            method: 'GET',
            url,
            params: criteria || undefined
        })
    }

    /**
     * Performs a POST action in the provided url with the
     * data of type P. The expected response will be of
     * the type provided as R
     * @template R Defines the return type
     * @template P Defines the type of the information sent
     * @param url the endpoint to point the POST action
     * @param data optional information to send in the POST
     */
    public post<R, P>(url: string, data?: P): AxiosPromise<R> {
        const formData = new FormData()
        if (data) {
            Object.getOwnPropertyNames(data).forEach(key => {
                if (Array.isArray(data[key])) {
                    formData.append(key, data[key].toString())
                } else {
                    formData.append(key, data[key])
                }
            })
        }

        return this.ax({
            headers: {
                ...this.headerToken,
                ...formData.getHeaders()
            },
            method: 'POST',
            url,
            data: formData || undefined
        })
    }

    /**
   * Performs a PUT action in the provided url with the
   * data of type P. The expected response will be of
   * the type provided as R
   * @template R Defines the return type
   * @template P Defines the type of the information sent
   * @param url the endpoint to point the PUT action
   * @param data optional information to send in the PUT
   */
    public put<R, P>(url: string, data: P): AxiosPromise<R> {
        return this.ax({
            headers: this.headerToken,
            method: 'PUT',
            url,
            data: qs.stringify(data) || undefined
        })
    }

    // /**
    //  * Performs a PUT action in the provided url. This method is
    //  * used only to perform upload of files to a server using
    //  * REST API
    //  * @template R Defines the return type
    //  * @param url the endpoint to point the PUT action
    //  * @param newHeader define the additional information to put it
    //  * the request header to performe the desired action
    //  * @param data the file chunck to upload
    //  */
    // public putFile<R> (url: string, newHeader: ScalaUploadHeader, data: Buffer): AxiosPromise<R> {
    //   return this.ax({
    //     headers: { ...this.headerToken, ...newHeader },
    //     method: 'PUT',
    //     url,
    //     data,
    //     timeout: 0,
    //     maxContentLength: Infinity
    //   })
    // }

    /**
   * Performs a DELETE action in the provided url
   * @template R Defines the return type
   * @param url the endpoint to point the PUT action
   */
    public delete<R>(url: string): AxiosPromise<R> {
        return this.ax({
            headers: this.headerToken,
            method: 'DELETE',
            url
        })
    }
}

export default XiboAPI

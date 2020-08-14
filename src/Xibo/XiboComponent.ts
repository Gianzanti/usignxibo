/* eslint-disable no-undef */
import { Xibo } from './Xibo'
import { XiboError } from './XiboError'
import { AxiosResponse } from 'axios'

export interface Pagination {
    /** The first index to perform the search. Use for pagination */
    start?: number;

    /** Limit search result. Default is 10 items */
    length?: number;
}

export interface CMSData<T> {
    draw: number;
    recordsTotal: number;
    recordsFiltered: number;
    data: T[];
}

export interface CMSResponse<T>{
    grid: boolean;
    success: boolean;
    status: number;
    message: string;
    id: number;
    data: T;
}

export interface USignResponse<T> {
    /** List of items of type T */
    data: T[];
    /** Shows the current page based on limit items defined on criteria */
    page: number;
    /** Shows the totalPages of items, based on limit */
    pages: number;
    /** totalRecords */
    total: number;
}

export interface XiboComponentDTO {
    /** An instace of Xibo Server connection */
    server: Xibo;
    /** the default endPoint for current component */
    endPoint: string;
}

/**
 * An abstract class to share methods and properties between
 * all the Xibo components available.
 * To instantiate it is necessary to supply 3 types:
 * @typeparam R - Defines the return type of the get, list, insert and update methods
 * @typeparam C - Defines the criterias to search component
 * @typeparam I - Defines the type of the argument for the insert method
 */
export abstract class XiboComponent<R, C, I> {

    protected server: Xibo;

    protected endpoint: string;

    public constructor({server, endPoint}: XiboComponentDTO) {
        this.server = server
        this.endpoint = endPoint
    }

    /**
     * Some Xibo API methods returns data that require
     * transformations to be used. This method must be overided 
     * to allow correct transformations, otherwise it just
     * returns the data supplied
     * 
     * @param data - the data to be transformed
     */
    protected transformData(data: R): R {
        return data
    }

    /**
     * Mount the response to uSign, in the desired format
     * 
     * @param resp - a response from axios
     * @param offset - the current data offset
     * @param pageSize - the current pageSize
     */
    private mountUSignResponse(resp: CMSResponse<CMSData<R>>, offset = 0, pageSize = 10): USignResponse<R> {
        const totalRecords = resp.data.recordsFiltered
        const currentRecords = resp.data.data.length
        const page = Math.ceil((offset + currentRecords) / pageSize)
        const pages = Math.ceil(totalRecords / pageSize)
        return {
            data: resp.data.data.map( dado => this.transformData(dado)),
            pages,
            page,
            total: totalRecords
        }
    }

    /**
     * Request api to perform a get in the supplied endPoint
     * 
     * All responses from Xibo are expected to be of type
     * CMSResponse because it always has the envelope mode 
     * enabled. The data in the CMSResponse if of type R
     * 
     * The return is an object of type USignResponse<R>
     * 
     * @param criteria - the criteria to search the data
     * @param endPoint - the default endPoint is defined in the constructor
     *                   but if needed could be passed another
     */
    public async list(criteria?: C & Pagination, endPoint?: string): Promise<USignResponse<R>> {
        //   const crit = criteria || { length: 10 }
        // TODO: ensure that the criteria.limit is lower than desired
        const ep = endPoint || this.endpoint
        const resp = await this.server.api.get<CMSResponse<CMSData<R>>, C & Pagination>(ep, criteria)
        if (resp.data.success) {
            if (resp.data.grid) {
                return this.mountUSignResponse(resp.data, criteria && criteria.start, criteria && criteria.length)
            } else {
                // return new format
                console.log('Schedule:', JSON.stringify(resp.data, null, 2))
                return this.mountScheduleResponse(resp.data, criteria && criteria.start, criteria && criteria.length)
            }
        }
        this.threatError(resp)
    }

    /**
     * Request api to perform an insert in the supplied endPoint
     * 
     * All responses from Xibo are expected to be of type
     * CMSResponse because it always has the envelope mode 
     * enabled. The data in the CMSResponse if of type R
     * 
     * The return is an object of type R
     * 
     * @param content - the component data to insert
     */
    public async insert(content: I): Promise<R> {
        const resp = await this.server.api.post<CMSResponse<R>, I>(this.endpoint, content)
        if (resp.data.success) {
            console.log('Insert:', resp.data.message)
            return this.transformData(resp.data.data)
        }
        this.threatError(resp)
    }


    /**
     * Request api to perform an update in the supplied endPoint
     * 
     * All responses from Xibo are expected to be of type
     * CMSResponse because it always has the envelope mode 
     * enabled. The data in the CMSResponse if of type R
     * 
     * The return is an object of type R
     * 
     * @param id - the component ID to update
     * @param content - the complete component data to update, XiboCMS
     *                  always expect all data to update the component
     *                  not only the data updated
     */
    public async update(id: number, content: R & I): Promise<R> {
        const url = `${this.endpoint}/${id}`
        const resp = await this.server.api.put<CMSResponse<R>, I>(url, content)
        if (resp.data.success) {
            console.log('Update:', resp.data.message)
            return this.transformData(resp.data.data)
        }
        this.threatError(resp)
    }


    /**
     * Request api to perform a delete in the supplied endPoint
     * 
     * All responses from Xibo are expected to be of type
     * CMSResponse because it always has the envelope mode 
     * enabled. The data in the CMSResponse if of type R
     * 
     * @param id - the component ID to remove
     */
    public async remove(id: number): Promise<void> {
        const url = `${this.endpoint}/${id}`
        const resp = await this.server.api.delete<CMSResponse<R>>(url)
        if (resp.data.success) {
            console.log('Remove: ', resp.data.message)
            return
        }
        this.threatError(resp)
    }

    /**
     * Throw errors based on the axios response
     * 
     * @param resp - The failed axios response 
     */
    protected threatError(resp: AxiosResponse): never {
        console.log('Error:', resp.data.message)
        if (resp.data.message) throw new XiboError(resp.data.message)
        throw new XiboError(resp.statusText)
    }
}


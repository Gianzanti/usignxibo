import { Xibo } from './Xibo'
import { XiboError } from './XiboError'
/**
 * Interface used to define a criteria for filtering/searching/getting
 * a list of Scala components
 */
export interface Criteria {
    /** Limit search result. Default is 10 items */
    length?: number;

    /** The first index to perform the search. Use for pagination */
    start?: number;
}

export interface XiboCMSData<T> {
    draw: number;
    recordsTotal: number;
    recordsFiltered: number;
    data: T[];
}

export interface XiboCMSResponse<T>{
    grid: boolean;
    success: boolean;
    status: number;
    message: string;
    id: number;
    data: T;
}

export interface XiboResponse<T> {
    /** List of items of type T */
    list: T[];

    /** Offset of the results. It's the same value of the offset passed on
     * from request parameter
     */
    start: number;

    /** Total records without any filtering/limits */
    count: number;

    /** Shows the current page based on limit items defined on criteria */
    currentPage: number;

    /** Shows the totalPages of items, based on limit */
    totalPages: number;

    /** Defines if current page is the last page of the set */
    isLastPage: boolean;

    /** A method to navigate between pages of the resultset */
    nextPage?: () => Promise<XiboResponse<T>>;
}


interface XiboCredentials {
    client_id: string;
    client_secret: string;
    grant_type: string;
}

export interface XiboComponentDTO {
    endPoint: string;
    server: Xibo;
}


/**
 * An abstract class to share methods and properties between
 * all the Xibo components available.
 * To instantiate it is necessary to supply 3 types:
 * @template T Defines the return type of the get, list, insert and update methods
 * @template C Defines the criterias to search component
 * @template V Defines the type of the argument for the insert method
 */
export abstract class XiboComponent<T, C, V> {
    // /** Maximun limit allowed on Mjolnir */
    // public static readonly limitTotal: number = 100;

    protected server: Xibo;

    protected endpoint: string;

    public constructor(props: XiboComponentDTO) {
        this.endpoint = props.endPoint
        this.server = props.server
    }

    public async list(criteria?: C & Criteria, url?: string): Promise<XiboResponse<T>> {
        //   const crit = criteria || { length: 10 }
        // TODO: ensure that the criteria.limit is lower than desired
        const ep = url || this.endpoint
        const resp = await this.server.api.get<XiboCMSResponse<XiboCMSData<T>>, C & Criteria>(ep, criteria)
        if (!resp.data.success) {
            if (resp.data.message) {
                throw new XiboError(resp.data.message)
            }
            throw new XiboError(resp.statusText)
        }

        const totalRecords = resp.data.data.recordsFiltered
        const currentRecords = resp.data.data.data.length
        const start = (criteria && criteria.start) ? criteria.start : 0
        const limit = (criteria && criteria.length) ? criteria.length : 10

        const currentPage = Math.ceil((start + currentRecords) / limit)
        const totalPages = Math.ceil(totalRecords / limit)
        const isLastPage = totalPages === currentPage
        let newCriteria: C & Criteria
        if (criteria) {
            newCriteria = criteria
            newCriteria.start = criteria.start || 0
            newCriteria.start = newCriteria.start + (newCriteria.length ? newCriteria.length : 10)
        }

        const ret: XiboResponse<T> = {
            list: resp.data.data.data,
            start: start,
            count: totalRecords,
            totalPages,
            currentPage,
            isLastPage,
            nextPage: !isLastPage
                ? async (): Promise<XiboResponse<T>> => {
                    return this.list(newCriteria)
                }
                : undefined
        }
        return ret
    }

    public async insert(content: V): Promise<T> {
        const resp = await this.server.api.post<XiboCMSResponse<T>, V>(this.endpoint, content)
        if (!resp.data.success) {
            if (resp.data.message) {
                throw new XiboError(resp.data.message)
            }
            throw new XiboError(resp.statusText)
        }
        // console.log(resp.data.message)
        return resp.data.data
    }

    public async update(id: number, content: T & V): Promise<T> {
        const url = `${this.endpoint}/${id}`
        const resp = await this.server.api.put<XiboCMSResponse<T>, V>(url, content)
        if (!resp.data.success) {
            if (resp.data.message) {
                throw new XiboError(resp.data.message)
            }
            throw new XiboError(resp.statusText)
        }
        // console.log(resp.data.message)
        return resp.data.data
    }

    public async remove(id: number): Promise<boolean> {
        const url = `${this.endpoint}/${id}`
        const resp = await this.server.api.delete<XiboCMSResponse<T>>(url)
        if (!resp.data.success) {
            if (resp.data.message) {
                throw new XiboError(resp.data.message)
            }
            throw new XiboError(resp.statusText)
        }
        // console.log(resp.data.message)
        return true
    }
}

/* Sorting process
* ?columns[][name]=layout
You then provide an order parameter, which contains a set of sort orders,
referencing the keys in the columns parameter - e.g.
&order[][column]=1&order[][dir]=desc
**/

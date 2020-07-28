import { Xibo } from './Xibo'
import { XiboError } from './XiboError'
// import { XiboErrorResponse, ScalaUpdateResponse } from './ScalaAPI'
import { XiboErrorResponse } from './XiboAPI'
/**
 * Interface used to define a criteria for filtering/searching/getting
 * a list of Scala components
 */
export interface Criteria {
    /** Limit search result. Default is 10 items */
    length?: number;

    /** The first index to perform the search. Use for pagination */
    start?: number;

    // /** Comma separated list of fields to sort by. Use - sign (minus sign)
    //  * to identify the column should be sort by descending order.
    //  */
    // sort?: string;

    // listOnly?: boolean;

    // /** A comma separated list of fields you want to include on the response object.
    //  * Note: The field ID always be included as part of the response object
    //  */
    // fields?: string;

    // /** One or more filters to be applied with the following comparators:
    //  * eq (=), ne (!=), ge (>=), le (<=), gt (>), lt (<), in, like
    //  * @sample `{name : {values:['test%', '%xmas%'], comparator : 'like'}}`
    //  */
    // filters?: object;

    // /** A string that the user wants to search for.
    //  * The system will search for media items with names or descriptions
    //  * containing that string.
    //  */
    // search?: string;
}

/** A personalized response interface for the list methods for Mjolnir API, that
 * extends the ScalaListResponse and adds to it the currentPage, totalPages and
 * isLastPage properties, defined by the current limit and a method (nextPage) to
 * navigate between pages.
 */
export interface XiboCMSResponse<T> {
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
    nextPage?: () => Promise<XiboCMSResponse<T>>;
}

// const getParams = (keyword: string, url:string) => {
//   const key = keyword.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
//   const regex = new RegExp(key + '=([^&#]*)')
//   const results = regex.exec(url)
//   return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
// }

/**
 * An abstract class to share methods and properties between
 * all the Scala components available.
 * To instantiate it is necessary to supply 3 types:
 * @template T Defines the return type of the get, list, insert and update methods
 * @template C Defines the criterias to search component
 * @template U Defines the return type of getUsage method
 * @template V Defines the type of the argument for the insert method
 */
export abstract class XiboComponent<T, C, U, V> {
    // /** Maximun limit allowed on Mjolnir */
    // public static readonly limitTotal: number = 100;

    protected server: Xibo;

    protected endpoint: string;

    public constructor(endpoint: string, server: Xibo) {
        this.endpoint = endpoint
        this.server = server
    }

    // /**
    //  * Gets all the information about the component of type T
    //  * @param id index of componet desired to get information
    //  * @template T Defines the return type of the get, list, insert and update methods
    //  * @return {T} A generic component of type {T}
    //  */
    // public async get (id: number): Promise<T> {
    //   const url = `${this.endpoint}/${id}`
    //   const resp = await this.server.api.get<T & XiboErrorResponse>(url)
    //   if (resp.status !== 200) {
    //     if (resp.data.error && resp.data.error.message) {
    //       throw new XiboError(resp.data.error.message)
    //     }
    //     throw new XiboError(resp.statusText)
    //   }
    //   return this.mount(resp.data)
    // }

    public async list(criteria?: C & Criteria): Promise<XiboCMSResponse<T>> {
        //   const crit = criteria || { length: 10 }
        // TODO: ensure that the criteria.limit is lower than desired

        const resp = await this.server.api.get<T[] & XiboErrorResponse, C>(this.endpoint, criteria)
        if (resp.status !== 200) {
            if (resp.data.error && resp.data.error.message) {
                throw new XiboError(resp.data.error.message)
            }
            throw new XiboError(resp.statusText)
        }

        const count = parseInt(resp.headers['x-total-count'])
        const start = (criteria && criteria.start) ? criteria.start : 0
        const limit = (criteria && criteria.length) ? criteria.length : 10
        const currentPage = Math.floor(start / limit) + 1
        const totalPages = Math.floor(count / limit) + 1
        const isLastPage = totalPages === currentPage
        const newCriteria = criteria
        newCriteria.start = criteria?.start + newCriteria?.length

        const ret: XiboCMSResponse<T> = {
            list: resp.data,
            start: start,
            count: count,
            totalPages,
            currentPage,
            isLastPage,
            nextPage: !isLastPage
                ? async (): Promise<XiboCMSResponse<T>> => {
                    return this.list(newCriteria)
                }
                : undefined
        }

        return ret
    }

    public async insert(content: V): Promise<T> {
        const resp = await this.server.api.post<T & XiboErrorResponse, V>(this.endpoint, content)
        if (resp.status !== 201) {
            if (resp.data.error && resp.data.error.message) {
                throw new XiboError(resp.data.error.message)
            }
            throw new XiboError(resp.statusText)
        }
        return resp.data
    }

    public async update(id: number, content: V): Promise<T> {
        const url = `${this.endpoint}/${id}`
        const resp = await this.server.api.put<T & XiboErrorResponse, V>(url, content)
        if (resp.status !== 201) {
            if (resp.data.error && resp.data.error.message) {
                throw new XiboError(resp.data.error.message)
            }
            throw new XiboError(resp.statusText)
        }
        return resp.data
    }

    public async remove(id: number): Promise<boolean> {
        const url = `${this.endpoint}/${id}`
        const resp = await this.server.api.delete<XiboErrorResponse>(url)
        if (resp.status !== 204) {
            if (resp.data.error && resp.data.error.message) {
                throw new XiboError(resp.data.error.message)
            }
            throw new XiboError(resp.statusText)
        }
        return true
    }

    // public async getUsage (id: number): Promise<U> {
    //   const url = `${this.endpoint}/usage?ids=${id}`
    //   const resp = await this.server.api.get<U & XiboErrorResponse>(url)
    //   if (resp.status !== 200) {
    //     if (resp.data.error && resp.data.error.message) {
    //       throw new XiboError(resp.data.error.message)
    //     }
    //     throw new XiboError(resp.statusText)
    //   }
    //   return resp.data
    // }

    // eslint-disable-next-line class-methods-use-this
    // public mount (scalaComp: T): T {
    //   return scalaComp
    // }
}

/* Sorting process
* ?columns[][name]=layout
You then provide an order parameter, which contains a set of sort orders,
referencing the keys in the columns parameter - e.g.
&order[][column]=1&order[][dir]=desc
**/

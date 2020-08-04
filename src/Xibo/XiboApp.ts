/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/camelcase */
import { Xibo, XiboDef } from './Xibo'
import { v4 as uuidv4 } from 'uuid'

const client_id = 'ZadAUKOUuUOuozo1XEPrYW1vZz5hBwgO0ElzWxpa'
const client_secret = 'IKEAfUOtyvuBU6DNjkALSPJfQbdgsxatx4XHjVn60uPFIotAAOaiehvs5FIJf2QZ9xQhIrATxsHEj3XskhT9Cfw8xWkC8u84om4czWTvWNhTBBIre2efyvHLrI898NeKGA5FJTVeAQgi0vRRTLls4meogRy8cnRzDmKWIHPyr9d4igyrkk4DtI9e9Q4OaBu9LShEtHxW1bdVwc8dwbjNspURKf27aket0Xkr0sAB92gjaGizyhCsFPpGiatQHS'
const clientURL = 'https://wide.ds-cloud.io/api'
// const client_id = context.constants.XiboClientID
// const client_secret = context.constants.XiboClientSecret
// const clientURL = context.constants.XiboURL

interface USignPage {
    data: Array<any>;
    page: number;
    pages: number;
}

interface xiboConnection {
    url: string;
    client_id: string;
    client_secret: string;
}

interface USignContext<TCriteria> {
    pageSize: number;
    page: number;
    resolve(msg: string): void;
    query?: TCriteria;
    sorted?: any;
}

export const xb = async (conn: xiboConnection): Promise<Xibo | undefined> => {
    const proxy = 'https://corsproxy.usign.io/'
    const url = (typeof window !== 'undefined') ? `${proxy}${conn.url}` : conn.url

    try {
        const xibo = new Xibo({
            url,
            client_id: conn.client_id,
            client_secret: conn.client_secret,
            grant_type: 'client_credentials'
        })
        if (await xibo.authenticate()) {
            return xibo
        }
    } catch (e) {
        console.error(`${e.name}: ${e.message}`)
    }
    return undefined
}

export const getList = async <TCriteria>(xibo: Xibo, mediaType: keyof XiboDef, context: USignContext<TCriteria>, debug = false): Promise<USignPage> => {
    try {
        // await xibo.authenticate()
        // console.log('Xibo CMS Time:', (await xibo.clock()).time)
        if (debug) {
            console.log('Xibo Version:', (await xibo.about()).version)
        }


        const length = context.pageSize
        const start = (context.page - 1) * context.pageSize
        let query = undefined
        if (context.query) {
            query = {
                [Object.keys(context.query)[0] as string]: context.query[Object.keys(context.query)[0]]
            }
        }
        let sort = undefined
        if (context.sorted) {
            const dir = context.sorted[Object.keys(context.sorted)[0]] === 1 ? 'asc' : 'desc'
            sort = {
                columns: [ null, { data: Object.keys(context.sorted)[0] } ],
                order: [ null, { column: 1, dir: dir } ]
            }
        }
        // envelope=1&columns[1][data]=clientType&order[1][column]=1&order[1][dir]=asc
        const criteria = {
            length, 
            start,
            ...query,
            ...sort
        }
        console.log(JSON.stringify(criteria, null, 2))

        const dados = await xibo[mediaType].list(criteria)
        
        if (debug) {
            console.log('Dados:', dados)
        }

        return {
            data: dados.list,
            page: dados.currentPage,
            pages: dados.totalPages,
        }

    } catch (e) {
        console.error(`${e.name}: ${e.message}`)
        return {
            data: [],
            page: 0,
            pages: 0,
        }
    }
}


export const testTags = async (xibo: Xibo): Promise<void> => {
    let tags = await xibo.tags.list()
    console.log(JSON.stringify(tags, null, 2))

    while (!tags.isLastPage) {
        if (tags.nextPage) {
            tags = await tags.nextPage()
            console.log(JSON.stringify(tags, null, 2))
        }
    }

    const tagToInsert = {
        name: `TagByAPI_${uuidv4()}`,
        isRequired: 0,
        options: ['some', 'options', 'comma', 'separated']
    }
    const inserted = await xibo.tags.insert(tagToInsert)
    console.log('Inserted:', inserted)
    // console.log('ID of new tag:', inserted.tagId)

    const newTag = {
        ...inserted,
        name: `ChangedByAPI_${uuidv4()}`
    }

    const toUpdate = await xibo.tags.update(newTag.tagId, newTag)
    console.log('Updated:', toUpdate)
    // console.log('ID of new tag:', toUpdate.tagId)

    // const deleted = await xibo.tags.remove(toUpdate.tagId)
    // console.log('Deleted:', deleted)
}
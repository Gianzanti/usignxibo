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

const proxy = 'https://corsproxy.usign.io/'
const url = (typeof window !== 'undefined') ? `${proxy}${clientURL}` : clientURL

interface USignPage {
    data: Array<any>;
    page: number;
    pages: number;
}

const xibo = new Xibo({
    url,
    client_id,
    client_secret,
    grant_type: 'client_credentials'
})

export const getList = async (mediaType: keyof XiboDef): Promise<USignPage> => {
    // console.log('Context:', JSON.stringify(context, null, 2))
    // console.log('Constants:', JSON.stringify(context.constants, null, 2))
    // console.log('MediaType:', mediaType)

    try {
        await xibo.authenticate()
        // console.log('Xibo Version:', (await xibo.about()).version)
        // console.log('Xibo CMS Time:', (await xibo.clock()).time)

        const dados = await xibo[mediaType].list({
            length: 5, 
            start: 0
        })
        
        // console.log('Dados:', dados)

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


export const testTags = async (): Promise<void> => {
    await xibo.authenticate()
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
    // console.log('Inserted:', inserted)
    console.log('ID of new tag:', inserted.tagId)

    const newTag = {
        ...inserted,
        name: `ChangedByAPI_${uuidv4()}`
    }

    const toUpdate = await xibo.tags.update(newTag.tagId, newTag)
    // console.log('Updated:', toUpdate)
    console.log('ID of new tag:', toUpdate.tagId)

    // const deleted = await xibo.tags.remove(toUpdate.tagId)
    // console.log('Deleted:', deleted)
}
import { Xibo } from '../Xibo'
import { TagInsert } from '../tags'
import { v4 as uuidv4 } from 'uuid'

interface XiboConnection {
    url: string;
    client_id: string;
    client_secret: string;
}

export const xb = async (conn: XiboConnection): Promise<Xibo | undefined> => {
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

export const testTags = async (xibo: Xibo): Promise<void> => {
    const tags = await xibo.tags.list()
    console.log(JSON.stringify(tags, null, 2))

    const tagToInsert: TagInsert = {
        name: `TagByAPI_${uuidv4()}`,
        isRequired: 0,
        options: ['some', 'options', 'comma', 'separated']
    }
    const inserted = await xibo.tags.insert(tagToInsert)

    const newTag = {
        ...inserted,
        name: `ChangedByAPI_${uuidv4()}`,
        options: ['some', 'options']
    }
    const updated = await inserted.save(newTag)
    console.log('Updated:', updated)
    const removed = await updated.delete()
    console.log('Removed:', removed)

    // const toUpdate = await xibo.tags.update(newTag.tagId, newTag)
    // // console.log('Updated:', toUpdate)

    // await xibo.tags.remove(toUpdate.tagId)
    // // console.log('Deleted:', deleted)
}
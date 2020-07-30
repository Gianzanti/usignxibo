import { Xibo } from './Xibo'
import { v4 as uuidv4 } from 'uuid'

const proxy = 'https://corsproxy.usign.io/'
let xiboURL = 'https://wide.ds-cloud.io/api'
if (typeof window !== 'undefined') {
    xiboURL = `${proxy}${xiboURL}`
}

const xiboID = 'ZadAUKOUuUOuozo1XEPrYW1vZz5hBwgO0ElzWxpa'
const xiboSecret = 'qBSTVHctGzkBmb88DMYmDGrpLinvbGyqcOj0KTN8bmv7zlmcgXPXdS9fF6chxy3wqUHcyKOHwa2IT0gYG4982uNXGeNDoBrAxmqhGvGNtRfhyslfbeyqo4V9BBibcaniVbuc5FzKgBK3vtrqWiIx3ZKOb86TYGcA8wo2seb3iyDMygWGuucvXdgHbtwDWmiM8JsPEfIi9IBiAltI8yivsASORucQuLFudoUpIsXRbAa5Bel9F3j6KK2OpUCObQ'

const testTags = async (xibo: Xibo): Promise<void> => {
        let tags = await xibo.tags.list({length: 2})
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
        console.log('ID of new tag:', toUpdate.tagId)

        const deleted = await xibo.tags.remove(toUpdate.tagId)
        console.log('Deleted:', deleted)
}

const run = async (): Promise<void> => {
    const xibo = new Xibo({
        url: xiboURL,
        'client_id': xiboID,
        'client_secret': xiboSecret,
        'grant_type': 'client_credentials'
    })

    try {
        // await xibo.authenticate()
        console.log('Xibo Version:', (await xibo.about()).version)
        console.log('Xibo CMS Time:', (await xibo.clock()).time)

        // testTags(xibo)



        // const dgList = await xibo.displaygroups.list({displayGroup: 'jbtec'})
        // console.log('DisplayGroups:', dgList)

        // const dgId = dgList.list[0].displayGroupId
        // console.log('DisplayGroupID:', dgId)

        // const ds = await xibo.displays.list({displayGroupId: dgId})
        // console.log('Displays:', ds)

        const sch = await xibo.schedules.listEvents({displayGroupId: 6, date: '2020-07-30 00:00:00'})
        console.log('Schedule:', sch.list)



    } catch (e) {
        console.error(`${e.name}: ${e.message}`)
    }
}

run()

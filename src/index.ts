import { Xibo } from './Xibo'
import { TagInsert } from './XiboTags'

const xiboURL = 'https://wide.ds-cloud.io/api'
const xiboID = 'ZadAUKOUuUOuozo1XEPrYW1vZz5hBwgO0ElzWxpa'
const xiboSecret = 'qBSTVHctGzkBmb88DMYmDGrpLinvbGyqcOj0KTN8bmv7zlmcgXPXdS9fF6chxy3wqUHcyKOHwa2IT0gYG4982uNXGeNDoBrAxmqhGvGNtRfhyslfbeyqo4V9BBibcaniVbuc5FzKgBK3vtrqWiIx3ZKOb86TYGcA8wo2seb3iyDMygWGuucvXdgHbtwDWmiM8JsPEfIi9IBiAltI8yivsASORucQuLFudoUpIsXRbAa5Bel9F3j6KK2OpUCObQ'

const main = async (): Promise<void> => {
    const xibo = new Xibo({
        url: xiboURL,
        'client_id': xiboID,
        'client_secret': xiboSecret,
        'grant_type': 'client_credentials'
    })

    try {
        await xibo.authenticate()
        await xibo.about()
        await xibo.clock()
        await xibo.tags.list({ tagId: 4 })

        const tagToInsert: TagInsert = {
            name: 'TagInsertedByAPI2',
            isRequired: 1
            //   options: ['some', 'options', 'comma', 'separated']
            // TODO: need to fix dealing with arrays
        }
        const inserted = await xibo.tags.insert(tagToInsert)
        console.log('Inserted:', inserted)
        // console.log('ID of new tag:', inserted.tagId)

        const newTag = {
            ...inserted,
            name: 'ChangedByAPIfromVSCode2'
        }

        const toUpdate = await xibo.tags.update(newTag.tagId, newTag)
        console.log('Updated:', toUpdate)
        console.log('ID of new tag:', toUpdate.tagId)

        const deleted = await xibo.tags.remove(toUpdate.tagId)
        console.log('Deleted:', deleted)
    } catch (e) {
        console.log(e)
    }
}

main()

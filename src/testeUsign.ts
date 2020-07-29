import { Xibo } from 'Xibo'

const { resolve, reject } = context;

const xiboURL = 'https://wide.ds-cloud.io/api'
const xiboID = 'ZadAUKOUuUOuozo1XEPrYW1vZz5hBwgO0ElzWxpa'
const xiboSecret = 'qBSTVHctGzkBmb88DMYmDGrpLinvbGyqcOj0KTN8bmv7zlmcgXPXdS9fF6chxy3wqUHcyKOHwa2IT0gYG4982uNXGeNDoBrAxmqhGvGNtRfhyslfbeyqo4V9BBibcaniVbuc5FzKgBK3vtrqWiIx3ZKOb86TYGcA8wo2seb3iyDMygWGuucvXdgHbtwDWmiM8JsPEfIi9IBiAltI8yivsASORucQuLFudoUpIsXRbAa5Bel9F3j6KK2OpUCObQ'


async function run(): Promise<void> {

    const xibo = new Xibo({
        url: xiboURL,
        'client_id': xiboID,
        'client_secret': xiboSecret,
        'grant_type': 'client_credentials'
    })

    try {
        await xibo.authenticate()
        const dgList = await xibo.displaygroups.list({displayGroup: 'jbtec'})
        // console.log('DisplayGroups:', dgList)

        const dgId = dgList.list[0].displayGroupId
        console.log('DisplayGroupID:', dgId)

        const ds = await xibo.displays.list({displayGroupId: dgId})
        console.log('Displays:', ds)
    } catch (e) {
        console.log(e)
    }

    resolve();
}

run();

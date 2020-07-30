import { Xibo } from 'Xibo'

const proxy = 'https://corsproxy.usign.io/'
let xiboURL = 'https://wide.ds-cloud.io/api'
if (typeof window !== 'undefined') {
    xiboURL = `${proxy}${xiboURL}`
}

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
        const versao = await xibo.about()
        console.log('Xibo Version:', versao.version)

        
    } catch (e) {
        console.log(e)
    }
    context.resolve();
}
run();

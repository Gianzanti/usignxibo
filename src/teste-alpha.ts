import { Xibo } from 'Xibo'

const proxy = 'https://corsproxy.usign.io/'
let xiboURL = 'https://wide.ds-cloud.io/api'
if (typeof window !== 'undefined') {
    xiboURL = `${proxy}${xiboURL}`
}

const xiboID = 'ZadAUKOUuUOuozo1XEPrYW1vZz5hBwgO0ElzWxpa'
const xiboSecret = 'IKEAfUOtyvuBU6DNjkALSPJfQbdgsxatx4XHjVn60uPFIotAAOaiehvs5FIJf2QZ9xQhIrATxsHEj3XskhT9Cfw8xWkC8u84om4czWTvWNhTBBIre2efyvHLrI898NeKGA5FJTVeAQgi0vRRTLls4meogRy8cnRzDmKWIHPyr9d4igyrkk4DtI9e9Q4OaBu9LShEtHxW1bdVwc8dwbjNspURKf27aket0Xkr0sAB92gjaGizyhCsFPpGiatQHS'

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

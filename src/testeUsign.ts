/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/camelcase */
import { xb, getList, XiboSnippetVersion } from './Xibo'
const run = async (): Promise<void> => {
    console.log('Snippet Version:', XiboSnippetVersion)

    const xiboInst = await xb({
        url: 'https://wide.ds-cloud.io/api',
        client_id: 'ZadAUKOUuUOuozo1XEPrYW1vZz5hBwgO0ElzWxpa', 
        client_secret: 'IKEAfUOtyvuBU6DNjkALSPJfQbdgsxatx4XHjVn60uPFIotAAOaiehvs5FIJf2QZ9xQhIrATxsHEj3XskhT9Cfw8xWkC8u84om4czWTvWNhTBBIre2efyvHLrI898NeKGA5FJTVeAQgi0vRRTLls4meogRy8cnRzDmKWIHPyr9d4igyrkk4DtI9e9Q4OaBu9LShEtHxW1bdVwc8dwbjNspURKf27aket0Xkr0sAB92gjaGizyhCsFPpGiatQHS'
    })

    const context = {
        pageSize: 5,
        page: 1,
        resolve: (msg: string): void => console.log(msg)
    }

    if (xiboInst) {
        context.resolve(JSON.stringify(await getList(xiboInst, 'tags', context.pageSize, context.page)))
    }
}
run()



// import { xb, getList, DisplayCriteria, XiboSnippetVersion } from 'Xibo'
// const run = async (): Promise<void> => {
//     console.log('Snippet Version:', XiboSnippetVersion)
//     // console.log('Context:', JSON.stringify(context, null, 2))
//     // console.log('Constants:', JSON.stringify(context.constants, null, 2))

//     const xiboInst = await xb({
//         url: context.constants.XiboURL,
//         client_id: context.constants.XiboClientID, 
//         client_secret: context.constants.XiboClientSecret
//     })

//     const ctx = {
//         pageSize: context.pageSize,
//         page: context.page,
//         query: context.query,
//         sorted: context.sorted
//     }
//     console.log('CTX:', ctx)

//     if (xiboInst) {
//         context.resolve(await getList<DisplayCriteria>(xiboInst, 'displays', ctx, true));
//     }
// }
// run();

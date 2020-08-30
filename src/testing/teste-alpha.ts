import { xb, getList, XiboSnippetVersion } from 'Xibo'
const run = async (): Promise<void> => {
    console.log('Snippet Version:', XiboSnippetVersion)
    console.log('Context:', JSON.stringify(context, null, 2))
    console.log('Constants:', JSON.stringify(context.constants, null, 2))

    const xiboInst = await xb({
        // url: 'https://wide.ds-cloud.io/api',
        // client_id: 'ZadAUKOUuUOuozo1XEPrYW1vZz5hBwgO0ElzWxpa', 
        // client_secret: 'IKEAfUOtyvuBU6DNjkALSPJfQbdgsxatx4XHjVn60uPFIotAAOaiehvs5FIJf2QZ9xQhIrATxsHEj3XskhT9Cfw8xWkC8u84om4czWTvWNhTBBIre2efyvHLrI898NeKGA5FJTVeAQgi0vRRTLls4meogRy8cnRzDmKWIHPyr9d4igyrkk4DtI9e9Q4OaBu9LShEtHxW1bdVwc8dwbjNspURKf27aket0Xkr0sAB92gjaGizyhCsFPpGiatQHS'
        url: context.constants.XiboURL,
        client_id: context.constants.XiboClientID, 
        client_secret: context.constants.XiboClientSecret
    })

    if (xiboInst) {
        context.resolve(await getList(xiboInst, 'tags', context.pageSize, context.page))
    }
}
run()





// import { xb, XiboSnippetVersion } from 'Xibo'

// const run = async (): Promise<void> => {
//     console.log('Snippet Version:', XiboSnippetVersion)

//     const xiboInst = await xb({
//         url: 'https://wide.ds-cloud.io/api',
//         client_id: 'ZadAUKOUuUOuozo1XEPrYW1vZz5hBwgO0ElzWxpa', 
//         client_secret: 'IKEAfUOtyvuBU6DNjkALSPJfQbdgsxatx4XHjVn60uPFIotAAOaiehvs5FIJf2QZ9xQhIrATxsHEj3XskhT9Cfw8xWkC8u84om4czWTvWNhTBBIre2efyvHLrI898NeKGA5FJTVeAQgi0vRRTLls4meogRy8cnRzDmKWIHPyr9d4igyrkk4DtI9e9Q4OaBu9LShEtHxW1bdVwc8dwbjNspURKf27aket0Xkr0sAB92gjaGizyhCsFPpGiatQHS'
//     })

//     if (xiboInst) {
//         console.log('Xibo Version:', (await xiboInst.about()).version)
//         console.log('Xibo CMS Time:', (await xiboInst.clock()).time)
//     }
// }
// run()


async function run(): Promise<void> {
    const entidade = context.row.original.entidade
    const registro = context.row.original._id
    try {
        const dados = await api.entity.user[entidade].get(registro)
        let status
        if (dados) {
            const {aprovado} = dados
            dados.aprovado = !aprovado
            await dados.save()
            aprovado ? api.alerts.error('Aprovação', 'Mensagem Reprovada') : api.alerts.success('Aprovação', 'Mensagem Aprovada')
            if (api.redux) {
                api.redux.formChange('PerguntasListagem ', 'aprovado', !aprovado)
            }
        }
        context.resolve('OK')
    } catch (err) {
        console.log(JSON.stringify(err, null, 2))
        context.reject('Failed')
    }
}
run()
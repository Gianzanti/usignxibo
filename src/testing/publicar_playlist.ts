import { Xibo } from "./node_modules/Xibo.v.0.0.21/Xibo"
import { WidgetWebpageInsert } from "./node_modules/Xibo.v.0.0.21/XiboWidgets"
import { XiboSnippetVersion, xb } from "./node_modules/Xibo.v.0.0.21"

const updatePlaylist = async (xiboInst: Xibo, plID: number, futurePlaylist: Array<WidgetWebpageInsert>) => {
    // get the playlist content
    const {data: pls} = await xiboInst.playlists.list({playlistId: plID, embed: 'widgets'})
    if (pls.length === 0) return // no data
    console.log('Current Playlist:', pls[0])
    const {widgets} = pls[0]

    // delete all widgets from playlist
    const deleted = await Promise.all(
        widgets.map( wg => xiboInst.widgets.remove(wg.widgetId))
    )
    console.log('Deleted:', deleted)

    // insert all new items
    const inserted = await Promise.all(
        futurePlaylist.map(async(newWidget) => {
            console.log('Widget to Insert:', newWidget)
            const ep = `/playlist/widget/webpage/${plID}`
            const inserted = await xiboInst.widgets.insert(newWidget, ep)
            return xiboInst.widgets.update(inserted.widgetId, newWidget)
        })
    )
    console.log('Inserted:', inserted)
    console.log('Finished process')
}

const run = async(): Promise<void> {
    try {
        const segmentacao = context?.row?.original?.displayGroupId?.toString() || '0'
        const plID = context?.row?.original?.playlistId?.toString() || '0'
        if (plID === '0' || segmentacao === '0') {
            api.alerts.error('Playlist', 'Não existe playlist a ser exibida')
            context.resolve('Done')
            return
        }

        if (!confirm('Essa ação reescreverá a playlis atual. Confirma?')) {
            api.alerts.error('CMS', 'Ação cancelada!')
            context.resolve('Done')
            return
        }

        // mount playlist
        const plEntidade = '5f399aacafb5de001c060950'
        const curPL = await api.entity.user[plEntidade].findAll({
            noCache: true,
            query: { segmentacao: segmentacao }
        })
        
        const futurePL = curPL.map( item => {
            const template = `${item.template}?`
            const editoria = item.editoria ? `&e=${item.editoria}` : ''
            const segm = item.segmentacao ? `&g=${item.segmentacao}` : ''
            const mensagem = item.especifico ? `&m=${item.especifico}` : ''
            const duracao = item.duracao ? `&d=${item.duracao}` : ''
            const itens = item.items ? `&q=${item.items}` : ''
            const others = item.outros ? `${item.outros}` : ''
            const url = `${template}${segm}${editoria}${mensagem}${duracao}${itens}${others}`

            const widget: WidgetWebpageInsert = {
                useDuration: 1,
                modeId: 1,
                name: item.editoria as string,
                duration: item.duracao as number,
                uri: url,
            }

            return widget
        })

        if (futurePL.length <= 0) {
            api.alerts.error('Playlist', 'Não existe conteúdo nessa playlist')
            context.resolve('Done')
            return
        }

        console.log('Xibo Snippet Version:', XiboSnippetVersion)

        // connect to the xibo server api
        const xiboInst = await xb({
            url: context?.constants?.XiboURL ?? 'https://wide.ds-cloud.io/api',
            client_id: context?.constants?.XiboClientID ?? 'ZadAUKOUuUOuozo1XEPrYW1vZz5hBwgO0ElzWxpa', 
            client_secret: context?.constants?.XiboClientSecret ?? 'IKEAfUOtyvuBU6DNjkALSPJfQbdgsxatx4XHjVn60uPFIotAAOaiehvs5FIJf2QZ9xQhIrATxsHEj3XskhT9Cfw8xWkC8u84om4czWTvWNhTBBIre2efyvHLrI898NeKGA5FJTVeAQgi0vRRTLls4meogRy8cnRzDmKWIHPyr9d4igyrkk4DtI9e9Q4OaBu9LShEtHxW1bdVwc8dwbjNspURKf27aket0Xkr0sAB92gjaGizyhCsFPpGiatQHS'
        })

        if (!xiboInst) {
            api.alerts.error('CMS', 'Não foi possível conectar ao CMS')
            context.resolve('Done')
            return
        }
    
        updatePlaylist(xiboInst, parseInt(plID),  futurePL)
        api.alerts.success('Importar', 'Importação finalizada')
        context.resolve('Done')
        return

    } catch (e) {
        console.log('Error:', e)
        context.reject(e)
    }
}

run();

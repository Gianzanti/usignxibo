import { xb, XiboSnippetVersion } from 'Xibo.v.0.0.21'
import { Playlist } from './node_modules/Xibo.v.0.0.21/XiboPlaylist'

interface URLParams {
    [key: string]: string;
}

interface URLUSign {
    template?: string;
    search?: string;
    params?: URLParams;
}

interface Saida {
    widgetId: number;
    displayOrder: string;
    name: string;
    urlOriginal: string;
    url: URLUSign;
}

const readPlaylistFromXibo = (pl: Playlist): Saida[] => {
    const saidas: Saida[] = []
    
    pl.widgets.forEach( wg => {
        const [url] = wg.widgetOptions.filter( opt => opt.option === 'uri')
        const newUrl: URLUSign = {}
        if (url?.value) {
            try{
                const urlParsed = new URL(decodeURIComponent(url?.value))
                const urlParams: URLParams = {}
                let searchUnknow = ''
                urlParsed.searchParams.forEach( (value, key) => {
                    switch (key) {
                        case 'e':
                            urlParams.editoria = value
                            break
                        case 'd':
                            urlParams.duracao = value
                            break
                        case 'q':
                            urlParams.items = value
                            break
                        case 'm':
                            urlParams.especifico = value
                            break
                        case 'g':
                            //segmentacao
                            break
                        default:
                            searchUnknow += `&${key}=${value}`
                    }
                })

                newUrl.template = `${urlParsed?.protocol}//${urlParsed?.hostname}${urlParsed?.pathname}`
                newUrl.search = searchUnknow
                newUrl.params = urlParams

            } catch (error) {
                console.log('Original URL:', url?.value)
                console.log(error)
            }
        }

        const saida: Saida = {
            widgetId: wg.widgetId,
            displayOrder: wg.displayOrder.toString(),
            name: wg.name,
            urlOriginal: url?.value,
            url: newUrl
        }
        saidas.push(saida)
    })
    return saidas
}

const updatePlaylistUSign = async (seg: string, pls: Saida[]) => {
    const plEntidade = '5f399aacafb5de001c060950'

    // clear current playlist
    const curPL = await api.entity.user[plEntidade].findAll({
        noCache: true,
        query: { segmentacao: seg }
    })
    await Promise.all(curPL.map( pl => pl.delete(true) ))

    // create all new entries
    await Promise.all(pls.map( pl => {
        api.entity.user[plEntidade].insert({
            segmentacao: seg,
            posicao: pl.displayOrder,
            template: pl.url.template,
            editoria: pl.url.params?.editoria,
            duracao: pl.url.params?.duracao,
            items: pl.url.params?.items,
            especifico: pl.url.params?.especifico,
            outros: pl.url.search
            // ordem	string	NÃO	NÃO
            // sequencial	string	NÃO	NÃO
            // aleatorio
        })
    }))
}

const run = async (): Promise<void> => {
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
        // exibir playlists
        const { data } = await xiboInst.playlists.list({playlistId: plID, embed: 'widgets'})
        if (data.length === 0) {
            api.alerts.error('Playlist', 'Não existe playlist a ser exibida')
            context.resolve('Done')
            return
        }
        const pl = readPlaylistFromXibo(data[0])
        await updatePlaylistUSign(segmentacao, pl)

        api.alerts.success('Importar', 'Importação finalizada')
        context.resolve('Done')
        return

    } catch (e) {
        console.log('Error:', e)
        context.reject(e)
    }
}

run()



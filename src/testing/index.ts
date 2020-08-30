/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/camelcase */
import { xb, Xibo, getList, XiboSnippetVersion, addMedia, testTags } from './Xibo'
import { USignResponse } from './Xibo/XiboComponent'
import { Playlist } from './Xibo/XiboPlaylist'
import { WidgetWebpageInsert } from './Xibo/XiboWidgets'

interface Output {
    widgetId: number;
    duration: number;
    displayOrder: string;
    calculatedDuration: number;
    name: string;
    url: string;
}

const mountPlaylist = (pl: Playlist): Output[] => {
    console.log('Mounting output')
    const outputs: Output[] = []
    
    // console.log('Playlists:', pl.widgets)
    pl.widgets.forEach( wg => {
        // get the url
        // console.log('Options:', wg.widgetOptions)
        const [url] = wg.widgetOptions.filter( opt => opt.option === 'uri')
        const urlDecoded = decodeURIComponent(url?.value || '')

        const saida: Output = {
            widgetId: wg.widgetId,
            duration: wg.duration,
            displayOrder: wg.displayOrder.toString(),
            calculatedDuration: wg.calculatedDuration,
            name: wg.name,
            url: urlDecoded
        }

        outputs.push(saida)
    })

    console.log('Outputs:', outputs)
    return outputs
}

const addWidgets = async (xiboInst: Xibo, plID: number, index: number) => {
    const ep = `/playlist/widget/webpage/${plID}`
    const newWidget: WidgetWebpageInsert = {
        displayOrder: index,
        name: 'Nossa Essência',
        duration: 10,
        modeId: 1,
        uri: 'https://usign.io/wide/csn/geral/?e=nossaessencia&d=10&g=9',
        useDuration: 1,
    }
    const inserted = await xiboInst.widgets.insert(newWidget, ep)
    console.log('Added:', inserted)
}

const getWidgets = async (xiboInst: Xibo, plID: number) => {
    const {data: pls} = await xiboInst.playlists.list({playlistId: plID, embed: 'widgets'})
    if (pls.length === 0) return // no data
    const {widgets} = pls[0]
    return widgets
}


const updatePlaylist = async (xiboInst: Xibo, plID: number, futurePlaylist: Array<WidgetWebpageInsert>) => {
    
    // get the playlist content
    const widgets = await getWidgets(xiboInst, plID)
    if (!widgets) return

    const currentSize = widgets.length
    const futureSize = futurePlaylist.length
    const difference = currentSize - futureSize
    console.log('Current Size:', currentSize, ' Future Size:', futureSize, 'Diff:', difference)

    if (difference < 0) {
        // add widgets
        console.log('Adding widgets:', -difference)
        const items = [...Array(-difference).keys()]
        console.log('Items:', items)
        for (const index of items) {
            await addWidgets(xiboInst, plID, index)
        }
    } else if (difference > 0) {
        // delete some widgets
        console.log('difference:', difference)
        const toRemove = widgets.slice(difference)
        console.log('Deleting widgets:', toRemove.length)
        const deleted = await Promise.all(
            toRemove.map( wg => xiboInst.widgets.remove(wg.widgetId))
        )
    }

    const curWidgets = difference !== 0 ? await getWidgets(xiboInst, plID) : widgets
    if (!curWidgets) return

    // update all new items
    const inserted = await Promise.all(
        curWidgets.map(async(curWidget) => {
            // console.log('Widget to Insert:', newWidget)
            const newWidget = futurePlaylist[curWidget.displayOrder-1]
            const updated = await xiboInst.widgets.update(curWidget.widgetId, newWidget)
            console.log('Updated:', updated.displayOrder, newWidget.displayOrder)
            return updated
        })
    )
    console.log('Finished process')
}


const run = async (): Promise<void> => {
    console.log('Snippet Version:', XiboSnippetVersion)
    const xiboInst = await xb({
        url: 'https://wide.ds-cloud.io/api',
        client_id: 'ZadAUKOUuUOuozo1XEPrYW1vZz5hBwgO0ElzWxpa', 
        client_secret: 'IKEAfUOtyvuBU6DNjkALSPJfQbdgsxatx4XHjVn60uPFIotAAOaiehvs5FIJf2QZ9xQhIrATxsHEj3XskhT9Cfw8xWkC8u84om4czWTvWNhTBBIre2efyvHLrI898NeKGA5FJTVeAQgi0vRRTLls4meogRy8cnRzDmKWIHPyr9d4igyrkk4DtI9e9Q4OaBu9LShEtHxW1bdVwc8dwbjNspURKf27aket0Xkr0sAB92gjaGizyhCsFPpGiatQHS'
    })

    const plToInsert: WidgetWebpageInsert[] = [
        {useDuration: 1, modeId: 1, displayOrder: 1, name: 'Limpa Tela', duration: 5, uri: 'https://usign.io/wide/csn/medias/?&g=9&e=media&m=5f2d6b4e45712d00196dc072&d=5'},
        {useDuration: 1, modeId: 1, displayOrder: 2, name: 'Nossa Essência', duration: 18, uri: 'https://usign.io/wide/csn/geral/?&g=9&e=nossaessencia&d=18'},
        {useDuration: 1, modeId: 1, displayOrder: 3, name: 'RH Em Foco', duration: 10, uri: 'https://usign.io/wide/csn/geral/?&g=9&e=rhemfoco&d=10'},
        {useDuration: 1, modeId: 1, displayOrder: 4, name: 'HARDNEWS - UOL', duration: 10, uri: 'https://usign.io/widgets/uol/news/?&g=9&e=internacional&d=10&w=5f1aec9b7fd6a4001a431169'},
        {useDuration: 1, modeId: 1, displayOrder: 5, name: 'Acontece', duration: 10, uri: 'https://usign.io/wide/csn/acontece?&g=9&e=acontece&d=10'},
        {useDuration: 1, modeId: 1, displayOrder: 6, name: 'Você Sabia?', duration: 20, uri: 'https://usign.io/wide/csn/quiz?&g=9&e=quiz&d=20'},
        {useDuration: 1, modeId: 1, displayOrder: 7, name: 'Giro Pelas Áreas', duration: 13, uri: 'https://usign.io/wide/csn/geral/?&g=9&e=giro&d=13'},
        {useDuration: 1, modeId: 1, displayOrder: 8, name: 'Eu Indico', duration: 20, uri: 'https://usign.io/wide/csn/geral/?&g=9&e=euindico&d=20'},
        {useDuration: 1, modeId: 1, displayOrder: 9, name: 'Carros', duration: 15, uri: 'https://usign.io/wide/csn/geral/?&g=9&e=carrosemotos&d=15'},
        {useDuration: 1, modeId: 1, displayOrder: 10, name: 'CSN Social', duration: 13, uri: 'https://usign.io/wide/csn/geral/?&g=9&e=social&d=13'},
        {useDuration: 1, modeId: 1, displayOrder: 11, name: 'Financeiro (Placeholder)', duration: 10, uri: 'https://usign.io/widgets/uol/moedas/?&g=9&e=moedas&d=10&w=5efb5ed69e27860019fe5ece'},
        {useDuration: 1, modeId: 1, displayOrder: 12, name: 'Aqui Tem', duration: 23, uri: 'https://usign.io/wide/csn/geral/?&g=9&e=aquitem&d=23'},
        {useDuration: 1, modeId: 1, displayOrder: 13, name: 'Editoria Livre - Foto', duration: 20, uri: 'https://usign.io/wide/csn/geral/?&g=9&e=livre&d=20'},
        {useDuration: 1, modeId: 1, displayOrder: 14, name: 'Regionais', duration: 10, uri: 'https://usign.io/wide/csn/geral/?&g=9&e=regionais&d=10'},
        {useDuration: 1, modeId: 1, displayOrder: 15, name: 'Nossa Gente', duration: 10, uri: 'https://usign.io/wide/csn/geral/?&g=9&e=nossagente&d=10'},
        {useDuration: 1, modeId: 1, displayOrder: 16, name: 'CSN Porto Real', duration: 30, uri: 'https://usign.io/wide/csn/medias?&g=9&e=media&m=5f3d927e9746e600122a8af6&d=30'},
        {useDuration: 1, modeId: 1, displayOrder: 17, name: 'Valor Economico (Placeholder)', duration: 10, uri: 'https://usign.io/widgets/uol/news/?&g=9&e=economia&d=10&w=5f1aec9b7fd6a4001a431169'},
        {useDuration: 1, modeId: 1, displayOrder: 18, name: 'Plantão CSN', duration: 23, uri: 'https://usign.io/wide/csn/geral/?&g=9&e=plantao&d=23'},
        {useDuration: 1, modeId: 1, displayOrder: 19, name: 'Limpa Tela', duration: 5, uri: 'https://usign.io/wide/csn/medias/?&g=9&e=media&m=5f2d6b4e45712d00196dc072&d=5'},
        {useDuration: 1, modeId: 1, displayOrder: 20, name: 'Panorama CSN', duration: 10, uri: 'https://usign.io/wide/csn/geral/?&g=9&e=panorama&d=10'},
        {useDuration: 1, modeId: 1, displayOrder: 21, name: 'Editoria Livre - Video', duration: 20, uri: 'https://usign.io/wide/csn/geral/?&g=9&e=livre&d=20'},
        {useDuration: 1, modeId: 1, displayOrder: 22, name: 'Dicas Culturais', duration: 15, uri: 'https://usign.io/wide/csn/geral/?&g=9&e=dicas&d=15'},
        {useDuration: 1, modeId: 1, displayOrder: 23, name: 'RH Em Foco', duration: 10, uri: 'https://usign.io/wide/csn/geral/?&g=9&e=rhemfoco&d=10'},
        {useDuration: 1, modeId: 1, displayOrder: 24, name: 'HARDNEWS - Uol', duration: 10, uri: 'https://usign.io/widgets/uol/news/?&g=9&e=esporte&d=10&w=5efa55039e27860019fe5983'},
        {useDuration: 1, modeId: 1, displayOrder: 25, name: 'CSN Social', duration: 13, uri: 'https://usign.io/wide/csn/geral/?&g=9&e=social&d=13'},
        {useDuration: 1, modeId: 1, displayOrder: 26, name: 'Você Sabia?', duration: 20, uri: 'https://usign.io/wide/csn/quiz?&g=9&e=quiz&d=20'},
        {useDuration: 1, modeId: 1, displayOrder: 27, name: 'Telecine (Placeholder)', duration: 15, uri: 'https://usign.io/wide/csn/medias?&g=9&e=teste&m=5f3d8dc67e6cdb001326e3f1&d=15'},
        {useDuration: 1, modeId: 1, displayOrder: 28, name: 'Aqui Tem', duration: 23, uri: 'https://usign.io/wide/csn/geral/?&g=9&e=aquitem&d=23'},
        {useDuration: 1, modeId: 1, displayOrder: 29, name: 'Eu Indico', duration: 20, uri: 'https://usign.io/wide/csn/geral/?&g=9&e=euindico&d=20'},
        {useDuration: 1, modeId: 1, displayOrder: 30, name: 'Carros e Motos', duration: 10, uri: 'https://usign.io/wide/csn/geral/?&g=9&e=carrosemotos&d=10'},
        {useDuration: 1, modeId: 1, displayOrder: 31, name: 'Nossa Essencia', duration: 18, uri: 'https://usign.io/wide/csn/geral/?&g=9&e=nossaessencia&d=18'},
        {useDuration: 1, modeId: 1, displayOrder: 32, name: 'Acontece', duration: 10, uri: 'https://usign.io/wide/csn/acontece?&g=9&e=acontece&d=10'},
        {useDuration: 1, modeId: 1, displayOrder: 33, name: 'CSN Mineração', duration: 30, uri: 'https://usign.io/wide/csn/medias?&g=9&e=media&m=5f3d92497e6cdb001326e3f3&d=30'},
        {useDuration: 1, modeId: 1, displayOrder: 34, name: 'Valor Economico (Placeholder)', duration: 10, uri: 'https://usign.io/widgets/uol/news/?&g=9&e=economia&d=10&w=5f1aec9b7fd6a4001a431169'},
        {useDuration: 1, modeId: 1, displayOrder: 35, name: 'Panorama CSN', duration: 10, uri: 'https://usign.io/wide/csn/geral/?&g=9&e=panorama&d=10'},
        {useDuration: 1, modeId: 1, displayOrder: 36, name: 'RH Em Foco', duration: 10, uri: 'https://usign.io/wide/csn/geral/?&g=9&e=rhemfoco&d=10'},
        {useDuration: 1, modeId: 1, displayOrder: 37, name: 'Carros e Motos', duration: 15, uri: 'https://usign.io/wide/csn/geral/?&g=9&e=carrosemotos&d=15'},
    ]
 

    if (xiboInst) {
        updatePlaylist(xiboInst, 80, plToInsert)
    }


    // // const context = {
    // //     pageSize: 5,
    // //     page: 1,
    // //     resolve: (msg: string): void => console.log(msg),
    // //     query: {
    // //         clientType: 'android'
    // //       },
    // //     sorted: {
    // //         displayId: 1
    // //     }, 
    // // }

    // if (xiboInst) {
    //     // const dados = await xiboInst?.displaygroups.list({length: 100})
    //     // console.log(dados)
    //     // await testTags(xiboInst)


    //     // exibir playlists
    //     const { data } = await xiboInst.displaygroups.list({displayGroupId: 13})
    //     console.log('Data:', data)
    //     const segmentacao = data[0]
    //     if (segmentacao) {
    //         const sch = await xiboInst.schedules.listEvents({displayGroupId: segmentacao.displayGroupId, date: '2020-08-14 00:00:00'})
    //         const layoutId = sch.data[0].layoutId
    //         if (layoutId) {
    //             const lo = await xiboInst.layouts.list({layoutId: layoutId, embed: 'regions,playlists,widgets'})
    //             const layout = lo.data[0]
    //             // console.log('Regions:', layout.regions)
    //             // console.log('Widgets:', layout.regions[0].regionPlaylist.widgets)
    //             // console.log('Widgets Options:', layout.regions[0].regionPlaylist.widgets[0].widgetOptions)

    //             // locate subplaylist id
    //             const sub = layout.regions[0].regionPlaylist.widgets[0].widgetOptions.filter( opt => opt.option === 'subPlaylistIds')
    //             const [subID] = JSON.parse(sub[0].value)
    //             const pl = await xiboInst.playlists.list({playlistId: subID, embed: 'widgets'})
    //             // console.log('Playlists:', pl.data[0].widgets)
    //             // console.log('Widgets Options:', pl.data[0].widgets[0].widgetOptions)
    //             mountPlaylist(pl.data[0])
    //         }
    //     }
    // }
}
run()



// import { Xibo, getList, Media, testTags } from './Xibo'


// // const proxy = 'https://corsproxy.usign.io/'
// // let xiboURL = 'https://wide.ds-cloud.io/api'
// // if (typeof window !== 'undefined') {
// //     xiboURL = `${proxy}${xiboURL}`
// // }

// // const xiboID = 'ZadAUKOUuUOuozo1XEPrYW1vZz5hBwgO0ElzWxpa'
// // const xiboSecret = 'IKEAfUOtyvuBU6DNjkALSPJfQbdgsxatx4XHjVn60uPFIotAAOaiehvs5FIJf2QZ9xQhIrATxsHEj3XskhT9Cfw8xWkC8u84om4czWTvWNhTBBIre2efyvHLrI898NeKGA5FJTVeAQgi0vRRTLls4meogRy8cnRzDmKWIHPyr9d4igyrkk4DtI9e9Q4OaBu9LShEtHxW1bdVwc8dwbjNspURKf27aket0Xkr0sAB92gjaGizyhCsFPpGiatQHS'


// const run = async (): Promise<void> => {
//     try {
//         await testTags()

//         // console.log(await getList('medias'))


//         // await xibo.authenticate()
//         // console.log('Xibo Version:', (await xibo.about()).version)
//         // console.log('Xibo CMS Time:', (await xibo.clock()).time)


//         // const context = {
//         //     pageSize: 5,
//         //     page: 1
//         // }


//         // const dsg = await xibo.displaygroups.list({
//         //     length: context.pageSize, 
//         //     start: (context.page - 1)*context.pageSize
//         // })
        
//         // console.log('dsg:', dsg)

//         // context.resolve({
//         //     data: dsg.list, 
//         //     pages: dsg.totalPages,
//         //     page: dsg.currentPage,
//         // });


//         // let theLayout: Layout

//         // const lo = await xibo.layouts.list({layout: 'teste_ubuntu', embed: 'regions,playlists,widgets'})
//         // console.log('Layout:', lo)
//         // theLayout = lo.list[0]

//         // if (theLayout.publishedStatus !== 'Draft') {
//         //     // checkout the layout
//         //     theLayout = await xibo.layouts.checkout(theLayout.layoutId)
//         //     console.log('Draft:', theLayout)
//         // } else {
//         //     // get the real draft layout
//         //     theLayout = await xibo.layouts.getDraftLayout(theLayout.layoutId)
//         // }

//         // console.log(theLayout)


//         // console.log('Regions:', chk.list[0].regions)
//         // console.log('Widgets:', chk.list[0].regions[0].regionPlaylist.widgets)
//         // console.log('Widgets Options:', chk.list[0].regions[0].regionPlaylist.widgets[0].widgetOptions)

//         // const plID = theLayout.regions[0].regionPlaylist.playlistId
//         // console.log('PlaylistID:', plID)

//         // const teste2 = await xibo.playlists.addMedia(plID, 32)
//         // console.log('Teste:', teste2)

//         // const teste3 = await xibo.layouts.publish(theLayout.parentId)
//         // console.log('Publish: ', teste3)

        

//         // const pl = await xibo.playlists.list()
//         // console.log('Playlists:', pl)


//         // const lay = await xibo.layouts.list({embed: 'regions'})
//         // console.log('Layouts:', lay.list)

//         // console.log(lay.list[0].regions)

//         // const dgList = await xibo.displaygroups.list({displayGroup: 'jbtec'})
//         // console.log('DisplayGroups:', dgList)

//         // const dgId = dgList.list[0].displayGroupId
//         // console.log('DisplayGroupID:', dgId)

//         // const ds = await xibo.displays.list({displayGroupId: dgId})
//         // console.log('Displays:', ds)

//         // const sch = await xibo.schedules.listEvents({displayGroupId: 6, date: '2020-07-30 00:00:00'})
//         // console.log('Schedule:', sch.list)

//         // const medias = await xibo.medias.list({type: 'image'})
//         // console.log('Medias:', medias.list)

//         // inserting a media from URL
//         // const inserted = await xibo.medias.insert({url: 'https://api.fusion.usign.io/files/e646ab591cda9f7b5b2a631038d68319_1596202206485.jpeg', type: 'Image'})
//         // console.log(inserted)

//         // const permissions = await xibo.permissions.get('Media', inserted.mediaId)
//         // console.log('Permssions:', permissions)

        
//         // const teste = await xibo.medias.update(inserted.mediaId, inserted)
//         // console.log('Teste:', teste)


//     } catch (e) {
//         console.error(`${e.name}: ${e.message}`)
//     }
// }

// run()




// // import { getList } from './XiboApp'

// // const run = async (): Promise<void> => {
// //     await getList('medias')
// // }
// // run()
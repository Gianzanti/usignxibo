/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/camelcase */
import { xb, getList, XiboSnippetVersion, addMedia, testTags } from './Xibo'
import { USignResponse } from './Xibo/XiboComponent'
import { Playlist } from './Xibo/XiboPlaylist'

interface Saida {
    widgetId: number;
    duration: number;
    displayOrder: string;
    calculatedDuration: number;
    name: string;
    url: string;
}

const mountPlaylist = (pl: Playlist): Saida[] => {
    console.log('Mounting saidas')
    const saidas: Saida[] = []
    
    // console.log('Playlists:', pl.widgets)
    pl.widgets.forEach( wg => {
        // get the url
        // console.log('Options:', wg.widgetOptions)
        const [url] = wg.widgetOptions.filter( opt => opt.option === 'uri')
        const urlDecoded = decodeURIComponent(url?.value || '')

        const saida: Saida = {
            widgetId: wg.widgetId,
            duration: wg.duration,
            displayOrder: wg.displayOrder.toString(),
            calculatedDuration: wg.calculatedDuration,
            name: wg.name,
            url: urlDecoded
        }

        saidas.push(saida)
    })

    // console.log('Widgets Options:', pl.data[0].widgets[0].widgetOptions)


    console.log('Saidas:', saidas)
    return saidas
}


const run = async (): Promise<void> => {
    console.log('Snippet Version:', XiboSnippetVersion)
    const xiboInst = await xb({
        url: 'https://wide.ds-cloud.io/api',
        client_id: 'ZadAUKOUuUOuozo1XEPrYW1vZz5hBwgO0ElzWxpa', 
        client_secret: 'IKEAfUOtyvuBU6DNjkALSPJfQbdgsxatx4XHjVn60uPFIotAAOaiehvs5FIJf2QZ9xQhIrATxsHEj3XskhT9Cfw8xWkC8u84om4czWTvWNhTBBIre2efyvHLrI898NeKGA5FJTVeAQgi0vRRTLls4meogRy8cnRzDmKWIHPyr9d4igyrkk4DtI9e9Q4OaBu9LShEtHxW1bdVwc8dwbjNspURKf27aket0Xkr0sAB92gjaGizyhCsFPpGiatQHS'
    })

    // const context = {
    //     pageSize: 5,
    //     page: 1,
    //     resolve: (msg: string): void => console.log(msg),
    //     query: {
    //         clientType: 'android'
    //       },
    //     sorted: {
    //         displayId: 1
    //     }, 
    // }

    if (xiboInst) {
        // const dados = await xiboInst?.displaygroups.list({length: 100})
        // console.log(dados)
        // await testTags(xiboInst)


        // exibir playlists
        const { data } = await xiboInst?.displaygroups.list({displayGroup: 'CSN'})
        const segmentacao = data[0]
        if (segmentacao) {
            const sch = await xiboInst.schedules.listEvents({displayGroupId: segmentacao.displayGroupId, date: '2020-08-14 00:00:00'})
            const layoutId = sch.data[0].layoutId
            if (layoutId) {
                const lo = await xiboInst.layouts.list({layoutId: layoutId, embed: 'regions,playlists,widgets'})
                const layout = lo.data[0]
                // console.log('Regions:', layout.regions)
                // console.log('Widgets:', layout.regions[0].regionPlaylist.widgets)
                // console.log('Widgets Options:', layout.regions[0].regionPlaylist.widgets[0].widgetOptions)

                // locate subplaylist id
                const sub = layout.regions[0].regionPlaylist.widgets[0].widgetOptions.filter( opt => opt.option === 'subPlaylistIds')
                const [subID] = JSON.parse(sub[0].value)
                const pl = await xiboInst.playlists.list({playlistId: subID, embed: 'widgets'})
                // console.log('Playlists:', pl.data[0].widgets)
                // console.log('Widgets Options:', pl.data[0].widgets[0].widgetOptions)
                mountPlaylist(pl.data[0])
            }
        }
    }
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
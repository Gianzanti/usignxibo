/* eslint-disable no-undef */
import { Xibo } from './Xibo'
import { v4 as uuidv4 } from 'uuid'

const proxy = 'https://corsproxy.usign.io/'
let xiboURL = 'https://wide.ds-cloud.io/api'
if (typeof window !== 'undefined') {
    xiboURL = `${proxy}${xiboURL}`
}

const xiboID = 'ZadAUKOUuUOuozo1XEPrYW1vZz5hBwgO0ElzWxpa'
const xiboSecret = 'IKEAfUOtyvuBU6DNjkALSPJfQbdgsxatx4XHjVn60uPFIotAAOaiehvs5FIJf2QZ9xQhIrATxsHEj3XskhT9Cfw8xWkC8u84om4czWTvWNhTBBIre2efyvHLrI898NeKGA5FJTVeAQgi0vRRTLls4meogRy8cnRzDmKWIHPyr9d4igyrkk4DtI9e9Q4OaBu9LShEtHxW1bdVwc8dwbjNspURKf27aket0Xkr0sAB92gjaGizyhCsFPpGiatQHS'

const testTags = async (xibo: Xibo): Promise<void> => {
        let tags = await xibo.tags.list({length: 2})
        console.log(JSON.stringify(tags, null, 2))

        while (!tags.isLastPage) {
            if (tags.nextPage) {
                tags = await tags.nextPage()
                console.log(JSON.stringify(tags, null, 2))
            }
        }

        const tagToInsert = {
            name: `TagByAPI_${uuidv4()}`,
            isRequired: 0,
            options: ['some', 'options', 'comma', 'separated']
        }
        const inserted = await xibo.tags.insert(tagToInsert)
        console.log('Inserted:', inserted)
        // console.log('ID of new tag:', inserted.tagId)

        const newTag = {
            ...inserted,
            name: `ChangedByAPI_${uuidv4()}`
        }

        const toUpdate = await xibo.tags.update(newTag.tagId, newTag)
        console.log('Updated:', toUpdate)
        console.log('ID of new tag:', toUpdate.tagId)

        const deleted = await xibo.tags.remove(toUpdate.tagId)
        console.log('Deleted:', deleted)
}

const run = async (): Promise<void> => {
    const xibo = new Xibo({
        url: xiboURL,
        'client_id': xiboID,
        'client_secret': xiboSecret,
        'grant_type': 'client_credentials'
    })

    try {
        await xibo.authenticate()
        console.log('Xibo Version:', (await xibo.about()).version)
        console.log('Xibo CMS Time:', (await xibo.clock()).time)

        const lo = await xibo.layouts.list({layout: 'teste_ubuntu', embed: 'regions,playlists,widgets'})
        console.log('Layout:', lo)
        console.log('Regions:', lo.list[0].regions)

        console.log('Widgets:', lo.list[0].regions[0].regionPlaylist.widgets)
        console.log('Widgets Options:', lo.list[0].regions[0].regionPlaylist.widgets[0].widgetOptions)

        const plID = lo.list[0].regions[0].regionPlaylist.playlistId
        console.log('PlaylistID:', plID)


        // checkout the layout
        lo.list[0].

        const teste2 = await xibo.playlists.addMedia(plID, 32)
        console.log('Teste:', teste2)


        // testTags(xibo)

        // const pl = await xibo.playlists.list()
        // console.log('Playlists:', pl)


        // const lay = await xibo.layouts.list({embed: 'regions'})
        // console.log('Layouts:', lay.list)

        // console.log(lay.list[0].regions)

        // const dgList = await xibo.displaygroups.list({displayGroup: 'jbtec'})
        // console.log('DisplayGroups:', dgList)

        // const dgId = dgList.list[0].displayGroupId
        // console.log('DisplayGroupID:', dgId)

        // const ds = await xibo.displays.list({displayGroupId: dgId})
        // console.log('Displays:', ds)

        // const sch = await xibo.schedules.listEvents({displayGroupId: 6, date: '2020-07-30 00:00:00'})
        // console.log('Schedule:', sch.list)

        // const medias = await xibo.medias.list({type: 'image'})
        // console.log('Medias:', medias.list)

        // inserting a media from URL
        // const inserted = await xibo.medias.insert({url: 'https://api.fusion.usign.io/files/e646ab591cda9f7b5b2a631038d68319_1596202206485.jpeg', type: 'Image'})
        // console.log(inserted)

        // const permissions = await xibo.permissions.get('Media', inserted.mediaId)
        // console.log('Permssions:', permissions)

        
        // const teste = await xibo.medias.update(inserted.mediaId, inserted)
        // console.log('Teste:', teste)


    } catch (e) {
        console.error(`${e.name}: ${e.message}`)
    }
}

run()

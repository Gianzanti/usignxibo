import { xb, testTags } from './test/tagTest'

export const XiboSnippetVersion = '0.0.24'

export * from './Xibo'
// export * from './XiboCampaign'
// export * from './XiboDisplayGroups'
export * from './displays'
// export * from './XiboLayout'
// export * from './XiboMedia'
// export * from './XiboPlaylist'
// export * from './XiboRegion'
// export * from './XiboSchedules'
export * from './tags'
// export * from './XiboUser'
// export * from './XiboUserGroup'
// export * from './XiboWidgets'
// export * from './testing/XiboApp'




const run = async (): Promise<void> => {
    console.log('Snippet Version:', XiboSnippetVersion)
    const xiboInst = await xb({
        url: 'https://wide.ds-cloud.io/api',
        client_id: 'ZadAUKOUuUOuozo1XEPrYW1vZz5hBwgO0ElzWxpa', 
        client_secret: 'IKEAfUOtyvuBU6DNjkALSPJfQbdgsxatx4XHjVn60uPFIotAAOaiehvs5FIJf2QZ9xQhIrATxsHEj3XskhT9Cfw8xWkC8u84om4czWTvWNhTBBIre2efyvHLrI898NeKGA5FJTVeAQgi0vRRTLls4meogRy8cnRzDmKWIHPyr9d4igyrkk4DtI9e9Q4OaBu9LShEtHxW1bdVwc8dwbjNspURKf27aket0Xkr0sAB92gjaGizyhCsFPpGiatQHS'
    })
    if(xiboInst) {
        testTags(xiboInst)
    }
}
run()
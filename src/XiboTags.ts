import { Xibo } from './Xibo'
import { XiboComponent, Criteria } from './XiboComponent'

export interface TagInsert {
    name?: string,
    isRequired?: number,
    options?: string[],
}

export interface Tag{
    tagId: number,
    tag: string,
    isSystem: number,
    isRequired: number,
    options: string[],
    layouts: string[],
    playlists: string[],
    campaigns: string[],
    medias: string[],
    displayGroups: string[],
    value: string
}

interface TagCriteria extends Criteria {
    tagId?: number,
    tag?: string,
    exactTag?: string
    isSystem?: boolean,
    isRequired?: boolean,
    haveOptions?: boolean,
}

export class Tags extends XiboComponent<Tag, TagCriteria, null, TagInsert> {
  public constructor (server: Xibo) {
    super('/tag', server)
  }
}

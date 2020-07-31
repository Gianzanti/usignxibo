import { Xibo } from './Xibo'
import { XiboComponent, Criteria } from './XiboComponent'

export interface TagInsert {
    name?: string;
    isRequired?: number;
    options?: string[] | string;
}

export interface Tag {
    tagId: number;
    tag: string;
    isSystem: number;
    isRequired: number;
    options: string; // array to Parse
    layouts: string[];
    playlists: string[];
    campaigns: string[];
    medias: string[];
    displayGroups: string[];
    value: string;
}

interface TagCriteria extends Criteria {
    tagId?: number;
    tag?: string;
    exactTag?: string;
    isSystem?: boolean;
    isRequired?: boolean;
    haveOptions?: boolean;
}

const updateOptions = (data: Tag): Tag => {
    if (data.options) {
        return {
            ...data,
            options: data.options ? JSON.parse(data.options as unknown as string) : undefined
        }
    }
    return data
}

export class Tags extends XiboComponent<Tag, TagCriteria, TagInsert> {
    public constructor(server: Xibo) {
        super({
            endPoint: '/tag',
            server: server,
            gridExpected: true
        })
    }

    public async insert(content: TagInsert): Promise<Tag> {
        return updateOptions(await super.insert(content))
    }

    public async update(id: number, content: Tag & TagInsert): Promise<Tag> {
        return updateOptions(await super.insert(content))
    }
}

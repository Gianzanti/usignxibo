export interface Permission {
    //The ID of this Permission Record,  
    permissionId: number;

    //The Entity ID that this Permission refers to,
    entityId: number;

    //The User Group ID that this permission refers to,
    groupId: number;

    //The object ID that this permission refers to,
    objectId: number;

    //A flag indicating whether the groupId refers to a user specific group,
    isUser: number;

    //The entity name that this refers to,
    entity: string;

    //Legacy for when the Object ID is a string,
    objectIdString: string;

    //The group name that this refers to,
    group: string;

    //A flag indicating whether view permission is granted,
    view: number;

    //A flag indicating whether edit permission is granted,
    edit: number;

    //A flag indicating whether delete permission is granted,
    delete: number;

    //A flag indicating whether modify permission permission is granted.,
    modifyPermissions: number;

}

export interface UserGroup {
    /** The Group ID */
    groupId: number;
    /** The group name */
    group: string;
    /** A flag indicating whether this is a user specific group or not */
    isUserSpecific: number;
    /** A flag indicating the special everyone group */
    isEveryone: number;
    /** This users library quota in bytes. 0 = unlimited */
    libraryQuota: number;
    /** Does this Group receive system notifications. */
    isSystemNotification: number;
    /** Does this Group receive display notifications. */
    isDisplayNotification: number;
}

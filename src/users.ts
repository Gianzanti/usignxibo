import { Campaign } from './campaign'
import { Layout } from './layouts'
import { Media } from './medias'
import { Schedule } from './schedules'
import { Playlist } from './playlists'
import { Entity } from './entity'
import { Xibo } from '.'
import { UserGroup } from './userGroups'

export interface User {
    /** The ID of this User */
    userId: number;

    /** The user name */
    userName: string;

    /** The user type ID */
    userTypeId: number;

    /** Flag indicating whether this user is logged in or not */
    loggedIn: number;

    /** Email address of the user used for email alerts */
    email: string;

    /** The pageId of the Homepage for this User */
    homePageId: number;

    /** A timestamp indicating the time the user last logged into the CMS */
    lastAccessed: number;

    /** A flag indicating whether this user has see the new user wizard */
    newUserWizard: number;

    /** A flag indicating whether the user is retired */
    retired: number;

    /** A flag indicating whether password change should be forced for this user */
    isPasswordChangeRequired: number;

    /** The users user group ID */
    groupId: number;

    /** The users group name */
    group: number;

    /** The users library quota in bytes */
    libraryQuota: number;

    /** First Name */
    firstName: string;

    /** Last Name */
    lastName: string;

    /** Phone Number */
    phone: string;

    /** Reference field 1 */
    ref1: string;

    /** Reference field 2 */
    ref2: string;

    /** Reference field 3 */
    ref3: string;

    /** Reference field 4 */
    ref4: string;

    /** Reference field 5 */
    ref5: string;

    /** An array of user groups this user is assigned to */
    groups: UserGroup[];

    /** An array of Campaigns for this User */
    campaigns: Campaign[];

    /** An array of Layouts for this User */
    layouts: Layout[];

    /** An array of Media for this user */
    media: Media[];

    /** An array of Scheduled Events for this User */
    events: Schedule[];

    /** An array of Playlists owned by this User */
    playlists: Playlist[];

    /** The name of home page */
    homePage: string;

    /** Does this Group receive system notifications. */
    isSystemNotification: number;

    /** Does this Group receive system notifications. */
    isDisplayNotification: number;

    /** The two factor type id */
    twoFactorTypeId: number;

    /** Two Factor authorization shared secret for this user */
    twoFactorSecret: string;

    /** Two Factor authorization recovery codes */
    twoFactorRecoveryCodes: string[];

    /** Should we show content added by standard users in relevant grids (1) or content added by the DOOH user? (2). Super admins have an option to change this in their User profile.  */
    showContentFrom: number;
}


export class Users extends Entity<User, null, null> {
    public constructor(server: Xibo) {
        super({
            endPoint: '/user',
            server: server,
        })
    }
}
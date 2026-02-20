import { IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { markAsPokerSession } from './pokerSessionTracker';

export async function createPokerSession(
    title: string,
    parentRoom: IRoom,
    user: IUser,
    read: IRead,
    modify: IModify,
    persistence: IPersistence
): Promise<string> {
    // Create a slugified name from the title
    const slugifiedName = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    // Create the discussion
    const discussionBuilder = modify.getCreator().startDiscussion()
        .setParentRoom(parentRoom)
        .setDisplayName(title)
        .setSlugifiedName(slugifiedName)
        .setCreator(user);

    const discussionId = await modify.getCreator().finish(discussionBuilder);
    
    if (!discussionId) {
        throw new Error('Failed to create discussion');
    }
    
    // Mark this discussion as a poker session
    await markAsPokerSession(discussionId, persistence);
    
    // Send a private notification to the creator
    const discussionRoom = await read.getRoomReader().getById(discussionId);
    
    if (discussionRoom) {
        const appUser = await read.getUserReader().getAppUser();
        if (!appUser) {
            throw new Error('App user not found');
        }
        
        // Send notification only to the creator
        await modify.getNotifier().notifyUser(
            user,
            modify.getCreator().startMessage()
                .setRoom(discussionRoom)
                .setSender(appUser)
                .setText(`🃏 **Poker Planning Session Started**\n\nWelcome to the poker planning session for: **${title}**\n\nAs the session owner, use \`/poker-story\` to add stories for your team to vote on.`)
                .getMessage()
        );
    }
    
    return discussionId;
}
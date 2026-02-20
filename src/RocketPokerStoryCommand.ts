import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { createPokerStoryModal } from './lib/createPokerStoryModal';
import { isPokerSession } from './lib/pokerSessionTracker';

export class RocketPokerStoryCommand implements ISlashCommand {
    public command = 'poker-story';
    public i18nParamsExample = 'poker_story_params_example';
    public i18nDescription = 'poker_story_cmd_description';
    public providesPreview = false;

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const room = context.getRoom();
        
        const appUser = await read.getUserReader().getAppUser();
        if (!appUser) {
            throw new Error('App user not found');
        }
        
        // Check if the command is being run in a discussion
        if (!room.parentRoom) {
            const notifier = modify.getNotifier();
            const message = modify.getCreator().startMessage()
                .setSender(appUser)
                .setRoom(room)
                .setText('❌ The `/poker-story` command can only be used inside a Poker Planning Session discussion. Use `/poker-session` to create a new session first.');
            
            await notifier.notifyUser(context.getSender(), message.getMessage());
            return;
        }
        
        // Check if the discussion was created by the poker app
        const isPokerSessionDiscussion = await isPokerSession(room.id, read);
        if (!isPokerSessionDiscussion) {
            const notifier = modify.getNotifier();
            const message = modify.getCreator().startMessage()
                .setSender(appUser)
                .setRoom(room)
                .setText('❌ The `/poker-story` command can only be used inside a discussion created with `/poker-session`.');
            
            await notifier.notifyUser(context.getSender(), message.getMessage());
            return;
        }
        
        // Check if the user is the session owner (discussion creator)
        if (room.creator.id !== context.getSender().id) {
            const notifier = modify.getNotifier();
            const message = modify.getCreator().startMessage()
                .setSender(appUser)
                .setRoom(room)
                .setText('❌ Only the session owner can create stories. This session was created by ' + room.creator.username + '.');
            
            await notifier.notifyUser(context.getSender(), message.getMessage());
            return;
        }

        const triggerId = context.getTriggerId();

        const data = {
            room: context.getRoom(),
            threadId: context.getThreadId(),
        };

        const question = context.getArguments().join(' ');

        if (triggerId) {
            const modal = await createPokerStoryModal({ question, persistence: persis, modify, data });

            await modify.getUiController().openModalView(modal, { triggerId }, context.getSender());
        }
    }
}
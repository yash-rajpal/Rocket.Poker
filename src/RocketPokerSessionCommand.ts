import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { createPokerSession } from './lib/createPokerSession';

export class RocketPokerSessionCommand implements ISlashCommand {
    public command = 'poker-session';
    public i18nParamsExample = 'poker_session_params_example';
    public i18nDescription = 'poker_session_cmd_description';
    public providesPreview = false;

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const room = context.getRoom();
        const user = context.getSender();
        
        // Get title from arguments or use current date
        let title = context.getArguments().join(' ').trim();
        
        if (!title) {
            const now = new Date();
            title = `Poker Session - ${now.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}`;
        }

        try {
            await createPokerSession(title, room, user, read, modify, persis);
        } catch (error) {
            const appUser = await read.getUserReader().getAppUser();
            if (appUser) {
                await modify.getNotifier().notifyUser(
                    user,
                    modify.getCreator().startMessage()
                        .setRoom(room)
                        .setSender(appUser)
                        .setText(`❌ Failed to create poker session: ${error}`)
                        .getMessage()
                );
            }
        }
    }
}

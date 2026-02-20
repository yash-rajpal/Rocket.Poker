import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

export class RocketPokerHelpCommand implements ISlashCommand {
    public command = 'poker-help';
    public i18nParamsExample = 'poker_help_params_example';
    public i18nDescription = 'poker_help_cmd_description';
    public providesPreview = false;

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const appUser = await read.getUserReader().getAppUser();
        if (!appUser) {
            throw new Error('App user not found');
        }

        const helpMessage = `## 🃏 Rocket.Poker Commands
**\`/poker-session [title]\`** - Create a new planning session
**\`/poker-story\`** - Add a story to vote on (use inside a session)
**\`/poker-help\`** - Show this help

**Quick Start:**
1. Run \`/poker-session\` to create a session
2. Join the discussion that opens
3. Use \`/poker-story\` to add stories
4. Team votes by clicking buttons
5. Owner clicks "Finish Voting" to see results`;

        const notifier = modify.getNotifier();
        const message = modify.getCreator().startMessage()
            .setSender(appUser)
            .setRoom(context.getRoom())
            .setText(helpMessage);
        
        await notifier.notifyUser(context.getSender(), message.getMessage());
    }
}

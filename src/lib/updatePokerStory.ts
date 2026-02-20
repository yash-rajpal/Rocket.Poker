import { IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';

import { IPokerStory } from '../definition';
import { createPokerBlocks } from './createPokerBlocks';
import { getPokerStory } from './getPokerStory';
import { getVotingOptions } from './getVotingOptions';

export async function updatePokerStory(
    msgId: string,
    updates: Partial<Pick<IPokerStory, 'title' | 'storyId' | 'link' | 'description'>>,
    read: IRead,
    modify: IModify,
    persistence: IPersistence
): Promise<void> {
    const story = await getPokerStory(msgId, read);
    
    if (!story) {
        throw new Error('Story not found');
    }

    // Update story fields
    story.title = updates.title ?? story.title;
    story.storyId = updates.storyId ?? story.storyId;
    story.link = updates.link ?? story.link;
    story.description = updates.description ?? story.description;

    // Get settings and voting options
    const showNames = await read.getEnvironmentReader().getSettings().getById('use-user-name');
    const votingOptions = await getVotingOptions(read);

    // Update the message with new blocks
    const message = await read.getMessageReader().getById(msgId);
    if (!message) {
        throw new Error('Message not found');
    }

    const appUser = await read.getUserReader().getAppUser();
    if (!appUser) {
        throw new Error('App user not found');
    }

    const block = modify.getCreator().getBlockBuilder();
    createPokerBlocks(block, story, showNames.value, votingOptions);

    const updater = await modify.getUpdater().message(msgId, appUser);
    updater.setEditor(appUser);
    updater.setBlocks(block);

    await modify.getUpdater().finish(updater);

    // Update persistence
    const association = new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, msgId);
    await persistence.updateByAssociation(association, story);
}

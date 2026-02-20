import { IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';

import { IPokerStory } from '../definition';

export async function getPokerStory(msgId: string, read: IRead): Promise<IPokerStory | null> {
    const association = new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, msgId);
    const [result] = await read.getPersistenceReader().readByAssociation(association) as Array<IPokerStory>;

    return result;
}

import { IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';

export async function markAsPokerSession(discussionId: string, persistence: IPersistence): Promise<void> {
    const association = new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, `poker-session-${discussionId}`);
    await persistence.createWithAssociation({ discussionId, isPokerSession: true }, association);
}

export async function isPokerSession(discussionId: string, read: IRead): Promise<boolean> {
    const association = new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, `poker-session-${discussionId}`);
    const [result] = await read.getPersistenceReader().readByAssociation(association);
    return !!result;
}

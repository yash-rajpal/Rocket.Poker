import { IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

import { IPokerStory } from '../definition';

export async function storePokerVote(story: IPokerStory, voteIndex: number, { id, username, name }: IUser, { persis }: { persis: IPersistence }) {
    const association = new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, story.msgId);

    const voter = { id, username, name };

    const findVoter = ({ id: voterId }) => voterId === id;

    // Check if user already voted
    const previousVote = story.votes.findIndex(({ voters }) => voters.some(findVoter));

    const hasVoted = story.votes[voteIndex].voters.findIndex(findVoter);

    if (hasVoted !== -1) {
        // User is un-voting
        story.totalVotes--;
        story.votes[voteIndex].quantity--;
        story.votes[voteIndex].voters.splice(hasVoted, 1);
    } else {
        // User is voting
        story.totalVotes++;
        story.votes[voteIndex].quantity++;
        story.votes[voteIndex].voters.push(voter);
    }

    // Remove previous vote if user voted for different option (single choice)
    if (hasVoted === -1 && previousVote !== -1) {
        story.totalVotes--;
        story.votes[previousVote].quantity--;
        story.votes[previousVote].voters = story.votes[previousVote].voters.filter(({ id: voterId }) => voterId !== id);
    }

    return persis.updateByAssociation(association, story);
}

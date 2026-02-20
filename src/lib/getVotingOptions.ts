import { IRead } from '@rocket.chat/apps-engine/definition/accessors';

const DEFAULT_VOTING_OPTIONS = ['1', '2', '3', '5', '8', '13', '☕ Coffee'];

export async function getVotingOptions(read: IRead): Promise<string[]> {
    try {
        const votingOptionsSetting = await read.getEnvironmentReader().getSettings().getById('voting-options');
        
        if (!votingOptionsSetting || !votingOptionsSetting.value) {
            console.warn('Voting options setting not found, using defaults');
            return DEFAULT_VOTING_OPTIONS;
        }
        
        const options = (votingOptionsSetting.value as string)
            .split(',')
            .map(opt => opt.trim())
            .filter(opt => opt.length > 0);
        
        if (options.length === 0) {
            console.warn('Voting options setting is empty, using defaults');
            return DEFAULT_VOTING_OPTIONS;
        }
        
        return options;
    } catch (error) {
        console.error('Error reading voting options setting, using defaults:', error);
        return DEFAULT_VOTING_OPTIONS;
    }
}

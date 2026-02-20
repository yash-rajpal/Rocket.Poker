import { IModify, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';
import { IUIKitModalViewParam } from '@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder';

import { IModalContext, IPokerStory } from '../definition';
import { uuid } from './uuid';

export async function createPokerStoryModal({ id = '', question, persistence, data, modify, options = 2, existingStory, isEdit = false }: {
    id?: string,
    question?: string,
    persistence: IPersistence,
    data: IModalContext,
    modify: IModify,
    options?: number,
    existingStory?: IPokerStory,
    isEdit?: boolean,
}): Promise<IUIKitModalViewParam> {
    const viewId = id || `poker-story-modal-${uuid()}`;

    // If editing, store the message ID in the data
    if (isEdit && existingStory) {
        data = { ...data, msgId: existingStory.msgId };
    }

    const association = new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, viewId);
    await persistence.createWithAssociation(data, association);

    const block = modify.getCreator().getBlockBuilder();
    
    // Title input (required)
    block.addInputBlock({
        blockId: 'storyTitle',
        optional: false,
        element: block.newPlainTextInputElement({ 
            initialValue: existingStory?.title || question, 
            actionId: 'title' 
        }),
        label: block.newPlainTextObject('Title*'),
    });

    // ID input (optional)
    block.addInputBlock({
        blockId: 'storyId',
        optional: true,
        element: block.newPlainTextInputElement({ 
            initialValue: existingStory?.storyId || '', 
            actionId: 'id',
            placeholder: block.newPlainTextObject('e.g., JIRA-123')
        }),
        label: block.newPlainTextObject('ID'),
    });

    // Link input (optional)
    block.addInputBlock({
        blockId: 'storyLink',
        optional: true,
        element: block.newPlainTextInputElement({ 
            initialValue: existingStory?.link || '', 
            actionId: 'link',
            placeholder: block.newPlainTextObject('https://...')
        }),
        label: block.newPlainTextObject('Link'),
    });

    // Description input (optional)
    block.addInputBlock({
        blockId: 'storyDescription',
        optional: true,
        element: block.newPlainTextInputElement({ 
            initialValue: existingStory?.description || '', 
            actionId: 'description', 
            multiline: true 
        }),
        label: block.newPlainTextObject('Description'),
    });

    // Visibility options (only show for new stories, not edits)
    if (!isEdit) {
        block.addInputBlock({
            blockId: 'storyConfig',
            element: block.newStaticSelectElement({
                placeholder: block.newPlainTextObject('Closed voting'),
                actionId: 'visibility',
                initialValue: 'closed',
                options: [
                    {
                        text: block.newPlainTextObject('Closed voting (results shown after finish)'),
                        value: 'closed',
                    },
                    {
                        text: block.newPlainTextObject('Open voting (results shown in real-time)'),
                        value: 'open',
                    },
                ],
            }),
            label: block.newPlainTextObject('Visibility'),
        });
    }

    return {
        id: viewId,
        title: block.newPlainTextObject(isEdit ? 'Edit story' : 'Create story'),
        submit: block.newButtonElement({
            text: block.newPlainTextObject(isEdit ? 'Save' : 'Create'),
        }),
        close: block.newButtonElement({
            text: block.newPlainTextObject('Cancel'),
        }),
        blocks: block.getBlocks(),
    };
}
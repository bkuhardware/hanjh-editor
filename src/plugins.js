import { RichUtils, KeyBindingUtil } from 'draft-js';
import { has } from 'immutable';
const { hasCommandModifier } = KeyBindingUtil;

export const createHighlightPlugin = () => {
    return {
        toggle: (editorState, handleChange) => {
            handleChange(RichUtils.toggleInlineStyle(editorState, 'HIGHLIGHT'))
        },
        plugin: {
            customStyleMap: {
                HIGHLIGHT: {
                    background: 'tomato',
                    padding: '3px',
                    borderRadius: '2px',
                    border: '0.2px solid tomato',
                    color: 'white',
                }
            },
            keyBindingFn: e => {
                if (e.keyCode === 72 && hasCommandModifier(e)) {
                    return 'highlight';
                }
            },
            handleKeyCommand: (command, editorState, { setEditorState }) => {
                if (command === 'highlight') {
                    setEditorState(RichUtils.toggleInlineStyle(editorState, 'HIGHLIGHT'));
                    return true;
                }
            }
        }
    }
};

export const createCodePlugin = (className = null) => {
    let extra = {};
    if (className) 
        extra = {
            blockStyleFn: (contentBlock) => {
                const blockType = contentBlock.getType();
                if (blockType === 'code-block') return className;
            }
        };
    return {
        toggle: (editorState, handleChange) => {
            handleChange(RichUtils.toggleBlockType(editorState, 'code-block'));
        },
        plugin: {
            ...extra,
            keyBindingFn: e => {
                if (e.keyCode === 66 && hasCommandModifier(e))
                    return 'code-block';
            },
            handleKeyCommand: (command, editorState, { setEditorState }) => {
                if (command === 'code-block') {
                    setEditorState(RichUtils.toggleBlockType(editorState, 'code-block'));
                    return true;
                }
            },
        }
    }
};

export const createListPlugin = (select = null) => {
    
}
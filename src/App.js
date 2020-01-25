import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import styles from './App.module.scss';

const ButtonGroup = Button.Group;

const App = () => {
	
	const [editorState, saveEditorState] = useState(EditorState.createEmpty());
	const [bold, saveBold] = useState(false);
	const [italic, saveItalic] = useState(false);
	const [underline, saveUnderline] = useState(false);
	const handleChangeEditor = editorState => {
		saveEditorState(editorState);
	};
	const handleKeyCommand = command => {
		const newEditorState = RichUtils.handleKeyCommand(editorState, command);
		if (newEditorState) {
			saveEditorState(newEditorState);
			return 'handled';
		}
		return 'not-handled';
	};
	const handleBold = (e) => {
		e.preventDefault();
		const selectionState = editorState.getSelection();
		if (selectionState.getAnchorKey() === selectionState.getFocusKey() && selectionState.getAnchorOffset() === selectionState.getFocusOffset()) {
			saveBold(!bold);
		}
		saveEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));

	};
	const handleItalic = (e) => {
		e.preventDefault();
		const selectionState = editorState.getSelection();
		if (selectionState.getAnchorKey() === selectionState.getFocusKey() && selectionState.getAnchorOffset() === selectionState.getFocusOffset()) {
			saveItalic(!italic);
		}
		saveEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
	};
	const handleUnderline = (e) => {
		e.preventDefault();
		const selectionState = editorState.getSelection();
		if (selectionState.getAnchorKey() === selectionState.getFocusKey() && selectionState.getAnchorOffset() === selectionState.getFocusOffset()) {
			saveUnderline(!underline);
		}
		saveEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
	};
	// const handleBeforeInput = (chars, editorState) => {
	// 	console.log(chars);
	// 	console.log(editorState.getCurrentContent().toJS())
	// }
	return (
		<div className={styles.container}>
			<div className={styles.inlineDiv}>
				<div className={styles.title}>Hanjh Editor</div>
				<div className={styles.main}>
					<div className={styles.btns}>
						<ButtonGroup>
							<Button icon="bold" onMouseDown={handleBold} style={{ color: bold ? "#FE7F9C" : "inherit"}}/>
							<Button icon="italic" onMouseDown={handleItalic} style={{ color: italic ? "#FE7F9C" : "inherit"}} />
							<Button icon="underline" onMouseDown={handleUnderline} style={{ color: underline ? "#FE7F9C" : "inherit"}}/>
						</ButtonGroup>
					</div>
					<div className={styles.editor} onClick={() => }>
						<Editor
							editorState={editorState}
							onChange={handleChangeEditor}
							placeholder="Enter content..."
							handleKeyCommand={handleKeyCommand}
							//handleBeforeInput={handleBeforeInput}
						/>
					</div>
					
				</div>
			</div>
			
		</div>
	)
};

export default App;
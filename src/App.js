import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import styles from './App.module.scss';

const ButtonGroup = Button.Group;

const App = () => {
	const editorRef = useRef(null);
	const [editorState, saveEditorState] = useState(EditorState.createEmpty());
	const handleChangeEditor = editorState => {
		saveEditorState(editorState);
	};
	const handleKeyCommand = command => {
		const newEditorState = RichUtils.handleKeyCommand(editorState, command);
		if (newEditorState) {
			handleChangeEditor(newEditorState);
			return 'handled';
		}
		return 'not-handled';
	};
	const handleFocus = () => {
		editorRef.current.focus();
	};
	const hanldeInlineStyle = inlineStyle => e => {
		e.preventDefault();
		handleChangeEditor(RichUtils.toggleInlineStyle(editorState, inlineStyle));
	};
	const activeStyle = inlineStyle => {
		const active = currentInlineStyles.has(inlineStyle);
		if (active) return {
			color: '#FE7F9C',
			borderColor: '#FE7F9C',
			zIndex: 3
		};
		return {};
	}
	// const handleBeforeInput = (chars, editorState) => {
	// 	console.log(chars);
	// 	console.log(editorState.getCurrentContent().toJS())
	// }
	const currentInlineStyles = editorState.getCurrentInlineStyle();
	return (
		<div className={styles.container}>
			<div className={styles.inlineDiv}>
				<div className={styles.title}>Hanjh Editor</div>
				<div className={styles.main}>
					<div className={styles.btns}>
						<ButtonGroup>
							<Button icon="bold" onMouseDown={hanldeInlineStyle('BOLD')} style={activeStyle('BOLD')}/>
							<Button icon="italic" onMouseDown={hanldeInlineStyle('ITALIC')} style={activeStyle('ITALIC')} />
							<Button icon="underline" onMouseDown={hanldeInlineStyle('UNDERLINE')} style={activeStyle('UNDERLINE')}/>
							<Button icon="arrow-up" onClick={handleFocus} />
						</ButtonGroup>
					</div>
					<div className={styles.editor} onClick={handleFocus}>
						<Editor
							ref={editorRef}
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
import React, { useState, useRef } from 'react';
import { Button, Tooltip } from 'antd';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import styles from './App.module.scss';

const ButtonGroup = Button.Group;

const activeCSS = {
	color: '#FE7F9C',
	borderColor: '#FE7F9C',
	zIndex: 3
};

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
	const blockStyleFn = contentBlock => {
		const blockType = contentBlock.getType();
		if (blockType === 'code-block') {
			return styles.codeBlock;
		}
	}
	const handleFocus = () => {
		editorRef.current.focus();
	};
	const hanldeInlineStyle = inlineStyle => e => {
		e.preventDefault();
		handleChangeEditor(RichUtils.toggleInlineStyle(editorState, inlineStyle));
	};
	const handleBlock = blockType => e => {
		e.preventDefault();
		handleChangeEditor(RichUtils.toggleBlockType(editorState, blockType));
	};
	const activeStyle = inlineStyle => {
		const active = editorState.getCurrentInlineStyle().has(inlineStyle);
		if (active) return activeCSS;
		return {};
	};
	const activeBlock = blockType => {
		const selectionState = editorState.getSelection();
		const active = editorState.getCurrentContent().getBlockForKey(selectionState.getStartKey()).getType() === blockType;
		if (active) return activeCSS;
		return {}
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
							<Tooltip placement="bottom" title="Bold">
								<Button icon="bold" onMouseDown={hanldeInlineStyle('BOLD')} style={activeStyle('BOLD')}></Button>
							</Tooltip>
							<Tooltip placement="bottom" title="Italic">
								<Button icon="italic" onMouseDown={hanldeInlineStyle('ITALIC')} style={activeStyle('ITALIC')} />
							</Tooltip>
							<Tooltip placement="bottom" title="Underline">
								<Button icon="underline" onMouseDown={hanldeInlineStyle('UNDERLINE')} style={activeStyle('UNDERLINE')}/>
							</Tooltip>
							<Tooltip placement="bottom" title="Highlight">
								<Button icon="highlight" />
							</Tooltip>
							<Tooltip placement="bottom" title="Code block">
								<Button icon="code" onMouseDown={handleBlock('code-block')} style={activeBlock('code-block')} />
							</Tooltip>
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
							blockStyleFn={blockStyleFn}
							//handleBeforeInput={handleBeforeInput}
						/>
					</div>
					
				</div>
			</div>
			
		</div>
	)
};

export default App;
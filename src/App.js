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

const customStyleMap = {
	'HIGHLIGHT': {
		background: '#FE7F9C',
		padding: '3px',
		borderRadius: '2px',
		border: '0.2px solid #FE7F9C',
		color: 'white',
	}
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
	const handleInlineStyle = inlineStyle => e => {
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
							<Tooltip placement="bottom" title="Header one">
								<Button onMouseDown={handleBlock('header-one')} style={activeBlock('header-one')}>H1</Button>
							</Tooltip>
							<Tooltip placement="bottom" title="Header two">
								<Button onMouseDown={handleBlock('header-two')} style={activeBlock('header-two')}>H2</Button>
							</Tooltip>
							<Tooltip placement="bottom" title="Header three">
								<Button onMouseDown={handleBlock('header-three')} style={activeBlock('header-three')}>H3</Button>
							</Tooltip>
							<Tooltip placement="bottom" title="Header four">
								<Button onMouseDown={handleBlock('header-four')} style={activeBlock('header-four')}>H4</Button>
							</Tooltip>
							<Tooltip placement="bottom" title="Header five">
								<Button onMouseDown={handleBlock('header-five')} style={activeBlock('header-five')}>H5</Button>
							</Tooltip>
							<Tooltip placement="bottom" title="Header six">
								<Button onMouseDown={handleBlock('header-six')} style={activeBlock('header-six')}>H6</Button>
							</Tooltip>
							<Tooltip placement="bottom" title="Bold">
								<Button icon="bold" onMouseDown={handleInlineStyle('BOLD')} style={activeStyle('BOLD')}></Button>
							</Tooltip>
							<Tooltip placement="bottom" title="Italic">
								<Button icon="italic" onMouseDown={handleInlineStyle('ITALIC')} style={activeStyle('ITALIC')} />
							</Tooltip>
							<Tooltip placement="bottom" title="Underline">
								<Button icon="underline" onMouseDown={handleInlineStyle('UNDERLINE')} style={activeStyle('UNDERLINE')}/>
							</Tooltip>
							<Tooltip placement="bottom" title="Highlight">
								<Button icon="highlight" onMouseDown={handleInlineStyle('HIGHLIGHT')} style={activeStyle('HIGHLIGHT')}/>
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
							customStyleMap={customStyleMap}
							//handleBeforeInput={handleBeforeInput}
						/>
					</div>
					
				</div>
			</div>
			
		</div>
	)
};

export default App;
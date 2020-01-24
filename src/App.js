import React, { useState } from 'react';
import { Button } from 'antd';
import { Editor, EditorState, RichUtils } from 'draft-js';
import styles from './App.module.scss';

const ButtonGroup = Button.Group;

const App = () => {
	const [editorState, saveEditorState] = useState(EditorState.createEmpty());
	const hanldeChangeEditor = editorState => {
		saveEditorState(editorState);
	}
	return (
		<div className={styles.container}>
			<div className={styles.title}>Hanjh Editor</div>
			<div className={styles.main}>
				<div className={styles.btns}>
					<ButtonGroup>
						<Button icon="bold" />
						<Button icon="italic" />
						<Button icon="underline" />
					</ButtonGroup>
				</div>
				<div className={styles.editor}>
					<Editor
						editorState={editorState}
						onChange={hanldeChangeEditor}
						placeholder="Enter content..."
					/>
				</div>
				
			</div>
		</div>
	)
};

export default App;
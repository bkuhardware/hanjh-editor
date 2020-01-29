import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import { EditorState } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import styles from './Editor.module.scss';

const MyEditor = () => {
    const [editorState, saveEditorState] = useState(EditorState.createEmpty());
    const handleChangeEditor = editorState => saveEditorState(editorState);
    return (
        <div className={styles.container}>
            <div className={styles.inlineDiv}>
                <div className={styles.title}>Hanjh Editor</div>
                <div className={styles.main}>
                    <div className={styles.btns}>
                        <Link to="/raw">
                            <Icon type="right-circle" style={{ fontSize: '1.2em', marginRight: '8px', position: 'relative', top: '3px' }}/>
                            Redirect to raw editor.
                        </Link>
                    </div>
                    <div className={styles.editor}>
                        <Editor
                            editorState={editorState}
                            onChange={handleChangeEditor}
                            placeholder="Enter content..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyEditor;
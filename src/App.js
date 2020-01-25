import React, { useState, useRef } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { Button, Tooltip, Popover } from 'antd';
import { Editor, EditorState, RichUtils, Modifier, convertToRaw } from 'draft-js';
import styles from './App.module.scss';

const ButtonGroup = Button.Group;

const activeCSS = {
	color: '#FE7F9C',
	borderColor: '#FE7F9C',
	zIndex: 3
};

const customColorMap = {
	'BLACK': {
		color: 'rgba(0, 0, 0, 0.65)'
	},
	'RED': {
		color: 'rgba(255, 0, 0, 0.65)'
	},
	'BLUE': {
		color: 'rgba(0, 0, 255, 0.65)'
	},
	'LIME': {
		color: 'rgba(0, 255, 0, 0.65)'
	},
	'YELLOW': {
		color: 'rgb(255, 255, 0)'
	},
	'CYAN': {
		color: 'rgb(0, 255, 255)'
	},
	'MAGENTA': {
		color: 'rgb(255, 0, 255)'
	},
	'SILVER': {
		color: 'rgb(192, 192, 192)'
	},
	'GRAY': {
		color: 'rgb(128, 128, 128)'
	},
	'MAROON': {
		color: 'rgb(128, 0, 0)'
	},
	'OLIVE': {
		color: 'rgb(128, 128, 0)'
	},
	'GREEN': {
		color: 'rgb(0, 128, 0)'
	},
	'PURPLE': {
		color: 'rgb(128, 0, 128)'
	},
	'TEAL': {
		color: 'rgb(0, 128, 128)'
	},
	'WHITE': {
		color: 'rgb(255, 255, 255)'
	}
};

const customStyleMap = {
	'HIGHLIGHT': {
		background: '#FE7F9C',
		padding: '3px',
		borderRadius: '2px',
		border: '0.2px solid #FE7F9C',
		color: 'white',
	},
	...customColorMap
};

const App = () => {
	const editorRef = useRef(null);
	const [editorState, saveEditorState] = useState(EditorState.createEmpty());
	const [colorPopoverVisible, saveColorPopoverVisible] = useState(false);
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
	const handleToggleColor = color => e => {
		e.preventDefault();
		const selection = editorState.getSelection();

		// Let's just allow one color at a time. Turn off all active colors.
		const nextContentState = _.keys(customColorMap)
		.reduce((contentState, color) => {
			return Modifier.removeInlineStyle(contentState, selection, color)
		}, editorState.getCurrentContent());

		let nextEditorState = EditorState.push(
			editorState,
			nextContentState,
			'change-inline-style'
		);

		const currentStyle = editorState.getCurrentInlineStyle();

		// Unset style override for current color.
		if (selection.isCollapsed()) {
			nextEditorState = currentStyle.reduce((state, color) => {
				return !!customColorMap[color] ? RichUtils.toggleInlineStyle(state, color) : state;
			}, nextEditorState);
		}

		// If the color is being toggled on, apply it.
		if (!currentStyle.has(color)) {
			nextEditorState = RichUtils.toggleInlineStyle(
				nextEditorState,
				color
			);
		}

		handleChangeEditor(nextEditorState);
		saveColorPopoverVisible(false);
	};
	const handleVisibleChange = e => {
		e.preventDefault();
		saveColorPopoverVisible(!colorPopoverVisible);
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
	const customColorMapKeys = _.keys(customColorMap);
	let colorData = _.map(customColorMapKeys, colorKey => ({
		key: colorKey,
		...customColorMap[colorKey]
	}));
	colorData = _.chunk(colorData, 5);
	const currentInlineStyle = editorState.getCurrentInlineStyle();
	let activeKey;
	for (let i = 0; i < customColorMapKeys.length; ++i) {
		if (currentInlineStyle.has(customColorMapKeys[i])) {
			activeKey = customColorMapKeys[i];
			break;
		}
	}
	if (!activeKey) activeKey = 'BLACK';
	//const toggleColorPopoverVisible = () => saveColorPopoverVisible(!colorPopoverVisible);
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
							<Popover
								placement="bottomLeft"
								content={(
									<div>
										<div className={styles.header}>Select color</div>
										<div className={styles.colors}>
											{_.map(colorData, colorRow => (
												<div key={_.uniqueId('color_row_')} className={styles.row}>
													{_.map(colorRow, color => (
														<span 
															className={activeKey === color.key ? classNames(styles.active, styles.color) : styles.color}
															key={color.key}
															onMouseDown={handleToggleColor(color.key)}
														>
															<span className={styles.icon} style={{ backgroundColor: color.color }}/>
														</span>
													))}
												</div>
											))}
										</div>
									</div>
								)}
								popupClassName={styles.popover}
								trigger="click"
								visible={colorPopoverVisible}
								// onVisibleChange={saveColorPopoverVisible}
							>
								<Button icon="font-colors" onMouseDown={handleVisibleChange} style={{ color: customColorMap[activeKey].color }}/>
							</Popover>
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
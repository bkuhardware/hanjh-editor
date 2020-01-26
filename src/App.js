import React, { useState, useRef } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { Button, Tooltip, Popover, Dropdown, Menu, Icon } from 'antd';
import { Editor, EditorState, RichUtils, Modifier, convertToRaw } from 'draft-js';
import styles from './App.module.scss';
import { underline } from 'ansi-colors';

const ButtonGroup = Button.Group;
const MenuItem = Menu.Item;

const activeCSS = {
	color: '#FE7F9C',
	borderColor: '#FE7F9C',
	zIndex: 3
};

const headers = [
	{
		type: 'header-one',
		title: 'Header one'
	},
	{
		type: 'header-two',
		title: 'Header two'
	},
	{
		type: 'header-three',
		title: 'Header three'
	},
	{
		type: 'header-four',
		title: 'Header four'
	},
	{
		type: 'header-five',
		title: 'Header five'
	},
	{
		type: 'header-six',
		title: 'Header six'
	}
];

const lists =[
	{
		type: 'unordered-list-item',
		title: 'Unordered list',
		icon: 'unordered-list'
	},
	{
		type: 'ordered-list-item',
		title: 'Ordered list',
		icon: 'ordered-list'
	}
];

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
	const [headerVisible, saveHeaderVisible] = useState(false);
	const [listVisible, saveListVisible] = useState(false);
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
	const handleBlock = (blockType, callback) => e => {
		e.preventDefault();
		handleChangeEditor(RichUtils.toggleBlockType(editorState, blockType));
		if (callback) callback();
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
	const getBlockType = () => {
		const selectionState = editorState.getSelection();
		return editorState.getCurrentContent().getBlockForKey(selectionState.getStartKey()).getType();
	};
	const activeStyle = inlineStyle => {
		const active = editorState.getCurrentInlineStyle().has(inlineStyle);
		if (active) return activeCSS;
		return {};
	};
	const activeBlock = blockType => {
		if (getBlockType() === blockType) return activeCSS;
		return {}
	};
	const activeHeader = () => {
		const active = _.startsWith(getBlockType(), 'header-');
		if (active) return activeCSS;
		return {}
	};
	const getListIcon = () => {
		const blockType = getBlockType();
		if (blockType === 'unordered-list-item') return 'unordered-list';
		if (blockType === 'ordered-list-item') return 'ordered-list';
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
							<Dropdown
								trigger={['hover']}
								overlay={(
									<Menu
										selectedKeys={[getBlockType()]}
									>
										{_.map(headers, header => (
											<MenuItem key={header.type}>
												<span onMouseDown={handleBlock(header.type, () => saveHeaderVisible(false))}>{header.title}</span>
											</MenuItem>
										))}
									</Menu>
								)}
								overlayClassName={styles.overlay}
								visible={headerVisible}
								placement="bottomCenter"
								onVisibleChange={saveHeaderVisible}
							>
								<Button style={activeHeader()}>H</Button>
							</Dropdown>
							<Dropdown
								trigger={['hover']}
								overlay={(
									<Menu
										selectedKeys={[getBlockType()]}
									>
										{_.map(lists, list => (
											<MenuItem key={list.type}>
												<span onMouseDown={handleBlock(list.type, () => saveListVisible(false))}>
													<Icon type={list.icon} style={{ fontSize: '16px', marginRight: '6px' }}/>
													<span>{list.title}</span>
												</span>
											</MenuItem>
										))}
									</Menu>
								)}
								overlayClassName={styles.overlay}
								visible={listVisible}
								placement="bottomLeft"
								onVisibleChange={saveListVisible}
							>
								<Button icon={getListIcon()}/>
							</Dropdown>
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
								trigger="hover"
								visible={colorPopoverVisible}
								onVisibleChange={saveColorPopoverVisible}
							>
								<Button icon="font-colors" style={{ color: customColorMap[activeKey].color }}/>
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
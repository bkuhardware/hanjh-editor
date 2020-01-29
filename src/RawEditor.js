import React, { useState, useRef } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import * as config from './config';
import { Button, Tooltip, Popover, Dropdown, Menu, Icon, Input } from 'antd';
import { EditorState, RichUtils, Modifier, CompositeDecorator } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createEmojiPlugin from 'draft-js-emoji-plugin';

import styles from './RawEditor.module.scss';
import 'draft-js-emoji-plugin/lib/plugin.css'

const emojiPlugin = createEmojiPlugin();
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;

const ButtonGroup = Button.Group;
const MenuItem = Menu.Item;
const { Search } = Input;

const findLinkEntity = (contentBlock, callback, contentState) => {
	contentBlock.findEntityRanges((character) => {
		const entityKey = character.getEntity();
		if (entityKey === null) {
			return false;
		}
		return contentState.getEntity(entityKey).getType() === 'LINK';
	}, callback);
};

const Link = ({ contentState, entityKey, children }) => {
	const { href } = contentState.getEntity(entityKey).getData();
	return (
		<Tooltip placement="top" title={`Link to https://${href}`}><span className={styles.link} onClick={e => window.location.href = `https://${href}`}>{children}</span></Tooltip>
	);
};

const checkHref = href => {
	const hrefRegex = /^([a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+.*)$/;
	return hrefRegex.test(href);
};

const RawEditor = () => {
	const editorRef = useRef(null);
	const decorator = new CompositeDecorator([
		{
			strategy: findLinkEntity,
			component: Link
		}
	]);
	const [editorState, saveEditorState] = useState(EditorState.createEmpty(decorator));
	const [colorPopoverVisible, saveColorPopoverVisible] = useState(false);
	const [headerVisible, saveHeaderVisible] = useState(false);
	const [listVisible, saveListVisible] = useState(false);
	const [alignVisible, saveAlignVisible] = useState(false);
	const [linkVisible, saveLinkVisible] = useState(false);
	const [href, saveHref] = useState('');
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
		if (_.endsWith(blockType, 'align-center')) {
			return styles.centerAlign;
		}
		if (_.endsWith(blockType, 'align-right')) {
			return styles.rightAlign;
		}
	};
	const handleFocus = () => {
		editorRef.current.focus();
	};
	const handleChangeHref = e => {
		saveHref(e.target.value);
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
	const handleAlignBlock = (alignType, callback) => e => {
		e.preventDefault();
		const parts = _.split(getBlockType(), '_');
		const currentBlockType = parts[0];
		if (currentBlockType !== 'code-block') {
			if (!parts[1]) {
				if (alignType !== 'align-left') handleChangeEditor(RichUtils.toggleBlockType(editorState, `${currentBlockType}_${alignType}`));
			}
			else {
				if (parts[1] === alignType || alignType === 'align-left') {
					handleChangeEditor(RichUtils.toggleBlockType(editorState,  currentBlockType));
				}
				else {
					handleChangeEditor(RichUtils.toggleBlockType(editorState, `${currentBlockType}_${alignType}`));
				}
			}
		}
		if (callback) callback();
	};
	const handleAddLink = e => {
		const selection = editorState.getSelection();
		const contentState = editorState.getCurrentContent();
		let newContentState = contentState.createEntity('LINK', 'MUTABLE', { href });
		const entityKey = newContentState.getLastCreatedEntityKey();
		newContentState = Modifier.applyEntity(
			newContentState,
			selection,
			entityKey
		);
		const newEditorState = EditorState.push(
			editorState,
			newContentState,
			'add-new-link'
		);
		handleChangeEditor(newEditorState);
		saveLinkVisible(false);
		saveHref('');
	};
	const handleToggleColor = color => e => {
		e.preventDefault();
		const selection = editorState.getSelection();

		// Let's just allow one color at a time. Turn off all active colors.
		const nextContentState = _.keys(config.customColorMap)
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
				return !!config.customColorMap[color] ? RichUtils.toggleInlineStyle(state, color) : state;
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
		if (active) return config.activeCSS;
		return {};
	};
	const activeBlock = blockType => {
		if (getBlockType() === blockType) return config.activeCSS;
		return {}
	};
	const activeHeader = () => {
		const active = _.startsWith(getBlockType(), 'header-');
		if (active) return config.activeCSS;
		return {}
	};
	const getListIcon = () => {
		const blockType = _.split(getBlockType(), '_')[0];
		if (blockType === 'unordered-list-item') return 'unordered-list';
		if (blockType === 'ordered-list-item') return 'ordered-list';
		return 'unordered-list';
	};
	const getAlignKeyAndIcon = () => {
		const blockType = getBlockType();
		if (_.endsWith(blockType, '_align-center')) return 'align-center';
		if (_.endsWith(blockType, '_align-right')) return 'align-right';
		return 'align-left';
	};
	const customColorMapKeys = _.keys(config.customColorMap);
	let colorData = _.map(customColorMapKeys, colorKey => ({
		key: colorKey,
		...config.customColorMap[colorKey]
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
				<div className={styles.title}>Raw Hanjh Editor</div>
				<div className={styles.main}>
					<div className={styles.btns}>
                        <div className={styles.emojiBtn}>
                            <Tooltip placement="bottom" title="Emoji">
                                <EmojiSelect />
                            </Tooltip>
                        </div>
						<ButtonGroup>
							<Dropdown
								trigger={['hover']}
								overlay={(
									<Menu
										selectedKeys={[_.split(getBlockType(), '_')[0]]}
									>
										{_.map(config.headers, header => (
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
										selectedKeys={[_.split(getBlockType(), '_')[0]]}
									>
										{_.map(config.lists, list => (
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
							<Tooltip placement="bottom" title="Code block">
								<Button icon="code" onMouseDown={handleBlock('code-block')} style={activeBlock('code-block')} />
							</Tooltip>
							<Popover
								placement="bottomLeft"
								popupClassName={styles.linkPopover}
								trigger="hover"
								visible={linkVisible}
								onVisibleChange={saveLinkVisible}
								content={(
									<div className={styles.content}>
										<Search addonBefore={<span>https://</span>} enterButton={<Button type="primary" icon="check" disabled={!checkHref(href)} style={{ width: 60 }}/>} value={href} placeholder="Enter href..." onChange={handleChangeHref} onSearch={handleAddLink} />
									</div>
								)}
							>
								<Button icon="link" />
							</Popover>
							<Tooltip placement="bottom" title="Bold">
								<Button icon="bold" onMouseDown={handleInlineStyle('BOLD')} style={activeStyle('BOLD')}></Button>
							</Tooltip>
							<Tooltip placement="bottom" title="Italic">
								<Button icon="italic" onMouseDown={handleInlineStyle('ITALIC')} style={activeStyle('ITALIC')} />
							</Tooltip>
							<Tooltip placement="bottom" title="Underline">
								<Button icon="underline" onMouseDown={handleInlineStyle('UNDERLINE')} style={activeStyle('UNDERLINE')}/>
							</Tooltip>
							<Dropdown
								trigger={['hover']}
								placement="bottomLeft"
								overlay={(
									<Menu
										selectedKeys={[getAlignKeyAndIcon()]}
									>
										{_.map(config.aligns, alignVal => (
											<MenuItem key={alignVal.type}>
												<span onMouseDown={handleAlignBlock(alignVal.type, () => saveAlignVisible(false))}>
													<Icon type={alignVal.icon} style={{ fontSize: '16px', marginRight: '6px' }}/>
													<span>{alignVal.title}</span>
												</span>
											</MenuItem>
										))}
									</Menu>
								)}
								visible={alignVisible}
								onVisibleChange={saveAlignVisible}
							>
								<Button icon={getAlignKeyAndIcon()} />
							</Dropdown>
							<Tooltip placement="bottom" title="Highlight">
								<Button icon="highlight" onMouseDown={handleInlineStyle('HIGHLIGHT')} style={activeStyle('HIGHLIGHT')}/>
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
								<Button icon="font-colors" style={{ color: config.customColorMap[activeKey].color }}/>
							</Popover>
							<Tooltip placement="bottom" title="Focus">
                                <Button icon="enter" onClick={handleFocus} />
                            </Tooltip>
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
							customStyleMap={config.customStyleMap}
							blockRenderMap={config.extendedBlockRenderMap}
                            plugins={[emojiPlugin]}
							//handleBeforeInput={handleBeforeInput}
						/>
                        
					</div>
					
				</div>
			</div>
			<EmojiSuggestions />     
		</div>
	)
};

export default RawEditor;
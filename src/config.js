import React from 'react';
import immutable from 'immutable';
import { DefaultDraftBlockRenderMap } from 'draft-js';

const blockRenderMap = immutable.Map({
    'header-one_align-right': {
        element: 'h1'
    },
    'header-two_align-right': {
        element: 'h2'
    },
    'header-three_align-right': {
        element: 'h3'
    },
    'header-four_align-right': {
        element: 'h4'
    },
    'header-five_align-right': {
        element: 'h5'
    },
    'header-six_align-right': {
        element: 'h6'
    },
    'header-one_align-center': {
        element: 'h1'
    },
    'header-two_align-center': {
        element: 'h2'
    },
    'header-three_align-center': {
        element: 'h3'
    },
    'header-four_align-center': {
        element: 'h4'
    },
    'header-five_align-center': {
        element: 'h5'
    },
    'header-six_align-center': {
        element: 'h6'
    },
    'unordered-list-item_align-right': {
        element: 'li',
        wrapper: <ul />
    },
    'ordered-list-item_align-right': {
        element: 'li',
        wrapper: <ol />
    },
    'unordered-list-item_align-center': {
        element: 'li',
        wrapper: <ul />
    },
    'ordered-list-item_align-center': {
        element: 'li',
        wrapper: <ol />
    },
    'unstyled_align-right': {
        element: 'div'
    },
    'unstyled_align-center': {
        element: 'div'
    }
});

export const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

export const activeCSS = {
	color: '#FE7F9C',
	borderColor: '#FE7F9C',
	zIndex: 3
};

export const headers = [
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

export const lists = [
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

export const aligns = [
	{
		type: 'align-left',
		icon: 'align-left',
		title: 'Align left'
	},
	{
		type: 'align-center',
		icon: 'align-center',
		title: 'Align center'
	},
	{
		type: 'align-right',
		icon: 'align-right',
		title: 'Align right'
	}
];

export const customColorMap = {
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

export const customStyleMap = {
	'HIGHLIGHT': {
		background: '#FE7F9C',
		padding: '3px',
		borderRadius: '2px',
		border: '0.2px solid #FE7F9C',
		color: 'white',
	},
	...customColorMap
};
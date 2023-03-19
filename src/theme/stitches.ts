import { createStitches } from '@stitches/react';

export const {
	styled,
	css,
	globalCss,
	keyframes,
	getCssText,
	theme,
	createTheme,
	config,
} = createStitches({
	theme: {
		colors: {
			black: '#000000',
			white: '#ffffff',
			dark1: '#333333',
		},
		transitions: {
			default: 'all 0.3s ease-out',
		},
	},
});

export const useGlobalStyles = globalCss({
	'*, *::before, *::after': {
		margin: 0,
		padding: 0,
		boxSizing: 'inherit',
		fontFamily: 'inherit',
	},
	html: {
		fontSize: '62.5%',
	},
	body: {
		boxSizing: 'border-box',
		lineHeight: 1.4,
		fontFamily: "'Inter', sans-serif",
	},
	'ol, ul': {
		listStyle: 'none',
	},
	button: {
		cursor: 'pointer',
		border: 'none',
		background: 'none',
	},
	a: {
		textDecoration: 'none',
		color: 'inherit',
	},
});

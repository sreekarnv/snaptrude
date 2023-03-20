import { styled } from '@/theme/stitches';

const Button = styled('button', {
	backgroundColor: '$black',
	color: '$white',
	fontWeight: 600,
	fontSize: '1.5rem',
	padding: '1rem 1.5rem',
	textTransform: 'uppercase',
	userSelect: 'none',
	transition: '$default',

	'&:where(:hover, :focus)': {
		backgroundColor: '$dark1',
	},

	'&:disabled': {
		opacity: 0.7,
		pointerEvents: 'none',
	},
});

export default Button;

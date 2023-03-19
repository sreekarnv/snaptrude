import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { styled } from '@stitches/react';
import React from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../AppProvider';
import Button from '../components/button';
import Cube from '../components/cuboid';

const Section = styled('section', {
	marginBottom: '2rem',

	h1: {
		textAlign: 'center',
		marginBottom: '1rem',
		fontSize: '4rem',
	},
});

const Container = styled('div', {
	maxWidth: '112rem',
	margin: '0 auto',
	paddingTop: '2rem',

	canvas: {
		width: '100%',
		height: '100%',
	},
});

interface ResultPageProps extends React.PropsWithChildren {}

const ResultPage: React.FC<ResultPageProps> = ({}) => {
	const { url } = React.useContext(AppContext);
	return (
		<>
			<Container>
				<Link to='/'>
					<Button>Back</Button>
				</Link>
				<Section>
					{url && (
						<>
							<h1>Result Cuboid</h1>
							<Canvas>
								<ambientLight />
								<pointLight position={[10, 10, 10]} />
								<Cube url={url} />
								<OrbitControls />
							</Canvas>
						</>
					)}
				</Section>
				<Section>
					{url && (
						<>
							<h1>Result Map</h1>
							<img src={url} alt='selected map' />
						</>
					)}
				</Section>
			</Container>
		</>
	);
};

export default ResultPage;

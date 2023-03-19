import React from 'react';
import IndexPage from './pages';
import { useGlobalStyles } from './theme/stitches';

interface AppProps extends React.PropsWithChildren {}

const App: React.FC<AppProps> = ({}) => {
	useGlobalStyles();

	return (
		<>
			<IndexPage />
		</>
	);
};

export default App;

import React from 'react';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import IndexPage from '@/pages/index';
import ResultPage from '@/pages/result';
import { useGlobalStyles } from '@/theme/stitches';

interface AppProps extends React.PropsWithChildren {}

const App: React.FC<AppProps> = ({}) => {
	useGlobalStyles();

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<IndexPage />} />
					<Route path='/result' element={<ResultPage />} />
				</Routes>
			</BrowserRouter>
		</>
	);
};

export default App;

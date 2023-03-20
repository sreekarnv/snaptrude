import React from 'react';

export const AppContext = React.createContext<{
	url: string;
	updateUrl: (s: string) => void;
}>({
	url: '',
	updateUrl: () => {},
});

const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [url, setUrl] = React.useState('');

	const updateUrl = (s: string) => {
		setUrl(s);
	};
	return (
		<>
			<AppContext.Provider value={{ url, updateUrl }}>
				{children}
			</AppContext.Provider>
		</>
	);
};

export default AppProvider;

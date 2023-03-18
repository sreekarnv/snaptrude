import { json, type LinksFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import mapboxgl from 'mapbox-gl';
import React from 'react';
import mapboxStyles from 'mapbox-gl/dist/mapbox-gl.css';
import Button from '~/components/button';

export const links: LinksFunction = () => [
	{
		rel: 'stylesheet',
		href: mapboxStyles,
	},
];

export const loader = async () => {
	return json({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });
};

const IndexPage: React.FC = () => {
	const { accessToken } = useLoaderData<typeof loader>();
	const mapContainerRef = React.useRef<HTMLDivElement | null>(null);
	const mapRef = React.useRef<null | mapboxgl.Map>(null);

	React.useEffect(() => {
		if (mapContainerRef.current && typeof accessToken === 'string') {
			mapRef.current = new mapboxgl.Map({
				container: mapContainerRef.current as HTMLDivElement,
				style: 'mapbox://styles/mapbox/navigation-day-v1',
				center: [-74.5, 40],
				zoom: 9,
				accessToken,
			});
		}
	}, [accessToken]);

	return (
		<>
			<div>
				<Button>Capture Image</Button>
				<div
					style={{ height: '500px', width: '1000px' }}
					ref={mapContainerRef}
				/>
			</div>
		</>
	);
};

export default IndexPage;

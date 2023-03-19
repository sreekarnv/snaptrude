import { json, type LinksFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import mapboxgl from 'mapbox-gl';
import React from 'react';
import mapboxStyles from 'mapbox-gl/dist/mapbox-gl.css';
import Button from '~/components/button';
import { styled } from '~/theme/stitches';

const Root = styled('div', {
	margin: '0 auto',
	width: '120rem',
	padding: '1rem',
});

const MapContainer = styled('div', {
	height: '70rem',
	width: '100%',
});

export const links: LinksFunction = () => [
	{
		rel: 'stylesheet',
		href: mapboxStyles,
	},
];

export const loader = async () => {
	return json({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });
};

const MARKER_LIMIT = 4;

const IndexPage: React.FC = () => {
	const { accessToken } = useLoaderData<typeof loader>();
	const mapContainerRef = React.useRef<HTMLDivElement | null>(null);
	const mapRef = React.useRef<null | mapboxgl.Map>(null);
	const [canMark, setCanMark] = React.useState(false);
	const markers = React.useRef<mapboxgl.Marker[]>([]);

	React.useEffect(() => {
		if (mapContainerRef.current && typeof accessToken === 'string') {
			mapRef.current = new mapboxgl.Map({
				container: mapContainerRef.current as HTMLDivElement,
				style: 'mapbox://styles/mapbox/navigation-day-v1',
				accessToken,
				center: {
					lat: 23,
					lng: 78.25,
				},
				zoom: 5,
			});

			mapRef.current.addControl(
				new mapboxgl.NavigationControl(),
				'bottom-right'
			);
		}
	}, [accessToken]);

	const handleMapClick = React.useCallback(
		(e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
			const { lng, lat } = e.lngLat;
			console.log('lng, lat', lng, lat);

			if (markers.current.length === MARKER_LIMIT) {
				return;
			}

			const newMarker = new mapboxgl.Marker({
				color: '#000',
				anchor: 'top',
			});

			newMarker.setLngLat([lng, lat]).addTo(mapRef.current as mapboxgl.Map);

			markers.current.push(newMarker);

			if (markers.current.length === MARKER_LIMIT) {
				fitBounds();
			}
		},
		[]
	);

	React.useEffect(() => {
		console.log({ canMark });
		if (canMark) {
			mapRef.current?.on('click', handleMapClick);
		} else {
			mapRef.current?.off('click', handleMapClick);
		}
	}, [canMark, handleMapClick]);

	const fitBounds = () => {
		if (mapRef.current) {
			const bounds = new mapboxgl.LngLatBounds();
			markers.current.forEach((marker) => bounds.extend(marker.getLngLat()));
			mapRef.current.fitBounds(bounds, { padding: 50 });
		}
	};

	return (
		<>
			<Root>
				<Button
					disabled={markers.current.length === MARKER_LIMIT}
					onClick={() => {
						setCanMark(!canMark);
					}}>
					{markers.current.length !== MARKER_LIMIT
						? canMark
							? 'Stop marking'
							: 'Mark'
						: "Can't Mark More"}
				</Button>
				<MapContainer ref={mapContainerRef} />
			</Root>
		</>
	);
};

export default IndexPage;

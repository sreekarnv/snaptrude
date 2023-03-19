import mapboxgl from 'mapbox-gl';
import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import Button from '../components/button';
import { styled } from '../theme/stitches';

const Root = styled('div', {
	margin: '0 auto',
	width: '120rem',
	padding: '1rem',
});

const Nav = styled('nav', {
	display: 'flex',
	alignItems: 'center',
	gap: '2rem',
	marginBottom: '5rem',

	p: {
		fontSize: '1.6rem',
		fontWeight: 600,
	},
});

const MapContainer = styled('div', {
	height: '70rem',
	width: '100%',
});

const MARKER_LIMIT = 4;

const IndexPage: React.FC = () => {
	const accessToken = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN;
	const mapContainerRef = React.useRef<HTMLDivElement | null>(null);
	const mapRef = React.useRef<null | mapboxgl.Map>(null);
	const [canMark, setCanMark] = React.useState(false);
	const markers = React.useRef<mapboxgl.Marker[]>([]);
	const [bounds, setBounds] = React.useState<mapboxgl.LngLatBounds | null>(
		null
	);
	const [url, setURL] = React.useState<string | null>(null);

	React.useEffect(() => {
		if (mapContainerRef.current && typeof accessToken === 'string') {
			mapRef.current = new mapboxgl.Map({
				container: mapContainerRef.current as HTMLDivElement,
				style: 'mapbox://styles/mapbox/streets-v11',
				accessToken,
				center: {
					lat: 23,
					lng: 78.25,
				},
				zoom: 5,
				preserveDrawingBuffer: true,
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
				setCanMark(false);
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
			setBounds(bounds);
		}
	};

	const handleCapture = () => {
		mapRef.current!.getCanvas().toBlob((blob) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				const img = new Image() as any;
				img.src = reader.result;
				img.onload = () => {
					const url = img.src;
					setURL(url);
				};
			};
			reader.readAsDataURL(blob!);
		}, 'image/png');
	};

	return (
		<>
			<Root>
				<Nav>
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

					<Button onClick={handleCapture}>Capture Image</Button>

					{markers.current.length === MARKER_LIMIT && !canMark && (
						<p>
							{markers.current.length} of {MARKER_LIMIT} markers remaining
						</p>
					)}
				</Nav>

				<MapContainer ref={mapContainerRef} />

				{url && bounds && (
					<img style={{ height: '600px', width: '800px' }} src={url} alt='' />
				)}
			</Root>
		</>
	);
};

export default IndexPage;

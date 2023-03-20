import mapboxgl from 'mapbox-gl';
import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import Button from '@/components/button';
import { styled } from '@/theme/stitches';
import { AppContext } from '@/providers/app-provider';
import { useNavigate } from 'react-router-dom';

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
	paddingTop: '2rem',

	p: {
		fontSize: '1.6rem',
		fontWeight: 600,
	},
});

const MapContainer = styled('div', {
	height: '70rem',
	width: '100%',

	'@bp1': {
		height: '50rem',
	},
});

const MARKER_LIMIT = 4;

const IndexPage: React.FC = () => {
	const accessToken = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN;
	const mapContainerRef = React.useRef<HTMLDivElement | null>(null);
	const mapRef = React.useRef<null | mapboxgl.Map>(null);
	const [canMark, setCanMark] = React.useState(false);
	const markers = React.useRef<mapboxgl.Marker[]>([]);
	const { updateUrl } = React.useContext(AppContext);
	const navigate = useNavigate();

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

	const handleCapture = () => {
		mapRef.current!.getCanvas().toBlob((blob) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				const img = new Image() as any;
				img.src = reader.result;
				img.onload = () => {
					const url = img.src;
					updateUrl(url);
					navigate('/result');
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
			</Root>
		</>
	);
};

export default IndexPage;

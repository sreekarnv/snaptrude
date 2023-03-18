import ReactDOMServer from 'react-dom/server';
import { getCssText } from '~/theme/stitches';
import { RemixServer } from '@remix-run/react';
import type { EntryContext } from '@remix-run/react/dist/entry';

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext
) {
	const markup = ReactDOMServer.renderToString(
		<RemixServer context={remixContext} url={request.url} />
	).replace(/<\/head>/, `<style id="stitches">${getCssText()}</style></head>`);

	return new Response('<!DOCTYPE html>' + markup, {
		status: responseStatusCode,
		headers: {
			...Object.fromEntries(responseHeaders),
			'Content-Type': 'text/html',
		},
	});
}

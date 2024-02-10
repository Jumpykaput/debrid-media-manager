import { MagnetStatus } from '@/services/allDebrid';
import { TorrentInfoResponse } from '@/services/realDebrid';
import Swal from 'sweetalert2';

export const showInfoForRD = async (
	app: string,
	rdKey: string,
	info: TorrentInfoResponse,
	userId: string = '',
	imdbId: string = ''
) => {
	let warning = '';
	const isIntact = info.fake || info.files.filter((f) => f.selected).length === info.links.length;
	if (info.progress === 100 && !isIntact) {
		warning = `<div class="text-sm text-red-500">Warning: Some files have expired</div>`;
	}

	let linkIndex = 0;

	const filesList = info.files
		.map((file) => {
			let size = file.bytes < 1024 ** 3 ? file.bytes / 1024 ** 2 : file.bytes / 1024 ** 3;
			let unit = file.bytes < 1024 ** 3 ? 'MB' : 'GB';

			let downloadForm = '';
			let watchBtn = '';
			let castBtn = '';

			if (file.selected && isIntact) {
				const fileLink = info.links[linkIndex++];
				if (!info.fake)
					downloadForm = `
					<form action="https://real-debrid.com/downloader" method="get" target="_blank" class="inline">
						<input type="hidden" name="links" value="${fileLink}" />
						<button type="submit" class="inline ml-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-0 px-1 rounded text-sm">📲 DL</button>
					</form>
				`;
				if (app) {
					if (info.fake) {
						watchBtn = `
							<button type="button" class="inline ml-1 bg-sky-500 hover:bg-sky-700 text-white font-bold py-0 px-1 rounded text-sm" onclick="window.open('/api/watch/instant/${app}?token=${rdKey}&hash=${info.hash}&fileId=${file.id}')">👀 Watch</button>
						`;
					} else {
						watchBtn = `
							<button type="button" class="inline ml-1 bg-sky-500 hover:bg-sky-700 text-white font-bold py-0 px-1 rounded text-sm" onclick="window.open('/api/watch/${app}?token=${rdKey}&link=${fileLink}')">👀 Watch</button>
						`;
					}

					if (userId && imdbId) {
						castBtn = `
							<button type="button" class="inline ml-1 bg-black text-white font-bold py-0 px-1 rounded text-sm" onclick="window.open('/api/dmmcast/magic/${userId}/cast/${imdbId}?token=${rdKey}&hash=${info.hash}&fileId=${file.id}')">Cast✨</button>
						`;
					}
				}
			}

			// Return the list item for the file, with or without the download form
			return `
                <li class="hover:bg-yellow-200 rounded ${
					file.selected ? 'bg-yellow-50 font-bold' : 'font-normal'
				}">
                    <span class="inline text-blue-600">${file.path}</span>
                    <span class="inline text-gray-700 w-fit">${size.toFixed(2)} ${unit}</span>
                        ${downloadForm}
                        ${watchBtn}
						${castBtn}
                </li>
            `;
		})
		.join('');

	// Handle the display of progress, speed, and seeders as table rows
	const progressRow =
		info.status === 'downloading'
			? `<tr><td class="font-semibold align-left">Progress:</td><td class="align-left">${info.progress.toFixed(
					2
			  )}%</td></tr>`
			: '';
	const speedRow =
		info.status === 'downloading'
			? `<tr><td class="font-semibold align-left">Speed:</td><td class="align-left">${(
					info.speed / 1024
			  ).toFixed(2)} KB/s</td></tr>`
			: '';
	const seedersRow =
		info.status === 'downloading'
			? `<tr><td class="font-semibold align-left">Seeders:</td><td class="align-left">${info.seeders}</td></tr>`
			: '';

	let html = `<h1 class="text-lg font-bold mt-6 mb-4">${info.filename}</h1>
    <hr/>
    <div class="text-sm max-h-60 mb-4 text-left bg-blue-100 p-1">
        <ul class="list space-y-1">
            ${filesList}
        </ul>
    </div>`;
	if (!info.fake)
		html = html.replace(
			'<hr/>',
			`<div class="text-sm">
            <table class="table-auto w-full mb-4 text-left">
                <tbody>
                    <tr>
                        <td class="font-semibold">Size:</td>
                        <td>${(info.bytes / 1024 ** 3).toFixed(2)} GB</td>
                    </tr>
                    <tr>
                        <td class="font-semibold">ID:</td>
                        <td>${info.id}</td>
                    </tr>
                    <tr>
                        <td class="font-semibold">Original filename:</td>
                        <td>${info.original_filename}</td>
                    </tr>
                    <tr>
                        <td class="font-semibold">Original size:</td>
                        <td>${(info.original_bytes / 1024 ** 3).toFixed(2)} GB
                        </td>
                    </tr>
                    <tr>
                        <td class="font-semibold">Status:</td>
                        <td>${info.status}</td>
                    </tr>
                    ${progressRow}
                    ${speedRow}
                    ${seedersRow}
                    <tr>
                        <td class="font-semibold">Added:</td>
                        <td>${new Date(info.added).toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        ${warning}`
		);
	Swal.fire({
		// icon: 'info',
		html,
		showConfirmButton: false,
		customClass: {
			htmlContainer: '!mx-1',
		},
		width: '800px',
		showCloseButton: true,
		inputAutoFocus: true,
	});
};

export const showInfoForAD = async (
	app: string,
	rdKey: string,
	info: MagnetStatus,
	userId: string = '',
	imdbId: string = ''
) => {
	console.log(info);
	const filesList = info.links
		.map((file) => {
			let size = file.size < 1024 ** 3 ? file.size / 1024 ** 2 : file.size / 1024 ** 3;
			let unit = file.size < 1024 ** 3 ? 'MB' : 'GB';

			let downloadForm = '';
			let watchBtn = '';
			let castBtn = '';

			downloadForm = `
					<form action="https://real-debrid.com/downloader" method="get" target="_blank" class="inline">
						<input type="hidden" name="links" value="${file.link}" />
						<button type="submit" class="inline ml-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-0 px-1 rounded text-sm">📲 DL</button>
					</form>
				`;
			if (app) {
				watchBtn = `
							<button type="button" class="inline ml-1 bg-sky-500 hover:bg-sky-700 text-white font-bold py-0 px-1 rounded text-sm" onclick="window.open('/api/watch/${app}?token=${rdKey}&link=${file.link}')">👀 Watch</button>
						`;

				if (userId && imdbId) {
					castBtn = `
							<button type="button" class="inline ml-1 bg-black text-white font-bold py-0 px-1 rounded text-sm" onclick="window.open('/api/dmmcast/magic/${userId}/cast/${imdbId}?token=${rdKey}&hash=${info.hash}')">Cast✨</button>
						`;
				}
			}

			// Return the list item for the file, with or without the download form
			return `
                <li class="hover:bg-yellow-200 rounded font-normal">
                    <span class="inline text-blue-600">${file.filename}</span>
                    <span class="inline text-gray-700 w-fit">${size.toFixed(2)} ${unit}</span>
                        ${downloadForm}
                        ${watchBtn}
						${castBtn}
                </li>
            `;
		})
		.join('');

	let html = `<h1 class="text-lg font-bold mt-6 mb-4">${info.filename}</h1>
    <hr/>
    <div class="text-sm max-h-60 mb-4 text-left bg-blue-100 p-1">
        <ul class="list space-y-1">
            ${filesList}
        </ul>
    </div>`;
	html = html.replace(
		'<hr/>',
		`<div class="text-sm">
		<table class="table-auto w-full mb-4 text-left">
			<tbody>
				<tr>
					<td class="font-semibold">Size:</td>
					<td>${(info.size / 1024 ** 3).toFixed(2)} GB</td>
				</tr>
				<tr>
					<td class="font-semibold">ID:</td>
					<td>${info.id}</td>
				</tr>
				<tr>
					<td class="font-semibold">Status:</td>
					<td>${info.status} (code: ${info.statusCode})</td>
				</tr>
				<tr>
					<td class="font-semibold">Added:</td>
					<td>${new Date(info.uploadDate * 1000).toLocaleString()}</td>
				</tr>
			</tbody>
		</table>
	</div>`
	);

	Swal.fire({
		// icon: 'info',
		html,
		showConfirmButton: false,
		customClass: {
			htmlContainer: '!mx-1',
		},
		width: '800px',
		showCloseButton: true,
		inputAutoFocus: true,
	});
};

export default function (details: any[]) {
	const metadata: { [key: string]: any } = {};

	details.forEach((detail) => {
		const key = detail.path[2] || detail.path[1] || detail.path[0];
		metadata[key] = detail.message;
	});

	return metadata;
}

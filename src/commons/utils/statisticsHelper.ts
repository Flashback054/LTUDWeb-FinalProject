import Book from "../../primary-server/models/book.model";

export async function addMissingBooks(
	statisticResult,
	startDate,
	endDate,
	keys,
	sortOptions,
) {
	if (statisticResult.length === 0) return statisticResult;

	const books = await Book.find({}).select("id name image");

	const includedBooks = new Set();

	for (const statistic of statisticResult) {
		includedBooks.add(statistic.id.toString());
	}

	for (const book of books) {
		if (!includedBooks.has(book.id.toString())) {
			const missingBook = { id: book.id, name: book.name, image: book.image };

			for (const key of keys) {
				missingBook[key] = 0;
			}

			statisticResult.push(missingBook);
		}
	}

	if (sortOptions && Object.keys(sortOptions).length > 0) {
		const sortField = Object.keys(sortOptions)[0];
		const sortOrder = sortOptions[sortField];
		statisticResult.sort((a, b) => {
			if (sortOrder === 1) {
				return a[sortField] > b[sortField] ? 1 : -1;
			} else {
				return a[sortField] < b[sortField] ? 1 : -1;
			}
		});
	}

	return statisticResult;
}

export function addMissingDates(statisticResult, startDate, endDate, keys) {
	if (statisticResult.length === 0) return statisticResult;

	let type = statisticResult[0].date.length === 10 ? "day" : "month";

	if (statisticResult)
		if (type === "day") {
			const includedDates = new Set();

			for (const statistic of statisticResult) {
				includedDates.add(statistic.date);
			}

			let currentDate = new Date(startDate);

			while (currentDate <= endDate) {
				const date = currentDate.toISOString().slice(0, 10);

				if (!includedDates.has(date)) {
					const missingDate = { date };

					for (const key of keys) {
						missingDate[key] = 0;
					}

					statisticResult.push(missingDate);
				}

				currentDate.setDate(currentDate.getDate() + 1);
			}
		} else if (type === "month") {
			const includedDates = new Set();

			for (const statistic of statisticResult) {
				includedDates.add(statistic.date);
			}

			let currentDate = new Date(startDate);

			while (currentDate <= endDate) {
				const date = currentDate.toISOString().slice(0, 7);

				if (!includedDates.has(date)) {
					const missingDate = { date };

					for (const key of keys) {
						missingDate[key] = 0;
					}

					statisticResult.push(missingDate);
				}

				currentDate.setMonth(currentDate.getMonth() + 1);
			}
		}

	return statisticResult.sort((a, b) => {
		if (a.date > b.date) return 1;
		if (a.date < b.date) return -1;
		return 0;
	});
}

export function dateConverter(startDate, endDate, type) {
	switch (type) {
		case "today":
			type = "day";
			startDate = new Date();
			endDate = new Date();

			startDate.setHours(0, 0, 0, 0);
			endDate.setHours(23, 59, 59, 999);
			break;

		case "dateRange":
			type = "day";
			startDate = new Date(startDate);
			endDate = new Date(endDate);

			startDate.setHours(0, 0, 0, 0);
			endDate.setHours(23, 59, 59, 999);
			break;

		case "month":
			startDate = new Date();
			endDate = new Date();

			startDate.setDate(1);
			startDate.setHours(0, 0, 0, 0);
			endDate.setHours(23, 59, 59, 999);
			break;

		case "year":
			startDate = new Date();
			endDate = new Date();

			startDate.setMonth(0, 1);
			startDate.setHours(0, 0, 0, 0);
			endDate.setMonth(11, 31);
			endDate.setHours(23, 59, 59, 999);
			break;
	}

	return { startDate, endDate, type };
}

const DAYS_OF_WEEK = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
];

const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

export const getDayOfWeek = () => DAYS_OF_WEEK[new Date().getDay()];

const formatDateIso = (date: Date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

export const getLocalDate = () => {
	return formatDateIso(new Date());
};

export const getWeek = (date: Date): string => {
	// Get the day of the week (0 = Sunday, 6 = Saturday)
	const dayOfWeek = date.getDay();

	// Calculate the Monday of this week
	const monday = new Date(date);
	monday.setDate(date.getDate() - dayOfWeek + 1);

	return formatDateIso(monday);
};

export const formatDate = (date: Date, includeTime = false): string => {
	const dayOfWeek = DAYS_OF_WEEK[date.getDay()];
	const month = MONTHS[date.getMonth()];
	const day = date.getDate();
	const year = date.getFullYear();

	let result = `${dayOfWeek}, ${month} ${day}, ${year}`;

	if (includeTime) {
		const hour = date.getHours();
		const hour12 = hour % 12 || 12;
		const ampm = hour < 12 ? 'am' : 'pm';
		result += ` @${hour12}${ampm}`;
	}

	return result;
};

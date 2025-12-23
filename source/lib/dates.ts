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

export const getLocalDate = () => {
	const now = new Date();
	return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};

export const getWeek = (date: Date): string => {
	// Get the day of the week (0 = Sunday, 6 = Saturday)
	const dayOfWeek = date.getDay();

	// Calculate the Sunday of this week
	const sunday = new Date(date);
	sunday.setDate(date.getDate() - dayOfWeek);

	// Format as YYYY-MM-DD
	const year = sunday.getFullYear();
	const month = String(sunday.getMonth() + 1).padStart(2, '0');
	const day = String(sunday.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
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

const DAYS_OF_WEEK = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
];

export const getDayOfWeek = () => DAYS_OF_WEEK[new Date().getDay()];

export const getLocalDate = () => {
	const now = new Date();
	return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};

// Defines arrays that hold the abbreviated day and full month names.
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
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
        'December'
];

/**
 * Formats a given date object as a string representing the date and time.
 * @param {Date} dateToFormat - The date object to format.
 * @returns {string} A string representing the formatted date and time, in the format "Month Day, Hours:Minutes DayOfWeek".
 */
export const formatDate = (dateToFormat, long = true) => {
        dateToFormat = new Date(dateToFormat)
        const month = monthNames[dateToFormat.getMonth()];
        const day = dateToFormat.getDate();
        const year = dateToFormat.getFullYear();

        let hours = dateToFormat.getHours();
        let minutes = dateToFormat.getMinutes();
        const dayOfWeek = dayNames[dateToFormat.getDay()];

        if (hours < 10) hours = '0' + hours;
        if (minutes < 10) minutes = '0' + minutes;

        const formattedDate = long
                ? `${month} ${day}, ${hours}:${minutes} ${dayOfWeek}`
                : `${month} ${day}, ${year}`;

        return formattedDate;
};

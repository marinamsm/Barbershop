import { getYear, getMonth, getDate } from 'date-fns';

function getDatePattern(date: Date): Record<string, unknown> {
    const year = getYear(date);
    const month = getMonth(date);
    const day = getDate(date);

    return { year, month, day };
}

export default getDatePattern;

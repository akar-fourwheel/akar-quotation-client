import { DateTime } from "luxon";


const getDate = (ts, format = 'dd-MM-yyyy, hh:mm a') => {
    if (!ts) return '-';
    return DateTime.fromISO(ts, { zone: 'utc' })
        .setZone('Asia/Kolkata')
        .toFormat(format);
};

export default getDate;
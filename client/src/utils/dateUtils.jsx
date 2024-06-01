import { parseISO, addHours } from 'date-fns';

export const convertToISO = (dateString) => {
    const [datePart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('.');
    return `${year}-${month}-${day}T${timePart}:00`;
};

export const formatTimeAgoInSeconds = (dateString) => {
    const isoDate = convertToISO(dateString);
    const initialDate = parseISO(isoDate);
    const dateWithTimeAdded = addHours(initialDate, 9); // 서울 시간대에 맞게 9시간 추가

    const now = new Date();
    const secondsDiff = Math.floor((now - dateWithTimeAdded) / 1000);  // 1000ms = 1s

    if (secondsDiff < 60) {
        return `${secondsDiff}초 전`;
    } else if (secondsDiff < 3600) {
        return `${Math.floor(secondsDiff / 60)}분 전`;
    } else {
        return `${Math.floor(secondsDiff / 3600)}시간 전`;
    }
};

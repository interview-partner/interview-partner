/**
 * MIT License
 * 
 * Copyright (c) 2021 Sasha Koss and Lesha Koss https://kossnocorp.mit-license.org
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { parseISO, addHours } from 'date-fns';

/**
 * 주어진 날짜 문자열을 ISO 형식으로 변환하는 함수
 * 
 * @param {string} dateString - 날짜 문자열 (예: '2021.10.21 12:34')
 * @returns {string} ISO 형식의 날짜 문자열
 */
export const convertToISO = (dateString) => {
    const [datePart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('.');
    return `${year}-${month}-${day}T${timePart}:00`;
};

/**
 * 주어진 날짜 문자열을 기준으로 몇 초, 몇 분, 몇 시간 전인지 반환하는 함수
 * 
 * @param {string} dateString - 날짜 문자열 (예: '2021.10.21 12:34')
 * @returns {string} 상대 시간 문자열 (예: '5분 전')
 */
export const formatTimeAgoInSeconds = (dateString) => {
    const isoDate = convertToISO(dateString);
    const initialDate = parseISO(isoDate);
    const dateWithTimeAdded = addHours(initialDate, 0);

    const now = new Date();
    const secondsDiff = Math.floor((now - dateWithTimeAdded) / 1000);  // 1000ms = 1s

    if (secondsDiff < 60) {
        return `${secondsDiff}초 전`;
    } else if (secondsDiff < 3600) {
        return `${Math.floor(secondsDiff / 60)}분 전`;
    } else if (secondsDiff < 86400) { // 86400초 = 24시간
        return `${Math.floor(secondsDiff / 3600)}시간 전`;
    } else {
        return `${Math.floor(secondsDiff / 86400)}일 전`;
    }
};

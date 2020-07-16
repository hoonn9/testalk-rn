export const dateConverter = (timestamp: number) => {
    const convertDate = new Date(timestamp);
    return `${convertDate.getFullYear()}년 ${
        convertDate.getMonth() + 1
        }월 ${convertDate.getDate()}일`;
};

export const dateMessageConverter = (timestamp: number) => {
    const convertDate = new Date(timestamp);
    const hour = convertDate.getHours();
    if (hour >= 12) {
        return `오후 ${hour % 12}:${convertDate.getMinutes() < 10 ? `0${convertDate.getMinutes()}` : convertDate.getMinutes()}`;
    } else {
        return `오전 ${hour}:${convertDate.getMinutes() < 10 ? `0${convertDate.getMinutes()}` : convertDate.getMinutes()}`;
    }
};

export const dateSeparateConverter = (timestamp: number) => {
    const convertDate = new Date(timestamp);
    return `${convertDate.getFullYear()}년 ${convertDate.getMonth() + 1}월 ${convertDate.getDate()}일`
}


export const dateSimpleConverter = (timestamp: string) => {
    const now = new Date();
    const writeDay = new Date(parseInt(timestamp));
    let minus;
    let converted = "";

    if (now.getFullYear() > writeDay.getFullYear()) {
        minus = now.getFullYear() - writeDay.getFullYear();
        converted = minus + "년 전";

    } else if (now.getMonth() > writeDay.getMonth()) {
        minus = now.getMonth() - writeDay.getMonth();
        converted = minus + "달 전";

    } else if (now.getDate() > writeDay.getDate()) {
        minus = now.getDate() - writeDay.getDate();
        converted = minus + "일 전";

    } else if (now.getDate() == writeDay.getDate()) {
        const nowTime = now.getTime();
        const writeTime = writeDay.getTime();
        if (nowTime > writeTime) {
            let sec = Math.floor((nowTime - writeTime) / 1000);
            let day = Math.floor(sec / 60 / 60 / 24);
            sec = sec - day * 60 * 60 * 24;
            let hour = Math.floor(sec / 60 / 60);
            sec = sec - hour * 60 * 60;
            let min = Math.floor(sec / 60);
            sec = Math.floor(sec - min * 60);
            if (hour > 0) {
                converted = hour + "시간 전";
            } else if (min > 0) {
                converted = min + "분 전";
            } else if (sec > 0) {
                converted = sec + "초 전";
            } else {
                converted = "방금 전";
            }
        } else {
            converted = "방금 전";
        }
    }
    return converted;
};

export const formatYMD = (timestamp: string) => {
    let d = new Date(parseInt(timestamp)),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

export const getAge = (timestamp: string) => {
    const now = new Date();
    const birth = new Date(parseInt(timestamp));
    return now.getUTCFullYear() - birth.getUTCFullYear() + 1;
}

export const numberWithCommas = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const distance = (lat1: number, lng1: number, lat2: number, lng2: number, unit: string) => {
    if ((lat1 == lat2) && (lng1 == lng2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lng1 - lng2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return dist.toFixed(1);
    }
}

export const getTimeFromBefore = (day: number = 2) => {
    const nowDate = new Date();
    nowDate.setDate(nowDate.getDate() - day);
    return nowDate.getTime();
}
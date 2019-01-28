import {IDate} from "./DateModuleTypes";

function getTimeFromMilliseconds(time: number): IDate {
    const milliseconds: number = time;

    // Получаем секунды, минуты и часы:
    // Секунды - делим миллисекунды на 1000 и приводим полученное число к полуинтервалу [0, 60)
    // Минуты - делим миллисекунды на 60000 и приводим полученное число к полуинтервалу [0, 60)
    // Часы - делим миллисекунды на 3600000 и приводим полученное число к полуинтервалу [0, 24)
    const seconds: string = Math.floor((milliseconds / 1000 % 60)).toString();
    const minutes: string = Math.floor((milliseconds / (1000 * 60) % 60)).toString();
    const hours: string = Math.floor((milliseconds / (1000 * 60 * 60) % 24)).toString();

    // Возвращаем полученные данные в виде объекта, приводим каждое, к числу из двух знако-мест
    return {
        hours: hours.length === 1 ? '0' + hours : hours,
        minutes: minutes.length === 1 ? '0' + minutes : minutes,
        seconds: seconds.length === 1 ? '0' + seconds : seconds,
    };
}

export default function getTime(time: number): string {
    const date: IDate = getTimeFromMilliseconds(time);

    return `${date.hours}:${date.minutes}:${date.seconds}`;
}

interface IDate {
    hours: string;
    minutes: string;
    seconds: string;
}

function getTimeFromMilliseconds(time: number): IDate {
    const milliseconds: number = time;

    const seconds: string = Math.floor((milliseconds / 1000 % 60)).toString();
    const minutes: string = Math.floor((milliseconds / (1000 * 60) % 60)).toString();
    const hours: string = Math.floor((milliseconds / (1000 * 60 * 60) % 24)).toString();

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

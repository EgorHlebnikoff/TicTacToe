export default function subtractDates(...dates: Date[]) {
    // Получаем общую разницу всех переданных дат, проходя в цикле через все переданные даты, начиная со второй
    // взяв за начальное значение первую переданную дату

    return dates.splice(1).reduce(
        (acc: number, currDate: Date) => acc - currDate.getTime(),
        dates[0].getTime(),
    );
}

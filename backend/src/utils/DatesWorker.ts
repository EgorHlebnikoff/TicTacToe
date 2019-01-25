export default function subtractDates(...dates: Date[]) {
    return dates.splice(1).reduce(
        (acc: number, currDate: Date) => acc - currDate.getTime(),
        dates[0].getTime(),
    );
}

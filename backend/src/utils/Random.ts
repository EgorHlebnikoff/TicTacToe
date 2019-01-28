const ALPHABET: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function randomAlphanumericString(length: number): string {
    // Заполняем массив заданной длинны неопределенными значениями
    const emptyArr: undefined[] = [...Array(length)];

    // Преобразовываем пустой массив заданной длины в строку заданной длины, путем конкатенации строк
    // На каждом этапе добавляем к существующей строке случаейный символ из алфавита
    return emptyArr.reduce(
        (accumulator: string): string => accumulator + ALPHABET[Math.floor(Math.random() * ALPHABET.length)],
        '',
    );
}

export {randomAlphanumericString};

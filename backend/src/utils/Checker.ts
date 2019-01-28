function checkRows(field: string[]): boolean {
    // Для каждой строки матрицы проверяем,
    // заполнена ли хоть одна из них полностью знаками крестика или нолика
    return field.some((currRow: string) => currRow === 'XXX' || currRow === 'OOO');
}

function checkColumns(field: string[]): boolean {
    // По очередно для 0, 1 и 2 столбцов проверяем,
    // не заполнен ли хоть один из них полнстью знаками крестика или нолика
    return [0, 1, 2].some(
        (colNum: number): boolean => {
            // Обе переменные принимают значением результат функции,
            // которая для каждой строки, разбивает её на массив символов и проверяет символ в текущем столбец
            // на то, является ли он знаком крестика или нолика

            const isWonByX = field.every(
                (currRow: string): boolean => currRow.split('')[colNum] === 'X',
            );

            const isWonByO = field.every(
                (currRow: string): boolean => currRow.split('')[colNum] === 'O',
            );

            return isWonByX || isWonByO;
        },
    );
}

function checkDiagonals(field: string[], indexes: number[]): boolean {
    // Обе переменные принимают значением результат функции,
    // которая для каждой строки, разбивает её на массив символов и проверяет символ
    // в заданном для текущей строки столбце на то, является ли он знаком крестика или нолика

    const isWonByX = field.every((currRow: string, rowNum: number): boolean => {
        return currRow.split('')[indexes[rowNum]] === 'X';
    });

    const isWonByO = field.every((currRow: string, rowNum: number): boolean => {
        return currRow.split('')[indexes[rowNum]] === 'O';
    });

    return isWonByX || isWonByO;
}

function isWon(field: string[]): boolean {
    // Проверяем сначаа строки, на признак победы, затем стролбцы, и в конце диагонали
    // Отдаем true, как только одна из функций вернула true, если все функции вернули false - возращаем false
    return checkRows(field)
        || checkColumns(field)
        || checkDiagonals(field, [0, 1, 2])
        || checkDiagonals(field, [2, 1, 0]);
}

function isDraw(field: string[]): boolean {
    // Для каждой строки в матрице проверяем, остались ли в ней знаки пустой ячейки, если нет
    return field.every((currRow: string): boolean => {
        return currRow.split('').every((currCol: string): boolean => currCol !== '?');
    });
}

export default function checkGameState(field: string[]): string {
    // Проверяем состяние игры - возращаем неободимое значение
    if (isWon(field)) return 'won';
    if (isDraw(field)) return 'draw';

    return 'playing';
}

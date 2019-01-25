function checkRows(field: string[]): boolean {
    return field.some((currRow: string) => currRow === 'XXX' || currRow === 'OOO');
}

function checkColumns(field: string[]): boolean {
    return [0, 1, 2].some(
        (colNum: number): boolean => {
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
    const isWonByX = field.every((currRow: string, rowNum: number): boolean => {
        return currRow.split('')[indexes[rowNum]] === 'X';
    });

    const isWonByO = field.every((currRow: string, rowNum: number): boolean => {
        return currRow.split('')[indexes[rowNum]] === 'O';
    });

    return isWonByX || isWonByO;
}

function isWon(field: string[]): boolean {
    return checkRows(field)
        || checkColumns(field)
        || checkDiagonals(field, [0, 1, 2])
        || checkDiagonals(field, [2, 1, 0]);
}

function isDraw(field: string[]): boolean {
    return field.every((currRow: string): boolean => {
        return currRow.split('').every((currCol: string): boolean => currCol !== '?');
    });
}

export default function checkGameState(field: string[]): string {
    if (isWon(field)) return 'won';
    if (isDraw(field)) return 'draw';

    return 'playing';
}

const ALPHABET: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function randomAlphanumericString(length: number): string {
    const emptyArr: undefined[] = [...Array(length)];

    return emptyArr.reduce(
        (accumulator: string): string => accumulator + ALPHABET[Math.floor(Math.random() * ALPHABET.length)],
        '',
    );
}

export {randomAlphanumericString};

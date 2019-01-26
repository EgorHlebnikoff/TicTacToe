interface IFieldCell {
    index: string;
    svg?: JSX.Element;
    clickHandler?: ([row, column]: number[]) => void;
    className?: string;
}

export {IFieldCell};

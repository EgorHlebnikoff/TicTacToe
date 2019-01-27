interface IModal {
    isOpen: boolean;
    closeByOutsideClick?: boolean;
    closeByESC?: boolean;
    beforeOpen?: () => void;
    afterOpen?: () => void;
    onClose: () => void;
    title?: string;
    className?: string;
}

export {IModal};

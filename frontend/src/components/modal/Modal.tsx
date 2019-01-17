import * as React from 'react';
import * as styled from "./styles";

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

class Modal extends React.Component<IModal, {}> {
    private modal: HTMLDivElement | null = null;

    constructor(props: IModal) {
        super(props);

        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
    }

    public componentWillMount(): void {
        if (!this.props.beforeOpen) return;

        this.props.beforeOpen();
    }

    public componentDidMount(): void {
        if (this.props.afterOpen) this.props.afterOpen();

        if (this.props.closeByESC)
            window.addEventListener('keyup', this.handleKeyUp, false);

        if (this.props.closeByOutsideClick)
            document.addEventListener('click', this.handleOutsideClick, false);
    }

    public componentWillUnmount(): void {
        window.removeEventListener('keyup', this.handleKeyUp, false);
        document.removeEventListener('click', this.handleOutsideClick, false);
    }

    public render() {
        if (!this.props.isOpen) return null;

        return (
            <styled.Backdrop>
                <styled.Modal className={this.props.className} ref={(node: HTMLDivElement) => (this.modal = node)}>
                    <styled.ModalHeader>
                        <styled.ModalTitle>
                            {this.props.title || 'Заголовок'}
                        </styled.ModalTitle>
                        <styled.CloseButton onClick={this.props.onClose}/>
                    </styled.ModalHeader>
                    <styled.ModalContent>{this.props.children}</styled.ModalContent>
                </styled.Modal>
            </styled.Backdrop>
        );
    }

    private handleKeyUp(e: KeyboardEvent): void {
        const {onClose} = this.props;
        const ESCKeyCode: string = '27';

        if (e.key !== ESCKeyCode) return;

        e.preventDefault();
        onClose();
        window.removeEventListener('keyup', this.handleKeyUp, false);
    }

    private handleOutsideClick(e: MouseEvent): void {
        const {onClose} = this.props;

        if (!this.modal || this.modal.contains(e.target as HTMLElement)) return;

        onClose();
        document.removeEventListener('click', this.handleOutsideClick, false);
    }
}

export default Modal;

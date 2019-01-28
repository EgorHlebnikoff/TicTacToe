import * as React from 'react';
import {IModal} from "./ModalTypes";
import * as styled from "./styles";

class Modal extends React.Component<IModal, {}> {
    private modal: HTMLDivElement | null = null;

    constructor(props: IModal) {
        super(props);

        //Если была передана функция до вызова перед открытие - вызоваем её
        if (this.props.beforeOpen)
            this.props.beforeOpen();

        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
    }

    public componentDidMount(): void {
        const {afterOpen, closeByESC, closeByOutsideClick}: IModal = this.props;

        //Если была передана функция до вызова после открытие - вызоваем её
        if (afterOpen) afterOpen();

        // Вешаем обработчики событий на закрытие модального окна, если таковые были запрошены
        if (closeByESC)
            window.addEventListener('keyup', this.handleKeyUp, false);

        if (closeByOutsideClick)
            document.addEventListener('click', this.handleOutsideClick, false);
    }

    public componentWillUnmount(): void {
        // Снимаем обработчики событий на закрытие модального окна
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
        const {onClose}: IModal = this.props;

        // Если нажатая кнопка является кнопкой ESC - закрываем модальное окно
        const ESCKeyCode: string = '27';

        if (e.key !== ESCKeyCode) return;

        e.preventDefault();
        onClose();
    }

    private handleOutsideClick(e: MouseEvent): void {
        const {onClose}: IModal = this.props;

        if (!this.modal || this.modal.contains(e.target as HTMLElement)) return;

        // Если если клик произошел вне области модального окна - закрываем модальное окно
        onClose();
        document.removeEventListener('click', this.handleOutsideClick, false);
    }
}

export default Modal;

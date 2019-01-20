import * as React from 'react';
import * as styled from './styles';

interface IFieldCell {
    index: number;
    svg?: JSX.Element;
    clickHandler?: (index: number) => void;
    className?: string;
}

class FieldCell extends React.Component<IFieldCell, {}> {
    constructor(props: IFieldCell) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    public render(): JSX.Element {
        return (
            <div className={this.props.className} onClick={this.handleClick}>
                <styled.SVGContainer>{this.props.svg}</styled.SVGContainer>
            </div>
        );
    }

    private handleClick(): void {
        if (!this.props.clickHandler) return;

        this.props.clickHandler(this.props.index);
    }
}

export default styled.FieldCell(FieldCell);

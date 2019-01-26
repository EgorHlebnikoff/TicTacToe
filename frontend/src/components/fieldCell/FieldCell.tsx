import * as React from 'react';
import {IFieldCell} from "./FieldCellTypes";
import * as styled from './styles';

class FieldCell extends React.Component<IFieldCell, {}> {
    constructor(props: IFieldCell) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    public render(): JSX.Element {
        const wrapperClassAttribute: string = `${this.props.className} ${!this.props.clickHandler ? 'active' : ''}`;
        
        return (
            <div
                className={wrapperClassAttribute}
                onClick={this.handleClick}
            >
                <styled.SVGContainer>{this.props.svg}</styled.SVGContainer>
            </div>
        );
    }

    private handleClick(): void {
        if (!this.props.clickHandler) return;

        const [row, column]: number[] = this.props.index.split('_').reduce(
            (acc: number[], item: string): number[] => {
                acc.push(parseInt(item, 10));

                return acc;
            },
            [],
        );

        this.props.clickHandler([row, column]);
    }
}

export default styled.FieldCell(FieldCell);

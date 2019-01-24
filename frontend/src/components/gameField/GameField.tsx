import * as React from 'react';
import getTime from '../../modules/date/DateModule';
import Button from "../button/Button";
import FieldCell from "../fieldCell/FieldCell";
import {GameState} from '../GameScreen';
import Span from "../span/Span";
import Svg from "../svg/Svg";
import * as styled from "./styles";

interface IGameField {
    gameState?: GameState;
    field?: string[];
    winnerName?: string;
    time: number;
    turnHandler: ([row, column]: number[]) => void;
}

export default class GameField extends React.Component<IGameField, {}> {
    private cellsTypes: string[] = ['x', 'o', 'о', 'х'];

    constructor(props: IGameField) {
        super(props);

        this.getCells = this.getCells.bind(this);
    }

    public render(): JSX.Element {
        return (
            <styled.FieldContainer>
                <styled.Annotation>Ваш ход</styled.Annotation>
                <styled.Field>{this.getFieldCells()}</styled.Field>
                <Span>{getTime(this.props.time)}</Span>
                <Button>Сдаться</Button>
            </styled.FieldContainer>
        );
    }

    private getCells(acc: JSX.Element[], currRow: string, row: number): JSX.Element[] {
        currRow.split('').forEach((currCell: string, column: number) => {
            currCell = currCell.toLowerCase();
            const key: number = (row * currRow.length) + column;

            if (this.cellsTypes.every((item: string) => item !== currCell)) {
                acc.push(<FieldCell key={key} index={`${row}_${column}`} clickHandler={this.props.turnHandler}/>);

                return;
            }

            const svg = currCell === 'x' || currCell === 'x'
                ? <Svg isActive={false} name='cross'/>
                : <Svg isActive={false} name='circle'/>;

            acc.push(<FieldCell key={key} index={`${row}_${column}`} svg={svg}/>);
        });

        return acc;
    }

    private getFieldCells(): JSX.Element[] {
        return this.props.field.reduce(this.getCells, []);
    }
}

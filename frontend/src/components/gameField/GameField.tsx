import * as React from 'react';
import getTime from '../../modules/date/DateModule';
import Button from "../button/Button";
import FieldCell from "../fieldCell/FieldCell";
import Span from "../span/Span";
import Svg from "../svg/Svg";
import * as styled from "./styles";

enum GameState {WAITING, PLAYER_TURN, OPPONENT_TURN, WON, DRAW}

interface IGameField {
    gameState?: GameState;
    field?: string[];
    winnerName?: string;
    time: number;
    turnHandler: (index: number) => void;
}

export default class GameField extends React.Component<IGameField, {}> {
    private cellsTypes: string[] = ['x', 'o', 'о', 'х'];

    constructor(props: IGameField) {
        super(props);

        this.getCell = this.getCell.bind(this);
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

    private getCell(currCell: string, index: number): JSX.Element {
        currCell = currCell.toLowerCase();

        if (this.cellsTypes.every((item: string) => item !== currCell))
            return <FieldCell key={index} index={index} clickHandler={this.props.turnHandler}/>;

        const svg = currCell === 'x' || currCell === 'x'
            ? <Svg isActive={false} name='cross'/>
            : <Svg isActive={false} name='circle'/>;

        return <FieldCell key={index} index={index} clickHandler={this.props.turnHandler} svg={svg}/>;
    }

    private getFieldCells(): JSX.Element[] {
        return this.props.field.map(this.getCell);
    }
}

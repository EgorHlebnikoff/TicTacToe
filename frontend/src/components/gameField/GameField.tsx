import * as React from 'react';
import getTime from '../../modules/date/DateModule';
import {LinkButton} from "../button/Button";
import FieldCell from "../fieldCell/FieldCell";
import Span from "../span/Span";
import Svg from "../svg/Svg";
import {GameState, IGameField, IPlayers, UserType} from "./GameFieldTypes";
import * as styled from "./styles";

export default class GameField extends React.Component<IGameField, {}> {
    private cellsTypes: string[] = ['x', 'o', 'о', 'х'];

    constructor(props: IGameField) {
        super(props);

        this.getCells = this.getCells.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    public render(): JSX.Element {
        return (
            <styled.FieldContainer>
                <styled.Annotation>{this.getAnnotation()}</styled.Annotation>
                <styled.Field>{this.getFieldCells()}</styled.Field>
                <Span>{getTime(this.props.time)}</Span>
                {this.renderButton()}
            </styled.FieldContainer>
        );
    }

    private doesCurrUserWin(): boolean {
        const {userType, winner}: IGameField = this.props;
        const {owner, opponent}: IPlayers = this.props.players;

        return (userType === UserType.OWNER && winner === owner)
            || (userType === UserType.OPPONENT && winner === opponent);
    }

    private provideClickHandler(): boolean {
        return this.props.youTurn && this.props.gameState === GameState.PLAYING;
    }

    private isNonEmptyCell(cellType: string): boolean {
        return this.cellsTypes.some((item: string) => item === cellType);
    }

    private getAnnotation(): string {
        const {youTurn, gameState, winner}: IGameField = this.props;

        if (gameState === GameState.WAITING) return 'Ожидается оппонент';
        if (gameState === GameState.DRAW) return 'Игра завершилась ничьей';
        if (gameState === GameState.WON) {
            if (this.doesCurrUserWin()) return "Игра завершилсь вашей победой";

            return `Игра завершилась победой ${winner}`;
        }

        if (youTurn) return 'Ваш ход';

        return 'Ход противника';
    }

    private renderButton(): JSX.Element {
        const {userType, gameState}: IGameField = this.props;

        if (gameState === GameState.PLAYING && userType !== UserType.VIEWER)
            return <LinkButton onClick={this.handleButtonClick} href='/'>Сдаться</LinkButton>;

        return <LinkButton href='/'>Вернуться</LinkButton>;
    }

    private getSVG(svgType: string): JSX.Element {
        if (svgType === 'x' || svgType === 'х')
            return <Svg isActive={this.props.userType === UserType.OWNER} name='cross'/>;

        return <Svg isActive={this.props.userType === UserType.OPPONENT} name='circle'/>;
    }

    private handleButtonClick(event: MouseEvent): void {
        event.preventDefault();

        this.props.surrenderHandler();
    }

    private getCells(acc: JSX.Element[], currRow: string, row: number): JSX.Element[] {
        const rowArray: string[] = currRow.split('');

        rowArray.forEach((currCell: string, column: number) => {
            currCell = currCell.toLowerCase();
            const key: number = (row * currRow.length) + column;
            const index: string = `${row}_${column}`;

            if (this.isNonEmptyCell(currCell)) {
                acc.push(<FieldCell key={key} index={index} svg={this.getSVG(currCell)}/>);

                return;
            }

            const clickHandler: ([row, column]: number[]) => void | null = this.provideClickHandler()
                ? this.props.turnHandler
                : null;

            acc.push(<FieldCell key={key} index={index} clickHandler={clickHandler}/>);
        });

        return acc;
    }

    private getFieldCells(): JSX.Element[] {
        return this.props.field.reduce(this.getCells, []);
    }
}

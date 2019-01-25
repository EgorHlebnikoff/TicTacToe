import * as React from 'react';
import getTime from '../../modules/date/DateModule';
import {LinkButton} from "../button/Button";
import FieldCell from "../fieldCell/FieldCell";
import {GameState, UserType} from '../GameScreen';
import Span from "../span/Span";
import Svg from "../svg/Svg";
import * as styled from "./styles";

interface IGameField {
    gameState: GameState;
    players: {
        owner: string;
        opponent: string;
    };
    field: string[];
    winner?: string;
    time: number;
    youTurn: boolean;
    userType: UserType;
    surrenderHandler?: () => void;
    turnHandler: ([row, column]: number[]) => void;
}

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

    private getAnnotation(): string {
        const {youTurn, gameState, userType, winner} = this.props;
        const {owner, opponent} = this.props.players;

        if (gameState === GameState.WAITING) return 'Ожидается оппонент';
        if (gameState === GameState.DRAW) return 'Игра завершилась ничьей';
        if (gameState === GameState.WON) {
            if ((userType === UserType.OWNER && winner === owner)
                || (userType === UserType.OPPONENT && winner === opponent)) return "Игра завершилсь вашей победой";

            return `Игра завершилась победой ${winner}`;
        }

        if (youTurn) return 'Ваш ход';

        return 'Ход противника';
    }

    private renderButton(): JSX.Element {
        const {userType, gameState} = this.props;
        if (gameState === GameState.DRAW || gameState === GameState.WON || userType === UserType.VIEWER)
            return <LinkButton href='/'>Вернуться</LinkButton>;

        return <LinkButton onClick={this.handleButtonClick} href='/'>Сдаться</LinkButton>;
    }

    private handleButtonClick(event: MouseEvent): void {
        console.log(1);

        event.preventDefault();

        this.props.surrenderHandler();
    }

    private getCells(acc: JSX.Element[], currRow: string, row: number): JSX.Element[] {
        currRow.split('').forEach((currCell: string, column: number) => {
            currCell = currCell.toLowerCase();
            const key: number = (row * currRow.length) + column;

            const provideClickHandler: () => boolean = (): boolean => this.props.youTurn
                && this.props.gameState === GameState.PLAYING;

            if (this.cellsTypes.every((item: string) => item !== currCell)) {
                acc.push(
                    <FieldCell
                        key={key}
                        index={`${row}_${column}`}
                        clickHandler={provideClickHandler() ? this.props.turnHandler : null}
                    />,
                );

                return;
            }

            const svg = currCell === 'x' || currCell === 'x'
                ? <Svg isActive={this.props.userType === UserType.OWNER} name='cross'/>
                : <Svg isActive={this.props.userType === UserType.OPPONENT} name='circle'/>;

            acc.push(<FieldCell key={key} index={`${row}_${column}`} svg={svg}/>);
        });

        return acc;
    }

    private getFieldCells(): JSX.Element[] {
        return this.props.field.reduce(this.getCells, []);
    }
}

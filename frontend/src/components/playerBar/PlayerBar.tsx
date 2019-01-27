import * as React from 'react';
import Section from '../section/Section';
import Svg from "../svg/Svg";
import {IPlayerBar, IPlayers, UserType} from "./PlayerBarTypes";
import * as styled from './styles';

export default class PlayerBar extends React.Component<IPlayerBar, {}> {
    private static getSVG(type: UserType, isActive: boolean): JSX.Element {
        const svg = type === UserType.OWNER
            ? <Svg isActive={isActive} name="cross"/>
            : <Svg isActive={isActive} name="circle"/>;

        return <styled.SVGContainer>{svg}</styled.SVGContainer>;
    }

    private readonly playerNamePlaceHolder: string = 'Ожидается...';

    public render(): JSX.Element {
        const {playerType}: { playerType: UserType } = this.props;

        return (
            <Section backgroundColor='#fafafa'>
                {this.renderOwner(playerType)}
                {this.renderOpponent(playerType)}
            </Section>
        );
    }

    private renderOwner(playerType: UserType): JSX.Element {
        const {owner}: IPlayers = this.props.players;

        return (
            <styled.PlayerContainer>
                <styled.Player>{owner}</styled.Player>
                {PlayerBar.getSVG(UserType.OWNER, playerType === UserType.OWNER)}
            </styled.PlayerContainer>
        );
    }

    private renderOpponent(playerType: UserType): JSX.Element {
        const {opponent}: IPlayers = this.props.players;
        const name: string = opponent && opponent !== '' ? opponent : this.playerNamePlaceHolder;

        const svg: JSX.Element = name !== this.playerNamePlaceHolder
            && PlayerBar.getSVG(UserType.OPPONENT, playerType === UserType.OPPONENT);

        return (
            <styled.PlayerContainer>
                {svg}
                <styled.Player>{name}</styled.Player>
            </styled.PlayerContainer>
        );
    }
}


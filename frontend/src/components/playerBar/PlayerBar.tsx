import * as React from 'react';
import Section from '../section/Section';
import Svg from "../svg/Svg";
import {IPlayerBar, IPlayers, UserType} from "./PlayerBarTypes";
import * as styled from './styles';

export default class PlayerBar extends React.Component<IPlayerBar, {}> {
    private static getSVG(type: UserType, currPlayerType: UserType): JSX.Element {
        const svg = type === UserType.OWNER
            ? <Svg isActive={currPlayerType === type} name="cross"/>
            : <Svg isActive={currPlayerType === type} name="circle"/>;

        return <styled.SVGContainer>{svg}</styled.SVGContainer>;
    }

    public render(): JSX.Element {
        const {owner, opponent}: IPlayers = this.props.players;
        
        return (
            <Section backgroundColor='#fafafa'>
                {this.renderPlayer(owner, UserType.OWNER)}
                {this.renderPlayer(opponent, UserType.OPPONENT)}
            </Section>
        );
    }

    private renderPlayer(name: string, type: UserType): JSX.Element {
        const getName: () => string = (): string => name && name !== '' ? name : 'Ожидается...';
        const {playerType}: { playerType: UserType } = this.props;

        return (
            <styled.PlayerContainer>
                {type === UserType.OPPONENT && PlayerBar.getSVG(type, playerType)}
                <styled.Player>{getName()}</styled.Player>
                {type === UserType.OWNER && PlayerBar.getSVG(type, playerType)}
            </styled.PlayerContainer>
        );
    }
}


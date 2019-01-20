import * as React from 'react';
import Section from '../section/Section';
import Svg from "../svg/Svg";
import * as styled from './styles';

enum PlayerType {OWNER = "OWNER", OPPONENT = "OPPONENT", NONE = "NONE"}

interface IPlayerBar {
    players?: {
        owner: string;
        opponent: string;
    };
}

export default class PlayerBar extends React.Component<IPlayerBar, {}> {
    private static renderPlayer(name: string, type: PlayerType): JSX.Element {
        return (
            <styled.PlayerContainer>
                {type === PlayerType.OPPONENT && PlayerBar.getSVG(type)}
                <styled.Player>{type !== PlayerType.NONE ? name : 'Ожидается...'}</styled.Player>
                {type === PlayerType.OWNER && PlayerBar.getSVG(type)}
            </styled.PlayerContainer>
        );
    }

    private static getSVG(type: PlayerType): JSX.Element {
        const svg = type === PlayerType.OWNER
            ? <Svg isActive={false} name="cross"/>
            : <Svg isActive={false} name="circle"/>;

        return <styled.SVGContainer>{svg}</styled.SVGContainer>;
    }

    public render(): JSX.Element {
        return (
            <Section backgroundColor='#fafafa'>
                {PlayerBar.renderPlayer('Andry', PlayerType.OWNER)}
                {PlayerBar.renderPlayer('Boris', PlayerType.OPPONENT)}
            </Section>
        );
    }
}


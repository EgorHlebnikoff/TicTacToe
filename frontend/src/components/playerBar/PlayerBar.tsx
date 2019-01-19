import * as React from 'react';
import Section from '../section/Section';
import * as styled from './styles';

interface IPlayerParams {
    isActive: boolean;
    name: string;
}

interface IPlayerBar {
    players?: {
        owner: IPlayerParams;
        opponent: IPlayerParams;
    };
}

export default class PlayerBar extends React.Component<IPlayerBar, {}> {
    private static renderPlayer(params: IPlayerParams, type: string): JSX.Element {
        return <styled.Player className={`${type} ${params.isActive ? 'active' : ''}`}>{params.name}</styled.Player>;
    }

    public render(): JSX.Element {
        return (
            <Section backgroundColor='#fafafa'>
                {PlayerBar.renderPlayer({name: 'Andry', isActive: true}, 'owner')}
                {PlayerBar.renderPlayer({name: 'Boris', isActive: false}, 'opponent')}
            </Section>
        );
    }
}


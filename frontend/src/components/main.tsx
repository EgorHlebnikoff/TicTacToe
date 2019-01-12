import * as React from 'react';

import styled from 'styled-components';

interface IMainProps {
    name: string;
}

const Block = styled('div')`
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Title = styled('h1')`
    font-size: 54px;
    color: blue;
`;

export default class Main extends React.Component<IMainProps, {}> {
    public render() {
        return (
            <Block>
                <Title>Hello, my name is {this.props.name}</Title>
            </Block>
        );
    }
}

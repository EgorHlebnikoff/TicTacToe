import * as React from 'react';
import * as styled from './styles';

interface IPreloader {
    isComplete?: boolean;
}

export default class Preloader extends React.Component<IPreloader, {}> {
    public render(): JSX.Element {
        const preloaderClassName: string = this.props.isComplete ? 'isComplete' : '';
        const checkmarkClassName: string = this.props.isComplete ? 'draw' : '';

        return (
            <styled.Preloader className={preloaderClassName}>
                <styled.PreloaderCheckmark className={checkmarkClassName}/>
            </styled.Preloader>
        );
    }
}

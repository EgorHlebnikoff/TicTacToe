import * as React from 'react';
import {IPreloader} from "./PreloaderTypes";
import * as styled from './styles';

export default class Preloader extends React.Component<IPreloader, {}> {
    public render(): JSX.Element {
        const preloaderClassName: string = this.props.isComplete ? 'isComplete' : '';
        const checkMarkClassName: string = this.props.isComplete ? 'draw' : '';

        return (
            <styled.Preloader className={preloaderClassName}>
                <styled.PreloaderCheckMark className={checkMarkClassName}/>
            </styled.Preloader>
        );
    }
}

import * as React from 'react';
import {ISvg} from "./SvgTypes";

export default class Svg extends React.Component<ISvg, {}> {
    public render(): JSX.Element {
        return this.getSVG();
    }

    /* tslint:disable */
    private crossSVG(): JSX.Element {
        return (
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 47.971 47.971'>
                <path
                    fill={this.props.isActive ? "#7966fd" : ''}
                    d="M28.228,23.986L47.092,5.122c1.172-1.171,1.172-3.071,0-4.242c-1.172-1.172-3.07-1.172-4.242,0L23.986,19.744L5.121,0.88 c-1.172-1.172-3.07-1.172-4.242,0c-1.172,1.171-1.172,3.071,0,4.242l18.865,18.864L0.879,42.85c-1.172,1.171-1.172,3.071,0,4.242 C1.465,47.677,2.233,47.97,3,47.97s1.535-0.293,2.121-0.879l18.865-18.864L42.85,47.091c0.586,0.586,1.354,0.879,2.121,0.879 s1.535-0.293,2.121-0.879c1.172-1.171,1.172-3.071,0-4.242L28.228,23.986z"
                />
            </svg>
        );
    }

    private circleSVG(): JSX.Element {
        return (
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
                <path
                    fill={this.props.isActive ? "#7966fd" : ''}
                    d="M256,0C114.509,0,0,114.497,0,256c0,141.491,114.497,256,256,256c141.491,0,256-114.497,256-256 C512,114.509,397.503,0,256,0z M256,477.867c-122.337,0-221.867-99.529-221.867-221.867S133.663,34.133,256,34.133 S477.867,133.663,477.867,256S378.337,477.867,256,477.867z"
                />
            </svg>
        );
    }
    /* tslint:enable */

    private getSVG(): JSX.Element {
        const svgName: string = this.props.name.toLowerCase();

        if (svgName === 'cross') return this.crossSVG();

        return this.circleSVG();
    }
}

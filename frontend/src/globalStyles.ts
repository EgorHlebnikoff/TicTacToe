import {ComponentType} from "react";
import {createGlobalStyle, DefaultTheme, GlobalStyleComponent, StyledComponent} from 'styled-components';

export type StyledElement = StyledComponent<any, any, {}, string | number | symbol>;
export type ElementToStyle = ComponentType | any;
export type StylingFunction = (item: ElementToStyle) => StyledElement;
export type GlobalStyledElement = GlobalStyleComponent<{}, DefaultTheme>;

const GlobalStyles: GlobalStyledElement = createGlobalStyle`
    * { 
        margin: 0; 
        padding: 0;
        box-sizing: border-box;
        
        &::after, &::before {
          box-sizing: border-box;
        }
    };
    
    body {
        background-color: #98176ade;
    }
`;

export default GlobalStyles;

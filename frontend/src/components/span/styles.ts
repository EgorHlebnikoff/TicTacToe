import styled from "styled-components";
import {ElementToStyle, StyledElement, StylingFunction} from "../../globalStyles";

const StyledSpan: StylingFunction = (span: ElementToStyle): StyledElement => styled(span)`
    color: #333;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 18px;
    
    display: block;
    padding: 5px;
    
    &.center {
      text-align: center;
    }
    
    &.white {
      color: #fafafa;
    }
`;

export default StyledSpan;

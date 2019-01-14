import styled from "styled-components";
import {ElementToStyle, StyledElement, StylingFunction} from "../../globalStyles";

export const Title: StyledElement = styled('h1')`
    font-size: 82px;
    color: #fedfed;
    font-weight: 600;
    font-family: 'Roboto', sans-serif;
    
    @media (max-width: 500px) {
        font-size: 40px;
    }
`;

export const Header: StylingFunction = (header: ElementToStyle): StyledElement => styled(header)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  padding: 20px;
`;

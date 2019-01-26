import styled from "styled-components";
import {ElementToStyle, StyledElement, StylingFunction} from "../../globalStyles";

export const Title: StyledElement = styled('h1')`
    font-size: 82px;
    font-weight: 700;
    font-family: 'Roboto', sans-serif;
    color: #fafafa;
    text-shadow: -1px -1px 1px rgba(255,255,255,.1), 1px 1px 1px rgba(0,0,0,.5), 3px 6px 10px rgba(238,238,238,0);
    
    & a {
      text-decoration: none;
      color: #fafafa;
       
      &:hover, &:focus, &:visited {
        color: #fafafa;
      }      
    }
    
    @media (max-width: 526px) {
        font-size: 54px;
    }
`;

export const Header: StylingFunction = (header: ElementToStyle): StyledElement => styled(header)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  padding: 20px;
`;

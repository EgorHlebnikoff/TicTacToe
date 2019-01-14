import styled from 'styled-components';
import {ElementToStyle, StyledElement, StylingFunction} from "../../globalStyles";

const Button: StylingFunction = (button: ElementToStyle): StyledElement => styled(button)`
  display: block;
  outline: none;
  
  border-radius: 4px;
  border: none;
  padding: 14px 40px;
  
  transition: background-color .2s ease-in-out, box-shadow .2s ease-in-out;
  
  background-color: #7966fd;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  
  font-weight: 700;
  font-size: 16px;
  font-family: "Roboto", sans-serif;
  color: #fafafa;
  
  &:hover, &:focus {
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    background-color: #5c4fe2;
  }
`;

export default Button;

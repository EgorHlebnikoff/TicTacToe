import styled from 'styled-components';
import {ElementToStyle, StyledElement, StylingFunction} from "../../globalStyles";

const Button: StylingFunction = (button: ElementToStyle): StyledElement => styled(button)`
  display: block;
  outline: none;
  
  border-radius: 4px;
  border: none;
  padding: 14px 40px;
  
  transition: background-color .2s ease-in-out, box-shadow .2s ease-in-out;
  
  background-color: darkgreen;
  box-shadow: 0 4px 8px 2px rgba(0,1,30,.18);
  
  font-weight: 700;
  font-size: 16px;
  font-family: "Roboto", sans-serif;
  color: #eee;
  
  &:hover, &:focus {
    cursor: pointer;
    box-shadow: none;
    background-color: darker(darkgreen, .05);
  }
`;

export default Button;

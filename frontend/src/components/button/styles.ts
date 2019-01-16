import styled from 'styled-components';
import {ElementToStyle, StyledElement, StylingFunction} from "../../globalStyles";

export const Button: StylingFunction = (button: ElementToStyle): StyledElement => styled(button)`
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

export const TransparentButton: StylingFunction = (button: ElementToStyle): StyledElement => styled(button).attrs(
    (props) => ({
        disabled: props.disabled || false,
    }),
)`
  display: block;
  outline: none;
  border: none;
  
  background-color: transparent;
  
  margin: 0 20px;
  
  transition: color .2s ease-in-out;
  
  font-weight: 700;
  font-size: 16px;
  font-family: "Roboto", sans-serif;
  color: #888;
  
  text-transform: uppercase;
  
  &:hover, &:focus {
    cursor: ${(props) => !props.disabled && 'pointer'};
    color: ${(props) => !props.disabled && '#333' || '#888'};
  }
  
  &.continue {
    color: #69e300;
    
    &:hover, &:focus {
      color: #57b600;
    }
  }
`;

export default Button;

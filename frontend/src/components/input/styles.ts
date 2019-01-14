import styled from 'styled-components';
import {ElementToStyle, StyledElement, StylingFunction} from "../../globalStyles";

const Input: StylingFunction = (input: ElementToStyle): StyledElement => styled(input)`
  width: 300px;
  padding: 10px 0 10px 20px;
  background-color: transparent;
  
  font-size: 18px;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  color: #fff;
  
  transition: border-bottom-color .2s ease-in-out;
  
  border: none;
  outline: none;
  border-bottom: 2px solid ${(props) => props.color === "NORMAL" ? "#eee" : 'red'};
  
  &:hover, &:focus {
    outline: none;
    border-bottom-color: cyan;
  }
  
  &::placeholder {
    color: #eee;
  }
`;

export default Input;

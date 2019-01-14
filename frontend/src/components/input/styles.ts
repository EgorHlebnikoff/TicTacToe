import styled from 'styled-components';
import {ElementToStyle, StyledElement, StylingFunction} from "../../globalStyles";

const Input: StylingFunction = (input: ElementToStyle): StyledElement => styled(input)`
  --non-hover-color: ${(props) => props.color === "NORMAL" ? "#7966fd" : '#f75757'};
  --hover-color: ${(props) => props.color === "NORMAL" ? "#5c4fe2" : '#f75757'};

  width: 300px;
  padding: 10px 0 10px 20px;
  background-color: transparent;
  
  font-size: 18px;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  color: #7966fd;
  
  transition: border-bottom-color .2s ease-in-out, color .2s ease-in-out;
  
  border: none;
  outline: none;
  border-bottom: 2px solid var(--non-hover-color);
  
  &:hover, &:focus {
    outline: none;
    border-bottom-color: var(--hover-color);
    
    color: #5c4fe2;
    
    &::placeholder {
      color: var(--hover-color);
    }
  }
  
  &::placeholder {
    transition: color .2s ease-in-out;
    color: var(--non-hover-color);
  }
  
  @media (max-width: 526px) {
    padding-left: 0;
    text-align: center;
  }
`;

export default Input;

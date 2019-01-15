import styled from 'styled-components';
import {ElementToStyle, StyledElement, StylingFunction} from "../../globalStyles";

const Container: StylingFunction = (container: ElementToStyle): StyledElement => styled(container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  width: 100%;
  
  padding-bottom: 20px;
`;



export default Container;

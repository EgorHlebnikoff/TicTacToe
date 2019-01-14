import styled from 'styled-components';
import {ElementToStyle, StyledElement, StylingFunction} from "../../globalStyles";

const Container: StylingFunction = (container: ElementToStyle): StyledElement => styled(container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  
  position: relative;
`;

export default Container;

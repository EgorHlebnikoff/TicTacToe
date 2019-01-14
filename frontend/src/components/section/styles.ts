import styled from 'styled-components';
import {ElementToStyle, StyledElement, StylingFunction} from "../../globalStyles";

const Section: StylingFunction = (section: ElementToStyle): StyledElement => styled(section)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  
  width: 75%;
  margin: 0 auto 40px auto;
`;

export default Section;

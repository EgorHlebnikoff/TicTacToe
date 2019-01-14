import styled from 'styled-components';
import {ElementToStyle, StyledElement, StylingFunction} from "../../globalStyles";

const Section: StylingFunction = (section: ElementToStyle): StyledElement => styled(section).attrs(
    (props) => ({
        style: {
            backgroundColor: props.backgroundColor || 'transparent',
        },
    }),
)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  
  min-height: 150px;
  width: 100%;
  
  position: relative;
  margin: 0 0 40px 0;
  
  @media (max-width: 526px) {
    flex-direction: column;
  }
`;

export default Section;

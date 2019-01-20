import styled from "styled-components";
import {ElementToStyle, StyledElement, StylingFunction} from "../../globalStyles";

export const FieldCell: StylingFunction = (item: ElementToStyle): StyledElement => styled(item)`
  width: 200px;
  height: 200px;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  background-color: #fafafa;
`;

export const SVGContainer: StyledElement = styled('div')`
  height: 190px;
  width: 190px;
`;

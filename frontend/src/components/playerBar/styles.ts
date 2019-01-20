import styled from "styled-components";
import {StyledElement} from "../../globalStyles";

export const SVGContainer: StyledElement = styled('div')`
  height: 40px;
  width: 40px;
`;

export const Player: StyledElement = styled('h2')`
  font-family: "Roboto", sans-serif;
  font-size: 40px;
  font-weight: 700;
  color: #7966fd;
`;

export const PlayerContainer: StyledElement = styled('div')`
  display: flex;
  align-items: center;
  
  padding-bottom: 10px;
  border-bottom: 2px solid #7966fd;
  
  &:first-child {
    justify-content: flex-start;
    
    h2 {
      margin-right: 15px;
    }
  }
  
  &:last-child {
    justify-content: flex-end;
    
    h2 {
      margin-left: 15px;
    }
  }
`;

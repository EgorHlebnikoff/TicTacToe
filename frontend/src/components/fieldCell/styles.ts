import styled from "styled-components";
import {ElementToStyle, StyledElement, StylingFunction} from "../../globalStyles";

export const FieldCell: StylingFunction = (item: ElementToStyle): StyledElement => styled(item)`
  --size: 200px;

  width: var(--size);
  height: var(--size);
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  background-color: #fafafa;
  
  &:hover {
    cursor: pointer;
  }
  &.active:hover {
    cursor: default;
  }
  
  @media (max-width: 1180px) {
    --size: 180px;
  }
  
  @media (max-width: 1060px) {
    --size: 160px;
  }
  
  @media (max-width: 950px) {
    --size: 140px;
  }
  
  @media (max-width: 840px) {
    --size: 120px;
  }
  
  @media (max-width: 730px) {
    --size: 100px;
  }
  
  @media (max-width: 630px) {
    --size: 80px;
  }
  
  @media (max-width: 420px) {
    --size: 60px;
  }
`;

export const SVGContainer: StyledElement = styled('div')`
  --size: 190px;

  height: var(--size);
  width: var(--size);
  
  @media (max-width: 1180px) {
    --size: 170px;
  }
  
  @media (max-width: 1060px) {
    --size: 150px;
  }
  
  @media (max-width: 950px) {
    --size: 130px;
  }
  
  @media (max-width: 840px) {
    --size: 110px;
  }
  
  @media (max-width: 730px) {
    --size: 90px;
  }
  
  @media (max-width: 630px) {
    --size: 70px;
  }
  
  @media (max-width: 420px) {
    --size: 50px;
  }
`;

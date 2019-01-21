import styled from 'styled-components';
import {ElementToStyle, StyledElement, StylingFunction} from "../../globalStyles";

export const StyledGamesList: StylingFunction = (item: ElementToStyle): StyledElement => styled(item)`
  --item-width: 200px;
  --grid-columns: 6;
  --grid-gap-size: 20px;
  
  --items-width-sum: calc(var(--item-width) * var(--grid-columns));
  --indents-sum: calc(var(--grid-gap-size) * (var(--grid-columns) - 1));
  --container-width: calc(var(--items-width-sum) + var(--indents-sum));

  display: grid;
  grid-gap: var(--grid-gap-size);
  grid-template-columns: repeat(var(--grid-columns), 1fr);
  width: var(--container-width);
  
  @media (max-width: 1320px) {
    --grid-columns: 5;
  }
  
  @media (max-width: 1105px) {
    --grid-columns: 4;
  }
  
  @media (max-width: 890px) {
    --grid-columns: 3;
  }
  
  @media (max-width: 675px) {
    --grid-columns: 2;
  }
  
  @media (max-width: 460px) {
    --grid-columns: 1;
  }
`;

export const PreloaderContainer: StyledElement = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-height: 1px;
  visibility: hidden;
  
  transition: max-height .2s linear;
  
  &.opened {
    max-height: 300px;
    visibility: visible;
  }
`;

export default StyledGamesList;
